import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Trash2, Check, Loader2 } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
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
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() ?? { sidebarCollapsed: false };
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
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
            property: key.property?.propertyName || 'Unknown Property',
            unit: key.unit?.unitName || '-----',
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

    // Filter keys based on search and filters
    const filteredKeys = useMemo(() => {
        return transformedKeys.filter(key => {
            const matchesSearch = !searchQuery ||
                key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                key.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                key.type.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = !filters.keyStatus?.length ||
                filters.keyStatus.includes('all') ||
                (filters.keyStatus.includes('active') && (key.status === 'AVAILABLE' || key.status === 'ISSUED')) ||
                (filters.keyStatus.includes('inactive') && (key.status === 'INACTIVE' || key.status === 'LOST' || key.status === 'DAMAGED'));

            return matchesSearch && matchesStatus;
        });
    }, [transformedKeys, searchQuery, filters]);

    // Reset to first page when filters or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);

    // Get current page items
    const currentKeys = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredKeys.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredKeys, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchChange = (search: string) => {
        setSearchQuery(search);
    };

    const handleFiltersChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters);
    };

    const filterOptions = {
        keyStatus: [
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
        ],
    };

    const filterLabels = {
        keyStatus: 'Key Status',
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
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Keys & Locks</span>
            </div>

            <div className="p-4 md:p-6 bg-[#E0E5E5] min-h-screen rounded-[1.5rem] md:rounded-[2rem] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-1.5 md:p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                        </button>
                        <h1 className="text-lg md:text-2xl font-bold text-gray-800">Keys & Locks</h1>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/dashboard/portfolio/add-key')} className="px-3 md:px-5 py-2 bg-[#3A6D6C] text-white rounded-full text-xs md:text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-1 md:gap-2 shadow-sm whitespace-nowrap">
                            Add Keys
                            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
                        <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 hidden md:block">
                            {/* Table Header */}
                            <div className="bg-[#3A6D6C] text-white px-6 py-4 grid grid-cols-[40px_1fr_1fr_1.5fr_1fr_1fr_80px] gap-4 items-center text-sm font-medium">
                                <div className="flex items-center justify-center ml-2">
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
                        <div className="flex flex-col gap-3 md:bg-[#F0F0F6] md:p-4 md:rounded-[2rem] md:rounded-t-none">
                            {filteredKeys.length === 0 ? (
                                <div className="bg-white rounded-2xl px-6 py-12 text-center">
                                    <p className="text-gray-500">No keys found</p>
                                </div>
                            ) : (
                                currentKeys.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/dashboard/portfolio/keys-locks/${item.id}`)}
                                        className="bg-white rounded-2xl px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-[40px_1fr_1fr_1.5fr_1fr_1fr_80px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                                    >
                                        {/* Mobile: Header Row (Checkbox + Name + Actions) */}
                                        <div className="flex md:contents items-center justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center absolute top-4 left-4 md:static">
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
                                                <div className="font-semibold text-[#2E6819] text-sm md:hidden pl-8">{item.name}</div>
                                            </div>

                                            {/* Mobile Actions */}
                                            <div className="flex items-center gap-2 md:hidden absolute top-4 right-4">
                                                <button
                                                    onClick={(e) => handleEdit(item.id, e)}
                                                    className="p-1.5 text-[#3A6D6C] hover:bg-gray-50 rounded-full"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(item.id, e)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-full"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Desktop Name (hidden on mobile) */}
                                        <div className="font-semibold text-[#2E6819] text-sm hidden md:block">{item.name}</div>

                                        {/* Content Grid */}
                                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 w-full md:contents mt-8 md:mt-0 pl-2 md:pl-0">
                                            <div className="flex flex-col md:block">
                                                <span className="text-xs text-gray-500 md:hidden mb-1">Type</span>
                                                <span className="text-[#2E6819] text-sm font-semibold">{item.type}</span>
                                            </div>
                                            <div className="flex flex-col md:block">
                                                <span className="text-xs text-gray-500 md:hidden mb-1">Property</span>
                                                <span className="text-[#2E6819] text-sm font-semibold truncate">{item.property}</span>
                                            </div>
                                            <div className="flex flex-col md:block">
                                                <span className="text-xs text-gray-500 md:hidden mb-1">Unit</span>
                                                <span className="text-gray-400 text-sm font-medium tracking-widest">{item.unit}</span>
                                            </div>
                                            <div className="flex flex-col md:block">
                                                <span className="text-xs text-gray-500 md:hidden mb-1">Assignee</span>
                                                <span className="text-[#4ad1a6] text-sm font-semibold">{item.assignee}</span>
                                            </div>
                                        </div>

                                        {/* Desktop Actions */}
                                        <div className="hidden md:flex items-center justify-end gap-3">
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
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            className="mt-auto py-6"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default KeysLocks;
