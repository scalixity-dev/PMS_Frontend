import React, { useState, useEffect } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';

interface ChangeStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStatus: string;
    onSave: (newStatus: string) => void;
}

const STATUS_OPTIONS = [
    { value: 'New', label: 'New', color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: 'In progress', label: 'In progress', color: 'text-green-600', bg: 'bg-green-50' },
    { value: 'In review', label: 'In review', color: 'text-purple-600', bg: 'bg-purple-50' },
    { value: 'Resolved', label: 'Resolved', color: 'text-gray-600', bg: 'bg-gray-100' },
    { value: 'Canceled', label: 'Canceled', color: 'text-red-600', bg: 'bg-red-50' },
    { value: 'Archived', label: 'Archived', color: 'text-gray-500', bg: 'bg-gray-50' },
];

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
    isOpen,
    onClose,
    currentStatus,
    onSave,
}) => {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedStatus(currentStatus);
            setIsDropdownOpen(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, currentStatus]);

    if (!isOpen) return null;

    const handleSelect = (status: string) => {
        setSelectedStatus(status);
        setIsDropdownOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-[#355F5E] px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-lg font-medium text-white">Change Status</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 rounded-b-2xl">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] flex items-center justify-between"
                        >
                            <span className="text-gray-700">
                                {selectedStatus}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {/* Custom Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-[60] overflow-hidden max-h-60 overflow-y-auto">
                                {STATUS_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between
                                            ${option.value === selectedStatus ? 'bg-gray-50' : ''}
                                        `}
                                    >
                                        <span className="text-gray-700">{option.label}</span>
                                        {option.value === selectedStatus && <Check className="w-4 h-4 text-[#3A6D6C]" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer / Action */}
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-[#535D68] text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-[#434b54] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(selectedStatus)}
                            className="flex-1 bg-[#3A6D6C] text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-[#2c5251] transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeStatusModal;
