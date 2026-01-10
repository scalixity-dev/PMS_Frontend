import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface AddPaintModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { color: string; description: string }) => void;
}

const AddPaintModal: React.FC<AddPaintModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [color, setColor] = useState('');
    const [description, setDescription] = useState('');
    const [colorError, setColorError] = useState('');

    const handleAdd = () => {
        if (!color.trim()) {
            setColorError('Color is required');
            return;
        }

        onAdd({
            color: color.trim(),
            description: description.trim()
        });

        // Reset and close
        setColor('');
        setDescription('');
        setColorError('');
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white";


    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-lg font-medium">Add a new paint</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            You can add, store and track the information about the property paint. You can add up to 15 paints.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Paint Header - Mocking the "Paint 3" look if needed, or just fields */}
                        <div className="font-bold text-[#2c3e50]">New Paint</div>

                        {/* Color Field */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => {
                                        setColor(e.target.value);
                                        if (colorError) setColorError('');
                                    }}
                                    className={`${inputClasses} ${colorError ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                    placeholder=" " // For floating label effect if we used it, but standard label here
                                />
                                <label className="absolute left-3 top-3 text-gray-500 text-sm pointer-events-none transition-all duration-200 origin-[0] transform -translate-y-0 scale-100 hidden">Color *</label>
                                {/* Simple placeholder approach matching design */}
                                <div className="absolute left-3 top-3 pointer-events-none">
                                    {!color && <span className="text-gray-500">Color <span className="text-red-500">*</span></span>}
                                </div>
                            </div>
                            {colorError && (
                                <p className="text-red-600 text-xs mt-1 ml-1">{colorError}</p>
                            )}
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

export default AddPaintModal;
