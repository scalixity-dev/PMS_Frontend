import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Clock, Plus, Edit2, Trash2, User, FileText, CheckSquare, LogIn } from 'lucide-react';
import AddNoteModal from './components/AddNoteModal';
import AddTaskModal from './components/AddleadsTaskModal';
import AddLogModal from './components/AddLogModal';
import AddMeetingModal from './components/AddMeetingModal';
import InviteToApplyModal from './components/InviteToApplyModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { useGetAllListings } from '../../../../hooks/useListingQueries';
import {
    useGetLead,
    useUpdateLead,
    useDeleteLead,
    useGetAllNotes,
    useGetAllTasks,
    useGetAllActivities,
    useCreateNote,
    useUpdateNote,
    useDeleteNote,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useCreateActivity,
    useDeleteActivity,
    useGetAllCalls,
    useCreateCall,
    useUpdateCall,
    useDeleteCall,
    useGetAllMeetings,
    useCreateMeeting,
    useUpdateMeeting,
    useDeleteMeeting,
} from '../../../../hooks/useLeadQueries';
import type { LeadStatus, CreateActivityDto } from '../../../../services/lead.service';
import { authService } from '../../../../services/auth.service';

interface ActivityItem {
    id: string; // Changed to string to use UUID directly
    user: string;
    time: string;
    type: string;
    text: string;
    image?: string;
    originalData?: any;
    timestamp: number; // Store actual timestamp for sorting
}

interface DayActivity {
    id: number;
    date: string;
    items: ActivityItem[];
}

const LeadDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const { data: lead, isLoading: isLoadingLead, error: leadError } = useGetLead(id || null, !!id);
    const updateLeadMutation = useUpdateLead();
    const deleteLeadMutation = useDeleteLead();

    // Fetch notes, tasks, activities, calls, and meetings
    const { data: notes = [] } = useGetAllNotes(id || null, !!id);
    const { data: tasks = [] } = useGetAllTasks(id || null, !!id);
    const { data: activities = [] } = useGetAllActivities(id || null, !!id);
    const { data: calls = [] } = useGetAllCalls(id || null, !!id);
    const { data: meetings = [] } = useGetAllMeetings(id || null, !!id);

    // Mutations
    const createNoteMutation = useCreateNote();
    const updateNoteMutation = useUpdateNote();
    const deleteNoteMutation = useDeleteNote();
    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();
    const createActivityMutation = useCreateActivity();
    const deleteActivityMutation = useDeleteActivity();
    const createCallMutation = useCreateCall();
    const updateCallMutation = useUpdateCall();
    const deleteCallMutation = useDeleteCall();
    const createMeetingMutation = useCreateMeeting();
    const updateMeetingMutation = useUpdateMeeting();
    const deleteMeetingMutation = useDeleteMeeting();

    const [activeFilter, setActiveFilter] = useState('All');
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showLogOptions, setShowLogOptions] = useState(false);
    const [editingItem, setEditingItem] = useState<{ dayId: number; item: ActivityItem } | null>(null);
    const [status, setStatus] = useState<LeadStatus>('NEW');
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentUserName, setCurrentUserName] = useState<string>('User');

    const { data: listingsData } = useGetAllListings();
    const listings = listingsData?.map(l => ({
        id: l.id,
        title: l.title || l.property?.propertyName || 'Untitled Listing'
    })) || [];

    // Fetch current user name
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                setCurrentUserName(user.fullName || 'User');
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };
        fetchUser();
    }, []);

    // Helper function to convert status enum to display label
    const getStatusLabel = (status: LeadStatus): string => {
        const statusMap: Record<LeadStatus, string> = {
            'NEW': 'New',
            'WORKING': 'Working',
            'CLOSED': 'Closed',
        };
        return statusMap[status] || status;
    };

    // Update lead info and status from API
    useEffect(() => {
        if (lead) {
            setStatus(lead.status || 'NEW');
        }
    }, [lead]);

    const leadInfo = lead ? {
        fullName: lead.name,
        phone: lead.phoneNumber,
        email: lead.email
    } : {
        fullName: '',
        phone: '',
        email: ''
    };

    // Transform backend data to frontend format
    const transformedActivities = useMemo(() => {
        const dayMap = new Map<string, ActivityItem[]>();

        // Process notes
        notes.forEach((note) => {
            const date = new Date(note.createdAt);
            const dateKey = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
            const timestamp = date.getTime(); // Store timestamp for sorting

            if (!dayMap.has(dateKey)) {
                dayMap.set(dateKey, []);
            }

            dayMap.get(dateKey)!.push({
                id: note.id, // Use UUID directly
                user: currentUserName,
                time: time,
                type: 'Note',
                text: note.content,
                image: note.attachmentUrl || undefined,
                timestamp: timestamp,
                originalData: { type: 'note', id: note.id, leadId: note.leadId }
            });
        });

        // Process tasks
        tasks.forEach((task) => {
            const date = new Date(task.createdAt);
            const dateKey = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
            const timestamp = date.getTime(); // Store timestamp for sorting
            const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';
            const taskText = task.title || task.description
                ? `${task.title || task.description}${dueDate ? ` (Due: ${dueDate})` : ''}`
                : 'Task';

            // Format dueDate for datetime-local input (YYYY-MM-DDTHH:mm)
            let formattedDueDate = '';
            if (task.dueDate) {
                const dueDateObj = new Date(task.dueDate);
                const year = dueDateObj.getFullYear();
                const month = String(dueDateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dueDateObj.getDate()).padStart(2, '0');
                const hours = String(dueDateObj.getHours()).padStart(2, '0');
                const minutes = String(dueDateObj.getMinutes()).padStart(2, '0');
                formattedDueDate = `${year}-${month}-${day}T${hours}:${minutes}`;
            }

            if (!dayMap.has(dateKey)) {
                dayMap.set(dateKey, []);
            }

            dayMap.get(dateKey)!.push({
                id: task.id, // Use UUID directly
                user: task.assignee || currentUserName,
                time: time,
                type: 'Task',
                text: taskText,
                timestamp: timestamp,
                originalData: {
                    type: 'task',
                    id: task.id,
                    leadId: task.leadId,
                    details: task.title || task.description || '', // Use title if available, fallback to description
                    date: formattedDueDate, // Store formatted date for datetime-local input
                    assignee: task.assignee || currentUserName,
                    description: task.description,
                    title: task.title
                }
            });
        });

        // Process calls
        calls.forEach((call) => {
            const date = new Date(call.createdAt);
            const dateKey = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
            const timestamp = date.getTime();

            // Convert enum call result to readable label
            const getCallResultLabel = (result: string): string => {
                const resultMap: Record<string, string> = {
                    'ANSWERED': 'Answered',
                    'NO_ANSWER': 'No Answer',
                    'VOICEMAIL': 'Voicemail',
                    'BUSY': 'Busy',
                    'FAILED': 'Failed',
                    'OTHER': 'Other'
                };
                return resultMap[result] || result;
            };

            const callText = call.callResult
                ? `${call.details} - Result: ${getCallResultLabel(call.callResult)}`
                : call.details;

            // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
            let formattedDate = '';
            if (call.dateTime) {
                const dateObj = new Date(call.dateTime);
                if (!isNaN(dateObj.getTime())) {
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const hours = String(dateObj.getHours()).padStart(2, '0');
                    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                    formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
                }
            }

            if (!dayMap.has(dateKey)) {
                dayMap.set(dateKey, []);
            }

            dayMap.get(dateKey)!.push({
                id: call.id, // Use UUID directly
                user: currentUserName,
                time: time,
                type: 'Call',
                text: callText,
                timestamp: timestamp,
                originalData: {
                    type: 'call',
                    id: call.id,
                    leadId: call.leadId,
                    details: call.details,
                    date: formattedDate || call.dateTime,
                    results: call.callResult || ''
                }
            });
        });

        // Process meetings
        meetings.forEach((meeting) => {
            const date = new Date(meeting.createdAt);
            const dateKey = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
            const timestamp = date.getTime();

            // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
            let formattedDate = '';
            if (meeting.dateTime) {
                const dateObj = new Date(meeting.dateTime);
                if (!isNaN(dateObj.getTime())) {
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const hours = String(dateObj.getHours()).padStart(2, '0');
                    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                    formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
                }
            }

            if (!dayMap.has(dateKey)) {
                dayMap.set(dateKey, []);
            }

            dayMap.get(dateKey)!.push({
                id: meeting.id, // Use UUID directly
                user: currentUserName,
                time: time,
                type: 'Meeting',
                text: meeting.details,
                timestamp: timestamp,
                originalData: {
                    type: 'meeting',
                    id: meeting.id,
                    leadId: meeting.leadId,
                    details: meeting.details,
                    date: formattedDate || meeting.dateTime
                }
            });
        });

        // Process activities (excluding CALL and MEETING types since they're shown separately)
        activities.forEach((activity) => {
            // Skip CALL and MEETING type activities since calls and meetings are already processed above
            if (activity.type === 'CALL' || activity.type === 'MEETING') {
                return;
            }

            const date = new Date(activity.createdAt);
            const dateKey = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
            const timestamp = date.getTime(); // Store timestamp for sorting

            if (!dayMap.has(dateKey)) {
                dayMap.set(dateKey, []);
            }

            dayMap.get(dateKey)!.push({
                id: activity.id, // Use UUID directly
                user: currentUserName,
                time: time,
                type: 'Activity',
                text: activity.description,
                timestamp: timestamp,
                originalData: { type: 'activity', id: activity.id, leadId: activity.leadId, activityType: activity.type }
            });
        });

        // Convert to DayActivity array and sort by date (newest first)
        const dayActivitiesWithTimestamp: (DayActivity & { dayTimestamp: number })[] = Array.from(dayMap.entries())
            .map(([date, items], index) => {
                // Sort items within each day by timestamp (newest first)
                const sortedItems = items.sort((a, b) => {
                    return b.timestamp - a.timestamp;
                });

                return {
                    id: index + 1,
                    date: date,
                    items: sortedItems,
                    // Store the newest timestamp of the day for day-level sorting
                    dayTimestamp: sortedItems.length > 0 ? sortedItems[0].timestamp : 0
                };
            })
            .sort((a, b) => {
                // Sort days by the newest item timestamp in each day (newest first)
                return b.dayTimestamp - a.dayTimestamp;
            });

        // Remove dayTimestamp from final result
        const dayActivities: DayActivity[] = dayActivitiesWithTimestamp.map(({ dayTimestamp, ...dayActivity }) => dayActivity);

        return dayActivities;
    }, [notes, tasks, activities, calls, meetings, currentUserName]);

    const handleNoteConfirm = async (noteText: string, _file?: File | null) => {
        if (!id) return;

        try {
            // TODO: Handle file upload if _file is provided
            // For now, we'll just create the note without attachment
            const noteData = {
                content: noteText,
                attachmentUrl: _file ? undefined : undefined, // Will be set after file upload
            };

            if (editingItem && editingItem.item.originalData?.type === 'note') {
                // Update existing note
                await updateNoteMutation.mutateAsync({
                    leadId: id,
                    noteId: editingItem.item.originalData.id,
                    noteData: { content: noteText }
                });
            } else {
                // Create new note
                await createNoteMutation.mutateAsync({
                    leadId: id,
                    noteData
                });
            }

            setIsNoteModalOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Failed to save note:', error);
            alert(`Failed to save note: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleTaskCreate = async (taskData: { details: string; date: string; assignee: string }, _file?: File | null) => {
        if (!id) return;

        // Validate required fields
        if (!taskData.details.trim()) {
            alert('Task description is required');
            return;
        }

        if (!taskData.date) {
            alert('Due date is required');
            return;
        }

        try {
            // Parse the datetime-local value and convert to ISO string
            const dueDate = new Date(taskData.date);
            if (isNaN(dueDate.getTime())) {
                alert('Invalid date format');
                return;
            }

            const taskDto = {
                description: taskData.details.trim(),
                dueDate: dueDate.toISOString(),
            };

            if (editingItem && editingItem.item.originalData?.type === 'task') {
                // Update existing task
                await updateTaskMutation.mutateAsync({
                    leadId: id,
                    taskId: editingItem.item.originalData.id,
                    taskData: {
                        description: taskData.details.trim(),
                        dueDate: dueDate.toISOString(),
                    }
                });
            } else {
                // Create new task
                await createTaskMutation.mutateAsync({
                    leadId: id,
                    taskData: taskDto
                });
            }

            setIsTaskModalOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Failed to save task:', error);
            alert(`Failed to save task: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleLogCreate = async (logData: { details: string; date: string; results: string }, _file?: File | null) => {
        if (!id) return;

        // Validate required fields
        if (!logData.details || !logData.details.trim()) {
            alert('Details are required');
            return;
        }

        if (logData.details.length > 5000) {
            alert('Details must not exceed 5000 characters');
            return;
        }

        if (!logData.date) {
            alert('Date and time are required');
            return;
        }

        if (!logData.results || !logData.results.trim()) {
            alert('Call result is required');
            return;
        }

        try {
            // Convert datetime-local format to ISO string
            const dateObj = new Date(logData.date);
            if (isNaN(dateObj.getTime())) {
                alert('Invalid date format. Date and time must be a valid ISO 8601 date string');
                return;
            }
            const isoDate = dateObj.toISOString();

            if (editingItem && editingItem.item.originalData?.type === 'call') {
                // Update existing call
                await updateCallMutation.mutateAsync({
                    leadId: id,
                    callId: editingItem.item.originalData.id,
                    callData: {
                        details: logData.details.trim(),
                        dateTime: isoDate,
                        callResult: logData.results.trim()
                    }
                });
            } else {
                // Create new call
                await createCallMutation.mutateAsync({
                    leadId: id,
                    callData: {
                        details: logData.details.trim(),
                        dateTime: isoDate,
                        callResult: logData.results.trim()
                    }
                });
            }

            setIsLogModalOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Failed to create/update call:', error);
            alert(`Failed to ${editingItem ? 'update' : 'create'} call: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleMeetingCreate = async (meetingData: { details: string; date: string }, _file?: File | null) => {
        if (!id) return;

        // Validate required fields
        if (!meetingData.details || !meetingData.details.trim()) {
            alert('Details are required');
            return;
        }

        if (meetingData.details.length > 5000) {
            alert('Details must not exceed 5000 characters');
            return;
        }

        if (!meetingData.date) {
            alert('Date and time are required');
            return;
        }

        try {
            // Convert datetime-local format to ISO string
            const dateObj = new Date(meetingData.date);
            if (isNaN(dateObj.getTime())) {
                alert('Invalid date format. Date and time must be a valid ISO 8601 date string');
                return;
            }
            const isoDate = dateObj.toISOString();

            if (editingItem && editingItem.item.originalData?.type === 'meeting') {
                // Update existing meeting
                await updateMeetingMutation.mutateAsync({
                    leadId: id,
                    meetingId: editingItem.item.originalData.id,
                    meetingData: {
                        details: meetingData.details.trim(),
                        dateTime: isoDate
                    }
                });
            } else {
                // Create new meeting
                await createMeetingMutation.mutateAsync({
                    leadId: id,
                    meetingData: {
                        details: meetingData.details.trim(),
                        dateTime: isoDate
                    }
                });
            }

            setIsMeetingModalOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Failed to create/update meeting:', error);
            alert(`Failed to ${editingItem ? 'update' : 'create'} meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };


    const handleInviteSend = async (email: string, listing: string) => {
        if (!id) return;

        try {
            // 1. Update status to Working if it's New
            if (status === 'NEW') {
                await updateLeadMutation.mutateAsync({
                    id,
                    data: { status: 'WORKING' }
                });
                setStatus('WORKING');
            }

            // 2. Add Activity to timeline
            const activityData: CreateActivityDto = {
                type: 'EMAIL',
                description: `Sent invitation to ${email} for listing: ${listing}`,
                metadata: {
                    email,
                    listing,
                }
            };

            await createActivityMutation.mutateAsync({
                leadId: id,
                activityData
            });

            setIsInviteModalOpen(false);
        } catch (error) {
            console.error('Failed to send invitation:', error);
            alert(`Failed to send invitation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleDeleteActivity = async (dayId: number, itemId: string) => {
        if (!id) {
            console.error('No lead ID available');
            return;
        }

        const item = transformedActivities
            .find(day => day.id === dayId)
            ?.items.find(item => item.id === itemId);

        if (!item) {
            console.error('Item not found:', { dayId, itemId });
            return;
        }

        if (!item.originalData) {
            console.error('Item originalData not found:', item);
            return;
        }

        try {
            const { type, id: entityId } = item.originalData;
            console.log('Deleting item:', { type, entityId, leadId: id });

            if (type === 'note') {
                await deleteNoteMutation.mutateAsync({
                    leadId: id,
                    noteId: entityId
                });
            } else if (type === 'task') {
                await deleteTaskMutation.mutateAsync({
                    leadId: id,
                    taskId: entityId
                });
            } else if (type === 'call') {
                await deleteCallMutation.mutateAsync({
                    leadId: id,
                    callId: entityId
                });
            } else if (type === 'meeting') {
                await deleteMeetingMutation.mutateAsync({
                    leadId: id,
                    meetingId: entityId
                });
            } else if (type === 'activity') {
                await deleteActivityMutation.mutateAsync({
                    leadId: id,
                    activityId: entityId
                });
            } else {
                console.error('Unknown item type:', type);
                alert(`Cannot delete: Unknown item type ${type}`);
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert(`Failed to delete item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleEditActivity = (dayId: number, item: any) => {
        setEditingItem({ dayId, item });
        if (item.type === 'Note') {
            setIsNoteModalOpen(true);
        } else if (item.type === 'Meeting' || item.originalData?.type === 'meeting') {
            setIsMeetingModalOpen(true);
        } else if (item.type === 'Call' || item.originalData?.type === 'call') {
            setIsLogModalOpen(true);
        } else if (item.type === 'Task') {
            setIsTaskModalOpen(true);
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!id) return;

        setIsDeleting(true);
        try {
            await deleteLeadMutation.mutateAsync(id);
            navigate('/dashboard/leasing/leads');
        } catch (error) {
            console.error('Failed to delete lead:', error);
            alert('Failed to delete lead. Please try again.');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setShowActionMenu(false);
        }
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit pb-10 transition-all duration-300`}>
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] ml-2">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/leasing/leads')}>Leads</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{leadInfo.fullName}</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2.5rem] shadow-sm border border-[#E0E0E0] mx-2">
                {isLoadingLead ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Loading lead details...</p>
                    </div>
                ) : leadError ? (
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">Error loading lead</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {leadError instanceof Error ? leadError.message : 'An unexpected error occurred'}
                        </p>
                    </div>
                ) : !lead ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Lead not found</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-start gap-3 mb-6 ml-2">
                            <div className="flex items-center gap-2">
                                <button onClick={() => navigate(-1)} className="p-1 hover:text-gray-600 transition-colors">
                                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                                </button>
                                <h1 className="text-2xl font-bold text-gray-900">{leadInfo.fullName}</h1>
                            </div>

                            <div className={`${status === 'NEW' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                status === 'WORKING' ? 'bg-[#82D95B]/20 text-[#2D6A4F] border-[#82D95B]/40' :
                                    'bg-red-100 text-red-700 border-red-200'
                                } h-9 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold border transition-colors`}>
                                {getStatusLabel(status)} <Clock className="w-3.5 h-3.5" />
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setShowActionMenu(!showActionMenu)}
                                    className="bg-[#3A6D6C] text-white w-10 h-8 flex items-center justify-center rounded-lg shadow-md hover:bg-[#2c5251] transition-all"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                {showActionMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-50"
                                            onClick={() => setShowActionMenu(false)}
                                        />
                                        <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-[1.2rem] shadow-xl border border-gray-100 py-2 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-outfit">
                                            <button
                                                onClick={() => id && navigate(`/dashboard/leasing/leads/edit/${id}`)}
                                                className="w-full text-left px-5 py-2 hover:bg-gray-50 text-gray-700 font-bold flex items-center gap-2 transition-colors text-xs"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" /> Edit Lead
                                            </button>

                                            <div className="h-[1px] bg-gray-100 my-1 mx-4" />

                                            <h4 className="px-5 py-1 text-[9px] uppercase tracking-wider text-gray-400 font-black">Change Status</h4>

                                            {(['NEW', 'WORKING', 'CLOSED'] as LeadStatus[]).map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={async () => {
                                                        if (id && s !== status) {
                                                            try {
                                                                const oldStatus = status;
                                                                await updateLeadMutation.mutateAsync({
                                                                    id,
                                                                    data: { status: s }
                                                                });
                                                                setStatus(s);

                                                                // Create activity for status change
                                                                try {
                                                                    console.log('Creating activity for status change:', id, oldStatus, s);
                                                                    const activity = await createActivityMutation.mutateAsync({
                                                                        leadId: id,
                                                                        activityData: {
                                                                            type: 'STATUS_CHANGE',
                                                                            description: `Lead status changed from ${getStatusLabel(oldStatus)} to ${getStatusLabel(s)}`,
                                                                            metadata: {
                                                                                action: 'STATUS_CHANGED',
                                                                                oldStatus: oldStatus,
                                                                                newStatus: s
                                                                            }
                                                                        }
                                                                    });
                                                                    console.log('Activity created successfully for status change:', activity);
                                                                } catch (activityError) {
                                                                    console.error('Failed to create activity for status change:', activityError);
                                                                    alert(`Warning: Status changed but failed to log activity: ${activityError instanceof Error ? activityError.message : 'Unknown error'}`);
                                                                }
                                                            } catch (error) {
                                                                console.error('Failed to update lead status:', error);
                                                            }
                                                        }
                                                        setShowActionMenu(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-2 transition-colors text-xs flex items-center justify-between ${status === s
                                                        ? 'bg-[#E7F0E5] text-[#2D6A4F] font-bold'
                                                        : 'text-gray-600 font-medium hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {getStatusLabel(s)}
                                                    {status === s && <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />}
                                                </button>
                                            ))}

                                            <div className="h-[1px] bg-gray-100 my-1 mx-4" />

                                            <button
                                                onClick={() => {
                                                    if (id && !isDeleting) {
                                                        setIsDeleteModalOpen(true);
                                                        setShowActionMenu(false); // Close menu
                                                    }
                                                }}
                                                disabled={isDeleting}
                                                className="w-full text-left px-5 py-2 hover:bg-red-50 text-red-500 font-bold flex items-center gap-2 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> {isDeleting ? 'Deleting...' : 'Delete Lead'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Top Section Card */}
                        <div className="bg-[#F0F0F6] pt-4 px-6 pb-0 rounded-[2.5rem] border border-[#E0E0E0] shadow-sm mb-6">
                            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                                {/* Profile Card */}
                                <div className="bg-[#ECF3EA] p-4 rounded-[2rem] border border-[#E0E0E0] shadow-sm flex flex-col items-center mb-4">
                                    <div className="w-16 h-16 bg-[#C9E5BC] rounded-[1.2rem] flex items-center justify-center mb-2.5 shadow-sm relative">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                                            <User className="w-5 h-5 text-[#C9E5BC]" strokeWidth={2.5} />
                                        </div>
                                    </div>

                                    <div className="bg-[#E3EBDE] px-4 py-1 rounded-full text-[10px] font-bold text-[#4B5563] mb-3 shadow-[inset_2.49px_2.49px_0px_0px_#53535340] border border-gray-100">
                                        Prospective tenant
                                    </div>

                                    <div className="w-full bg-[#3E706F] rounded-lg p-2.5 text-center text-white space-y-0.5 mb-3 shadow-lg">
                                        <p className="font-bold text-[10px]">{leadInfo.email}</p>
                                        <p className="font-bold text-[10px]">{leadInfo.phone}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 w-full">
                                        <button
                                            onClick={() => setIsInviteModalOpen(true)}
                                            className="bg-[#3E706F] text-white py-2.5 px-2 rounded-lg text-[10px] font-bold shadow-md hover:opacity-90 transition-all"
                                        >
                                            Invite to Apply
                                        </button>
                                        <button
                                            onClick={() => navigate(`/dashboard/messages?leadId=${id}&leadName=${encodeURIComponent(leadInfo.fullName || 'Lead')}`)}
                                            className="bg-[#D9D9D9] text-[#222] py-2.5 px-2 rounded-lg text-[10px] font-bold border border-[#C9C9C9] shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.25)] hover:bg-gray-300 transition-all uppercase tracking-tight"
                                        >
                                            Send a Text Message
                                        </button>
                                    </div>
                                </div>

                                {/* Activity Filter Section */}
                                <div className="flex flex-col justify-between">
                                    {/* Add Activity Controls */}
                                    <div className="bg-[#3E706F] p-4 rounded-[2rem] shadow-xl flex flex-col items-center justify-center gap-3 relative">
                                        <h3 className="text-white font-bold text-sm">Add Activity</h3>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            <button
                                                onClick={() => setIsNoteModalOpen(true)}
                                                className="bg-[#82D95B] text-white px-4 py-2 rounded-full flex items-center gap-1.5 text-sm font-bold shadow-lg hover:scale-105 transition-transform"
                                            >
                                                <FileText className="w-4 h-4" /> Note <div className="w-5 h-5 flex items-center justify-center border-2 border-white rounded-full"><Plus className="w-3 h-3 stroke-[3]" /></div>
                                            </button>
                                            <button
                                                onClick={() => setIsTaskModalOpen(true)}
                                                className="bg-[#82D95B] text-white px-4 py-2 rounded-full flex items-center gap-1.5 text-sm font-bold shadow-lg hover:scale-105 transition-transform"
                                            >
                                                <CheckSquare className="w-4 h-4" /> Task <div className="w-5 h-5 flex items-center justify-center border-2 border-white rounded-full"><Plus className="w-3 h-3 stroke-[3]" /></div>
                                            </button>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowLogOptions(!showLogOptions)}
                                                    className="bg-[#82D95B] text-white px-4 py-2 rounded-full flex items-center gap-1.5 text-sm font-bold shadow-lg hover:scale-105 transition-transform"
                                                >
                                                    <LogIn className="w-4 h-4" /> Log <div className="w-5 h-5 flex items-center justify-center border-2 border-white rounded-full"><Plus className="w-3 h-3 stroke-[3]" /></div>
                                                </button>
                                                {showLogOptions && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-50"
                                                            onClick={() => setShowLogOptions(false)}
                                                        />
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-lg shadow-xl border border-gray-100 py-2 w-40 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                            <button
                                                                onClick={() => {
                                                                    setIsLogModalOpen(true);
                                                                    setShowLogOptions(false);
                                                                }}
                                                                className="w-full text-center px-5 py-2.5 hover:bg-[#F0F4F8] text-[#3E706F] font-bold transition-colors text-xs border-b border-gray-300 last:border-0"
                                                            >
                                                                Log a call
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setIsMeetingModalOpen(true);
                                                                    setShowLogOptions(false);
                                                                }}
                                                                className="w-full text-center px-5 py-2.5 hover:bg-[#F0F4F8] text-[#3E706F] font-bold transition-colors text-xs"
                                                            >
                                                                Log a meeting
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Filters */}
                                    <div className="bg-[#C9E5BC] p-6 px-20 rounded-t-[2.2rem] flex gap-10 shadow-inner">
                                        {['All', 'Notes', 'Tasks', 'Activity'].map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setActiveFilter(filter)}
                                                style={activeFilter === filter ? { borderBottom: '3px solid #FFFFFF' } : {}}
                                                className={`flex-1 py-2.5 px-1 rounded-full font-bold text-xs transition-all shadow-md ${activeFilter === filter
                                                    ? 'bg-[#82D95B] text-white'
                                                    : 'bg-[#D9D9D9] text-[#222] hover:bg-gray-200'
                                                    }`}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Section */}
                        <div className="bg-[#F0F0F650] p-8 rounded-[2.5rem] border border-white shadow-sm">
                            {/* Timeline */}
                            {(() => {
                                const filteredActivities = transformedActivities.map(day => ({
                                    ...day,
                                    items: day.items.filter(item => {
                                        if (activeFilter === 'All') return true;
                                        if (activeFilter === 'Notes' && item.type === 'Note') return true;
                                        if (activeFilter === 'Tasks' && item.type === 'Task') return true;
                                        if (activeFilter === 'Activity' && item.type === 'Activity') return true;
                                        return false;
                                    })
                                })).filter(day => day.items.length > 0);

                                if (filteredActivities.length === 0) {
                                    const filterLabel = activeFilter === 'All' ? 'activities' : activeFilter.toLowerCase();
                                    return (
                                        <div className="flex flex-col items-center justify-center py-24 animate-in fade-in zoom-in duration-500">
                                            <div className="w-20 h-20 bg-white rounded-[1.8rem] shadow-xl flex flex-col items-center justify-center gap-1.5 mb-6 border border-gray-50 relative overflow-hidden group hover:scale-105 transition-transform">
                                                <div className="w-8 h-1 bg-gray-300 rounded-full" />
                                                <div className="w-8 h-1 bg-gray-300 rounded-full" />
                                                <div className="w-8 h-1 bg-gray-300 rounded-full" />
                                                <div className="absolute bottom-3 right-3 bg-[#3E706F] text-white rounded-md p-0.5 shadow-lg transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                                                    <Plus className="w-4 h-4 stroke-[3]" />
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-[#4B5563] mb-2">No {filterLabel}</h3>
                                            <p className="text-[#6B7280] font-medium text-base">
                                                There is no added {filterLabel} on this page.
                                            </p>
                                        </div>
                                    );
                                }

                                return filteredActivities.map((day) => (
                                    <div key={day.id} className="mb-10">
                                        {/* Date Badge - Attached to card */}
                                        <div className="inline-block bg-gradient-to-r from-[#17D16A] to-[#8EE238] text-white px-8 py-2.5 rounded-t-[1.6rem] text-lg font-bold shadow-sm relative z-10 -mb-[1px]">
                                            {day.date}
                                        </div>

                                        <div className="space-y-4 relative">
                                            {day.items.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className={`bg-white p-5 shadow-sm border border-gray-100 flex items-center gap-6 relative group ${index === 0 ? 'rounded-[2rem] rounded-tl-none' : 'rounded-[2rem]'
                                                        }`}
                                                >
                                                    {/* Left Info Group - Premium Box */}
                                                    <div className="flex items-center gap-3 bg-[#EAF5E8] p-2.5 rounded-[1.8rem] border border-[#D9EDD3] shadow-sm">
                                                        <div className="flex flex-col items-center relative">
                                                            <div className="w-14 h-14 bg-[#C9E5BC] rounded-[1rem] flex items-center justify-center relative shadow-inner overflow-hidden">
                                                                {item.image ? (
                                                                    <img src={item.image} alt="Upload" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm -mt-3">
                                                                        <User className="w-5 h-5 text-[#C9E5BC]" strokeWidth={2.5} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="bg-[#82D95B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight shadow-sm absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                                                                {item.type}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5 min-w-[90px]">
                                                            <div className="bg-[#3E706F] text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-md text-center">
                                                                {item.user}
                                                            </div>
                                                            <div className="bg-[#D9E3D8] text-[#555] px-3 py-1 rounded-lg text-[9px] font-bold shadow-inner text-center">
                                                                {item.time}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Activity Message Bubble */}
                                                    <div
                                                        className="bg-[#E7F0E5]/60 px-4 py-2.5 rounded-full text-[#374151] font-normal text-xs border border-[#D1E2CF] shadow-inner backdrop-blur-[4.979720592498779px] w-fit"
                                                    >
                                                        {item.text}
                                                    </div>

                                                    {/* Action Icons - Not for activity*/}
                                                    {(item.type !== 'Activity') && (
                                                        <div className="absolute top-3 right-5 flex items-center gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditActivity(day.id, item);
                                                                }}
                                                                className="text-[#3E706F] hover:scale-110 transition-transform p-1.5 "
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteActivity(day.id, item.id);
                                                                }}
                                                                className="text-red-500 hover:scale-110 transition-transform p-1.5 "
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </>
                )}
            </div>

            <AddNoteModal
                isOpen={isNoteModalOpen}
                onClose={() => {
                    setIsNoteModalOpen(false);
                    setEditingItem(null);
                }}
                onConfirm={handleNoteConfirm}
                initialNote={editingItem?.item.type === 'Note' ? editingItem.item.text : ''}
                initialFile={editingItem?.item.image}
            />
            <AddTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => {
                    setIsTaskModalOpen(false);
                    setEditingItem(null);
                }}
                onCreate={handleTaskCreate}
                initialData={editingItem?.item.type === 'Task' ? {
                    details: editingItem.item.originalData?.title || editingItem.item.originalData?.details || '',
                    date: editingItem.item.originalData?.date || '',
                    assignee: editingItem.item.originalData?.assignee || '',
                    image: editingItem.item.image
                } : undefined}
            />
            <AddLogModal
                isOpen={isLogModalOpen}
                onClose={() => {
                    setIsLogModalOpen(false);
                    setEditingItem(null);
                }}
                onCreate={handleLogCreate}
                initialData={editingItem?.item.originalData?.type === 'call' ? {
                    details: editingItem.item.originalData?.details || '',
                    date: editingItem.item.originalData?.date || '',
                    results: editingItem.item.originalData?.results || '',
                    image: editingItem.item.image
                } : undefined}
            />
            <AddMeetingModal
                isOpen={isMeetingModalOpen}
                onClose={() => {
                    setIsMeetingModalOpen(false);
                    setEditingItem(null);
                }}
                onCreate={handleMeetingCreate}
                initialData={editingItem?.item.originalData?.type === 'meeting' ? {
                    details: editingItem.item.originalData?.details || '',
                    date: editingItem.item.originalData?.date || '',
                    image: editingItem.item.image
                } : undefined}
            />
            <InviteToApplyModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSend={handleInviteSend}
                initialEmail={leadInfo.email || undefined}
                listings={listings}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Lead"
                message="Are you sure you want to delete this lead? This action cannot be undone."
                itemName="this lead"
            />
        </div >
    );
};

export default LeadDetail;