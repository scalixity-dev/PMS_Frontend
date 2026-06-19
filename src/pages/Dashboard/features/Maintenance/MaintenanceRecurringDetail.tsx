import React, { useState, useRef } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import CustomTextBox from '../../components/CustomTextBox';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import {
    useGetMaintenanceRecurring,
    useDeleteMaintenanceRecurring,
} from '../../../../hooks/useMaintenanceRecurringQueries';
import { useTeamPermissions } from '../../../../context/TeamPermissionContext';


const MaintenanceRecurringDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { isTeamMember, canManage } = useTeamPermissions();
    const canEdit = !isTeamMember || canManage('maintenance');
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const [isGeneralInfoCollapsed, setIsGeneralInfoCollapsed] = useState(false);
    const [isRelatedRequestCollapsed, setIsRelatedRequestCollapsed] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    const { data: record } = useGetMaintenanceRecurring(id);
    const deleteMutation = useDeleteMaintenanceRecurring();

    const handleDelete = async () => {
        if (!id) return;
        await deleteMutation.mutateAsync(id);
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
                    {canEdit && <div className="relative" ref={actionMenuRef}>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="px-6 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2"
                        >
                            Delete
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>}
                </div>

                {/* ID & Property Section */}
                {/* ID & Property Section */}
                {/* ID & Property Section */}
                <div className="bg-[#f0f0f6] rounded-[2rem] md:rounded-[3rem] p-4 flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center mb-6 shadow-sm">
                    <div className="bg-[#7BD747] text-white px-4 py-3 md:px-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4 md:min-w-[300px]">
                        <span className="font-bold text-sm">ID- {record?.id?.slice(0, 8) ?? '...'}</span>
                        <div className="bg-white/90 text-[#3A6D6C] text-xs px-2 py-0.5 rounded-full font-bold text-center">
                            {record?.title ?? ''}
                        </div>
                    </div>
                    <div className="bg-[#7BD747] text-white px-4 py-3 md:px-6 rounded-[2rem] flex items-center justify-between gap-4 md:min-w-[200px]">
                        <span className="font-bold text-sm">Property</span>
                        <div className="bg-white/90 text-[#3A6D6C] text-xs px-3 py-0.5 rounded-full font-bold">
                            {record?.property?.propertyName ?? '—'}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Description</h2>
                    <div className="bg-[#F0F0F6] rounded-[1.5rem] p-6 min-h-[120px] shadow-sm">
                        <p className="text-gray-600">{record?.description ?? '—'}</p>
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
                        <div className="bg-[#F0F0F6] rounded-[2rem] p-4 md:p-8 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <CustomTextBox
                                        label="Start date"
                                        value={record?.startDate ? new Date(record.startDate).toLocaleDateString() : '—'}
                                        className="w-full"
                                        labelClassName="text-gray-700"
                                        valueClassName="text-gray-600 text-center flex-1"
                                    />
                                    <CustomTextBox
                                        label="Next date"
                                        value={record?.nextOccurrence ? new Date(record.nextOccurrence).toLocaleDateString() : '—'}
                                        className="w-full"
                                        labelClassName="text-gray-700"
                                        valueClassName="text-gray-600 text-center flex-1"
                                    />
                                    <CustomTextBox
                                        label="End date"
                                        value={record?.endDate ? new Date(record.endDate).toLocaleDateString() : '—'}
                                        className="w-full"
                                        labelClassName="text-gray-700"
                                        valueClassName="text-gray-600 text-center flex-1"
                                    />
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <CustomTextBox
                                        label="Frequency"
                                        value={record?.frequency ?? '—'}
                                        className="w-full"
                                        labelClassName="text-gray-700"
                                        valueClassName="text-gray-600 text-center flex-1"
                                    />
                                    <CustomTextBox
                                        label="Priority"
                                        value={record?.priority ?? '—'}
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
                            {/* Desktop Table Header */}
                            <div className="hidden md:grid bg-[#3A6D6C] text-white px-6 py-4 rounded-t-[1.5rem] mt-4 grid-cols-[1fr_1fr_2fr_1.5fr_1fr] gap-4 text-sm font-medium">
                                <div>Status</div>
                                <div>Request</div>
                                <div>Title & Property</div>
                                <div>Date initiated</div>
                                <div>Assignee</div>
                            </div>

                            {/* Table Body */}
                            <div className="bg-[#F0F0F6] rounded-[2rem] md:rounded-b-[2rem] md:rounded-t-none p-4 flex flex-col gap-3 min-h-[100px] mt-4 md:mt-0">
                                <div className="text-center py-12 text-gray-500">
                                    No related requests found.
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Recurring Request"
                itemName="this recurring maintenance request"
            />
        </div>
    );
};

export default MaintenanceRecurringDetail;
