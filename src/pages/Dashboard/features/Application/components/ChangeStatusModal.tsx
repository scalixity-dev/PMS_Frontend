import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ChangeStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data?: { rejectionReason: string }) => Promise<void>;
    type: 'approve' | 'review' | 'decline';
}

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    type,
}) => {
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (type === 'decline' && !reason.trim()) return;

        setIsLoading(true);
        try {
            await onConfirm(type === 'decline' ? { rejectionReason: reason } : undefined);
            onClose();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'approve': return 'Approve application';
            case 'review': return 'Change status';
            case 'decline': return 'You\'re about to decline the application';
            default: return '';
        }
    };

    const getDescription = () => {
        switch (type) {
            case 'approve': return 'Would you like to approve this rental application?';
            case 'review': return 'Would you like to change the status of this rental application to In Review?';
            case 'decline': return 'Are you sure you want to decline this application?';
            default: return '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-3xl w-full max-w-[500px] shadow-2xl animate-in zoom-in-95 duration-200 relative">

                {/* Header - Always Green as requested */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-3xl">
                    <div className="flex items-center gap-2">
                        {type === 'decline' && <AlertTriangle size={20} className="text-white" />}
                        <h2 className="text-lg font-medium">{getTitle()}</h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-[#2c3e50] font-medium text-lg mb-4">
                        {getDescription()}
                    </p>

                    {type === 'decline' && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">
                                Please provide the decline reason
                            </label>
                            <div className="relative">
                                <textarea
                                    className="w-full bg-white p-3 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm border-none min-h-[120px] resize-none"
                                    placeholder="Your reason *"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    maxLength={500}
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">
                                    Character limit: {reason.length} / 500
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors bg-white"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`px-8 py-2.5 rounded-lg font-bold text-white bg-[#3A6D6C] hover:bg-[#2c5251] transition-colors disabled:opacity-70 disabled:cursor-not-allowed`}
                            disabled={isLoading || (type === 'decline' && !reason.trim())}
                        >
                            {isLoading ? 'Processing...' : (type === 'decline' ? 'Yes, I\'m sure' : 'Confirm')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeStatusModal;
