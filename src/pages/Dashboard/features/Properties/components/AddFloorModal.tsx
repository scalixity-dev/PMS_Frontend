import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface AddFloorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { name: string; flooringType: string; description: string }) => void;
    initialData?: { name: string; flooringType: string; description: string };
}

const AddFloorModal: React.FC<AddFloorModalProps> = ({ isOpen, onClose, onAdd, initialData }) => {
    const [name, setName] = useState('');
    const [flooringType, setFlooringType] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [nameError, setNameError] = useState('');

    React.useEffect(() => {
        if (isOpen) {
            setName(initialData?.name ?? '');
            setFlooringType(initialData?.flooringType ?? '');
            setDescription(initialData?.description ?? '');
            setError('');
            setNameError('');
        }
    }, [isOpen, initialData]);

    const handleAdd = () => {
        let hasError = false;
        if (!name.trim()) {
            setNameError('Name is required');
            hasError = true;
        }
        if (!flooringType.trim()) {
            setError('Flooring type is required');
            hasError = true;
        }
        if (hasError) return;

        onAdd({
            name: name.trim(),
            flooringType: flooringType.trim(),
            description: description.trim(),
        });

        // Reset and close
        setName('');
        setFlooringType('');
        setDescription('');
        setError('');
        setNameError('');
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white";

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-lg font-medium">{initialData ? 'Edit floor' : 'Add a new floor'}</h2>
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

                        {/* Name Field */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (nameError) setNameError('');
                                    }}
                                    className={`${inputClasses} ${nameError ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                    placeholder="Name *"
                                />
                            </div>
                            {nameError && <p className="text-red-600 text-xs mt-1 ml-1">{nameError}</p>}
                        </div>

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
                            {initialData ? 'Save' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddFloorModal;
