import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, UploadCloud, FileText } from 'lucide-react';

interface AddFloorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { flooringType: string; description: string; file?: File | null }) => void;
}

const AddFloorModal: React.FC<AddFloorModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [flooringType, setFlooringType] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
        if (file.size > MAX_BYTES) {
            alert(`File too large (max 10 MB). Selected: ${(file.size / 1024 / 1024).toFixed(1)} MB`);
            e.target.value = '';
            return;
        }
        setSelectedFile(file);
    };

    const handleAdd = () => {
        if (!flooringType.trim()) {
            setError('Flooring type is required');
            return;
        }

        onAdd({
            flooringType: flooringType.trim(),
            description: description.trim(),
            file: selectedFile,
        });

        // Reset and close
        setFlooringType('');
        setDescription('');
        setSelectedFile(null);
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white";

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-lg font-medium">Add a new floor</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            You can add, store and track the information about the property flooring. You can add up to 15 flooring .
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="font-bold text-[#2c3e50]">Flooring</div>

                        {/* Flooring Type */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={flooringType}
                                    onChange={(e) => {
                                        setFlooringType(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className={`${inputClasses} ${error ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                    placeholder="Flooring type *"
                                />
                                <div className="absolute right-3 top-3 pointer-events-none text-red-500">
                                    {!flooringType && <span>*</span>}
                                </div>
                            </div>
                            {error && <p className="text-red-600 text-xs mt-1 ml-1">{error}</p>}
                        </div>

                        {/* Description Field */}
                        <div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={`${inputClasses} h-32 resize-none`}
                                placeholder="Description"
                                maxLength={150}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                Character limit: {description.length} / 150
                            </div>
                        </div>

                        {/* Upload Button */}
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 text-[#42a246] hover:text-[#3b903f] font-medium transition-colors"
                            >
                                <UploadCloud size={24} />
                                <span>Upload</span>
                            </button>
                            {selectedFile && (
                                <div className="mt-2 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                                    <FileText size={16} className="text-gray-600" />
                                    <span className="text-xs text-gray-700 truncate flex-1">{selectedFile.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddFloorModal;
