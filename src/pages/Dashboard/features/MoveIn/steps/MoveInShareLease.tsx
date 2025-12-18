import React from 'react';
import { Share2 } from 'lucide-react';

interface TenantStatus {
    id: string;
    name: string;
    status: 'Pending' | 'Accepted' | 'Declined';
    email: string;
}

interface MoveInShareLeaseProps {
    onNext: () => void;
    // In a real app, this might accept the selectedTenantId to fetch/display specific data
}

// Mock data matching the screenshot
const TENANT_STATUS_DATA: TenantStatus[] = [
    { id: '1', name: 'Atul', status: 'Pending', email: 'abchds@gmail.com' },
    { id: '2', name: 'Anuj', status: 'Pending', email: 'abchds@gmail.com' },
];

const MoveInShareLease: React.FC<MoveInShareLeaseProps> = ({ onNext }) => {

    const handleShare = (id: string) => {
        console.log('Share lease with tenant', id);
        // Logic to trigger lease share email/notification
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">Share lease</h2>
                <p className="text-[#6B7280]">Share the lease with tenants who aren't yet connected.</p>
            </div>

            <div className="w-full max-w-4xl bg-[#F0F0F6] rounded-[2.5rem] p-6 shadow-sm border border-gray-100">

                {/* Table Header */}
                <div className="bg-[#3A6D6C] rounded-t-3xl px-8 py-4 grid grid-cols-[1fr_1fr_1.5fr_100px] gap-4 items-center text-white font-medium">
                    <div>Name</div>
                    <div>Status</div>
                    <div>Email</div>
                    <div className="text-center">Share</div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col bg-[#F0F0F6] rounded-b-3xl overflow-hidden shadow-lg">
                    {TENANT_STATUS_DATA.map((tenant, index) => (
                        <div
                            key={tenant.id}
                            className={`
                        grid grid-cols-[1fr_1fr_1.5fr_100px] gap-4 items-center px-8 py-6
                        ${index !== TENANT_STATUS_DATA.length - 1 ? 'border-b border-gray-200' : ''}
                    `}
                        >
                            <div className="text-[#374151] font-medium">{tenant.name}</div>
                            <div className="text-[#4D7C0F] font-bold">{tenant.status}</div>
                            <div className="text-[#4D7C0F] font-medium">{tenant.email}</div>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleShare(tenant.id)}
                                    className="text-[#3A6D6C] hover:text-[#2c5554] transition-colors p-2 hover:bg-[#3A6D6C]/10 rounded-full"
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <div className="w-full max-w-md mt-12 flex justify-center">
                <button
                    onClick={onNext}
                    className="px-12 py-3 rounded-lg font-medium text-white transition-all bg-[#3A6D6C] hover:bg-[#2c5554] shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MoveInShareLease;
