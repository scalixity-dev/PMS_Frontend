import { CheckCircle2, User, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { leaseService, type BackendLease } from '../../../../../services/lease.service';

interface TenantLeasesSectionProps {
    tenantId: string;
    tenant: {
        id: number;
        name: string;
    };
    tenantUserId: string | null;
}

const TenantLeasesSection = ({ tenantId: _tenantId, tenant, tenantUserId }: TenantLeasesSectionProps) => {
    const navigate = useNavigate();
    const [leases, setLeases] = useState<BackendLease[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeases = async () => {
            try {
                setIsLoading(true);
                const data = await leaseService.getAll(undefined, tenantUserId || undefined);
                setLeases(data);
            } catch (error) {
                console.error('Failed to fetch leases:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeases();
    }, [tenantUserId]);

    const tenantInitial = (typeof tenant.name === 'string' && tenant.name.length > 0) ? tenant.name.charAt(0) : '?';

    const statusLabel = (status: BackendLease['status']): string => {
        const map: Record<BackendLease['status'], string> = {
            ACTIVE: 'Active',
            PENDING: 'Pending',
            EXPIRED: 'Expired',
            TERMINATED: 'Terminated',
            CANCELLED: 'Cancelled',
        };
        return map[status] ?? status;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                <span className="ml-3 text-gray-600">Loading leases...</span>
            </div>
        );
    }

    if (leases.length === 0) {
        return (
            <div className="text-center py-12 bg-[#F0F0F6] rounded-[2rem]">
                <p className="text-gray-600">No leases found for this tenant</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {leases.map((lease) => {
                const propertyName = lease.property?.propertyName || 'Unknown Property';
                const createdAt = new Date(lease.createdAt);
                const date = createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                const time = createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });

                return (
                    <div key={lease.id}>
                        <div className="mb-1">
                            <h3 className="text-lg font-bold text-gray-800">Lease {lease.id.slice(-6)}</h3>
                        </div>
                        <div className="bg-[#F6F6F8] rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-lg">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex items-center gap-2 md:gap-4 md:contents">
                                    <CheckCircle2 className="w-6 h-6 text-[#7BD747] flex-shrink-0" />

                                    <div className="flex items-center gap-3 flex-1 md:w-auto">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-[#7BD747] flex items-center justify-center text-white font-bold text-sm">
                                                {tenantInitial}
                                            </div>
                                            <User className="w-4 h-4 text-white absolute -bottom-1 -right-1 bg-[#3A6D6C] rounded-full p-0.5" />
                                        </div>
                                        <div className='flex flex-col'>
                                            <p className="font-semibold text-gray-800">{tenant.name}</p>
                                            <p className="text-xs text-gray-600 md:text-center text-left">{date} {time}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 md:contents">
                                    <div className="bg-[#7BD747] text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] w-fit">
                                        {statusLabel(lease.status)}
                                    </div>

                                    <div className="bg-[#7BD747] text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] w-fit">
                                        {propertyName}
                                    </div>
                                </div>

                                <button
                                    className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 w-full md:w-auto mt-2 md:mt-0"
                                    onClick={() => navigate(`/dashboard/leasing/leases/${lease.id}`)}
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TenantLeasesSection;
