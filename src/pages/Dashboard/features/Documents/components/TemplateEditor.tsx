import React, { useState } from 'react';
import { X, Printer } from 'lucide-react';
import type { EditorView } from '@tiptap/pm/view';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';
import TiptapEditor from '../../../../../components/common/Editor/TiptapEditor';

interface TemplateEditorProps {
    initialEditorContent?: string;
    onEditorContentChange?: (content: string) => void;
    showPreviewButton?: boolean;
    showSignatureSection?: boolean;
}

const AUTO_FILL_MAPPINGS: Record<string, string> = {
    'Emergency Contact Email': 'Emergency Contact Email',
    'Daily Rent Late Fees': 'Daily Rent Late Fees',
    'Electricity Provider': 'Electricity Provider',
    'Gas Provider': 'Gas Provider',
    'Holding Deposit': 'Holding Deposit',
    'Internet Provider': 'Internet Provider',
    'Landlord Utilities': 'Landlord Utilities',
    'Lease Number': 'Lease No',
    'Lease Start Date': 'Lease Start Date',
    'List of Equipment': 'List of Equipment',
    'Number of Baths': 'Number of Baths',
    'Pet Charge': 'Pet Charge',
};

const TemplateEditor: React.FC<TemplateEditorProps> = ({
    initialEditorContent = '',
    onEditorContentChange,
    showPreviewButton = false,
    showSignatureSection = false,
}) => {
    const [activeTab, setActiveTab] = useState<'fields' | 'autoFill'>('fields');
    const [editorContent, setEditorContent] = useState(initialEditorContent);
    const [isDefaultSignature, setIsDefaultSignature] = useState(true);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [, setEditor] = useState(null);

    const handlePrint = () => {
        const printContent = document.getElementById('preview-content-area');
        if (!printContent) return;

        // Create a hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) return;

        doc.write(`
            <html>
                <head>
                    <title>Document Preview</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
                        body { 
                            font-family: 'Outfit', sans-serif; 
                            padding: 40px; 
                            color: #374151;
                        }
                        .preview-content { 
                            max-width: 800px; 
                            margin: 0 auto; 
                            line-height: 1.6; 
                        }
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
                        h1, h2, h3 { color: #111827; }
                        p { margin-bottom: 1em; }
                    </style>
                </head>
                <body>
                    <div class="preview-content">
                        ${printContent.innerHTML}
                    </div>
                </body>
            </html>
        `);
        doc.close();

        // Wait for styles and fonts to load before printing
        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            // Cleanup: remove the iframe after a short delay
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 500);
    };

    const handleEditorChange = (content: string) => {
        setEditorContent(content);
        if (onEditorContentChange) {
            onEditorContentChange(content);
        }
    };

    const handleDragStart = (e: React.DragEvent, label: string, isAutoFill: boolean = false) => {
        const dragData = JSON.stringify({ label, isAutoFill });
        e.dataTransfer.setData('application/x-pms-autofill', dragData);
        e.dataTransfer.setData('text/plain', label);
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleEditorDrop = (view: EditorView, event: DragEvent) => {
        event.preventDefault();

        const dataTransfer = event.dataTransfer;
        if (!dataTransfer) {
            return false;
        }

        let dragData;
        try {
            const rawData = dataTransfer.getData('application/x-pms-autofill');
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
            const displayContent = AUTO_FILL_MAPPINGS[label] || label;

            const { schema, tr } = view.state;

            if (isAutoFill) {
                // Determine the correct node type name (fallback to 'autoFill' if 'autoFillNode' is missing)
                const nodeType = schema.nodes.autoFillNode || schema.nodes.autoFill;

                if (!nodeType) {
                    console.error('Tiptap Error: autoFillNode not found in schema');
                    return false;
                }

                // Create the autoFill node
                const node = nodeType.create({ label: displayContent });

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
        <div className="bg-[#F0F0F6] rounded-[1.5rem] p-8 mb-10 shadow-[0px_2px_4px_0px_#17151540,inset_0px_-1.42px_5.69px_0px_#E4E3E4]">
            <div className="mb-10">
                <TiptapEditor
                    content={editorContent}
                    onChange={handleEditorChange}
                    placeholder="Type template content here..."
                    onDropHandler={handleEditorDrop}
                    onEditorReady={setEditor}
                />
            </div>

            {/* Fields Section Card */}
            <div className="bg-white  rounded-[1rem] shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-0 overflow-hidden mb-12">
                {/* Tabs */}
                <div className="flex items-center gap-2 px-10 pt-5" style={{ borderBottom: '0.5px solid #201F23' }}>
                    <button
                        onClick={() => setActiveTab('fields')}
                        className={`${activeTab === 'fields' ? 'bg-[#88D94C] text-white shadow-sm' : 'text-gray-400'} px-10 py-3 rounded-t-2xl font-bold text-lg relative z-10 transition-all`}
                    >
                        Fields
                    </button>
                    <button
                        onClick={() => setActiveTab('autoFill')}
                        className={`${activeTab === 'autoFill' ? 'bg-[#88D94C] text-white shadow-sm' : 'text-gray-400'} px-10 py-3 rounded-t-2xl font-bold text-lg relative z-10 transition-all`}
                    >
                        Auto Fill Elements
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-10">
                    {activeTab === 'fields' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Signature */}
                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, 'Signature')}
                                className="bg-[#88D94C] p-4 rounded-2xl text-white shadow-[0px_4px_4px_0px_#00000040] cursor-grab active:cursor-grabbing hover:opacity-95 transition-all"
                            >
                                <h3 className="font-extrabold text-lg mb-1 ">Signature</h3>
                                <p className="text-[11px] opacity-90 leading-tight font-medium">Basic Residential Lease Agreement</p>
                            </div>
                            {/* Initials */}
                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, 'Initials')}
                                className="bg-[#88D94C] p-4 rounded-2xl text-white shadow-[0px_4px_4px_0px_#00000040] cursor-grab active:cursor-grabbing hover:opacity-95 transition-all"
                            >
                                <h3 className="font-extrabold text-lg mb-1">Initials</h3>
                                <p className="text-[11px] opacity-90 leading-tight font-medium">Require initials on clauses you want</p>
                            </div>
                            {/* Date Signed */}
                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, 'Date Signed')}
                                className="bg-[#88D94C] p-4 rounded-2xl text-white shadow-[0px_4px_4px_0px_#00000040] cursor-grab active:cursor-grabbing hover:opacity-95 transition-all"
                            >
                                <h3 className="font-extrabold text-lg mb-1">Date Signed</h3>
                                <p className="text-[11px] opacity-90 leading-tight font-medium">Date of the document signed</p>
                            </div>
                            {/* Textbox */}
                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, 'Textbox')}
                                className="bg-[#88D94C] p-4 rounded-2xl text-white shadow-[0px_4px_4px_0px_#00000040] cursor-grab active:cursor-grabbing hover:opacity-95 transition-all"
                            >
                                <h3 className="font-extrabold text-lg mb-1">Textbox</h3>
                                <p className="text-[11px] opacity-90 leading-tight font-medium">Add and require additional information</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-6 mb-8 mt-2">
                            {[
                                'Emergency Contact Email', 'Daily Rent Late Fees', 'Electricity Provider',
                                'Gas Provider', 'Holding Deposit', 'Internet Provider',
                                'Landlord Utilities', 'Lease Number', 'Lease Start Date',
                                'List of Equipment', 'Number of Baths', 'Pet Charge'
                            ].map((label) => (
                                <div
                                    key={label}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, label, true)}
                                    className="bg-[#88D94C] text-white px-6 py-3 rounded-2xl text-[11px] font-bold text-center shadow-[0px_4px_4px_0px_#00000040] cursor-grab active:cursor-grabbing hover:opacity-95 transition-all whitespace-nowrap min-w-[140px]"
                                >
                                    {label}
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
            {isPreviewModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 animate-in fade-in duration-200 print:hidden">
                    <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] shadow-2xl mx-4 flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Preview Header */}
                        <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
                            <h2 className="text-white text-lg font-semibold">Document Preview</h2>
                            <button
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="hover:bg-white/10 p-2 rounded-full transition-colors"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        {/* Preview Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                            <div
                                id="preview-content-area"
                                className="max-w-4xl mx-auto bg-white p-12 rounded-lg shadow-sm prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none"
                                dangerouslySetInnerHTML={{ __html: editorContent }}
                            />
                        </div>

                        {/* Preview Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl flex-shrink-0">
                            <button
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                Close
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-6 py-2.5 bg-[#3A6D6C] text-white rounded-lg hover:bg-[#2d5650] transition-colors font-medium flex items-center gap-2"
                            >
                                <Printer size={18} />
                                Print Document
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Define Signature Section */}
            {
                showSignatureSection && (
                    <div className="px-2 mb-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Default Signatures</h2>
                        <p className="text-gray-500 text-sm mb-6 max-w-2xl leading-relaxed">
                            It will automatically add signatures and assign to your tenant at the bottom of this notice.
                        </p>

                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isDefaultSignature}
                                    onChange={() => setIsDefaultSignature(!isDefaultSignature)}
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-[#88D94C]"></div>
                            </label>
                            <span className="text-sm font-normal text-gray-900">Default Signatures</span>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default TemplateEditor;
