import { useMemo, useState, useCallback } from "react";
import { TeamManagementSettingsLayout } from "../../../../components/common/TeamManagementSettingsLayout";
import Pagination from "../../components/Pagination";
import propertyPlaceholder from "../../../../assets/images/property_placeholder.png";
import { X, Loader2, Users, MapPin } from "lucide-react";
import { useGetAllPropertiesTransformed } from "../../../../hooks/usePropertyQueries";
import { useGetTeamMembers, useUpdateTeamMember } from "../../../../hooks/useTeamQueries";
import { useToast } from "../../../../components/common/Toast";
import { formatRole } from "../../../../utils/roleIcon";

interface Property {
    id: string;
    name: string;
    address: string;
    image: string;
}

const ITEMS_PER_PAGE = 6;

const AssignTeamModal = ({
    isOpen,
    onClose,
    property,
    teamMembers,
    onSave,
    isSaving,
}: {
    isOpen: boolean;
    onClose: () => void;
    property: Property | null;
    teamMembers: Array<{ id: string; name: string; email: string; role: string; propertyIds: string[] }>;
    onSave: (selectedMemberIds: string[]) => void;
    isSaving: boolean;
}) => {
    const initiallyAssigned = useMemo(() => {
        if (!property) return new Set<string>();
        return new Set(
            teamMembers
                .filter((m) => m.propertyIds.includes(property.id))
                .map((m) => m.id),
        );
    }, [property, teamMembers]);

    const [selected, setSelected] = useState<Set<string>>(initiallyAssigned);

    // Reset on property change
    useMemo(() => {
        setSelected(initiallyAssigned);
    }, [initiallyAssigned]);

    if (!isOpen || !property) return null;

    const toggle = (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Assign Team Members</h2>
                        <p className="text-xs text-gray-500 truncate">{property.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto flex-1">
                    {teamMembers.length === 0 ? (
                        <div className="text-center py-8 text-sm text-gray-500">
                            No team members yet. Invite members from Roles & Permissions first.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {teamMembers.map((member) => (
                                <label
                                    key={member.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selected.has(member.id) ? 'bg-[#E8F0EE] border-[#3D7475]' : 'border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.has(member.id)}
                                        onChange={() => toggle(member.id)}
                                        className="accent-[#3D7475] w-4 h-4"
                                    />
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3D7475] to-[#273F3B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{member.name}</div>
                                        <div className="text-xs text-gray-500 truncate">{member.email} · {formatRole(member.role)}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(Array.from(selected))}
                        disabled={isSaving || teamMembers.length === 0}
                        className="px-6 py-2 rounded-lg text-white font-medium text-sm bg-[#3D7475] hover:bg-[#2c5556] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSaving ? 'Saving...' : 'Save Assignments'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function PropertyPermissions() {
    const { data: transformedProperties = [], isLoading: isLoadingProps } = useGetAllPropertiesTransformed(true);
    const { data: teamMembers = [], isLoading: isLoadingTeam } = useGetTeamMembers();
    const updateMemberMutation = useUpdateTeamMember();
    const toast = useToast();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeProperty, setActiveProperty] = useState<Property | null>(null);

    const allProperties: Property[] = useMemo(() =>
        transformedProperties.map((property) => ({
            id: property.id,
            name: property.name,
            address: property.address,
            image: property.image || propertyPlaceholder,
        })),
    [transformedProperties]);

    const { totalPages, paginatedProperties } = useMemo(() => {
        const filtered = allProperties.filter((property) =>
            `${property.name} ${property.address}`.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        const total = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        return { totalPages: total, paginatedProperties: paginated };
    }, [allProperties, currentPage, searchQuery]);

    // Save assignments: this updates each affected member's propertyIds
    const handleSaveAssignments = useCallback(async (selectedMemberIds: string[]) => {
        if (!activeProperty) return;
        const propertyId = activeProperty.id;

        try {
            // For each team member, determine if their assignment for this property changes
            const updates = teamMembers
                .filter((member) => {
                    const hasIt = member.propertyIds.includes(propertyId);
                    const shouldHaveIt = selectedMemberIds.includes(member.id);
                    return hasIt !== shouldHaveIt;
                })
                .map((member) => {
                    const shouldHaveIt = selectedMemberIds.includes(member.id);
                    const newPropIds = shouldHaveIt
                        ? Array.from(new Set([...member.propertyIds, propertyId]))
                        : member.propertyIds.filter((id) => id !== propertyId);
                    return updateMemberMutation.mutateAsync({
                        id: member.id,
                        dto: { propertyIds: newPropIds },
                    });
                });

            await Promise.all(updates);
            toast.success(`Assignments saved for ${activeProperty.name}`);
            setActiveProperty(null);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to save assignments');
        }
    }, [activeProperty, teamMembers, updateMemberMutation, toast]);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const getAssignedCount = (propertyId: string) =>
        teamMembers.filter((m) => m.propertyIds.includes(propertyId)).length;

    const isLoading = isLoadingProps || isLoadingTeam;

    return (
        <>
            <AssignTeamModal
                isOpen={!!activeProperty}
                onClose={() => setActiveProperty(null)}
                property={activeProperty}
                teamMembers={teamMembers as any}
                onSave={handleSaveAssignments}
                isSaving={updateMemberMutation.isPending}
            />

            <TeamManagementSettingsLayout
                activeTab="property-permissions"
                onSearchChange={handleSearchChange}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3D7475]" />
                        <span className="ml-3 text-gray-600">Loading...</span>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {teamMembers.length === 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                                <strong>No team members yet.</strong> Go to <a href="/dashboard/settings/team-management/roles-permissions" className="underline font-medium">Roles & Permissions</a> to invite team members first.
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {paginatedProperties.map((property) => {
                                const assignedCount = getAssignedCount(property.id);
                                const assignedMembers = teamMembers.filter((m) => m.propertyIds.includes(property.id));
                                return (
                                    <div
                                        key={property.id}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="relative w-full h-44 shrink-0">
                                            <img
                                                src={property.image}
                                                alt={property.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Members badge overlay */}
                                            <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${assignedCount > 0 ? 'bg-[#3D7475] text-white' : 'bg-white/90 text-gray-500'}`}>
                                                <Users className="w-3 h-3" />
                                                {assignedCount > 0 ? `${assignedCount} assigned` : 'No members'}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-1 p-4">
                                            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{property.name}</h3>
                                            <div className="flex items-start gap-1 mb-4">
                                                <MapPin className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{property.address}</p>
                                            </div>

                                            {/* Assigned member avatars */}
                                            {assignedMembers.length > 0 && (
                                                <div className="flex items-center gap-1.5 mb-4">
                                                    <div className="flex -space-x-2">
                                                        {assignedMembers.slice(0, 4).map((m) => (
                                                            <div
                                                                key={m.id}
                                                                title={m.name}
                                                                className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3D7475] to-[#273F3B] border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                                                            >
                                                                {m.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        ))}
                                                        {assignedMembers.length > 4 && (
                                                            <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-[10px] font-bold">
                                                                +{assignedMembers.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {assignedMembers.slice(0, 2).map(m => m.name.split(' ')[0]).join(', ')}
                                                        {assignedMembers.length > 2 ? ` +${assignedMembers.length - 2} more` : ''}
                                                    </span>
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => setActiveProperty(property)}
                                                disabled={teamMembers.length === 0}
                                                className={`mt-auto w-full py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    assignedCount > 0
                                                        ? 'bg-[#E8F0EE] text-[#3D7475] hover:bg-[#d7e5e1]'
                                                        : 'bg-[#3D7475] text-white hover:bg-[#2c5556]'
                                                }`}
                                            >
                                                {assignedCount > 0 ? 'Edit Assignment' : 'Assign Team'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {paginatedProperties.length === 0 && (
                                <p className="text-sm text-gray-500 col-span-3">No properties found.</p>
                            )}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            className="pt-4"
                        />
                    </div>
                )}
            </TeamManagementSettingsLayout>
        </>
    );
}
