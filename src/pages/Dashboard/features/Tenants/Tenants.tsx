import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import DashboardFilter from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import TenantCard from './components/TenantCard';
import { Plus, ChevronLeft } from 'lucide-react';
import { tenantService, type Tenant } from '../../../../services/tenant.service';



const Tenants = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed = false } = useOutletContext<{ sidebarCollapsed: boolean }>() ?? {};
    const [, setFilters] = useState<Record<string, string[]>>({});

    const handleSearchChange = (_search: string) => {
        // console.log('Search:', search);
    };

    const handleFiltersChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters);
        // console.log('Filters:', newFilters);
    };

    const filterOptions = {
        tenantType: [
            { value: 'active', label: 'Active' },
            { value: 'past', label: 'Past' },
            { value: 'prospective', label: 'Prospective' }
        ],
        propertyUnits: [
            { value: 'unit1', label: 'Unit 1' },
            { value: 'unit2', label: 'Unit 2' }
        ],
        lease: [
            { value: 'active', label: 'Active' },
            { value: 'expired', label: 'Expired' }
        ]
    };

    const filterLabels = {
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const handleSortToggle = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const sortedTenants = [...tenants].sort((a, b) => {
        return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

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
                />

                {/* Stats/Count Section */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handleSortToggle}
                        className="flex items-center gap-1 hover:bg-black/5 px-2 py-1 rounded-lg transition-colors"
                    >

                    </button>

                    <div className="bg-[#3A6D6C] text-white px-4 py-1 rounded-full text-sm">
                        {tenants.length} tenants
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading tenants...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <p className="text-red-600">Error: {error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Tenants Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {currentTenants.length > 0 ? (
                            currentTenants.map((tenant) => (
                                <TenantCard
                                    key={tenant.id}
                                    {...tenant}
                                    image={tenant.image || ''}
                                    propertyName="Sunset Apartments, Unit 4B"
                                    onDeleteSuccess={fetchTenants}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-600">No tenants found</p>
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
