import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, Paperclip } from 'lucide-react';

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (note: string, file?: File | null) => void;
    initialNote?: string;
    initialFile?: string | null;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, onConfirm, initialNote = '', initialFile = null }) => {
    const [note, setNote] = useState(initialNote);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingFileUrl, setExistingFileUrl] = useState<string | null>(initialFile);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isOpen) {
            setNote(initialNote);
            setExistingFileUrl(initialFile);
            setSelectedFile(null);
        }
    }, [isOpen, initialNote, initialFile]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40  animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden mx-4">
                {/* Header */}
                <div className="bg-[#3E706F] px-6 py-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-xl font-bold">Note</span>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 bg-[#F8FAFC]">
                    <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm min-h-[300px] flex flex-col">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add some details*"
                            className="w-full flex-1 resize-none outline-none text-gray-700 font-medium placeholder-gray-400 p-2"
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                        {(selectedFile || existingFileUrl) && (
                            <div className="flex items-center gap-2 bg-[#EAF5E8] px-4 py-2 rounded-xl text-sm text-[#3E706F] font-bold border border-[#D1E2CF] self-start animate-in slide-in-from-left-2">
                                <Paperclip size={16} />
                                <span className="truncate max-w-[200px]">{selectedFile ? selectedFile.name : 'Existing Attachment'}</span>
                                <button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setExistingFileUrl(null);
                                    }}
                                    className="ml-2 hover:text-red-500"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#4F5867] text-white px-10 py-3.5 rounded-2xl font-bold shadow-lg hover:bg-[#3f4753] transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Upload File
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm(note, selectedFile);
                                    setNote('');
                                    setSelectedFile(null);
                                    setExistingFileUrl(null);
                                    onClose();
                                }}
                                className="bg-[#3E706F] text-white px-12 py-3.5 rounded-2xl font-bold shadow-lg hover:bg-[#2c5251] transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {initialNote ? 'Save Changes' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddNoteModal;
