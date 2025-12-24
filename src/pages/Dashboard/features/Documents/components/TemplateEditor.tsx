import React, { useState } from 'react';
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
    'Emergency Contact Email': 'Emergency Contact Email: __________',
    'Daily Rent Late Fees': 'Daily Rent Late Fees: ₹_____ per day',
    'Electricity Provider': 'Electricity Provider: __________',
    'Gas Provider': 'Gas Provider: __________',
    'Holding Deposit': 'Holding Deposit: ₹__________',
    'Internet Provider': 'Internet Provider: __________',
    'Landlord Utilities': 'Landlord Utilities: __________',
    'Lease Number': 'Lease No: __________',
    'Lease Start Date': 'Lease Start Date: __ / __ / ____',
    'List of Equipment': 'List of Equipment: __________',
    'Number of Baths': 'Number of Baths: __________',
    'Pet Charge': 'Pet Charge: ₹__________',
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
    const [, setEditor] = useState(null);

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
                // Create the autoFill node
                const node = schema.nodes.autoFill.create({ label: displayContent });

                // If document is empty, wrap in a paragraph
                const isEmptyDoc = view.state.doc.content.size === 0;
                const isSingleEmptyChild =
                    view.state.doc.childCount === 1 &&
                    (view.state.doc.firstChild?.content.size ?? 0) === 0;

                if (isEmptyDoc || isSingleEmptyChild) {
                    const paragraph = schema.nodes.paragraph.create(null, node);
                    view.dispatch(tr.replaceWith(0, view.state.doc.content.size, paragraph));
                } else {
                    // Check if we are at a valid position for an inline node (inside a block)
                    const $pos = view.state.doc.resolve(pos);
                    if ($pos.parent.type.name === 'paragraph' || $pos.parent.type.isBlock) {
                        view.dispatch(tr.insert(pos, node));
                    } else {
                        // Fallback: create a paragraph if needed
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
            <div className="bg-white rounded-[1rem] shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-0 overflow-hidden mb-12">
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
                                className="px-8 py-2.5 rounded-lg text-sm font-bold shadow-md transform-none"
                            />
                        </div>
                    )}
                </div>
            </div>

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
