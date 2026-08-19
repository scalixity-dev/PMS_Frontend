import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Settings, X } from 'lucide-react';
import Breadcrumb from '../../../../components/ui/Breadcrumb';

const SETTINGS_KEY = 'reports_hidden';

function getHiddenReports(): string[] {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '[]'); } catch { return []; }
}
function saveHiddenReports(hidden: string[]) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(hidden));
}

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
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [hiddenReports, setHiddenReports] = useState<string[]>(getHiddenReports);

    const toggleReportVisibility = (title: string) => {
        setHiddenReports(prev => {
            const next = prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title];
            saveHiddenReports(next);
            return next;
        });
    };

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

    const reportSections = useMemo(() => [
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
    ], []);

    const filteredSections = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return reportSections
            .map(section => ({
                ...section,
                items: section.items.filter(item => {
                    if (hiddenReports.includes(item.title)) return false;
                    if (q && !item.title.toLowerCase().includes(q)) return false;
                    return true;
                }),
            }))
            .filter(section => section.items.length > 0);
    }, [searchQuery, hiddenReports, reportSections]);

    const toggleSection = (_id: string) => {};

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports' }]} />
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="px-5 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Settings size={15} />
                        Settings
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-[#3A6D6C] rounded-full p-2 mb-8 shadow-md">
                    <div className="bg-white rounded-full flex items-center px-4 py-2 w-full">
                        <input
                            type="text"
                            placeholder="Search Here..."
                            className="bg-transparent border-none outline-none text-sm text-gray-700 flex-1 placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {/* Search runs live from the input's onChange, so this icon was a button that did nothing. Kept as markup in case it comes back as a non-clickable affordance.
                        <button className="bg-[#3A6D6C] rounded-full p-1.5 text-white hover:bg-[#2c5251] transition-colors">
                            <Search size={14} />
                        </button>
                        */}
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {filteredSections.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            No reports found matching &ldquo;{searchQuery}&rdquo;
                        </div>
                    )}
                    {filteredSections.map((section) => (
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

        {/* Settings Modal */}
        {isSettingsOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 bg-[#3A6D6C]">
                        <h2 className="text-white font-semibold text-lg">Report Settings</h2>
                        <button onClick={() => setIsSettingsOpen(false)} className="text-white hover:text-white/60 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                        <p className="text-sm text-gray-500 mb-4">Toggle which reports appear on this page.</p>
                        {reportSections.map(section => (
                            <div key={section.id} className="mb-5">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{section.title}</p>
                                <div className="space-y-2">
                                    {section.items.map(item => {
                                        const isVisible = !hiddenReports.includes(item.title);
                                        return (
                                            <label key={item.title} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                                                <span className="text-sm text-gray-700 font-medium">{item.title}</span>
                                                <button
                                                    onClick={() => toggleReportVisibility(item.title)}
                                                    className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isVisible ? 'bg-[#3A6D6C]' : 'bg-gray-300'}`}
                                                >
                                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${isVisible ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                        <button
                            onClick={() => { setHiddenReports([]); saveHiddenReports([]); }}
                            className="text-sm text-[#3A6D6C] hover:underline"
                        >
                            Show all
                        </button>
                        <button
                            onClick={() => setIsSettingsOpen(false)}
                            className="px-5 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
};

export default Reports;
