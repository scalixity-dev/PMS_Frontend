import { useMemo, useState } from "react";
import { TeamManagementSettingsLayout } from "../../../../components/common/TeamManagementSettingsLayout";
import Pagination from "../../components/Pagination";
import propertyPlaceholder from "../../../../assets/images/property_placeholder.png";
import { useGetAllPropertiesTransformed } from "../../../../hooks/usePropertyQueries";
import { useGetSettingsSection, useUpdateSettingsSection } from "../../../../hooks/useSettingsQueries";

interface Property {
    id: string;
    name: string;
    address: string;
    image: string;
}

interface TeamMember {
    id: string;
    name: string;
}

interface TeamRolesPermissionsValues {
    members: TeamMember[];
}

interface TeamPropertyPermissionAssignment {
    propertyId: string;
    memberIds: string[];
}

interface TeamPropertyPermissionsValues {
    assignments: TeamPropertyPermissionAssignment[];
}

export default function PropertyPermissions() {
    const { data: transformedProperties = [] } = useGetAllPropertiesTransformed(true);
    const { data: rolesData } = useGetSettingsSection<TeamRolesPermissionsValues>("team_roles_permissions");
    const { data: propertyPermissionsData } = useGetSettingsSection<TeamPropertyPermissionsValues>("team_property_permissions");
    const updatePropertyPermissions = useUpdateSettingsSection<TeamPropertyPermissionsValues>("team_property_permissions");

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const ITEMS_PER_PAGE = 4;

    const allProperties: Property[] = transformedProperties.map((property) => ({
        id: property.id,
        name: property.name,
        address: property.address,
        image: property.image || propertyPlaceholder,
    }));

    const teamMembers = rolesData?.values?.members ?? [];
    const assignments = propertyPermissionsData?.values?.assignments ?? [];

    const { totalPages, paginatedProperties } = useMemo(() => {
        const filtered = allProperties.filter((property) =>
            `${property.name} ${property.address}`.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        const total = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginated = filtered.slice(startIndex, endIndex);

        return {
            totalPages: total,
            paginatedProperties: paginated,
        };
    }, [allProperties, currentPage, searchQuery, ITEMS_PER_PAGE]);

    const handleAddTeamMember = (propertyId: string) => {
        if (teamMembers.length === 0) {
            return;
        }
        const existingAssignment = assignments.find((assignment) => assignment.propertyId === propertyId);
        const existingIds = existingAssignment?.memberIds ?? [];
        const nextMemberId = teamMembers.find((member) => !existingIds.includes(member.id))?.id;
        if (!nextMemberId) {
            return;
        }

        const nextAssignments = existingAssignment
            ? assignments.map((assignment) =>
                assignment.propertyId === propertyId
                    ? { ...assignment, memberIds: [...assignment.memberIds, nextMemberId] }
                    : assignment,
            )
            : [...assignments, { propertyId, memberIds: [nextMemberId] }];

        updatePropertyPermissions.mutate({ assignments: nextAssignments });
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const getAssignedCount = (propertyId: string) => {
        return assignments.find((assignment) => assignment.propertyId === propertyId)?.memberIds.length ?? 0;
    };

    return (
        <TeamManagementSettingsLayout
            activeTab="property-permissions"
            onSearchChange={handleSearchChange}
        >
            <div className="space-y-8">
                {/* Property Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedProperties.map((property) => (
                        <div
                            key={property.id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row gap-6 p-6 ">
                                {/* Property Image */}
                                <div className="w-full h-48 sm:w-36 sm:h-32 rounded-lg shrink-0 overflow-hidden">
                                    <img
                                        src={property.image}
                                        alt={property.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Property Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                            {property.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {property.address}
                                        </p>
                                    </div>

                                    {/* Add Team Member Button */}
                                    <div className="flex justify-end mt-3">
                                        <button
                                            type="button"
                                            onClick={() => handleAddTeamMember(property.id)}
                                            className="w-full sm:w-auto px-5 py-2 bg-[#4A9B8E] text-white text-sm font-medium rounded-lg hover:bg-[#3d8275] transition-colors"
                                        >
                                            Add Team member ({getAssignedCount(property.id)})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {paginatedProperties.length === 0 && (
                        <p className="text-sm text-gray-500">No properties found.</p>
                    )}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="pt-4"
                />
            </div>
        </TeamManagementSettingsLayout>
    );
}
