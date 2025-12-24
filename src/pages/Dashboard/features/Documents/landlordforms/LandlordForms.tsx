
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Printer } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../../components/DashboardFilter';

// Mock data for forms
const MOCK_FORMS = [
    {
        id: 1,
        template: '24-Hour Notice to Enter',
        type: 'Tenant Notice',
        state: 'All State',
        property: 'Property 1' // Added for filtering demonstration
    },
    {
        id: 2,
        template: 'Basic Residential Lease Agreement',
        type: 'Tenant Notice',
        state: 'All State',
        property: 'Property 2' // Added for filtering demonstration
    },
    {
        id: 3,
        template: 'Inspection Checklist Addendum',
        type: 'Tenant Notice',
        state: 'All State',
        property: 'Property 1' // Added for filtering demonstration
    },
    {
        id: 4,
        template: 'Lead-Based Paint Disclosure',
        type: 'Tenant Notice',
        state: 'All State',
        property: 'Property 3' // Added for filtering demonstration
    },
    {
        id: 5,
        template: 'Lease Agreement',
        type: 'Tenant Notice',
        state: 'All State',
        property: 'Property 2' // Added for filtering demonstration
    },
    {
        id: 6,
        template: 'Lead-Based Paint Disclosure',
        type: 'Tenant Notice',
        state: 'All State',
        property: 'Property 1' // Added for filtering demonstration
    },
    {
        id: 7,
        template: 'Notice of Rent Increase',
        type: 'Tenant Notice',
        state: 'All State',
        property: 'Property 3' // Added for filtering demonstration
    },
    {
        id: 8,
        template: 'Pet Addendum to Rental Agreement',
        type: 'Tenant Notice',
        state: 'All State',
        property: 'Property 2' // Added for filtering demonstration
    },
    {
        id: 9,
        template: 'Rules Addendum',
        type: 'Tenant Notice',
        state: 'All State',
        property: 'Property 1' // Added for filtering demonstration
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
            navigate(`/documents/landlord-forms/template/${encodeURIComponent(form.template)}`);
        }
    };

    const handlePrint = (id: number) => {
        // Handle print action
        console.log('Print form:', id);
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

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Landlord forms</h1>

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
                    <div className="bg-[#3A6D6C] text-white px-6 py-4 grid grid-cols-[2fr_1fr_1fr_0.5fr] gap-4 items-center text-sm font-medium">
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
                                    className="px-6 py-4 grid grid-cols-[2fr_1fr_1fr_0.5fr] gap-4 items-center hover:bg-gray-50 transition-colors"
                                >
                                    <div>
                                        <button
                                            style={{ background: 'linear-gradient(90deg, #3A4E33 0%, #85B474 100%)' }}
                                            className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                                        >
                                            {form.template}
                                        </button>
                                    </div>
                                    <div className="text-gray-800 text-sm font-medium">{form.type}</div>
                                    <div className="text-[#6CBF6C] text-sm font-medium">{form.state}</div>
                                    <div className="flex items-center justify-center gap-4">
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

