import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Search, AlertTriangle, Check } from 'lucide-react';
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

// Match backend KeyType enum exactly
const KEY_TYPE_OPTIONS = [
    { value: 'DOOR', label: 'Door' },
    { value: 'GARAGE', label: 'Garage' },
    { value: 'GATE', label: 'Gate' },
    { value: 'MAILBOX', label: 'Mailbox' },
    { value: 'STORAGE', label: 'Storage' },
    { value: 'OTHER', label: 'Other' },
];

// Match backend KeyStatus enum exactly
const KEY_STATUS_OPTIONS = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'ISSUED', label: 'Issued' },
    { value: 'LOST', label: 'Lost' },
    { value: 'DAMAGED', label: 'Damaged' },
    { value: 'INACTIVE', label: 'Inactive' },
];

const AssignKeyModal: React.FC<AssignKeyModalProps> = ({ isOpen, onClose, onAssign, propertyId, unitId }) => {
    const [mode, setMode] = useState<'select' | 'create'>('select');
    const [selectedKeyId, setSelectedKeyId] = useState('');
    const [keyName, setKeyName] = useState('');
    const [keyType, setKeyType] = useState('DOOR');
    const [keyStatus, setKeyStatus] = useState('AVAILABLE');
    const [description, setDescription] = useState('');
    const [issuedTo, setIssuedTo] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState('');
    // Reassign confirmation: stores the key whose property link will be replaced.
    const [confirmReassign, setConfirmReassign] = useState<{ keyId: string; oldPropertyName: string } | null>(null);
    const navigate = useNavigate();

    const { data: allKeys = [], isLoading } = useGetAllKeys(isOpen);
    const updateKeyMutation = useUpdateKey();
    const createKeyMutation = useCreateKey();

    // Show every key the manager owns EXCEPT the ones already linked to this property.
    // Keys linked to OTHER properties are still shown so the manager can re-link them
    // — they get an "Assigned to: X" badge plus a confirmation step before reassigning.
    const candidateKeys = useMemo(() => {
        const list: any[] = Array.isArray(allKeys) ? allKeys : [];
        return list.filter((k: any) => !propertyId || k.propertyId !== propertyId);
    }, [allKeys, propertyId]);

    const filteredKeys = useMemo(() => {
        if (!search.trim()) return candidateKeys;
        const q = search.toLowerCase();
        return candidateKeys.filter((k: any) => {
            const haystack = [
                k.keyName,
                k.keyType,
                k.status,
                k.property?.propertyName,
                k.unit?.unitName,
                k.issuedTo,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [candidateKeys, search]);

    const resetForm = () => {
        setMode('select');
        setSelectedKeyId('');
        setKeyName('');
        setKeyType('DOOR');
        setKeyStatus('AVAILABLE');
        setDescription('');
        setIssuedTo('');
        setError('');
        setSearch('');
        setConfirmReassign(null);
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

    const performAssign = async (keyId: string) => {
        if (!propertyId) {
            onAssign(keyId);
            handleClose();
            return;
        }
        setIsSaving(true);
        setError('');
        try {
            await updateKeyMutation.mutateAsync({
                keyId,
                updateData: { propertyId, unitId: unitId || null },
            });
            onAssign(keyId);
            handleClose();
        } catch (e: any) {
            setError(e?.message || 'Failed to assign key');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSelectKey = (key: any) => {
        setSelectedKeyId(key.id);
        setError('');
        // Key is already on a different property — confirm before re-linking.
        if (key.propertyId && key.property?.propertyName) {
            setConfirmReassign({ keyId: key.id, oldPropertyName: key.property.propertyName });
            return;
        }
        // No old property (shouldn't happen given schema, but treat as direct assign).
        performAssign(key.id);
    };

    if (!isOpen) return null;

    const inputCls = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C]/20';

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden max-h-[92vh] flex flex-col">
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">
                        {mode === 'create' ? 'Add New Key' : 'Assign a Key'}
                    </h2>
                    <button onClick={handleClose} className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto">
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
                        <div className="space-y-3">
                            {isLoading ? (
                                <div className="flex items-center gap-2 text-gray-600 py-4">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Loading keys...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search by name, type, property…"
                                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C]/20"
                                        />
                                    </div>

                                    {/* Key list */}
                                    <div className="bg-white rounded-xl border border-gray-100 max-h-[320px] overflow-y-auto">
                                        {filteredKeys.length === 0 ? (
                                            <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                {candidateKeys.length === 0
                                                    ? 'No keys available — create a new one.'
                                                    : 'No matches.'}
                                            </div>
                                        ) : (
                                            filteredKeys.map((k: any) => {
                                                const isSelected = selectedKeyId === k.id;
                                                const assignedTo = k.property?.propertyName;
                                                return (
                                                    <button
                                                        key={k.id}
                                                        onClick={() => handleSelectKey(k)}
                                                        disabled={isSaving}
                                                        className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-100 last:border-0 transition-colors ${
                                                            isSelected ? 'bg-[#E0F0EE]' : 'hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-semibold text-gray-900 truncate">
                                                                    {k.keyName || 'Unnamed'}
                                                                </span>
                                                                <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 shrink-0">
                                                                    {k.keyType}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                                                                {assignedTo ? (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                                                        <AlertTriangle className="w-3 h-3" />
                                                                        Assigned to: {assignedTo}
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                                        <Check className="w-3 h-3" />
                                                                        Available
                                                                    </span>
                                                                )}
                                                                {k.issuedTo && (
                                                                    <span className="text-[11px] text-gray-500">
                                                                        held by {k.issuedTo}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <Check className="w-4 h-4 text-[#3A6D6C] shrink-0" />
                                                        )}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-500 pt-1">
                                        Manage all keys at{' '}
                                        <span
                                            className="text-[#3A6D6C] font-medium cursor-pointer hover:underline"
                                            onClick={() => navigate('/dashboard/portfolio/keys-locks')}
                                        >
                                            Keys & Locks page
                                        </span>
                                        .
                                    </p>
                                </>
                            )}
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

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleClose}
                            disabled={isSaving}
                            className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        {mode === 'create' && (
                            <button
                                onClick={handleCreate}
                                disabled={isSaving}
                                className="flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSaving ? 'Saving...' : 'Create Key'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Reassign confirmation overlay */}
            {confirmReassign && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="bg-red-500 px-5 py-4 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-white" />
                            <h3 className="text-white text-base font-semibold">Re-link this key?</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <p className="text-sm text-gray-700">
                                This key is currently linked to{' '}
                                <span className="font-semibold text-gray-900">{confirmReassign.oldPropertyName}</span>.
                                Continuing will unlink it from that property and assign it here.
                            </p>
                            <p className="text-xs text-gray-500">
                                The previous property will lose access to this key. This action is reversible
                                from the Keys &amp; Locks page.
                            </p>
                        </div>
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => setConfirmReassign(null)}
                                disabled={isSaving}
                                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    const id = confirmReassign.keyId;
                                    setConfirmReassign(null);
                                    await performAssign(id);
                                }}
                                disabled={isSaving}
                                className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                Yes, re-link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body,
    );
};

export default AssignKeyModal;
