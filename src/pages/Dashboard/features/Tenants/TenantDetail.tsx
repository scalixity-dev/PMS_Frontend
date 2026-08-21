import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import { ChevronLeft, Plus, Loader2, X } from 'lucide-react';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import DetailTabs from '../../components/DetailTabs';
import TenantProfileSection from './components/TenantProfileSection';
import TenantLeasesSection from './components/TenantLeasesSection';
import TenantTransactionsSection from './components/TenantTransactionsSection';
import TenantApplicationsSection from './components/TenantApplicationsSection';
import TenantRequestsSection from './components/TenantRequestsSection';
import { useGetTenant, useDeleteTenant, useUpdateTenant } from '../../../../hooks/useTenantQueries';
import { useGetTenantAggregates } from '../../../../hooks/useTransactionQueries';
import { formatPhoneNumber } from '@/utils/phone.utils';
import type { BackendTenantProfile } from '../../../../services/tenant.service';
import { useTeamPermissions } from '../../../../context/TeamPermissionContext';


// Transform backend tenant profile to detail page format
const transformTenantForDetail = (backendTenant: BackendTenantProfile) => {
    const email = backendTenant.user?.email || backendTenant.contactBookEntry?.email || 'N/A';
    // Phone format: "+91 9876543210" — space separator.
    // Guard against legacy data where phoneCountryCode was mistakenly written
    // with the full phone number (resulting in "9876543210 9876543210" or a
    // doubled string shown in the UI where the country code should be). Only
    // prepend the country code when it is actually different from, and not a
    // substring of, the phone number.
    const phone = backendTenant.phoneNumber
        ? formatPhoneNumber(
              backendTenant.phoneCountryCode?.trim() && 
              !(backendTenant.phoneCountryCode.trim() === backendTenant.phoneNumber || 
                backendTenant.phoneCountryCode.trim().includes(backendTenant.phoneNumber!) || 
                backendTenant.phoneNumber!.includes(backendTenant.phoneCountryCode.trim()))
              ? `${backendTenant.phoneCountryCode.trim()} ${backendTenant.phoneNumber}`
              : backendTenant.phoneNumber
          )
        : 'N/A';

    // Date of birth: prefer the dedicated column on the tenant profile
    // (always persisted), fall back to the linked user's value.
    const dobRaw = backendTenant.dateOfBirth ?? (backendTenant.user as any)?.dateOfBirth;
    const dateOfBirth = dobRaw
        ? new Date(dobRaw).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '-';
    const name = [backendTenant.firstName, backendTenant.middleName, backendTenant.lastName]
        .filter(Boolean)
        .join(' ');

    return {
        id: Number(backendTenant.id) || 0, // Convert string ID to number for compatibility
        name,
        phone,
        email,
        image: backendTenant.profilePhotoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
        outstanding: 0,
        deposits: 0,
        credits: 0,
        isActive: backendTenant.isActive,
        personalInfo: {
            firstName: backendTenant.firstName,
            middleName: backendTenant.middleName || '',
            lastName: backendTenant.lastName,
            email: email,
            additionalEmail: '-', // Not in backend model
            phone: phone,
            additionalPhone: '-', // Not in backend model
            companyName: '-', // Not in backend model
            dateOfBirth,
            companyName2: '-'
        },
        forwardingAddress: backendTenant.forwardingAddress || '-',
        emergencyContacts: backendTenant.emergencyContacts.map(contact => ({
            name: contact.name,
            phone: formatPhoneNumber(contact.phoneNumber),
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const { isTeamMember, canManage } = useTeamPermissions();
    const canEdit = !isTeamMember || canManage('contacts');
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const deleteTenantMutation = useDeleteTenant();
    const updateTenantMutation = useUpdateTenant();

    // Fetch tenant data using API
    const { data: backendTenant, isLoading, error } = useGetTenant(id || null);

    // Fetch DB-level aggregates for this tenant
    const { data: tenantAggregates } = useGetTenantAggregates(backendTenant?.userId ?? null);

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

    const handleDeleteTenant = () => {
        if (id) setShowDeleteConfirm(true);
    };

    const confirmDeleteTenant = async () => {
        if (!id) return;
        try {
            await deleteTenantMutation.mutateAsync(id);
            setShowDeleteConfirm(false);
            navigate('/dashboard/contacts/tenants');
        } catch (err) {
            console.error('Failed to delete tenant:', err);
        }
    };

    const handleArchiveTenant = async () => {
        if (!id || !backendTenant) return;
        try {
            await updateTenantMutation.mutateAsync({
                tenantId: id,
                updateData: { isActive: !backendTenant.isActive },
            });
            setIsArchiveModalOpen(false);
        } catch (err) {
            console.error('Failed to archive/unarchive tenant:', err);
        }
    };

    const menuItems = [
        { label: 'Edit', action: () => navigate(`/dashboard/contacts/tenants/edit/${id}`) },
        { label: 'Move in', action: () => navigate(`/dashboard/movein?tenantId=${id}`) },
        { label: 'Add invoice', action: () => navigate(`/dashboard/accounting/transactions/income/add?tenantId=${id}`) },
        {
            label: backendTenant?.isActive === false ? 'Unarchive' : 'Archive',
            action: () => setIsArchiveModalOpen(true),
        },
        {
            label: 'Delete',
            action: handleDeleteTenant,
            isDestructive: true
        },
    ];

    const tenant = useMemo(() => {
        if (!backendTenant) return null;
        const base = transformTenantForDetail(backendTenant);
        return {
            ...base,
            outstanding: tenantAggregates?.outstanding ?? 0,
            deposits: tenantAggregates?.deposits ?? 0,
            credits: tenantAggregates?.credits ?? 0,
        };
    }, [backendTenant, tenantAggregates]);

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'leases', label: 'Leases' },
        { id: 'transactions', label: 'Transactions' },
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
            <DeleteConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteTenant}
                isLoading={deleteTenantMutation.isPending}
                title="Delete Tenant"
                message="Are you sure you want to delete this tenant? This cannot be undone."
                confirmText="Delete"
            />

            {/* Archive Modal */}
            {isArchiveModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="bg-[#3A6D6C] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-lg font-medium">
                                {tenant.isActive === false
                                    ? "You're about to unarchive this tenant"
                                    : "You're about to archive this tenant"}
                            </h3>
                            <button onClick={() => setIsArchiveModalOpen(false)} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 font-medium mb-8">
                                {tenant.isActive === false
                                    ? 'Are you sure you want to unarchive this tenant? They will become active again and show up in your Tenants list.'
                                    : 'Are you sure you want to archive this tenant?'}
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsArchiveModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-[#545E6B] text-white rounded-lg font-medium hover:bg-[#464f5b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={updateTenantMutation.isPending}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleArchiveTenant}
                                    className="flex-1 px-6 py-3 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={updateTenantMutation.isPending}
                                >
                                    {updateTenantMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Yes I'm Sure
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Tenants', path: '/dashboard/contacts/tenants' },
                    { label: tenant.name }
                ]}
                className="mb-6"
            />

            <div className="p-4 sm:p-6 bg-[#E0E5E5] min-h-screen rounded-[1.5rem] sm:rounded-[2rem]">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Tenant</h1>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                        {canEdit && <button
                            onClick={() => navigate('/dashboard/accounting/transactions/income/add', {
                                state: {
                                    prefilledPayer: {
                                        id: tenant.id,
                                        label: tenant.name,
                                        type: 'tenant'
                                    }
                                }
                            })}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            Add Invoice
                            <Plus className="w-4 h-4" />
                        </button>}
                        {canEdit && <div className="relative" ref={actionMenuRef}>
                            <button
                                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors whitespace-nowrap"
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
                        </div>}
                    </div>
                </div>

                <div className='shadow-lg rounded-[2rem] p-4 sm:p-6 mb-8 bg-white'>
                    {/* Top Card */}
                    <div className="bg-[#F6F6F8] rounded-[1.5rem] sm:rounded-[2rem] shadow-lg p-4 sm:p-6 mb-8">
                        <div className="flex flex-col xl:flex-row gap-8">
                            {/* Tenant Info */}
                            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start w-full xl:w-auto">
                                <img src={tenant.image} alt={tenant.name} className="w-32 h-32 rounded-2xl object-cover" />
                                <div className="flex flex-col gap-3 w-full sm:w-auto">
                                    <div className="bg-[#3A6D6C] text-white p-4 rounded-xl text-center min-w-[200px] w-full sm:w-auto">
                                        {tenant.isActive === false && (
                                            <div className="mb-2 text-xs bg-amber-100 text-amber-800 inline-block px-3 py-1 rounded-full font-semibold">
                                                Archived
                                            </div>
                                        )}
                                        <h2 className="font-bold text-lg">{tenant.name}</h2>
                                        <p className="text-xs opacity-90">{tenant.phone}</p>
                                        <p className="text-xs opacity-90">{tenant.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats & Reports */}
                            <div className="flex-1 flex flex-col justify-between gap-4 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-[#7BD747] rounded-full px-6 py-3 flex flex-row md:flex-col justify-between items-center md:items-stretch h-auto md:h-24 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] gap-2">
                                        <span className="text-xs font-semibold text-white">Outstanding</span>
                                        <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] w-fit">${tenant.outstanding.toLocaleString()}.00</div>
                                    </div>
                                    <div className="bg-[#7BD747] rounded-full px-6 py-3 flex flex-row md:flex-col justify-between items-center md:items-stretch h-auto md:h-24 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] gap-2">
                                        <span className="text-xs font-semibold text-white">Deposits</span>
                                        <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] w-fit">${tenant.deposits.toLocaleString()}.00</div>
                                    </div>
                                    <div className="bg-[#7BD747] rounded-full px-6 py-3 flex flex-row md:flex-col justify-between items-center md:items-stretch h-auto md:h-24 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] gap-2">
                                        <span className="text-xs font-semibold text-white">Credits</span>
                                        <div className="bg-[#E8F5E9] px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] w-fit">${tenant.credits.toLocaleString()}.00</div>
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
                    <TenantLeasesSection tenantId={id || ''} tenant={tenant} tenantUserId={backendTenant?.userId ?? null} />
                )}
                {activeTab === 'transactions' && (
                    <TenantTransactionsSection tenantId={id || ''} tenant={tenant} />
                )}
                {activeTab === 'applications' && (
                    <TenantApplicationsSection tenantId={id || ''} tenantEmail={tenant.email !== 'N/A' ? tenant.email : null} />
                )}
                {activeTab === 'requests' && (
                    <TenantRequestsSection tenantId={id || ''} tenantUserId={backendTenant?.userId ?? null} />
                )}
            </div>
        </div>
    );
};

export default TenantDetail;
