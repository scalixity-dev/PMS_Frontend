import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import DashboardFilter from '../../../components/DashboardFilter';
import Breadcrumb from '../../../../../components/ui/Breadcrumb';
import { handleDocumentPrint } from '../utils/printPreviewUtils';

interface Template {
    id: number;
    title: string;
    subtitle: string;
}

const MOCK_TEMPLATES: Template[] = [
    { id: 1, title: 'Best Deals', subtitle: 'Tenants Agreements' },
    { id: 2, title: 'Title', subtitle: 'Tenants Agreements' },
    { id: 3, title: 'Title', subtitle: 'Tenants Agreements' },
];

const MyTemplates: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [templates, setTemplates] = useState<Template[]>(() => {
        const saved = localStorage.getItem('myTemplates');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize with mocks if empty and save to localStorage
        localStorage.setItem('myTemplates', JSON.stringify(MOCK_TEMPLATES));
        return MOCK_TEMPLATES;
    });

    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown component when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedTemplates = templates.filter(t => t.id !== id);
        setTemplates(updatedTemplates);
        localStorage.setItem('myTemplates', JSON.stringify(updatedTemplates));
        setActiveDropdownId(null);
    };

    const handlePrint = (e: React.MouseEvent, templateId: number) => {
        e.stopPropagation();
        // Find the template to get its details
        const template = templates.find(t => t.id === templateId);
        if (template) {
            // Create a temporary div with template content for printing
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = `
                <h1>${template.title}</h1>
                <p>${template.subtitle}</p>
            `;
            handleDocumentPrint(tempDiv, { title: template.title });
        }
        setActiveDropdownId(null);
    };

    const handlePreview = (e: React.MouseEvent, templateId: number) => {
        e.stopPropagation();
        // Navigate to template detail page for preview
        navigate(`/dashboard/documents/my-templates/${templateId}`);
        setActiveDropdownId(null);
    };

    const filteredTemplates = templates.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            {/* Breadcrumb */}
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'My Template' }]} />
            </div>

            <div className="p-4 md:p-6 bg-[#E0E8E7] min-h-screen rounded-2xl md:rounded-[2rem]">
                {/* Header - Matching Leads structure */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:text-gray-600 transition-colors bg-white/50 rounded-full md:bg-transparent md:rounded-none">
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Template</h1>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard/documents/my-templates/create-wizard')}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#3A6D6C] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-all shadow-sm"
                    >
                        Create new Template
                        <Plus className="w-5 h-5 bg-white/20 rounded-full p-0.5" />
                    </button>
                </div>

                {/* Filter Bar */}
                <DashboardFilter
                    filterOptions={{}}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={() => { }}
                    showMoreFilters={false}
                    showClearAll={false}
                />

                {/* Content Container */}
                <div className="bg-[#F0F2F5] rounded-2xl md:rounded-[2rem] p-4 md:p-8 min-h-screen shadow-sm mt-6">
                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                        {filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => navigate(`/dashboard/documents/my-templates/${template.id}`)}
                                className="rounded-2xl p-0 relative group bg-[#7CD9470F] border-2 border-[#E5FFD7] shadow-[inset_0px_-1.42px_5.69px_0px_#E4E3E4,0px_2px_4px_0px_#17151540] cursor-pointer hover:shadow-md transition-shadow"
                            >
                                <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveDropdownId(activeDropdownId === template.id ? null : template.id);
                                        }}
                                        className="bg-[#dbece8] hover:bg-[#cce5df] rounded-full p-1 transition-all shadow-sm border border-[#41B400]/20 flex gap-0.5 items-center justify-center w-8 h-4"
                                    >
                                        <div className="w-1 h-1 bg-[#3D7475] rounded-full"></div>
                                        <div className="w-1 h-1 bg-[#3D7475] rounded-full"></div>
                                        <div className="w-1 h-1 bg-[#3D7475] rounded-full"></div>
                                    </button>

                                    {/* Action Dropdown */}
                                    {activeDropdownId === template.id && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 z-50"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={(e) => handlePrint(e, template.id)}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Print
                                            </button>
                                            <button
                                                onClick={(e) => handlePreview(e, template.id)}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-50"
                                            >
                                                Preview
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(template.id, e)}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-center justify-center h-32 gap-1 p-4 text-center">
                                    <h3 className="text-[#3D7475] text-lg font-bold mb-1 line-clamp-1">{template.title}</h3>
                                    <p className="text-gray-900 text-[11px] font-semibold line-clamp-1">{template.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTemplates;
