import React from 'react';
import { RefreshCw } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ResponsibilityModal, { type ResponsibilityItem } from './ResponsibilityModal';
import AddUtilityProviderModal from './AddUtilityProviderModal';
import { currencyOptions } from '../../../../../components/ui/CurrencySelector';

// --- Types ---
interface DetailField {
    label: string;
    value: string;
}

interface ServiceProviderRecord {
    id: number;
    avatar: string;
    serviceType: string;
    details: DetailField[];
}

// --- Components ---

interface ServiceProviderCardProps {
    record: ServiceProviderRecord;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ record }) => {
    return (
        <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 mb-4">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
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

const ServiceProvidersTab: React.FC = () => {
    const [isResponsibilityModalOpen, setIsResponsibilityModalOpen] = React.useState(false);
    const [responsibilities, setResponsibilities] = React.useState<ResponsibilityItem[]>([]);
    const [isAddUtilityModalOpen, setIsAddUtilityModalOpen] = React.useState(false);
    const [utilityProviders, setUtilityProviders] = React.useState<ServiceProviderRecord[]>([
        {
            id: 1,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
            serviceType: 'Cable/Satellite',
            details: [
                { label: 'Service Pro', value: 'DirectTV Services Inc.' },
                { label: 'Phone number', value: '+91 78541 23697' },
                { label: 'Email', value: 'support@directtv.com' },
                { label: 'Estimated monthly cost', value: '$85.00' },
                { label: 'Website', value: 'https://www.directtv.com' },
            ]
        }
    ]);

    const handleAddUtilityProvider = (data: { providerType: string; servicePro: string; estimatedCost: string; currency: string }) => {
        const currencySymbol = currencyOptions.find(c => c.code === data.currency)?.symbol || data.currency || '$';

        const newProvider: ServiceProviderRecord = {
            id: Date.now(),
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80', // Placeholder
            serviceType: data.providerType,
            details: [
                { label: 'Service Pro', value: data.servicePro },
                { label: 'Estimated monthly cost', value: data.estimatedCost ? `${currencySymbol}${data.estimatedCost}` : '-' },
                // Mocking other required details for display consistency
                { label: 'Phone number', value: '-' },
                { label: 'Email', value: '-' },
                { label: 'Website', value: '-' },
            ]
        };
        setUtilityProviders([...utilityProviders, newProvider]);
    };

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
                    count={utilityProviders.length}
                    onAction={() => setIsAddUtilityModalOpen(true)}
                />
                <div>
                    {utilityProviders.map(record => (
                        <ServiceProviderCard
                            key={record.id}
                            record={record}
                        />
                    ))}
                </div>
            </div>

            <ResponsibilityModal
                isOpen={isResponsibilityModalOpen}
                onClose={() => setIsResponsibilityModalOpen(false)}
                initialData={responsibilities}
                onSave={setResponsibilities}
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
