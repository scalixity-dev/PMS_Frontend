import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import CustomDropdown from '../../../components/CustomDropdown';

export interface ResponsibilityItem {
    id: string;
    utility: string;
    payer: 'Landlord' | 'Tenant';
}

interface ResponsibilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: ResponsibilityItem[];
    onSave: (data: ResponsibilityItem[]) => void;
}

const UTILITY_OPTIONS = [
    { label: 'Cable/Satellite', value: 'Cable/Satellite' },
    { label: 'City Services', value: 'City Services' },
    { label: 'HOA/CAM/Strata', value: 'HOA/CAM/Strata' },
    { label: 'Internet', value: 'Internet' },
    { label: 'Phone', value: 'Phone' },
    { label: 'Landscaping', value: 'Landscaping' },
    { label: 'Electrical Services', value: 'Electrical Services' },
    { label: 'Garbage Service', value: 'Garbage Service' },
    { label: 'Home Security', value: 'Home Security' },
    { label: 'Gas Services', value: 'Gas Services' },
    { label: 'Laundry Services', value: 'Laundry Services' },
    { label: 'Government', value: 'Government' },
    { label: 'Cable & Communication Services', value: 'Cable & Communication Services' },
    { label: 'Pest Control', value: 'Pest Control' },
    { label: 'Snow Removal', value: 'Snow Removal' },
    { label: 'Sewer', value: 'Sewer' },
    { label: 'Water', value: 'Water' },
];

const ResponsibilityModal: React.FC<ResponsibilityModalProps> = ({ isOpen, onClose, initialData = [], onSave }) => {
    const [responsibilities, setResponsibilities] = useState<ResponsibilityItem[]>([]);
    const [selectedUtility, setSelectedUtility] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setResponsibilities(initialData.map(item => ({ ...item }))); // Deep copy to avoid mutating prop directly
            setSelectedUtility('');
        }
    }, [isOpen, initialData]);

    const handleAddUtility = () => {
        if (!selectedUtility) return;

        // Prevent duplicates
        if (responsibilities.some(r => r.utility === selectedUtility)) {
            // Optional: Show error or toast
            return;
        }

        const newItem: ResponsibilityItem = {
            id: Math.random().toString(36).substr(2, 9),
            utility: selectedUtility,
            payer: 'Landlord', // Default
        };

        setResponsibilities([...responsibilities, newItem]);
        setSelectedUtility('');
    };

    const handleDelete = (id: string) => {
        setResponsibilities(responsibilities.filter(item => item.id !== id));
    };

    const handlePayerChange = (id: string, payer: 'Landlord' | 'Tenant') => {
        setResponsibilities(responsibilities.map(item =>
            item.id === id ? { ...item, payer } : item
        ));
    };

    const handleSave = () => {
        onSave(responsibilities);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">Who pays what</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-4 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out">
                    <div>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium">
                            Configure who is responsible for paying the utilities. This global scheme will be used while creating a lease.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* List of Responsibilities */}
                        {responsibilities.length > 0 && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                {/* Table Header - Hide on mobile if preferred, or adjust */}
                                <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto] gap-4 bg-gray-100 p-3 border-b border-gray-200">
                                    <div className="w-6"></div> {/* Placeholder for delete icon space */}
                                    <div className="text-xs font-bold text-gray-700 uppercase">Utility</div>
                                    <div className="text-xs font-bold text-gray-700 uppercase w-16 text-center">Landlord</div>
                                    <div className="text-xs font-bold text-gray-700 uppercase w-16 text-center">Tenant</div>
                                </div>

                                {/* Rows */}
                                {responsibilities.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-[auto_1fr_auto_auto] gap-3 sm:gap-4 p-3 border-b border-gray-100 last:border-0 items-start sm:items-center relative">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="absolute top-3 right-3 sm:static text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="text-sm font-medium text-gray-900 pr-8 sm:pr-0">{item.utility}</div>

                                        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-4 mt-1 sm:mt-0">
                                            <div className="flex items-center gap-2 sm:hidden">
                                                <span className="text-xs font-medium text-gray-500">Landlord</span>
                                            </div>
                                            <div className="w-16 flex justify-center">
                                                <button
                                                    onClick={() => handlePayerChange(item.id, 'Landlord')}
                                                    className={cn(
                                                        "w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center transition-all",
                                                        item.payer === 'Landlord' ? "border-[#4CAF50]" : "hover:border-gray-400"
                                                    )}
                                                >
                                                    {item.payer === 'Landlord' && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2 sm:hidden pl-4 border-l border-gray-200">
                                                <span className="text-xs font-medium text-gray-500">Tenant</span>
                                            </div>
                                            <div className="w-16 flex justify-center">
                                                <button
                                                    onClick={() => handlePayerChange(item.id, 'Tenant')}
                                                    className={cn(
                                                        "w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center transition-all",
                                                        item.payer === 'Tenant' ? "border-[#4CAF50]" : "hover:border-gray-400"
                                                    )}
                                                >
                                                    {item.payer === 'Tenant' && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Dropdown and Add Button */}
                        <div className={cn("flex items-center gap-4 transition-all duration-300 ease-in-out", isDropdownOpen ? "mb-64" : "")}>
                            <div className="flex-1">
                                <CustomDropdown
                                    options={UTILITY_OPTIONS.filter(opt => !responsibilities.some(r => r.utility === opt.value))}
                                    value={selectedUtility}
                                    onChange={(val) => setSelectedUtility(val)}
                                    placeholder="Add utility"
                                    className="w-full bg-white rounded-lg"
                                    onToggle={setIsDropdownOpen}
                                />
                            </div>
                            <button
                                onClick={handleAddUtility}
                                disabled={!selectedUtility}
                                className={cn(
                                    "flex items-center gap-2 font-bold transition-colors",
                                    selectedUtility
                                        ? "text-[#4CAF50] hover:text-[#43a047] cursor-pointer"
                                        : "text-gray-400 cursor-not-allowed"
                                )}
                            >
                                <PlusCircle size={20} />
                                <span>Add</span>
                            </button>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 shrink-0">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ResponsibilityModal;
