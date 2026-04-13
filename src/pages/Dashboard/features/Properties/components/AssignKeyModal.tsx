import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import { useNavigate } from 'react-router-dom';
import { useGetAllKeys, useUpdateKey, useCreateKey } from '../../../../../hooks/useKeysQueries';

interface AssignKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (keyId: string) => void;
    propertyId?: string;
    unitId?: string;
}

const AssignKeyModal: React.FC<AssignKeyModalProps> = ({ isOpen, onClose, onAssign, propertyId, unitId }) => {
    const [selectedKeyId, setSelectedKeyId] = useState('');
    const [error, setError] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);
    const navigate = useNavigate();

    // Fetch real keys from API
    const { data: allKeys = [], isLoading } = useGetAllKeys(isOpen);
    const updateKeyMutation = useUpdateKey();
    const createKeyMutation = useCreateKey();

    // Filter keys not assigned to current property (or all if no propertyId)
    const availableKeys = Array.isArray(allKeys)
        ? allKeys.filter((k: any) => !propertyId || k.propertyId !== propertyId)
        : [];

    const keyOptions = [
        ...availableKeys.map((k: any) => ({
            value: k.id,
            label: `${k.keyName || 'Unnamed'} - ${k.keyType || 'KEY'}`,
        })),
        { value: 'add_new_key', label: '+ Create New Key for this Property' },
    ];

    const handleKeyChange = (value: string) => {
        if (value === 'add_new_key') {
            handleCreateNew();
            return;
        }
        setSelectedKeyId(value);
        if (error) setError('');
    };

    const handleCreateNew = async () => {
        if (!propertyId) {
            navigate('/dashboard/portfolio/keys-locks');
            return;
        }

        setIsAssigning(true);
        setError('');
        try {
            const timestamp = Date.now();
            const newKey = await createKeyMutation.mutateAsync({
                propertyId,
                unitId: unitId || undefined,
                keyName: `Key ${timestamp}`,
                keyType: 'MAIN_DOOR' as any,
                status: 'AVAILABLE' as any,
            });
            onAssign(newKey.id);
            onClose();
            setSelectedKeyId('');
        } catch (e: any) {
            setError(e?.message || 'Failed to create key');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedKeyId) {
            setError('Please select a key');
            return;
        }

        if (!propertyId) {
            onAssign(selectedKeyId);
            onClose();
            return;
        }

        setIsAssigning(true);
        setError('');
        try {
            await updateKeyMutation.mutateAsync({
                keyId: selectedKeyId,
                updateData: {
                    propertyId,
                    unitId: unitId || null,
                },
            });
            onAssign(selectedKeyId);
            onClose();
            setSelectedKeyId('');
        } catch (e: any) {
            setError(e?.message || 'Failed to assign key');
        } finally {
            setIsAssigning(false);
        }
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
                            Select an existing key to assign to this property, or create a new one.
                        </p>
                    </div>

                    <div className="space-y-2">
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-gray-600 py-4">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Loading keys...</span>
                            </div>
                        ) : (
                            <CustomDropdown
                                label="Select Key"
                                value={selectedKeyId}
                                onChange={handleKeyChange}
                                options={keyOptions}
                                placeholder={availableKeys.length === 0 ? 'No keys available - create one' : 'Select a key'}
                                searchable={true}
                                buttonClassName="bg-white"
                                dropdownClassName="relative shadow-sm border-gray-200"
                                error={!!error}
                            />
                        )}
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        <p className="text-xs text-gray-500 mt-2">
                            Manage all keys at <span
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
                            disabled={isAssigning}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAssign}
                            disabled={isAssigning || isLoading}
                            className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isAssigning && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isAssigning ? 'Assigning...' : 'Assign a key'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AssignKeyModal;
