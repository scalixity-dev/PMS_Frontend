import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, UploadCloud } from 'lucide-react'; // Assuming UploadCloud exists or similar

interface AddFloorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { flooringType: string; description: string }) => void;
}

const AddFloorModal: React.FC<AddFloorModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [flooringType, setFlooringType] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleAdd = () => {
        if (!flooringType.trim()) {
            setError('Flooring type is required');
            return;
        }

        onAdd({
            flooringType: flooringType.trim(),
            description: description.trim()
        });

        // Reset and close
        setFlooringType('');
        setDescription('');
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
                            <button className="flex items-center gap-2 text-[#42a246] hover:text-[#3b903f] font-medium transition-colors">
                                <UploadCloud size={24} />
                                <span>Upload</span>
                            </button>
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
