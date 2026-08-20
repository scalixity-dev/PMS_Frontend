import React, { useState, useRef } from 'react';
import type { EditorView } from '@tiptap/pm/view';
import type { Editor } from '@tiptap/react';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';
import TiptapEditor from '../../../../../components/common/Editor/TiptapEditor';
import DocumentPreviewModal from './DocumentPreviewModal';
import { handleDocumentPrint } from '../utils/printPreviewUtils';
import { AUTO_FILL_FIELDS, tokenForLabel, type AutoFillField } from '../autoFillFields';
import {
    SIGNATURE_FIELDS,
    signatureAnchor,
    signatureLabel,
    type SignatureKind,
    type SignatureParty,
} from '../signatureFields';

interface TemplateEditorProps {
    initialEditorContent?: string;
    onEditorContentChange?: (content: string) => void;
    showPreviewButton?: boolean;
    showSignatureSection?: boolean;
    previewValues?: Record<string, string>;
    isDefaultSignature?: boolean;
    onSignatureToggle?: (enabled: boolean) => void;
    /** Rendered directly below the "Add landlord + tenant signature block" toggle (e.g. a "Sign as Landlord" action). */
    signatureActionsSlot?: React.ReactNode;
}

/** Chips grouped for the panel, in catalogue order. */
const AUTO_FILL_GROUPS = AUTO_FILL_FIELDS.reduce<Record<string, AutoFillField[]>>(
    (acc, field) => {
        (acc[field.group] ??= []).push(field);
        return acc;
    },
    {},
);

const TemplateEditor: React.FC<TemplateEditorProps> = ({
    initialEditorContent = '',
    onEditorContentChange,
    showPreviewButton = false,
    showSignatureSection = false,
    previewValues = {},
    isDefaultSignature: isDefaultSignatureProp,
    onSignatureToggle,
    signatureActionsSlot,
}) => {
    const [activeTab, setActiveTab] = useState<'fields' | 'autoFill'>('fields');
    // Which signature field is waiting for the author to say whose it is.
    const [pendingSignature, setPendingSignature] = useState<SignatureKind | null>(null);
    const [editorContent, setEditorContent] = useState(initialEditorContent);
    const [localDefaultSignature, setLocalDefaultSignature] = useState(true);
    const isDefaultSignature = isDefaultSignatureProp !== undefined ? isDefaultSignatureProp : localDefaultSignature;

    const handleSignatureToggle = () => {
        const next = !isDefaultSignature;
        setLocalDefaultSignature(next);
        if (onSignatureToggle) onSignatureToggle(next);
    };

    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    // The editor instance was previously captured into state and discarded, so
    // nothing outside the drop handler could insert into the document.
    const editorRef = useRef<Editor | null>(null);
    const autoScrollRef = useRef<number | null>(null);
    const pointerYRef = useRef<number | null>(null);
    const previewContentRef = useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        setEditorContent(initialEditorContent);
    }, [initialEditorContent]);

    const buildPreviewContent = (): string => {
        let content = editorContent;
        for (const [key, value] of Object.entries(previewValues)) {
            if (value) {
                content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
            }
        }
        // No signature block here — signing happens entirely on DocuSign after
        // sending, so this preview has no real signature data to show.
        return content;
    };

    const handlePrint = () => {
        if (previewContentRef.current) {
            handleDocumentPrint(previewContentRef, {
                title: 'Document Preview',
                customStyles: `
                    .auto-fill-pill {
                        background-color: #88D94C;
                        border-radius: 9999px;
                        padding: 4px 14px;
                        margin: 0 4px;
                        font-weight: 700;
                        color: white;
                        display: inline-flex;
                        vertical-align: middle;
                        -webkit-print-color-adjust: exact;
                    }
                `
            });
        }
    };

    const handleEditorChange = (content: string) => {
        setEditorContent(content);
        if (onEditorContentChange) {
            onEditorContentChange(content);
        }
    };

    const handleDragStart = (e: React.DragEvent, label: string, isAutoFill: boolean = false) => {
        const dragData = JSON.stringify({ label, isAutoFill });
        e.dataTransfer.setData('application/x-SmartTenantAI-autofill', dragData);
        e.dataTransfer.setData('text/plain', label);
        // effectAllowed is the one that belongs on dragstart; dropEffect here is
        // ignored, which is why the drag used to show a "no drop" cursor.
        e.dataTransfer.effectAllowed = 'copy';
        startEdgeAutoScroll();
    };

    /**
     * Scroll the page while a chip is held near the top or bottom edge.
     *
     * The chip panel sits below the editor, far enough that on a 720px-tall
     * window the editor is off screen once the chips are in view. HTML5 drag
     * does not scroll the page, so there was no way to drag a chip up into the
     * editor at all.
     */
    const startEdgeAutoScroll = () => {
        if (autoScrollRef.current !== null) return;

        const EDGE = 120;   // px from the edge that triggers a scroll
        const SPEED = 18;   // px per frame

        const step = () => {
            const y = pointerYRef.current;
            if (y !== null) {
                if (y < EDGE) window.scrollBy(0, -SPEED);
                else if (y > window.innerHeight - EDGE) window.scrollBy(0, SPEED);
            }
            autoScrollRef.current = requestAnimationFrame(step);
        };
        autoScrollRef.current = requestAnimationFrame(step);
    };

    const stopEdgeAutoScroll = () => {
        if (autoScrollRef.current !== null) {
            cancelAnimationFrame(autoScrollRef.current);
            autoScrollRef.current = null;
        }
        pointerYRef.current = null;
    };

    React.useEffect(() => {
        const onDragOver = (e: DragEvent) => { pointerYRef.current = e.clientY; };
        document.addEventListener('dragover', onDragOver);
        document.addEventListener('drop', stopEdgeAutoScroll);
        document.addEventListener('dragend', stopEdgeAutoScroll);
        return () => {
            document.removeEventListener('dragover', onDragOver);
            document.removeEventListener('drop', stopEdgeAutoScroll);
            document.removeEventListener('dragend', stopEdgeAutoScroll);
            stopEdgeAutoScroll();
        };
    }, []);

    /**
     * Insert without dragging.
     *
     * Dragging across a scrolling page is fiddly at the best of times, so a
     * click drops the element at the cursor instead. This is the path that
     * always works, whatever the window height.
     */
    const insertSignature = (kind: SignatureKind, party: SignatureParty) => {
        const ed = editorRef.current;
        setPendingSignature(null);
        if (!ed) return;

        ed.chain()
            .focus()
            .insertSignatureField(signatureLabel(kind, party), signatureAnchor(kind, party))
            .run();
    };

    const insertAtCursor = (label: string, isAutoFill: boolean) => {
        const ed = editorRef.current;
        if (!ed) return;

        if (isAutoFill) {
            ed.chain().focus().insertAutoFillNode(label, tokenForLabel(label)).run();
        } else {
            ed.chain().focus().insertContent(` [${label}] `).run();
        }
    };

    const handleEditorDrop = (view: EditorView, event: DragEvent) => {
        event.preventDefault();

        const dataTransfer = event.dataTransfer;
        if (!dataTransfer) {
            return false;
        }

        let dragData;
        try {
            const rawData = dataTransfer.getData('application/x-SmartTenantAI-autofill');
            if (rawData) {
                dragData = JSON.parse(rawData);
            } else {
                // Fallback for fields
                const label = dataTransfer.getData('label') || dataTransfer.getData('text/plain');
                if (label) {
                    dragData = { label, isAutoFill: false };
                }
            }
        } catch {
            return false;
        }

        if (dragData && dragData.label) {
            const { label, isAutoFill } = dragData;
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            const pos = coordinates ? coordinates.pos : view.state.selection.$from.pos;
            const token = tokenForLabel(label) ?? '';

            const { schema, tr } = view.state;

            if (isAutoFill) {
                // Determine the correct node type name (fallback to 'autoFill' if 'autoFillNode' is missing)
                const nodeType = schema.nodes.autoFillNode || schema.nodes.autoFill;

                if (!nodeType) {
                    console.error('Tiptap Error: autoFillNode not found in schema');
                    return false;
                }

                // Create the autoFill node
                const node = nodeType.create({ label, token });

                // If document is empty, wrap in a paragraph
                const isEmptyDoc = view.state.doc.content.size <= 2; // ProseMirror empty doc size is usually 2 (empty paragraph)
                const isSingleEmptyChild =
                    view.state.doc.childCount === 1 &&
                    (view.state.doc.firstChild?.content.size ?? 0) === 0;

                if (isEmptyDoc || isSingleEmptyChild) {
                    const paragraph = schema.nodes.paragraph.create(null, node);
                    view.dispatch(tr.replaceWith(0, view.state.doc.content.size, paragraph));
                } else {
                    // Check if we can insert at the resolved position
                    const $pos = view.state.doc.resolve(pos);
                    // If we are inside a paragraph or similar block, insert directly
                    if ($pos.parent.type.name === 'paragraph' || $pos.parent.type.inlineContent) {
                        view.dispatch(tr.insert(pos, node));
                    } else {
                        // Otherwise, create a paragraph to hold the inline node
                        const paragraph = schema.nodes.paragraph.create(null, node);
                        view.dispatch(tr.insert(pos, paragraph));
                    }
                }
                return true;
            } else {
                // Default field behavior (plain text)
                const text = ` [${label}] `;
                view.dispatch(tr.insertText(text, pos));
                return true;
            }
        }
        return false;
    };

    return (
        <div className="bg-[#F0F0F6] rounded-[1.5rem] p-4 md:p-8 mb-10 shadow-[0px_2px_4px_0px_#17151540,inset_0px_-1.42px_5.69px_0px_#E4E3E4]">
            <div className="mb-6 md:mb-10">
                <TiptapEditor
                    content={editorContent}
                    onChange={handleEditorChange}
                    placeholder="Type template content here..."
                    onDropHandler={handleEditorDrop}
                    onEditorReady={(ed: Editor) => { editorRef.current = ed; }}
                />
            </div>

            {/* Signature Block Preview — shown in editor when toggle is ON */}
            {isDefaultSignature && (
                <div className="mb-6 md:mb-10 bg-white rounded-xl border border-dashed border-[#88D94C] p-6">
                    <p className="text-xs font-semibold text-[#88D94C] uppercase tracking-wider mb-4">Default Signature Block (auto-appended to document)</p>
                    <div className="flex flex-col sm:flex-row gap-8">
                        <div className="flex-1">
                            <div className="h-10 border-b-2 border-gray-400 mb-2"></div>
                            <p className="text-xs font-semibold text-gray-600">Landlord Signature</p>
                            <p className="text-xs text-gray-400 mt-1">Date: _______________</p>
                        </div>
                        <div className="flex-1">
                            <div className="h-10 border-b-2 border-gray-400 mb-2"></div>
                            <p className="text-xs font-semibold text-gray-600">Tenant Signature</p>
                            <p className="text-xs text-gray-400 mt-1">Date: _______________</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Fields Section Card */}
            <div className="bg-white rounded-[1rem] shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-0 overflow-hidden mb-8 md:mb-12">
                {/* Tabs */}
                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-10 pt-3 md:pt-5 overflow-x-auto" style={{ borderBottom: '0.5px solid #201F23' }}>
                    <button
                        onClick={() => setActiveTab('fields')}
                        className={`${activeTab === 'fields' ? 'bg-[#88D94C] text-white shadow-sm' : 'text-gray-400'} px-4 md:px-10 py-2 md:py-3 rounded-t-xl md:rounded-t-2xl font-bold text-sm md:text-lg relative z-10 transition-all whitespace-nowrap`}
                    >
                        Fields
                    </button>
                    <button
                        onClick={() => setActiveTab('autoFill')}
                        className={`${activeTab === 'autoFill' ? 'bg-[#88D94C] text-white shadow-sm' : 'text-gray-400'} px-4 md:px-10 py-2 md:py-3 rounded-t-xl md:rounded-t-2xl font-bold text-sm md:text-lg relative z-10 transition-all whitespace-nowrap`}
                    >
                        Auto Fill Elements
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-4 md:p-10">
                    {activeTab === 'fields' ? (
                        <div className="mb-8">
                            <p className="text-xs text-gray-500 mb-5">
                                Signature fields belong to one party. Pick a field and choose whose it is,
                                and DocuSign places their box exactly there.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {SIGNATURE_FIELDS.map((field) => (
                                    <div key={field.kind} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setPendingSignature(pendingSignature === field.kind ? null : field.kind)}
                                            className="w-full text-left bg-[#88D94C] p-4 rounded-2xl text-white shadow-[0px_4px_4px_0px_#00000040] hover:opacity-95 transition-all"
                                        >
                                            <h3 className="font-extrabold text-lg mb-1">{field.label}</h3>
                                            <p className="text-[11px] opacity-90 leading-tight font-medium">{field.description}</p>
                                        </button>

                                        {pendingSignature === field.kind && (
                                            <div className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3">
                                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Whose {field.label.toLowerCase()}?</p>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => insertSignature(field.kind, 'landlord')}
                                                        className="px-3 py-2 rounded-lg bg-[#3D7475] text-white text-sm font-bold hover:bg-[#2c5251] transition-colors"
                                                    >
                                                        Landlord (you)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertSignature(field.kind, 'tenant')}
                                                        className="px-3 py-2 rounded-lg bg-[#88D94C] text-white text-sm font-bold hover:opacity-90 transition-colors"
                                                    >
                                                        Tenant
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, 'Textbox')}
                                    onDragEnd={stopEdgeAutoScroll}
                                    onClick={() => insertAtCursor('Textbox', false)}
                                    className="bg-[#88D94C] p-4 rounded-2xl text-white shadow-[0px_4px_4px_0px_#00000040] cursor-grab active:cursor-grabbing hover:opacity-95 transition-all"
                                >
                                    <h3 className="font-extrabold text-lg mb-1">Textbox</h3>
                                    <p className="text-[11px] opacity-90 leading-tight font-medium">Add and require additional information</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 mt-2">
                            <p className="text-xs text-gray-500 mb-5">
                                Click an element to drop it where your cursor is, or drag it into the document.
                                A dot means the value is filled in from the lease automatically.
                            </p>
                            {Object.entries(AUTO_FILL_GROUPS).map(([group, fields]) => (
                                <div key={group} className="mb-6 last:mb-0">
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">{group}</h4>
                                    <div className="flex flex-wrap gap-x-3 gap-y-3">
                                        {fields.map((field) => (
                                            <button
                                                key={field.label}
                                                type="button"
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, field.label, true)}
                                                onDragEnd={stopEdgeAutoScroll}
                                                onClick={() => insertAtCursor(field.label, true)}
                                                title={`${field.description}${field.resolvedFromLease ? ' Filled from the lease.' : ' You will be asked for this value.'}`}
                                                className="bg-[#88D94C] text-white px-5 py-2.5 rounded-2xl text-[11px] font-bold text-center shadow-[0px_4px_4px_0px_#00000040] cursor-grab active:cursor-grabbing hover:opacity-95 transition-all whitespace-nowrap inline-flex items-center gap-2"
                                            >
                                                {field.resolvedFromLease && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/90" aria-hidden="true" />
                                                )}
                                                {field.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Preview Button */}
                    {showPreviewButton && (
                        <div className="flex justify-end">
                            <PrimaryActionButton
                                text="Preview"
                                onClick={() => setIsPreviewModalOpen(true)}
                                className="px-8 py-2.5 rounded-lg text-sm font-bold shadow-md transform-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            <DocumentPreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                title="Document Preview"
                htmlContent={buildPreviewContent()}
                customPrintHandler={handlePrint}
            />

            {/* Define Signature Section */}
            {showSignatureSection && (
                <div className="px-2 mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Default Signatures</h2>
                    <p className="text-gray-500 text-sm mb-6 max-w-2xl leading-relaxed">
                        Adds a signature block to the bottom of this document. Once sent, you'll sign first via DocuSign,
                        then your tenant will be notified to sign.
                    </p>

                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isDefaultSignature}
                                onChange={handleSignatureToggle}
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-[#88D94C]"></div>
                        </label>
                        <span className="text-sm font-normal text-gray-900">Add landlord + tenant signature block</span>
                    </div>

                    {isDefaultSignature && signatureActionsSlot && (
                        <div className="mt-5">{signatureActionsSlot}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TemplateEditor;
