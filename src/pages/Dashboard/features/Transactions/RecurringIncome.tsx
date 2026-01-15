import React, { useState, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from '../../../../components/ui/DatePicker';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import TransactionToggle from './components/TransactionToggle';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';
import { useCreateRecurringIncome } from '../../../../hooks/useTransactionQueries';
import { useGetAllTenants } from '../../../../hooks/useTenantQueries';
import { useGetAllApplications } from '../../../../hooks/useApplicationQueries';
import { serviceProviderService, type BackendServiceProvider } from '../../../../services/service-provider.service';
import { useQuery } from '@tanstack/react-query';
import { useGetLeasesByTenant, useGetLeasesByProperty } from '../../../../hooks/useLeaseQueries';

// Define recurring frequencies - mapping to backend enum values
const RECURRING_FREQUENCIES = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'EVERY_TWO_WEEKS', label: 'Every two weeks' },
    { value: 'EVERY_FOUR_WEEKS', label: 'Every four weeks' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'EVERY_TWO_MONTHS', label: 'Every two months' },
    { value: 'QUARTERLY', label: 'Quarterly' },
    { value: 'EVERY_SIX_MONTHS', label: 'Every six months' },
    { value: 'YEARLY', label: 'Yearly' },
];

// Property-related income categories that require lease selection
const PROPERTY_RELATED_INCOME_CATEGORIES = [
    'rent',
    'deposit',
    'late_fee',
    'application_fee',
    'pet_fee',
    'parking_fee',
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
    const location = useLocation();
    const createRecurringIncome = useCreateRecurringIncome();
    
    // Fetch data from backend
    const { data: tenants = [] } = useGetAllTenants();
    const { data: applications = [] } = useGetAllApplications();
    const { data: serviceProviders = [] } = useQuery({
        queryKey: ['service-providers'],
        queryFn: () => serviceProviderService.getAll(true), // Only active service providers
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });

    const [incomeType, setIncomeType] = useState<'property' | 'general'>('property');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [payerPayee, setPayerPayee] = useState<string>('');
    const [payerId, setPayerId] = useState<string>('');
    const [contactId, setContactId] = useState<string>('');
    const [selectedPayerType, setSelectedPayerType] = useState<'tenant' | 'Service Pro' | 'other'>('tenant');
    const [category, setCategory] = useState<string>('');
    const [frequency, setFrequency] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [leaseId, setLeaseId] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
    const [details, setDetails] = useState<string>('');
    const [error, setError] = useState<string>('');
    
    // Determine if lease dropdown should be shown
    const isPropertyRelatedCategory = PROPERTY_RELATED_INCOME_CATEGORIES.includes(category);
    const isTenantPayer = selectedPayerType === 'tenant' && payerId;
    const isApplicantPayer = selectedPayerType === 'other' && payerId; // Applicants have type 'other'
    const shouldShowLease = isPropertyRelatedCategory && (isTenantPayer || isApplicantPayer) && incomeType === 'property';
    
    // Find property from applicant's application if payer is an applicant
    const applicantPropertyId = useMemo(() => {
        if (isApplicantPayer && payerId) {
            // payerId for applicants is their email
            const applicantEmail = payerId;
            const application = applications.find(app => 
                app.applicants?.some(applicant => applicant.email === applicantEmail)
            );
            return application?.leasing?.property?.id || null;
        }
        return null;
    }, [isApplicantPayer, payerId, applications]);
    
    // Fetch leases for the selected tenant OR by property if applicant
    const { data: leasesByTenant = [], isLoading: isLoadingLeasesByTenant } = useGetLeasesByTenant(
        payerId && selectedPayerType === 'tenant' ? payerId : null,
        shouldShowLease === true && selectedPayerType === 'tenant'
    );
    
    const { data: leasesByProperty = [], isLoading: isLoadingLeasesByProperty } = useGetLeasesByProperty(
        applicantPropertyId || null,
        shouldShowLease === true && selectedPayerType === 'other'
    );
    
    // Combine leases from both sources
    const leases = useMemo(() => {
        if (selectedPayerType === 'tenant') {
            return leasesByTenant;
        } else if (selectedPayerType === 'other') {
            return leasesByProperty;
        }
        return [];
    }, [selectedPayerType, leasesByTenant, leasesByProperty]);
    
    const isLoadingLeases = isLoadingLeasesByTenant || isLoadingLeasesByProperty;
    
    // Transform leases to dropdown options
    const leaseOptions = leases.map((lease: any) => {
        const propertyName = lease.property?.propertyName || 'Unknown Property';
        const unitName = lease.unit?.unitName || '';
        
        // Format dates for display
        const startDate = lease.startDate ? new Date(lease.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        const endDate = lease.endDate ? new Date(lease.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        const dateRange = startDate && endDate ? ` (${startDate} - ${endDate})` : startDate ? ` (${startDate})` : '';
        
        // Create display name: Property - Unit (dates) or just Property (dates)
        let displayName = propertyName;
        if (unitName) {
            displayName = `${propertyName} - ${unitName}`;
        }
        displayName += dateRange;
        
        return {
            value: lease.id,
            label: displayName,
        };
    });

    // Transform backend data to PayerPayeeDropdown options
    const payerPayeeOptions = useMemo(() => {
        const options: Array<{ id: string; label: string; type: 'Service Pro' | 'tenant' | 'other' }> = [];

        // Add tenants - use userId if available, otherwise use tenant profile id
        tenants.forEach((tenant) => {
            const name = `${tenant.firstName}${tenant.middleName ? ` ${tenant.middleName}` : ''} ${tenant.lastName}`.trim();
            const tenantId = tenant.userId || tenant.id;
            options.push({
                id: tenantId,
                label: name,
                type: 'tenant',
            });
        });

        // Add service providers
        serviceProviders.forEach((provider: BackendServiceProvider) => {
            const name = `${provider.firstName}${provider.middleName ? ` ${provider.middleName}` : ''} ${provider.lastName}`.trim();
            options.push({
                id: provider.id, // This is the contactBookEntry id
                label: name,
                type: 'Service Pro',
            });
        });

        const addedApplicantEmails = new Set<string>();
        
        applications.forEach((application) => {
            if (application?.applicants && Array.isArray(application.applicants) && application.applicants.length > 0) {
                application.applicants.forEach((applicant: any) => {
                    if (!applicant?.email || (!applicant?.firstName && !applicant?.lastName)) {
                        return;
                    }
                    
                    if (addedApplicantEmails.has(applicant.email)) {
                        return;
                    }
                    
                    const name = `${applicant.firstName || ''}${applicant.middleName ? ` ${applicant.middleName}` : ''} ${applicant.lastName || ''}`.trim();
                    
                    if (name) {
                        const applicantId = applicant.email;
                        options.push({
                            id: applicantId,
                            label: `${name} (Applicant)`,
                            type: 'other',
                        });
                        addedApplicantEmails.add(applicant.email);
                    }
                });
            }
        });

        return options;
    }, [tenants, serviceProviders, applications]);

    // Pre-fill data if passed from navigation state
    React.useEffect(() => {
        if (location.state?.prefilledPayer) {
            setPayerPayee(location.state.prefilledPayer.label);
        }
        if (location.state?.prefilledLease) {
            setLeaseId(location.state.prefilledLease);
        }
        if (location.state?.prefilledDate) {
            setStartDate(location.state.prefilledDate);
        }
    }, [location.state]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty string, numbers, and decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleCreate = async () => {
        setError('');
        
        // Validate required fields
        if (!amount || parseFloat(amount) <= 0) {
            setError('Amount is required and must be greater than 0');
            return;
        }

        if (!startDate) {
            setError('Start date is required');
            return;
        }

        if (!frequency) {
            setError('Frequency is required');
            return;
        }

        if (!payerPayee && !payerId) {
            setError('Payer/Payee is required');
            return;
        }

        try {
            const recurringData = {
                scope: incomeType === 'property' ? 'PROPERTY' as const : 'GENERAL' as const,
                category: category || undefined,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
                frequency: frequency as 'DAILY' | 'WEEKLY' | 'EVERY_TWO_WEEKS' | 'EVERY_FOUR_WEEKS' | 'MONTHLY' | 'EVERY_TWO_MONTHS' | 'QUARTERLY' | 'EVERY_SIX_MONTHS' | 'YEARLY',
                amount: parseFloat(amount),
                currency: currency ? (currency as 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD') : undefined,
                payerId: payerId || undefined,
                contactId: contactId || undefined,
                leaseId: leaseId || undefined,
                details: details || undefined,
            };

            await createRecurringIncome.mutateAsync(recurringData);

            // Navigate back on success
            navigate(-1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create recurring income');
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
                        onChange={(val) => setIncomeType(val as 'property' | 'general')}
                        options={[
                            { label: 'Property Income', value: 'property' },
                            { label: 'General Income', value: 'general' }
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
                                value={payerPayee}
                                onChange={(value) => {
                                    setPayerPayee(value);
                                    // Find the selected option to determine type
                                    const selectedOption = payerPayeeOptions.find(opt => opt.id === value);
                                    if (selectedOption) {
                                        setSelectedPayerType(selectedOption.type);
                                        if (selectedOption.type === 'tenant') {
                                            setPayerId(value);
                                            setContactId('');
                                        } else if (selectedOption.type === 'Service Pro') {
                                            setContactId(value);
                                            setPayerId('');
                                        } else {
                                            // For applicants, try to use as payerId (email lookup)
                                            setPayerId(value);
                                            setContactId('');
                                        }
                                    }
                                }}
                                options={payerPayeeOptions}
                                onAddTenant={() => setIsAddTenantModalOpen(true)}
                                placeholder="Select Payer/Payee"
                            />
                        </div>
                    </div>

                    <AddTenantModal
                        isOpen={isAddTenantModalOpen}
                        onClose={() => setIsAddTenantModalOpen(false)}
                        onSave={(data) => console.log('New Tenant Data:', data)}
                    />

                    {/* Lease Field - Shown for property-related categories with tenant payer */}
                    {shouldShowLease && (
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Lease</label>
                            <div className="relative">
                                <CustomDropdown
                                    value={leaseId}
                                    onChange={(value) => {
                                        setLeaseId(value);
                                    }}
                                    options={leaseOptions}
                                    placeholder={isLoadingLeases ? 'Loading leases...' : 'Select Lease'}
                                    buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                                    searchable={true}
                                />
                            </div>
                        </div>
                    )}

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

                    {/* Currency for General Income */}
                    {incomeType === 'general' ? (
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
                                        { value: 'INR', label: 'INR' },
                                        { value: 'CAD', label: 'CAD' },
                                        { value: 'AUD', label: 'AUD' },
                                    ]}
                                    placeholder="Select Currency"
                                    buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:block col-span-1"></div>
                    )}
                </div>

                {/* Details */}
                <div className="mb-8">
                    <label className="block text-xl font-bold text-gray-800 mb-4">Details</label>
                    <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Write Some details"
                        className="w-full h-40 rounded-[1.5rem] bg-[#f0f0f6] px-6 py-4 text-sm text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#7BD747]/20 transition-all shadow-sm resize-none"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleCreate}
                        disabled={createRecurringIncome.isPending}
                        className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createRecurringIncome.isPending ? 'Creating...' : 'Create'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RecurringIncome;
