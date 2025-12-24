import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimationUrl from '../../../ListUnit/Success.lottie?url';

interface ReviewSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    leaseName?: string;
    propertyName?: string;
}

const ReviewSuccessModal: React.FC<ReviewSuccessModalProps> = ({
    isOpen,
    onClose,
    leaseName = 'Lease 9',
    propertyName = 'abc'
}) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[#00000080]  " />
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
                            <Dialog.Panel className="w-full max-w-[440px] transform overflow-hidden rounded-[24px] bg-white text-left align-middle shadow-2xl transition-all font-outfit">
                                {/* Header - Teal */}
                                <div className="bg-[#3D7475] h-[110px] flex items-start justify-end p-5">
                                    <button
                                        onClick={onClose}
                                        className="text-white hover:opacity-80 transition-opacity"
                                    >
                                        <X size={32} strokeWidth={2.5} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-6 pb-14 flex flex-col items-center">
                                    {/* Success Icon Container - Overlapping */}
                                    <div className="relative w-40 h-40 -mt-20 flex items-center justify-center">
                                        <DotLottieReact
                                            src={successAnimationUrl}
                                            loop
                                            autoplay
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-[32px] font-bold text-[#111827] mt-2 mb-6 tracking-tight">
                                        Well Done !
                                    </h3>

                                    {/* Message */}
                                    <p className="text-[20px] text-center text-[#111827] leading-[1.4] font-medium px-4">
                                        You have sent an invitation to sign the notice(s) to your tenant(s) for {leaseName} at {propertyName}
                                    </p>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ReviewSuccessModal;
