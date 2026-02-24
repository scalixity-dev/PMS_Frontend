import React from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, AlertTriangle } from 'lucide-react';

interface LocationMismatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    jobLocation: string;
    jobAddress: string;
    isLoading?: boolean;
}

const LocationMismatchModal: React.FC<LocationMismatchModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    jobLocation,
    jobAddress,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" 
            onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}
        >
            <div 
                className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-amber-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-white" />
                        <h2 className="text-lg font-bold text-white">Location Mismatch</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={isLoading}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors text-white disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            This job is located outside your registered service area. The property location is:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">{jobLocation}</p>
                                    <p className="text-sm text-gray-600">{jobAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-amber-800">
                            <strong>Note:</strong> You can still apply for this job, but the property manager may prefer service providers in the local area. Consider updating your service area in your business profile if you regularly serve this location.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 bg-[#7CD947] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#6BC837] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Applying...
                                </>
                            ) : (
                                'Apply Anyway'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LocationMismatchModal;
