import { useState, useCallback, memo, useMemo } from "react";
import { TeamManagementSettingsLayout } from "../../../../components/common/TeamManagementSettingsLayout";
import { X, Mail, Trash2, RefreshCw, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import {
    useGetTeamMembers,
    useInviteTeamMember,
    useDeleteTeamMember,
    useResendInvitation,
    useRevokeTeamMember,
} from "../../../../hooks/useTeamQueries";
import { useToast } from "../../../../components/common/Toast";
import { formatPhoneNumber } from '@/utils/phone.utils';

import type { TeamRole } from "../../../../services/team.service";

const INPUT_CLASS = "w-full px-4 py-3 border-b border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors";

interface InviteFormData {
    name: string;
    phoneNumber: string;
    email: string;
    role: TeamRole;
}

const ROLE_OPTIONS: { value: TeamRole; label: string; description: string }[] = [
    { value: 'ADMIN', label: 'Admin', description: 'Full access to everything' },
    { value: 'MANAGER', label: 'Manager', description: 'Manage properties + tenants' },
    { value: 'ACCOUNTANT', label: 'Accountant', description: 'Financial reports + transactions' },
    { value: 'MAINTENANCE', label: 'Maintenance', description: 'Work orders + maintenance only' },
    { value: 'VIEWER', label: 'Viewer', description: 'Read-only access' },
];

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
        role: 'VIEWER',
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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-6 space-y-4">
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


                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">Role</label>
                        <div className="space-y-2">
                            {ROLE_OPTIONS.map((opt) => (
                                <label
                                    key={opt.value}
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.role === opt.value ? 'bg-[#E8F0EE] border-[#3D7475]' : 'border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        checked={data.role === opt.value}
                                        onChange={() => setData({ ...data, role: opt.value })}
                                        className="mt-0.5 accent-[#3D7475]"
                                        disabled={isSubmitting}
                                    />
                                    <div>
                                        <div className="font-medium text-sm text-gray-900">{opt.label}</div>
                                        <div className="text-xs text-gray-500">{opt.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-2 text-xs text-red-700">
                            {error}
                        </div>
                    )}
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
    const toast = useToast();

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
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
                role: data.role,
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

                                    <div className="flex gap-2 pt-3 border-t border-gray-100">
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
                        ))}
                    </div>
                )}
            </TeamManagementSettingsLayout>
        </>
    );
}
