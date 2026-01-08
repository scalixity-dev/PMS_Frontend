import React from 'react';
import { AlertCircle } from 'lucide-react';
import BaseModal from '@/components/common/modals/BaseModal';

interface ApplicationErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    errors: string[];
}

const parseErrorMessage = (error: string): string => {
    let formatted = error;
    const arrayIndexMatch = error.match(/^(\w+)\.(\d+)\.(\w+)\s+(.+)$/);
    if (arrayIndexMatch) {
        const [, arrayName, index, fieldName, message] = arrayIndexMatch;
        const itemNumber = parseInt(index) + 1;
        const arrayLabels: Record<string, string> = {
            residenceHistory: 'Residence History',
            applicants: 'Applicant',
            occupants: 'Occupant',
            incomeDetails: 'Income',
            emergencyContacts: 'Emergency Contact',
            vehicles: 'Vehicle',
            pets: 'Pet',
        };
        const arrayLabel = arrayLabels[arrayName] || arrayName;
        return `${arrayLabel} #${itemNumber}: ${fieldName.replace(/([A-Z])/g, ' $1').trim()} ${message}`;
    }
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const ApplicationErrorModal: React.FC<ApplicationErrorModalProps> = ({
    isOpen,
    onClose,
    errors,
}) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Submission Errors"
            maxWidth="max-w-lg"
            footerButtons={[
                {
                    label: 'Fix Errors',
                    onClick: onClose,
                    className: "bg-[#1A1A1A] hover:bg-[#2D2D2D] w-full justify-center text-white",
                }
            ]}
        >
            <div className="flex flex-col items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                    <AlertCircle className="text-red-500" size={24} />
                </div>
                <p className="text-gray-500 text-center mb-6 text-sm">
                    Please correct the following errors before submitting the application.
                </p>
                <div className="w-full space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {errors.map((error, index) => (
                        <div key={index} className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-start">
                            <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={16} />
                            <span className="text-sm text-red-700 font-medium leading-tight">{parseErrorMessage(error)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </BaseModal>
    );
};

export default ApplicationErrorModal;
