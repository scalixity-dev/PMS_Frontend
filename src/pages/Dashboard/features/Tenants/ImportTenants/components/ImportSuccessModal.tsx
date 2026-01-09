import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// Correct relative path to the animation file
import successAnimationUrl from '../../../ListUnit/Success.lottie?url';

interface ImportSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    successCount: number;
    failureCount: number;
    total?: number;
    jobId?: string | null;
}

const ImportSuccessModal: React.FC<ImportSuccessModalProps> = ({
    isOpen,
    onClose,
    successCount,
    failureCount,
    total,
    jobId,
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
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
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
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="bg-[#3A6D6C] p-3 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="text-white hover:text-gray-200 transition-colors focus:outline-none"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col items-center text-center">
                                    {/* Animation */}
                                    <div className="w-40 h-40 mb-4">
                                        <DotLottieReact
                                            src={successAnimationUrl}
                                            loop
                                            autoplay
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    </div>

                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl font-bold text-gray-900 mb-2"
                                    >
                                        Well Done !
                                    </Dialog.Title>

                                    <p className="text-gray-600 font-medium mb-4">
                                        {jobId
                                            ? 'Your import job has been queued and will be processed in the background.'
                                            : 'Your Tenants were successfully imported'
                                        }
                                    </p>
                                    {total !== undefined && (
                                        <p className="text-sm text-gray-500 mb-8">
                                            Total rows: {total}
                                        </p>
                                    )}

                                    {/* Stats Card */}
                                    <div className="w-full border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
                                        <div className="flex items-center justify-between gap-2">
                                            {/* Success Stat */}
                                            <div className="flex items-center gap-2 bg-[#E3EBDE] px-1.5 py-1.5 rounded-full">
                                                <div className="w-6 h-6 rounded-full bg-[#7BD747] flex items-center justify-center text-white text-xs font-bold">
                                                    {successCount}
                                                </div>
                                                <span className="text-[#3A6D6C] text-sm font-medium whitespace-nowrap">
                                                    Successfully imported
                                                </span>
                                            </div>

                                            {/* Failure Stat */}
                                            <div className="flex items-center gap-2 bg-[#fee2e2] px-1.5 py-1.5 rounded-full">
                                                <div className="w-6 h-6 rounded-full bg-[#ef4444] flex items-center justify-center text-white text-xs font-bold">
                                                    {failureCount}
                                                </div>
                                                <span className="text-[#991b1b] text-sm font-medium whitespace-nowrap">
                                                    Not imported
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Done Button */}
                                    <button
                                        type="button"
                                        className="w-full max-w-[200px] justify-center rounded-lg bg-[#3A6D6C] px-4 py-2 text-sm font-medium text-white hover:bg-[#2c5251] focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] focus:ring-offset-2 transition-colors"
                                        onClick={onClose}
                                    >
                                        Done
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

export default ImportSuccessModal;
