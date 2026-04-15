import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import SearchableDropdown from '../../../../components/ui/SearchableDropdown';

interface AssignKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (issuedTo: string) => void;
    tenants?: string[];
    /** @deprecated use `tenants` — kept for backward compatibility */
    properties?: string[];
}

const AssignKeyModal: React.FC<AssignKeyModalProps> = ({ isOpen, onClose, onAssign, tenants, properties = [] }) => {
    const [selectedProperty, setSelectedProperty] = useState('');
    const options = tenants && tenants.length > 0 ? tenants : properties;

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

    const hasOptions = options.length > 0;

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
                    <p className="text-xs text-gray-500 mb-4">
                        Enter the name of the person or tenant receiving this key. You can type a custom name or pick from your existing tenants.
                    </p>
                    <div className="mb-10">
                        <div className="mt-2">
                            <SearchableDropdown
                                label="Issued To *"
                                value={selectedProperty}
                                options={options}
                                onChange={setSelectedProperty}
                                placeholder="Type name or select tenant"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Footer / Action */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white border border-gray-200 text-gray-700 px-8 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (!selectedProperty?.trim()) {
                                    return;
                                }
                                onAssign(selectedProperty.trim());
                            }}
                            disabled={!selectedProperty?.trim()}
                            className="flex-1 bg-[#3A6D6C] text-white px-8 py-2.5 rounded-lg font-medium shadow-sm hover:bg-[#2c5251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Assign Key
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignKeyModal;
