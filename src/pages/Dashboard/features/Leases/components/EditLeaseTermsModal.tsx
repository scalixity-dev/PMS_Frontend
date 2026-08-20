import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';
import { validateLeaseTerms } from '../leaseTerms';

export interface Lease {
    id: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers pass differently shaped lease objects
    property: string | { name: string;[key: string]: any }; // Handle both string and object structure
    lease: string | number; // Represents lease name/number
    leaseType?: string;
    startDate?: Date | string; // Handle both Date objects and string formats
    endDate?: Date | string;
    rentAmount?: number | string;
    tenantId?: string | number;
    termNotes?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- kept loose so both call sites stay assignable
    [key: string]: any; // Allow other fields from mock data to pass through
}

interface EditLeaseTermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Lease;
    onUpdate: (data: Lease) => void;
}

const parseDate = (dateVal: string | Date | undefined) => {
    if (!dateVal) return undefined;
    if (dateVal instanceof Date) return dateVal;
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? undefined : d;
};

/** Read-only row for a value this form has no way to save. */
const ContextField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex flex-col gap-2">
        <span className="text-[#374151] font-bold text-sm ml-1">{label}</span>
        <p className="bg-white/60 rounded-lg px-4 py-3 min-h-[50px] w-full text-gray-600 font-medium flex items-center">
            {value}
        </p>
    </div>
);

const EditLeaseTermsModal: React.FC<EditLeaseTermsModalProps> = ({ isOpen, onClose, initialData, onUpdate }) => {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen && initialData) {
            setStartDate(parseDate(initialData.startDate));
            setEndDate(parseDate(initialData.endDate));
            setErrors({});
        } else {
            setStartDate(undefined);
            setEndDate(undefined);
            setErrors({});
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    // Property, lease and lease type are shown for context only. Neither call
    // site forwards them and the leases table has no column for the last two,
    // so editing them here would silently discard whatever was entered.
    const propertyName = typeof initialData?.property === 'object'
        ? initialData.property?.name
        : initialData?.property;
    const leaseLabel = initialData?.lease?.toString();

    const handleUpdate = () => {
        if (!initialData) return;

        const found = validateLeaseTerms({ startDate, endDate });
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        onUpdate({ ...initialData, startDate, endDate });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-[#E0E8E7] w-full max-w-2xl rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-[#3D7475] px-6 py-4 flex items-center justify-between ">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="text-white hover:opacity-80 transition-opacity">
                            <ChevronLeft size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-white">Edit lease terms</h2>
                    </div>
                    <button onClick={onClose} className="text-white hover:opacity-80 transition-opacity">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        <ContextField label="Property" value={propertyName || 'Not set'} />
                        <ContextField label="Lease" value={leaseLabel || 'Not set'} />

                        {/* Start Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#374151] font-bold text-sm ml-1">Start Date*</label>
                            <DatePicker
                                value={startDate}
                                onChange={(date) => {
                                    setStartDate(date);
                                    if (errors.startDate) setErrors(prev => ({ ...prev, startDate: '' }));
                                }}
                                className={`bg-white rounded-lg px-4 py-3 h-[50px] w-full text-gray-700 font-medium outline-none focus:ring-2 focus:ring-[#3D7475]/20 shadow-none border-none ${errors.startDate ? 'ring-2 ring-red-500' : ''}`}
                                placeholder="DD/MM/YYYY"
                            />
                            {errors.startDate && <span className="text-red-500 text-xs ml-1">{errors.startDate}</span>}
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#374151] font-bold text-sm ml-1">End Date*</label>
                            <DatePicker
                                value={endDate}
                                onChange={(date) => {
                                    setEndDate(date);
                                    if (errors.endDate) setErrors(prev => ({ ...prev, endDate: '' }));
                                }}
                                className={`bg-white rounded-lg px-4 py-3 h-[50px] w-full text-gray-700 font-medium outline-none focus:ring-2 focus:ring-[#3D7475]/20 shadow-none border-none ${errors.endDate ? 'ring-2 ring-red-500' : ''}`}
                                placeholder="DD/MM/YYYY"
                            />
                            {errors.endDate && <span className="text-red-500 text-xs ml-1">{errors.endDate}</span>}
                        </div>
                    </div>

                    {/* Footer / Update Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleUpdate}
                            className="bg-[#3D7475] text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-[#2c5251] transition-colors shadow-lg"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLeaseTermsModal;
