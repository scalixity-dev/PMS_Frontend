import React, { useCallback, useMemo, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { AUTO_FILL_FIELDS, type AutoFillField } from '../autoFillFields';
import { SIGNATURE_FIELDS, type SignatureKind, type SignatureParty } from '../signatureFields';

/** Matches the `sm` breakpoint the panel itself switches layout at. */
const isWideEnoughToAutoFocus = () =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches;

interface FloatingFieldInserterProps {
    onInsertAutoFill: (label: string) => void;
    onInsertTextbox: () => void;
    onInsertSignature: (kind: SignatureKind, party: SignatureParty) => void;
    /** Same handlers the panel below the editor uses, so both drag identically. */
    onChipDragStart: (e: React.DragEvent, label: string, isAutoFill: boolean) => void;
    onChipDragEnd: () => void;
}

/**
 * Insert a field without leaving your place in the document.
 *
 * The chip panel lives below the editor, so on a long lease the place a field
 * belongs and the chip that inserts it are never on screen together: pick a
 * spot, scroll down, click a chip, scroll back up to check where it landed —
 * once per field. This floats over the document instead, so the spot stays
 * visible the whole time.
 *
 * Deliberately does NOT close on an outside click. The whole flow is "click
 * where you want it, then pick a field", and clicking into the document is the
 * first half of that — closing there would break the one thing it exists for.
 * Escape and the close button are the ways out.
 */
const FloatingFieldInserter: React.FC<FloatingFieldInserterProps> = ({
    onInsertAutoFill,
    onInsertTextbox,
    onInsertSignature,
    onChipDragStart,
    onChipDragEnd,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    // Which signature field is waiting for the author to say whose it is.
    const [pendingSignature, setPendingSignature] = useState<SignatureKind | null>(null);

    React.useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            // A pending party choice is the inner layer, so it closes first.
            if (pendingSignature) setPendingSignature(null);
            else setIsOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, pendingSignature]);

    const matches = useCallback(
        (haystack: string) => haystack.toLowerCase().includes(query.trim().toLowerCase()),
        [query],
    );

    const signatureMatches = useMemo(
        () => SIGNATURE_FIELDS.filter((f) => matches(f.label) || matches(f.description)),
        [matches],
    );

    const textboxMatches = useMemo(() => matches('Textbox'), [matches]);

    const autoFillGroups = useMemo(() => {
        const hits = AUTO_FILL_FIELDS.filter((f) => matches(f.label) || matches(f.description));
        return hits.reduce<Record<string, AutoFillField[]>>((acc, field) => {
            (acc[field.group] ??= []).push(field);
            return acc;
        }, {});
    }, [matches]);

    const hasResults =
        signatureMatches.length > 0 || textboxMatches || Object.keys(autoFillGroups).length > 0;

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                // right-24 clears the AI chat bubble, which sits at right-6.
                className="fixed bottom-6 right-24 z-40 flex items-center gap-2 rounded-full bg-[#3D7475] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all hover:bg-[#2c5251] print:hidden"
            >
                <Plus className="h-4 w-4" />
                Insert field
            </button>
        );
    }

    return (
        // Phone: full width between the screen edges, and lifted clear of the
        // chat bubble that sits at bottom-6 right-6 on every breakpoint. A fixed
        // 340px panel anchored at right-24 ran off the left edge on a 375px
        // screen. From sm up there is room for the narrow panel beside it.
        <div className="fixed bottom-24 left-4 right-4 z-40 flex max-h-[60vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:bottom-6 sm:left-auto sm:right-24 sm:max-h-[70vh] sm:w-[340px] print:hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                    <h3 className="text-sm font-bold text-gray-800">Insert field</h3>
                    <p className="text-[11px] leading-tight text-gray-500">
                        Click where you want it, then pick one.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close insert panel"
                    className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="border-b border-gray-100 px-4 py-2.5">
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                    <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <input
                        // Not on a phone: focusing this opens the keyboard, which
                        // covers the very list the panel exists to show. Tapping
                        // the box still works for anyone who wants to search.
                        autoFocus={isWideEnoughToAutoFocus()}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search fields..."
                        className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
                {!hasResults && (
                    <p className="py-6 text-center text-xs text-gray-400">No field matches "{query}".</p>
                )}

                {(signatureMatches.length > 0 || textboxMatches) && (
                    <div className="mb-4">
                        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">Fields</h4>
                        <div className="flex flex-col gap-2">
                            {signatureMatches.map((field) => (
                                <div key={field.kind}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPendingSignature(pendingSignature === field.kind ? null : field.kind)
                                        }
                                        className="w-full rounded-xl bg-[#88D94C] px-3 py-2 text-left text-white transition-all hover:opacity-95"
                                    >
                                        <span className="block text-sm font-bold">{field.label}</span>
                                        <span className="block text-[10px] leading-tight opacity-90">{field.description}</span>
                                    </button>

                                    {pendingSignature === field.kind && (
                                        <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
                                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                Whose {field.label.toLowerCase()}?
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onInsertSignature(field.kind, 'landlord');
                                                        setPendingSignature(null);
                                                    }}
                                                    className="flex-1 rounded-lg bg-[#3D7475] px-2 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#2c5251]"
                                                >
                                                    Landlord
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onInsertSignature(field.kind, 'tenant');
                                                        setPendingSignature(null);
                                                    }}
                                                    className="flex-1 rounded-lg bg-[#88D94C] px-2 py-1.5 text-xs font-bold text-white transition-colors hover:opacity-90"
                                                >
                                                    Tenant
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {textboxMatches && (
                                <button
                                    type="button"
                                    draggable
                                    onDragStart={(e) => onChipDragStart(e, 'Textbox', false)}
                                    onDragEnd={onChipDragEnd}
                                    onClick={onInsertTextbox}
                                    className="w-full cursor-grab rounded-xl bg-[#88D94C] px-3 py-2 text-left text-white transition-all hover:opacity-95 active:cursor-grabbing"
                                >
                                    <span className="block text-sm font-bold">Textbox</span>
                                    <span className="block text-[10px] leading-tight opacity-90">
                                        Add and require additional information
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {Object.entries(autoFillGroups).map(([group, fields]) => (
                    <div key={group} className="mb-4 last:mb-0">
                        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">{group}</h4>
                        <div className="flex flex-wrap gap-2">
                            {fields.map((field) => (
                                <button
                                    key={field.label}
                                    type="button"
                                    draggable
                                    onDragStart={(e) => onChipDragStart(e, field.label, true)}
                                    onDragEnd={onChipDragEnd}
                                    onClick={() => onInsertAutoFill(field.label)}
                                    title={`${field.description}${field.resolvedFromLease ? ' Filled from the lease.' : ' You will be asked for this value.'}`}
                                    className="inline-flex cursor-grab items-center gap-1.5 whitespace-nowrap rounded-2xl bg-[#88D94C] px-3 py-1.5 text-[11px] font-bold text-white transition-all hover:opacity-95 active:cursor-grabbing"
                                >
                                    {field.resolvedFromLease && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/90" aria-hidden="true" />
                                    )}
                                    {field.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <p className="border-t border-gray-100 px-4 py-2 text-[10px] text-gray-400">
                Click to drop at the cursor, or drag one in. A dot means the value comes from the lease.
            </p>
        </div>
    );
};

export default FloatingFieldInserter;
