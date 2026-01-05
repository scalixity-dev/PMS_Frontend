import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Check } from 'lucide-react';

interface RequestSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId: string;
    propertyName: string;
}

const RequestSuccessModal: React.FC<RequestSuccessModalProps> = ({
    isOpen,
    onClose,
    requestId,
    propertyName,
}) => {
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
                    <div className="fixed inset-0 bg-black/40 " />
                </Transition.Child>

                <div className="fixed inset-0 lg:left-64 lg:top-16 overflow-y-auto">
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
                            <Dialog.Panel className="w-full max-w-[480px] transform overflow-hidden rounded-2xl bg-white p-8 text-center align-middle shadow-2xl transition-all relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex flex-col items-center">
                                    {/* Success Icon */}
                                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                        <div className="w-16 h-16 bg-[#7ED957] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#7ED957]/20">
                                            <Check size={32} strokeWidth={3} />
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-semibold text-[#1A2D4C] mb-4">Well done!</h2>

                                    <p className="text-[#4A5D7B] text-lg leading-relaxed mb-8">
                                        You have created a new maintenance request <br />
                                        <span className="font-semibold text-[#1A2D4C]">#{requestId}</span> for <span className="font-semibold text-[#1A2D4C]">{propertyName}</span>
                                    </p>

                                    <button
                                        onClick={onClose}
                                        className="text-[#7ED957] font-medium text-lg  transition-all"
                                    >
                                        Back to list
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default RequestSuccessModal;
