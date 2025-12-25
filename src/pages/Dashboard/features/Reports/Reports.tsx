import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';

interface ReportCardProps {
    title: string;
    category: string;
    onClick?: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, category, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-[#D9E4DA] rounded-3xl border-[4px] border-[#E5FFD7] p-6 relative flex flex-col items-center justify-center text-center shadow-sm border border-white/50 hover:shadow-md transition-shadow min-h-[140px] ${onClick ? 'cursor-pointer hover:bg-[#cde0ce]' : ''}`}
        >
            <h3 className="text-[#3A6D6C] font-bold text-lg mb-1">{title}</h3>
            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">{category}</span>
        </div>
    );
};

const Reports: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleCardClick = (title: string) => {
        if (title === 'Rentability') {
            navigate('/dashboard/reports/rentability');
        } else if (title === 'Provider Statement') {
            navigate('/dashboard/reports/statement');
        } else if (title === 'Contacts') {
            navigate('/dashboard/reports/contacts');
        } else if (title === 'Maintenance Requests') {
            navigate('/dashboard/reports/maintenance-requests');
        } else if (title === 'Rent Roll') {
            navigate('/dashboard/reports/rent-roll');
        } else if (title === 'Renters Insurance') {
            navigate('/dashboard/reports/renters-insurance');
        } else if (title === 'Tenant Statement') {
            navigate('/dashboard/reports/tenant-statement');
        } else if (title === 'Vacant Rentals') {
            navigate('/dashboard/reports/vacant-rentals');
        } else if (title === 'General Expenses') {
            navigate('/dashboard/reports/general-expenses');
        } else if (title === 'General Income') {
            navigate('/dashboard/reports/general-income');
        } else if (title === 'Property Expenses') {
            navigate('/dashboard/reports/property-expenses');
        } else if (title === 'Property Statement') {
            navigate('/dashboard/reports/property-statement');
        }
    };

    const reportSections = [
        {
            id: 'reports',
            title: 'Reports', // Renamed from Luxury Property
            description: 'These reports provide key insights and data about the performance and status of rental properties, occupancy rates, rental income, lease details, maintenance and repair costs and are essential to make informed decisions.',
            items: [
                { title: 'Rentability', category: 'Rental' },
                { title: 'Provider Statement', category: 'Rental' },
                { title: 'Contacts', category: 'Rental' },
                { title: 'Maintenance Requests', category: 'Rental' },
                { title: 'Rent Roll', category: 'Rental' },
                { title: 'Renters Insurance', category: 'Rental' },
                { title: 'Tenant Statement', category: 'Rental' },
                { title: 'Vacant Rentals', category: 'Rental' },
            ]
        },
        {
            id: 'financial',
            title: 'Financial',
            description: 'These reports provide a comprehensive overview of the financial health, operational efficiency, and market position of rental properties, helping landlords make data-driven decisions.',
            items: [
                { title: 'General Expenses', category: 'Financial' },
                { title: 'General Income', category: 'Financial' },
                { title: 'Property Statement', category: 'Financial' },
                { title: 'Property Expenses', category: 'Financial' },
            ]
        }
    ];

    const toggleSection = (id: string) => {
        // Placeholder for collapse logic if needed
        console.log('Toggle section', id);
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Reports</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
                    <button className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20">
                        Settings
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-[#3A6D6C] rounded-full p-2 mb-8 shadow-md">
                    <div className="bg-white rounded-full flex items-center px-4 py-2 w-full max-w-sm">
                        <input
                            type="text"
                            placeholder="Search Here..."
                            className="bg-transparent border-none outline-none text-sm text-gray-700 flex-1 placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="bg-[#3A6D6C] rounded-full p-1.5 text-white hover:bg-[#2c5251] transition-colors">
                            <Search size={14} />
                        </button>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {reportSections.map((section) => (
                        <div key={section.id}>
                            {/* Section Header */}
                            <div className="mb-4 flex items-center">
                                <button
                                    className="bg-[#3A6D6C] rounded-full pl-4 pr-2 py-2 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-[#2c5251] transition-colors"
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <span className="text-white font-semibold text-sm">{section.title}</span>
                                    <div className="bg-[#82D64D] rounded-full w-6 h-6 flex items-center justify-center transition-transform hover:scale-110">
                                        <ChevronDown className="text-white w-4 h-4" />
                                    </div>
                                </button>
                            </div>

                            {/* Section Content Container */}
                            <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[2rem] p-4 shadow-sm border border-white/50">
                                {/* Description Banner */}
                                <div className="bg-[#3A6D6C] rounded-xl p-2 mb-6 text-white text-sm leading-relaxed opacity-90">
                                    {section.description}
                                </div>

                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {section.items.map((item, index) => (
                                        <ReportCard
                                            key={index}
                                            title={item.title}
                                            category={item.category}
                                            onClick={() => handleCardClick(item.title)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;
