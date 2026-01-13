import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronDown, SquarePen, Plus, Pencil, Clock, FileText, Edit, Trash2, XCircle, RefreshCw } from 'lucide-react';
import DetailTabs from '../../components/DetailTabs';
import CustomTextBox from '../../components/CustomTextBox';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import EditLeaseTermsModal, { type Lease } from './components/EditLeaseTermsModal';
import ResponsibilityModal, { type ResponsibilityItem } from '../../features/Properties/components/ResponsibilityModal';
import AddInsuranceModal from '../../features/Properties/components/AddInsuranceModal';
import FinancialCard, { type FinancialRecord } from './components/FinancialCard';
import PropertyAttachmentsModal from './components/PropertyAttachmentsModal';
import AddEditRecurringRentModal from './components/AddEditRecurringRentModal';
import RentScheduleModal from './components/RentScheduleModal';
import EditExtraFeesModal from './components/EditExtraFeesModal';



export interface Tenant {
    name: string;
    email?: string;
    image?: string;
    description?: string;
    amount?: number;
}

export interface RecurringTransaction {
    id: number;
    isEnabled: boolean;
    frequency: string;
    dueDay: string;
    tenants: { name: string; amount: number }[];
    totalAmount: number;
    category?: string;
    subcategory?: string;
    firstInvoiceDate?: Date;
}

// Mock Data for the view
export const MOCK_LEASE_DETAIL: Lease = {
    id: 5,
    property: {
        name: 'Luxury Apartment',
        id: 101,
        address: '7819 Some Rd, 7819, Indore, MP 452001, IN',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400&h=300',
        startDate: '25-Nov-2025',
        endDate: '25-Nov-2026'
    },
    lease: 'Lease 5', // Added to satisfy Lease interface
    agreements: {
        requested: 'No'
    },
    notices: {
        requested: 'No'
    },
    tenants: [
        {
            name: 'Anil',
            email: 'Anilyas45754@gmail.com',
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            description: 'Tenant has been residing for 2 years. Always pays rent on time. No pets. Works at Tech Corp.'
        },
        {
            name: 'Sarah Smith',
            email: 'sarah.smith@example.com',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
            description: 'Joined recently. Works remotely.'
        }
    ],
    extraFees: {
        label: 'One time',
        amount: '₹5,856.00 Fixed amount'
    },
    recurringRent: [
        {
            status: 'Active',
            firstInvoice: '08-Dec-2025',
            category: 'Rent',
            totalSchedule: '₹ 50,000 /M',
            nextInvoice: '08-Jan-2026'
        }
    ]
};

interface PropertyDetails {
    name: string;
    image?: string;
    address?: string;
    id?: string | number;
    startDate?: string;
    endDate?: string;
}

const isPropertyObject = (property: Lease['property']): property is PropertyDetails => {
    return typeof property === 'object' && property !== null;
};

interface InsuranceData {
    id: number;
    companyName: string;
    companyWebsite: string;
    agentName: string;
    agentEmail: string;
    agentPhone: string;
    policyNumber: string;
    price: string;
    effectiveDate: string;
    expirationDate: string;
    details: string;
    emailNotification: boolean;
}

const LeaseDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('tenants');
    const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEndLeaseModalOpen, setIsEndLeaseModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResponsibilityModalOpen, setIsResponsibilityModalOpen] = useState(false);
    const [responsibilities, setResponsibilities] = useState<ResponsibilityItem[]>([]);
    const [isAddInsuranceModalOpen, setIsAddInsuranceModalOpen] = useState(false);
    const [editingInsuranceId, setEditingInsuranceId] = useState<number | null>(null);
    const [isDeleteInsuranceModalOpen, setIsDeleteInsuranceModalOpen] = useState(false);
    const [insuranceToDelete, setInsuranceToDelete] = useState<number | null>(null);
    const [isPropertyAttachmentsModalOpen, setIsPropertyAttachmentsModalOpen] = useState(false);
    const [attachments, setAttachments] = useState<{ shared: File[], private: File[] }>({ shared: [], private: [] });
    const [isDeleteAttachmentModalOpen, setIsDeleteAttachmentModalOpen] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState<{ index: number, type: 'shared' | 'private' } | null>(null);

    const [isAddEditRecurringRentModalOpen, setIsAddEditRecurringRentModalOpen] = useState(false);
    const [recurringRentModalMode, setRecurringRentModalMode] = useState<'add' | 'edit'>('add');
    const [recurringRentToEdit, setRecurringRentToEdit] = useState<any>(null);
    const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
    const [lease, setLease] = useState<Lease>(MOCK_LEASE_DETAIL);
    const [isDeleteTransactionModalOpen, setIsDeleteTransactionModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<RecurringTransaction | null>(null);

    const handleSaveRecurringTransaction = (data: any) => {
        const newTransaction: RecurringTransaction = {
            id: Date.now(),
            ...data
        };
        // In a real app, you would make an API call here.
        // For 'edit' mode, you would update the existing transaction.
        // For now, we'll just add/update state.
        if (recurringRentModalMode === 'edit' && recurringRentToEdit) {
            // Mock update logic if needed, or just add for now as the requirement implies adding. 
            // But let's be safe and check if we are editing an existing one from the list?
            // The current Edit flow (from top section) seems to mock editing global lease properties.
            // The new "Other recurring transactions" are dynamic. 
            // Let's assume for this specific task of "adding", we just append.
            // If the user edits an item from the NEW list, we'd need more logic. 
            // But the request is "when we add... it should be displayed".
            setRecurringTransactions([...recurringTransactions, newTransaction]);
        } else {
            setRecurringTransactions([...recurringTransactions, newTransaction]);
        }
        setIsAddEditRecurringRentModalOpen(false);
    };

    const handleDeleteTransaction = () => {
        if (transactionToDelete) {
            setRecurringTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
            setIsDeleteTransactionModalOpen(false);
            setTransactionToDelete(null);
        }
    };

    const [isRentScheduleModalOpen, setIsRentScheduleModalOpen] = useState(false);

    const [isEditExtraFeesModalOpen, setIsEditExtraFeesModalOpen] = useState(false);
    const handleSaveExtraFees = (data: any) => {
        setLease(prev => ({
            ...prev,
            extraFees: {
                ...prev.extraFees, // Keep existing fields if any, though we'll likely overwrite main ones
                ...data,
                isConfigured: true
            }
        }));
        setIsEditExtraFeesModalOpen(false);
    };

    const [insurances, setInsurances] = useState<InsuranceData[]>([
        {
            id: 1,
            companyName: 'jay',
            companyWebsite: 'www.jay343@gmail.com',
            agentName: 'vedh',
            agentEmail: 'afsaft@gmail.com',
            agentPhone: '+91 78541 23698',
            policyNumber: '12563',
            price: '1555.00',
            effectiveDate: '27 Nov, 2025',
            expirationDate: '30 Nov, 2025',
            details: '',
            emailNotification: false
        }
    ]);

    const handleSaveInsurance = (data: {
        companyName: string;
        companyWebsite: string;
        agentName: string;
        agentEmail: string;
        agentPhone: string;
        policyNumber: string;
        price: string;
        effectiveDate: string;
        expirationDate: string;
        details: string;
        emailNotification: boolean;
    }) => {
        if (editingInsuranceId) {
            // Update existing
            setInsurances(insurances.map(item =>
                item.id === editingInsuranceId ? { ...item, ...data } : item
            ));
            setEditingInsuranceId(null);
        } else {
            // Create new
            const newRecord: InsuranceData = {
                id: Date.now(),
                ...data
            };
            setInsurances([...insurances, newRecord]);
        }
        setIsAddInsuranceModalOpen(false);
    };

    const handleEditInsurance = (id: number) => {
        setEditingInsuranceId(id);
        setIsAddInsuranceModalOpen(true);
    };

    const handleDeleteInsurance = () => {
        if (insuranceToDelete) {
            setInsurances(insurances.filter(item => item.id !== insuranceToDelete));
            setIsDeleteInsuranceModalOpen(false);
            setInsuranceToDelete(null);
        }
    };

    // Helper to map InsuranceData to FinancialRecord for display
    const mapInsuranceToRecord = (data: InsuranceData): FinancialRecord => {
        return {
            id: data.id,
            headerPills: [
                { label: 'Effective date', value: data.effectiveDate || '-' },
                { label: 'Expiration date', value: data.expirationDate || '-' },
                { label: 'Price', value: data.price ? `₹${data.price} ` : '-' },
            ],
            details: [
                { label: 'Company name', value: data.companyName },
                { label: 'Email notification due to expiration', value: data.emailNotification ? 'Yes' : 'No' },
                { label: 'Phone number', value: data.agentPhone || '-' },
                { label: 'Website', value: data.companyWebsite },
                { label: 'Policy', value: data.policyNumber || '-' },
                { label: 'Details', value: data.details || '-' },
                { label: 'Agent', value: data.agentName || '-' },
                { label: 'Email', value: data.agentEmail || '-' },
            ]
        };
    };
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsActionDropdownOpen(false);
            }
        };

        if (isActionDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isActionDropdownOpen]);

    const handleDeleteAttachment = () => {
        if (attachmentToDelete) {
            setAttachments(prev => {
                const newAttachments = { ...prev };
                if (attachmentToDelete.type === 'shared') {
                    newAttachments.shared = prev.shared.filter((_, i) => i !== attachmentToDelete.index);
                } else {
                    newAttachments.private = prev.private.filter((_, i) => i !== attachmentToDelete.index);
                }
                return newAttachments;
            });
            setIsDeleteAttachmentModalOpen(false);
            setAttachmentToDelete(null);
        }
    };

    const handleDeleteLease = () => {
        // In a real app, make API call here
        console.log('Deleting lease', id);
        setIsDeleteModalOpen(false);
        navigate('/dashboard/portfolio/leases'); // Navigate back to list
    };

    const handleEndLease = () => {
        // In a real app, make API call here
        console.log('Ending lease', id);
        setIsEndLeaseModalOpen(false);
    };

    const handleUpdateLease = (data: Lease) => {
        console.log('Updating lease data:', data);
        // API call to update lease
        setIsEditModalOpen(false);
    };

    // In a real app, use 'id' to fetch data
    // Lease data is now in state 'lease'
    const propertyData = lease.property;
    const propertyDetails = isPropertyObject(propertyData) ? propertyData : null;

    const tabs = [
        { id: 'tenants', label: 'Tenants' },
        { id: 'transactions', label: 'Lease Transactions' },
        { id: 'agreements', label: 'Agreements & Notices' },
        { id: 'insurance', label: 'Insurance' },
        { id: 'utilities', label: 'Utilities' }
    ];

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/portfolio/leases')}>Leases</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{id}</span>
            </div>

            <div className="p-4 sm:p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">{id}</h1>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                            className="flex items-center gap-2 px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                        >
                            Action
                            <ChevronDown className={`w - 4 h - 4 transition - transform ${isActionDropdownOpen ? 'rotate-180' : ''} `} />
                        </button>

                        {isActionDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                <button
                                    onClick={() => {
                                        setIsActionDropdownOpen(false);
                                        setIsEditModalOpen(true);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>

                                <button
                                    onClick={() => {
                                        setIsActionDropdownOpen(false);
                                        navigate(`/ dashboard / leasing / leases / ${id}/end-lease`);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 transition-colors border-b border-gray-50"
                                >
                                    <XCircle className="w-4 h-4" />
                                    End Lease
                                </button >
                                <button
                                    onClick={() => {
                                        setIsActionDropdownOpen(false);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div >
                        )}
                    </div >
                </div >

                {/* Top Section Cards */}
                < div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" >
                    {/* Property Card */}
                    < div className="bg-white rounded-[2rem] p-4 shadow-sm" >
                        <div className="flex gap-4">
                            <img
                                src={propertyDetails && propertyDetails.image ? propertyDetails.image : 'https://images.unsplash.com/photo-1600596542815-2250c385528b?q=80&w=200&auto=format&fit=crop'}
                                alt={propertyDetails ? propertyDetails.name : (typeof propertyData === 'string' ? propertyData : 'Property')}
                                className="w-24 h-24 rounded-2xl object-cover"
                            />
                            <div className="flex flex-col gap-2 flex-1">
                                <h3 className="font-bold text-gray-800 text-sm">
                                    {propertyDetails ? propertyDetails.name : (propertyData as string)}
                                </h3>
                                <div className="w-full min-w-0">
                                    <CustomTextBox
                                        value={propertyDetails ? (propertyDetails.address || '') : ''}
                                        onChange={() => { }}
                                        label=""
                                        placeholder="Address"
                                        multiline={true}
                                        className="bg-[#E0E8E7] py-1 w-full"
                                        valueClassName="text-[10px] text-gray-600 line-clamp-2 leading-tight"
                                    />
                                </div>

                                <button
                                    onClick={() => propertyDetails && propertyDetails.id ? navigate(`/dashboard/properties/${propertyDetails.id}`) : null}
                                    className={`bg-[#3A6D6C] text-white text-xs py-1.5 px-4 rounded-full w-fit hover:bg-[#2c5251] transition-colors ${(!propertyDetails || !propertyDetails.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!propertyDetails || !propertyDetails.id}
                                >
                                    View Property
                                </button>
                                <div className="flex gap-2 text-[10px] text-white font-medium">
                                    <div className="bg-[#3A6D6C] px-2 py-1 rounded-full">
                                        {propertyDetails ? (propertyDetails.startDate || 'N/A') : 'N/A'}
                                    </div>
                                    <span className="text-gray-400 py-1">to</span>
                                    <div className="bg-[#3A6D6C] px-2 py-1 rounded-full">
                                        {propertyDetails ? (propertyDetails.endDate || 'N/A') : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >

                    {/* Lease Agreements Card */}
                    < div className="bg-[#3ACBA4] text-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-between" >
                        <div>
                            <h3 className="font-bold mb-2">Lease agreements</h3>
                            <p className="text-xs opacity-90 mb-4 leading-relaxed">
                                Build a lease addendum, get a state-specific agreement, and request an electronic signature.
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate(`/dashboard/leasing/leases/${id}/send-agreement`)}
                                className="bg-[#2B5251] text-white text-xs py-1.5 px-4 rounded-full hover:bg-opacity-90 transition-colors mb-4"
                            >
                                Request
                            </button>
                            <div className="bg-white/90 rounded-full px-4 py-2 flex justify-between items-center text-xs text-gray-700">
                                <span className="font-medium">Lease agreements requested</span>
                                <span className="font-bold">{lease.agreements.requested}</span>
                            </div>
                        </div>
                    </div >

                    {/* Notices Card */}
                    < div className="bg-[#3ACBA4] text-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-between" >
                        <div>
                            <h3 className="font-bold mb-2">Notices</h3>
                            <p className="text-xs opacity-90 mb-4 leading-relaxed">
                                Easily prepare and send notices through our ready-to-use templates, then request a quick digital signature from your tenant.
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate(`/dashboard/leasing/leases/${id}/send-notice`)}
                                className="bg-[#2B5251] text-white text-xs py-1.5 px-4 rounded-full hover:bg-opacity-90 transition-colors mb-4"
                            >
                                Send
                            </button>
                            <div className="bg-white/90 rounded-full px-4 py-2 flex justify-between items-center text-xs text-gray-700">
                                <span className="font-medium">Notices requested</span>
                                <span className="font-bold">{lease.notices.requested}</span>
                            </div>
                        </div>
                    </div >
                </div >

                {/* Tabs */}
                < DetailTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />


                {/* Tab Content - Tenants */}
                {
                    activeTab === 'tenants' && (
                        <div className="space-y-6">
                            {/* Tenant Information Section */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                    <h2 className="text-lg font-bold text-gray-800">Tenant information</h2>
                                    <ChevronDown className="w-5 h-5 text-gray-800" />
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {lease.tenants.map((tenant: Tenant, index: number) => (
                                        <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#F0F0F6] rounded-lg p-6">
                                            {/* Tenant Profile Card */}
                                            <div className="bg-[#7BD747] rounded-lg p-6 flex flex-col items-center text-center shadow-sm h-full">
                                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-3">
                                                    <img src={tenant.image} alt={tenant.name} className="w-full h-full object-cover" />
                                                </div>
                                                <h3 className="text-white font-bold text-lg mb-1">{tenant.name}</h3>
                                                <p className="text-white/90 text-xs">{tenant.email}</p>
                                            </div>

                                            {/* Details Section */}
                                            <div className="md:col-span-2">
                                                <CustomTextBox
                                                    value={tenant.description}
                                                    onChange={() => { }}
                                                    multiline={true}
                                                    className="w-full h-full rounded-lg p-6 items-start"
                                                    valueClassName="text-sm pl-0 w-full block"
                                                />
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex justify-center lg:col-span-3">
                                                <div className="bg-[#b5e39e] text-[#3D7475] text-xs font-bold px-5 py-3 rounded-full w-min">
                                                    Pending
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dependents Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                    <h2 className="text-lg font-bold text-gray-800">Dependents</h2>
                                    <ChevronDown className="w-5 h-5 text-gray-800" />
                                </div>

                                <div className="bg-[#F0F2F5] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-inner min-h-[200px]">
                                    <div className="bg-white p-3 rounded-xl mb-3 shadow-sm">
                                        <FileText className="w-6 h-6 text-[#3A6D6C]" />
                                    </div>
                                    <h3 className="text-[#3A6D6C] font-semibold mb-1">No dependents added</h3>
                                    <p className="text-gray-500 text-xs text-center max-w-xs">
                                        Tenant does not have any dependents.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Tab Content - Lease Transactions */}
                {
                    activeTab === 'transactions' && (
                        <div className="space-y-8">
                            {/* Recurring Rent */}
                            <div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <h2 className="text-lg font-bold text-gray-800">Recurring Rent</h2>
                                        <ChevronDown className="w-5 h-5 text-gray-800" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                // MOCK: Pass existing data including tenants for Edit mode
                                                const existingData = {
                                                    tenants: lease.tenants.map((t: Tenant) => ({ name: t.name, amount: 2000 })), // Mock amount
                                                    frequency: 'Monthly',
                                                    dueDay: '1st',
                                                    isEnabled: true
                                                };
                                                setRecurringRentToEdit(existingData);
                                                setRecurringRentModalMode('edit');
                                                setIsAddEditRecurringRentModalOpen(true);
                                            }}
                                            className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                        >
                                            <Pencil className="w-3 h-3" />
                                            Edit recurring rent
                                        </button>
                                        <button
                                            onClick={() => setIsRentScheduleModalOpen(true)}
                                            className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                        >
                                            <Clock className="w-3 h-3" />
                                            Schedule amount update
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-[#F0F2F5] rounded-[1.5rem] overflow-hidden shadow-sm">
                                    {/* Table Header */}
                                    <div className="bg-[#3A6D6C] text-white px-6 py-4 hidden md:grid grid-cols-5 text-xs font-semibold text-center">
                                        <div>Status</div>
                                        <div>First invoice</div>
                                        <div>Category</div>
                                        <div>Next invoice</div>
                                        <div>Total & Schedule</div>
                                    </div>
                                    {/* Table Body */}
                                    <div className="p-2">
                                        {lease.recurringRent.map((rent: any, index: number) => (
                                            <div key={index} className="bg-white rounded-xl px-6 py-4 shadow-sm mb-2 last:mb-0 block md:grid md:grid-cols-5 md:items-center md:text-center text-sm font-medium">
                                                {/* Mobile View */}
                                                <div className="md:hidden flex flex-col gap-2">
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
                                                        <span className="font-bold text-gray-800">{rent.category}</span>
                                                        <span className="text-[#7BD747] font-bold text-xs bg-green-50 px-2 py-1 rounded-full">{rent.status}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                                        <div>
                                                            <span className="block text-gray-400 text-[10px]">First Invoice</span>
                                                            {rent.firstInvoice}
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block text-gray-400 text-[10px]">Next Invoice</span>
                                                            {rent.nextInvoice || '--'}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-right">
                                                        <span className="block text-gray-400 text-[10px]">Total & Schedule</span>
                                                        <span className="text-[#3A6D6C] font-bold">{rent.totalSchedule}</span>
                                                    </div>
                                                </div>

                                                {/* Desktop View */}
                                                <div className="text-[#7BD747] hidden md:block">{rent.status}</div>
                                                <div className="hidden md:block">{rent.firstInvoice}</div>
                                                <div className="hidden md:block">{rent.category}</div>
                                                <div className="text-gray-400 hidden md:block">{rent.nextInvoice || '--'}</div>
                                                <div className="hidden md:block">{rent.totalSchedule}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Other recurring transactions */}
                            <div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-gray-800">Other recurring transactions</h2>
                                        <ChevronDown className="w-5 h-5 text-gray-800" />
                                    </div>
                                    <button
                                        onClick={() => {
                                            // Pre-fill with lease tenant(s) for "Add" mode
                                            const defaultTenants = lease.tenants.map((t: Tenant) => ({
                                                name: t.name,
                                                amount: 0
                                            }));
                                            setRecurringRentToEdit({ tenants: defaultTenants });
                                            setRecurringRentModalMode('add');
                                            setIsAddEditRecurringRentModalOpen(true);
                                        }}
                                        className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add recurring transaction
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {recurringTransactions.length === 0 ? (
                                        <div className="bg-[#F0F2F5] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                                            <div className="bg-[#EAEAEA] p-8 rounded-xl flex flex-col items-center mb-0">
                                                <SquarePen className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                                <p className="text-[#3A6D6C] font-medium text-sm">No enabled recurring invoice yet</p>
                                            </div>
                                        </div>
                                    ) : (
                                        recurringTransactions.map((transaction) => (
                                            <div key={transaction.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4 sm:gap-0">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-gray-800 text-lg">{transaction.category || 'Rent'}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${transaction.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                {transaction.isEnabled ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        <div className="text-gray-500 text-xs text-left">
                                                            {transaction.subcategory ? <span className="block font-medium text-gray-700">{transaction.subcategory}</span> : null}
                                                            {transaction.frequency} • Due on {transaction.dueDay}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setRecurringRentToEdit(transaction);
                                                                    setRecurringRentModalMode('edit');
                                                                    setIsAddEditRecurringRentModalOpen(true);
                                                                }}
                                                                className="p-1.5 text-gray-400 hover:text-[#3A6D6C] hover:bg-gray-50 rounded-full transition-colors"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setTransactionToDelete(transaction);
                                                                    setIsDeleteTransactionModalOpen(true);
                                                                }}
                                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[#3A6D6C] font-bold text-lg">₹{transaction.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                                            <div className="text-gray-400 text-xs">Total Amount</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-100 pt-4">
                                                    <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide text-left">Tenants Split</div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {transaction.tenants.map((tenant, idx) => (
                                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                                                <span className="text-gray-700 font-medium text-sm">{tenant.name}</span>
                                                                <span className="text-gray-900 font-bold text-sm">₹{tenant.amount.toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Extra fees */}
                            <div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <h2 className="text-lg font-bold text-gray-800">Extra fees</h2>
                                        <ChevronDown className="w-5 h-5 text-gray-800" />
                                    </div>
                                    <button
                                        onClick={() => setIsEditExtraFeesModalOpen(true)}
                                        className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <Pencil className="w-3 h-3" />
                                        Edit
                                    </button>
                                </div>
                                <div className="bg-[#F0F2F5] rounded-[2rem] p-4">
                                    <div className="bg-white/50 rounded-[2rem] sm:rounded-full px-6 py-4 sm:py-3 flex flex-col sm:flex-row items-center sm:justify-start gap-4 sm:gap-12 shadow-sm min-h-[80px]">
                                        <div className="bg-[#b5e39e] text-[#3D7475] text-xs font-bold px-6 py-2 rounded-full min-w-[100px] text-center mb-2 sm:mb-0">
                                            Late fees
                                        </div>
                                        <div className="flex-1 w-full sm:w-auto text-sm text-gray-700">
                                            {(lease.extraFees as any).isConfigured || (lease.extraFees as any).oneTimeFee ? (
                                                <div className="flex flex-col gap-1 w-full">
                                                    {(lease.extraFees as any).oneTimeFee?.enabled && (
                                                        <div className="flex justify-between w-full">
                                                            <span><span className="font-semibold">One Time:</span> {(lease.extraFees as any).oneTimeFee.amount}{(lease.extraFees as any).oneTimeFee.type.includes('Percentage') ? '%' : ''} ({(lease.extraFees as any).oneTimeFee.type})</span>
                                                        </div>
                                                    )}
                                                    {(lease.extraFees as any).dailyFee?.enabled && (
                                                        <div className="flex justify-between w-full">
                                                            <span><span className="font-semibold">Daily:</span> {(lease.extraFees as any).dailyFee.amount}{(lease.extraFees as any).dailyFee.type.includes('Percentage') ? '%' : ''} ({(lease.extraFees as any).dailyFee.type})</span>
                                                            {Number((lease.extraFees as any).dailyFee.maxBalance) > 0 && <span className="text-gray-500 text-xs ml-2">(Max: ₹{(lease.extraFees as any).dailyFee.maxBalance})</span>}
                                                        </div>
                                                    )}
                                                    {!((lease.extraFees as any).oneTimeFee?.enabled) && !((lease.extraFees as any).dailyFee?.enabled) && (
                                                        <span className="text-gray-500 italic">No active late fees</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <span className="font-semibold">{lease.extraFees?.label}:</span>
                                                    <span>{lease.extraFees?.amount}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Tab Content - Agreements & Notices */}
                {
                    activeTab === 'agreements' && (
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <h2 className="text-lg font-bold text-gray-800">Property Attachments</h2>
                                        <ChevronDown className="w-5 h-5 text-gray-800" />
                                    </div>
                                    <button
                                        onClick={() => setIsPropertyAttachmentsModalOpen(true)}
                                        className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add
                                    </button>
                                </div>

                                {(attachments.shared.length === 0 && attachments.private.length === 0) ? (
                                    <div className="bg-[#F0F2F5] rounded-[2rem] p-8 min-h-[300px] flex items-center justify-center">
                                        <div className="bg-[#EAEAEA] w-full max-w-md rounded-2xl p-12 flex flex-col items-center justify-center">
                                            <SquarePen className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                            <p className="text-[#3A6D6C] font-medium text-xs">No documents</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Shared Attachments List */}
                                        {attachments.shared.length > 0 && (
                                            <div className="bg-[#F0F2F5] rounded-[2rem] p-6">
                                                <h3 className="font-bold text-gray-800 mb-4 ml-2">Shared Attachments</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {attachments.shared.map((file, index) => (
                                                        <div key={`shared-${index}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 group relative">
                                                            <div className="w-10 h-10 rounded-full bg-[#E3EBDE] flex items-center justify-center text-[#3A6D6C] shrink-0">
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                                                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setAttachmentToDelete({ index, type: 'shared' });
                                                                    setIsDeleteAttachmentModalOpen(true);
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Private Attachments List */}
                                        {attachments.private.length > 0 && (
                                            <div className="bg-[#F0F2F5] rounded-[2rem] p-6">
                                                <h3 className="font-bold text-gray-800 mb-4 ml-2">Private Attachments</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {attachments.private.map((file, index) => (
                                                        <div key={`private-${index}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 group relative">
                                                            <div className="w-10 h-10 rounded-full bg-[#E3EBDE] flex items-center justify-center text-[#3A6D6C] shrink-0">
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                                                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setAttachmentToDelete({ index, type: 'private' });
                                                                    setIsDeleteAttachmentModalOpen(true);
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

                {/* Tab Content - Insurance */}
                {
                    activeTab === 'insurance' && (
                        <div className="space-y-6">
                            {/* Insurances Section */}
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <h2 className="text-lg font-bold text-gray-800">Renters insurance</h2>
                                        <ChevronDown className="w-5 h-5 text-gray-800" />
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingInsuranceId(null);
                                            setIsAddInsuranceModalOpen(true);
                                        }}
                                        className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add
                                    </button>
                                </div>

                                {insurances.length === 0 ? (
                                    <div className="bg-[#F0F2F5] rounded-[2rem] p-8 min-h-[300px] flex items-center justify-center">
                                        <div className="bg-[#EAEAEA] w-full max-w-md rounded-2xl p-12 flex flex-col items-center justify-center">
                                            <SquarePen className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                            <p className="text-[#3A6D6C] font-medium text-xs">No insurances</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-[#F0F2F5] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-sm">
                                        {insurances.map(item => (
                                            <FinancialCard
                                                key={item.id}
                                                record={mapInsuranceToRecord(item)}
                                                onEdit={() => handleEditInsurance(item.id)}
                                                onDelete={() => {
                                                    setInsuranceToDelete(item.id);
                                                    setIsDeleteInsuranceModalOpen(true);
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

                {/* Tab Content - Utilities */}
                {
                    activeTab === 'utilities' && (
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <h2 className="text-lg font-bold text-gray-800">Responsibility</h2>
                                        <ChevronDown className="w-5 h-5 text-gray-800" />
                                    </div>
                                    <button
                                        onClick={() => setIsResponsibilityModalOpen(true)}
                                        className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        {responsibilities.length > 0 ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                        {responsibilities.length > 0 ? "Edit" : "Add"}
                                    </button>
                                </div>

                                {responsibilities.length === 0 ? (
                                    <div className="bg-[#F0F2F5] rounded-[2rem] p-8 min-h-[300px] flex items-center justify-center">
                                        <div className="bg-[#EAEAEA] w-full max-w-md rounded-2xl p-12 flex flex-col items-center justify-center">
                                            <RefreshCw className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                            <p className="text-[#3A6D6C] font-medium text-xs">No utilities added</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-[#F0F2F5] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-sm">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                            {responsibilities.map((item, index) => (
                                                <div key={index} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#E3EBDE] flex items-center justify-center text-[#3A6D6C]">
                                                            <span className="font-bold text-xs">{item.utility.charAt(0)}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{item.utility}</p>
                                                            <p className="text-xs font-medium text-gray-500">{item.payer}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-2 h-2 rounded-full ${item.payer === 'Landlord' ? 'bg-[#4CAF50]' : 'bg-blue-500'}`}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </div >
            {/* Confirmation Modals */}
            < DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteLease}
                title="Delete Lease"
                message="Are you sure you want to delete this lease? This action cannot be undone."
                itemName={`Lease #${id}`}
            />

            < DeleteConfirmationModal
                isOpen={isEndLeaseModalOpen}
                onClose={() => setIsEndLeaseModalOpen(false)}
                onConfirm={handleEndLease}
                title="End Lease"
                message="Are you sure you want to end this lease? This will change the status to historical."
                confirmText="End Lease"
                confirmButtonClass="bg-orange-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-sm"
            />

            <EditLeaseTermsModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={{
                    ...lease,
                    property: typeof lease.property === 'object' ? lease.property.name : lease.property,
                    lease: lease.lease
                }}
                onUpdate={handleUpdateLease}
            />

            <ResponsibilityModal
                isOpen={isResponsibilityModalOpen}
                onClose={() => setIsResponsibilityModalOpen(false)}
                initialData={responsibilities}
                onSave={setResponsibilities}
            />

            <AddInsuranceModal
                isOpen={isAddInsuranceModalOpen}
                onClose={() => {
                    setIsAddInsuranceModalOpen(false);
                    setEditingInsuranceId(null);
                }}
                onAdd={handleSaveInsurance}
                initialData={editingInsuranceId ? insurances.find(i => i.id === editingInsuranceId) : undefined}
            />

            <PropertyAttachmentsModal
                isOpen={isPropertyAttachmentsModalOpen}
                onClose={() => setIsPropertyAttachmentsModalOpen(false)}
                onUpdate={(files) => {
                    console.log('Files updated:', files);
                    setAttachments(files);
                    setIsPropertyAttachmentsModalOpen(false);
                }}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteInsuranceModalOpen}
                onClose={() => setIsDeleteInsuranceModalOpen(false)}
                onConfirm={handleDeleteInsurance}
                title="Delete Insurance"
                message="Are you sure you want to delete this insurance record?"
                itemName={insuranceToDelete ? insurances.find(i => i.id === insuranceToDelete)?.companyName || 'Insurance' : 'Insurance'}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteAttachmentModalOpen}
                onClose={() => setIsDeleteAttachmentModalOpen(false)}
                onConfirm={handleDeleteAttachment}
                title="Delete Attachment"
                message="Are you sure you want to delete this document?"
                itemName={attachmentToDelete ? (
                    attachmentToDelete.type === 'shared'
                        ? attachments.shared[attachmentToDelete.index]?.name
                        : attachments.private[attachmentToDelete.index]?.name
                ) : 'Document'}
            />

            <AddEditRecurringRentModal
                isOpen={isAddEditRecurringRentModalOpen}
                onClose={() => {
                    setIsAddEditRecurringRentModalOpen(false);
                    setRecurringRentToEdit(null);
                }}
                onSave={handleSaveRecurringTransaction}
                initialData={recurringRentToEdit}
                mode={recurringRentModalMode}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteTransactionModalOpen}
                onClose={() => setIsDeleteTransactionModalOpen(false)}
                onConfirm={handleDeleteTransaction}
                title="Delete Recurring Transaction"
                message="Are you sure you want to delete this recurring transaction?"
                itemName={transactionToDelete ? (transactionToDelete.category || 'Transaction') : 'Transaction'}
            />

            <RentScheduleModal
                isOpen={isRentScheduleModalOpen}
                onClose={() => setIsRentScheduleModalOpen(false)}
                onConfirm={(schedules) => {
                    console.log('Rent schedules confirmed:', schedules);
                    setIsRentScheduleModalOpen(false);
                }}
                currentRent={12000} // Example value, should come from lease data
                initialTenants={lease.tenants}
            />

            <EditExtraFeesModal
                isOpen={isEditExtraFeesModalOpen}
                onClose={() => setIsEditExtraFeesModalOpen(false)}
                onSave={handleSaveExtraFees}
                initialData={lease.extraFees}
            />
        </div >
    );
};

export default LeaseDetail;
