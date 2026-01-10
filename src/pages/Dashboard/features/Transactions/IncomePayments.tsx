import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import TransactionToggle from './components/TransactionToggle';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';
import DatePicker from '../../../../components/ui/DatePicker';

import { validateFile } from '../../../../utils/fileValidation';

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

const IncomePayments: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'Property Income' | 'General Income'>('Property Income');
    const [payer, setPayer] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [dueOn, setDueOn] = useState<Date | undefined>(undefined);
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('');
    const [currency, setCurrency] = useState('USD');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileClick = () => {
        setUploadError('');
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateFile(file);
        if (!validation.isValid) {
            setSelectedFile(null);
            e.target.value = '';
            setUploadError(validation.error || 'Invalid file');
            return;
        }

        setSelectedFile(file);
        setUploadError('');
    };

    const handleCreate = () => {
        // Log data
        console.log({
            activeTab,
            payer,
            category,
            dueOn,
            amount,
            method,
            currency,
            file: selectedFile
        });
        // TODO: Implement API call
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
                        Income payment
                    </button>
                </div>


                {/* Toggle Switch */}
                <TransactionToggle
                    value={activeTab}
                    onChange={(val) => setActiveTab(val as 'Property Income' | 'General Income')}
                    options={[
                        { label: 'Property Income', value: 'Property Income' },
                        { label: 'General Income', value: 'General Income' }
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
                                options={INCOME_CATEGORIES}
                                placeholder="General Income"
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

                    {/* Currency Dropdown for General Income - Shows when General Income is selected */}
                    {activeTab === 'General Income' && (
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Currency *</label>
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

                    {/* Methods */}
                    {/* If General Income is selected, we have 4 columns used (2 cat, 1 due, 1 amount). Next row: 2 payer, 1 currency. So 1 slot left for methods? 
                        Wait, mockup has:
                        Row 1: Cat (2), Due (1), Amount (1)
                        Row 2: Payer (2), Currency (1) (only if general?), Methods (2? or 1?)
                        In ExpensePayments:
                        Methods was col-span-2 or col-span-1 depending on currency.
                        Let's follow logically. 
                    */}
                    <div className={activeTab === 'General Income' ? 'col-span-1 md:col-span-1' : 'col-span-1 md:col-span-2'}>
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
                </div>

                {/* Details Section */}
                <div className="mb-8">
                    <label className="block text-xl font-bold text-gray-800 mb-4">Details</label>
                    <textarea
                        placeholder="Write Some details"
                        className="w-full h-40 rounded-[1.5rem] bg-[#f0f0f6] px-6 py-4 text-sm text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#7BD747]/20 transition-all shadow-sm resize-none"
                    />
                </div>

                {/* File Upload Error/Success Message */}
                {uploadError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                        {uploadError}
                    </div>
                )}
                {selectedFile && !uploadError && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                        File selected: {selectedFile.name}
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={handleFileClick}
                        className="bg-[#7BD747] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#6cc73d] hover:shadow-lg transition-all duration-200"
                    >
                        Upload File
                    </button>
                    <button
                        onClick={handleCreate}
                        className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200"
                    >
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

export default IncomePayments;
