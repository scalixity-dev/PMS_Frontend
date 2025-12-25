import { useState, useMemo } from "react";
import { TeamManagementSettingsLayout } from "../../../../components/common/TeamManagementSettingsLayout";
import Pagination from "../../components/Pagination";
import propertyPlaceholder from "../../../../assets/images/property_placeholder.png";

interface Property {
    id: string;
    name: string;
    address: string;
    image: string;
}

// Mock data - replace with actual data from API
const ALL_PROPERTIES: Property[] = [
    {
        id: "1",
        name: "abc",
        address: "78 Scheme No 78 - II, Indore, MP, 452010, IN",
        image: propertyPlaceholder,
    },
    {
        id: "2",
        name: "abc",
        address: "78 Scheme No 78 - II, Indore, MP, 452010, IN",
        image: propertyPlaceholder,
    },
    {
        id: "3",
        name: "abc",
        address: "78 Scheme No 78 - II, Indore, MP, 452010, IN",
        image: propertyPlaceholder,
    },
    {
        id: "4",
        name: "abc",
        address: "78 Scheme No 78 - II, Indore, MP, 452010, IN",
        image: propertyPlaceholder,
    },
];

export default function PropertyPermissions() {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    // Calculate pagination values
    const { totalPages, paginatedProperties } = useMemo(() => {
        const total = Math.ceil(ALL_PROPERTIES.length / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginated = ALL_PROPERTIES.slice(startIndex, endIndex);

        return {
            totalPages: total,
            paginatedProperties: paginated,
        };
    }, [currentPage, ITEMS_PER_PAGE]);

    const handleAddTeamMember = (propertyId: string) => {
        console.log("Add team member to property:", propertyId);
        // Implement add team member logic
    };

    const handleSearchChange = (query: string) => {
        // Add search logic here to filter properties
        console.log("Searching for:", query);
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
                            <div className="flex gap-6 p-6 ">
                                {/* Property Image */}
                                <div className="w-36 h-32 rounded-lg shrink-0 overflow-hidden">
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
                                            className="px-5 py-2 bg-[#4A9B8E] text-white text-sm font-medium rounded-lg hover:bg-[#3d8275] transition-colors"
                                        >
                                            Add Team member
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
