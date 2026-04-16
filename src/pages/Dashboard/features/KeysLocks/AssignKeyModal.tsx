import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import SearchableDropdown from '../../../../components/ui/SearchableDropdown';

interface AssignKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (issuedTo: string) => void;
    tenants?: string[];
    /** @deprecated use `tenants` — kept for backward compatibility */
    properties?: string[];
    /** "assign" for unassigned keys, "reassign" when a key is already issued. */
    mode?: 'assign' | 'reassign';
    /** Current assignee (used for reassign UI). */
    currentAssignee?: string | null;
    /** People who already hold another active key (for collision warnings). */
    namesWithExistingKeys?: string[];
}

const AssignKeyModal: React.FC<AssignKeyModalProps> = ({
    isOpen,
    onClose,
    onAssign,
    tenants,
    properties = [],
    mode = 'assign',
    currentAssignee,
    namesWithExistingKeys = [],
}) => {
    const [selectedProperty, setSelectedProperty] = useState('');
    const options = tenants && tenants.length > 0 ? tenants : properties;
    const isReassign = mode === 'reassign';
    const trimmedSelection = selectedProperty?.trim() || '';
    const isSameAsCurrent =
        isReassign && currentAssignee
            ? trimmedSelection.toLowerCase() === currentAssignee.toLowerCase()
            : false;
    const collidesWithExisting =
        trimmedSelection.length > 0 &&
        namesWithExistingKeys.some((n) => n.toLowerCase() === trimmedSelection.toLowerCase());

    useEffect(() => {
        // Capture the current overflow value before making any changes
        const previousOverflow = document.body.style.overflow || '';
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = previousOverflow;
        }
        
        return () => {
            // Restore the original overflow value on cleanup
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#E0E5E5] w-full max-w-md rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <h2 className="text-xl font-medium text-white">
                            {isReassign ? 'Re-assign key' : 'Assign a key'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-xs text-gray-500 mb-3">
                        {isReassign
                            ? 'Choose a new person to receive this key. The previous holder will be replaced.'
                            : 'Enter the name of the person or tenant receiving this key. You can type a custom name or pick from your existing tenants.'}
                    </p>

                    {isReassign && currentAssignee && (
                        <div className="mb-4 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-600">
                            <span className="font-semibold">Currently held by:</span>{' '}
                            <span className="text-gray-800">{currentAssignee}</span>
                        </div>
                    )}

                    <div className="mb-3">
                        <div className="mt-2">
                            <SearchableDropdown
                                label="Issued To *"
                                value={selectedProperty}
                                options={options}
                                onChange={setSelectedProperty}
                                placeholder="Type name or select tenant"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {isSameAsCurrent && (
                        <div className="mb-4 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                            This person already holds this key. Pick someone different to re-assign.
                        </div>
                    )}
                    {!isSameAsCurrent && collidesWithExisting && (
                        <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                            Heads up — <span className="font-semibold">{trimmedSelection}</span> already holds another active key. They will hold both after this {isReassign ? 're-assignment' : 'assignment'}.
                        </div>
                    )}

                    {/* Footer / Action */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white border border-gray-200 text-gray-700 px-8 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (!trimmedSelection || isSameAsCurrent) {
                                    return;
                                }
                                onAssign(trimmedSelection);
                            }}
                            disabled={!trimmedSelection || isSameAsCurrent}
                            className="flex-1 bg-[#3A6D6C] text-white px-8 py-2.5 rounded-lg font-medium shadow-sm hover:bg-[#2c5251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isReassign ? 'Re-assign Key' : 'Assign Key'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignKeyModal;
