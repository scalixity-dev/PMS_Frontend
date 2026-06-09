import React, { useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import SignatureCanvas from 'react-signature-canvas';
import { X, RotateCcw } from 'lucide-react';

interface SignaturePadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (signatureDataUrl: string) => void;
    signerLabel?: string;
}

const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    signerLabel = 'Landlord',
}) => {
    const sigPadRef = useRef<SignatureCanvas | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [activeTab, setActiveTab] = useState<'draw' | 'type'>('draw');
    const [typedName, setTypedName] = useState('');

    const handleClear = () => {
        sigPadRef.current?.clear();
        setIsEmpty(true);
    };

    const handleConfirm = () => {
        if (activeTab === 'draw') {
            if (!sigPadRef.current || sigPadRef.current.isEmpty()) return;
            let dataUrl = '';
            try {
                dataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
            } catch (e) {
                console.error('Failed to get trimmed canvas, falling back to full canvas:', e);
                dataUrl = sigPadRef.current.getCanvas().toDataURL('image/png');
            }
            onConfirm(dataUrl);
        } else {
            if (!typedName.trim()) return;
            // Render typed name onto a canvas
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = "italic 48px 'Georgia', serif";
                ctx.fillStyle = '#1a1a1a';
                ctx.textBaseline = 'middle';
                ctx.fillText(typedName, 20, 52);
            }
            onConfirm(canvas.toDataURL('image/png'));
        }
        onClose();
    };

    const handleEnd = () => {
        setIsEmpty(sigPadRef.current?.isEmpty() ?? true);
    };

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-[400]" onClose={onClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <Dialog.Title className="text-white font-bold text-lg">Sign Document</Dialog.Title>
                                        <p className="text-[#a8d5d4] text-xs mt-0.5">Signing as: {signerLabel}</p>
                                    </div>
                                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {/* Tabs */}
                                    <div className="flex gap-2 mb-5">
                                        <button
                                            onClick={() => setActiveTab('draw')}
                                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'draw' ? 'bg-[#3A6D6C] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            Draw Signature
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('type')}
                                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'type' ? 'bg-[#3A6D6C] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            Type Signature
                                        </button>
                                    </div>

                                    {activeTab === 'draw' ? (
                                        <div>
                                            <p className="text-xs text-gray-400 mb-3">Draw your signature in the box below</p>
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-[#fafafa] relative">
                                                <SignatureCanvas
                                                    ref={sigPadRef}
                                                    penColor="#1a1a1a"
                                                    canvasProps={{
                                                        className: 'w-full',
                                                        style: { width: '100%', height: '180px', display: 'block' },
                                                    }}
                                                    onEnd={handleEnd}
                                                />
                                                {isEmpty && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <p className="text-gray-300 text-sm select-none">Sign here</p>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={handleClear}
                                                className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <RotateCcw size={13} />
                                                Clear
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-xs text-gray-400 mb-3">Type your full name to generate a signature</p>
                                            <input
                                                type="text"
                                                value={typedName}
                                                onChange={(e) => setTypedName(e.target.value)}
                                                placeholder="Your full name"
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3A6D6C] focus:ring-1 focus:ring-[#3A6D6C]"
                                            />
                                            {typedName && (
                                                <div className="mt-4 border border-gray-100 rounded-xl px-6 py-4 bg-[#fafafa] text-center">
                                                    <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', color: '#1a1a1a' }}>
                                                        {typedName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Disclaimer */}
                                    <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
                                        By clicking "Confirm Signature", you agree that your electronic signature is the legal equivalent of your handwritten signature.
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-5">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleConfirm}
                                            disabled={activeTab === 'draw' ? isEmpty : !typedName.trim()}
                                            className="flex-1 bg-[#3A6D6C] hover:bg-[#2d5650] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                                        >
                                            Confirm Signature
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

export default SignaturePadModal;
