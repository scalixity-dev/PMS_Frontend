
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Printer } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../../components/DashboardFilter';
import { handleDocumentPrint } from '../utils/printPreviewUtils';

// Mock data for forms
const MOCK_FORMS = [
    // Notices (Informational)
    {
        id: 1,
        template: '24-Hour Notice to Enter',
        type: 'Notice',
        state: 'All State',
        property: 'Property 1'
    },
    {
        id: 2,
        template: 'Inspection Checklist Addendum',
        type: 'Notice',
        state: 'All State',
        property: 'Property 1'
    },
    {
        id: 3,
        template: 'Notice of Rent Increase',
        type: 'Notice',
        state: 'All State',
        property: 'Property 3'
    },
    {
        id: 4,
        template: 'Security Deposit Receipt',
        type: 'Notice',
        state: 'All State',
        property: 'Property 2'
    },
    {
        id: 5,
        template: 'Welcome Letter',
        type: 'Notice',
        state: 'All State',
        property: 'Property 1'
    },
    // Agreements & Addendums (Contractual)
    {
        id: 6,
        template: 'Basic Residential Lease Agreement',
        type: 'Agreement',
        state: 'All State',
        property: 'Property 2'
    },
    {
        id: 7,
        template: 'Lease Agreement',
        type: 'Agreement',
        state: 'All State',
        property: 'Property 2'
    },
    {
        id: 8,
        template: 'Lead-Based Paint Disclosure',
        type: 'Agreement',
        state: 'All State',
        property: 'Property 3'
    },
    {
        id: 9,
        template: 'Pet Addendum to Rental Agreement',
        type: 'Agreement',
        state: 'All State',
        property: 'Property 2'
    },
    {
        id: 10,
        template: 'Rules Addendum',
        type: 'Agreement',
        state: 'All State',
        property: 'Property 1'
    },
    {
        id: 11,
        template: 'Smoke-Free Addendum',
        type: 'Agreement',
        state: 'All State',
        property: 'Property 3'
    }
];

const MOCK_PROPERTIES = ['Property 1', 'Property 2', 'Property 3'];

const LandlordForms: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({
        property: []
    });

    const filterOptions: Record<string, FilterOption[]> = {
        property: MOCK_PROPERTIES.map(p => ({ value: p, label: p }))
    };

    const filteredForms = MOCK_FORMS.filter(form => {
        const matchesSearch = form.template.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesProperty = filters.property.length === 0 || filters.property.includes(form.property || '');
        return matchesSearch && matchesProperty;
    });

    const handleView = (id: number) => {
        // Find the form by id and navigate to template view
        const form = MOCK_FORMS.find(f => f.id === id);
        if (form) {
            navigate(`/dashboard/documents/landlord-forms/template/${encodeURIComponent(form.template)}`);
        }
    };

    const handlePrint = (id: number) => {
        // Find the form by id and print it
        const form = MOCK_FORMS.find(f => f.id === id);
        if (form) {
            // Create a temporary div with form content for printing
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = `
                <h1>${form.template}</h1>
                <p><strong>Type:</strong> ${form.type}</p>
                <p><strong>State:</strong> ${form.state}</p>
            `;
            handleDocumentPrint(tempDiv, { title: form.template });
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>
                    Dashboard
                </span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Landlord forms</span>
            </div>

            <div className="p-4 md:p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                {/* Header */}
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

                {/* General forms section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">General forms</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        These forms are general agreements and notices that are not state-specific but are designed to fully meet typical landlord requirements. They provide essential documentation for common landlord-tenant situations while allowing flexibility for additional customization based on specific needs.
                    </p>
                </div>

                {/* Related request section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Related request</h2>
                </div>

                {/* Forms Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Table Header */}
                    {/* Table Header - Hidden on Mobile */}
                    <div className="hidden md:grid bg-[#3A6D6C] text-white px-6 py-4 grid-cols-[2fr_1fr_1fr_0.5fr] gap-4 items-center text-sm font-medium">
                        <div>Template</div>
                        <div>Type</div>
                        <div>State</div>
                        <div className="text-center">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                        {filteredForms.length > 0 ? (
                            filteredForms.map((form) => (
                                <div
                                    key={form.id}
                                    className="px-4 py-4 md:px-6 md:py-4 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_0.5fr] gap-3 md:gap-4 items-start md:items-center hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-full">
                                        <button
                                            style={{ background: 'linear-gradient(90deg, #3A4E33 0%, #85B474 100%)' }}
                                            className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-normal md:whitespace-nowrap text-left w-full md:w-auto"
                                        >
                                            {form.template}
                                        </button>
                                    </div>

                                    <div className="flex justify-between md:block">
                                        <span className="md:hidden text-gray-500 text-sm font-medium">Type:</span>
                                        <span className="text-gray-800 text-sm font-medium">{form.type}</span>
                                    </div>

                                    <div className="flex justify-between md:block">
                                        <span className="md:hidden text-gray-500 text-sm font-medium">State:</span>
                                        <span className="text-[#6CBF6C] text-sm font-medium">{form.state}</span>
                                    </div>

                                    <div className="flex items-center justify-end md:justify-center gap-4 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                                        <button
                                            onClick={() => handleView(form.id)}
                                            className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors p-1"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handlePrint(form.id)}
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

