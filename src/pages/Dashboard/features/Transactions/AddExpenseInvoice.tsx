import React, { useState, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddServiceProModal from '../ServicePros/components/AddServiceProModal';
import { TRANSACTION_CATEGORIES } from '../../../../utils/transactionCategories';

// Property-related expense categories that require lease selection
const PROPERTY_RELATED_EXPENSE_CATEGORIES = [
	'cleaning_maintenance',
	'repairs',
	'utilities',
	'insurance',
	'property_taxes',
	'management_fees',
	'mortgage_interest',
	'supplies',
	'legal_professional_fees',
];
import TransactionToggle from './components/TransactionToggle';
import DatePicker from '../../../../components/ui/DatePicker';
import CustomDropdown from '../../components/CustomDropdown';
import { useCreateExpenseInvoice, useGetTransactionTags } from '../../../../hooks/useTransactionQueries';
import TagInput from './components/TagInput';
import { validateFile } from '../../../../utils/fileValidation';
import { useGetLeasesByTenant, useGetLeasesByProperty } from '../../../../hooks/useLeaseQueries';
import { useGetAllTenants } from '../../../../hooks/useTenantQueries';
import { useGetAllApplications } from '../../../../hooks/useApplicationQueries';
import { serviceProviderService, type BackendServiceProvider } from '../../../../services/service-provider.service';
import { useQuery } from '@tanstack/react-query';

const AddExpenseInvoice: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const createExpenseInvoice = useCreateExpenseInvoice();
    
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
    
    const [expenseType, setExpenseType] = useState<'property' | 'general'>('property');
    const [category, setCategory] = useState<string>('');
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [amount, setAmount] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const { data: tagSuggestions = [] } = useGetTransactionTags();
    const [isPaid, setIsPaid] = useState<boolean>(false);
    const [payerPayee, setPayerPayee] = useState<string>('');
    const [payeeId, setPayeeId] = useState<string>('');
    const [contactId, setContactId] = useState<string>('');
    const [selectedPayeeType, setSelectedPayeeType] = useState<'tenant' | 'Service Pro' | 'other'>('Service Pro');
    const [leaseId, setLeaseId] = useState<string>('');
    const [isAddServiceProModalOpen, setIsAddServiceProModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [error, setError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    // Determine if lease dropdown should be shown
    const isPropertyRelatedCategory = PROPERTY_RELATED_EXPENSE_CATEGORIES.includes(category);
    const isTenantPayee = selectedPayeeType === 'tenant' && payeeId;
    const isApplicantPayee = selectedPayeeType === 'other' && payeeId; // Applicants have type 'other'
    const shouldShowLease = isPropertyRelatedCategory && (isTenantPayee || isApplicantPayee) && expenseType === 'property';
    
    // Find property from applicant's application if payee is an applicant
    const applicantPropertyId = useMemo(() => {
        if (isApplicantPayee && payeeId) {
            // payeeId for applicants is their email
            const applicantEmail = payeeId;
            const application = applications.find(app => 
                app.applicants?.some(applicant => applicant.email === applicantEmail)
            );
            return application?.leasing?.property?.id || null;
        }
        return null;
    }, [isApplicantPayee, payeeId, applications]);
    
    // Fetch leases for the selected tenant OR by property if applicant
    const { data: leasesByTenant = [], isLoading: isLoadingLeasesByTenant } = useGetLeasesByTenant(
        payeeId && selectedPayeeType === 'tenant' ? payeeId : null,
        shouldShowLease === true && selectedPayeeType === 'tenant'
    );
    
    const { data: leasesByProperty = [], isLoading: isLoadingLeasesByProperty } = useGetLeasesByProperty(
        applicantPropertyId || null,
        shouldShowLease === true && selectedPayeeType === 'other'
    );
    
    // Combine leases from both sources
    const leases = useMemo(() => {
        if (selectedPayeeType === 'tenant') {
            return leasesByTenant;
        } else if (selectedPayeeType === 'other') {
            return leasesByProperty;
        }
        return [];
    }, [selectedPayeeType, leasesByTenant, leasesByProperty]);
    
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

        // Add tenants
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

        // Add applicants (from applications) - use applicant email as identifier
        // Use a Set to track added emails to avoid duplicates
        const addedApplicantEmails = new Set<string>();
        applications.forEach((application) => {
            if (application.applicants && Array.isArray(application.applicants) && application.applicants.length > 0) {
                application.applicants.forEach((applicant: any) => {
                    // Skip if applicant doesn't have required fields
                    if (!applicant.email || (!applicant.firstName && !applicant.lastName)) {
                        return;
                    }
                    
                    // Skip if we've already added this applicant (by email)
                    if (addedApplicantEmails.has(applicant.email)) {
                        return;
                    }
                    
                    const name = `${applicant.firstName || ''}${applicant.middleName ? ` ${applicant.middleName}` : ''} ${applicant.lastName || ''}`.trim();
                    
                    // Only add if we have a valid name
                    if (name) {
                        // Use applicant email as identifier - backend can look up by email
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

    // Pre-fill payer/payee if passed from navigation state
    React.useEffect(() => {
        if (location.state?.prefilledPayer) {
            setPayerPayee(location.state.prefilledPayer.label);
        }
    }, [location.state]);

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
        
        // Validate required fields
        if (!amount || parseFloat(amount) <= 0) {
            setError('Amount is required and must be greater than 0');
            return;
        }

        if (!payerPayee && !payeeId) {
            setError('Payer/Payee is required');
            return;
        }

        if (shouldShowLease && !leaseId) {
            setError('Lease is required for property-related expense with a tenant or applicant payee.');
            return;
        }

        try {
            const invoiceData = {
                scope: expenseType === 'property' ? 'PROPERTY' as const : 'GENERAL' as const,
                category: category || undefined,
                dueDate: dueDate ? dueDate.toISOString().split('T')[0] : undefined,
                amount: parseFloat(amount),
                currency: currency ? (currency as 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD') : undefined,
                isPaid,
                payeeId: payeeId || undefined,
                contactId: contactId || undefined,
                leaseId: leaseId || undefined,
                details: details || undefined,
                tags: tags.length > 0 ? tags : undefined,
            };

            await createExpenseInvoice.mutateAsync({
                invoiceData,
                file: selectedFile || undefined,
            });

            // Navigate back on success
            navigate(-1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create expense invoice');
        }
    };

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
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
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
                                onChange={(value) => {
                                    setPayerPayee(value);
                                    // Find the selected option to determine type
                                    const selectedOption = payerPayeeOptions.find(opt => opt.id === value);
                                    if (selectedOption) {
                                        setSelectedPayeeType(selectedOption.type);
                                        if (selectedOption.type === 'tenant') {
                                            setPayeeId(value);
                                            setContactId('');
                                        } else if (selectedOption.type === 'Service Pro') {
                                            setContactId(value);
                                            setPayeeId('');
                                        } else {
                                            // For applicants, try to use as payeeId (email lookup)
                                            setPayeeId(value);
                                            setContactId('');
                                        }
                                    }
                                }}
                                options={payerPayeeOptions}
                                onAddTenant={() => setIsAddServiceProModalOpen(true)}
                            />
                        </div>
                    </div>
                    
                    {/* Lease Field - Shown for property-related categories with tenant or applicant payee */}
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
                                    buttonClassName="!rounded-md"
                                    searchable={true}
                                />
                            </div>
                        </div>
                    )}

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
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Tags</label>
                        <TagInput
                            value={tags}
                            onChange={setTags}
                            placeholder="Type and press Enter to add tags"
                            suggestions={tagSuggestions}
                        />
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
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full h-40 rounded-2xl bg-[#F3F4F6] p-6 text-sm text-gray-700 outline-none resize-none shadow-inner focus:bg-white focus:ring-2 focus:ring-[#84CC16]/20 transition-all placeholder-gray-500"
                        placeholder="Write Some details"
                    ></textarea>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

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

                {/* Actions */}
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
                        className="bg-[#84CC16] text-white px-8 py-3 rounded-md font-semibold shadow-lg shadow-[#84CC16]/20 hover:bg-[#65a30d] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        Upload File
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={createExpenseInvoice.isPending}
                        className="bg-[#3D7475] text-white px-10 py-3 rounded-md font-semibold shadow-lg shadow-[#3D7475]/20 hover:bg-[#2c5556] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createExpenseInvoice.isPending ? 'Creating...' : 'Create'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddExpenseInvoice;
