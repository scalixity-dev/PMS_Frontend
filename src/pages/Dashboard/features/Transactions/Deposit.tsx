import React, { useState, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import TransactionToggle from './components/TransactionToggle';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';
import DatePicker from '../../../../components/ui/DatePicker';
import { useCreateDeposit } from '../../../../hooks/useTransactionQueries';
import { useGetAllTenants } from '../../../../hooks/useTenantQueries';
import { useGetAllApplications } from '../../../../hooks/useApplicationQueries';
import { serviceProviderService } from '../../../../services/service-provider.service';
import { useQuery } from '@tanstack/react-query';
import { useGetLeasesByTenant } from '../../../../hooks/useLeaseQueries';
import { validateFile } from '../../../../utils/fileValidation';

const DEPOSIT_CATEGORIES = [
    { value: 'security_deposit', label: 'Security Deposit' },
    { value: 'pet_deposit', label: 'Pet Deposit' },
    { value: 'key_deposit', label: 'Key Deposit' },
    { value: 'holding_deposit', label: 'Holding Deposit' },
    { value: 'other_deposit', label: 'Other Deposit' },
];

const Deposit: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const createDepositMutation = useCreateDeposit();
    
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

    const [activeTab, setActiveTab] = useState<'Property Deposit' | 'General Deposit'>('Property Deposit');
    const [payerPayee, setPayerPayee] = useState<string>('');
    const [payerId, setPayerId] = useState<string>('');
    const [contactId, setContactId] = useState<string>('');
    const [selectedPayerType, setSelectedPayerType] = useState<'tenant' | 'Service Pro' | 'other'>('tenant');
    const [category, setCategory] = useState<string>('');
    const [dueOn, setDueOn] = useState<Date | undefined>(undefined);
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('');
    const [currency, setCurrency] = useState('USD');
    const [leaseId, setLeaseId] = useState<string>('');
    const [propertyId, setPropertyId] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [error, setError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Transform payer/payee options
    const payerPayeeOptions = useMemo(() => {
        const options: Array<{ id: string; label: string; type: 'tenant' | 'Service Pro' | 'other' }> = [];
        
        // Add tenants
        tenants.forEach((tenant) => {
            const tenantUserId = tenant.user?.id;
            if (tenantUserId) {
                const name = tenant.user?.fullName || tenant.contactBookEntry?.email || 'Unknown Tenant';
                options.push({
                    id: tenantUserId,
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

    // Fetch leases for tenant if payer is a tenant
    const { data: leasesByTenant = [] } = useGetLeasesByTenant(
        payerId && selectedPayerType === 'tenant' ? payerId : null,
        selectedPayerType === 'tenant' && !!payerId && activeTab === 'Property Deposit'
    );

    // Get lease options for tenants
    const leaseOptions = useMemo(() => {
        if (selectedPayerType !== 'tenant' || !payerId || activeTab !== 'Property Deposit') return [];
        
        return leasesByTenant.map((leaseItem) => {
            const propertyName = leaseItem.property?.propertyName || 'Unknown Property';
            const unitName = leaseItem.unit?.unitName ? ` - ${leaseItem.unit.unitName}` : '';
            const label = `${propertyName}${unitName}`;
            
            return {
                value: leaseItem.id,
                label: label,
            };
        });
    }, [selectedPayerType, payerId, leasesByTenant, activeTab]);

    // Handle prefilled data from navigation
    React.useEffect(() => {
        if (location.state?.prefilledPayer) {
            const prefilledPayer = payerPayeeOptions.find(
                (opt) => opt.id === location.state.prefilledPayer || opt.label === location.state.prefilledPayer
            );
            if (prefilledPayer) {
                setPayerPayee(prefilledPayer.id);
                setSelectedPayerType(prefilledPayer.type);
                if (prefilledPayer.type === 'tenant') {
                    setPayerId(prefilledPayer.id);
                    setContactId('');
                } else if (prefilledPayer.type === 'Service Pro') {
                    setContactId(prefilledPayer.id);
                    setPayerId('');
                } else {
                    setPayerId(prefilledPayer.id);
                    setContactId('');
                }
            }
        }
        if (location.state?.prefilledLease) {
            setLeaseId(location.state.prefilledLease);
        }
        if (location.state?.prefilledProperty) {
            setPropertyId(location.state.prefilledProperty);
        }
    }, [location.state, payerPayeeOptions]);

    const handlePayerChange = (value: string) => {
        setPayerPayee(value);
        setLeaseId('');
        setPropertyId('');
        
        // Find the selected option to determine type
        const selectedOption = payerPayeeOptions.find((opt) => opt.id === value);
        if (selectedOption) {
            setSelectedPayerType(selectedOption.type);
            if (selectedOption.type === 'tenant') {
                setPayerId(value);
                setContactId('');
            } else if (selectedOption.type === 'Service Pro') {
                setContactId(value);
                setPayerId('');
            } else {
                // Applicant - use email as payerId
                setPayerId(value);
                setContactId('');
            }
        }
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

        // Validation
        if (!category) {
            setError('Please select a deposit category');
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
        if (!payerPayee) {
            setError('Please select a payer');
            return;
        }
        if (!method) {
            setError('Please select a payment method');
            return;
        }
        if (activeTab === 'Property Deposit' && selectedPayerType === 'tenant' && !leaseId) {
            setError('Please select a lease');
            return;
        }

        try {
            // Map payment method to backend format
            const paymentMethodMap: Record<string, string> = {
                'cash': 'CASH',
                'card': 'CARD',
                'bank_transfer': 'BANK_TRANSFER',
            };

            // Determine scope
            const scope = activeTab === 'Property Deposit' ? 'PROPERTY' : 'GENERAL';

            // Get property ID from lease if available
            let finalPropertyId = propertyId;
            if (!finalPropertyId && leaseId) {
                const selectedLease = leasesByTenant.find(l => l.id === leaseId);
                if (selectedLease?.propertyId) {
                    finalPropertyId = selectedLease.propertyId;
                }
            }

            // Get property ID from applicant's application if payer is an applicant
            if (!finalPropertyId && selectedPayerType === 'other' && payerId) {
                const applicantEmail = payerId;
                const application = applications.find(app => 
                    app.applicants?.some(applicant => applicant.email === applicantEmail)
                );
                if (application?.leasing?.property?.id) {
                    finalPropertyId = application.leasing.property.id;
                }
            }

            const depositData = {
                scope: scope as 'PROPERTY' | 'GENERAL',
                category: 'Deposit',
                subcategory: category,
                dueDate: dueOn.toISOString(),
                amount: parseFloat(amount),
                currency: currency as 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD',
                isPaid: false, // Deposits are typically pending initially
                paymentMethod: paymentMethodMap[method] || method.toUpperCase(),
                payerId: selectedPayerType === 'tenant' || selectedPayerType === 'other' ? payerId : undefined,
                contactId: selectedPayerType === 'Service Pro' ? contactId : undefined,
                propertyId: finalPropertyId || undefined,
                leaseId: leaseId || undefined,
                details: details || undefined,
                notes: details || undefined,
            };

            await createDepositMutation.mutateAsync({
                depositData,
                file: selectedFile || undefined,
            });

            // Success - navigate back or show success message
            navigate(-1);
        } catch (err: any) {
            setError(err.message || 'Failed to create deposit. Please try again.');
            console.error('Error creating deposit:', err);
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
                        Deposit
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Toggle Switch */}
                <TransactionToggle
                    value={activeTab}
                    onChange={(val) => setActiveTab(val as 'Property Deposit' | 'General Deposit')}
                    options={[
                        { label: 'Property Deposit', value: 'Property Deposit' },
                        { label: 'General Deposit', value: 'General Deposit' }
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
                                options={DEPOSIT_CATEGORIES}
                                placeholder="Select Deposit Type"
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
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Payer *</label>
                        <div className="relative">
                            <PayerPayeeDropdown
                                value={payerPayee}
                                onChange={handlePayerChange}
                                options={payerPayeeOptions}
                                onAddTenant={() => setIsAddTenantModalOpen(true)}
                                placeholder="Select Payer"
                            />
                        </div>
                    </div>

                    {/* Lease (for Property Deposit with tenant) */}
                    {activeTab === 'Property Deposit' && selectedPayerType === 'tenant' && payerId && (
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Lease *</label>
                            <div className="relative">
                                <CustomDropdown
                                    value={leaseId}
                                    onChange={setLeaseId}
                                    options={leaseOptions}
                                    placeholder={leasesByTenant.length === 0 ? "No leases found" : "Select Lease"}
                                    searchable={true}
                                    disabled={!payerPayee || selectedPayerType !== 'tenant'}
                                    buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* Currency Dropdown for General Deposit */}
                    {activeTab === 'General Deposit' && (
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
                                        { value: 'GBP', label: 'In Pounds' },
                                    ]}
                                    placeholder="Select Currency"
                                    buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* Methods */}
                    <div className={activeTab === 'General Deposit' ? 'col-span-1 md:col-span-1' : 'col-span-1 md:col-span-2'}>
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Methods *</label>
                        <div className="relative">
                            <CustomDropdown
                                value={method}
                                onChange={setMethod}
                                options={[
                                    { value: 'cash', label: 'Cash' },
                                    { value: 'card', label: 'Card' },
                                    { value: 'bank_transfer', label: 'Bank Transfer' }
                                ]}
                                placeholder="Select Method"
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
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
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
                        disabled={createDepositMutation.isPending}
                        className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createDepositMutation.isPending ? 'Creating...' : 'Create'}
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

export default Deposit;
