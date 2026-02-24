import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { useGetMaintenanceRequestApplicants } from '../../../../../hooks/useMaintenanceRequestQueries';
import ApplicantCard from './ApplicantCard';

interface ApplicantsSectionProps {
    requestId: string;
    onOpenAssigneeModal: () => void;
    onAssignApplicant: (serviceProviderId: string) => void;
    onAddToContact?: (serviceProviderId: string) => void;
    isAssigning?: boolean;
    isAddingToContact?: boolean;
}

const CollapsibleSection = ({ 
    title, 
    children, 
    defaultOpen = false, 
    action 
}: { 
    title: string; 
    children: React.ReactNode; 
    defaultOpen?: boolean; 
    action?: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 group"
                >
                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-gray-600">{title}</h2>
                    <div className="transform transition-transform duration-200">
                        {isOpen ? <ChevronDown className="w-5 h-5 text-gray-800" /> : <ChevronRight className="w-5 h-5 text-gray-800" />}
                    </div>
                </button>
                {action && <div>{action}</div>}
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0'}`}>
                {children}
            </div>
        </div>
    );
};

const ApplicantsSection: React.FC<ApplicantsSectionProps> = ({
    requestId,
    onOpenAssigneeModal,
    onAssignApplicant,
    onAddToContact,
    isAssigning = false,
    isAddingToContact = false,
}) => {
    const { data: applicants = [], isLoading } = useGetMaintenanceRequestApplicants(requestId, true);

    const applicantCount = applicants.length;

    if (isLoading) {
        return (
            <CollapsibleSection title="Applicants" defaultOpen={true}>
                <div className="bg-[#F0F0F6] rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-gray-500">Loading applicants...</p>
                </div>
            </CollapsibleSection>
        );
    }

    if (applicantCount === 0) {
        return null; // Don't show section if no applicants
    }

    return (
        <CollapsibleSection
            title="Applicants"
            defaultOpen={true}
            action={
                <div className="flex items-center gap-2">
                    <span className="bg-[#7BD747] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {applicantCount}
                    </span>
                    <button
                        onClick={onOpenAssigneeModal}
                        className="px-4 py-1.5 bg-[#3A6D6C] text-white rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors"
                    >
                        View All & Assign
                    </button>
                </div>
            }
        >
            <div className="bg-[#F0F0F6] rounded-xl p-4 md:p-6 shadow-sm">
                <p className="text-xs text-gray-500 mb-4">
                    Service providers who expressed interest in this job
                </p>
                <div className="space-y-2">
                    {applicants.map((applicant) => (
                        <ApplicantCard
                            key={applicant.id}
                            applicant={applicant}
                            onAssign={onAssignApplicant}
                            onAddToContact={onAddToContact}
                            isAssigning={isAssigning}
                            isAddingToContact={isAddingToContact}
                        />
                    ))}
                </div>
            </div>
        </CollapsibleSection>
    );
};

export default ApplicantsSection;
