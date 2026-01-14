import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DatePicker from '../../../../components/ui/DatePicker';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import TransactionToggle from './components/TransactionToggle';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';
import { TRANSACTION_CATEGORIES } from '../../../../utils/transactionCategories';
import { useTransactionStore } from './store/transactionStore';
import { validateFile } from '../../../../utils/fileValidation';

const RecurringClone: React.FC = () => {
    const navigate = useNavigate();
    const [incomeType, setIncomeType] = useState<'Property Income' | 'General Income'>('Property Income');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [payer, setPayer] = useState<string>('');
    const [lease, setLease] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [frequency, setFrequency] = useState<string>('');
    const [tags, setTags] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const { clonedTransactionData } = useTransactionStore();

    useEffect(() => {
        const dataToLoad = clonedTransactionData;

        if (dataToLoad) {
            if (dataToLoad.amount) {
                let normalized = dataToLoad.amount.replace(/[^0-9.]/g, '').trim();
                const firstDotIndex = normalized.indexOf('.');
                if (firstDotIndex !== -1) {
                    normalized = normalized.substring(0, firstDotIndex + 1) +
                        normalized.substring(firstDotIndex + 1).replace(/\./g, '');
                }
                if (/^\d+(\.\d+)?$/.test(normalized) && isFinite(parseFloat(normalized))) {
                    setAmount(normalized);
                } else {
                    setAmount('');
                }
            }
            if (dataToLoad.user) {
                setPayer(dataToLoad.user);
            }
            if (dataToLoad.details) {
                setDetails(dataToLoad.details);
            }
            // Add other field mappings as needed
        }
    }, [clonedTransactionData]);

    const handleFileClick = () => {
        setUploadError('');
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateFile(file);
        if (!validation.isValid) {
            setUploadError(validation.error || 'Invalid file');
            return;
        }

        setSelectedFile(file);
        setUploadError('');
    };

    const handleCreate = () => {
        console.log({
            incomeType,
            startDate,
            endDate,
            payer,
            lease,
            category,
            frequency,
            amount,
            tags,
            details,
            file: selectedFile
        });
        // TODO: Implement API call
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">

            <div className="p-4 sm:p-6 lg:p-8 bg-[#E7ECEB] rounded-[1.5rem] sm:rounded-[2rem] overflow-visible shadow-sm">
                {/* Header */}
                <div className="flex items-center mb-6 pt-2 sm:pt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        Recurring clone
                    </button>
                </div>

                {/* Toggle */}
                <div className="mb-6">
                    <TransactionToggle
                        value={incomeType}
                        onChange={(val) => setIncomeType(val as 'Property Income' | 'General Income')}
                        options={[
                            { label: 'Property Income', value: 'Property Income' },
                            { label: 'General Income', value: 'General Income' }
                        ]}
                    />
                </div>

                {/* Form Fields - Grid Layout matching screenshot */}
                {/* Form Fields - Grid Layout matching screenshot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-4 md:gap-y-6 mb-8">

                    {/* Category */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Category & subcategory</label>
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
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Start date *</label>
                        <div className="relative">
                            <DatePicker value={startDate} onChange={setStartDate} placeholder="dd/mm/yy" />
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
                                    { value: 'monthly', label: 'Monthly' },
                                    { value: 'yearly', label: 'Yearly' },
                                ]}
                                placeholder="Select Frequency"
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>

                    {/* End Date */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">End date *</label>
                        <div className="relative">
                            <DatePicker value={endDate} onChange={setEndDate} placeholder="dd/mm/yy" />
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Amount *</label>
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

                    {/* Payer / Payee */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Payer / Payee *</label>
                        <div className="relative">
                            <PayerPayeeDropdown
                                value={payer}
                                onChange={setPayer}
                                options={[
                                    { id: '1', label: 'Tenant', type: 'tenant' },
                                    { id: '2', label: 'Service Pro', type: 'Service Pro' },
                                ]}
                                onAddTenant={() => setIsAddTenantModalOpen(true)}
                                placeholder="Paye"
                            />
                        </div>
                    </div>

                    {/* Lease */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Lease</label>
                        <div className="relative">
                            <CustomDropdown
                                value={lease}
                                onChange={setLease}
                                options={[
                                    { value: 'lease1', label: 'bhbh. Lease #20 (Active)' },
                                    { value: 'lease2', label: 'Other Lease' },
                                ]}
                                placeholder="Select Lease"
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Tags</label>
                        <div className="relative">
                            <CustomDropdown
                                value={tags}
                                onChange={setTags}
                                options={[
                                    { value: 'tag1', label: 'Tag 1' },
                                    { value: 'tag2', label: 'Tag 2' },
                                ]}
                                placeholder="Tags"
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>

                    {/* Details - Full Width */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Details</label>
                        <textarea
                            className="w-full h-40 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 text-sm text-gray-700 outline-none resize-none shadow-sm focus:ring-2 focus:ring-[#7BD747]/20 transition-all placeholder-gray-500"
                            placeholder="Write Some details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={handleFileClick}
                        className="w-full sm:w-auto bg-[#84CC16] text-white px-8 py-3 rounded-md font-semibold shadow-lg shadow-[#84CC16]/20 hover:bg-[#65a30d] transition-all duration-200"
                    >
                        Upload File
                    </button>
                    <button
                        onClick={handleCreate}
                        className="w-full sm:w-auto bg-[#3D7475] text-white px-10 py-3 rounded-md font-semibold shadow-lg shadow-[#3D7475]/20 hover:bg-[#2c5556] transition-all duration-200"
                    >
                        Create
                    </button>
                </div>

                {/* File Upload Status */}
                {(uploadError || selectedFile) && (
                    <div className="mt-4">
                        {uploadError && (
                            <div className="text-red-600 text-sm">{uploadError}</div>
                        )}
                        {selectedFile && !uploadError && (
                            <div className="text-green-600 text-sm">
                                {selectedFile.name}
                            </div>
                        )}
                    </div>
                )}

                <AddTenantModal
                    isOpen={isAddTenantModalOpen}
                    onClose={() => setIsAddTenantModalOpen(false)}
                    onSave={(data) => console.log('New Tenant Data:', data)}
                />

            </div>
        </div>
    );
};

export default RecurringClone;
