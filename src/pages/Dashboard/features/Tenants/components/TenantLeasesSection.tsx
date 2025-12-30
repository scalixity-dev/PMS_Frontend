import { CheckCircle2, User, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import { leasingService, type BackendLeasing } from '../../../../../services/leasing.service';

interface TenantLeasesSectionProps {
    tenantId: string;
    tenant: {
        id: number;
        name: string;
    };
}

const TenantLeasesSection = ({ tenantId, tenant }: TenantLeasesSectionProps) => {
    const navigate = useNavigate();
    const [allLeases, setAllLeases] = useState<BackendLeasing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchLeases = async () => {
            try {
                setIsLoading(true);
                const leases = await leasingService.getAll();
                setAllLeases(leases);
            } catch (error) {
                console.error('Failed to fetch leases:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeases();
    }, []);
    
    // Safely compute tenant initial with fallback
    const tenantInitial = (typeof tenant.name === 'string' && tenant.name.length > 0) ? tenant.name.charAt(0) : '?';
    
    // Transform leases for display
    // Note: BackendLeasing doesn't have tenantId, so we'll show all leases
    // In a real scenario, leases would be linked to tenants through applications or a tenantId field
    const leases = useMemo(() => {
        return allLeases.map((lease: BackendLeasing) => {
            const propertyName = lease.property?.propertyName || 'Unknown Property';
            const createdAt = new Date(lease.createdAt);
            const date = createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const time = createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
            
            return {
                id: lease.id,
                tenantName: tenant.name,
                tenantInitial: tenantInitial,
                date: date,
                time: time,
                status: 'Active', // BackendLeasing doesn't have status, defaulting to Active
                property: propertyName
            };
        });
    }, [allLeases, tenant.name, tenantInitial]);

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
            {leases.map((lease) => (
                <div key={lease.id}>
                    {/* Lease Number Heading */}
                    <div className="mb-1">
                        <h3 className="text-lg font-bold text-gray-800">Lease {lease.id}</h3>
                    </div>
                    <div
                        className="bg-[#F6F6F8] rounded-[2rem] p-6 shadow-lg"
                    >
                        <div className="flex items-center gap-4">
                            {/* Checkbox Icon */}
                            <CheckCircle2 className="w-6 h-6 text-[#7BD747] flex-shrink-0" />

                            {/* Tenant Info */}
                            <div className="flex items-center gap-3 flex-1">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-[#7BD747] flex items-center justify-center text-white font-bold text-sm">
                                        {lease.tenantInitial}
                                    </div>
                                    <User className="w-4 h-4 text-white absolute -bottom-1 -right-1 bg-[#3A6D6C] rounded-full p-0.5" />
                                </div>
                                <div className='flex flex-col'>
                                    <p className="font-semibold text-gray-800">{lease.tenantName}</p>
                                    <p className="text-xs text-gray-600 text-center">{lease.date} {lease.time}</p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="bg-[#7BD747] text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                {lease.status}
                            </div>

                            {/* Property Badge */}
                            <div className="bg-[#7BD747] text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)]">
                                {lease.property}
                            </div>

                            {/* View Button */}

                            <button
                                className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] flex items-center gap-2"
                                onClick={() => navigate(`/dashboard/portfolio/leases/${lease.id}`)}
                            >
                                <Eye className="w-4 h-4" />
                                View
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TenantLeasesSection;

