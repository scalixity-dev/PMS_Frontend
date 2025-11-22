import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Check } from 'lucide-react';

interface ListingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToList: () => void;
    onListAnother: () => void;
    propertyDetails: string;
}

const ListingSuccessModal: React.FC<ListingSuccessModalProps> = ({
    isOpen,
    onClose,
    onBackToList,
    onListAnother,
    propertyDetails,
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
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center lg:pl-55">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="bg-[#3D7475] p-4 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="text-white hover:text-gray-200 transition-colors focus:outline-none"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col items-center text-center">
                                    {/* Success Icon */}
                                    <div className="mb-6 relative">
                                        <div className="w-20 h-20 bg-[#5BC27E] rounded-full flex items-center justify-center shadow-lg relative z-10">
                                            <Check size={40} className="text-white stroke-[4]" />
                                        </div>
                                        {/* Decorative elements mimicking confetti/sparkles */}
                                        <div className="absolute top-0 left-0 w-full h-full">
                                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#FFD700] rounded-full opacity-60"></div>
                                            <div className="absolute top-1 -left-4 w-2 h-2 bg-[#FF6B6B] rounded-full opacity-60"></div>
                                            <div className="absolute bottom-0 -right-3 w-2 h-2 bg-[#4ECDC4] rounded-full opacity-60"></div>
                                        </div>
                                    </div>

                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-bold leading-6 text-gray-900 mb-4"
                                    >
                                        Well Done !
                                    </Dialog.Title>

                                    <div className="mt-2 mb-8">
                                        <p className="text-gray-600 font-medium text-lg leading-relaxed">
                                            <span className="font-bold text-gray-800">{propertyDetails}</span> listing is posted. The
                                            listing will be active for 30 days.
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-lg border border-transparent bg-[#4A5568] px-6 py-3 text-sm font-medium text-white hover:bg-[#2D3748] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 min-w-[140px]"
                                            onClick={onBackToList}
                                        >
                                            Back to list
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-lg border border-transparent bg-[#3D7475] px-6 py-3 text-sm font-medium text-white hover:bg-[#2c5556] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7475] focus-visible:ring-offset-2 min-w-[160px]"
                                            onClick={onListAnother}
                                        >
                                            List Another Property
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

export default ListingSuccessModal;
