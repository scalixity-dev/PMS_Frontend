import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import TransactionToggle from './components/TransactionToggle';
import AddTenantModal from './components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';
import DatePicker from '../../../../components/ui/DatePicker';
import { TRANSACTION_CATEGORIES } from '../../../../utils/transactionCategories';

const ExpensePayments: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'Property Expense' | 'General Expense'>('Property Expense');
    const [payerPayee, setPayerPayee] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [dueOn, setDueOn] = useState<Date | undefined>(undefined);
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('');
    const [currency, setCurrency] = useState('USD');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Header */}
            <div className="flex items-center mb-6 pl-4 pt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                    Expense Payments
                </button>
            </div>

            <div className="p-6 bg-[#DFE5E3] rounded-[2rem] overflow-visible">

                {/* Toggle Switch */}
                <TransactionToggle
                    value={activeTab}
                    onChange={(val) => setActiveTab(val as 'Property Expense' | 'General Expense')}
                    options={[
                        { label: 'Property Expense', value: 'Property Expense' },
                        { label: 'General Expense', value: 'General Expense' }
                    ]}
                />

                {/* Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6 mb-8">
                    {/* Category & subcategory */}
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

                    {/* Due on */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Due on*</label>
                        <div className="relative">
                            <DatePicker value={dueOn} onChange={setDueOn} placeholder="dd/mm/yy" />
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Amount*</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full rounded-md bg-white pl-4 pr-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7BD747]/20 transition-all shadow-sm"
                            />
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

                    {/* Methods */}
                    <div className={`col-span-1 ${activeTab === 'General Expense' ? 'md:col-span-1' : 'md:col-span-2'}`}>
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Methods *</label>
                        <div className="relative">
                            <CustomDropdown
                                value={method}
                                onChange={setMethod}
                                options={[{ value: 'cash', label: 'Cash' }, { value: 'card', label: 'Card' }]} // Mock options
                                placeholder="Select Method"
                                searchable={true}
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>

                    {/* Currency Dropdown for General Expense */}
                    {activeTab === 'General Expense' && (
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

                {/* Details Section */}
                <div className="mb-8">
                    <label className="block text-xl font-bold text-gray-800 mb-4">Details</label>
                    <textarea
                        placeholder="Write Some details"
                        className="w-full h-40 rounded-[1.5rem] bg-[#f0f0f6] px-6 py-4 text-sm text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#7BD747]/20 transition-all shadow-sm resize-none"
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4">
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

export default ExpensePayments;
