import { useState, useCallback, memo, useMemo, useEffect } from "react";
import { TeamManagementSettingsLayout } from "../../../../components/common/TeamManagementSettingsLayout";
import { X, Mail, Trash2, RefreshCw, CheckCircle, Clock, AlertCircle, Loader2, ChevronDown, ChevronUp, ShieldCheck, Building2 } from "lucide-react";
import {
    useGetTeamMembers,
    useInviteTeamMember,
    useDeleteTeamMember,
    useResendInvitation,
    useRevokeTeamMember,
    useUpdateTeamMember,
} from "../../../../hooks/useTeamQueries";
import { useGetAllProperties } from "../../../../hooks/usePropertyQueries";
import { useToast } from "../../../../components/common/Toast";
import { formatPhoneNumber } from '@/utils/phone.utils';


const INPUT_CLASS = "w-full px-4 py-3 border-b border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors";

const TEAM_LIMIT = 10;

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
    onSubmit: (data: InviteFormData) => void;
    isSubmitting: boolean;
}) => {
    const [data, setData] = useState<InviteFormData>({
        name: '',
        phoneNumber: '',
        email: '',
        permissions: { ...DEFAULT_PERMISSIONS },
    });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        setError(null);
        if (!data.name.trim()) return setError('Name is required');
        if (!data.email.trim()) return setError('Email is required');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return setError('Invalid email format');
        onSubmit({ ...data, email: data.email.trim().toLowerCase(), name: data.name.trim() });
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
                    <input
                        type="text"
                        placeholder="Full Name *"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        className={INPUT_CLASS}
                        disabled={isSubmitting}
                    />
                    <input
                        type="email"
                        placeholder="Email Address *"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className={INPUT_CLASS}
                        disabled={isSubmitting}
                    />
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

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-2 text-xs text-red-700">
                            {error}
                        </div>
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
    currentPropertyIds,
    memberName,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (permissions: string[], propertyIds: string[]) => void;
    isSubmitting: boolean;
    currentPermissions: string[];
    currentPropertyIds: string[];
    memberName: string;
}) => {
    const [perms, setPerms] = useState<PermissionMap>(() => stringsToPermissions(currentPermissions));
    const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>(currentPropertyIds);
    const { data: allProperties = [] } = useGetAllProperties();

    // reset when opened or member changes
    useEffect(() => {
        if (isOpen) {
            setPerms(stringsToPermissions(currentPermissions));
            setSelectedPropertyIds(currentPropertyIds);
        }
    }, [isOpen, currentPermissions, currentPropertyIds]);

    const toggleProperty = (id: string) => {
        setSelectedPropertyIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
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

                    {/* Property Assignment */}
                    <div className="mt-5 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 px-2 mb-3">
                            <Building2 className="w-4 h-4 text-[#3D7475]" />
                            <span className="text-xs font-semibold text-gray-700">Property Access</span>
                            <span className="text-xs text-gray-400 ml-auto">
                                {selectedPropertyIds.length === 0 ? 'No access' : `${selectedPropertyIds.length} selected`}
                            </span>
                        </div>
                        {allProperties.length === 0 ? (
                            <p className="text-xs text-gray-400 px-2">No properties available.</p>
                        ) : (
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                                {allProperties.map((p: any) => (
                                    <label key={p.id} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedPropertyIds.includes(p.id)}
                                            onChange={() => toggleProperty(p.id)}
                                            disabled={isSubmitting}
                                            className="w-4 h-4 accent-[#3D7475] cursor-pointer"
                                        />
                                        <span className="text-xs text-gray-700 truncate">{p.propertyName}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2 px-2">Select properties to grant access. No selection means no property access.</p>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 shrink-0">
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onSubmit(permissionsToStrings(perms), selectedPropertyIds)}
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
    const inviteMutation = useInviteTeamMember();
    const deleteMutation = useDeleteTeamMember();
    const resendMutation = useResendInvitation();
    const revokeMutation = useRevokeTeamMember();
    const updateMutation = useUpdateTeamMember();
    const toast = useToast();

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<{ id: string; name: string; permissions: string[]; propertyIds: string[] } | null>(null);
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

    const handleInvite = useCallback(async (data: InviteFormData) => {
        try {
            await inviteMutation.mutateAsync({
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber || undefined,
                permissions: permissionsToStrings(data.permissions),
            });
            toast.success(`Invitation sent to ${data.email}`);
            setIsInviteModalOpen(false);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to invite team member');
        }
    }, [inviteMutation, toast]);

    const handleResend = useCallback(async (id: string, email: string) => {
        try {
            await resendMutation.mutateAsync(id);
            toast.success(`Invitation resent to ${email}`);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to resend invitation');
        }
    }, [resendMutation, toast]);

    const handleRevoke = useCallback(async (id: string, name: string) => {
        if (!window.confirm(`Revoke access for ${name}? They will no longer be able to access your team.`)) return;
        try {
            await revokeMutation.mutateAsync(id);
            toast.success('Access revoked');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to revoke access');
        }
    }, [revokeMutation, toast]);

    const handleDelete = useCallback(async (id: string, name: string) => {
        if (!window.confirm(`Delete ${name} from your team? This cannot be undone.`)) return;
        try {
            await deleteMutation.mutateAsync(id);
            toast.success('Team member deleted');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to delete team member');
        }
    }, [deleteMutation, toast]);

    const handleEditPermissions = useCallback(async (permissions: string[], propertyIds: string[]) => {
        if (!editingMember) return;
        try {
            await updateMutation.mutateAsync({ id: editingMember.id, dto: { permissions, propertyIds } });
            toast.success('Permissions updated');
            setEditingMember(null);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update permissions');
        }
    }, [editingMember, updateMutation, toast]);

    const headerActions = (
        <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-white font-medium text-sm bg-[#7CD947] hover:bg-[#6bc93a] border border-white shadow-md hover:shadow-lg transition-shadow"
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
            <EditPermissionsModal
                isOpen={!!editingMember}
                onClose={() => setEditingMember(null)}
                onSubmit={handleEditPermissions}
                isSubmitting={updateMutation.isPending}
                currentPermissions={editingMember?.permissions ?? []}
                currentPropertyIds={editingMember?.propertyIds ?? []}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMembers.map((member) => (
                            <div key={member.id} className="relative">
                                <div className="absolute -top-3 left-6 z-10 px-4 py-1.5 bg-[#E8F0EE] border border-[#3D7475] rounded-xl">
                                    <h3 className="text-xs font-bold text-[#3D7475] uppercase tracking-wide">{member.role}</h3>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 pt-10">
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

                                    <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                                        {member.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => setEditingMember({ id: member.id, name: member.name, permissions: member.permissions, propertyIds: member.propertyIds ?? [] })}
                                                className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-[#3D7475] bg-[#E8F0EE] rounded-md hover:bg-[#d7e5e1] transition-colors"
                                            >
                                                <ShieldCheck className="w-3 h-3" />
                                                Edit Permissions
                                            </button>
                                        )}
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
                        Team limit: <span className="font-semibold text-gray-700">{members.length} of {TEAM_LIMIT}</span>
                    </div>
                )}
            </TeamManagementSettingsLayout>
        </>
    );
}
