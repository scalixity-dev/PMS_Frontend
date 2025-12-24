import React, { useState, useMemo } from 'react';
import { Check, Plus, Pencil, Trash2, Loader2, ChevronDown } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import AddTaskModal from './components/AddTaskModal';
import TaskDetailSideModal from './components/TaskDetailSideModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { useGetAllTasks, useDeleteTask, useUpdateTask } from '../../../../hooks/useTaskQueries';
import { useGetAllProperties } from '../../../../hooks/usePropertyQueries';
import type { TaskFilters } from '../../../../services/task.service';

// Task Interface
export interface Task {
    id: string | number; // Support both string (from API) and number (for backward compatibility)
    title: string;
    description: string;
    name: string;
    avatar: string;
    date: string;
    time?: string;
    status: string;
    property: string;
    frequency: string;
    isRecurring: boolean;
    endDate?: string;
}

const Tasks: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [selectedTaskIds, setSelectedTaskIds] = useState<(string | number)[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Fetch properties for filter dropdown
    const { data: properties = [] } = useGetAllProperties();

    // Transform frontend filters to backend format
    const backendFilters = useMemo((): TaskFilters | undefined => {
        const backendFilter: TaskFilters = {};

        // Transform status filter: 'active' -> ['OPEN', 'IN_PROGRESS', 'ON_HOLD'], 'resolved' -> ['RESOLVED', 'COMPLETED', 'CANCELLED']
        if (filters.status && filters.status.length > 0) {
            const statusMap: Record<string, string[]> = {
                'active': ['OPEN', 'IN_PROGRESS', 'ON_HOLD'],
                'resolved': ['RESOLVED', 'COMPLETED', 'CANCELLED'],
            };
            const backendStatuses: string[] = [];
            filters.status.forEach(status => {
                if (statusMap[status]) {
                    backendStatuses.push(...statusMap[status]);
                }
            });
            if (backendStatuses.length > 0) {
                backendFilter.status = backendStatuses;
            }
        }

        // Transform property filter: use property IDs
        if (filters.property && filters.property.length > 0) {
            backendFilter.propertyId = filters.property;
        }

        // Date filter: 'today' | 'week' (matches backend)
        if (filters.date && filters.date.length > 0) {
            backendFilter.date = filters.date[0] as 'today' | 'week';
        }

        // Transform frequency filter: uppercase values
        if (filters.frequency && filters.frequency.length > 0) {
            backendFilter.frequency = filters.frequency.map(f => f.toUpperCase());
        }

        return Object.keys(backendFilter).length > 0 ? backendFilter : undefined;
    }, [filters]);

    // Fetch tasks from API
    const { data: tasks = [], isLoading: isLoadingTasks } = useGetAllTasks(backendFilters);
    const deleteTaskMutation = useDeleteTask();
    const updateTaskMutation = useUpdateTask();

    // Filter tasks by search query (client-side since backend doesn't support search)
    const filteredTasks = useMemo(() => {
        if (!searchQuery.trim()) {
            return tasks;
        }
        const query = searchQuery.toLowerCase();
        return tasks.filter(task =>
            task.name.toLowerCase().includes(query) ||
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
        );
    }, [tasks, searchQuery]);

    // Calculate stats
    const stats = useMemo(() => {
        const activeTasks = tasks.filter(t => t.status === 'Active').length;
        const resolvedTasks = tasks.filter(t => t.status === 'Resolved').length;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTasks = tasks.filter(t => {
            if (!t.date) return false;
            // Parse date format "DD MMM, YYYY"
            const dateParts = t.date.split(' ');
            if (dateParts.length < 3) return false;
            const day = parseInt(dateParts[0]);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = monthNames.indexOf(dateParts[1]);
            const year = parseInt(dateParts[2]);
            if (month === -1) return false;
            const taskDate = new Date(year, month, day);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        }).length;

        const recurringTasks = tasks.filter(t => t.isRecurring).length;

        return { activeTasks, resolvedTasks, todayTasks, recurringTasks };
    }, [tasks]);

    const handleSaveTask = () => {
        // Modal handles API calls internally, just close it
        setIsAddModalOpen(false);
        setEditingTask(null);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsAddModalOpen(true);
        if (selectedTask) setSelectedTask(null); // Close detail modal if open
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingTask(null);
    };

    const handleDeleteClick = (task: Task) => {
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;

        try {
            const taskId = typeof taskToDelete.id === 'number' ? taskToDelete.id.toString() : taskToDelete.id;
            await deleteTaskMutation.mutateAsync(taskId);

            // Cleanup
            if (selectedTask?.id === taskToDelete.id) {
                setSelectedTask(null);
            }
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        } catch (error) {
            console.error('Failed to delete task:', error);
            // Error handling could show a toast notification here
        }
    };

    // Map frontend status to backend status
    // Accepts optional currentBackendStatus to preserve granular status when toggling between Active/Resolved
    const mapStatusToBackend = (
        frontendStatus: string,
        currentBackendStatus?: string
    ): 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED' | 'COMPLETED' | 'CANCELLED' => {
        // Normalize frontend status (case-insensitive, trimmed)
        const normalizedStatus = frontendStatus.trim();
        
        // Active status group: OPEN, IN_PROGRESS, ON_HOLD
        if (normalizedStatus === 'Active' || normalizedStatus === 'Open' || normalizedStatus === 'In Progress' || normalizedStatus === 'On Hold') {
            // If we have current backend status and it's already in the Active group, preserve it
            if (currentBackendStatus) {
                const current = currentBackendStatus.toUpperCase();
                if (current === 'IN_PROGRESS' || current === 'ON_HOLD') {
                    return current as 'IN_PROGRESS' | 'ON_HOLD';
                }
            }
            // Map specific frontend values to their backend equivalents
            if (normalizedStatus === 'In Progress') {
                return 'IN_PROGRESS';
            }
            if (normalizedStatus === 'On Hold') {
                return 'ON_HOLD';
            }
            if (normalizedStatus === 'Open') {
                return 'OPEN';
            }
            // Default 'Active' -> 'OPEN'
            return 'OPEN';
        }
        
        // Resolved status group: RESOLVED, COMPLETED, CANCELLED
        if (normalizedStatus === 'Resolved' || normalizedStatus === 'Completed' || normalizedStatus === 'Cancelled') {
            // If we have current backend status and it's already in the Resolved group, preserve it
            if (currentBackendStatus) {
                const current = currentBackendStatus.toUpperCase();
                if (current === 'COMPLETED' || current === 'CANCELLED') {
                    return current as 'COMPLETED' | 'CANCELLED';
                }
            }
            // Map specific frontend values to their backend equivalents
            if (normalizedStatus === 'Completed') {
                return 'COMPLETED';
            }
            if (normalizedStatus === 'Cancelled') {
                return 'CANCELLED';
            }
            // Default 'Resolved' -> 'RESOLVED'
            return 'RESOLVED';
        }
        
        // Fallback: if status doesn't match known values, try to preserve current or default to OPEN
        if (currentBackendStatus) {
            const current = currentBackendStatus.toUpperCase();
            if (['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'COMPLETED', 'CANCELLED'].includes(current)) {
                return current as 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED' | 'COMPLETED' | 'CANCELLED';
            }
        }
        
        // Ultimate fallback
        console.warn(`[Tasks] Unknown frontend status "${frontendStatus}", defaulting to OPEN`);
        return 'OPEN';
    };

    // Handle status change
    // Note: To preserve granular status (e.g., IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED),
    // we would need to fetch the current backend status from the API. For now, we use
    // the simplified Active/Resolved mapping which defaults to OPEN/RESOLVED.
    const handleStatusChange = async (task: Task, newStatus: 'Active' | 'Resolved') => {
        try {
            const taskId = typeof task.id === 'number' ? task.id.toString() : task.id;
            // TODO: Fetch current backend status from API to preserve granularity
            // For now, we don't have access to the original backend status, so we use defaults
            const backendStatus = mapStatusToBackend(newStatus);
            
            await updateTaskMutation.mutateAsync({
                id: taskId,
                updateData: {
                    status: backendStatus,
                },
            });

            // Update local state if task is selected
            if (selectedTask?.id === task.id) {
                setSelectedTask({ ...selectedTask, status: newStatus });
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
            // Error handling could show a toast notification here
        }
    };

    // Property filter options from API
    const propertyFilterOptions = useMemo(() => {
        return properties.map(p => ({
            value: p.id,
            label: p.propertyName
        }));
    }, [properties]);

    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'active', label: 'Active' },
            { value: 'resolved', label: 'Resolved' },
        ],
        property: propertyFilterOptions,
        date: [
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
        ],
        frequency: [
            { value: 'DAILY', label: 'Daily' },
            { value: 'WEEKLY', label: 'Weekly' },
            { value: 'MONTHLY', label: 'Monthly' },
            { value: 'QUARTERLY', label: 'Quarterly' },
            { value: 'YEARLY', label: 'Yearly' },
            { value: 'ONCE', label: 'Once' },
        ]
    };

    const filterLabels = {
        status: 'Status',
        property: 'Property & Units',
        date: 'Date',
        frequency: 'Frequency'
    };

    const handleSelectAll = () => {
        if (selectedTaskIds.length === filteredTasks.length) {
            setSelectedTaskIds([]);
        } else {
            setSelectedTaskIds(filteredTasks.map(task => task.id));
        }
    };

    const handleSelectTask = (id: string | number) => {
        if (selectedTaskIds.includes(id)) {
            setSelectedTaskIds(selectedTaskIds.filter(taskId => taskId !== id));
        } else {
            setSelectedTaskIds([...selectedTaskIds, id]);
        }
    };

    const isAllSelected = filteredTasks.length > 0 && selectedTaskIds.length === filteredTasks.length;

    return (
        <div className="max-w-6xl mx-auto min-h-screen">
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Task</span>
            </div>

            <div className="p-8 bg-[#DFE5E3] min-h-screen rounded-[2rem]">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#2c5251] transition-colors"
                    >
                        Add Task
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Top Cards */}
                <div className="flex gap-4 mb-8 overflow-x-auto bg-[#F0F0F6] rounded-[2rem] p-4 shadow-sm">
                    {/* Task Card */}
                    <div className="bg-[#7BD747] p-1.5 rounded-full flex items-center min-w-fit pr-1.5 shadow-sm">
                        <span className="text-white font-medium px-6">Task</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full">
                                <span className="font-bold text-gray-800 text-sm">{stats.activeTasks}</span>
                                <span className="text-xs text-gray-500">Open</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full">
                                <span className="font-bold text-gray-800 text-sm">{stats.resolvedTasks}</span>
                                <span className="text-xs text-gray-500">Resolved</span>
                            </div>
                        </div>
                    </div>

                    {/* Today Card */}
                    <div className="bg-[#7BD747] p-1.5 rounded-full flex items-center min-w-fit pr-1.5 shadow-sm">
                        <span className="text-white font-medium px-6">Today</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full">
                                <span className="font-bold text-gray-800 text-sm">{stats.todayTasks}</span>
                                <span className="text-xs text-gray-500">Tasks</span>
                            </div>
                        </div>
                    </div>

                    {/* Recurring Card */}
                    <div className="bg-[#7BD747] p-1.5 rounded-full flex items-center min-w-fit pr-1.5 shadow-sm">
                        <span className="text-white font-medium px-6">Recurring</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full">
                                <span className="font-bold text-gray-800 text-sm">{stats.recurringTasks}</span>
                                <span className="text-xs text-gray-500">Tasks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setFilters}
                    showMoreFilters={false}
                    showClearAll={false}
                />

                {/* Table Section */}
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8">
                    {/* Table Header */}
                    <div className="text-white px-6 py-4 grid grid-cols-[40px_1.5fr_1.5fr_1fr_1.5fr_1fr_120px_80px] gap-4 items-center text-sm font-medium">
                        <div className="flex items-center justify-center ml-2">
                            <button onClick={handleSelectAll} className="flex items-center justify-center">
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isAllSelected ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                    {isAllSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                            </button>
                        </div>
                        <div>Task Title</div>
                        <div>Assigned To</div>
                        <div>Property</div>
                        <div>Date</div>
                        <div>Frequency</div>
                        <div>Status</div>
                        <div>Actions</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t">
                    {isLoadingTasks ? (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C] mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Loading tasks...</p>
                        </div>
                    ) : filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => {
                            const isSelected = selectedTaskIds.includes(task.id);
                            return (
                                <div
                                    key={task.id}
                                    onClick={() => setSelectedTask(task)}
                                    className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[40px_1.5fr_1.5fr_1fr_1.5fr_1fr_120px_80px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectTask(task.id);
                                            }}
                                            className="flex items-center justify-center"
                                        >
                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                        </button>
                                    </div>

                                    <div className="font-semibold text-gray-800 text-sm truncate">{task.title}</div>

                                    <div className="flex items-center gap-3">
                                        <img src={task.avatar} alt={task.name} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-semibold text-gray-800 text-sm">{task.name}</span>
                                    </div>

                                    <div className="text-[#2E6819] text-sm font-semibold">{task.property}</div>

                                    <div className="text-gray-600 text-sm font-medium">{task.date}</div>

                                    <div className="text-gray-600 text-sm font-medium capitalize">{task.frequency}</div>

                                    <div className="relative">
                                        <select
                                            value={task.status}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange(task, e.target.value as 'Active' | 'Resolved');
                                            }}
                                            disabled={updateTaskMutation.isPending}
                                            className={`appearance-none px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 pr-8 ${
                                                task.status === 'Resolved'
                                                    ? 'bg-[#E8F8F0] text-[#2E6819] focus:ring-[#2E6819]'
                                                    : 'bg-yellow-100 text-yellow-700 focus:ring-yellow-500'
                                            } ${updateTaskMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                        <ChevronDown 
                                            className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${
                                                task.status === 'Resolved' ? 'text-[#2E6819]' : 'text-yellow-700'
                                            }`} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditTask(task);
                                            }}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(task);
                                            }}
                                            className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <p className="text-gray-500 text-lg">No tasks found matching your filters</p>
                        </div>
                    )}
                </div>
            </div>

            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTask}
                taskToEdit={editingTask}
            />
            <TaskDetailSideModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onEdit={() => selectedTask && handleEditTask(selectedTask)}
                onDelete={() => selectedTask && handleDeleteClick(selectedTask)}
                onStatusChange={(task, newStatus) => {
                    setSelectedTask({ ...task, status: newStatus });
                }}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    if (!deleteTaskMutation.isPending) {
                        setIsDeleteModalOpen(false);
                        setTaskToDelete(null);
                    }
                }}
                onConfirm={confirmDeleteTask}
                taskTitle={taskToDelete?.title}
                isLoading={deleteTaskMutation.isPending}
            />
        </div>
    );
};

export default Tasks;
