import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import TenantCard from './components/TenantCard';
import { Plus, ChevronLeft, Loader2 } from 'lucide-react';
import { useGetAllTenants } from '../../../../hooks/useTenantQueries';
import { tenantService, type Tenant } from '../../../../services/tenant.service';

const Tenants = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();

    // Handle pre-selected property from navigation state
    useEffect(() => {
        const state = location.state as { preSelectedProperty?: string };
        if (state?.preSelectedProperty) {
            setFilters(prev => ({
                ...prev,
                propertyUnits: [state.preSelectedProperty!]
            }));
            // Clear state to prevent reapplying on refresh/navigation
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);
    const itemsPerPage = 9;

    // Fetch tenants using React Query
    const { data: backendTenants = [], isLoading, error, refetch } = useGetAllTenants();
    const { sidebarCollapsed = false } = useOutletContext<{ sidebarCollapsed: boolean }>() ?? {};

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

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Contacts</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Tenants</span>
            </div>

            <div className="p-4 sm:p-6 bg-[#E0E5E5] min-h-screen rounded-[1.5rem] sm:rounded-[2rem] flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Tenants</h1>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        <button
                            onClick={() => navigate('/dashboard/contacts/tenants/import')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors whitespace-nowrap"
                        >
                            Import
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/contacts/tenants/add')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2 whitespace-nowrap"
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
                {!isLoading && !error && (
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
                                    onDeleteSuccess={() => refetch()}
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
