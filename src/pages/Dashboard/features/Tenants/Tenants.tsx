import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardFilter from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import TenantCard from './components/TenantCard';
import { Plus, ChevronLeft } from 'lucide-react';

const Tenants = () => {
    const navigate = useNavigate();
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

    const tenants = [
        {
            id: 1,
            name: 'Anjali Vyas',
            phone: '+91 8569325417',
            email: 'Anjli57474@gmail.com',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            id: 2,
            name: 'Sam Curren',
            phone: '+91 8569325417',
            email: 'Currensam@gmail.com',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            id: 3,
            name: 'Herry Gurney',
            phone: '+91 8569325417',
            email: 'Herrygurnwe@gmail.com',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            id: 4,
            name: 'James Fos',
            phone: '+91 8569325417',
            email: 'Jamesfos@gmail.com',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
        }
    ];

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
        <div className="max-w-6xl mx-auto min-h-screen font-outfit">
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Contacts</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Tenants</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
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
                        <button className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2">
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
                        <span className="text-lg font-bold text-black">Abc</span>
                        <svg
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                        >
                            <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="bg-[#3A6D6C] text-white px-4 py-1 rounded-full text-sm">
                        {tenants.length} tenants
                    </div>
                </div>

                {/* Tenants Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentTenants.map((tenant) => (
                        <TenantCard
                            key={tenant.id}
                            {...tenant}
                        />
                    ))}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages || 1}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default Tenants;
