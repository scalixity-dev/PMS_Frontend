import React, { useState } from 'react';
import RequestCard from './components/RequestCard';
import DashboardButton from '../../components/DashboardButton';
import ServiceTabs from '../../components/ServiceTabs';


interface RequestItem {
    id: string;
    status: 'Normal' | 'Urgent' | 'Critical';
    category: string;
    propertyName: string;
    avatarSeed: string;
    tabStatus: 'new_request' | 'in_process';
}

const mockRequests: RequestItem[] = [
    {
        id: '1',
        status: 'Normal',
        category: 'Appliances / Refrigerator / Other',
        propertyName: 'Luxury Application',
        avatarSeed: 'Felix',
        tabStatus: 'new_request'
    },
    {
        id: '2',
        status: 'Critical',
        category: 'Plumbing / Leak',
        propertyName: 'Sunset Apartments',
        avatarSeed: 'Aneka',
        tabStatus: 'new_request'
    },
    {
        id: '3',
        status: 'Urgent',
        category: 'Electrical / Outage',
        propertyName: 'Downtown Lofts',
        avatarSeed: 'Bob',
        tabStatus: 'in_process'
    },
    {
        id: '4',
        status: 'Normal',
        category: 'General / Maintenance',
        propertyName: 'Green Valley',
        avatarSeed: 'Jack',
        tabStatus: 'new_request'
    },
    {
        id: '5',
        status: 'Normal',
        category: 'HVAC / Heating',
        propertyName: 'Skyline Tower',
        avatarSeed: 'Molly',
        tabStatus: 'in_process'
    }
];

const ServiceDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'new_request' | 'in_process'>('new_request');

    const filteredRequests = mockRequests.filter(req => req.tabStatus === activeTab);

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-2">

            {/* Left Column: Profile & Stats */}
            <div className="w-full lg:w-1/4 flex flex-col gap-6">

                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100">
                    <div className="w-24 h-24 bg-coral-100 rounded-full mb-4 overflow-hidden relative">
                        {/* Placeholder for Avatar - Replicating the illustration look with code or generic image if we had one */}
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            alt="Siddak Bagga"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Siddak Bagga</h2>
                    <p className="text-gray-500 text-sm">siddakbagga@gmail.com</p>
                </div>

                {/* Stats Cards Container */}
                <div className="bg-white rounded-3xl shadow-sm p-4 border border-gray-100 flex flex-col gap-4">
                    {/* Outstanding */}
                    <div className="flex items-center justify-between p-2">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Outstanding</p>
                            <p className="text-xl font-bold text-gray-900">2.00 INR</p>
                        </div>
                        <button className="text-[#7BD747] text-sm font-medium hover:underline">View</button>
                    </div>
                    <div className="border-t border-gray-100"></div>

                    {/* Calendar Reminder */}
                    <div className="flex items-center justify-between p-2">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Calendar Reminder</p>
                            <p className="text-xl font-bold text-gray-900">0</p>
                        </div>
                        <button className="text-[#7BD747] text-sm font-medium hover:underline">View</button>
                    </div>
                    <div className="border-t border-gray-100"></div>

                    {/* Job Leads */}
                    <div className="flex items-center justify-between p-2">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Job Leads</p>
                            <p className="text-xl font-bold text-gray-900">0</p>
                        </div>
                        <button className="text-[#7BD747] text-sm font-medium hover:underline">View</button>
                    </div>
                </div>

                {/* Business Profile Card */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Business Profile</h3>
                        <button className="text-[#7BD747] text-sm font-medium hover:underline">Activate</button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {/* Placeholder icon */}
                            <span className="text-blue-500 text-xs font-bold">JL</span>
                        </div>
                        <span className="text-gray-600 font-medium">Job Leads</span>
                    </div>
                </div>

            </div>

            {/* Right Column: Requests & Tabs */}
            <div className="w-full lg:w-3/4 flex flex-col gap-6">

                {/* Header Actions */}
                {/* Header Actions */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-end gap-4 md:gap-0">
                    <ServiceTabs
                        tabs={[
                            { label: 'New Request', value: 'new_request' },
                            { label: 'In process', value: 'in_process' }
                        ]}
                        activeTab={activeTab}
                        onTabChange={(val) => setActiveTab(val)}
                        className="md:pr-6 md:mr-6"
                    />

                    <div className="flex gap-3 w-full md:w-auto pb-1 md:pl-0">
                        <DashboardButton bgColor="#3A6B65" className="text-white flex-1 md:flex-none">
                            Find a Job
                        </DashboardButton>
                        <DashboardButton bgColor="#7CD947" className="text-white flex-1 md:flex-none">
                            Add Request
                        </DashboardButton>
                    </div>
                </div>

                {/* Content Area - Request Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRequests.map((request) => (
                        <RequestCard
                            key={request.id}
                            status={request.status}
                            category={request.category}
                            propertyName={request.propertyName}
                            avatarSeed={request.avatarSeed}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};



export default ServiceDashboard;
