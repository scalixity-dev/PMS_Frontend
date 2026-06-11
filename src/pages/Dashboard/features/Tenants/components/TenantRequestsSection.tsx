import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { maintenanceRequestService } from '../../../../../services/maintenance-request.service';

interface TenantRequestsSectionProps {
    tenantId: string;
    tenantUserId: string | null;
}

const TenantRequestsSection: React.FC<TenantRequestsSectionProps> = ({ tenantId: _tenantId, tenantUserId }) => {
    const navigate = useNavigate();

    const { data: rawRequests = [], isLoading } = useQuery({
        queryKey: ['maintenance-requests', 'tenant', tenantUserId],
        queryFn: () => maintenanceRequestService.getAll({ tenantUserId: tenantUserId! }),
        enabled: !!tenantUserId,
    });

    const requests = (rawRequests as any[]).map((r: any) => ({
        id: r.id as string,
        tenantName: r.requestedByTenant?.fullName ?? r.property?.manager?.fullName ?? 'Tenant',
        tenantInitial: (r.requestedByTenant?.fullName ?? 'T').charAt(0).toUpperCase(),
        status: (r.priority as string) ?? 'MEDIUM',
        description: [r.category, r.subcategory, r.title].filter(Boolean).join(' / '),
        property: r.property?.propertyName ?? '-',
    }));

    const getStatusColor = (priority: string) => {
        switch (priority.toUpperCase()) {
            case 'URGENT':
            case 'HIGH':
                return 'bg-red-500';
            case 'LOW':
                return 'bg-yellow-500';
            default:
                return 'bg-[#7BD747]';
        }
    };

    const getStatusLabel = (priority: string) => {
        switch (priority.toUpperCase()) {
            case 'URGENT': return 'Urgent';
            case 'HIGH': return 'High';
            case 'LOW': return 'Low';
            default: return 'Normal';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                <span className="ml-3 text-gray-600">Loading requests...</span>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="text-center py-12 bg-[#F0F0F6] rounded-[2rem]">
                <p className="text-gray-600">No maintenance requests found for this tenant</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 bg-[#F0F0F6] p-4 rounded-[2rem]">
            {requests.map((request) => (
                <div
                    key={request.id}
                    className="bg-[#F6F6F8] rounded-[2rem] p-6 shadow-lg flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr_2fr_1fr_0.8fr] gap-4 items-center"
                >
                    <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
                        <div className="w-12 h-12 rounded-full bg-[#7BD747] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {request.tenantInitial}
                        </div>
                        <span className="font-semibold text-gray-800 text-sm truncate">{request.tenantName}</span>
                    </div>

                    <div className="flex justify-center w-full md:w-auto">
                        <div className={`${getStatusColor(request.status)} text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] inline-block`}>
                            {getStatusLabel(request.status)}
                        </div>
                    </div>

                    <div className="text-sm font-medium text-[#2E6819] text-center w-full md:w-auto md:truncate whitespace-normal">
                        {request.description}
                    </div>

                    <div className="flex justify-center w-full md:w-auto">
                        <div className="bg-[#7BD747] text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] inline-block">
                            {request.property}
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-end w-full md:w-auto">
                        <button
                            className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 w-full md:w-auto"
                            onClick={() => navigate(`/dashboard/maintenance/requests/${request.id}`)}
                        >
                            <Eye className="w-4 h-4" />
                            View
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TenantRequestsSection;
