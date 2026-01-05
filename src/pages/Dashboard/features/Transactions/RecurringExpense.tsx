import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DatePicker from '../../../../components/ui/DatePicker';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import TransactionToggle from './components/TransactionToggle';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';
import { TRANSACTION_CATEGORIES } from '../../../../utils/transactionCategories';
import { useTransactionStore } from './store/transactionStore';



const RecurringExpense: React.FC = () => {
    const navigate = useNavigate();
    const [expenseType, setExpenseType] = useState<'property' | 'general'>('property');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [payerPayee, setPayerPayee] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [frequency, setFrequency] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);

    const { clonedTransactionData } = useTransactionStore();

    useEffect(() => {
        const dataToLoad = clonedTransactionData;

        if (dataToLoad) {
            if (dataToLoad.amount) {
                // Normalize amount: strip non-digits/non-dots, keep only first decimal point
                let normalized = dataToLoad.amount.replace(/[^0-9.]/g, '').trim();

                // Keep only the first decimal point
                const firstDotIndex = normalized.indexOf('.');
                if (firstDotIndex !== -1) {
                    normalized = normalized.substring(0, firstDotIndex + 1) +
                        normalized.substring(firstDotIndex + 1).replace(/\./g, '');
                }

                // Validate the result is a valid number
                if (/^\d+(\.\d+)?$/.test(normalized) && isFinite(parseFloat(normalized))) {
                    setAmount(normalized);
                } else {
                    setAmount('');
                }
            }
            if (dataToLoad.user) {
                setPayerPayee(dataToLoad.user);
            }
            if (dataToLoad.details) {
                setDetails(dataToLoad.details);
            }
            // Add other field mappings as needed based on dataToLoad structure
        }
    }, [clonedTransactionData]);

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
                        Recurring Expense
                    </button>
                </div>

                {/* Toggle */}
                <div className="mb-10">
                    <TransactionToggle
                        value={expenseType}
                        onChange={(val) => setExpenseType(val as 'property' | 'general')}
                        options={[
                            { label: 'Property Expense', value: 'property' },
                            { label: 'General Expense', value: 'general' }
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
                                options={TRANSACTION_CATEGORIES}
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
                                value={payerPayee}
                                onChange={setPayerPayee}
                                options={[
                                    { id: '1', label: 'Service Pro', type: 'Service Pro' },
                                    { id: '2', label: 'Tenant', type: 'tenant' },
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
                                options={[
                                    { value: 'daily', label: 'Daily' },
                                    { value: 'weekly', label: 'Weekly' },
                                    { value: 'every_two_weeks', label: 'Every two weeks' },
                                    { value: 'every_four_weeks', label: 'Every four weeks' },
                                    { value: 'monthly', label: 'Monthly' },
                                    { value: 'every_two_months', label: 'Every two months' },
                                    { value: 'quarterly', label: 'Quarterly' },
                                    { value: 'every_six_months', label: 'Every six months' },
                                    { value: 'yearly', label: 'Yearly' },
                                ]}
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
                                placeholder="00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7BD747]/20 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Tags *</label>
                        <div className="relative">
                            <select className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-400 outline-none appearance-none shadow-sm focus:ring-2 focus:ring-[#7BD747]/20 cursor-pointer">
                                <option value="" disabled selected>Tags</option>
                                <option value="tag1">Tag 1</option>
                                <option value="tag2">Tag 2</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Currency */}
                    {expenseType === 'general' && (
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Currency</label>
                            <div className="relative">
                                <CustomDropdown
                                    value={currency}
                                    onChange={setCurrency}
                                    options={[
                                        { value: 'USD', label: 'USD' },
                                        { value: 'EUR', label: 'EUR' },
                                        { value: 'GBP', label: 'GBP' },
                                        { value: 'CAD', label: 'CAD' },
                                        { value: 'AUD', label: 'AUD' },
                                    ]}
                                    placeholder="Select Currency"
                                    buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
                    <div className="relative">
                        <div className="absolute top-4 left-4 text-gray-500 text-sm pointer-events-none">
                            {/* Placeholder handled by textarea */}
                        </div>
                        <textarea
                            className="w-full h-40 rounded-2xl bg-[#F0F0F6] p-6 text-sm text-gray-700 outline-none resize-none shadow-inner focus:bg-white focus:ring-2 focus:ring-[#7BD747]/20 transition-all placeholder-gray-500"
                            placeholder="Write Some details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-[#7BD747] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#6cc73d] hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                        Upload File
                    </button>
                    <button className="bg-[#3A6D6C] text-white px-10 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200">
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

export default RecurringExpense;
