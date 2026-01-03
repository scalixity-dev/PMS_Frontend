import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import TenantCard from './components/TenantCard';
import { Plus, ChevronLeft, Loader2 } from 'lucide-react';
import { useGetAllTenants, useDeleteTenant } from '../../../../hooks/useTenantQueries';
import { tenantService, type Tenant } from '../../../../services/tenant.service';



const Tenants = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const deleteTenantMutation = useDeleteTenant();

    // Fetch tenants using React Query
    const { data: backendTenants = [], isLoading, error } = useGetAllTenants();
    const { sidebarCollapsed = false } = useOutletContext<{ sidebarCollapsed: boolean }>() ?? {};
    const [, setFilters] = useState<Record<string, string[]>>({});

    // Transform backend tenants to frontend format
    const tenants: Tenant[] = useMemo(() => {
        return backendTenants.map((tenant) => tenantService.transformTenant(tenant));
    }, [backendTenants]);

    const handleSearchChange = (search: string) => {
        setSearchQuery(search);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleFiltersChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const filterOptions: Record<string, FilterOption[]> = {
        tenantType: [
            { value: '__no_items__', label: 'No tenant types available' }
        ],
        propertyUnits: [
            { value: '__no_items__', label: 'No properties available' }
        ],
        lease: [
            { value: '__no_items__', label: 'No lease data available' }
        ]
    };

    const filterLabels: Record<string, string> = {
        tenantType: 'Tenant Type',
        propertyUnits: 'Property & Units',
        lease: 'Lease'
    };

    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            setError(null);
            const backendTenants = await tenantService.getAll();
            const transformedTenants = backendTenants.map((tenant) => tenantService.transformTenant(tenant));
            setTenants(transformedTenants);
        } catch (err) {
            console.error('Error fetching tenants:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch tenants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSortToggle = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    // Filter and search tenants
    const filteredTenants = useMemo(() => {
        return tenants.filter(tenant => {
            // Search filter
            const matchesSearch = !searchQuery ||
                tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tenant.phone.toLowerCase().includes(searchQuery.toLowerCase());

            // Tenant type filter (ignore placeholder value)
            const matchesTenantType = !filters.tenantType?.length ||
                filters.tenantType.filter(v => v !== '__no_items__').length === 0;

            // Property/Units filter (ignore placeholder value)
            const matchesPropertyUnits = !filters.propertyUnits?.length ||
                filters.propertyUnits.filter(v => v !== '__no_items__').length === 0;

            // Lease filter (ignore placeholder value)
            const matchesLease = !filters.lease?.length ||
                filters.lease.filter(v => v !== '__no_items__').length === 0;

            return matchesSearch && matchesTenantType && matchesPropertyUnits && matchesLease;
        });
    }, [tenants, searchQuery, filters]);

    // Sort tenants
    const sortedTenants = useMemo(() => {
        return [...filteredTenants].sort((a, b) => {
            return sortOrder === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
    }, [filteredTenants, sortOrder]);

    const totalPages = Math.ceil(sortedTenants.length / itemsPerPage);
    const currentTenants = sortedTenants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteTenant = async (tenantId: string) => {
        if (window.confirm('Are you sure you want to delete this tenant?')) {
            try {
                await deleteTenantMutation.mutateAsync(tenantId);
            } catch (err) {
                console.error('Failed to delete tenant:', err);
                alert(`Failed to delete tenant: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Contacts</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Tenants</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Tenants</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors">
                            Import
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/contacts/tenants/add')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                        >
                            Add Tenants
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

                {/* Stats/Count Section */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handleSortToggle}
                        className="flex items-center gap-1 hover:bg-black/5 px-2 py-1 rounded-lg transition-colors"
                    >

                    </button>

                    <div className="bg-[#3A6D6C] text-white px-4 py-1 rounded-full text-sm">
                        {sortedTenants.length} Tenant{sortedTenants.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                        <span className="ml-3 text-gray-600">Loading tenants...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800 text-sm">
                            {error instanceof Error ? error.message : 'Failed to load tenants. Please try again.'}
                        </p>
                    </div>
                )}

                {/* Tenants Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {currentTenants.length > 0 ? (
                            currentTenants.map((tenant) => (
                                <TenantCard
                                    key={tenant.id}
                                    id={tenant.id}
                                    name={tenant.name}
                                    phone={tenant.phone}
                                    email={tenant.email}
                                    image={tenant.image || ''}
                                    propertyName="Sunset Apartments, Unit 4B"
                                    onDeleteSuccess={fetchTenants}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-600">
                                    {searchQuery || Object.keys(filters).some(key => filters[key]?.length > 0)
                                        ? 'No tenants match your filters'
                                        : 'No tenants found'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-auto">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages || 1}
                        onPageChange={handlePageChange}
                    />
                </div>


            </div>
        </div>
    );
};

export default Tenants;
