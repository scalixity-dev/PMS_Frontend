import React, { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddServiceProModal from '../ServicePros/components/AddServiceProModal';
import { TRANSACTION_CATEGORIES } from '../../../../utils/transactionCategories';
import TransactionToggle from './components/TransactionToggle';
import DatePicker from '../../../../components/ui/DatePicker';
import CustomDropdown from '../../components/CustomDropdown';

const AddExpenseInvoice: React.FC = () => {
    const navigate = useNavigate();
    const [expenseType, setExpenseType] = useState<'property' | 'general'>('property');
    const [category, setCategory] = useState<string>('');
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [currency, setCurrency] = useState<string>('');
    const [isPaid, setIsPaid] = useState<boolean>(false);
    const [payerPayee, setPayerPayee] = useState<string>('');
    const [isAddServiceProModalOpen, setIsAddServiceProModalOpen] = useState(false);
    const location = useLocation();

    // Pre-fill payer/payee if passed from navigation state
    React.useEffect(() => {
        if (location.state?.prefilledPayer) {
            setPayerPayee(location.state.prefilledPayer.label);
        }
    }, [location.state]);

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto font-['Urbanist']">

            {/* Main Card */}
            <div className="bg-[#DFE5E3] rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-sm min-h-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Expense invoice</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8 ">
                    {/* Category */}
                    <div className="col-span-1 md:col-span-2 ">
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
                            <DatePicker value={dueDate} onChange={setDueDate} placeholder="Select due date" />
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Amount*</label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all shadow-sm appearance-none"
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
                                    // Mock Service Pros
                                    { id: '1', label: 'Sam Rao', type: 'Service Pro' },
                                    { id: '2', label: 'Vijay Rfgdd', type: 'Service Pro' },
                                    { id: '3', label: 'Alex Brown', type: 'Service Pro' },
                                    { id: '4', label: 'John Doe', type: 'Service Pro' },
                                    // Mock Tenant for example
                                    { id: 't1', label: 'Ojshav Saxena', type: 'tenant' },
                                ]}
                                onAddTenant={() => setIsAddServiceProModalOpen(true)}
                            />
                        </div>
                    </div>

                    <AddServiceProModal
                        isOpen={isAddServiceProModalOpen}
                        onClose={() => setIsAddServiceProModalOpen(false)}
                        onSave={(data) => console.log('New Service Pro Data:', data)}
                    />
                    {/* Currency (Only for General Expense) or Spacer */}
                    {expenseType === 'general' ? (
                        <div className="col-span-1 md:col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Currency</label>
                            <div className="relative">
                                <CustomDropdown
                                    value={currency}
                                    onChange={setCurrency}
                                    options={[
                                        { value: 'USD', label: 'USD' },
                                        { value: 'EUR', label: 'EUR' },
                                        { value: 'GBP', label: 'GBP' },
                                    ]}
                                    placeholder="Select Currency"
                                    buttonClassName="!rounded-md"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:block col-span-2"></div>
                    )}

                    {/* Tags */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Tags *</label>
                        <div className="relative">
                            <select className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-700 outline-none appearance-none shadow-sm focus:ring-2 focus:ring-[#84CC16]/20 cursor-pointer">
                                <option value="" disabled selected>Tags</option>
                                <option value="tag1">Tag 1</option>
                                <option value="tag2">Tag 2</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mark as paid toggle (below Tags) */}
                <div className="flex items-center gap-3 mb-10">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isPaid}
                            onChange={(e) => setIsPaid(e.target.checked)}
                        />
                        <div className={`w-12 h-7 rounded-full transition-colors duration-200 ${isPaid ? 'bg-[#84CC16]' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 mt-1 ml-1 ${isPaid ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                    </label>
                    <span className="text-sm font-medium text-gray-700">Mark as paid</span>
                </div>

                {/* Details */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
                    <textarea
                        className="w-full h-40 rounded-2xl bg-[#F3F4F6] p-6 text-sm text-gray-700 outline-none resize-none shadow-inner focus:bg-white focus:ring-2 focus:ring-[#84CC16]/20 transition-all placeholder-gray-500"
                        placeholder="Write Some details"
                    ></textarea>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-[#84CC16] text-white px-8 py-3 rounded-md font-semibold shadow-lg shadow-[#84CC16]/20 hover:bg-[#65a30d] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto">
                        Upload File
                    </button>
                    <button className="bg-[#3D7475] text-white px-10 py-3 rounded-md font-semibold shadow-lg shadow-[#3D7475]/20 hover:bg-[#2c5556] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto">
                        Create
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddExpenseInvoice;
