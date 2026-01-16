import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';
import DatePicker from '../../../../components/ui/DatePicker';
import TagInput from './components/TagInput';
import { validateFile } from '../../../../utils/fileValidation';
import { useCreateCredit } from '../../../../hooks/useTransactionQueries';
import { useGetAllTenants } from '../../../../hooks/useTenantQueries';
import { useGetAllApplications } from '../../../../hooks/useApplicationQueries';
import { serviceProviderService } from '../../../../services/service-provider.service';
import { useGetTransactionTags } from '../../../../hooks/useTransactionQueries';
import Breadcrumb from '../../../../components/ui/Breadcrumb';

const CREDIT_CATEGORIES = [
    { value: 'general_credit', label: 'General Credit' },
    { value: 'refund', label: 'Refund' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'other', label: 'Other' },
];

const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'INR', label: 'INR' },
    { value: 'CAD', label: 'CAD' },
    { value: 'AUD', label: 'AUD' },
];

const PAYMENT_METHOD_OPTIONS = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CARD', label: 'Card' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CHEQUE', label: 'Cheque' },
    { value: 'UPI', label: 'UPI' },
    { value: 'OTHERS', label: 'Others' },
];

const Credits: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const createCreditMutation = useCreateCredit();

    // Fetch data from backend
    const { data: tenants = [] } = useGetAllTenants();
    const { data: applications = [] } = useGetAllApplications();
    const { data: serviceProviders = [] } = useQuery({
        queryKey: ['service-providers'],
        queryFn: () => serviceProviderService.getAll(true),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });
    const { data: tagSuggestions = [] } = useGetTransactionTags();

    const [payerPayee, setPayerPayee] = useState<string>('');
    const [payeeId, setPayeeId] = useState<string>('');
    const [contactId, setContactId] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [dueOn, setDueOn] = useState<Date | undefined>(undefined);
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('');
    const [currency, setCurrency] = useState('USD');
    const [tags, setTags] = useState<string[]>([]);
    const [details, setDetails] = useState<string>('');
    const [isPaid, setIsPaid] = useState<boolean>(false);
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Transform payer/payee options
    const payerPayeeOptions = useMemo(() => {
        const options: Array<{ id: string; label: string; type: 'tenant' | 'Service Pro' | 'other' }> = [];

        // Add tenants
        tenants.forEach((tenant) => {
            if (tenant.userId) {
                const name = tenant.user?.fullName || tenant.user?.email || 'Unknown Tenant';
                options.push({
                    id: tenant.userId,
                    label: name,
                    type: 'tenant',
                });
            }
        });

        // Add applicants
        applications.forEach((app) => {
            app.applicants?.forEach((applicant) => {
                if (applicant.email) {
                    const name = [applicant.firstName, applicant.middleName, applicant.lastName]
                        .filter(Boolean)
                        .join(' ') || applicant.email;
                    options.push({
                        id: applicant.email, // Use email as ID for applicants
                        label: name,
                        type: 'other',
                    });
                }
            });
        });

        // Add service providers
        serviceProviders.forEach((sp) => {
            const nameParts = [sp.firstName, sp.middleName, sp.lastName].filter(Boolean);
            const name = nameParts.length > 0 ? nameParts.join(' ') : sp.email || 'Unknown Service Provider';
            options.push({
                id: sp.id,
                label: name,
                type: 'Service Pro',
            });
        });

        return options;
    }, [tenants, applications, serviceProviders]);

    // Find selected payer/payee details
    const selectedPayeeOption = useMemo(() => {
        return payerPayeeOptions.find(opt => opt.id === payerPayee);
    }, [payerPayeeOptions, payerPayee]);

    // Update payee IDs when payer/payee changes
    useEffect(() => {
        if (selectedPayeeOption) {
            if (selectedPayeeOption.type === 'tenant' || selectedPayeeOption.type === 'other') {
                setPayeeId(selectedPayeeOption.id);
                setContactId('');
            } else if (selectedPayeeOption.type === 'Service Pro') {
                setContactId(selectedPayeeOption.id);
                setPayeeId('');
            }
        } else {
            setPayeeId('');
            setContactId('');
        }
    }, [selectedPayeeOption]);

    // Handle prefilled data from navigation
    useEffect(() => {
        if (location.state?.prefilledPayer) {
            const prefilledOption = payerPayeeOptions.find(
                opt => opt.id === location.state.prefilledPayer || opt.label === location.state.prefilledPayer
            );
            if (prefilledOption) {
                setPayerPayee(prefilledOption.id);
            }
        }
        if (location.state?.prefilledCategory) {
            setCategory(location.state.prefilledCategory);
        }
        if (location.state?.prefilledAmount) {
            setAmount(location.state.prefilledAmount);
        }
    }, [location.state, payerPayeeOptions]);

    const handlePayerChange = (value: string) => {
        setPayerPayee(value);
    };

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

    const handleCreate = async () => {
        setError('');
        setSuccess('');

        // Validation
        if (!payerPayee) {
            setError('Please select a payer/payee');
            return;
        }

        if (!category) {
            setError('Please select a category');
            return;
        }

        if (!dueOn) {
            setError('Please select a due date');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        // Determine scope based on whether property/lease is selected
        // For now, we'll use GENERAL as default since Credits component doesn't have property/lease selection
        const scope: 'PROPERTY' | 'GENERAL' = 'GENERAL';

        try {
            await createCreditMutation.mutateAsync({
                creditData: {
                    scope,
                    category,
                    dueDate: dueOn.toISOString().split('T')[0],
                    amount: parseFloat(amount),
                    currency: currency as any,
                    isPaid,
                    payeeId: payeeId || undefined,
                    contactId: contactId || undefined,
                    details: details || undefined,
                    notes: details || undefined,
                    tags: tags.length > 0 ? tags : undefined,
                    paymentMethod: isPaid && method ? method : undefined,
                },
                file: selectedFile || undefined,
            });

            setSuccess('Credit created successfully');
            // Navigate back after a short delay
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to create credit');
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Transactions', path: '/dashboard/accounting/transactions' },
                    { label: 'Credits' },
                ]}
                className="mb-6"
            />

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

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                        {success}
                    </div>
                )}

                {/* Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6 mb-8 mt-8">
                    {/* Category & subcategory */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Category & subcategory*</label>
                        <div className="relative">
                            <CustomDropdown
                                value={category}
                                onChange={setCategory}
                                options={CREDIT_CATEGORIES}
                                placeholder="Select category"
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
                                step="0.01"
                                min="0"
                                className="w-full rounded-md bg-white pl-4 pr-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7BD747]/20 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Payer / Payee */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Payer / Payee *</label>
                        <div className="relative">
                            <PayerPayeeDropdown
                                value={payerPayee}
                                onChange={handlePayerChange}
                                options={payerPayeeOptions}
                                onAddTenant={() => setIsAddTenantModalOpen(true)}
                                placeholder="Select payer/payee"
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
                                options={CURRENCY_OPTIONS}
                                placeholder="Select currency"
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                    {/* Tags */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Tags</label>
                        <div className="relative">
                            <TagInput
                                value={tags}
                                onChange={setTags}
                                placeholder="Type and press Enter to add tags"
                                suggestions={tagSuggestions}
                            />
                        </div>
                    </div>

                    {/* Methods */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Methods</label>
                        <div className="relative">
                            <CustomDropdown
                                value={method}
                                onChange={setMethod}
                                options={PAYMENT_METHOD_OPTIONS}
                                placeholder="Select method"
                                searchable={true}
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Mark as paid toggle */}
                <div className="flex items-center gap-3 mb-8">
                    <input
                        type="checkbox"
                        id="isPaid"
                        checked={isPaid}
                        onChange={(e) => setIsPaid(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-[#3A6D6C] focus:ring-[#3A6D6C] cursor-pointer"
                    />
                    <label htmlFor="isPaid" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Mark as paid
                    </label>
                </div>

                {/* Details Section */}
                <div className="mb-8">
                    <label className="block text-xl font-bold text-gray-800 mb-4">Details</label>
                    <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Write some details"
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
                        disabled={createCreditMutation.isPending}
                        className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createCreditMutation.isPending ? 'Creating...' : 'Create'}
                    </button>
                </div>

                <AddTenantModal
                    isOpen={isAddTenantModalOpen}
                    onClose={() => setIsAddTenantModalOpen(false)}
                    onSave={(_data) => {
                        setIsAddTenantModalOpen(false);
                    }}
                />
            </div>
        </div>
    );
};

export default Credits;
