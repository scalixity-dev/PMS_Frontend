import React from 'react';
import { RefreshCw, Loader2, Trash2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ResponsibilityModal, { type ResponsibilityItem } from './ResponsibilityModal';
import AddUtilityProviderModal from './AddUtilityProviderModal';
import { currencyOptions } from '../../../../../components/ui/CurrencySelector';
import { useCreateUtilityProvider, useDeleteUtilityProvider, useGetPropertyServiceProviders, useGetPropertyResponsibilities, useUpsertPropertyResponsibilities } from '../../../../../hooks/usePropertyDetailQueries';

// --- Types ---
interface DetailField {
    label: string;
    value: string;
}

interface ServiceProviderRecord {
    id: number | string;
    avatar: string;
    serviceType: string;
    details: DetailField[];
}

// --- Components ---

interface ServiceProviderCardProps {
    record: ServiceProviderRecord;
    onDelete?: (id: string | number) => void;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ record, onDelete }) => {
    return (
        <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 mb-4">
            <div className="flex items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img
                            src={record.avatar}
                            alt="Provider"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="bg-[#82D64D] text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold">
                        {record.serviceType}
                    </div>
                </div>
                {onDelete && (
                    <button
                        onClick={() => onDelete(record.id)}
                        className="text-red-500 hover:bg-gray-200 p-2 rounded-full"
                        aria-label="Delete provider"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-8 md:gap-y-4">
                {record.details.map((detail, index) => (
                    <div key={index} className="flex items-center bg-[#E3EBDE] rounded-full px-4 py-2 shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                        <span className="text-xs font-medium text-gray-600 w-1/3 truncate" title={detail.label}>{detail.label}</span>
                        <span className="text-sm text-gray-800 font-medium w-2/3 truncate pl-2" title={detail.value}>{detail.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface ServiceProvidersTabProps {
    propertyId: string;
    unitId?: string;
}

const ServiceProvidersTab: React.FC<ServiceProvidersTabProps> = ({ propertyId, unitId }) => {
    const [isResponsibilityModalOpen, setIsResponsibilityModalOpen] = React.useState(false);
    const [isAddUtilityModalOpen, setIsAddUtilityModalOpen] = React.useState(false);

    // Bug 4 fix: load/persist responsibilities via API
    const { data: responsibilitiesData = [] } = useGetPropertyResponsibilities(propertyId);
    const upsertResponsibilitiesMutation = useUpsertPropertyResponsibilities();
    const responsibilities: ResponsibilityItem[] = responsibilitiesData.map((r: any) => ({
        id: r.id,
        utility: r.utility,
        payer: r.payer as 'Landlord' | 'Tenant',
    }));

    // Fetch real service providers data
    const { data: providersData = {}, isLoading, error } = useGetPropertyServiceProviders(propertyId, unitId);
    const createUtilityProviderMutation = useCreateUtilityProvider();
    const deleteUtilityProviderMutation = useDeleteUtilityProvider();
    const assignedServiceProviders = providersData.assignedServiceProviders || [];
    const realUtilityProviders = providersData.utilityProviders || [];

    const handleDeleteUtilityProvider = (providerId: string | number) => {
        if (window.confirm('Delete this utility provider?')) {
            deleteUtilityProviderMutation.mutate({ propertyId, providerId: String(providerId) });
        }
    };

    const mapProviderTypeToServiceType = (providerType: string) => {
        const normalized = providerType.toUpperCase();
        if (normalized.includes('WATER') || normalized.includes('SEWER')) return 'WATER';
        if (normalized.includes('GAS')) return 'GAS';
        if (normalized.includes('INTERNET') || normalized.includes('CABLE') || normalized.includes('PHONE')) return 'INTERNET';
        if (normalized.includes('ELECTRIC')) return 'ELECTRICITY';
        return 'OTHER';
    };

    const handleAddUtilityProvider = async (data: {
        providerType: string;
        servicePro: string;
        estimatedCost: string;
        currency: string;
        contactName: string;
        contactPhone: string;
        accountNumber: string;
    }) => {
        await createUtilityProviderMutation.mutateAsync({
            propertyId,
            providerData: {
                providerName: data.servicePro,
                serviceType: mapProviderTypeToServiceType(data.providerType),
                providerType: data.providerType || undefined,
                estimatedCost: data.estimatedCost ? Number(data.estimatedCost) : undefined,
                currency: data.currency || undefined,
                accountNumber: data.accountNumber || undefined,
                contactName: data.contactName || undefined,
                contactPhone: data.contactPhone || undefined,
                notes: undefined,
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                <span className="ml-3 text-gray-600">Loading service providers...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Failed to load service providers. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Responsibility Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6">
                <SectionHeader
                    title="Responsibility"
                    count={0}
                    actionLabel={responsibilities.length > 0 ? "Edit" : "Add"}
                    onAction={() => setIsResponsibilityModalOpen(true)}
                    hideCount={true}
                />

                {responsibilities.length === 0 ? (
                    <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 flex flex-col items-center justify-center min-h-[120px] md:min-h-[160px]">
                        <div className="bg-[#E3EBDE] p-4 rounded-2xl mb-3">
                            <RefreshCw className="w-8 h-8 text-[#3A6D6C]" />
                        </div>
                        <p className="text-[#3A6D6C] font-medium text-lg">No utilities added</p>
                    </div>
                ) : (
                    <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                            {responsibilities.map(item => (
                                <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#E3EBDE] flex items-center justify-center text-[#3A6D6C]">
                                            {/* Simple icon based on first letter or generic */}
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

            {/* Utility Providers Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6">
                <SectionHeader
                    title="Utility providers"
                    count={realUtilityProviders.length}
                    onAction={() => setIsAddUtilityModalOpen(true)}
                />
                <div>
                    {realUtilityProviders.map((provider: any) => {
                        // Read direct columns; fall back to parsing legacy notes for old rows
                        let providerType = provider.providerType || null;
                        let estimatedCost: string = '-';
                        if (provider.estimatedCost != null) {
                            const currencySymbol = currencyOptions.find((c: any) => c.code === provider.currency)?.symbol || '$';
                            estimatedCost = `${currencySymbol}${provider.estimatedCost}`;
                        } else {
                            // Legacy fallback: parse old notes format
                            const notesStr = typeof provider.notes === 'string' ? provider.notes : '';
                            const costMatch = notesStr.match(/Estimated monthly cost:\s*([^,]+)/);
                            if (costMatch) estimatedCost = costMatch[1].trim();
                            if (!providerType) {
                                const typeMatch = notesStr.match(/Provider Type:\s*([^,]+)/);
                                providerType = typeMatch ? typeMatch[1].trim() : null;
                            }
                        }
                        if (!providerType) providerType = provider.serviceType || '-';

                        const record: ServiceProviderRecord = {
                            id: provider.id,
                            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=256&q=80',
                            serviceType: provider.serviceType || 'OTHER',
                            details: [
                                { label: 'Provider Type', value: providerType },
                                { label: 'Service Pro', value: provider.providerName || '-' },
                                { label: 'Est. Cost', value: estimatedCost },
                                { label: 'Contact', value: provider.contactName || '-' },
                                { label: 'Phone', value: provider.contactPhone || '-' },
                                { label: 'Account #', value: provider.accountNumber || '-' },
                            ],
                        };
                        return (
                        <ServiceProviderCard
                            key={String(record.id)}
                            record={record}
                            onDelete={handleDeleteUtilityProvider}
                        />
                        );
                    })}
                </div>
            </div>

            <ResponsibilityModal
                isOpen={isResponsibilityModalOpen}
                onClose={() => setIsResponsibilityModalOpen(false)}
                initialData={responsibilities}
                onSave={(items) => {
                    upsertResponsibilitiesMutation.mutate({
                        propertyId,
                        items: items.map((i) => ({ utility: i.utility, payer: i.payer })),
                    });
                }}
            />

            <AddUtilityProviderModal
                isOpen={isAddUtilityModalOpen}
                onClose={() => setIsAddUtilityModalOpen(false)}
                onAdd={handleAddUtilityProvider}
            />
        </div>
    );
};

export default ServiceProvidersTab;
