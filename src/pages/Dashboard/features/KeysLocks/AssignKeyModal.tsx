import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import SearchableDropdown from '../../../../components/ui/SearchableDropdown';

interface AssignKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (property: string) => void;
}

const AssignKeyModal: React.FC<AssignKeyModalProps> = ({ isOpen, onClose, onAssign }) => {
    const [selectedProperty, setSelectedProperty] = useState('');

    const properties = [
        "Raj Villa",
        "Abc",
        "Luxury App",
        "Sunrise Apartments",
        "Golden Heights"
    ];

    useEffect(() => {
        // Capture the current overflow value before making any changes
        const previousOverflow = document.body.style.overflow || '';
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = previousOverflow;
        }
        
        return () => {
            // Restore the original overflow value on cleanup
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#E0E5E5] w-full max-w-md rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <h2 className="text-xl font-medium text-white">Assign a key</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="mb-10"> {/* Add margin bottom for spacing */}
                        <div className="mt-2">
                            {/* The SearchableDropdown handles the label and search functionality internally or we wrap it */}
                            {/* Looking at the component definition: SearchableDropdown accepts label, value, options, onChange, placeholder */}
                            <SearchableDropdown
                                label="Property *"
                                value={selectedProperty}
                                options={properties}
                                onChange={setSelectedProperty}
                                placeholder="Select Property"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Footer / Action */}
                    <div>
                        <button
                            onClick={() => {
                                if (selectedProperty) {
                                    onAssign(selectedProperty);
                                }
                            }}
                            className="bg-[#3A6D6C] text-white px-8 py-2.5 rounded-lg font-medium shadow-sm hover:bg-[#2c5251] transition-colors"
                        >
                            Assign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignKeyModal;
