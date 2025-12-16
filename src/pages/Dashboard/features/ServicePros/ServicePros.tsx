import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardFilter from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination'; // Uncommented
import ServiceProCard from './components/ServiceProCard';
// import AddServiceProModal from './components/AddServiceProModal';
import { Plus, ChevronLeft } from 'lucide-react';

const ServicePros = () => {
    const navigate = useNavigate();
    const [, setFilters] = useState<Record<string, string[]>>({});

    const handleSearchChange = (_search: string) => {
        // console.log('Search:', search);
    };

    const handleFiltersChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters);
    };

    const filterOptions = {
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
    };

    const filterLabels = {
        serviceProType: 'Service Pro type',
        category: 'Category & Sub-category',
        connection: 'Connection'
    };

    const servicePros = [
        {
            id: 1,
            initials: 'SR',
            name: 'sam rao',
            phone: '+91 78965 41236',
            category: 'Commercial Cleaning Services',
            bgColor: 'bg-[#4ad1a6]',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            id: 2,
            initials: 'VR',
            name: 'vijay rfgdd',
            phone: '+91 70326 59874',
            category: 'Appraiser',
            bgColor: 'bg-[#4ad1a6]',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            id: 3,
            initials: 'AB',
            name: 'Alex Brown',
            phone: '+1 555 123 4567',
            category: 'Plumbing Services',
            bgColor: 'bg-[#4ad1a6]',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            id: 4,
            initials: 'JD',
            name: 'John Doe',
            phone: '+1 555 987 6543',
            category: 'Electrical Services',
            bgColor: 'bg-[#4ad1a6]',
            image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200&h=200'
        }
    ];

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
        <div className="max-w-6xl mx-auto min-h-screen font-outfit">
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Service Pros</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        {/* Adding Back button like Tenants page */}
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                            Service Pros
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors">
                            Import
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/contacts/service-pros/add')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                        >
                            Add service pro
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
                        {servicePros.length} service pros
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentServicePros.map((pro) => (
                        <ServiceProCard
                            key={pro.id}
                            {...pro}
                        />
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages || 1}
                    onPageChange={handlePageChange}
                />

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
