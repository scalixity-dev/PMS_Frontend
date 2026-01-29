import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceBreadCrumb from '../../../../components/ServiceBreadCrumb';
import ServiceTabs from '../../../../components/ServiceTabs';
import DashboardButton from '../../../../components/DashboardButton';

interface LoginSession {
    location: string;
    device: string;
    ipAddress: string;
    lastActivity: string;
}

const mockSessions: LoginSession[] = [
    {
        location: "New York, USA",
        device: "iPhone 13 Pro",
        ipAddress: "192.168.1.100",
        lastActivity: "2 hours ago",
    },
    {
        location: "San Francisco, USA",
        device: "MacBook Pro",
        ipAddress: "10.0.0.45",
        lastActivity: "1 day ago",
    },
    {
        location: "London, UK",
        device: "Windows PC",
        ipAddress: "172.16.0.25",
        lastActivity: "3 days ago",
    },
];

const SecuritySettings = () => {
    const navigate = useNavigate();

    // -- State --
    const [activeTab, setActiveTab] = useState('security');

    // -- Handlers --
    const handleTabChange = (val: string) => {
        setActiveTab(val);
        if (val === 'profile') navigate('/service-dashboard/settings/profile');
        if (val === 'integrations') navigate('/service-dashboard/settings/integrations');
        if (val === 'notifications') navigate('/service-dashboard/settings/notifications');
    };

    return (
        <div className="min-h-screen font-sans w-full max-w-full overflow-x-hidden">
            <div className="w-full">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <ServiceBreadCrumb
                        items={[
                            { label: 'Dashboard', to: '/service-dashboard' },
                            { label: 'Settings', to: '/service-dashboard/settings' },
                            { label: 'Security', active: true }
                        ]}
                    />
                </div>

                {/* Main Content Card */}
                <div className="bg-[#F6F6F6] rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-800">Account settings</h1>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-4 sm:px-6 pt-2">
                        <ServiceTabs
                            tabs={[
                                { label: 'Profile', value: 'profile' },
                                { label: 'Security', value: 'security' },
                                { label: 'Integrations', value: 'integrations' },
                                { label: 'Notifications', value: 'notifications' }
                            ]}
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            className="border-none"
                        />
                    </div>

                    <div className="p-4 sm:p-8 space-y-8 sm:space-y-10">
                        {/* ID Verification Section */}
                        <section className="border border-[#E8E8E8] rounded-2xl bg-white shadow-lg px-4 sm:px-6 py-5">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-lg font-bold text-gray-900">ID Verification</h2>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#7CD947] bg-[#F0FAE8] border border-[#D7F0C2]">
                                            In progress
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Identity verification is required to prevent fraud and increase security. TenantCloud works with Stripe
                                        to conduct identity verification online.
                                    </p>
                                    <a href="#" className="text-xs font-medium text-[#1E88E5] hover:underline inline-block">
                                        Learn more
                                    </a>
                                </div>
                                <DashboardButton
                                    onClick={() => { }}
                                    className="h-10 text-xs font-bold px-6"
                                >
                                    Continue
                                </DashboardButton>
                            </div>
                        </section>

                        {/* Export Data Section */}
                        <section className="border border-[#E8E8E8] rounded-2xl bg-white shadow-lg px-4 sm:px-6 py-5">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <h2 className="text-lg font-bold text-gray-900">Export Data</h2>
                                    <p className="text-xs text-gray-600">
                                        Identity verification is required to prevent fraud and increase security. TenantCloud works with Stripe
                                        to conduct identity verification online.
                                    </p>
                                    <a href="#" className="text-xs font-medium text-[#1E88E5] hover:underline inline-block">
                                        Learn more
                                    </a>
                                </div>
                                <DashboardButton
                                    onClick={() => { }}
                                    className="h-10 text-xs font-bold px-6"
                                >
                                    Export
                                </DashboardButton>
                            </div>
                        </section>

                        {/* Two Steps Authentication Section */}
                        <section className="border border-[#E8E8E8] rounded-2xl bg-white shadow-lg px-4 sm:px-6 py-5">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <h2 className="text-lg font-bold text-gray-900">Two Steps Authentication</h2>
                                    <p className="text-xs text-gray-600">
                                        Identity verification is required to prevent fraud and increase security. TenantCloud works with Stripe
                                        to conduct identity verification online.
                                    </p>
                                    <a href="#" className="text-xs font-medium text-[#1E88E5] hover:underline inline-block">
                                        Learn more
                                    </a>
                                </div>
                                <DashboardButton
                                    onClick={() => { }}
                                    className="h-10 text-xs font-bold px-6"
                                >
                                    Enable
                                </DashboardButton>
                            </div>
                        </section>

                        {/* Login Sessions Section */}
                        <section className="border border-[#E8E8E8] rounded-2xl bg-white shadow-lg px-4 sm:px-6 py-5 space-y-6">
                            <h2 className="text-lg font-bold text-gray-900">Login sessions</h2>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto rounded-xl border border-[#E8E8E8] overflow-hidden">
                                <table className="w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr style={{ backgroundColor: "#7BD747" }}>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Location</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Device</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">IP Address</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Last Activity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {mockSessions.map((session, index) => (
                                            <tr key={index} className="group">
                                                <td className="px-4 py-4 text-sm text-gray-600 border-b border-[#E8E8E8] group-last:border-0 group-last:rounded-bl-xl">{session.location}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600 border-b border-[#E8E8E8] group-last:border-0">{session.device}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600 border-b border-[#E8E8E8] group-last:border-0">{session.ipAddress}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600 border-b border-[#E8E8E8] group-last:border-0 group-last:rounded-br-xl">{session.lastActivity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile/Tablet Card View */}
                            <div className="lg:hidden space-y-4">
                                {mockSessions.map((session, index) => (
                                    <div key={index} className="p-4 rounded-xl border border-[#E8E8E8] space-y-3 bg-gray-50/30">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Location</p>
                                                <p className="text-sm font-semibold text-gray-800">{session.location}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Activity</p>
                                                <p className="text-sm font-medium text-gray-600">{session.lastActivity}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Device</p>
                                                <p className="text-xs font-medium text-gray-700">{session.device}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">IP Address</p>
                                                <p className="text-xs font-medium text-gray-700">{session.ipAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
