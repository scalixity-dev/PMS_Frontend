import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface RequestVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payer: 'applicant' | 'me') => void;
}

const RequestVerificationModal: React.FC<RequestVerificationModalProps> = ({ isOpen, onClose, onSave }) => {
    const [payer, setPayer] = useState<'applicant' | 'me'>('applicant');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setPayer('applicant');
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-in-from-bottom-8 relative overflow-hidden flex flex-col font-sans">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-5 flex items-center justify-between text-white rounded-t-2xl">
                    <h2 className="text-lg font-medium">Request income & employment verification</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                        You are about to send an income & employment verification request to this applicant.
                    </p>

                    <h3 className="text-base font-bold text-gray-800 mb-4">
                        Who will pay the $12.00 verification fee?
                    </h3>

                    <div className="space-y-3 mb-8">
                        {/* Option: Applicant */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center w-5 h-5">
                                <input
                                    type="radio"
                                    name="payer"
                                    value="applicant"
                                    checked={payer === 'applicant'}
                                    onChange={() => setPayer('applicant')}
                                    className="peer appearance-none w-5 h-5 border-2 border-[#84D34C] rounded-full checked:bg-white checked:border-[#84D34C] transition-colors"
                                />
                                <div className="absolute w-2.5 h-2.5 bg-[#84D34C] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-gray-900 font-medium">Applicant</span>
                        </label>

                        {/* Option: Me */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center w-5 h-5">
                                <input
                                    type="radio"
                                    name="payer"
                                    value="me"
                                    checked={payer === 'me'}
                                    onChange={() => setPayer('me')}
                                    className="peer appearance-none w-5 h-5 border-2 border-[#84D34C] rounded-full checked:bg-white checked:border-[#84D34C] transition-colors"
                                />
                                <div className="absolute w-2.5 h-2.5 bg-[#84D34C] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-gray-900 font-medium">Me</span>
                        </label>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center gap-4 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-[#4A5568] text-white py-3 rounded-xl font-medium hover:bg-[#2D3748] transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onSave(payer);
                                onClose();
                            }}
                            className="flex-1 bg-[#3A6D6C] text-white py-3 rounded-xl font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestVerificationModal;
