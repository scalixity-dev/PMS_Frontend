import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Trash2 } from 'lucide-react';
import CustomTextBox from '../../components/CustomTextBox';
import ConfirmationModal from '../KeysLocks/ConfirmationModal';

// Mock Data
const MOCK_RELATED_REQUESTS = [
    {
        id: 1,
        status: 'New',
        statusColor: '#7BD747',
        requestId: '8965231',
        title: 'Household / Trim / Need Painting',
        dateInitiated: '25 Dec, 2025',
        assignee: 'UnAssigned',
        assigneeType: 'unassigned' as const
    },
    {
        id: 2,
        status: 'In Progress',
        statusColor: '#FFA500',
        requestId: '8965232',
        title: 'Electrical / Lights / Smoke Detectors / Beeping',
        dateInitiated: '26 Dec, 2025',
        assignee: 'John Doe',
        assigneeType: 'assigned' as const
    },
    {
        id: 3,
        status: 'Completed',
        statusColor: '#3A6D6C',
        requestId: '8965233',
        title: 'Plumbing / Faucet / Leaking',
        dateInitiated: '24 Dec, 2025',
        assignee: 'Jane Smith',
        assigneeType: 'assigned' as const
    },
    {
        id: 4,
        status: 'New',
        statusColor: '#7BD747',
        requestId: '8965234',
        title: 'HVAC / Air Conditioning / Not Cooling',
        dateInitiated: '27 Dec, 2025',
        assignee: 'UnAssigned',
        assigneeType: 'unassigned' as const
    },
];

const MaintenanceRecurringDetail: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const [isGeneralInfoCollapsed, setIsGeneralInfoCollapsed] = useState(false);
    const [isRelatedRequestCollapsed, setIsRelatedRequestCollapsed] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setIsActionMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = () => {
        // TODO: Implement actual delete API call here
        console.log('Deleting recurring request');
        setIsDeleteModalOpen(false);
        navigate('/dashboard/maintenance/recurring');
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Recurring</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">12354</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="flex items-center justify-center">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Recurring request</h1>
                    </div>
                    <div className="relative" ref={actionMenuRef}>
                        <button
                            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                        >
                            Action
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {isActionMenuOpen && (
                            <div className="absolute right-0 mt-2 w-28 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setIsActionMenuOpen(false);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ID & Property Section */}
                {/* ID & Property Section */}
                <div className="bg-[#f0f0f6] rounded-[3rem] p-4 flex flex-wrap gap-4 items-center mb-6 shadow-sm">
                    <div className="bg-[#7BD747] text-white px-6 py-3 rounded-full flex items-center gap-4 min-w-[300px]">
                        <span className="font-bold text-sm">ID- 1331896</span>
                        <div className="bg-white/90 text-[#3A6D6C] text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Electrical / Lights / Smoke Detectors / Beeping
                        </div>
                    </div>
                    <div className="bg-[#7BD747] text-white px-6 py-3 rounded-full flex items-center gap-4 min-w-[200px]">
                        <span className="font-bold text-sm">Property</span>
                        <div className="bg-white/90 text-[#3A6D6C] text-[10px] px-3 py-0.5 rounded-full font-bold">
                            Luxury
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Description</h2>
                    <div className="bg-[#F0F0F6] rounded-[1.5rem] p-6 min-h-[120px] shadow-sm">
                        <p className="text-gray-600">lorem smdjsdn sdjdfsd fsd v</p>
                    </div>
                </div>

                {/* General Information */}
                <div className="mb-6">
                    <div
                        className="flex items-center gap-2 mb-2 cursor-pointer"
                        onClick={() => setIsGeneralInfoCollapsed(!isGeneralInfoCollapsed)}
                    >
                        <h2 className="text-lg font-bold text-gray-800">General information</h2>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isGeneralInfoCollapsed ? '-rotate-90' : ''}`} />
                    </div>

                    {!isGeneralInfoCollapsed && (
                        <div className="bg-[#F0F0F6] rounded-[2rem] p-8 shadow-sm">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <CustomTextBox
                                        label="Start date"
                                        value="25 Dec, 2025"
                                        className="w-full"
                                        labelClassName="text-gray-700"
                                        valueClassName="text-gray-600 text-center flex-1"
                                    />
                                    <CustomTextBox
                                        label="Next date"
                                        value="08 Jan, 2026"
                                        className="w-full"
                                        labelClassName="text-gray-700"
                                        valueClassName="text-gray-600 text-center flex-1"
                                    />
                                    <CustomTextBox
                                        label="End date"
                                        value="28 Jan, 2026"
                                        className="w-full"
                                        labelClassName="text-gray-700"
                                        valueClassName="text-gray-600 text-center flex-1"
                                    />
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <CustomTextBox
                                        label="Type"
                                        value="Recurring / Every two weeks"
                                        className="w-full"
                                        labelClassName="text-gray-700"
                                        valueClassName="text-gray-600 text-center flex-1"
                                    />
                                    <CustomTextBox
                                        label="Post in advance"
                                        value="10 days"
                                        className="w-full"
                                        labelClassName="text-gray-700"
                                        valueClassName="text-gray-600 text-center flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Related Request */}
                <div className="mb-6">
                    <div
                        className="flex items-center gap-2 mb-2 cursor-pointer"
                        onClick={() => setIsRelatedRequestCollapsed(!isRelatedRequestCollapsed)}
                    >
                        <h2 className="text-lg font-bold text-gray-800">Related request</h2>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isRelatedRequestCollapsed ? '-rotate-90' : ''}`} />
                    </div>

                    {!isRelatedRequestCollapsed && (
                        <div>
                            {/* Table Header */}
                            <div className="bg-[#3A6D6C] text-white px-6 py-4 rounded-t-[1.5rem] mt-4 grid grid-cols-[1fr_1fr_2fr_1.5fr_1fr] gap-4 text-sm font-medium">
                                <div>Status</div>
                                <div>Request</div>
                                <div>Title & Property</div>
                                <div>Date initiated</div>
                                <div>Assignee</div>
                            </div>

                            {/* Table Body */}
                            <div className="bg-[#F0F0F6] rounded-b-[2rem] p-4 flex flex-col gap-3 min-h-[100px]">
                                {MOCK_RELATED_REQUESTS.map((request) => (
                                    <div
                                        key={request.id}
                                        className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[1fr_1fr_2fr_1.5fr_1fr] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: request.statusColor }}
                                            ></div>
                                            <span className="font-medium text-gray-800 text-sm">{request.status}</span>
                                        </div>
                                        <div className="font-bold text-gray-800 text-sm">{request.requestId}</div>
                                        <div className="font-medium text-gray-800 text-sm">{request.title}</div>
                                        <div className="text-[#3A6D6C] font-medium text-sm">{request.dateInitiated}</div>
                                        <div>
                                            <span className={`px-4 py-1 rounded-full text-xs font-medium ${request.assigneeType === 'unassigned'
                                                ? 'bg-[#caecca] text-gray-700'
                                                : 'bg-[#3A6D6C] text-white'
                                                }`}>
                                                {request.assignee}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Recurring Request"
                message="Are you sure you want to delete this recurring maintenance request? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
};

export default MaintenanceRecurringDetail;
