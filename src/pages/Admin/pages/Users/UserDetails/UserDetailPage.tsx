import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UserHeader from './components/UserHeader';
import TenantProfile from './components/TenantProfile';
import PMProfile from './components/PMProfile';
import ServiceProProfile from './components/ServiceProProfile';

const UserDetailPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    // Mock User Lookup (In real app, fetch from API)
    // Using ID to deterministically show different roles for demo purposes
    // ID 1,4,5 = Tenant
    // ID 2,6 = PM
    // ID 3,7 = Service Pro

    // Default fallback to Tenant if ID finding fails for demo

    // Simple logic to mock data based on ID pattern or passed state
    // We will just hardcode a few known IDs from UsersPage mock data

    const mockDB: Record<string, any> = {
        '1': { name: 'Alice Johnson', role: 'Tenant', email: 'alice@example.com', status: 'Active', phone: '(555) 123-4567', joinedDate: '2023-10-15' },
        '2': { name: 'Bob Smith', role: 'Property Manager', email: 'bob.pm@example.com', status: 'Active', phone: '(555) 987-6543', joinedDate: '2023-09-20' },
        '3': { name: 'Charlie Brown', role: 'Service Pro', email: 'charlie.electric@example.com', status: 'Active', phone: '(555) 456-7890', joinedDate: '2023-11-05' },
    };

    const user = mockDB[userId || '1'] || {
        name: 'Demo User',
        role: 'Tenant',
        email: 'demo@example.com',
        status: 'Active',
        phone: '(555) 000-0000',
        joinedDate: '2024-01-01'
    };

    const renderRoleContent = () => {
        switch (user.role) {
            case 'Tenant': return <TenantProfile />;
            case 'Property Manager': return <PMProfile />;
            case 'Service Pro': return <ServiceProProfile />;
            default: return <TenantProfile />;
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Back Navigation */}
            <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Users
            </button>

            {/* Common Header */}
            <UserHeader user={user} hideProfileActions={true} />

            {/* Role Specific Content */}
            {renderRoleContent()}
        </div>
    );
};

export default UserDetailPage;
