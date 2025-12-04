import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Settings, MoveVertical, Edit, Trash2, Check } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';

// Mock Data
// Mock Data
export const keysData = [
    {
        id: 1,
        name: 'Xyz',
        type: 'Main Door',
        property: 'Luxury Property',
        unit: '-----',
        assignee: 'UnAssignee',
        keyDescription: 'This is a main door key for the luxury property. It gives access to the main entrance.',
        propertyDescription: 'A beautiful luxury property located in the heart of the city. Features modern amenities and spacious living areas.',
        propertyAddress: '78 Scheme No 78 - II, Indore, MP 452010, IN'
    },
    {
        id: 2,
        name: 'Abc',
        type: 'Main Door',
        property: 'Abc Property',
        unit: '-----',
        assignee: 'UnAssignee',
        keyDescription: 'Spare key for the back door.',
        propertyDescription: 'Cozy apartment in a quiet neighborhood.',
        propertyAddress: '123 Main St, Anytown, USA'
    },
    {
        id: 3,
        name: 'Njdsbjs',
        type: 'Main Door',
        property: 'Avasa Dept.',
        unit: '-----',
        assignee: 'UnAssignee',
        keyDescription: 'Key for the storage unit.',
        propertyDescription: 'Commercial property with high foot traffic.',
        propertyAddress: '456 Market St, Business District'
    },
    {
        id: 4,
        name: 'New',
        type: 'Main Door',
        property: 'C1 Apartment',
        unit: '-----',
        assignee: 'UnAssignee',
        keyDescription: 'Master key for all units.',
        propertyDescription: 'Residential complex with swimming pool and gym.',
        propertyAddress: '789 Park Ave, Suburbia'
    },
];

const KeysLocks = () => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const handleSearchChange = (search: string) => {
        console.log('Search:', search);
    };

    const handleFiltersChange = (filters: Record<string, string[]>) => {
        console.log('Filters:', filters);
    };

    const filterOptions = {
        keyStatus: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
        ],
        propertyUnits: [
            { value: 'prop1', label: 'Property 1' },
            { value: 'prop2', label: 'Property 2' }
        ]
    };

    const filterLabels = {
        keyStatus: 'Key Status',
        propertyUnits: 'Property & Units'
    };

    const toggleSelection = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const toggleAll = () => {
        if (selectedItems.length === keysData.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(keysData.map(item => item.id));
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Keys & Locks</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Keys & Locks</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2 shadow-sm">
                            Add Request
                            <Plus className="w-4 h-4" />
                        </button>
                        <button className="px-5 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2 shadow-sm">
                            Edit Settings
                            <Settings className="w-4 h-4" />
                        </button>
                        <button className="px-5 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2 shadow-sm">
                            Expand View
                            <MoveVertical className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={handleSearchChange}
                    onFiltersChange={handleFiltersChange}
                />

                {/* Table Section */}
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8">
                    {/* Table Header */}
                    <div className="text-white px-6 py-4 grid grid-cols-[40px_40px_1fr_1fr_1.5fr_1fr_1fr_80px] gap-4 items-center text-sm font-medium">
                        <div className="flex items-center justify-center ml-7">
                            <button onClick={toggleAll} className="flex items-center justify-center">
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.length === keysData.length && keysData.length > 0 ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                    {selectedItems.length === keysData.length && keysData.length > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                            </button>
                        </div>
                        <div></div> {/* Spacer for ID */}
                        <div>Name</div>
                        <div>Type</div>
                        <div>Property</div>
                        <div>Unit</div>
                        <div>Assignee</div>
                        <div></div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t">
                    {keysData.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/dashboard/portfolio/keys-locks/${item.id}`)}
                            className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[40px_40px_1fr_1fr_1.5fr_1fr_1fr_80px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelection(item.id);
                                    }}
                                    className="flex items-center justify-center"
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.includes(item.id) ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                        {selectedItems.includes(item.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </button>
                            </div>
                            <div className="font-bold text-gray-800 text-sm">{item.id}</div>
                            <div className="font-semibold text-[#2E6819] text-sm">{item.name}</div>
                            <div className="text-[#2E6819] text-sm font-semibold">{item.type}</div>
                            <div className="text-[#2E6819] text-sm font-semibold">{item.property}</div>
                            <div className="text-gray-400 text-sm font-medium tracking-widest">{item.unit}</div>
                            <div className="text-[#4ad1a6] text-sm font-semibold">{item.assignee}</div>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Add edit logic here
                                    }}
                                    className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Add delete logic here
                                    }}
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KeysLocks;
