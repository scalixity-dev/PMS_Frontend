import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Info } from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import SearchableDropdown from '../../../../../components/ui/SearchableDropdown';
import DatePicker from '../../../../../components/ui/DatePicker';

interface Tenant {
    name: string;
    amount: number;
}

interface AddEditRecurringRentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
    mode?: 'add' | 'edit';
}

const AddEditRecurringRentModal: React.FC<AddEditRecurringRentModalProps> = ({ isOpen, onClose, onSave, initialData, mode = 'add' }) => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [frequency, setFrequency] = useState('Monthly');
    const [dueDay, setDueDay] = useState('1st');
    const [tenants, setTenants] = useState<Tenant[]>(initialData?.tenants || [
        { name: '', amount: 0 }
    ]);
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [firstInvoiceDate, setFirstInvoiceDate] = useState<Date | undefined>(undefined);

    // Prevent background scrolling and init state
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (mode === 'add') {
                // For Add mode, we might have initialData (defaults) e.g. tenants
                if (initialData?.tenants) {
                    setTenants(initialData.tenants);
                } else {
                    setTenants([{ name: '', amount: 0 }]);
                }
                // Defaults for new transaction
                setFrequency('Monthly');
                setDueDay('1st');
                setIsEnabled(true);
                setCategory('');
                setSubcategory('');
                setFirstInvoiceDate(undefined);
            } else if (mode === 'edit' && initialData) {
                // For Edit mode, populate state from initialData
                if (initialData.tenants) setTenants(initialData.tenants);
                if (initialData.frequency) setFrequency(initialData.frequency);
                if (initialData.dueDay) setDueDay(initialData.dueDay);
                if (initialData.isEnabled !== undefined) setIsEnabled(initialData.isEnabled);
                if (initialData.category) setCategory(initialData.category);
                if (initialData.subcategory) setSubcategory(initialData.subcategory);
                if (initialData.firstInvoiceDate) setFirstInvoiceDate(new Date(initialData.firstInvoiceDate));
            }
        } else {
            document.body.style.overflow = 'unset';
            // Optional: reset state on close if needed, but not strictly required if we reset on open
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialData, mode]);

    // Auto-calculate due day based on first invoice date
    useEffect(() => {
        if (firstInvoiceDate) {
            const day = firstInvoiceDate.getDate();
            let suffix = 'th';
            if (day === 1 || day === 21 || day === 31) suffix = 'st';
            else if (day === 2 || day === 22) suffix = 'nd';
            else if (day === 3 || day === 23) suffix = 'rd';

            setDueDay(`${day}${suffix}`);
        }
    }, [firstInvoiceDate]);

    const handleAmountChange = (index: number, value: string) => {
        const newTenants = [...tenants];
        newTenants[index].amount = parseFloat(value) || 0;
        setTenants(newTenants);
    };

    const handleTotalAmountChange = (value: string) => {
        const newTotal = parseFloat(value) || 0;
        if (tenants.length > 0) {
            const splitAmount = newTotal / tenants.length;
            setTenants(tenants.map(t => ({ ...t, amount: splitAmount })));
        }
    };

    const totalAmount = tenants.reduce((sum, tenant) => sum + tenant.amount, 0);

    const inputClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white";
    const dropdownButtonClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 font-medium bg-white flex items-center justify-between hover:bg-gray-50 transition-colors";



    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">{mode === 'edit' ? 'Edit recurring rent' : 'Add recurring transaction'}</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    {mode === 'edit' && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                            If you edit the transaction, changes will apply to new transactions. Modifying before the next occurrence will only affect future recurrences. Turn off the toggle to stop recurring rent invoicing.
                        </p>
                    )}

                    {/* Toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEnabled(!isEnabled)}
                            className={`w-12 h-7 rounded-full transition-colors relative ${isEnabled ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-[#2c3e50] font-medium">Rent</span>
                    </div>

                    {isEnabled && (
                        <>
                            {/* Category & Subcategory */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-1">
                                    <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Category & subcategory <span className="text-red-500">*</span></label>
                                    <SearchableDropdown
                                        value={subcategory || category ? (subcategory || category) : ''}
                                        onChange={(val) => {
                                            // Find category based on selected subcategory
                                            const options = [
                                                { label: 'Rent', options: ['Monthly Rent', 'Late Fee', 'Security Deposit'] },
                                                { label: 'Utilities', options: ['Water', 'Electricity', 'Gas', 'Internet', 'Trash'] },
                                                { label: 'Maintenance', options: ['Cleaning', 'Repairs', 'Landscaping'] },
                                                { label: 'Other', options: ['Parking', 'Storage', 'Amenities', 'Other'] }
                                            ];

                                            setSubcategory(val);

                                            // Find parent category
                                            const parentCategory = options.find(opt => opt.options.includes(val));
                                            if (parentCategory) {
                                                setCategory(parentCategory.label);
                                            } else {
                                                // If it's a category itself or custom, or fallback
                                                setCategory(val);
                                            }
                                        }}
                                        options={[
                                            { label: 'Rent', options: ['Monthly Rent', 'Late Fee', 'Security Deposit'] },
                                            { label: 'Utilities', options: ['Water', 'Electricity', 'Gas', 'Internet', 'Trash'] },
                                            { label: 'Maintenance', options: ['Cleaning', 'Repairs', 'Landscaping'] },
                                            { label: 'Other', options: ['Parking', 'Storage', 'Amenities', 'Other'] }
                                        ]}
                                        buttonClassName={dropdownButtonClasses}
                                        placeholder="Select Category"
                                    />
                                </div>
                                {/* First Invoice Date */}
                                <div>
                                    <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">First invoice date <span className="text-red-500">*</span></label>
                                    <DatePicker
                                        value={firstInvoiceDate}
                                        onChange={setFirstInvoiceDate}
                                        className="w-full border-gray-200"
                                        placeholder="Select date"
                                    />
                                </div>
                            </div>

                            {/* Frequency & Due Day */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Frequency <span className="text-red-500">*</span></label>
                                    <SearchableDropdown
                                        value={frequency}
                                        onChange={setFrequency}
                                        options={['Monthly', 'Weekly']}
                                        buttonClassName={dropdownButtonClasses}
                                        placeholder="Select Frequency"
                                    />
                                </div>
                                <div className="group relative">
                                    <label className="block text-xs text-gray-900 font-medium mb-1 ml-1 flex items-center gap-1">
                                        Due day <span className="text-red-500">*</span>
                                        <div className="group-hover:block hidden absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap z-10 text-center">
                                            The due day is automatically autofilled <br /> based on the selected invoice schedule.
                                        </div>
                                        <Info size={12} className="text-gray-400" />
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={dueDay}
                                            readOnly
                                            className={cn(inputClasses, "bg-gray-50 cursor-not-allowed pr-8")}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <ChevronDown size={16} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tenants */}
                            <div className="font-bold text-[#2c3e50]">Tenants</div>
                            <div className="space-y-4">
                                {tenants.map((tenant, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Tenant <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <div className={cn(inputClasses, "bg-[#F0F2F5] text-gray-500 flex items-center justify-between")}>
                                                    {tenant.name || 'Select Tenant'}
                                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Amount <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                value={tenant.amount}
                                                onChange={(e) => handleAmountChange(index, e.target.value)}
                                                className={inputClasses}
                                                prefix="₹"
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200"></div>

                            {/* Total Amount */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-end">
                                <div className="md:col-start-2">
                                    <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Total amount <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={totalAmount}
                                        onChange={(e) => handleTotalAmountChange(e.target.value)}
                                        className={inputClasses}
                                        placeholder="Enter total amount"
                                        prefix="₹"
                                        onFocus={(e) => e.target.select()}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-6 py-4 shrink-0 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave({ isEnabled, frequency, dueDay, tenants, totalAmount, category, subcategory, firstInvoiceDate })}
                        className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                    >
                        {mode === 'edit' ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddEditRecurringRentModal;
