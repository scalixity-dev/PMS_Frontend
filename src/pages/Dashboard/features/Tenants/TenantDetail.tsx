import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Loader2 } from 'lucide-react';
import DetailTabs from '../../components/DetailTabs';
import TenantProfileSection from './components/TenantProfileSection';
import TenantLeasesSection from './components/TenantLeasesSection';
import TenantTransactionsSection from './components/TenantTransactionsSection';
import TenantInsuranceSection from './components/TenantInsuranceSection';
import TenantApplicationsSection from './components/TenantApplicationsSection';
import TenantRequestsSection from './components/TenantRequestsSection';
import { useGetTenant, useDeleteTenant } from '../../../../hooks/useTenantQueries';
import type { BackendTenantProfile } from '../../../../services/tenant.service';

// Transform backend tenant profile to detail page format
const transformTenantForDetail = (backendTenant: BackendTenantProfile) => {
    const email = backendTenant.user?.email || backendTenant.contactBookEntry?.email || 'N/A';
    const phone = backendTenant.phoneNumber 
        ? `${backendTenant.phoneCountryCode || ''}${backendTenant.phoneNumber}`.trim() 
        : 'N/A';
    const name = [backendTenant.firstName, backendTenant.middleName, backendTenant.lastName]
        .filter(Boolean)
        .join(' ');

    return {
        id: Number(backendTenant.id) || 0, // Convert string ID to number for compatibility
        name,
        phone,
        email,
        image: backendTenant.profilePhotoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
        outstanding: 0, // TODO: Calculate from transactions
        deposits: 0, // TODO: Calculate from deposits
        credits: 0, // TODO: Calculate from credits
        personalInfo: {
            firstName: backendTenant.firstName,
            middleName: backendTenant.middleName || '',
            lastName: backendTenant.lastName,
            email: email,
            additionalEmail: '-', // Not in backend model
            phone: phone,
            additionalPhone: '-', // Not in backend model
            companyName: '-', // Not in backend model
            dateOfBirth: '-', // Not in backend model
            companyName2: '-'
        },
        forwardingAddress: backendTenant.forwardingAddress || '-',
        emergencyContacts: backendTenant.emergencyContacts.map(contact => ({
            name: contact.name,
            phone: contact.phoneNumber,
            relationship: contact.relationship,
            email: contact.email || '-'
        })),
        pets: backendTenant.pets.map(pet => ({
            name: pet.name,
            breed: pet.breed || '-',
            type: pet.type,
            weight: pet.weight ? String(pet.weight) : '-'
        })),
        vehicles: backendTenant.vehicles.map(vehicle => ({
            type: vehicle.type,
            year: vehicle.year ? String(vehicle.year) : '-',
            make: vehicle.make,
            color: vehicle.color || '-',
            registeredIn: vehicle.registeredIn || '-',
            license: vehicle.licensePlate
        }))
    };
};

const TenantDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('profile');
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const deleteTenantMutation = useDeleteTenant();

    // Fetch tenant data using API
    const { data: backendTenant, isLoading, error } = useGetTenant(id || null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setIsActionMenuOpen(false);
            }
        };

        if (isActionMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isActionMenuOpen]);

    const handleDeleteTenant = async () => {
        if (id && window.confirm('Are you sure you want to delete this tenant?')) {
            try {
                await deleteTenantMutation.mutateAsync(id);
                navigate('/dashboard/contacts/tenants');
            } catch (err) {
                console.error('Failed to delete tenant:', err);
                alert(`Failed to delete tenant: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    const menuItems = [
        { label: 'Edit', action: () => navigate(`/dashboard/contacts/tenants/edit/${id}`) },
        { label: 'Send connection', action: () => { } },
        { label: 'Move in', action: () => navigate(`/dashboard/movein?tenantId=${id}`) },
        { label: 'Add invoice', action: () => navigate(`/dashboard/accounting/transactions/income/add?tenantId=${id}`) },
        { label: 'Add insurance', action: () => { } },
        { label: 'Archive', action: () => { } },
        {
            label: 'Delete',
            action: handleDeleteTenant,
            isDestructive: true
        },
    ];

    // Transform backend tenant to detail page format
    const tenant = useMemo(() => {
        if (!backendTenant) return null;
        return transformTenantForDetail(backendTenant);
    }, [backendTenant]);

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'leases', label: 'Leases' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'insurance', label: 'Insurance' },
        { id: 'applications', label: 'Applications' },
        { id: 'requests', label: 'Requests' }
    ];

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                    <p className="text-gray-600">Loading tenant details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !tenant) {
        return (
            <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800 text-sm">
                        {error instanceof Error ? error.message : 'Failed to load tenant details. Please try again.'}
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/contacts/tenants')}
                        className="mt-4 px-4 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                    >
                        Back to Tenants
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/contacts/tenants')}>Tenants</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{tenant.name}</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Tenant</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/dashboard/accounting/transactions/income/add', {
                                state: {
                                    prefilledPayer: {
                                        id: tenant.id,
                                        label: tenant.name,
                                        type: 'tenant'
                                    },
                                    prefilledLease: 'Lease #101' // Mock lease for now
                                }
                            })}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                        >
                            Add Invoice
                            <Plus className="w-4 h-4" />
                        </button>
                        <div className="relative" ref={actionMenuRef}>
                            <button
                                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                            >
                                Action
                            </button>
                            {isActionMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden">
                                    {menuItems.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                item.action();
                                                setIsActionMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-b border-gray-50 last:border-none
                                                ${item.isDestructive
                                                    ? 'text-red-600 hover:bg-red-50'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='shadow-lg rounded-[2rem] p-6 mb-8'>
                    {/* Top Card */}
                    <div className="bg-[#F6F6F8] rounded-[2rem] shadow-lg p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Tenant Info */}
                            <div className="flex gap-6 items-start">
                                <img src={tenant.image} alt={tenant.name} className="w-32 h-32 rounded-2xl object-cover" />
                                <div className="flex flex-col gap-3">
                                    <div className="bg-[#3A6D6C] text-white p-4 rounded-xl text-center min-w-[200px]">
                                        <h2 className="font-bold text-lg">{tenant.name}</h2>
                                        <p className="text-xs opacity-90">{tenant.phone}</p>
                                        <p className="text-xs opacity-90">{tenant.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActiveTab('profile');
                                            // Scroll to profile section after a brief delay to ensure tab is rendered
                                            setTimeout(() => {
                                                const profileSection = document.getElementById('profile-section');
                                                if (profileSection) {
                                                    profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }
                                            }, 100);
                                        }}
                                        className="w-full bg-[#C8C8C8] text-gray-700 py-2 rounded-full text-sm font-medium hover:bg-[#b8b8b8] transition-colors shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>

                            {/* Stats & Reports */}
                            <div className="flex-1 flex flex-col justify-between gap-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between h-18 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                        <span className="text-xs font-semibold text-white">Outstanding</span>
                                        <div className="flex justify-between items-center">
                                            <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">₹{tenant.outstanding.toLocaleString()}.00</div>
                                            <button className="bg-[#3A6D6C] text-white px-3 py-1 rounded-full text-[10px] font-medium uppercase shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Received</button>
                                        </div>
                                    </div>
                                    <div className="bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between h-18 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                        <span className="text-xs font-semibold text-white">Deposits</span>
                                        <div className="flex justify-between items-center">
                                            <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">₹{tenant.deposits.toLocaleString()}.00</div>
                                            <button className="bg-[#3A6D6C] text-white px-3 py-1 rounded-full text-[10px] font-medium uppercase shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Action</button>
                                        </div>
                                    </div>
                                    <div className="bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between h-18 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                        <span className="text-xs font-semibold text-white">Credits</span>
                                        <div className="flex justify-between items-center">
                                            <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">₹{tenant.credits.toLocaleString()}.00</div>
                                            <button className="bg-[#3A6D6C] text-white px-3 py-1 rounded-full text-[10px] font-medium uppercase shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Action</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#E4E4E4] rounded-[3.5rem] p-4 shadow-lg">
                                    <h3 className="text-gray-700 font-bold mb-2 ml-1">Reports</h3>
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between min-h-[5rem] shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white">Financial</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="bg-[#E8F5E9] px-4 py-1 rounded-full text-xs text-gray-600 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">Tenant Statement</div>
                                                <button className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-medium uppercase shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">View</button>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-[#7BD747] rounded-full px-4 py-3 flex flex-col justify-between min-h-[5rem] shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white">Notice</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="bg-[#E8F5E9] px-4 py-1 rounded-full text-xs text-gray-600 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">Tenant Notice</div>
                                                <button className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-medium uppercase shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <DetailTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        className="mb-2"
                    />
                </div>

                {/* Tab Content */}
                {activeTab === 'profile' && (
                    <div id="profile-section">
                        <TenantProfileSection tenantId={id || ''} tenant={tenant} />
                    </div>
                )}
                {activeTab === 'leases' && (
                    <TenantLeasesSection tenantId={id || ''} tenant={tenant} />
                )}
                {activeTab === 'transactions' && (
                    <TenantTransactionsSection tenantId={id || ''} tenant={tenant} />
                )}
                {activeTab === 'insurance' && (
                    <TenantInsuranceSection tenantId={id || ''} />
                )}
                {activeTab === 'applications' && (
                    <TenantApplicationsSection tenantId={id || ''} tenantUserId={backendTenant?.userId || null} />
                )}
                {activeTab === 'requests' && (
                    <TenantRequestsSection tenantId={id || ''} />
                )}
            </div>
        </div>
    );
};

export default TenantDetail;
