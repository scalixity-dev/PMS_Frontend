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

const KEY_TYPE_OPTIONS = [
    { value: 'MAIN_DOOR', label: 'Main Door' },
    { value: 'UNIT_DOOR', label: 'Unit Door' },
    { value: 'BACK_DOOR', label: 'Back Door' },
    { value: 'GARAGE', label: 'Garage' },
    { value: 'MAILBOX', label: 'Mailbox' },
    { value: 'STORAGE', label: 'Storage' },
    { value: 'OTHER', label: 'Other' },
];

const KEY_STATUS_OPTIONS = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'ASSIGNED', label: 'Assigned' },
    { value: 'LOST', label: 'Lost' },
    { value: 'RETURNED', label: 'Returned' },
];

const AssignKeyModal: React.FC<AssignKeyModalProps> = ({ isOpen, onClose, onAssign, propertyId, unitId }) => {
    const [mode, setMode] = useState<'select' | 'create'>('select');
    const [selectedKeyId, setSelectedKeyId] = useState('');
    const [keyName, setKeyName] = useState('');
    const [keyType, setKeyType] = useState('MAIN_DOOR');
    const [keyStatus, setKeyStatus] = useState('AVAILABLE');
    const [description, setDescription] = useState('');
    const [issuedTo, setIssuedTo] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const { data: allKeys = [], isLoading } = useGetAllKeys(isOpen);
    const updateKeyMutation = useUpdateKey();
    const createKeyMutation = useCreateKey();

    const availableKeys = Array.isArray(allKeys)
        ? allKeys.filter((k: any) => !propertyId || k.propertyId !== propertyId)
        : [];

    const keyOptions = availableKeys.map((k: any) => ({
        value: k.id,
        label: `${k.keyName || 'Unnamed'} - ${k.keyType || 'KEY'}`,
    }));

    const resetForm = () => {
        setMode('select');
        setSelectedKeyId('');
        setKeyName('');
        setKeyType('MAIN_DOOR');
        setKeyStatus('AVAILABLE');
        setDescription('');
        setIssuedTo('');
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleCreate = async () => {
        if (!propertyId) {
            setError('Property ID missing');
            return;
        }
        if (!keyName.trim()) {
            setError('Key name is required');
            return;
        }
        if (!keyType) {
            setError('Key type is required');
            return;
        }

        setIsSaving(true);
        setError('');
        try {
            const newKey = await createKeyMutation.mutateAsync({
                propertyId,
                unitId: unitId || undefined,
                keyName: keyName.trim(),
                keyType: keyType as any,
                status: keyStatus as any,
                description: description.trim() || undefined,
                issuedTo: issuedTo.trim() || undefined,
            });
            onAssign(newKey.id);
            handleClose();
        } catch (e: any) {
            setError(e?.message || 'Failed to create key');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAssignExisting = async () => {
        if (!selectedKeyId) {
            setError('Select a key');
            return;
        }
        if (!propertyId) {
            onAssign(selectedKeyId);
            handleClose();
            return;
        }

        setIsSaving(true);
        setError('');
        try {
            await updateKeyMutation.mutateAsync({
                keyId: selectedKeyId,
                updateData: { propertyId, unitId: unitId || null },
            });
            onAssign(selectedKeyId);
            handleClose();
        } catch (e: any) {
            setError(e?.message || 'Failed to assign key');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const inputCls = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C]/20';

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">
                        {mode === 'create' ? 'Add New Key' : 'Assign a Key'}
                    </h2>
                    <button onClick={handleClose} className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Mode toggle */}
                    <div className="flex gap-2 p-1 bg-white rounded-lg">
                        <button
                            onClick={() => setMode('select')}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${mode === 'select' ? 'bg-[#3A6D6C] text-white' : 'text-gray-700'}`}
                        >
                            Select Existing
                        </button>
                        <button
                            onClick={() => setMode('create')}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${mode === 'create' ? 'bg-[#3A6D6C] text-white' : 'text-gray-700'}`}
                        >
                            Add New Key
                        </button>
                    </div>

                    {mode === 'select' && (
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
                                    onChange={(v) => { setSelectedKeyId(v); setError(''); }}
                                    options={keyOptions}
                                    placeholder={availableKeys.length === 0 ? 'No keys available - create one' : 'Select a key'}
                                    searchable={true}
                                    buttonClassName="bg-white"
                                />
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Manage all keys at <span
                                    className="text-[#3A6D6C] font-medium cursor-pointer hover:underline"
                                    onClick={() => navigate('/dashboard/portfolio/keys-locks')}
                                >Keys & Locks page</span>.
                            </p>
                        </div>
                    )}

                    {mode === 'create' && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Key Name *</label>
                                <input
                                    type="text"
                                    value={keyName}
                                    onChange={(e) => { setKeyName(e.target.value); setError(''); }}
                                    className={inputCls}
                                    placeholder="e.g. Main Entry"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Key Type *</label>
                                <CustomDropdown
                                    value={keyType}
                                    onChange={setKeyType}
                                    options={KEY_TYPE_OPTIONS}
                                    buttonClassName="bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                                <CustomDropdown
                                    value={keyStatus}
                                    onChange={setKeyStatus}
                                    options={KEY_STATUS_OPTIONS}
                                    buttonClassName="bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={inputCls}
                                    placeholder="Optional notes"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Issued To</label>
                                <input
                                    type="text"
                                    value={issuedTo}
                                    onChange={(e) => setIssuedTo(e.target.value)}
                                    className={inputCls}
                                    placeholder="Tenant/person name"
                                />
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleClose}
                            disabled={isSaving}
                            className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                        >Cancel</button>
                        <button
                            onClick={mode === 'create' ? handleCreate : handleAssignExisting}
                            disabled={isSaving || isLoading}
                            className="flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSaving ? 'Saving...' : (mode === 'create' ? 'Create Key' : 'Assign Key')}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AssignKeyModal;
