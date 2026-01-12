import { useMemo } from 'react';
import { useGetAllApplications } from '../../../../../hooks/useApplicationQueries';
import { Loader2 } from 'lucide-react';
import type { BackendApplication } from '../../../../../services/application.service';

interface TenantApplicationsSectionProps {
    tenantId: string;
    tenantUserId: string | null;
}

const TenantApplicationsSection = ({ tenantId: _tenantId, tenantUserId }: TenantApplicationsSectionProps) => {
    const { data: allApplications = [], isLoading } = useGetAllApplications();

    // Filter applications by tenant's userId
    const tenantApplications = useMemo(() => {
        if (!tenantUserId) return [];

        return allApplications.filter((app: BackendApplication) => {
            // Check if any applicant matches the tenant's userId
            return app.applicants.some(applicant => applicant.email === tenantUserId);
        });
    }, [allApplications, tenantUserId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                <span className="ml-3 text-gray-600">Loading applications...</span>
            </div>
        );
    }

    if (tenantApplications.length === 0) {
        return (
            <div className="text-center py-12 bg-[#F0F0F6] rounded-[2rem]">
                <p className="text-gray-600">No applications found for this tenant</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tenantApplications.map((app: BackendApplication) => {
                const primaryApplicant = app.applicants.find(a => a.isPrimary) || app.applicants[0];
                const applicantName = primaryApplicant
                    ? `${primaryApplicant.firstName} ${primaryApplicant.middleName || ''} ${primaryApplicant.lastName}`.trim()
                    : 'Unknown Applicant';

                const applicationDate = new Date(app.applicationDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });

                const statusMap: Record<string, string> = {
                    'APPROVED': 'Approved',
                    'SUBMITTED': 'Pending',
                    'REVIEWING': 'Pending',
                    'DRAFT': 'Draft',
                    'REJECTED': 'Rejected',
                    'CANCELLED': 'Cancelled',
                    // Backward compatibility for old values
                    'UNDER_REVIEW': 'Pending',
                    'WITHDRAWN': 'Cancelled',
                };
                const status = statusMap[app.status] || 'Pending';

                return (
                    <div key={app.id} className="bg-[#F6F6F8] rounded-[2rem] p-6 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{applicantName}</h3>
                                <p className="text-sm text-gray-600">Applied: {applicationDate}</p>
                                <p className="text-sm text-gray-600">Status: {status}</p>
                            </div>
                            <div className="bg-[#7BD747] text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] w-fit">
                                {status}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TenantApplicationsSection;

