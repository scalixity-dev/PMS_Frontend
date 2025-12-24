import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronDown, Paperclip } from 'lucide-react';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: { details: string; date: string; assignee: string }, file?: File | null) => void;
    initialData?: { details: string; date: string; assignee: string; image?: string | null };
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onCreate, initialData }) => {
    const [details, setDetails] = useState(initialData?.details || '');
    const [date, setDate] = useState(initialData?.date || '');
    const [assignee, setAssignee] = useState(initialData?.assignee || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingFileUrl, setExistingFileUrl] = useState<string | null>(initialData?.image || null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isOpen && initialData) {
            setDetails(initialData.details);
            setDate(initialData.date);
            setAssignee(initialData.assignee);
            setExistingFileUrl(initialData.image || null);
            setSelectedFile(null);
        } else if (isOpen) {
            setDetails('');
            setDate('');
            setAssignee('');
            setExistingFileUrl(null);
            setSelectedFile(null);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden mx-4">
                {/* Header */}
                <div className="bg-[#3E706F] px-6 py-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-xl font-bold">Task</span>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 bg-[#F8FAFC]">
                    {/* Textarea */}
                    <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm min-h-[200px] flex flex-col mb-8">
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Add some details*"
                            className="w-full flex-1 resize-none outline-none text-gray-700 font-medium placeholder-gray-400 p-2"
                        />
                    </div>

                    {/* Inputs Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {/* Date & Time */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#1A1A1A]">Select Date & Time *</label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-3.5 outline-none focus:border-[#3E706F] transition-colors text-gray-700 font-medium placeholder-gray-400 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 cursor-pointer"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Assign to */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#1A1A1A]">Assign to *</label>
                            <div className="relative">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Type here"
                                        value={assignee}
                                        onChange={(e) => setAssignee(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-3.5 outline-none focus:border-[#3E706F] transition-colors text-gray-700 font-medium placeholder-gray-400"
                                    />
                                    <ChevronDown className="absolute right-6 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 -mx-8 px-8 flex flex-col gap-4">
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
                                    onCreate({ details, date, assignee }, selectedFile);
                                    setDetails('');
                                    setDate('');
                                    setAssignee('');
                                    setSelectedFile(null);
                                    onClose();
                                }}
                                className="bg-[#3E706F] text-white px-12 py-3.5 rounded-2xl font-bold shadow-lg hover:bg-[#2c5251] transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddTaskModal;
