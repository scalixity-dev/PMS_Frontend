import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DatePicker from '../../../../components/ui/DatePicker';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import TransactionToggle from './components/TransactionToggle';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';

// Define recurring frequencies
const RECURRING_FREQUENCIES = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'every_two_weeks', label: 'Every two weeks' },
    { value: 'every_four_weeks', label: 'Every four weeks' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'every_two_months', label: 'Every two months' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'every_six_months', label: 'Every six months' },
    { value: 'yearly', label: 'Yearly' },
];

// Reusing Income Categories from IncomePayments
const INCOME_CATEGORIES = [
    { value: 'rent', label: 'Rent' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'late_fee', label: 'Late Fee' },
    { value: 'application_fee', label: 'Application Fee' },
    { value: 'pet_fee', label: 'Pet Fee' },
    { value: 'parking_fee', label: 'Parking Fee' },
    { value: 'laundry', label: 'Laundry Income' },
    { value: 'vending', label: 'Vending Income' },
    { value: 'other', label: 'Other Income' },
];

const RecurringIncome: React.FC = () => {
    const navigate = useNavigate();
    const [incomeType, setIncomeType] = useState<'Property Income' | 'General Income'>('Property Income');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [payer, setPayer] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [frequency, setFrequency] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');
    const [method, setMethod] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty string, numbers, and decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">

            <div className="p-6 bg-[#DFE5E3] rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center mb-6 pl-4 pt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        Recurring income
                    </button>
                </div>

                {/* Toggle Switch */}
                <div className="mb-10">
                    <TransactionToggle
                        value={incomeType}
                        onChange={(val) => setIncomeType(val as 'Property Income' | 'General Income')}
                        options={[
                            { label: 'Property Income', value: 'Property Income' },
                            { label: 'General Income', value: 'General Income' }
                        ]}
                    />
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6 mb-8 mt-8">
                    {/* Category */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Category & subcategory*</label>
                        <div className="relative">
                            <CustomDropdown
                                value={category}
                                onChange={setCategory}
                                options={INCOME_CATEGORIES}
                                placeholder="Select Category"
                                searchable={true}
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>

                    {/* Start Date */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Start Date*</label>
                        <div className="relative">
                            <DatePicker value={startDate} onChange={setStartDate} placeholder="dd/mm/yy" />
                        </div>
                    </div>

                    {/* End Date */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">End Date*</label>
                        <div className="relative">
                            <DatePicker value={endDate} onChange={setEndDate} placeholder="dd/mm/yy" />
                        </div>
                    </div>

                    {/* Payer / Payee */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Payer /Payee *</label>
                        <div className="relative">
                            <PayerPayeeDropdown
                                value={payer}
                                onChange={setPayer}
                                options={[
                                    { id: '1', label: 'Tenant', type: 'tenant' },
                                    { id: '2', label: 'Service Pro', type: 'Service Pro' },
                                    { id: '3', label: 'Other', type: 'other' },
                                ]}
                                onAddTenant={() => setIsAddTenantModalOpen(true)}
                                placeholder="Paye"
                            />
                        </div>
                    </div>

                    {/* Frequency */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Frequency</label>
                        <div className="relative">
                            <CustomDropdown
                                value={frequency}
                                onChange={setFrequency}
                                options={RECURRING_FREQUENCIES}
                                placeholder="Select Frequency"
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Amount</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="0.00"
                                className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7BD747]/20 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Methods - Reusing Logic from IncomePayments */}
                    <div className={incomeType === 'General Income' ? 'col-span-1 md:col-span-1' : 'col-span-1 md:col-span-2'}>
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Methods *</label>
                        <div className="relative">
                            <CustomDropdown
                                value={method}
                                onChange={setMethod}
                                options={[{ value: 'cash', label: 'Cash' }, { value: 'card', label: 'Card' }, { value: 'bank_transfer', label: 'Bank Transfer' }]}
                                placeholder="Tags"
                                searchable={true}
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>

                    {/* Currency for General Income */}
                    {incomeType === 'General Income' && (
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Currency</label>
                            <div className="relative">
                                <CustomDropdown
                                    value={currency}
                                    onChange={setCurrency}
                                    options={[
                                        { value: 'INR', label: 'In Rupees' },
                                        { value: 'USD', label: 'In Dollars' },
                                        { value: 'EUR', label: 'In Euros' },
                                    ]}
                                    placeholder="In Rupees"
                                    buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="mb-8">
                    <label className="block text-xl font-bold text-gray-800 mb-4">Details</label>
                    <textarea
                        placeholder="Write Some details"
                        className="w-full h-40 rounded-[1.5rem] bg-[#f0f0f6] px-6 py-4 text-sm text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#7BD747]/20 transition-all shadow-sm resize-none"
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-[#7BD747] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#6cc73d] hover:shadow-lg transition-all duration-200">
                        Upload File
                    </button>
                    <button className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200">
                        Create
                    </button>
                </div>

                <AddTenantModal
                    isOpen={isAddTenantModalOpen}
                    onClose={() => setIsAddTenantModalOpen(false)}
                    onSave={(data) => console.log('New Tenant Data:', data)}
                />

            </div>
        </div>
    );
};

export default RecurringIncome;
