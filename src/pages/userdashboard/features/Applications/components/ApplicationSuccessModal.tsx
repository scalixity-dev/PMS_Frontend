import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimationUrl from '../../../../Dashboard/features/ListUnit/Success.lottie?url';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';

interface ApplicationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
    isWarning?: boolean;
}

const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
    isOpen,
    onClose,
    message,
    isWarning = false,
}) => {
    const navigate = useNavigate();
    const [isClosing, setIsClosing] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const animateAndThen = (cb: () => void) => {
        setIsClosing(true);
        timeoutRef.current = window.setTimeout(() => cb(), 200);
    };

    const handleViewApplications = () => {
        animateAndThen(() => {
            onClose();
            navigate('/userdashboard/applications');
        });
    };

    const handleGoHome = () => {
        animateAndThen(() => {
            onClose();
            navigate('/userdashboard');
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
                    <div className={`fixed inset-0 bg-white/40 ${isClosing ? 'backdrop-blur-0' : 'backdrop-blur-md'} transition-all`} />
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
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-center shadow-2xl transition-all border border-[#E5E7EB]">
                                <div className="flex justify-end absolute top-6 right-6">
                                    <button onClick={() => animateAndThen(onClose)} className="text-gray-300 hover:text-gray-500 transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="mt-4 mb-6 flex justify-center">
                                    <div className="w-40 h-40">
                                        <DotLottieReact src={successAnimationUrl} loop autoplay style={{ width: '100%', height: '100%' }} />
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-bold mb-2 ${isWarning ? 'text-[#F57C00]' : 'text-[#1A1A1A]'}`}>
                                    {isWarning ? 'Saved Locally' : 'Well Done!'}
                                </h3>
                                <p className="text-[#ADADAD] text-sm mb-8 font-medium leading-relaxed">
                                    {message || "Your application has been submitted successfully. We'll notify you once it's reviewed."}
                                </p>

                                <div className="flex flex-col gap-3">
                                    <PrimaryActionButton
                                        text="View My Applications"
                                        onClick={handleViewApplications}
                                        className="bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 py-3.5 rounded-full text-white font-bold uppercase"
                                    />
                                    <button
                                        onClick={handleGoHome}
                                        className="text-[#ADADAD] hover:text-[#1A1A1A] text-sm font-bold uppercase transition-colors py-2"
                                    >
                                        Back to Dashboard
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

export default ApplicationSuccessModal;
