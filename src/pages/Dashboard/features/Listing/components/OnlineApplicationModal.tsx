import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';

interface OnlineApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (status: string, fee: string) => void;
    initialStatus: string;
    initialFee: string;
}

const OnlineApplicationModal: React.FC<OnlineApplicationModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialStatus,
    initialFee
}) => {
    const [status, setStatus] = useState(initialStatus);
    const [fee, setFee] = useState(initialFee);

    useEffect(() => {
        setStatus(initialStatus);
        setFee(initialFee);
    }, [initialStatus, initialFee, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSave(status, fee);
        onClose();
    };

    const statusOptions = [
        { value: 'Enabled', label: 'Enabled' },
        { value: 'Disabled', label: 'Disabled' }
    ];

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 animate-in fade-in duration-200 font-['Urbanist']">
            <div className="bg-[#E8ECEB] rounded-3xl w-full max-w-sm shadow-2xl animate-slide-in-from-right relative">
                {/* Header */}
                <div className="bg-[#3D7475] p-4 flex items-center justify-between rounded-t-3xl">
                    <h2 className="text-lg font-medium text-white">Online Application</h2>
                    <button onClick={onClose} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    {/* Status Dropdown */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                        <CustomDropdown
                            value={status}
                            onChange={(value) => setStatus(value)}
                            options={statusOptions}
                            placeholder="Select Status"
                            buttonClassName="w-full bg-white text-gray-800 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm border-none"
                        />
                    </div>

                    {/* Application Fee Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Application Fee</label>
                        <input
                            type="number"
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                            placeholder="Enter Amount"
                            className="w-full bg-white text-gray-800 placeholder-gray-400 px-3 py-2.5 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm text-sm"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-2 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white text-gray-800 py-2.5 rounded-md font-bold hover:bg-gray-50 transition-colors shadow-md border border-gray-100 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-[#3D7475] text-white py-2.5 rounded-md font-bold hover:bg-[#2c5556] transition-colors shadow-md text-sm"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default OnlineApplicationModal;
