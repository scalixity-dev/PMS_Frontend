import React, { useMemo, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import RequestCard from './components/RequestCard';
import DashboardButton from '../../components/DashboardButton';
import ServiceTabs from '../../components/ServiceTabs';
import { PiEnvelopeSimpleLight, PiToolboxLight } from 'react-icons/pi';
import { useServiceProviderAssignments } from '../../../../hooks/useServiceProviderAssignments';
import { useGetCurrentUser } from '../../../../hooks/useAuthQueries';

interface RequestItem {
    id: string;
    assignmentId?: string;
    serviceProviderId?: string;
    status: 'Normal' | 'Urgent' | 'Critical';
    category: string;
    propertyName: string;
    tabStatus: 'new_request' | 'in_process';
}

type AssignmentApi = {
    id: string;
    serviceProviderId?: string;
    requestId: string;
    status: string;
    request?: {
        id: string;
        category?: string;
        subcategory?: string;
        issue?: string;
        priority?: string;
        property?: { propertyName?: string };
    };
};

function mapAssignmentToRequestItem(a: AssignmentApi): RequestItem {
    const statusMap: Record<string, 'Normal' | 'Urgent' | 'Critical'> = {
        LOW: 'Normal',
        MEDIUM: 'Normal',
        HIGH: 'Urgent',
        URGENT: 'Critical',
    };
    const req = a.request;
    const category = req
        ? [req.category, req.subcategory, req.issue].filter(Boolean).join(' / ') || 'Maintenance'
        : 'Maintenance';
    const tabStatus: 'new_request' | 'in_process' =
        a.status === 'ASSIGNED' || a.status === 'VENDOR_NOTIFIED' ? 'new_request' : 'in_process';

    return {
        id: a.requestId ?? a.id,
        assignmentId: a.id,
        serviceProviderId: a.serviceProviderId,
        status: statusMap[req?.priority ?? ''] ?? 'Normal',
        category,
        propertyName: req?.property?.propertyName ?? 'Property',
        tabStatus,
    };
}

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const ServiceDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'new_request' | 'in_process'>('new_request');
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };
    const navigate = useNavigate();

    const { data: currentUser } = useGetCurrentUser();
    const { data: assignments = [], isLoading: assignmentsLoading } = useServiceProviderAssignments();
    const requests: RequestItem[] = useMemo(() => {
        if (!Array.isArray(assignments)) return [];
        return (assignments as AssignmentApi[]).map(mapAssignmentToRequestItem);
    }, [assignments]);
    const filteredRequests = requests.filter((req) => req.tabStatus === activeTab);

    return (
        <div className={`flex flex-col lg:flex-row gap-6 p-2 mx-auto transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>

            {/* Left Column: Profile & Stats */}
            <div className="w-full lg:w-1/4 flex flex-col gap-6">

                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100">
                    <div className="w-24 h-24 bg-coral-100 rounded-full mb-4 overflow-hidden relative flex items-center justify-center text-4xl font-bold text-gray-700">
                        {currentUser?.fullName
                            ? currentUser.fullName
                                  .split(/\s+/)
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2) || 'SP'
                            : 'SP'}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {currentUser?.fullName ?? 'Service Provider'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {currentUser?.email ?? ''}
                    </p>
                </div>

                {/* Stats Cards Container */}
                <div className="bg-white rounded-3xl shadow-sm p-4 border border-gray-100 flex flex-col gap-4">
                    {/* Outstanding */}
                    <div className="flex items-center justify-between p-2">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Outstanding</p>
                            <p className="text-xl font-bold text-gray-900">2.00 INR</p>
                        </div>
                        <button
                            onClick={() => navigate('/service-dashboard/accounting')}
                            className="text-[#7BD747] text-sm font-medium hover:underline"
                        >
                            View
                        </button>
                    </div>
                    <div className="border-t border-gray-100"></div>

                    {/* Calendar Reminder */}
                    <div className="flex items-center justify-between p-2">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Calendar Reminder</p>
                            <p className="text-xl font-bold text-gray-900">0</p>
                        </div>
                        <button
                            onClick={() => navigate('/service-dashboard/calendar')}
                            className="text-[#7BD747] text-sm font-medium hover:underline"
                        >
                            View
                        </button>
                    </div>
                    <div className="border-t border-gray-100"></div>

                    {/* Job Leads */}
                    <div className="flex items-center justify-between p-2">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Job Leads</p>
                            <p className="text-xl font-bold text-gray-900">0</p>
                        </div>
                        <button
                            onClick={() => navigate('/service-dashboard/find-job')}
                            className="text-[#7BD747] text-sm font-medium hover:underline"
                        >
                            View
                        </button>
                    </div>
                </div>

                {/* Business Profile Card */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Business Profile</h3>
                        <button
                            onClick={() => navigate('/service-dashboard/settings/business-profile')}
                            className="text-[#7BD747] text-sm font-medium hover:underline"
                        >
                            Activate
                        </button>
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
                        <DashboardButton
                            onClick={() => navigate('/service-dashboard/find-job')}
                            bgColor="#3A6B65"
                            className="text-white flex-1 md:flex-none"
                        >
                            Find a Job
                        </DashboardButton>
                    </div>
                </div>

                {/* Content Area - Request Cards */}
                {assignmentsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                        <p className="text-gray-500">Loading requests...</p>
                    </div>
                ) : filteredRequests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredRequests.map((request) => (
                            <RequestCard
                                key={request.id}
                                id={request.id}
                                status={request.status}
                                category={request.category}
                                propertyName={request.propertyName}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            {activeTab === 'new_request'
                                ? <PiEnvelopeSimpleLight size={40} className="text-gray-400" />
                                : <PiToolboxLight size={40} className="text-gray-400" />
                            }
                        </div>
                        {requests.length === 0 ? (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No requests yet</h3>
                                <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed">
                                    You haven't received any maintenance requests yet. When a property owner sends you a request, it will appear here.
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {activeTab === 'new_request' ? 'No new requests' : 'No requests in process'}
                                </h3>
                                <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed">
                                    {activeTab === 'new_request'
                                        ? 'You currently have no new maintenance requests to review.'
                                        : 'You currently have no active jobs in progress. Check your new requests to get started.'}
                                </p>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};



export default ServiceDashboard;
