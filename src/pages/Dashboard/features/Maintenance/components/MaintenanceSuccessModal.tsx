import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimationUrl from '../../ListUnit/Success.lottie?url';

interface MaintenanceSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToList: () => void;
    onAssignPro: () => void;
    requestId: string;
    propertyName: string;
}

const MaintenanceSuccessModal: React.FC<MaintenanceSuccessModalProps> = ({
    isOpen,
    onClose,
    onBackToList,
    onAssignPro,
    requestId,
    propertyName,
}) => {
    const navigate = useNavigate();
    const [isClosing, setIsClosing] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const [animationData, setAnimationData] = useState<ArrayBuffer | string | null>(null);

    // Load Lottie file as ArrayBuffer to avoid buffer size mismatch
    useEffect(() => {
        const loadAnimation = async () => {
            try {
                const response = await fetch(successAnimationUrl);
                if (!response.ok) {
                    throw new Error('Failed to load animation');
                }
                const arrayBuffer = await response.arrayBuffer();
                setAnimationData(arrayBuffer);
            } catch (error) {
                console.error('Error loading Lottie animation:', error);
                // Fallback to URL if ArrayBuffer loading fails
                setAnimationData(successAnimationUrl);
            }
        };

        if (isOpen) {
            loadAnimation();
        }
    }, [isOpen]);

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
                        className={`fixed inset-0 bg-white/30 ${isClosing ? 'backdrop-blur-0' : 'backdrop-blur-xs'} transition-all duration-200`}
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="bg-[#3D7475] p-4 flex justify-end">
                                    <button
                                        onClick={() =>
                                            animateAndThen(() => {
                                                onClose();
                                                navigate('/dashboard');
                                            })
                                        }
                                        className="text-white hover:text-gray-200 transition-colors focus:outline-none"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col items-center text-center relative overflow-hidden">
                                    {/* Main Content */}
                                    <div className="relative z-10 flex flex-col items-center w-full">
                                        {/* Success Icon */}
                                        <div className="mb-2 relative flex items-center justify-center">
                                            <div className="w-40 h-40 pointer-events-none">
                                                <DotLottieReact
                                                    {...(animationData instanceof ArrayBuffer
                                                        ? { data: animationData }
                                                        : { src: typeof animationData === 'string' ? animationData : successAnimationUrl }
                                                    )}
                                                    loop
                                                    autoplay
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </div>
                                        </div>

                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl font-bold leading-6 text-gray-900 mb-2"
                                        >
                                            Well Done !
                                        </Dialog.Title>

                                        <div className="mb-2">
                                            <p className="text-gray-600 font-medium text-lg leading-relaxed">
                                                You have created a new Maintenance request <span className="font-bold text-gray-800">#{requestId}</span> for <span className="font-bold text-gray-800">{propertyName}</span>
                                            </p>
                                        </div>

                                        <div className="w-full flex items-center gap-4 mb-2">
                                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                                            <span className="text-gray-400 font-medium">or</span>
                                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                                        </div>

                                        {/* Find Service Pro Card */}
                                        <div className="w-full border border-gray-200 rounded-xl p-4 text-left mb-8">
                                            <h4 className="font-bold text-gray-900 mb-2">Find a Service Pro</h4>
                                            <p className="text-gray-500 text-sm mb-3">
                                                You have created a new Maintenance request #{requestId} for {propertyName}
                                            </p>
                                            <button className="text-[#3D7475] font-bold text-sm hover:underline">
                                                Find a Service Pro
                                            </button>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                            <button
                                                type="button"
                                                className="flex-1 justify-center rounded-lg border border-transparent bg-[#4A5568] px-6 py-3 text-sm font-medium text-white hover:bg-[#2D3748] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                onClick={() => animateAndThen(onBackToList)}
                                            >
                                                Back to list
                                            </button>
                                            <button
                                                type="button"
                                                className="flex-1 justify-center rounded-lg border border-transparent bg-[#3D7475] px-6 py-3 text-sm font-medium text-white hover:bg-[#2c5556] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7475] focus-visible:ring-offset-2"
                                                onClick={() => animateAndThen(onAssignPro)}
                                            >
                                                Assign Service Pro
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

export default MaintenanceSuccessModal;
