import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Trash2, Check, Loader2 } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import { useGetAllKeys, useDeleteKey } from '../../../../hooks/useKeysQueries';
import type { BackendKey } from '../../../../services/keys.service';

// Map backend key type to display format
const mapKeyType = (keyType: string): string => {
    const typeMap: Record<string, string> = {
        'DOOR': 'Main Door',
        'MAILBOX': 'Mailbox',
        'GARAGE': 'Garage',
        'GATE': 'Gate',
        'STORAGE': 'Storage',
        'OTHER': 'Other',
    };
    return typeMap[keyType] || keyType;
};

const KeysLocks = () => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});

    // Fetch keys from backend
    const { data: keys = [], isLoading, error } = useGetAllKeys();
    const deleteKeyMutation = useDeleteKey();

    // Transform backend keys to display format
    const transformedKeys = useMemo(() => {
        return keys.map((key: BackendKey) => ({
            id: key.id,
            name: key.keyName,
            type: mapKeyType(key.keyType),
            keyType: key.keyType, // Keep original for filtering
            property: key.property?.propertyName || 'Unknown Property',
            propertyId: key.propertyId,
            unit: key.unit?.unitName || '-----',
            unitId: key.unitId,
            assignee: key.issuedTo || 'Unassigned',
            status: key.status,
            keyDescription: key.description || '',
            propertyDescription: key.property?.address
                ? `${key.property.address.streetAddress}, ${key.property.address.city}, ${key.property.address.stateRegion} ${key.property.address.zipCode}, ${key.property.address.country}`
                : '',
            propertyAddress: key.property?.address
                ? `${key.property.address.streetAddress}, ${key.property.address.city}, ${key.property.address.stateRegion} ${key.property.address.zipCode}, ${key.property.address.country}`
                : 'Address not available',
            keyPhotoUrl: key.keyPhotoUrl,
        }));
    }, [keys]);

    // Get unique properties and assignees for filter options
    const propertyOptions = useMemo(() => {
        const uniqueProperties = Array.from(new Set(transformedKeys.map(k => k.property).filter(Boolean)));
        return uniqueProperties.map(prop => ({ value: prop, label: prop }));
    }, [transformedKeys]);

    const assigneeOptions = useMemo(() => {
        const uniqueAssignees = Array.from(new Set(transformedKeys.map(k => k.assignee).filter(Boolean)));
        return uniqueAssignees.map(assignee => ({ value: assignee, label: assignee }));
    }, [transformedKeys]);

    // Filter keys based on search and filters
    const filteredKeys = useMemo(() => {
        return transformedKeys.filter(key => {
            // Search filter
            const matchesSearch = !searchQuery ||
                key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                key.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                key.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                key.assignee.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = !filters.status?.length ||
                filters.status.includes(key.status);

            // Key Type filter
            const matchesKeyType = !filters.keyType?.length ||
                filters.keyType.includes(key.keyType);

            // Property filter
            const matchesProperty = !filters.property?.length ||
                filters.property.includes(key.property);

            // Assignee filter
            const matchesAssignee = !filters.assignee?.length ||
                filters.assignee.includes(key.assignee);

            return matchesSearch && matchesStatus && matchesKeyType && matchesProperty && matchesAssignee;
        });
    }, [transformedKeys, searchQuery, filters]);

    const handleSearchChange = (search: string) => {
        setSearchQuery(search);
    };

    const handleFiltersChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters);
    };

    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'AVAILABLE', label: 'Available' },
            { value: 'ISSUED', label: 'Issued' },
            { value: 'LOST', label: 'Lost' },
            { value: 'DAMAGED', label: 'Damaged' },
            { value: 'INACTIVE', label: 'Inactive' },
        ],
        keyType: [
            { value: 'DOOR', label: 'Main Door' },
            { value: 'MAILBOX', label: 'Mailbox' },
            { value: 'GARAGE', label: 'Garage' },
            { value: 'GATE', label: 'Gate' },
            { value: 'STORAGE', label: 'Storage' },
            { value: 'OTHER', label: 'Other' },
        ],
        property: propertyOptions,
        assignee: assigneeOptions,
    };

    const filterLabels: Record<string, string> = {
        status: 'Status',
        keyType: 'Key Type',
        property: 'Property',
        assignee: 'Assignee',
    };

    const toggleSelection = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const toggleAll = () => {
        if (selectedItems.length === filteredKeys.length && filteredKeys.length > 0) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredKeys.map(item => item.id));
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this key?')) {
            try {
                await deleteKeyMutation.mutateAsync(id);
            } catch (error) {
                console.error('Error deleting key:', error);
            }
        }
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/dashboard/portfolio/edit-key/${id}`);
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
                        <button onClick={() => navigate('/dashboard/portfolio/add-key')} className="px-5 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2 shadow-sm">
                            Add Keys
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={handleSearchChange}
                    onFiltersChange={handleFiltersChange}
                    initialFilters={filters}
                    showClearAll={true}
                />

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12 mt-8">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                        <p className="ml-4 text-gray-600">Loading keys...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mt-8">
                        <p className="text-red-800">
                            {error instanceof Error ? error.message : 'Failed to load keys'}
                        </p>
                    </div>
                )}

                {/* Table Section */}
                {!isLoading && !error && (
                    <>
                        <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8">
                            {/* Table Header */}
                            <div className="text-white px-6 py-4 grid grid-cols-[40px_1fr_1fr_1.5fr_1fr_1fr_80px] gap-4 items-center text-sm font-medium">
                                <div className="flex items-center justify-center ml-7">
                                    <button onClick={toggleAll} className="flex items-center justify-center">
                                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.length === filteredKeys.length && filteredKeys.length > 0 ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                            {selectedItems.length === filteredKeys.length && filteredKeys.length > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </button>
                                </div>
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
                            {filteredKeys.length === 0 ? (
                                <div className="bg-white rounded-2xl px-6 py-12 text-center">
                                    <p className="text-gray-500">No keys found</p>
                                </div>
                            ) : (
                                filteredKeys.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/dashboard/portfolio/keys-locks/${item.id}`)}
                                        className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[40px_1fr_1fr_1.5fr_1fr_1fr_80px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
                                        <div className="font-semibold text-[#2E6819] text-sm">{item.name}</div>
                                        <div className="text-[#2E6819] text-sm font-semibold">{item.type}</div>
                                        <div className="text-[#2E6819] text-sm font-semibold">{item.property}</div>
                                        <div className="text-gray-400 text-sm font-medium tracking-widest">{item.unit}</div>
                                        <div className="text-[#4ad1a6] text-sm font-semibold">{item.assignee}</div>
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={(e) => handleEdit(item.id, e)}
                                                className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(item.id, e)}
                                                disabled={deleteKeyMutation.isPending}
                                                className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default KeysLocks;
