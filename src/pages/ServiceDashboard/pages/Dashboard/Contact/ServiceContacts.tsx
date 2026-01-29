import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { List, LogIn, Plus } from 'lucide-react';
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';
import DashboardButton from '../../../components/DashboardButton';
import ContactCard from './components/ContactCard';

const mockContacts = [
    { id: '1', name: 'Siddak Bagga', phone: '+1 (888) 888 8888' },
    { id: '2', name: 'Aneka Bagga', phone: '+1 (888) 888 8888' },
    { id: '3', name: 'John Doe', phone: '+1 (123) 456 7890' },
    { id: '4', name: 'Jane Smith', phone: '+1 (098) 765 4321' },
];

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const ServiceContacts: React.FC = () => {
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };

    return (
        <div className={`flex flex-col gap-6 mx-auto min-h-screen pb-20 transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            {/* Breadcrumb */}
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Contacts', active: true }
                ]}
            />

            {/* Header Section */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <List className="w-6 h-6 text-gray-700" />
                    </button>
                    <DashboardButton
                        bgColor="white"
                        className="text-gray-900 border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <LogIn className="w-4 h-4 rotate-180" />
                        <span>Import</span>
                    </DashboardButton>
                    <DashboardButton
                        bgColor="#7CD947"
                        className="text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Contact</span>
                    </DashboardButton>
                </div>
            </div>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockContacts.map((contact) => (
                    <ContactCard
                        key={contact.id}
                        name={contact.name}
                        phone={contact.phone}
                    />
                ))}
            </div>
        </div>
    );
};

export default ServiceContacts;
