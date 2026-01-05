import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '@/pages/Dashboard/components/CustomDropdown';
import DatePicker from '@/components/ui/DatePicker';

export interface Lease {
    id: string | number;
    property: string | { name: string;[key: string]: any }; // Handle both string and object structure
    lease: string | number; // Represents lease name/number
    leaseType?: string;
    startDate?: Date | string; // Handle both Date objects and string formats
    endDate?: Date | string;
    rentAmount?: number | string;
    tenantId?: string | number;
    termNotes?: string;
    [key: string]: any; // Allow other fields from mock data to pass through
}

interface EditLeaseTermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Lease;
    onUpdate: (data: Lease) => void;
}

const EditLeaseTermsModal: React.FC<EditLeaseTermsModalProps> = ({ isOpen, onClose, initialData, onUpdate }) => {
    const [property, setProperty] = useState('');
    const [leaseName, setLeaseName] = useState('');
    const [leaseType, setLeaseType] = useState('');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    // Mock options
    const propertyOptions = [
        { value: 'Luxury Apartments', label: 'Luxury Apartments' },
        { value: 'Grove Street', label: 'Grove Street' },
    ];

    const leaseTypeOptions = [
        { value: 'Fixed', label: 'Fixed' },
        { value: 'Month-to-Month', label: 'Month-to-Month' },
    ];

    useEffect(() => {
        if (isOpen && initialData) {
            // Handle property being string or object
            const propVal = typeof initialData.property === 'object'
                ? initialData.property.name
                : initialData.property;
            setProperty(propVal || '');

            setLeaseName(initialData.lease?.toString() || '');

            // Handle leaseType from initialData.type or initialData.leaseType
            // map it to local leaseType value, handling nested objects or ids
            let typeVal = initialData.type || initialData.leaseType || '';
            if (typeof typeVal === 'object' && typeVal !== null) {
                // If nested, try to extract name or label, otherwise stringify
                typeVal = typeVal.name || typeVal.label || '';
            }
            // If it's technically an ID (number), convert to string
            setLeaseType(String(typeVal) || 'Fixed'); // Default to 'Fixed' or '' as sensible default

            // Helper to parse dates
            const parseDate = (dateVal: string | Date | undefined) => {
                if (!dateVal) return undefined;
                if (dateVal instanceof Date) return dateVal;
                const d = new Date(dateVal);
                return isNaN(d.getTime()) ? undefined : d;
            };

            setStartDate(parseDate(initialData.startDate));
            setEndDate(parseDate(initialData.endDate));
        } else {
            // Reset
            setProperty('');
            setLeaseName('');
            setLeaseType('');
            setStartDate(undefined);
            setEndDate(undefined);
            setErrors({});
        }
    }, [isOpen, initialData]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!property) newErrors.property = 'Property is required';
        if (!leaseName) newErrors.leaseName = 'Lease name is required';
        if (!leaseType) newErrors.leaseType = 'Lease type is required';
        if (!startDate) newErrors.startDate = 'Start date is required';
        if (!endDate) newErrors.endDate = 'End date is required';

        if (startDate && endDate && endDate < startDate) {
            newErrors.endDate = 'End date cannot be before start date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if (!isOpen) return null;

    const handleUpdate = () => {
        if (!initialData) return;
        if (!validateForm()) return;

        const updatedLease: Lease = {
            ...initialData,
            property: property, // Update with string value
            lease: leaseName,
            leaseType,
            startDate,
            endDate
        };
        onUpdate(updatedLease);
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
                        {/* Property */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#374151] font-bold text-sm ml-1">Property *</label>
                            <CustomDropdown
                                value={property}
                                onChange={(val) => {
                                    setProperty(val);
                                    if (errors.property) setErrors(prev => ({ ...prev, property: '' }));
                                }}
                                options={propertyOptions}
                                placeholder="Choose Type"
                                buttonClassName={`bg-white border-none rounded-lg px-4 py-3 h-[50px] w-full text-left ${errors.property ? 'ring-2 ring-red-500' : ''}`}
                                textClassName="text-gray-700 font-medium"
                                dropdownClassName="rounded-lg mt-1 z-50"
                            />
                            {errors.property && <span className="text-red-500 text-xs ml-1">{errors.property}</span>}
                        </div>

                        {/* Lease */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#374151] font-bold text-sm ml-1">Lease *</label>
                            <input
                                type="text"
                                value={leaseName}
                                onChange={(e) => {
                                    setLeaseName(e.target.value);
                                    if (errors.leaseName) setErrors(prev => ({ ...prev, leaseName: '' }));
                                }}
                                className={`bg-white rounded-lg px-4 py-3 h-[50px] w-full text-gray-700 font-medium outline-none focus:ring-2 focus:ring-[#3D7475]/20 ${errors.leaseName ? 'ring-2 ring-red-500' : ''}`}
                                placeholder="Type here"
                            />
                            {errors.leaseName && <span className="text-red-500 text-xs ml-1">{errors.leaseName}</span>}
                        </div>

                        {/* Lease Type */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#374151] font-bold text-sm ml-1">Lease Type *</label>
                            <CustomDropdown
                                value={leaseType}
                                onChange={(val) => {
                                    setLeaseType(val);
                                    if (errors.leaseType) setErrors(prev => ({ ...prev, leaseType: '' }));
                                }}
                                options={leaseTypeOptions}
                                placeholder="Choose Type"
                                buttonClassName={`bg-white border-none rounded-lg px-4 py-3 h-[50px] w-full text-left ${errors.leaseType ? 'ring-2 ring-red-500' : ''}`}
                                textClassName="text-gray-700 font-medium"
                                dropdownClassName="rounded-lg mt-1 z-40"
                            />
                            {errors.leaseType && <span className="text-red-500 text-xs ml-1">{errors.leaseType}</span>}
                        </div>

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
                                popoverClassName="z-[60]"
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
                                popoverClassName="z-[60]"
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
