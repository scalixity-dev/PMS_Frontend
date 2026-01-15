import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DatePicker from '../../../../components/ui/DatePicker';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import TransactionToggle from './components/TransactionToggle';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';
import { useTransactionStore } from './store/transactionStore';
import { validateFile } from '../../../../utils/fileValidation';
import { useCreateRecurringIncome, useGetTransactionTags } from '../../../../hooks/useTransactionQueries';
import { useGetAllTenants } from '../../../../hooks/useTenantQueries';
import { useGetAllApplications } from '../../../../hooks/useApplicationQueries';
import { serviceProviderService, type BackendServiceProvider } from '../../../../services/service-provider.service';
import { useQuery } from '@tanstack/react-query';
import { useGetLeasesByTenant, useGetLeasesByProperty } from '../../../../hooks/useLeaseQueries';
import TagInput from './components/TagInput';

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

// Income categories
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

// Property-related income categories that require lease selection
const PROPERTY_RELATED_INCOME_CATEGORIES = [
    'rent',
    'deposit',
    'late_fee',
    'application_fee',
    'pet_fee',
    'parking_fee',
];

const RecurringClone: React.FC = () => {
    const navigate = useNavigate();
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
    const { data: tags = [] } = useGetTransactionTags();

    const [incomeType, setIncomeType] = useState<'Property Income' | 'General Income'>('Property Income');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [payerPayee, setPayerPayee] = useState<string>('');
    const [payerId, setPayerId] = useState<string>('');
    const [contactId, setContactId] = useState<string>('');
    const [selectedPayerType, setSelectedPayerType] = useState<'tenant' | 'Service Pro' | 'other'>('tenant');
    const [leaseId, setLeaseId] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [frequency, setFrequency] = useState<string>('');
    const [tagsList, setTagsList] = useState<string[]>([]);
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const { clonedTransactionData } = useTransactionStore();

    // Determine if lease dropdown should be shown
    const isPropertyRelatedCategory = PROPERTY_RELATED_INCOME_CATEGORIES.includes(category);
    const isTenantPayer = selectedPayerType === 'tenant' && payerId;
    const isApplicantPayer = selectedPayerType === 'other' && payerId;
    const shouldShowLease = isPropertyRelatedCategory && (isTenantPayer || isApplicantPayer) && incomeType === 'Property Income';
    
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
    const { data: leasesByTenant = [] } = useGetLeasesByTenant(
        payerId && selectedPayerType === 'tenant' ? payerId : null,
        shouldShowLease === true && selectedPayerType === 'tenant'
    );
    
    const { data: leasesByProperty = [] } = useGetLeasesByProperty(
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
            if (tenantId) {
                options.push({
                    id: tenantId,
                    label: name,
                    type: 'tenant',
                });
            }
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

    // Handle payer/payee selection
    useEffect(() => {
        if (payerPayee) {
            const selectedOption = payerPayeeOptions.find(opt => opt.id === payerPayee);
            if (selectedOption) {
                setSelectedPayerType(selectedOption.type);
                if (selectedOption.type === 'Service Pro') {
                    setContactId(selectedOption.id);
                    setPayerId('');
                } else if (selectedOption.type === 'tenant') {
                    setPayerId(selectedOption.id);
                    setContactId('');
                } else if (selectedOption.type === 'other') {
                    // For applicants, payerId is the email
                    setPayerId(selectedOption.id);
                    setContactId('');
                }
            }
        } else {
            setPayerId('');
            setContactId('');
            setSelectedPayerType('tenant');
        }
    }, [payerPayee, payerPayeeOptions]);

    // Pre-fill data from cloned transaction
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
            if (dataToLoad.user || dataToLoad.payer) {
                // Try to find matching option
                const userLabel = dataToLoad.user || dataToLoad.payer || '';
                const matchingOption = payerPayeeOptions.find(opt => opt.label === userLabel);
                if (matchingOption) {
                    setPayerPayee(matchingOption.id);
                }
            }
            if (dataToLoad.details) {
                setDetails(dataToLoad.details);
            }
            if (dataToLoad.category) {
                setCategory(dataToLoad.category);
            }
            if (dataToLoad.tags) {
                const tagsArray = typeof dataToLoad.tags === 'string' 
                    ? dataToLoad.tags.split(',').map(t => t.trim()).filter(Boolean)
                    : Array.isArray(dataToLoad.tags) 
                        ? dataToLoad.tags 
                        : [];
                setTagsList(tagsArray);
            }
            if (dataToLoad.date) {
                try {
                    const date = new Date(dataToLoad.date);
                    if (!isNaN(date.getTime())) {
                        setStartDate(date);
                    }
                } catch (e) {
                    // Invalid date, ignore
                }
            }
        }
    }, [clonedTransactionData, payerPayeeOptions]);

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

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty string, numbers, and decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleCreate = async () => {
        setError('');
        setFormErrors({});
        
        // Validate required fields
        if (!amount || parseFloat(amount) <= 0) {
            setFormErrors({ amount: 'Amount is required and must be greater than 0' });
            return;
        }

        if (!startDate) {
            setFormErrors({ startDate: 'Start date is required' });
            return;
        }

        if (!endDate) {
            setFormErrors({ endDate: 'End date is required' });
            return;
        }

        if (endDate < startDate) {
            setFormErrors({ endDate: 'End date must be after start date' });
            return;
        }

        if (!frequency) {
            setFormErrors({ frequency: 'Frequency is required' });
            return;
        }

        if (!payerPayee && !payerId && !contactId) {
            setFormErrors({ payer: 'Payer/Payee is required' });
            return;
        }

        try {
            const recurringData = {
                scope: incomeType === 'Property Income' ? 'PROPERTY' as const : 'GENERAL' as const,
                category: category || undefined,
                subcategory: category || undefined,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
                frequency: frequency as 'DAILY' | 'WEEKLY' | 'EVERY_TWO_WEEKS' | 'EVERY_FOUR_WEEKS' | 'MONTHLY' | 'EVERY_TWO_MONTHS' | 'QUARTERLY' | 'EVERY_SIX_MONTHS' | 'YEARLY',
                amount: parseFloat(amount),
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
                                options={INCOME_CATEGORIES}
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
                        {formErrors.startDate && <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.startDate}</p>}
                    </div>

                    {/* Frequency */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Frequency *</label>
                        <div className="relative">
                            <CustomDropdown
                                value={frequency}
                                onChange={setFrequency}
                                options={RECURRING_FREQUENCIES}
                                placeholder="Select Frequency"
                                buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                            />
                        </div>
                        {formErrors.frequency && <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.frequency}</p>}
                    </div>

                    {/* End Date */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">End date *</label>
                        <div className="relative">
                            <DatePicker value={endDate} onChange={setEndDate} placeholder="dd/mm/yy" />
                        </div>
                        {formErrors.endDate && <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.endDate}</p>}
                    </div>

                    {/* Amount */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Amount *</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="00"
                                value={amount}
                                onChange={handleAmountChange}
                                className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7BD747]/20 transition-all shadow-sm"
                            />
                        </div>
                        {formErrors.amount && <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.amount}</p>}
                    </div>

                    {/* Payer / Payee */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Payer / Payee *</label>
                        <div className="relative">
                            <PayerPayeeDropdown
                                value={payerPayee}
                                onChange={setPayerPayee}
                                options={payerPayeeOptions}
                                onAddTenant={() => setIsAddTenantModalOpen(true)}
                                placeholder="Payer"
                            />
                        </div>
                        {formErrors.payer && <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.payer}</p>}
                    </div>

                    {/* Lease */}
                    {shouldShowLease && (
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Lease</label>
                            <div className="relative">
                                <CustomDropdown
                                    value={leaseId}
                                    onChange={setLeaseId}
                                    options={leaseOptions}
                                    placeholder="Select Lease"
                                    buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Tags</label>
                        <div className="relative">
                            <TagInput
                                value={tagsList}
                                onChange={setTagsList}
                                suggestions={tags}
                                placeholder="Add tags"
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
                        disabled={createRecurringIncome.isPending}
                        className="w-full sm:w-auto bg-[#3D7475] text-white px-10 py-3 rounded-md font-semibold shadow-lg shadow-[#3D7475]/20 hover:bg-[#2c5556] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createRecurringIncome.isPending ? 'Creating...' : 'Create'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

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
                    onSave={() => {
                        // The modal will handle the tenant creation
                        // We'll refetch tenants to get the new one
                        setIsAddTenantModalOpen(false);
                    }}
                />

            </div>
        </div>
    );
};

export default RecurringClone;
