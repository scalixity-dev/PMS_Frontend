import React, { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle } from 'lucide-react';

interface ApplicationErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    errors: string[];
}

const parseErrorMessage = (error: string): string => {
    // Remove common prefixes and format
    let formatted = error;

    // Handle array indices (e.g., residenceHistory.0.City)
    const arrayIndexMatch = error.match(/^(\w+)\.(\d+)\.(\w+)\s+(.+)$/);
    if (arrayIndexMatch) {
        const [, arrayName, index, fieldName, message] = arrayIndexMatch;
        const itemNumber = parseInt(index) + 1; // Convert 0-based to 1-based
        
        // Map array names to user-friendly labels
        const arrayLabels: Record<string, string> = {
            residenceHistory: 'Residence History',
            applicants: 'Applicant',
            occupants: 'Occupant',
            incomeDetails: 'Income',
            emergencyContacts: 'Emergency Contact',
            vehicles: 'Vehicle',
            pets: 'Pet',
        };

        // Map field names to user-friendly labels
        const fieldLabels: Record<string, string> = {
            City: 'City',
            city: 'City',
            State: 'State',
            state: 'State',
            Country: 'Country',
            country: 'Country',
            firstName: 'First Name',
            lastName: 'Last Name',
            middleName: 'Middle Name',
            email: 'Email',
            phoneNumber: 'Phone Number',
            monthlyIncome: 'Monthly Income',
            startDate: 'Start Date',
            endDate: 'End Date',
            moveInDate: 'Move In Date',
            moveOutDate: 'Move Out Date',
            dateOfBirth: 'Date of Birth',
            relationship: 'Relationship',
            fullName: 'Full Name',
            contactName: 'Contact Name',
            address: 'Address',
            zipCode: 'Zip Code',
            zip: 'Zip Code',
        };

        const arrayLabel = arrayLabels[arrayName] || arrayName;
        const fieldLabel = fieldLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').trim();
        
        // Special handling for primary applicant (index 0)
        if (arrayName === 'applicants' && index === '0') {
            return `Primary Applicant: ${fieldLabel} ${message}`;
        }

        return `${arrayLabel} #${itemNumber}: ${fieldLabel} ${message}`;
    }

    // Handle simple field errors (e.g., "propertyId is required")
    const simpleFieldMatch = error.match(/^(\w+)\s+(.+)$/);
    if (simpleFieldMatch) {
        const [, fieldName, message] = simpleFieldMatch;
        const fieldLabels: Record<string, string> = {
            propertyId: 'Property',
            unitId: 'Unit',
            moveInDate: 'Move In Date',
        };
        const fieldLabel = fieldLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').trim();
        return `${fieldLabel} ${message}`;
    }

    // Capitalize first letter if not already formatted
    if (formatted && formatted.length > 0) {
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    return formatted;
};

const ApplicationErrorModal: React.FC<ApplicationErrorModalProps> = ({
    isOpen,
    onClose,
    errors,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const parsedErrors = errors.map(parseErrorMessage);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="bg-red-600 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="text-white" size={24} />
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold text-white"
                                        >
                                            Validation Errors
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-white hover:text-gray-200 transition-colors focus:outline-none"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-gray-700 mb-4">
                                        Please fix the following errors before submitting your application:
                                    </p>

                                    {/* Error List */}
                                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                        <ul className="space-y-2">
                                            {parsedErrors.map((error, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                                                >
                                                    <AlertCircle
                                                        className="text-red-600 flex-shrink-0 mt-0.5"
                                                        size={18}
                                                    />
                                                    <span className="text-sm text-gray-800 flex-1">
                                                        {error}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-lg border border-transparent bg-[#3A6D6C] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2c5251] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A6D6C] focus-visible:ring-offset-2 transition-colors"
                                            onClick={onClose}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ApplicationErrorModal;

