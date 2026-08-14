import { useState, useCallback, memo, useMemo, useEffect } from "react";
import { TeamManagementSettingsLayout } from "../../../../components/common/TeamManagementSettingsLayout";
import { X, Mail, Trash2, RefreshCw, CheckCircle, Clock, AlertCircle, Loader2, ChevronDown, ChevronUp, ShieldCheck, UserCheck } from "lucide-react";
import {
    useGetTeamMembers,
    useInviteTeamMember,
    useDeleteTeamMember,
    useResendInvitation,
    useRevokeTeamMember,
    useUpdateTeamMember,
    useEnableTeamMember,
} from "../../../../hooks/useTeamQueries";
import { useToast } from "../../../../components/common/Toast";
import { formatPhoneNumber } from '@/utils/phone.utils';
import { formatRole } from '@/utils/roleIcon';
import { usePlanFeatures } from "../../../../hooks/usePlanFeatures";
import { toFriendlyErrorMessage } from "@/utils/errorMessage.utils";


const INPUT_CLASS = "w-full px-4 py-3 border-b border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors";

interface PermissionMap {
    [module: string]: { view: boolean; manage: boolean };
}

const PERMISSION_MODULES: { key: string; label: string }[] = [
    { key: 'settings', label: 'Settings' },
    { key: 'rental-applications', label: 'Rental Applications' },
    { key: 'maintenance', label: 'Maintenance Requests' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'property-units', label: 'Property & Units' },
    { key: 'contacts', label: 'Contacts' },
    { key: 'accounting', label: 'Accounting' },
    { key: 'reports', label: 'Reports' },
    { key: 'listing', label: 'Listing' },
    { key: 'leads', label: 'Leads' },
    { key: 'document-templates', label: 'Document Templates' },
];

const DEFAULT_PERMISSIONS: PermissionMap = PERMISSION_MODULES.reduce((acc, m) => {
    acc[m.key] = { view: false, manage: false };
    return acc;
}, {} as PermissionMap);

function permissionsToStrings(map: PermissionMap): string[] {
    const result: string[] = [];
    for (const [key, val] of Object.entries(map)) {
        if (val.view) result.push(`${key}:view`);
        if (val.manage) result.push(`${key}:manage`);
    }
    return result;
}

interface InviteFormData {
    name: string;
    phoneNumber: string;
    email: string;
    permissions: PermissionMap;
}

const PermissionsSection = memo(({
    permissions,
    onChange,
    disabled,
}: {
    permissions: PermissionMap;
    onChange: (updated: PermissionMap) => void;
    disabled: boolean;
}) => {
    const [expanded, setExpanded] = useState(false);

    const toggleView = (key: string) => {
        const current = permissions[key];
        onChange({
            ...permissions,
            [key]: {
                view: !current.view,
                manage: !current.view ? current.manage : false,
            },
        });
    };

    const toggleManage = (key: string) => {
        const current = permissions[key];
        const newManage = !current.manage;
        onChange({
            ...permissions,
            [key]: {
                view: newManage ? true : current.view,
                manage: newManage,
            },
        });
    };

    const activeCount = Object.values(permissions).filter(p => p.view || p.manage).length;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                disabled={disabled}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700"
            >
                <span>Permissions {activeCount > 0 && <span className="text-[#3D7475] font-normal">({activeCount} modules enabled)</span>}</span>
                {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {expanded && (
                <div className="p-3">
                    <div className="grid grid-cols-[1fr_60px_70px] gap-x-2 mb-2 px-2">
                        <span className="text-xs text-gray-400">Module</span>
                        <span className="text-xs text-gray-400 text-center">View</span>
                        <span className="text-xs text-gray-400 text-center">Manage</span>
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                        {PERMISSION_MODULES.map((m) => (
                            <div key={m.key} className="grid grid-cols-[1fr_60px_70px] items-center gap-x-2 px-2 py-1.5 rounded hover:bg-gray-50">
                                <span className="text-xs text-gray-700 truncate">{m.label}</span>
                                <div className="flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions[m.key]?.view ?? false}
                                        onChange={() => toggleView(m.key)}
                                        disabled={disabled}
                                        className="w-4 h-4 accent-[#3D7475] cursor-pointer"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions[m.key]?.manage ?? false}
                                        onChange={() => toggleManage(m.key)}
                                        disabled={disabled}
                                        className="w-4 h-4 accent-[#3D7475] cursor-pointer"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 px-2">Enabling "Manage" automatically enables "View".</p>
                </div>
            )}
        </div>
    );
});

PermissionsSection.displayName = 'PermissionsSection';

const InviteModal = memo(({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: InviteFormData) => Promise<void> | void;
    isSubmitting: boolean;
}) => {
    const [data, setData] = useState<InviteFormData>({
        name: '',
        phoneNumber: '',
        email: '',
        permissions: { ...DEFAULT_PERMISSIONS },
    });
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setNameError(null);
        setEmailError(null);
        setSubmitError(null);

        if (!data.name.trim()) {
            setNameError('Name is required');
            return;
        }
        if (!data.email.trim()) {
            setEmailError('Email is required');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        try {
            await onSubmit({ ...data, email: data.email.trim().toLowerCase(), name: data.name.trim() });
        } catch (err) {
            setSubmitError(toFriendlyErrorMessage(err, 'We could not send this invitation. Please try again.'));
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                    <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-6 space-y-4 overflow-y-auto flex-1">
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name *"
                            value={data.name}
                            onChange={(e) => {
                                setData({ ...data, name: e.target.value });
                                if (nameError) setNameError(null);
                            }}
                            className={`${INPUT_CLASS} ${nameError ? 'border-red-500' : ''}`}
                            disabled={isSubmitting}
                        />
                        {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address *"
                            value={data.email}
                            onChange={(e) => {
                                setData({ ...data, email: e.target.value });
                                if (emailError) setEmailError(null);
                            }}
                            className={`${INPUT_CLASS} ${emailError ? 'border-red-500' : ''}`}
                            disabled={isSubmitting}
                        />
                        {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
                    </div>
                    <input
                        type="tel"
                        placeholder="Phone Number (optional)"
                        value={data.phoneNumber}
                        onChange={(e) => setData({ ...data, phoneNumber: formatPhoneNumber(e.target.value) })}
                        className={INPUT_CLASS}
                        disabled={isSubmitting}
                    />

                    <PermissionsSection
                        permissions={data.permissions}
                        onChange={(updated) => setData({ ...data, permissions: updated })}
                        disabled={isSubmitting}
                    />

                    {submitError && (
                        <p className="text-xs text-red-600">{submitError}</p>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 rounded-lg text-white font-medium text-sm bg-[#3D7475] hover:bg-[#2c5556] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? 'Sending invite...' : 'Send Invitation'}
                    </button>
                </div>
            </div>
        </div>
    );
});

InviteModal.displayName = 'InviteModal';

function stringsToPermissions(perms: string[]): PermissionMap {
    const map: PermissionMap = { ...DEFAULT_PERMISSIONS };
    for (const p of perms) {
        const [key, level] = p.split(':');
        if (map[key] && (level === 'view' || level === 'manage')) {
            map[key] = { ...map[key], [level]: true };
        }
    }
    return map;
}

const EditPermissionsModal = memo(({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    currentPermissions,
    memberName,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (permissions: string[]) => Promise<void> | void;
    isSubmitting: boolean;
    currentPermissions: string[];
    memberName: string;
}) => {
    const [perms, setPerms] = useState<PermissionMap>(() => stringsToPermissions(currentPermissions));
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setPerms(stringsToPermissions(currentPermissions));
            setSubmitError(null);
        }
    }, [isOpen, currentPermissions]);

    const handleSubmit = async () => {
        setSubmitError(null);
        try {
            await onSubmit(permissionsToStrings(perms));
        } catch (err) {
            setSubmitError(toFriendlyErrorMessage(err, 'We could not save these permissions. Please try again.'));
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Edit Permissions</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{memberName}</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto flex-1">
                    <div className="grid grid-cols-[1fr_60px_70px] gap-x-2 mb-2 px-2">
                        <span className="text-xs text-gray-400">Module</span>
                        <span className="text-xs text-gray-400 text-center">View</span>
                        <span className="text-xs text-gray-400 text-center">Manage</span>
                    </div>
                    <div className="space-y-1">
                        {PERMISSION_MODULES.map((m) => {
                            const val = perms[m.key] ?? { view: false, manage: false };
                            const toggleView = () => {
                                const newView = !val.view;
                                setPerms(prev => ({
                                    ...prev,
                                    [m.key]: { view: newView, manage: newView ? val.manage : false },
                                }));
                            };
                            const toggleManage = () => {
                                const newManage = !val.manage;
                                setPerms(prev => ({
                                    ...prev,
                                    [m.key]: { view: newManage ? true : val.view, manage: newManage },
                                }));
                            };
                            return (
                                <div key={m.key} className="grid grid-cols-[1fr_60px_70px] items-center gap-x-2 px-2 py-1.5 rounded hover:bg-gray-50">
                                    <span className="text-xs text-gray-700 truncate">{m.label}</span>
                                    <div className="flex justify-center">
                                        <input type="checkbox" checked={val.view} onChange={toggleView} disabled={isSubmitting} className="w-4 h-4 accent-[#3D7475] cursor-pointer" />
                                    </div>
                                    <div className="flex justify-center">
                                        <input type="checkbox" checked={val.manage} onChange={toggleManage} disabled={isSubmitting} className="w-4 h-4 accent-[#3D7475] cursor-pointer" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-xs text-gray-400 mt-3 px-2">Enabling "Manage" automatically enables "View".</p>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                    {submitError && <p className="text-xs text-red-600 mr-auto">{submitError}</p>}
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 rounded-lg text-white font-medium text-sm bg-[#3D7475] hover:bg-[#2c5556] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? 'Saving...' : 'Save Permissions'}
                    </button>
                </div>
            </div>
        </div>
    );
});

EditPermissionsModal.displayName = 'EditPermissionsModal';

const ConfirmModal = memo(({
    isOpen,
    onClose,
    onConfirm,
    isSubmitting,
    title,
    message,
    confirmLabel,
    danger,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    danger?: boolean;
}) => {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="px-6 py-5">
                    <p className="text-sm text-gray-600">{message}</p>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className={`px-5 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${
                            danger ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'
                        }`}
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
});

ConfirmModal.displayName = 'ConfirmModal';

const DeleteConfirmModal = memo(({
    isOpen,
    onClose,
    onConfirm,
    isSubmitting,
    memberName,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    memberName: string;
}) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (isOpen) setChecked(false);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </div>
                        <h2 className="text-base font-semibold text-gray-900">Delete Team Member</h2>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <p className="text-sm text-gray-700">
                        You are about to permanently delete <span className="font-semibold text-gray-900">{memberName}</span> from your team.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-700 leading-relaxed">
                        <strong>This action is irreversible.</strong> Their account, permissions, and all property assignments will be permanently removed. They will not be able to log in.
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-red-600 cursor-pointer shrink-0"
                        />
                        <span className="text-xs text-gray-600">I understand this cannot be undone</span>
                    </label>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={!checked || isSubmitting}
                        className="px-5 py-2 rounded-lg text-white text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
                    </button>
                </div>
            </div>
        </div>
    );
});

DeleteConfirmModal.displayName = 'DeleteConfirmModal';

const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
        INVITED: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock, label: 'Invited' },
        ACTIVE: { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle, label: 'Active' },
        SUSPENDED: { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: AlertCircle, label: 'Suspended' },
        REVOKED: { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: X, label: 'Revoked' },
    };
    const c = config[status] || config.INVITED;
    const Icon = c.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${c.color}`}>
            <Icon className="w-3 h-3" />
            {c.label}
        </span>
    );
};

export default function RolesPermissions() {
    const { data: members = [], isLoading } = useGetTeamMembers();
    const { checkLimit } = usePlanFeatures();
    const inviteMutation = useInviteTeamMember();
    const deleteMutation = useDeleteTeamMember();
    const resendMutation = useResendInvitation();
    const revokeMutation = useRevokeTeamMember();
    const enableMutation = useEnableTeamMember();
    const updateMutation = useUpdateTeamMember();
    const toast = useToast();

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<{ id: string; name: string; permissions: string[]; propertyIds: string[] } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
    const [revokeTarget, setRevokeTarget] = useState<{ id: string; name: string } | null>(null);
    const [enableTarget, setEnableTarget] = useState<{ id: string; name: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return members.filter((m) =>
            [m.name, m.email, m.phoneNumber || '', m.role]
                .join(' ')
                .toLowerCase()
                .includes(q),
        );
    }, [members, searchQuery]);

    // Revoked seats free up the slot, so they don't count against the plan limit
    const activeMemberCount = useMemo(
        () => members.filter((m) => m.status !== 'REVOKED').length,
        [members],
    );
    const teamLimitInfo = checkLimit('teamMembers', activeMemberCount);

    const handleInvite = useCallback(async (data: InviteFormData) => {
        // Errors are left to propagate so InviteModal can show them inline
        // next to the fields the user is looking at, instead of a toast.
        await inviteMutation.mutateAsync({
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber || undefined,
            permissions: permissionsToStrings(data.permissions),
        });
        toast.success(`Invitation sent to ${data.email}`);
        setIsInviteModalOpen(false);
    }, [inviteMutation, toast]);

    const handleResend = useCallback(async (id: string, email: string) => {
        try {
            await resendMutation.mutateAsync(id);
            toast.success(`Invitation resent to ${email}`);
        } catch (err) {
            toast.error(toFriendlyErrorMessage(err, 'We could not resend this invitation. Please try again.'));
        }
    }, [resendMutation, toast]);

    const handleRevoke = useCallback((id: string, name: string) => {
        setRevokeTarget({ id, name });
    }, []);

    const confirmRevoke = useCallback(async () => {
        if (!revokeTarget) return;
        try {
            await revokeMutation.mutateAsync(revokeTarget.id);
            toast.success('Access revoked');
            setRevokeTarget(null);
        } catch (err) {
            toast.error(toFriendlyErrorMessage(err, 'We could not revoke access. Please try again.'));
        }
    }, [revokeTarget, revokeMutation, toast]);

    const confirmEnable = useCallback(async () => {
        if (!enableTarget) return;
        try {
            await enableMutation.mutateAsync(enableTarget.id);
            toast.success(`${enableTarget.name} re-enabled successfully`);
            setEnableTarget(null);
        } catch (err) {
            toast.error(toFriendlyErrorMessage(err, 'We could not re-enable this team member. Please try again.'));
        }
    }, [enableTarget, enableMutation, toast]);

    const handleDelete = useCallback((id: string, name: string) => {
        setDeleteTarget({ id, name });
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!deleteTarget) return;
        try {
            await deleteMutation.mutateAsync(deleteTarget.id);
            toast.success('Team member deleted');
            setDeleteTarget(null);
        } catch (err) {
            toast.error(toFriendlyErrorMessage(err, 'We could not delete this team member. Please try again.'));
        }
    }, [deleteTarget, deleteMutation, toast]);

    const handleEditPermissions = useCallback(async (permissions: string[]) => {
        if (!editingMember) return;
        // Errors are left to propagate so EditPermissionsModal can show them
        // inline instead of a toast.
        await updateMutation.mutateAsync({ id: editingMember.id, dto: { permissions } });
        toast.success('Permissions updated');
        setEditingMember(null);
    }, [editingMember, updateMutation, toast]);

    const headerActions = (
        <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            disabled={!teamLimitInfo.withinLimit}
            title={!teamLimitInfo.withinLimit ? 'You have reached your plan\'s team member limit. Upgrade to invite more.' : undefined}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-white font-medium text-sm bg-[#7CD947] hover:bg-[#6bc93a] border border-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#7CD947]"
        >
            Invite Team Member
        </button>
    );

    return (
        <>
            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSubmit={handleInvite}
                isSubmitting={inviteMutation.isPending}
            />
            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                isSubmitting={deleteMutation.isPending}
                memberName={deleteTarget?.name ?? ''}
            />
            <ConfirmModal
                isOpen={!!revokeTarget}
                onClose={() => setRevokeTarget(null)}
                onConfirm={confirmRevoke}
                isSubmitting={revokeMutation.isPending}
                title="Revoke Access"
                message={`Revoke access for ${revokeTarget?.name}? They will no longer be able to access your team.`}
                confirmLabel="Revoke"
            />
            <ConfirmModal
                isOpen={!!enableTarget}
                onClose={() => setEnableTarget(null)}
                onConfirm={confirmEnable}
                isSubmitting={enableMutation.isPending}
                title="Re-enable Access"
                message={`Re-enable access for ${enableTarget?.name}? They will be able to log in and access your team again.`}
                confirmLabel="Enable"
            />
            <EditPermissionsModal
                isOpen={!!editingMember}
                onClose={() => setEditingMember(null)}
                onSubmit={handleEditPermissions}
                isSubmitting={updateMutation.isPending}
                currentPermissions={editingMember?.permissions ?? []}
                memberName={editingMember?.name ?? ''}
            />

            <TeamManagementSettingsLayout
                activeTab="roles-permissions"
                headerActions={headerActions}
                onSearchChange={setSearchQuery}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3D7475]" />
                        <span className="ml-3 text-gray-600">Loading team members...</span>
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No team members yet</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {searchQuery ? 'No members match your search.' : 'Invite your first team member to get started.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        {filteredMembers.map((member) => (
                            <div key={member.id} className="relative h-full">
                                <div className="absolute -top-3 left-6 z-10 px-4 py-1.5 bg-[#E8F0EE] border border-[#3D7475] rounded-xl">
                                    <h3 className="text-xs font-bold text-[#3D7475] uppercase tracking-wide">{formatRole(member.role)}</h3>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 pt-10 flex flex-col h-full">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3D7475] to-[#273F3B] flex items-center justify-center shrink-0 text-white font-bold text-xl">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-semibold text-gray-900 truncate">{member.name}</h4>
                                            <p className="text-xs text-gray-500 truncate mb-1">{member.email}</p>
                                            {member.phoneNumber && (
                                                <p className="text-xs text-gray-400 truncate">{formatPhoneNumber(member.phoneNumber)}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-3">
                                        <StatusBadge status={member.status} />
                                        {member.propertyIds.length > 0 && (
                                            <span className="text-xs text-gray-500">
                                                {member.propertyIds.length} {member.propertyIds.length === 1 ? 'property' : 'properties'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-auto">
                                        {/* Always reserve the Edit Permissions row — invisible when not applicable */}
                                        <button
                                            onClick={() => setEditingMember({ id: member.id, name: member.name, permissions: member.permissions, propertyIds: member.propertyIds ?? [] })}
                                            disabled={member.status !== 'ACTIVE'}
                                            className={`w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                                member.status === 'ACTIVE'
                                                    ? 'text-[#3D7475] bg-[#E8F0EE] hover:bg-[#d7e5e1]'
                                                    : 'invisible'
                                            }`}
                                        >
                                            <ShieldCheck className="w-3 h-3" />
                                            Edit Permissions
                                        </button>
                                        <div className="flex gap-2">
                                            {member.status === 'INVITED' && (
                                                <button
                                                    onClick={() => handleResend(member.id, member.email)}
                                                    disabled={resendMutation.isPending}
                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-[#3D7475] bg-[#E8F0EE] rounded-md hover:bg-[#d7e5e1] transition-colors disabled:opacity-50"
                                                >
                                                    <RefreshCw className="w-3 h-3" />
                                                    Resend
                                                </button>
                                            )}
                                            {member.status === 'ACTIVE' && (
                                                <button
                                                    onClick={() => handleRevoke(member.id, member.name)}
                                                    disabled={revokeMutation.isPending}
                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors disabled:opacity-50"
                                                >
                                                    <AlertCircle className="w-3 h-3" />
                                                    Revoke
                                                </button>
                                            )}
                                            {member.status === 'REVOKED' && (
                                                <button
                                                    onClick={() => setEnableTarget({ id: member.id, name: member.name })}
                                                    disabled={enableMutation.isPending}
                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50"
                                                >
                                                    <UserCheck className="w-3 h-3" />
                                                    Enable
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(member.id, member.name)}
                                                disabled={deleteMutation.isPending}
                                                className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Team limit */}
                {!isLoading && (
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Team limit: <span className="font-semibold text-gray-700">
                            {activeMemberCount} of {teamLimitInfo.isUnlimited ? 'Unlimited' : teamLimitInfo.limit}
                        </span>
                    </div>
                )}
            </TeamManagementSettingsLayout>
        </>
    );
}
