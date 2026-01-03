import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, FileText, ChevronDown, SquarePen, Upload, Edit, Trash2, ClipboardCheck, XCircle } from 'lucide-react';
import DetailTabs from '../../components/DetailTabs';
import CustomTextBox from '../../components/CustomTextBox';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import EditLeaseTermsModal from './components/EditLeaseTermsModal';


// Mock Data for the view
const MOCK_LEASE_DETAIL = {
    id: 5,
    property: {
        name: 'Luxury Apartment',
        id: 101,
        address: '7819 Some Rd, 7819, Indore, MP 452001, IN',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400&h=300',
        startDate: '25-Nov-2025',
        endDate: '25-Nov-2026'
    },
    agreements: {
        requested: 'No'
    },
    notices: {
        requested: 'No'
    },
    tenant: {
        name: 'Anil',
        email: 'Anilyas45754@gmail.com',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        description: 'Tenant has been residing for 2 years. Always pays rent on time. No pets. Works at Tech Corp.'
    },
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

const LeaseDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('tenants');
    const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEndLeaseModalOpen, setIsEndLeaseModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

    const handleUpdateLease = (data: any) => {
        console.log('Updating lease data:', data);
        // API call to update lease
        setIsEditModalOpen(false);
    };

    // In a real app, use 'id' to fetch data
    const lease = MOCK_LEASE_DETAIL;

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
                            <ChevronDown className={`w-4 h-4 transition-transform ${isActionDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isActionDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                <button
                                    onClick={() => {
                                        setIsActionDropdownOpen(false);
                                        // navigate(`/dashboard/portfolio/leases/edit/${id}`);
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
                                        // Handle inspection - Placeholder
                                        console.log('Move-out inspection clicked');
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50"
                                >
                                    <ClipboardCheck className="w-4 h-4" />
                                    Move-out Inspection
                                </button>
                                <button
                                    onClick={() => {
                                        setIsActionDropdownOpen(false);
                                        setIsEndLeaseModalOpen(true);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 transition-colors border-b border-gray-50"
                                >
                                    <XCircle className="w-4 h-4" />
                                    End Lease
                                </button>
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
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Section Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Property Card */}
                    <div className="bg-white rounded-[2rem] p-4 shadow-sm">
                        <div className="flex gap-4">
                            <img src={lease.property.image} alt={lease.property.name} className="w-24 h-24 rounded-2xl object-cover" />
                            <div className="flex flex-col gap-2 flex-1">
                                <h3 className="font-bold text-gray-800 text-sm">{lease.property.name}</h3>
                                <div className="w-full min-w-0">
                                    <CustomTextBox
                                        value={lease.property.address}
                                        onChange={() => { }}
                                        label=""
                                        placeholder="Address"
                                        multiline={true}
                                        className="bg-[#E0E8E7] py-1 w-full"
                                        valueClassName="text-[10px] text-gray-600 line-clamp-2 leading-tight"
                                    />
                                </div>

                                <button
                                    onClick={() => navigate(`/dashboard/properties/${lease.property.id}`)}
                                    className="bg-[#3A6D6C] text-white text-xs py-1.5 px-4 rounded-full w-fit hover:bg-[#2c5251] transition-colors"
                                >
                                    View Property
                                </button>
                                <div className="flex gap-2 text-[10px] text-white font-medium">
                                    <div className="bg-[#3A6D6C] px-2 py-1 rounded-full">{lease.property.startDate}</div>
                                    <span className="text-gray-400 py-1">to</span>
                                    <div className="bg-[#3A6D6C] px-2 py-1 rounded-full">{lease.property.endDate}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lease Agreements Card */}
                    <div className="bg-[#3ACBA4] text-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold mb-2">Lease agreements</h3>
                            <p className="text-xs opacity-90 mb-4 leading-relaxed">
                                Build a lease addendum, get a state-specific agreement, and request an electronic signature.
                            </p>
                        </div>
                        <div>
                            <button className="bg-[#2B5251] text-white text-xs py-1.5 px-4 rounded-full hover:bg-opacity-90 transition-colors mb-4">
                                Request
                            </button>
                            <div className="bg-white/90 rounded-full px-4 py-2 flex justify-between items-center text-xs text-gray-700">
                                <span className="font-medium">Lease agreements requested</span>
                                <span className="font-bold">{lease.agreements.requested}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notices Card */}
                    <div className="bg-[#3ACBA4] text-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold mb-2">Notices</h3>
                            <p className="text-xs opacity-90 mb-4 leading-relaxed">
                                Easily prepare and send notices through our ready-to-use templates, then request a quick digital signature from your tenant.
                            </p>
                        </div>
                        <div>
                            <button className="bg-[#2B5251] text-white text-xs py-1.5 px-4 rounded-full hover:bg-opacity-90 transition-colors mb-4">
                                Request
                            </button>
                            <div className="bg-white/90 rounded-full px-4 py-2 flex justify-between items-center text-xs text-gray-700">
                                <span className="font-medium">Notices requested</span>
                                <span className="font-bold">{lease.notices.requested}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <DetailTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />


                {/* Tab Content - Tenants */}
                {activeTab === 'tenants' && (
                    <div className="space-y-6">
                        {/* Tenant Information Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                <h2 className="text-lg font-bold text-gray-800">Tenant information</h2>
                                <ChevronDown className="w-5 h-5 text-gray-800" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#F0F0F6] rounded-lg p-6">
                                {/* Tenant Profile Card */}
                                <div className="bg-[#7BD747] rounded-lg p-6 flex flex-col items-center text-center shadow-sm h-full">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-3">
                                        <img src={lease.tenant.image} alt={lease.tenant.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">{lease.tenant.name}</h3>
                                    <p className="text-white/90 text-xs">{lease.tenant.email}</p>
                                </div>

                                {/* Details Section */}
                                <div className="md:col-span-2">
                                    <CustomTextBox
                                        value={lease.tenant.description}
                                        onChange={() => { }}
                                        multiline={true}
                                        className="w-full h-full rounded-lg p-6 items-start"
                                        valueClassName="text-sm pl-0 w-full block"
                                    />
                                </div>

                                {/* Status Badge */}
                                <div className="flex justify-center">
                                    <div className="bg-[#b5e39e] text-[#3D7475] text-xs font-bold px-5 py-3 rounded-full w-min">
                                        Pendiings
                                    </div>
                                </div>
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
                )}

                {/* Tab Content - Lease Transactions */}
                {activeTab === 'transactions' && (
                    <div className="space-y-8">
                        {/* Recurring Rent */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                <h2 className="text-lg font-bold text-gray-800">Recurring Rent</h2>
                                <ChevronDown className="w-5 h-5 text-gray-800" />
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
                                    {lease.recurringRent.map((rent, index) => (
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
                            <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                <h2 className="text-lg font-bold text-gray-800">Other recurring transactions</h2>
                                <ChevronDown className="w-5 h-5 text-gray-800" />
                            </div>
                            <div className="bg-[#F0F2F5] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                                <div className="bg-[#EAEAEA] p-8 rounded-xl flex flex-col items-center mb-0">
                                    <SquarePen className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                    <p className="text-[#3A6D6C] font-medium text-sm">No enabled recurring invoice yet</p>
                                </div>
                            </div>
                        </div>

                        {/* Extra fees */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                <h2 className="text-lg font-bold text-gray-800">Extra fees</h2>
                                <ChevronDown className="w-5 h-5 text-gray-800" />
                            </div>
                            <div className="bg-[#F0F2F5] rounded-[2rem] p-4">
                                <div className="bg-white/50 rounded-[2rem] sm:rounded-full px-6 py-4 sm:py-3 flex flex-col sm:flex-row items-center sm:justify-start gap-4 sm:gap-12 shadow-sm">
                                    <div className="bg-[#b5e39e] text-[#3D7475] text-xs font-bold px-6 py-2 rounded-full min-w-[100px] text-center mb-2 sm:mb-0">
                                        Late fees
                                    </div>
                                    <div className="flex-1 w-full sm:w-auto">
                                        <CustomTextBox
                                            label={lease.extraFees.label}
                                            value={lease.extraFees.amount}
                                            onChange={() => { }}
                                            labelClassName="text-xs font-medium text-gray-600 !w-auto"
                                            valueClassName="text-xs font-medium text-gray-600 !w-auto !overflow-visible !whitespace-normal sm:!whitespace-nowrap"
                                            className="px-4 py-2 gap-2 sm:gap-4 rounded-full w-full sm:w-auto flex-col sm:flex-row items-start sm:items-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content - Agreements & Notices */}
                {activeTab === 'agreements' && (
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                <h2 className="text-lg font-bold text-gray-800">Property Attachments</h2>
                                <ChevronDown className="w-5 h-5 text-gray-800" />
                            </div>

                            <div className="bg-[#F0F2F5] rounded-[2rem] p-8 min-h-[300px] flex items-center justify-center">
                                <div className="bg-[#EAEAEA] w-full max-w-md rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-opacity-80 transition-colors border-2 border-dashed border-gray-300 hover:border-[#3A6D6C]">
                                    <Upload className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                    <p className="text-[#3A6D6C] font-medium text-xs">Upload Cover Photos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content - Insurance */}
                {activeTab === 'insurance' && (
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                <h2 className="text-lg font-bold text-gray-800">Renters insurance</h2>
                                <ChevronDown className="w-5 h-5 text-gray-800" />
                            </div>

                            <div className="bg-[#F0F2F5] rounded-[2rem] p-8 min-h-[300px] flex items-center justify-center">
                                <div className="bg-[#EAEAEA] w-full max-w-md rounded-2xl p-12 flex flex-col items-center justify-center">
                                    <SquarePen className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                    <p className="text-[#3A6D6C] font-medium text-xs">No insurances</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content - Utilities */}
                {activeTab === 'utilities' && (
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                <h2 className="text-lg font-bold text-gray-800">Responsibility</h2>
                                <ChevronDown className="w-5 h-5 text-gray-800" />
                            </div>

                            <div className="bg-[#F0F2F5] rounded-[2rem] p-8 min-h-[300px] flex items-center justify-center">
                                <div className="bg-[#EAEAEA] w-full max-w-md rounded-2xl p-12 flex flex-col items-center justify-center">
                                    <SquarePen className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                    <p className="text-[#3A6D6C] font-medium text-xs">No utilities</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Confirmation Modals */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteLease}
                title="Delete Lease"
                message="Are you sure you want to delete this lease? This action cannot be undone."
                itemName={`Lease #${id}`}
            />

            <DeleteConfirmationModal
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
                initialData={lease} // Pass current lease data
                onUpdate={handleUpdateLease}
            />
        </div >
    );
};

export default LeaseDetail;
