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

                {/* Table Header - Hidden on Mobile */}
                <div className="hidden md:grid bg-[#3A6D6C] rounded-t-3xl px-8 py-4 grid-cols-[1fr_1fr_1.5fr_100px] gap-4 items-center text-white font-medium">
                    <div>Name</div>
                    <div>Status</div>
                    <div>Email</div>
                    <div className="text-center">Share</div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col bg-[#F0F0F6] rounded-b-3xl md:rounded-b-3xl rounded-3xl overflow-hidden shadow-lg md:shadow-lg">
                    {TENANT_STATUS_DATA.map((tenant, index) => (
                        <div
                            key={tenant.id}
                            className={`
                        flex flex-col md:grid md:grid-cols-[1fr_1fr_1.5fr_100px] gap-2 md:gap-4 items-start md:items-center px-6 py-6 md:px-8
                        ${index !== TENANT_STATUS_DATA.length - 1 ? 'border-b border-gray-200' : ''}
                    `}
                        >
                            {/* Mobile Labels */}
                            <div className="flex md:hidden justify-between w-full items-center mb-2">
                                <span className="text-[#374151] font-bold text-lg">{tenant.name}</span>
                                <div className="bg-[#4D7C0F]/10 px-3 py-1 rounded-full">
                                    <span className="text-[#4D7C0F] font-bold text-sm">{tenant.status}</span>
                                </div>
                            </div>

                            {/* Desktop Cells */}
                            <div className="hidden md:block text-[#374151] font-medium">{tenant.name}</div>
                            <div className="hidden md:block text-[#4D7C0F] font-bold">{tenant.status}</div>

                            {/* Email */}
                            <div className="text-gray-500 md:text-[#4D7C0F] font-medium text-sm md:text-base w-full break-all">
                                {tenant.email}
                            </div>

                            {/* Share Action */}
                            <div className="flex md:justify-center w-full md:w-auto mt-4 md:mt-0">
                                <button
                                    onClick={() => handleShare(tenant.id)}
                                    className="flex items-center justify-center gap-2 text-[#3A6D6C] hover:text-[#2c5554] transition-colors p-2 hover:bg-[#3A6D6C]/10 rounded-full w-full md:w-auto border border-[#3A6D6C]/20 md:border-none"
                                >
                                    <span className="md:hidden font-medium">Share Lease</span>
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
