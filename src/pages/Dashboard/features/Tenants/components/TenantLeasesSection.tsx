import { CheckCircle2, User, Eye } from 'lucide-react';

interface Lease {
    id: number;
    tenantName: string;
    tenantInitial: string;
    date: string;
    time: string;
    status: string;
    property: string;
}

interface TenantLeasesSectionProps {
    tenant: {
        id: number;
        name: string;
    };
}

const TenantLeasesSection = ({ tenant }: TenantLeasesSectionProps) => {
    // Mock lease data
    const leases: Lease[] = [
        {
            id: 1,
            tenantName: tenant.name,
            tenantInitial: tenant.name.charAt(0),
            date: '01 Nov, 2025',
            time: '11:00 AM',
            status: 'Draft',
            property: 'Avana Apartment'
        },
        {
            id: 2,
            tenantName: tenant.name,
            tenantInitial: tenant.name.charAt(0),
            date: '01 Nov, 2025',
            time: '11:00 AM',
            status: 'Draft',
            property: 'Avana Apartment'
        },
        {
            id: 3,
            tenantName: tenant.name,
            tenantInitial: tenant.name.charAt(0),
            date: '01 Nov, 2025',
            time: '11:00 AM',
            status: 'Draft',
            property: 'Avana Apartment'
        }
    ];

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
                                onClick={() => { }}
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

