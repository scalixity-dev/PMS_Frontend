import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import { useTeamPermissions } from '../../../../context/TeamPermissionContext';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import TenantCard from './components/TenantCard';
import { Plus, ChevronLeft, Loader2, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import { useGetAllTenants } from '../../../../hooks/useTenantQueries';
import { tenantService, type Tenant } from '../../../../services/tenant.service';

const Tenants = () => {
    const navigate = useNavigate();
    const { isTeamMember, canManage } = useTeamPermissions();
    const canEdit = !isTeamMember || canManage('contacts');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [showArchived, setShowArchived] = useState(false);
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

    // Server-side search only. Tenant-type filter is now resolved client-side
    // after transform because our UI labels ("Current"/"Past"/"Pending") don't
    // map 1:1 to ContactStatus enum values the backend expects.
    const { data: backendTenants = [], isLoading, error, refetch } = useGetAllTenants({
        search: searchQuery || undefined,
        isActive: !showArchived,
    });
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

    // Build filter options dynamically from transformed tenants (which now
    // carry tenantType / propertyNames / leaseStatuses).
    const filterOptions: Record<string, FilterOption[]> = useMemo(() => {
        const propertySet = new Set<string>();
        const tenantTypeSet = new Set<string>();
        const leaseStatusSet = new Set<string>();

        tenants.forEach((t) => {
            if (t.tenantType) tenantTypeSet.add(t.tenantType);
            (t.propertyNames ?? []).forEach((n) => propertySet.add(n));
            (t.leaseStatuses ?? []).forEach((s) => leaseStatusSet.add(s));
        });

        return {
            tenantType: tenantTypeSet.size > 0
                ? Array.from(tenantTypeSet).map(v => ({ value: v, label: v }))
                : [{ value: 'Current', label: 'Current' }, { value: 'Past', label: 'Past' }, { value: 'Pending', label: 'Pending' }],
            propertyUnits: propertySet.size > 0
                ? Array.from(propertySet).map(v => ({ value: v, label: v }))
                : [{ value: '__no_items__', label: 'No properties available' }],
            lease: leaseStatusSet.size > 0
                ? Array.from(leaseStatusSet).map(v => ({ value: v, label: v }))
                : [{ value: '__no_items__', label: 'No lease data available' }],
        };
    }, [tenants]);

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

            // Tenant type filter — match against the derived tenantType.
            const tenantTypeFilters = (filters.tenantType || []).filter(v => v !== '__no_items__');
            const matchesTenantType = tenantTypeFilters.length === 0 ||
                (tenant.tenantType && tenantTypeFilters.includes(tenant.tenantType));

            // Property/Units filter — match against propertyNames on the tenant.
            const propertyFilters = (filters.propertyUnits || []).filter(v => v !== '__no_items__');
            const matchesPropertyUnits = propertyFilters.length === 0 ||
                (tenant.propertyNames ?? []).some((n) => propertyFilters.includes(n));

            // Lease status filter — match against leaseStatuses on the tenant.
            const leaseFilters = (filters.lease || []).filter(v => v !== '__no_items__');
            const matchesLease = leaseFilters.length === 0 ||
                (tenant.leaseStatuses ?? []).some((s) => leaseFilters.includes(s));

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
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Tenants' }
                ]}
                className="mb-6"
            />

            <div className="p-4 sm:p-6 bg-[#E0E5E5] min-h-screen rounded-[1.5rem] sm:rounded-[2rem] flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Tenants</h1>
                    </div>
                    {canEdit && (
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
                    )}
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
                        className="flex items-center gap-1 hover:bg-black/5 px-2 py-1 rounded-lg transition-colors text-sm text-gray-700"
                    >
                        {sortOrder === 'asc' ? <ArrowDownAZ className="w-4 h-4" /> : <ArrowUpAZ className="w-4 h-4" />}
                        Name
                    </button>

                    <div className="bg-[#3A6D6C] text-white px-4 py-1 rounded-full text-sm">
                        {sortedTenants.length} Tenant{sortedTenants.length !== 1 ? 's' : ''}
                    </div>

                    <button
                        onClick={() => { setShowArchived(prev => !prev); setCurrentPage(1); }}
                        className={`px-4 py-1 rounded-full text-sm font-medium border transition-colors ${
                            showArchived
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {showArchived ? 'Showing archived' : 'Show archived'}
                    </button>
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
                                    propertyName={tenant.propertyNames?.length ? tenant.propertyNames.join(', ') : undefined}
                                    readOnly={!canEdit}
                                    isActive={tenant.isActive}
                                    onDeleteSuccess={() => refetch()}
                                    onArchiveSuccess={() => refetch()}
                                    onUnarchive={() => refetch()}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-600">
                                    {showArchived
                                        ? 'No archived tenants'
                                        : searchQuery || Object.keys(filters).some(key => filters[key]?.length > 0)
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
