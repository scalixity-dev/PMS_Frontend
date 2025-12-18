import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '@/components/ui/DatePicker';


// Checking if we have a Switch component. I will use a simple HTML checkbox styled as switch if not found? 
// The prompt implies utilizing existing components if possible. I'll look for a Switch or implement a custom toggle.
// For now, I'll stick to a custom toggle implementation inside the file if I can't find one, to be safe.

export interface IncomeFormData {
    currentEmployment: boolean;
    incomeType: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    company: string;
    position: string;
    monthlyAmount: string; // "Monthly Income" in UI
    address: string;
    office: string;
    companyPhone: string;
    supervisorName: string;
    supervisorEmail: string;
    supervisorPhone: string;
}

interface AddIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: IncomeFormData) => void;
    initialData?: IncomeFormData;
}

const incomeTypeOptions = [
    { value: 'Full Time', label: 'Full Time' },
    { value: 'Part Time', label: 'Part Time' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Other', label: 'Other' }
];

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<IncomeFormData>({
        currentEmployment: true,
        incomeType: '',
        startDate: undefined,
        endDate: undefined,
        company: '',
        position: '',
        monthlyAmount: '',
        address: '',
        office: '',
        companyPhone: '',
        supervisorName: '',
        supervisorEmail: '',
        supervisorPhone: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Prevent background scrolling when modal is open
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    currentEmployment: true,
                    incomeType: '',
                    startDate: undefined,
                    endDate: undefined,
                    company: '',
                    position: '',
                    monthlyAmount: '',
                    address: '',
                    office: '',
                    companyPhone: '',
                    supervisorName: '',
                    supervisorEmail: '',
                    supervisorPhone: ''
                });
            }
        } else {
            document.body.style.overflow = 'unset';
            setErrors({});
            setTouched({});
            // We don't necessarily need to reset on close if we reset on open, 
            // but keeping it clean is good.
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialData]);


    if (!isOpen) return null;

    const validateField = (key: keyof IncomeFormData, value: any): string => {
        switch (key) {
            case 'incomeType':
                // Optional in image? No, likely required but not marked with *. Wait, Image shows no * on Income Type.
                // But typically it is required. I'll make it required.
                // Image doesn't show * on Income Type but shows on Start Date *.
                // I will assume it's nice to have.
                break;
            case 'startDate':
                if (!value) return 'Start Date is required';
                break;
            case 'endDate':
                if (!formData.currentEmployment && !value) return 'End Date is required';
                // If current employment, maybe end date is not applicable? 
                // Image shows "End Date *" which implies it is required.
                // However, "Current Employment" usually means no end date. 
                // I will follow the visual cue: It has a * so I will make it required if not current employment??
                // Actually, if current employment is ON, End Date should probably be disabled or optional.
                // But the UI shows it there. I'll make it optional if current employment is checked.
                if (formData.currentEmployment) return '';
                if (!value) return 'End Date is required';
                break;
            case 'company':
                if (!value || value.trim() === '') return 'Company is required';
                break;
            case 'position':
                if (!value || value.trim() === '') return 'Position is required';
                break;
            case 'monthlyAmount':
                if (!value || value.trim() === '') return 'Monthly Income is required';
                break;
            case 'address':
                if (!value || value.trim() === '') return 'Address is required';
                break;
            case 'office':
                if (!value || value.trim() === '') return 'Office is required';
                break;
            case 'companyPhone':
                if (!value || value.trim() === '') return 'Company Phone is required';
                break;
            case 'supervisorName':
                if (!value || value.trim() === '') return 'Supervisor Name is required';
                break;
            case 'supervisorEmail':
                if (!value || value.trim() === '') return 'Supervisor Email is required';
                // Email validation
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
                break;
            case 'supervisorPhone':
                if (!value || value.trim() === '') return 'Supervisor Phone is required';
                break;
        }
        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        (Object.keys(formData) as Array<keyof IncomeFormData>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (key: keyof IncomeFormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleBlur = (key: keyof IncomeFormData, currentValue?: any) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const value = currentValue !== undefined ? currentValue : formData[key];
        const error = validateField(key, value);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = () => {
        const allTouched = (Object.keys(formData) as Array<keyof IncomeFormData>).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        if (validateAllFields()) {
            onSave(formData);
            onClose();
        }
    };

    // Custom Toggle Switch Component
    const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#7BD747]' : 'bg-gray-300'}`}
        >
            <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-xl w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative max-h-[90vh] flex flex-col font-sans">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-xl shrink-0">
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-lg font-medium">{initialData ? 'Edit income' : 'Add a new income'}</h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">

                    {/* Current Employment & Type */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-semibold text-[#2c3e50]">Current Employment?</span>
                            <ToggleSwitch
                                checked={formData.currentEmployment}
                                onChange={(val) => handleChange('currentEmployment', val)}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Income Type</label>
                        <CustomDropdown
                            value={formData.incomeType}
                            onChange={(val) => handleChange('incomeType', val)}
                            options={incomeTypeOptions}
                            placeholder="Select"
                            buttonClassName="w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm"
                            dropdownClassName="max-h-60"
                        />
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Start Date *</label>
                            <DatePicker
                                value={formData.startDate}
                                onChange={(date) => {
                                    handleChange('startDate', date);
                                    handleBlur('startDate', date);
                                }}
                                placeholder="DD/MM/YYYY"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 shadow-sm text-sm ${touched.startDate && errors.startDate ? 'border-2 border-red-500' : ''}`}
                            />
                            {touched.startDate && errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">End Date *</label>
                            <DatePicker
                                value={formData.endDate}
                                onChange={(date) => {
                                    handleChange('endDate', date);
                                    handleBlur('endDate', date);
                                }}
                                placeholder="DD/MM/YYYY"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 shadow-sm text-sm ${touched.endDate && errors.endDate ? 'border-2 border-red-500' : ''} ${formData.currentEmployment ? 'opacity-50 pointer-events-none' : ''}`}
                            />
                            {touched.endDate && errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                        </div>

                        {/* Company */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Company*</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.company && errors.company ? 'border-2 border-red-500' : ''}`}
                                value={formData.company}
                                onChange={(e) => handleChange('company', e.target.value)}
                                onBlur={() => handleBlur('company')}
                            />
                            {touched.company && errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                        </div>

                        {/* Position */}
                        <div className="md:col-span-1.5">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Position / Title *</label>
                            <input
                                type="text"
                                placeholder="Type Name"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.position && errors.position ? 'border-2 border-red-500' : ''}`}
                                value={formData.position}
                                onChange={(e) => handleChange('position', e.target.value)}
                                onBlur={() => handleBlur('position')}
                            />
                            {touched.position && errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                        </div>

                        {/* Monthly Income */}
                        <div className="md:col-span-1.5">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Monthly Income*</label>
                            <input
                                type="text"
                                placeholder="Add Money"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.monthlyAmount && errors.monthlyAmount ? 'border-2 border-red-500' : ''}`}
                                value={formData.monthlyAmount}
                                onChange={(e) => handleChange('monthlyAmount', e.target.value)}
                                onBlur={() => handleBlur('monthlyAmount')}
                            />
                            {touched.monthlyAmount && errors.monthlyAmount && <p className="text-red-500 text-xs mt-1">{errors.monthlyAmount}</p>}
                        </div>

                        {/* Address */}
                        <div className="md:col-span-1.5">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Address *</label>
                            <input
                                type="text"
                                placeholder="Starting Address"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.address && errors.address ? 'border-2 border-red-500' : ''}`}
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                onBlur={() => handleBlur('address')}
                            />
                            {touched.address && errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        {/* Office */}
                        <div className="md:col-span-1.5">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Office *</label>
                            <input
                                type="text"
                                placeholder="Type Office"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.office && errors.office ? 'border-2 border-red-500' : ''}`}
                                value={formData.office}
                                onChange={(e) => handleChange('office', e.target.value)}
                                onBlur={() => handleBlur('office')}
                            />
                            {touched.office && errors.office && <p className="text-red-500 text-xs mt-1">{errors.office}</p>}
                        </div>

                        {/* Company Phone */}
                        <div className="md:col-span-1.5">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Company Phone Number *</label>
                            <input
                                type="tel"
                                placeholder="Type Phone Number"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.companyPhone && errors.companyPhone ? 'border-2 border-red-500' : ''}`}
                                value={formData.companyPhone}
                                onChange={(e) => handleChange('companyPhone', e.target.value)}
                                onBlur={() => handleBlur('companyPhone')}
                            />
                            {touched.companyPhone && errors.companyPhone && <p className="text-red-500 text-xs mt-1">{errors.companyPhone}</p>}
                        </div>

                        {/* Supervisor Full Name */}
                        <div className="md:col-span-1.5">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Supervisor Full Name*</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.supervisorName && errors.supervisorName ? 'border-2 border-red-500' : ''}`}
                                value={formData.supervisorName}
                                onChange={(e) => handleChange('supervisorName', e.target.value)}
                                onBlur={() => handleBlur('supervisorName')}
                            />
                            {touched.supervisorName && errors.supervisorName && <p className="text-red-500 text-xs mt-1">{errors.supervisorName}</p>}
                        </div>

                        {/* Supervisor Email */}
                        <div className="md:col-span-1.5">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Supervisor Email *</label>
                            <input
                                type="email"
                                placeholder="Add Email here"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.supervisorEmail && errors.supervisorEmail ? 'border-2 border-red-500' : ''}`}
                                value={formData.supervisorEmail}
                                onChange={(e) => handleChange('supervisorEmail', e.target.value)}
                                onBlur={() => handleBlur('supervisorEmail')}
                            />
                            {touched.supervisorEmail && errors.supervisorEmail && <p className="text-red-500 text-xs mt-1">{errors.supervisorEmail}</p>}
                        </div>

                        {/* Supervisor Phone */}
                        <div className="md:col-span-1.5">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Supervisor Phone Number *</label>
                            <input
                                type="tel"
                                placeholder="Add Phone number here"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.supervisorPhone && errors.supervisorPhone ? 'border-2 border-red-500' : ''}`}
                                value={formData.supervisorPhone}
                                onChange={(e) => handleChange('supervisorPhone', e.target.value)}
                                onBlur={() => handleBlur('supervisorPhone')}
                            />
                            {touched.supervisorPhone && errors.supervisorPhone && <p className="text-red-500 text-xs mt-1">{errors.supervisorPhone}</p>}
                        </div>

                    </div>

                    {/* Add Button */}
                    <div>
                        <button
                            onClick={handleSubmit}
                            className="bg-[#3A6D6C] text-white px-12 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            {initialData ? 'Save' : 'Add'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddIncomeModal;
