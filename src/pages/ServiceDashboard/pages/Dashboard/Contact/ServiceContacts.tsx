import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { List, Grid3X3, LogIn, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';
import DashboardButton from '../../../components/DashboardButton';
import ContactCard from './components/ContactCard';

interface Contact {
    id: string;
    name: string;
    phone: string;
}

const initialContacts: Contact[] = [];

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const ITEMS_PER_PAGE = 10;

const ServiceContacts: React.FC = () => {
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [contacts, setContacts] = useState<Contact[]>(() => {
        try {
            const saved = localStorage.getItem('service-pro-contacts');
            return saved ? JSON.parse(saved) : initialContacts;
        } catch {
            return initialContacts;
        }
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [form, setForm] = useState({ name: '', phone: '' });

    const persist = (next: Contact[]) => {
        setContacts(next);
        try { localStorage.setItem('service-pro-contacts', JSON.stringify(next)); } catch { /* ignore storage failures */ }
    };

    const openAdd = () => { setEditingContact(null); setForm({ name: '', phone: '' }); setIsModalOpen(true); };
    const openEdit = (c: Contact) => { setEditingContact(c); setForm({ name: c.name, phone: c.phone }); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingContact(null); };

    const handleSave = () => {
        if (!form.name.trim() || !form.phone.trim()) {
            alert('Name and phone required');
            return;
        }
        if (editingContact) {
            persist(contacts.map((c) => c.id === editingContact.id ? { ...c, name: form.name.trim(), phone: form.phone.trim() } : c));
        } else {
            persist([...contacts, { id: Date.now().toString(), name: form.name.trim(), phone: form.phone.trim() }]);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('Delete this contact?')) return;
        persist(contacts.filter((c) => c.id !== id));
    };

    // Pagination
    const totalPages = Math.max(1, Math.ceil(contacts.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentContacts = contacts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
                        onClick={openAdd}
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
                {currentContacts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 text-sm">
                        No contacts yet. Click "Add Contact" to create one.
                    </div>
                ) : currentContacts.map((contact) => (
                    <ContactCard
                        key={contact.id}
                        name={contact.name}
                        phone={contact.phone}
                        viewMode={viewMode}
                        onEdit={() => openEdit(contact)}
                        onDelete={() => handleDelete(contact.id)}
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">{editingContact ? 'Edit Contact' : 'Add Contact'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Contact name"
                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="+91 9876543210"
                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947]"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 px-6 pb-6">
                            <button onClick={closeModal} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200">Cancel</button>
                            <button onClick={handleSave} className="flex-1 bg-[#7CD947] text-white py-2.5 rounded-lg font-semibold hover:bg-[#6bc13d]">{editingContact ? 'Save' : 'Add'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceContacts;

