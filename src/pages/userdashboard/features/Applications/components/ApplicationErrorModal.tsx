import React, { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle } from 'lucide-react';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';

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
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

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
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-[2rem] bg-white p-8 text-left shadow-2xl transition-all border border-[#E5E7EB]">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                            <AlertCircle className="text-red-500" size={20} />
                                        </div>
                                        <Dialog.Title as="h3" className="text-xl font-bold text-[#1A1A1A]">Submission Errors</Dialog.Title>
                                    </div>
                                    <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar mb-8">
                                    {errors.map((error, index) => (
                                        <div key={index} className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-start">
                                            <AlertCircle className="text-red-400 mt-0.5" size={14} />
                                            <span className="text-sm text-red-700 font-medium">{parseErrorMessage(error)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center">
                                    <PrimaryActionButton
                                        text="Fix Errors"
                                        onClick={onClose}
                                        className="bg-[#1A1A1A] hover:bg-[#2D2D2D] px-12 py-3 rounded-full text-white font-bold uppercase text-sm"
                                    />
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
