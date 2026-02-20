import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import DashboardFilter from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import ServiceProCard from './components/ServiceProCard';
import { Plus, ChevronLeft, Loader2, AlertCircle, Check, X } from 'lucide-react';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import { serviceProviderService, type BackendServiceProvider } from '../../../../services/service-provider.service';

interface ServiceProCardData {
    id: string;
    initials: string;
    name: string;
    phone: string;
    category: string;
    bgColor?: string;
    image?: string;
}

const ServicePros = () => {
    const navigate = useNavigate();
    const context = useOutletContext<{ sidebarCollapsed?: boolean }>();
    const sidebarCollapsed = context?.sidebarCollapsed ?? false;
    const [, setFilters] = useState<Record<string, string[]>>({});
    const [servicePros, setServicePros] = useState<ServiceProCardData[]>([]);
    const [pendingProviders, setPendingProviders] = useState<BackendServiceProvider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper function to generate initials from name
    const getInitials = (firstName: string, lastName: string): string => {
        const first = firstName?.charAt(0)?.toUpperCase() || '';
        const last = lastName?.charAt(0)?.toUpperCase() || '';
        return `${first}${last}`;
    };

    // Helper function to format phone number with country code
    const formatPhoneNumber = (phoneNumber: string, phoneCountryCode?: string | null): string => {
        if (phoneCountryCode) {
            return `${phoneCountryCode} ${phoneNumber}`;
        }
        return phoneNumber;
    };

    // Helper function to format category with subcategory
    const formatCategory = (category: string, subcategory?: string | null): string => {
        if (subcategory) {
            return `${category} - ${subcategory}`;
        }
        return category;
    };

    const fetchPending = async () => {
        try {
            const pending = await serviceProviderService.getPending();
            setPendingProviders(pending);
        } catch {
            setPendingProviders([]);
        }
    };

    // Fetch service providers from API
    const fetchServiceProviders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [data, pending] = await Promise.all([
                serviceProviderService.getAll(true),
                serviceProviderService.getPending(),
            ]);
            setPendingProviders(pending);

            // Transform backend data to card format
            const transformedData: ServiceProCardData[] = data.map((provider: BackendServiceProvider) => ({
                id: provider.id,
                initials: getInitials(provider.firstName, provider.lastName),
                name: `${provider.firstName}${provider.middleName ? ` ${provider.middleName}` : ''} ${provider.lastName}`.trim(),
                phone: formatPhoneNumber(provider.phoneNumber, provider.phoneCountryCode),
                category: formatCategory(provider.category, provider.subcategory),
                bgColor: 'bg-[#4ad1a6]',
                image: provider.photoUrl || undefined,
            }));

            setServicePros(transformedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load service providers');
            console.error('Error fetching service providers:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceProviders();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await serviceProviderService.approveSelfRegistered(id);
            await fetchServiceProviders();
            await fetchPending();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to approve');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await serviceProviderService.rejectSelfRegistered(id);
            await fetchPending();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reject');
        }
    };

    const handleSearchChange = (_search: string) => {
        // TODO: Implement search functionality
    };

    const handleFiltersChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters);
        // TODO: Implement filter functionality
    };

    const filterOptions = useMemo(() => ({
        serviceProType: [
            { value: 'individual', label: 'Individual' },
            { value: 'company', label: 'Company' }
        ],
        category: [
            { value: 'cleaning', label: 'Cleaning' },
            { value: 'maintenance', label: 'Maintenance' },
            { value: 'appraisal', label: 'Appraisal' }
        ],
        connection: [
            { value: 'connected', label: 'Connected' },
            { value: 'pending', label: 'Pending' }
        ]
    }), []);

    const filterLabels = useMemo(() => ({
        serviceProType: 'Service Pro type',
        category: 'Category & Sub-category',
        connection: 'Connection'
    }), []);


    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const handleSortToggle = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const sortedServicePros = [...servicePros].sort((a, b) => {
        return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

    const totalPages = Math.ceil(sortedServicePros.length / itemsPerPage);
    const currentServicePros = sortedServicePros.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Service Pros' }
                ]}
                className="mb-6"
            />

            <div className="p-4 sm:p-6 bg-[#E0E5E5] min-h-screen rounded-[1.5rem] sm:rounded-[2rem] flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        {/* Adding Back button like Tenants page */}
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                            Service Pros
                        </h1>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => navigate('/dashboard/contacts/service-pros/import')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors w-full sm:w-auto"
                        >
                            Import
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/contacts/service-pros/add')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            Add service pro
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Pending Registrations */}
                {pendingProviders.length > 0 && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                            <AlertCircle size={20} />
                            Pending Service Provider Registrations ({pendingProviders.length})
                        </h3>
                        <div className="space-y-2">
                            {pendingProviders.map((p) => (
                                <div
                                    key={p.id}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {p.firstName} {p.lastName} – {p.companyName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {p.category}
                                            {p.subcategory ? ` - ${p.subcategory}` : ''} • {p.email}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(p.id)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                                        >
                                            <Check size={16} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(p.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-1"
                                        >
                                            <X size={16} />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                        {isLoading ? 'Loading...' : `${servicePros.length} service pros`}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                        <span className="ml-3 text-gray-600">Loading service providers...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                                <h3 className="text-red-800 font-semibold">Error Loading Service Providers</h3>
                            </div>
                            <p className="text-red-700 text-sm">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Grid */}
                {!isLoading && !error && (
                    <>
                        {currentServicePros.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {currentServicePros.map((pro) => (
                                    <ServiceProCard
                                        key={pro.id}
                                        {...pro}
                                        onDeleteSuccess={fetchServiceProviders}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <p className="text-gray-600 text-lg mb-2">No service providers found</p>
                                    <p className="text-gray-500 text-sm">Get started by adding your first service provider</p>
                                    <button
                                        onClick={() => navigate('/dashboard/contacts/service-pros/add')}
                                        className="mt-4 px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add service pro
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-auto">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages || 1}
                        onPageChange={handlePageChange}
                    />
                </div>

                {/* <AddServiceProModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={(data) => {
                        console.log('New Service Pro:', data);
                        // Handle save logic here
                    }}
                /> */}
            </div>
        </div>
    );
};

export default ServicePros;
