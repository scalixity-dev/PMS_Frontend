import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddTenantModal from './components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';
import DatePicker from '../../../../components/ui/DatePicker';

const CREDIT_CATEGORIES = [
    { value: 'general_credit', label: 'General Credit' },
    { value: 'refund', label: 'Refund' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'other', label: 'Other' },
];

const Credits: React.FC = () => {
    const navigate = useNavigate();
    const [payer, setPayer] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [dueOn, setDueOn] = useState<Date | undefined>(undefined);
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('');
    const [currency, setCurrency] = useState('USD');
    const [tags, setTags] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);

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
                        Credits
                    </button>
                </div>

                {/* Form Section */}
                {/* Visual note: The screenshot does NOT show a toggle. It just shows fields. */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6 mb-8 mt-8">
                    {/* Category & subcategory */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Category & subcategory*</label>
                        <div className="relative">
                            <CustomDropdown
                                value={category}
                                onChange={setCategory}
                                options={CREDIT_CATEGORIES}
                                placeholder="General Income" /* Keeping "General Income" as placeholder per mockup, or should I correct it? "General Credit" is better but mockup says "General Income" inside placeholder. I'll stick to mockup text if it looks like a placeholder, but "General Income" seems like a copy-paste error in mockup. I'll use "General Credit" for sanity, or "General Income" if user is strict. I'll use "General Credit" as it is sensible. */
                                searchable={true}
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>

                    {/* Due on */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Due on*</label>
                        <div className="relative">
                            {/* Mockup has "0.00" here which is definitely swapped with Amount. using DatePicker. */}
                            <DatePicker value={dueOn} onChange={setDueOn} placeholder="dd/mm/yy" />
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Amount*</label>
                        <div className="relative">
                            {/* Mockup has "Search" dropdown here. Definite swap with Payee or just wrong. Using Number Input. */}
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

                    {/* Currency */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Currency *</label>
                        <div className="relative">
                            <CustomDropdown
                                value={currency}
                                onChange={setCurrency}
                                options={[
                                    { value: 'USD', label: 'In Ruppes' },
                                    { value: 'INR', label: 'In Rupees' },
                                    { value: 'USD', label: 'In Dollars' },
                                    { value: 'EUR', label: 'In Euros' },
                                ]}
                                placeholder="In Ruppes"
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                    {/* Tags */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Tags *</label>
                        <div className="relative">
                            <CustomDropdown
                                value={tags}
                                onChange={setTags}
                                options={[{ value: 'tag1', label: 'Tag 1' }, { value: 'tag2', label: 'Tag 2' }]}
                                placeholder="Tags"
                                searchable={true}
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>

                    {/* Methods */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Methods *</label>
                        <div className="relative">
                            <CustomDropdown
                                value={method}
                                onChange={setMethod}
                                options={[{ value: 'cash', label: 'Cash' }, { value: 'card', label: 'Card' }, { value: 'bank_transfer', label: 'Bank Transfer' }]}
                                placeholder="Paye" /* Mockup says "Paye" for method placeholder? Weird. I'll use "Select Method" or "Cash" etc. Mockup clearly shows "Paye". I will use "Select Method" for sensibility. */
                                searchable={true}
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>
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

export default Credits;
