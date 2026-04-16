import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X } from 'lucide-react';

interface SelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Called whenever the selection changes — fires per-toggle so deletes/additions persist instantly. */
    onSave: (selectedItems: string[]) => void;
    title: string;
    subtitle: string;
    options: string[];
    initialSelected: string[];
}

const SelectionModal: React.FC<SelectionModalProps> = ({
    isOpen,
    onClose,
    onSave,
    title,
    subtitle,
    options,
    initialSelected,
}) => {
    const [selected, setSelected] = useState<string[]>(initialSelected);
    const [customDraft, setCustomDraft] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSelected(initialSelected);
            setCustomDraft('');
        }
    }, [initialSelected, isOpen]);

    // Show every preset option AND every custom item the user has previously added.
    // Without this merge, custom values that already exist in the saved array would be
    // hidden from the modal and the user could not remove them.
    const mergedOptions = useMemo(() => {
        const seen = new Set<string>();
        const out: string[] = [];
        for (const o of options) {
            const key = o.trim();
            if (!key || seen.has(key.toLowerCase())) continue;
            seen.add(key.toLowerCase());
            out.push(key);
        }
        for (const o of selected) {
            const key = (o || '').trim();
            if (!key || seen.has(key.toLowerCase())) continue;
            seen.add(key.toLowerCase());
            out.push(key);
        }
        return out;
    }, [options, selected]);

    const isPreset = (item: string) => options.some((o) => o.toLowerCase() === item.toLowerCase());

    const commit = (next: string[]) => {
        setSelected(next);
        onSave(next);
    };

    const toggleSelection = (item: string) => {
        const isOn = selected.some((s) => s.toLowerCase() === item.toLowerCase());
        const next = isOn
            ? selected.filter((s) => s.toLowerCase() !== item.toLowerCase())
            : [...selected, item];
        commit(next);
    };

    /** Permanently remove a custom item (not in preset list). Selected or not, it's gone. */
    const removeCustom = (item: string) => {
        if (isPreset(item)) {
            // For preset items, "remove" simply means deselect.
            const next = selected.filter((s) => s.toLowerCase() !== item.toLowerCase());
            commit(next);
            return;
        }
        const next = selected.filter((s) => s.toLowerCase() !== item.toLowerCase());
        commit(next);
    };

    const addCustom = () => {
        const v = customDraft.trim();
        if (!v) return;
        const exists = selected.some((s) => s.toLowerCase() === v.toLowerCase());
        if (exists) {
            setCustomDraft('');
            return;
        }
        const next = [...selected, v];
        commit(next);
        setCustomDraft('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#F0F2F5] rounded-[2rem] p-8 w-full max-w-2xl shadow-xl relative">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">{title}</h2>
                    <p className="text-gray-500 text-sm">{subtitle}</p>
                </div>

                {/* Options */}
                <div className="bg-white rounded-[2rem] p-6 min-h-[200px] mb-6 shadow-sm">
                    <div className="flex flex-wrap gap-3">
                        {mergedOptions.map((option) => {
                            const isSelected = selected.some(
                                (s) => s.toLowerCase() === option.toLowerCase(),
                            );
                            const isCustom = !isPreset(option);
                            return (
                                <div key={option} className="relative inline-flex">
                                    <button
                                        onClick={() => toggleSelection(option)}
                                        className={`
                                            px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all border
                                            ${isSelected
                                                ? 'bg-[#82D64D] text-white border-[#82D64D]'
                                                : 'bg-white text-[#1A1A1A] border-[#82D64D] hover:bg-gray-50'
                                            }
                                            ${isCustom ? 'pr-7' : ''}
                                        `}
                                    >
                                        {option}
                                        {!isSelected && !isCustom && (
                                            <Plus className="w-4 h-4 text-[#1A1A1A]" />
                                        )}
                                    </button>
                                    {isCustom && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeCustom(option);
                                            }}
                                            aria-label={`Remove ${option}`}
                                            className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow-sm border transition-colors
                                                ${isSelected
                                                    ? 'bg-white text-red-500 border-red-200 hover:bg-red-50'
                                                    : 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                                                }`}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Add custom */}
                    <div className="mt-6 flex items-center gap-2">
                        <input
                            type="text"
                            value={customDraft}
                            onChange={(e) => setCustomDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addCustom();
                                }
                            }}
                            placeholder="Add a custom option…"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#82D64D]/30 focus:border-[#82D64D] bg-white"
                        />
                        <button
                            onClick={addCustom}
                            disabled={!customDraft.trim()}
                            className="px-4 py-2 rounded-full bg-[#3D7475] text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 hover:bg-[#366A6B] transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-lg text-sm font-bold bg-[#3D7475] text-white hover:bg-[#366A6B] transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectionModal;
