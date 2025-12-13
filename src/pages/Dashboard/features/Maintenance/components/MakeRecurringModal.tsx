import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronDown, Check } from 'lucide-react';

interface CustomDropdownProps {
    label: string;
    value: string;
    options: string[];
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    onSelect: (v: string) => void;
}

interface ReadOnlyFieldProps {
    label: string;
    value?: string;
}

const CustomDropdown = React.memo<CustomDropdownProps>(({
    label,
    value,
    options,
    isOpen,
    setIsOpen,
    onSelect
}) => (
    <div className="relative">
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}*</label>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] flex items-center justify-between"
        >
            <span className={value ? "text-gray-700" : "text-gray-400"}>
                {value || `Select ${label}`}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
        {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-[60] overflow-hidden max-h-60 overflow-y-auto">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => {
                            onSelect(option);
                            setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between
                            ${option === value ? 'bg-gray-50' : ''}
                        `}
                    >
                        <span className="text-gray-700">{option}</span>
                        {option === value && <Check className="w-4 h-4 text-[#3A6D6C]" />}
                    </button>
                ))}
            </div>
        )}
    </div>
));

CustomDropdown.displayName = 'CustomDropdown';

const ReadOnlyField = React.memo<ReadOnlyFieldProps>(({ label, value }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}*</label>
        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 shadow-sm flex items-center justify-between">
            <span>{value || 'N/A'}</span>
            <ChevronDown className="w-4 h-4 text-gray-300" />
        </div>
    </div>
));

ReadOnlyField.displayName = 'ReadOnlyField';

interface MakeRecurringModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestDetails: {
        category?: string;
        subCategory?: string;
        issue?: string;
        subIssue?: string;
        title?: string;
    };
    onSave: (data: any) => void;
}

const FREQUENCY_OPTIONS = ['Weekly', 'Monthly', 'Yearly'];
const POST_IN_ADVANCE_OPTIONS = ['1 Day', '3 Days', '1 Week', '2 Weeks'];

const MakeRecurringModal: React.FC<MakeRecurringModalProps> = ({
    isOpen,
    onClose,
    requestDetails,
    onSave,
}) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [frequency, setFrequency] = useState('');
    const [postInAdvance, setPostInAdvance] = useState('');

    // Dropdown states
    const [isFrequencyOpen, setIsFrequencyOpen] = useState(false);
    const [isPostInAdvanceOpen, setIsPostInAdvanceOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ startDate, endDate, frequency, postInAdvance });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#355F5E] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <h2 className="text-lg font-medium text-white">Recurring request</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-gray-600 text-sm">
                        Schedule a recurring posting for this maintenance request and the system will create it automatically with the selected frequency in the "Requests" section.
                    </p>
                </div>

                {/* Body - Scrollable */}
                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="space-y-6">
                        {/* Category */}
                        <ReadOnlyField label="Category" value={requestDetails.category} />

                        {/* Sub-Category */}
                        <ReadOnlyField label="Sub-Category" value={requestDetails.subCategory} />

                        {/* Row: Issue & Start Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ReadOnlyField label="Issue" value={requestDetails.issue} />

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Start Date*</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Row: Sub-issue & End Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ReadOnlyField label="Sub-issue" value={requestDetails.subIssue} />

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">End Date*</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Row: Frequency & Post in Advance */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomDropdown
                                label="Frequency"
                                value={frequency}
                                options={FREQUENCY_OPTIONS}
                                isOpen={isFrequencyOpen}
                                setIsOpen={setIsFrequencyOpen}
                                onSelect={setFrequency}
                            />

                            <CustomDropdown
                                label="Post in Advance"
                                value={postInAdvance}
                                options={POST_IN_ADVANCE_OPTIONS}
                                isOpen={isPostInAdvanceOpen}
                                setIsOpen={setIsPostInAdvanceOpen}
                                onSelect={setPostInAdvance}
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Title*</label>
                            <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-500 shadow-sm">
                                {requestDetails.title || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-white border-t border-gray-100 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#535D68] text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-[#434b54] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-[#3A6D6C] text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-[#2c5251] transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MakeRecurringModal;
