import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// Importing from the sibling feature for now to reuse the asset
import successAnimationUrl from '../../ListUnit/Success.lottie?url';

interface ApplicationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
    isOpen,
    onClose,
}) => {
    const navigate = useNavigate();
    const [isClosing, setIsClosing] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const animateAndThen = (cb: () => void) => {
        setIsClosing(true);
        // match modal leave duration (200ms)
        timeoutRef.current = window.setTimeout(() => {
            cb();
        }, 200);
    };

    const handleViewApplications = () => {
        animateAndThen(() => {
            onClose();
            navigate('/dashboard/leasing/applications');
        });
    };

    const handleGoHome = () => {
        animateAndThen(() => {
            onClose();
            navigate('/dashboard');
        });
    };

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
                    <div
                        className={`fixed inset-0 bg-white/30 ${isClosing ? 'backdrop-blur-0' : 'backdrop-blur-lg'} transition-all duration-200`}
                    />
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
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="bg-[#3D7475] p-3 flex justify-end">
                                    <button
                                        onClick={() => animateAndThen(onClose)}
                                        className="text-white hover:text-gray-200 transition-colors focus:outline-none"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col items-center text-center relative overflow-hidden">
                                    {/* Main Content */}
                                    <div className="relative z-10 flex flex-col items-center w-full">
                                        {/* Success Icon */}
                                        <div className="mt-6 mb-4 relative flex items-center justify-center">
                                            <div className="w-40 h-40 pointer-events-none">
                                                <DotLottieReact
                                                    src={successAnimationUrl}
                                                    loop
                                                    autoplay
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </div>
                                        </div>

                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl font-bold leading-6 text-gray-900 mt-2 mb-3"
                                        >
                                            Well Done !
                                        </Dialog.Title>

                                        <div className="mt-1 mb-6">
                                            <p className="text-gray-600 font-medium text-base leading-relaxed">
                                                Your application has been submitted successfully.
                                            </p>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-lg border border-transparent bg-[#4A5568] px-4 py-2 text-sm font-medium text-white hover:bg-[#2D3748] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 min-w-[120px]"
                                                onClick={handleGoHome}
                                            >
                                                Home
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-lg border border-transparent bg-[#3D7475] px-4 py-2 text-sm font-medium text-white hover:bg-[#2c5556] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7475] focus-visible:ring-offset-2 min-w-[140px]"
                                                onClick={handleViewApplications}
                                            >
                                                View Applications
                                            </button>
                                        </div>
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

export default ApplicationSuccessModal;
