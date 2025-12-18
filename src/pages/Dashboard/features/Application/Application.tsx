import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardFilter from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import ApplicationCard from './components/ApplicationCard';
import { Plus, ChevronLeft } from 'lucide-react';

// Mock Data
const MOCK_APPLICATIONS = [
    {
        id: 1,
        name: 'Anjali Vyas',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        appliedDate: '10-nov-2025',
        status: 'Approved' as const,
    },
    {
        id: 2,
        name: 'Gerey bose',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        appliedDate: '10-nov-2025',
        status: 'Approved' as const,
    },
    {
        id: 3,
        name: 'John Doe',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        appliedDate: '12-nov-2025',
        status: 'Pending' as const,
    },
    {
        id: 4,
        name: 'Sarah Smith',
        image: '',
        appliedDate: '15-nov-2025',
        status: 'Pending' as const,
    }
];

const Application = () => {
    const navigate = useNavigate();
    const [, setFilters] = useState<Record<string, string[]>>({});
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handleSearchChange = (_search: string) => {
        // console.log('Search:', search);
    };

    const handleFiltersChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters);
        // console.log('Filters:', newFilters);
    };

    const filterOptions = {
        status: [
            { value: 'approved', label: 'Approved' },
            { value: 'pending', label: 'Pending' },
            { value: 'rejected', label: 'Rejected' },
        ],
        propertyUnits: [
            { value: 'unit1', label: 'Unit 1' },
            { value: 'unit2', label: 'Unit 2' }
        ],
        screeningStatus: [
            { value: 'completed', label: 'Completed' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'pending', label: 'Pending' }
        ],
        applicationType: [
            { value: 'individual', label: 'Individual' },
            { value: 'cosigner', label: 'Co-signer' }
        ]
    };

    const filterLabels = {
        status: 'Status',
        propertyUnits: 'Property & Units',
        screeningStatus: 'Screening Status',
        applicationType: 'Application Type'
    };

    const handleSortToggle = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const sortedApplications = [...MOCK_APPLICATIONS].sort((a, b) => {
        return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

    const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
    const currentApplications = sortedApplications.slice(
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
                <span className="text-gray-600 text-sm font-semibold">Application</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem] flex flex-col">
                {/* Header */}
                <div className="flex items-center mb-6 gap-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Application</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors">
                            Screen Tenants
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/application/new')} // Check route if needed
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                        >
                            New Application
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
                    showMoreFilters={false}
                />

                {/* Sort and Count */}
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
                        {MOCK_APPLICATIONS.length} Application
                    </div>
                </div>

                {/* Applications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentApplications.length > 0 ? (
                        currentApplications.map((app) => (
                            <ApplicationCard
                                key={app.id}
                                {...app}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-600">No applications found</p>
                        </div>
                    )}
                </div>

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

export default Application;
