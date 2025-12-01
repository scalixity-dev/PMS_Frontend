import React from 'react';
import { RefreshCw } from 'lucide-react';
import SectionHeader from './SectionHeader';

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
        <div className="bg-[#F0F0F6] rounded-[2rem] p-6 mb-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img
                        src={record.avatar}
                        alt="Provider"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="bg-[#82D64D] text-white px-6 py-2 rounded-full text-sm font-bold">
                    {record.serviceType}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
    // Mock Data
    const utilityProviders: ServiceProviderRecord[] = [
        {
            id: 1,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
            serviceType: 'Cable/Satellite',
            details: [
                { label: 'Service Pro', value: '5' },
                { label: 'Phone number', value: '+91 78541 23697' },
                { label: 'Email', value: 'monthly' },
                { label: 'Estimated monthly cost', value: '3' },
                { label: 'Website', value: 'sbi' },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            {/* Responsibility Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[2rem] p-6">
                <SectionHeader
                    title="Responsibility"
                    count={0}
                    onAction={() => console.log('Add Responsibility')}
                    hideCount={true}
                />
                <div className="bg-[#F0F0F6] rounded-[2rem] p-10 flex flex-col items-center justify-center min-h-[160px]">
                    <div className="bg-[#E3EBDE] p-4 rounded-2xl mb-3">
                        <RefreshCw className="w-8 h-8 text-[#3A6D6C]" />
                    </div>
                    <p className="text-[#3A6D6C] font-medium text-lg">No utilities added</p>
                </div>
            </div>

            {/* Utility Providers Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[2rem] p-6">
                <SectionHeader
                    title="Utility providers"
                    count={utilityProviders.length}
                    onAction={() => console.log('Add Utility Provider')}
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
        </div>
    );
};

export default ServiceProvidersTab;
