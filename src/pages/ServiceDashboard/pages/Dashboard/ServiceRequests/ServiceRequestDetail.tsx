import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Printer,
    X,
    Tag,
    Home,
    AlignLeft,
    User,
    Users,
    DollarSign,
    Paperclip,
    Image as ImageIcon,
} from 'lucide-react';
import { PiChatCircleText } from "react-icons/pi";
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';
import { serviceProviderService, type BackendServiceProvider } from '../../../../../services/service-provider.service';
import { maintenanceRequestService, type MaintenanceRequestDetail as BackendMaintenanceRequestDetail } from '../../../../../services/maintenance-request.service';

interface ServiceAssignmentRequest {
    id: string;
    category?: string | null;
    subcategory?: string | null;
    issue?: string | null;
    subissue?: string | null;
    problemDetails?: string | null;
    priority?: string | null;
    requestedAt?: string | null;
    dueDate?: string | null;
    property?: {
        id: string;
        propertyName?: string | null;
    } | null;
}

interface ServiceAssignment {
    id: string;
    status?: string | null;
    request?: ServiceAssignmentRequest | null;
}

interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-[#F6F6F6] rounded-[20px] overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <span className="text-gray-700">{icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>
                {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
            </button>
            {isOpen && (
                <div className="px-8 pb-8">
                    {children}
                </div>
            )}
        </div>
    );
};

const ServiceRequestDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showActionDropdown, setShowActionDropdown] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const queryClient = useQueryClient();

    const { data: assignment, isLoading, error } = useQuery<ServiceAssignment | null>({
        queryKey: ['service-request-detail', id],
        queryFn: async () => {
            if (!id) return null;
            const raw = await serviceProviderService.getMyAssignments();
            const list = raw as ServiceAssignment[];
            const foundByRequest = list.find(a => a.request?.id === id);
            if (foundByRequest) return foundByRequest;
            const foundByAssignment = list.find(a => a.id === id);
            return foundByAssignment ?? null;
        },
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
        retry: 1,
    });

    const request = assignment?.request ?? null;

    const displayId = request?.id ?? id ?? '';
    const displayCategory = useMemo(() => {
        if (!request) return '';
        const parts: string[] = [];
        if (request.category) parts.push(request.category);
        if (request.subcategory) parts.push(request.subcategory);
        if (request.issue) parts.push(request.issue);
        if (request.subissue) parts.push(request.subissue);
        return parts.join(' / ');
    }, [request]);

    const displayProperty = request?.property?.propertyName ?? 'Property';
    const displayDescription =
        request?.problemDetails ?? 'No description provided.';

    const { data: requestDetail } = useQuery<BackendMaintenanceRequestDetail | null>({
        queryKey: ['service-request-detail-request', id],
        queryFn: async () => {
            if (!id) return null;
            const data = await maintenanceRequestService.getOne(id);
            return data as BackendMaintenanceRequestDetail;
        },
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
        retry: 1,
    });

    const mediaUrls = useMemo(() => {
        if (!requestDetail) return [];

        const fromPhotos =
            requestDetail.photos?.map((p) => p.fileUrl) ?? [];

        const fromImageAttachments =
            requestDetail.attachments
                ?.filter((a) => {
                    const type = (a.fileType ?? '').toString().toUpperCase();
                    if (type) return type === 'IMAGE';
                    return /\.(png|jpe?g|gif|webp)$/i.test(a.fileUrl);
                })
                .map((a) => a.fileUrl) ?? [];

        return [...fromPhotos, ...fromImageAttachments];
    }, [requestDetail]);

    const { data: currentProvider } = useQuery<BackendServiceProvider | null>({
        queryKey: ['service-provider-me'],
        queryFn: () => serviceProviderService.getMyProfile(),
        staleTime: 5 * 60 * 1000,
    });

    const rawStatus = (assignment?.status ?? '').toUpperCase();
    const statusLabelMap: Record<string, string> = {
        NEW: 'New',
        ASSIGNED: 'Assigned',
        IN_PROGRESS: 'In Progress',
        ON_HOLD: 'On Hold',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
    };
    const currentStatusLabel = statusLabelMap[rawStatus] ?? (assignment?.status ?? 'New');

    const handleUpdateAssignmentStatus = async (nextStatus: string) => {
        if (!assignment?.id || !currentProvider?.id) return;
        setIsUpdatingStatus(true);
        try {
            await serviceProviderService.updateAssignmentStatus(currentProvider.id, assignment.id, nextStatus);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['service-requests-list'] }),
                queryClient.invalidateQueries({ queryKey: ['service-requests-board'] }),
                queryClient.invalidateQueries({ queryKey: ['service-request-detail', id] }),
            ]);
        } catch (e) {
            console.error('Failed to update assignment status:', e);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    if (!isLoading && !error && !assignment) {
        return (
            <div className="p-6 max-w-3xl mx-auto text-center">
                <ServiceBreadCrumb
                    items={[
                        { label: 'Dashboard', to: '/service-dashboard' },
                        { label: 'Requests', to: '/service-dashboard/requests' },
                    ]}
                />
                <p className="mt-8 text-gray-600 text-sm">
                    This request is not currently assigned to you.
                </p>
                <button
                    className="mt-4 px-4 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                    onClick={() => navigate('/service-dashboard/requests')}
                >
                    Back to Requests
                </button>
            </div>
        );
    }

    return (
        <div className="p-2 flex flex-col gap-6">
            {isLoading && (
                <div className="text-center text-gray-500 py-8 text-sm">
                    Loading request details...
                </div>
            )}
            {error && !isLoading && (
                <div className="text-center text-red-600 py-8 text-sm">
                    {error instanceof Error ? error.message : 'Failed to load request'}
                </div>
            )}

            {/* Breadcrumb */}
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Requests', to: '/service-dashboard/requests' },
                    { label: `Requests #${displayId}`, active: true }
                ]}
            />

            {/* Header / Top Action Bar */}
            <div className="bg-[#F6F6F6] rounded-[20px] p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ChevronLeft size={28} className="text-gray-900" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Maintenance request</h1>
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors border border-gray-100">
                            <PiChatCircleText size={20} className="text-gray-700" />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowActionDropdown(!showActionDropdown)}
                                className="bg-[#7CD947] hover:bg-[#6bc23d] text-white px-8 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                            >
                                Actions
                            </button>

                            {showActionDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
                                    {rawStatus === 'NEW' || rawStatus === 'ASSIGNED' ? (
                                        <button
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-2"
                                            disabled={isUpdatingStatus}
                                            onClick={() => {
                                                setShowActionDropdown(false);
                                                handleUpdateAssignmentStatus('IN_PROGRESS');
                                            }}
                                        >
                                            <span>Start work</span>
                                            {isUpdatingStatus && (
                                                <span className="text-[10px] text-gray-400">Updating…</span>
                                            )}
                                        </button>
                                    ) : null}

                                    {rawStatus === 'IN_PROGRESS' && (
                                        <button
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-2"
                                            disabled={isUpdatingStatus}
                                            onClick={() => {
                                                setShowActionDropdown(false);
                                                handleUpdateAssignmentStatus('COMPLETED');
                                            }}
                                        >
                                            <span>Mark completed</span>
                                            {isUpdatingStatus && (
                                                <span className="text-[10px] text-gray-400">Updating…</span>
                                            )}
                                        </button>
                                    )}

                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <Printer size={16} />
                                        Print
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                                        <X size={16} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-3">
                        <Tag className="text-gray-700 mt-1" size={24} />
                        <div>
                            <p className="text-sm font-bold text-gray-900">No. {displayId}</p>
                            <p className="text-xl font-bold text-gray-900">
                                {displayCategory || 'Maintenance Request'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Home className="text-gray-700 mt-1" size={24} />
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Property</p>
                            <p className="text-xl font-bold text-gray-900">
                                {displayProperty}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <AlignLeft className="text-gray-700 mt-1" size={24} />
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Description</p>
                            <p className="text-lg font-bold text-gray-900 mt-1">
                                {displayDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Collapsible Sections */}
            <CollapsibleSection title="Media" icon={<ImageIcon size={24} />}>
                {mediaUrls.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {mediaUrls.map((url) => (
                            <div
                                key={url}
                                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm group"
                            >
                                <img
                                    src={url}
                                    alt="Maintenance media"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'https://placehold.co/300x300?text=No+Image';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-400 italic">No media uploaded</div>
                )}
            </CollapsibleSection>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assignee Information */}
                <div className="bg-[#F6F6F6] rounded-[20px] p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <User size={24} className="text-gray-900" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Your Assignment</h3>
                            <p className="text-xs text-gray-500 mt-1">This job is currently assigned to you as the service provider.</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Type</p>
                                <p className="text-lg font-bold text-gray-900">One Time</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Priority</p>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7CD94733] text-[#7CD947] rounded-full text-xs font-bold mt-1">
                                    <span className="w-2 h-2 rounded-full bg-[#7CD947]"></span>
                                    {request?.priority ?? 'Normal'}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {currentStatusLabel}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Date Initiated</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {request?.requestedAt
                                        ? new Date(request.requestedAt).toLocaleDateString()
                                        : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Date Due</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {request?.dueDate
                                        ? new Date(request.dueDate).toLocaleDateString()
                                        : '-'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center shadow-sm w-full md:w-48">
                            {(() => {
                                const assigneeName =
                                    currentProvider?.companyName ||
                                    [currentProvider?.firstName, currentProvider?.lastName]
                                        .filter((part) => !!part && part.trim().length > 0)
                                        .join(' ') ||
                                    'You';
                                const initials = assigneeName
                                    .split(' ')
                                    .filter((part) => part.length > 0)
                                    .map((part) => part[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase();
                                return (
                                    <>
                            <div className="w-20 h-20 rounded-full mb-3 bg-coral-100 border-2 border-white flex items-center justify-center text-2xl font-bold text-gray-700 shadow-sm">
                                        {initials}
                            </div>
                                        <h4 className="font-bold text-gray-900 truncate max-w-full">{assigneeName}</h4>
                                        <p className="text-[10px] text-gray-400 break-all">
                                            You (Assigned Service Pro)
                                        </p>
                                        {currentProvider?.email && (
                                            <p className="mt-1 text-[10px] text-gray-500 break-all">
                                                {currentProvider.email}
                                            </p>
                                        )}
                                    </>
                                );
                            })()}
                            <div className="mt-4 flex flex-col gap-2 w-full">
                                {rawStatus === 'NEW' && (
                                    <button
                                        disabled={isUpdatingStatus}
                                        onClick={() => handleUpdateAssignmentStatus('IN_PROGRESS')}
                                        className="w-full px-4 py-2 bg-[#3A6D6C] text-white rounded-full text-xs font-semibold hover:bg-[#2c5251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUpdatingStatus ? 'Starting...' : 'Start Work'}
                                    </button>
                                )}
                                {rawStatus === 'IN_PROGRESS' && (
                                    <button
                                        disabled={isUpdatingStatus}
                                        onClick={() => handleUpdateAssignmentStatus('COMPLETED')}
                                        className="w-full px-4 py-2 bg-[#7BD747] text-white rounded-full text-xs font-semibold hover:bg-[#6BC837] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUpdatingStatus ? 'Updating...' : 'Mark Completed'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tenant Information */}
                <div className="bg-[#F6F6F6] rounded-[20px] p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Users size={24} className="text-gray-900" />
                        <h3 className="text-xl font-bold text-gray-900">Tenant Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Type</p>
                            <p className="text-lg font-bold text-gray-900">One Time</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Type</p>
                            <p className="text-lg font-bold text-gray-900">One Time</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Date Initiated</p>
                            <p className="text-lg font-bold text-gray-900">
                                {request?.requestedAt
                                    ? new Date(request.requestedAt).toLocaleDateString()
                                    : '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Date Due</p>
                            <p className="text-lg font-bold text-gray-900">
                                {request?.dueDate
                                    ? new Date(request.dueDate).toLocaleDateString()
                                    : '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <CollapsibleSection title="Transactions" icon={<DollarSign size={24} />}>
                <div className="text-gray-400 italic text-center py-8">
                    No transactions found
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Attachments" icon={<Paperclip size={24} />}>
                <div className="text-gray-400 italic">No attachments found</div>
            </CollapsibleSection>
        </div>
    );
};

export default ServiceRequestDetail;
