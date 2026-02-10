import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimationUrl from '../../ListUnit/Success.lottie?url';
import { API_ENDPOINTS } from '../../../../../config/api.config';

interface MoveInSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToLease: () => void;
    onRequestSignature: () => void;
    leaseNumber?: string;
    propertyName: string;
    leaseId?: string;
    propertyId?: string;
}

const MoveInSuccessModal: React.FC<MoveInSuccessModalProps> = ({
    isOpen,
    onClose,
    onBackToLease,
    onRequestSignature,
    leaseNumber = "9",
    propertyName,
    leaseId,
    propertyId,
}) => {
    const navigate = useNavigate();
    const [isClosing, setIsClosing] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const [animationData, setAnimationData] = useState<ArrayBuffer | string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

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

    const handleUploadClick = () => {
        if (!leaseId) {
            alert('Lease information is not available. Please go back to the lease and try again.');
            return;
        }
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'DOCUMENT');
            if (propertyId) {
                formData.append('propertyId', propertyId);
            }

            const response = await fetch(API_ENDPOINTS.UPLOAD.FILE, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to upload file' }));
                throw new Error(errorData.message || 'Failed to upload file');
            }

            await response.json();
            console.log('Success: Document uploaded successfully.');
            setUploadError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to upload file. Please try again.';
            setUploadError(message);
            console.error('Error:', message);
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
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
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all border border-gray-100">
                                {/* Header */}
                                <div className="bg-[#3D7475] p-3 flex justify-end">
                                    <button
                                        onClick={() =>
                                            animateAndThen(() => {
                                                onClose();
                                                navigate('/dashboard');
                                            })
                                        }
                                        className="text-white hover:text-gray-200 transition-colors focus:outline-none"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-6 py-4 flex flex-col items-center text-center relative overflow-hidden">
                                    {/* Main Content */}
                                    <div className="relative z-10 flex flex-col items-center w-full">
                                        {/* Success Icon */}
                                        <div className="mb-1 relative flex items-center justify-center">
                                            <div className="w-28 h-28 pointer-events-none">
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
                                            className="text-2xl font-bold leading-6 text-gray-900 mb-1"
                                        >
                                            Well Done !
                                        </Dialog.Title>

                                        <div className="mb-4">
                                            <p className="text-gray-900 font-bold text-lg mb-1">
                                                You have created a Lease #{leaseNumber} for {propertyName}.
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                Finalize the lease agreement and send it for e-signatures.
                                            </p>
                                        </div>

                                        <div className="w-full flex items-center gap-4 mb-4">
                                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                                            <span className="text-gray-800 font-medium">or</span>
                                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                                        </div>

                                        {/* Attachments Card */}
                                        <div className="w-full border border-gray-200 rounded-xl p-3 text-left mb-2 bg-white shadow-sm">
                                            <h4 className="font-bold text-gray-900 mb-1">Attachments</h4>
                                            <p className="text-gray-500 text-xs mb-2">
                                                Attach pre-signed documents or additional files to your lease.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleUploadClick}
                                                disabled={isUploading}
                                                className="text-[#3D7475] font-bold text-xs hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            {uploadError && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {uploadError}
                                                </p>
                                            )}
                                        </div>

                                        {/* Online Payments Card */}
                                        {/* <div className="w-full border border-gray-200 rounded-xl p-3 text-left mb-4 bg-white shadow-sm">
                                            <h4 className="font-bold text-gray-900 mb-1">Online Payments</h4>
                                            <p className="text-gray-500 text-xs mb-2">
                                                Set up online payments and collect rent with ease.
                                            </p>
                                            <button className="text-[#3D7475] font-bold text-xs hover:underline">
                                                Set up payments
                                            </button>
                                        </div> */}

                                        {/* Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                            <button
                                                type="button"
                                                className="flex-1 justify-center rounded-lg border border-transparent bg-[#4A5568] px-4 py-3 text-sm font-medium text-white hover:bg-[#2D3748] focus:outline-none shadow-md"
                                                onClick={() => animateAndThen(onBackToLease)}
                                            >
                                                Back to lease
                                            </button>
                                            <button
                                                type="button"
                                                className="flex-1 justify-center rounded-lg border border-transparent bg-[#3D7475] px-4 py-3 text-sm font-medium text-white hover:bg-[#2c5556] focus:outline-none shadow-md"
                                                onClick={() => animateAndThen(onRequestSignature)}
                                            >
                                                Request e-signature
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

export default MoveInSuccessModal;
