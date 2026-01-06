import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';

interface AssignKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (keyId: string) => void;
}

const AssignKeyModal: React.FC<AssignKeyModalProps> = ({ isOpen, onClose, onAssign }) => {
    const [selectedKeyId, setSelectedKeyId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Mock options for keys - In a real app, this would come from a query
    const keyOptions = [
        { value: '1', label: 'Key 1 - Main Door' },
        { value: '2', label: 'Key 2 - Back Door' },
        { value: '3', label: 'Key 3 - Garage' },
        { value: 'add_new_key', label: '+ Add New Key' }
    ];

    const handleKeyChange = (value: string) => {
        if (value === 'add_new_key') {
            navigate('/dashboard/portfolio/add-key');
            return;
        }
        setSelectedKeyId(value);
        if (error) setError('');
    };

    const handleAssign = () => {
        if (!selectedKeyId) {
            setError('Please select a key');
            return;
        }

        onAssign(selectedKeyId);
        onClose();
        setSelectedKeyId('');
        setError('');
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-lg font-medium">Assign a key</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            You can add, store and track the information about the unit keys. You can add up to 5 keys.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <CustomDropdown
                            label="Select Key"
                            value={selectedKeyId}
                            onChange={handleKeyChange}
                            options={keyOptions}
                            placeholder="Select a key"
                            searchable={true}
                            buttonClassName="bg-white"
                            dropdownClassName="relative shadow-sm border-gray-200"
                            error={!!error}
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        <p className="text-xs text-gray-500 mt-2">
                            You can create and manage all keys at <span
                                className="text-[#3A6D6C] font-medium cursor-pointer hover:underline"
                                onClick={() => navigate('/dashboard/portfolio/keys-locks')}
                            >
                                Keys & Locks page
                            </span>.
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAssign}
                            className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            Assign a key
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AssignKeyModal;
