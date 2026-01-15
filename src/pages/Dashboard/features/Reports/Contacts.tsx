import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, Download, LayoutTemplate, X, Check, ChevronLeft } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import type { FilterOption } from '../../components/DashboardFilter';

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    company: string;
    address: string;
    email: string;
    phone: string;
    // Additional fields for filters
    category?: string;
    property?: string;
    lease?: string;
    contactType?: string;
}

const ALL_COLUMNS = [
    { id: 'firstName', label: 'First name', width: '1fr', hasSort: true },
    { id: 'lastName', label: 'Last name', width: '1fr', hasSort: true },
    { id: 'company', label: 'Company', width: '1fr', hasSort: true },
    { id: 'address', label: 'Forwarding address', width: '2fr', hasSort: false },
    { id: 'email', label: 'Email', width: '1.5fr', hasSort: false },
    { id: 'phone', label: 'Phone', width: '1.2fr', hasSort: false },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

const Contacts: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

    // Filter State for DashboardFilter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        category: [],
        property: [],
        lease: [],
        contactType: []
    });

    // Mock Data
    const [contacts] = useState<Contact[]>([
        {
            id: '1',
            firstName: 'Ajay',
            lastName: 'Roy',
            company: 'XYZ',
            address: 'Silicon City Main road',
            email: 'xyz@gamil.com',
            phone: '+91 85965 47856',
            category: 'Tenant',
            property: 'Sunset Apartments',
            lease: 'L-101',
            contactType: 'Primary'
        },
        {
            id: '2',
            firstName: 'Sarah',
            lastName: 'Connor',
            company: 'ABC Corp',
            address: '123 Terminator Lane',
            email: 'sarah@example.com',
            phone: '+1 555 0199',
            category: 'Service Pro',
            property: 'Green Valley',
            lease: 'L-202',
            contactType: 'Emergency'
        }
    ]);

    // Filter Options for DashboardFilter
    const filterOptions: Record<string, FilterOption[]> = {
        category: Array.from(new Set(contacts.map(c => c.category).filter(Boolean))).map(cat => ({ value: cat as string, label: cat as string })),
        property: Array.from(new Set(contacts.map(c => c.property).filter(Boolean))).map(prop => ({ value: prop as string, label: prop as string })),
        lease: Array.from(new Set(contacts.map(c => c.lease).filter(Boolean))).map(lease => ({ value: lease as string, label: lease as string })),
        contactType: Array.from(new Set(contacts.map(c => c.contactType).filter(Boolean))).map(type => ({ value: type as string, label: type as string }))
    };

    const filterLabels: Record<string, string> = {
        category: 'Contact Category',
        property: 'Property',
        lease: 'Lease',
        contactType: 'Contact Type'
    };

    const toggleColumn = (columnId: ColumnId) => {
        setVisibleColumns(prev => {
            if (prev.includes(columnId)) {
                return prev.filter(id => id !== columnId);
            } else {
                // Maintain order based on ALL_COLUMNS
                const newSet = new Set([...prev, columnId]);
                return ALL_COLUMNS.filter(col => newSet.has(col.id)).map(col => col.id);
            }
        });
    };

    // Filter Logic
    const filteredContacts = contacts.filter(contact => {
        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                contact.firstName.toLowerCase().includes(query) ||
                contact.lastName.toLowerCase().includes(query) ||
                contact.email.toLowerCase().includes(query) ||
                contact.company.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        // Dropdown Filters
        if (selectedFilters.category.length > 0 && contact.category && !selectedFilters.category.includes(contact.category)) return false;
        if (selectedFilters.property.length > 0 && contact.property && !selectedFilters.property.includes(contact.property)) return false;
        if (selectedFilters.lease.length > 0 && contact.lease && !selectedFilters.lease.includes(contact.lease)) return false;
        if (selectedFilters.contactType.length > 0 && contact.contactType && !selectedFilters.contactType.includes(contact.contactType)) return false;

        return true;
    });

    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const renderCellContent = (contact: Contact, columnId: ColumnId) => {
        switch (columnId) {
            case 'firstName':
                return <span className="text-[#4ad1a6] font-medium">{contact.firstName}</span>;
            case 'company':
                return <span className="text-[#65a30d] font-bold">{contact.company}</span>;
            case 'lastName':
                return <span className="text-gray-900 font-bold">{contact.lastName}</span>;
            case 'email':
            case 'phone':
                return <span className="text-gray-700">{contact[columnId]}</span>;
            case 'address':
                return <span className="text-gray-600">{contact.address}</span>;
            default:
                return contact[columnId as keyof Contact];
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-20">
            {/* Breadcrumb */}
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports', path: '/dashboard/reports' }, { label: 'Contacts' }]} />
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-8 min-h-[calc(100vh-100px)] relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/reports')}
                            className="p-2 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsColumnModalOpen(true)}
                            className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20 flex items-center gap-2"
                        >
                            <LayoutTemplate size={16} />
                            Columns
                        </button>
                        <button className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20 flex items-center gap-2">
                            <Download size={16} />
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-8 max-w-4xl leading-relaxed">
                    The report displays the contact information of tenants and service pros with detailed information for each category, such as a contact list, their email, phone, fax, address, and more. <span className="text-[#3A6D6C] underline cursor-pointer">Learn more</span>
                </p>

                {/* Dashboard Style Filter Bar */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setSelectedFilters}
                    showMoreFilters={false}
                    showClearAll={true}
                    initialFilters={selectedFilters}
                />

                {/* Table Container - Grid Layout */}
                <div>
                    {/* Table Header */}
                    <div className="hidden md:block bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                        <div
                            className="text-white px-6 py-4 grid gap-4 items-center text-sm font-medium"
                            style={{ gridTemplateColumns }}
                        >
                            {activeColumns.map(col => (
                                <div key={col.id} className={col.hasSort ? "flex items-center gap-1 cursor-pointer" : ""}>
                                    {col.label}
                                    {col.hasSort && <ChevronUp className="w-3 h-3" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t-none">
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map(contact => (
                                <div
                                    key={contact.id}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* Desktop View */}
                                    <div
                                        className="hidden md:grid px-6 py-4 gap-4 items-center"
                                        style={{ gridTemplateColumns }}
                                    >
                                        {activeColumns.map(col => (
                                            <div key={col.id} className="text-sm">
                                                {renderCellContent(contact, col.id)}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mobile View */}
                                    <div className="md:hidden p-4 space-y-3">
                                        {activeColumns.map(col => (
                                            <div key={col.id} className="flex justify-between items-start gap-4">
                                                <span className="text-gray-500 text-xs font-medium uppercase mt-1">{col.label}</span>
                                                <div className="text-sm text-right flex-1">
                                                    {renderCellContent(contact, col.id)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">No records found matching your filters.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Column Selection Modal */}
            {isColumnModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-72 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#3A6D6C]">
                            <h3 className="font-semibold text-white">Show Columns</h3>
                            <button onClick={() => setIsColumnModalOpen(false)} className="text-white hover:text-white/50">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-2 max-h-[60vh] overflow-y-auto">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 p-2">Select the columns you want to be displayed on your report.</h4>
                            {ALL_COLUMNS.map(col => (
                                <label key={col.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${visibleColumns.includes(col.id) ? 'bg-[#3A6D6C] border-[#3A6D6C]' : 'border-gray-300'}`}>
                                        {visibleColumns.includes(col.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={visibleColumns.includes(col.id)}
                                        onChange={() => toggleColumn(col.id)}
                                    />
                                    <span className="text-sm text-gray-700">{col.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;
