
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Printer } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../../components/DashboardFilter';
import { handleDocumentPrint } from '../utils/printPreviewUtils';
import Breadcrumb from '../../../../../components/ui/Breadcrumb';
import { useGetTemplates } from '../../../../../hooks/useDocumentsQueries';
import type { DocumentTemplate } from '../../../../../services/documents.service';

const LandlordForms: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});

    const { data: templates = [], isLoading } = useGetTemplates({ category: 'LANDLORD_FORM', includeSystem: true });

    const filterOptions: Record<string, FilterOption[]> = useMemo(() => ({}), []);

    const filteredForms = useMemo(() =>
        templates.filter((t: DocumentTemplate) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [templates, searchQuery]
    );

    const handleView = (template: DocumentTemplate) => {
        navigate(`/dashboard/documents/landlord-forms/template/${encodeURIComponent(template.title)}`, {
            state: { templateId: template.id }
        });
    };

    const handlePrint = (template: DocumentTemplate) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `<h1>${template.title}</h1>${template.description ? `<p>${template.description}</p>` : ''}`;
        handleDocumentPrint(tempDiv, { title: template.title });
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            <div className="mb-6">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Landlord forms' }]} />
            </div>

            <div className="p-4 md:p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                <div className="mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Landlord forms</h1>

                    <DashboardFilter
                        filterOptions={filterOptions}
                        onSearchChange={setSearchQuery}
                        onFiltersChange={setFilters}
                        showMoreFilters={false}
                        showClearAll={false}
                    />
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">General forms</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        These forms are general agreements and notices that are not state-specific but are designed to fully meet typical landlord requirements. They provide essential documentation for common landlord-tenant situations while allowing flexibility for additional customization based on specific needs.
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Document templates</h2>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="hidden md:grid bg-[#3A6D6C] text-white px-6 py-4 grid-cols-[2fr_1fr_1fr_0.5fr] gap-4 items-center text-sm font-medium">
                        <div>Template</div>
                        <div>Category</div>
                        <div>State</div>
                        <div className="text-center">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {isLoading ? (
                            <div className="px-6 py-12 text-center text-gray-500">Loading templates...</div>
                        ) : filteredForms.length > 0 ? (
                            filteredForms.map((form: DocumentTemplate) => (
                                <div
                                    key={form.id}
                                    className="px-4 py-4 md:px-6 md:py-4 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_0.5fr] gap-3 md:gap-4 items-start md:items-center hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-full">
                                        <button
                                            style={{ background: 'linear-gradient(90deg, #3A4E33 0%, #85B474 100%)' }}
                                            className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-normal md:whitespace-nowrap text-left w-full md:w-auto"
                                            onClick={() => handleView(form)}
                                        >
                                            {form.title}
                                        </button>
                                    </div>

                                    <div className="flex justify-between md:block">
                                        <span className="md:hidden text-gray-500 text-sm font-medium">Category:</span>
                                        <span className="text-gray-800 text-sm font-medium">{form.category}</span>
                                    </div>

                                    <div className="flex justify-between md:block">
                                        <span className="md:hidden text-gray-500 text-sm font-medium">State:</span>
                                        <span className="text-[#6CBF6C] text-sm font-medium">All States</span>
                                    </div>

                                    <div className="flex items-center justify-end md:justify-center gap-4 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                                        <button
                                            onClick={() => handleView(form)}
                                            className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors p-1"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handlePrint(form)}
                                            className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors p-1"
                                            title="Print"
                                        >
                                            <Printer size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center text-gray-500">
                                No forms found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandlordForms;
