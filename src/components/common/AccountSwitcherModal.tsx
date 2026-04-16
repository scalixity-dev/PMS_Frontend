import React from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, LogIn } from 'lucide-react';
import { rememberedAccountsStore, type RememberedAccount } from '../../stores/rememberedAccountsStore';

interface AccountSwitcherModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Callback to execute after the user chooses to switch or add an account. */
    onSwitch: (email: string) => void;
    onAddNew: () => void;
    currentUserId?: string;
}

/**
 * Account chooser shown when user clicks "Add Another Account" in the profile
 * dropdown. Lists remembered accounts from localStorage; clicking one triggers
 * the sign-out + sign-in-with-prefill flow managed by the parent.
 */
const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
    isOpen,
    onClose,
    onSwitch,
    onAddNew,
    currentUserId,
}) => {
    const [accounts, setAccounts] = React.useState<RememberedAccount[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            setAccounts(rememberedAccountsStore.list());
        }
    }, [isOpen]);

    const handleRemove = (e: React.MouseEvent, userId: string) => {
        e.stopPropagation();
        const next = rememberedAccountsStore.remove(userId);
        setAccounts(next);
    };

    const initials = (name: string, email: string) =>
        (name || email)
            .split(/\s|@/)
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase() || '')
            .join('') || 'U';

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-[#3A6D6C] px-5 py-4 flex items-center justify-between">
                    <h2 className="text-white text-base font-semibold">Choose an account</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {accounts.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-6">
                            No other accounts saved yet. Add one below to switch quickly next time.
                        </p>
                    ) : (
                        accounts.map((acc) => {
                            const isCurrent = currentUserId && acc.userId === currentUserId;
                            return (
                                <button
                                    key={acc.userId}
                                    onClick={() => onSwitch(acc.email)}
                                    disabled={!!isCurrent}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left group ${
                                        isCurrent
                                            ? 'bg-green-50 border-green-200 cursor-default'
                                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-[#3A6D6C]'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7CD947] to-[#5BB030] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {acc.avatarUrl ? (
                                            <img
                                                src={acc.avatarUrl}
                                                alt=""
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            initials(acc.fullName, acc.email)
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {acc.fullName || acc.email}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                                        {acc.role && (
                                            <span className="inline-block text-[10px] font-medium text-[#3A6D6C] mt-0.5">
                                                {acc.role}
                                            </span>
                                        )}
                                    </div>
                                    {isCurrent ? (
                                        <span className="text-[11px] font-semibold text-green-700 px-2 py-1 bg-green-100 rounded-full">
                                            Current
                                        </span>
                                    ) : (
                                        <>
                                            <LogIn
                                                size={16}
                                                className="text-gray-400 group-hover:text-[#3A6D6C] transition-colors"
                                            />
                                            <button
                                                onClick={(e) => handleRemove(e, acc.userId)}
                                                className="p-1 text-gray-300 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                aria-label={`Remove ${acc.email}`}
                                                title="Remove from saved accounts"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                </button>
                            );
                        })
                    )}

                    <button
                        onClick={onAddNew}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 hover:border-[#3A6D6C] hover:bg-gray-50 transition-colors text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                            <Plus size={18} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Sign in with a different account</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default AccountSwitcherModal;
