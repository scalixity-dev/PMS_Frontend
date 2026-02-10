import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { List, Grid3X3, LogIn, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';
import DashboardButton from '../../../components/DashboardButton';
import ContactCard from './components/ContactCard';

// Enhanced mock data for pagination
const mockContacts = Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 1}`,
    name: i < 4
        ? ['Siddak Bagga', 'Aneka Bagga', 'John Doe', 'Jane Smith'][i]
        : `Contact Person ${i + 1}`,
    phone: i < 4
        ? ['+1 (888) 888 8888', '+1 (888) 888 8888', '+1 (123) 456 7890', '+1 (098) 765 4321'][i]
        : `+1 (555) 000 ${String(i + 1).padStart(4, '0')}`
}));

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const ITEMS_PER_PAGE = 10;

const ServiceContacts: React.FC = () => {
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination Logic
    const totalPages = Math.ceil(mockContacts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentContacts = mockContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className={`flex flex-col gap-4 sm:gap-6 mx-auto min-h-screen pb-20 transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            {/* Breadcrumb */}
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Contacts', active: true }
                ]}
            />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact</h1>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    {/* View Mode Toggle */}
                    <button
                        onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
                    >
                        {viewMode === 'grid' ? (
                            <List className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                        ) : (
                            <Grid3X3 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                        )}
                    </button>
                    <DashboardButton
                        bgColor="white"
                        className="text-gray-900 border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base px-3 sm:px-4 py-2"
                    >
                        <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180" />
                        <span>Import</span>
                    </DashboardButton>
                    <DashboardButton
                        bgColor="#7CD947"
                        className="text-white flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base px-3 sm:px-4 py-2"
                    >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="whitespace-nowrap">Add Contact</span>
                    </DashboardButton>
                </div>
            </div>

            {/* Contacts Grid/List */}
            <div className={viewMode === 'grid'
                ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                : "flex flex-col gap-3 sm:gap-4"
            }>
                {currentContacts.map((contact) => (
                    <ContactCard
                        key={contact.id}
                        name={contact.name}
                        phone={contact.phone}
                        viewMode={viewMode}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                    ? 'bg-[#7CD947] text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ServiceContacts;

