import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditNameModalProps {
    isOpen: boolean;
    currentName: string;
    onClose: () => void;
    onSave: (newName: string) => void;
}

const EditNameModal: React.FC<EditNameModalProps> = ({ isOpen, currentName, onClose, onSave }) => {
    const [name, setName] = useState(currentName);

    useEffect(() => {
        setName(currentName);
    }, [currentName]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white text-lg font-bold">Edit Name</h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="mb-8">
                        <label className="block text-gray-800 text-sm font-bold mb-3">
                            File Name*
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:border-[#3A6D6C] focus:ring-0 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-[#4f5866] text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-[#3e4550] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(name)}
                            className="flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-[#2c5251] transition-all"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditNameModal;
