import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Check, Plus, Pencil, Trash2, Loader2, ChevronDown, MoreHorizontal, ClipboardList } from 'lucide-react';
import DashboardFilter, { type FilterOption, type SavedFilter } from '../../components/DashboardFilter';
import AddTaskModal from './components/AddTaskModal';
import TaskDetailSideModal from './components/TaskDetailSideModal';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import { useGetAllTasks, useDeleteTask, useUpdateTask } from '../../../../hooks/useTaskQueries';
import { useGetAllProperties } from '../../../../hooks/usePropertyQueries';
import type { TaskFilters } from '../../../../services/task.service';

// Task Interface
export interface Task {
    id: string | number;
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
    isAllDay?: boolean;
}

const Tasks: React.FC = () => {
    const location = useLocation();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [selectedTaskIds, setSelectedTaskIds] = useState<(string | number)[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [activeSavedFilter, setActiveSavedFilter] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<string | number | null>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Mock saved filters state
    const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
        {
            name: 'Urgent Tasks',
            filters: {
                status: ['active'],
                date: ['today']
            }
        }
    ]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(null);
            }
        };

        if (mobileMenuOpen !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mobileMenuOpen]);

    // Check if navigated from Dashboard with openAddModal state
    useEffect(() => {
        if (location.state?.openAddModal) {
            setIsAddModalOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Fetch properties for filter dropdown
    const { data: properties = [] } = useGetAllProperties();

    // Transform frontend filters to backend format
    const backendFilters = useMemo((): TaskFilters | undefined => {
        const backendFilter: TaskFilters = {};

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

        if (filters.property && filters.property.length > 0) {
            backendFilter.propertyId = filters.property;
        }

        if (filters.date && filters.date.length > 0) {
            backendFilter.date = filters.date[0] as 'today' | 'week';
        }

        if (filters.frequency && filters.frequency.length > 0) {
            backendFilter.frequency = filters.frequency.map(f => f.toUpperCase());
        }

        return Object.keys(backendFilter).length > 0 ? backendFilter : undefined;
    }, [filters]);

    // Fetch tasks from API
    const { data: tasks = [], isLoading: isLoadingTasks } = useGetAllTasks(backendFilters);
    const deleteTaskMutation = useDeleteTask();
    const updateTaskMutation = useUpdateTask();

    // Filter tasks by search query
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
            try {
                const taskDate = new Date(t.date);
                if (isNaN(taskDate.getTime())) return false;
                taskDate.setHours(0, 0, 0, 0);
                return taskDate.getTime() === today.getTime();
            } catch {
                return false;
            }
        }).length;

        const recurringTasks = tasks.filter(t => t.isRecurring).length;

        return { activeTasks, resolvedTasks, todayTasks, recurringTasks };
    }, [tasks]);

    const handleSaveTask = () => {
        setIsAddModalOpen(false);
        setEditingTask(null);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsAddModalOpen(true);
        setMobileMenuOpen(null);
        if (selectedTask) setSelectedTask(null);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingTask(null);
    };

    const handleDeleteClick = (task: Task) => {
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
        setMobileMenuOpen(null);
    };

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;

        try {
            const taskId = typeof taskToDelete.id === 'number' ? taskToDelete.id.toString() : taskToDelete.id;
            await deleteTaskMutation.mutateAsync(taskId);

            if (selectedTask?.id === taskToDelete.id) {
                setSelectedTask(null);
            }
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const handleSaveFilter = (name: string, filtersToSave: Record<string, string[]>) => {
        const newFilter: SavedFilter = {
            name,
            filters: filtersToSave
        };
        setSavedFilters([...savedFilters, newFilter]);
    };

    const handleSelectSavedFilter = (filter: SavedFilter) => {
        setFilters(filter.filters);
        setActiveSavedFilter(filter.name);
    };

    const handleClearSavedFilter = () => {
        setFilters({});
        setActiveSavedFilter(null);
    };

    const mapStatusToBackend = (
        frontendStatus: string,
        currentBackendStatus?: string
    ): 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED' | 'COMPLETED' | 'CANCELLED' => {
        const normalizedStatus = frontendStatus.trim();

        if (normalizedStatus === 'Active' || normalizedStatus === 'Open' || normalizedStatus === 'In Progress' || normalizedStatus === 'On Hold') {
            if (currentBackendStatus) {
                const current = currentBackendStatus.toUpperCase();
                if (current === 'IN_PROGRESS' || current === 'ON_HOLD') {
                    return current as 'IN_PROGRESS' | 'ON_HOLD';
                }
            }
            if (normalizedStatus === 'In Progress') return 'IN_PROGRESS';
            if (normalizedStatus === 'On Hold') return 'ON_HOLD';
            if (normalizedStatus === 'Open') return 'OPEN';
            return 'OPEN';
        }

        if (normalizedStatus === 'Resolved' || normalizedStatus === 'Completed' || normalizedStatus === 'Cancelled') {
            if (currentBackendStatus) {
                const current = currentBackendStatus.toUpperCase();
                if (current === 'COMPLETED' || current === 'CANCELLED') {
                    return current as 'COMPLETED' | 'CANCELLED';
                }
            }
            if (normalizedStatus === 'Completed') return 'COMPLETED';
            if (normalizedStatus === 'Cancelled') return 'CANCELLED';
            return 'RESOLVED';
        }

        if (currentBackendStatus) {
            const current = currentBackendStatus.toUpperCase();
            if (['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'COMPLETED', 'CANCELLED'].includes(current)) {
                return current as 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED' | 'COMPLETED' | 'CANCELLED';
            }
        }

        console.warn(`[Tasks] Unknown frontend status "${frontendStatus}", defaulting to OPEN`);
        return 'OPEN';
    };

    const handleStatusChange = async (task: Task, newStatus: 'Active' | 'Resolved') => {
        try {
            const taskId = typeof task.id === 'number' ? task.id.toString() : task.id;
            const backendStatus = mapStatusToBackend(newStatus);

            await updateTaskMutation.mutateAsync({
                id: taskId,
                updateData: {
                    status: backendStatus,
                },
            });

            if (selectedTask?.id === task.id) {
                setSelectedTask({ ...selectedTask, status: newStatus });
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
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

    const getStatusDisplay = (status: string) => {
        const normalizedStatus = status.toUpperCase();

        switch (normalizedStatus) {
            case 'RESOLVED':
            case 'COMPLETED':
                return { label: 'Resolved', className: 'bg-[#E8F8F0] text-[#2E6819]' };
            case 'IN_PROGRESS':
            case 'IN PROGRESS':
                return { label: 'In Progress', className: 'bg-blue-50 text-blue-700' };
            case 'ON_HOLD':
            case 'ON HOLD':
                return { label: 'On Hold', className: 'bg-orange-50 text-orange-700' };
            case 'CANCELLED':
                return { label: 'Cancelled', className: 'bg-gray-100 text-gray-600' };
            case 'OPEN':
            case 'ACTIVE':
            default:
                return { label: 'Open', className: 'bg-[#E0E8E7] text-[#3A6D6C]' };
        }
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen transition-all duration-300`}>
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Tasks' }
                ]}
                className="mb-4 md:mb-6"
            />

            <div className="p-4 md:p-8 bg-[#DFE5E3] min-h-screen rounded-[1.5rem] md:rounded-[2rem]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Tasks</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-1 px-3 md:px-4 py-1.5 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#2c5251] transition-colors"
                    >
                        Add Task
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Stats Pills */}
                <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-8 md:bg-[#F0F0F6] md:rounded-[2rem] md:p-4 md:shadow-sm">
                    {/* Resolved Tasks Card */}
                    <div className="bg-[#7BD747] p-1 md:p-1.5 rounded-full flex items-center pr-1 md:pr-1.5 shadow-sm">
                        <span className="text-white font-medium px-3 md:px-6 text-sm md:text-base">Task</span>
                        <div className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-4 py-1 md:py-1.5 rounded-full">
                            <span className="font-bold text-gray-800 text-xs md:text-sm">{stats.resolvedTasks}</span>
                            <span className="text-xs text-gray-500">Resolved</span>
                        </div>
                    </div>

                    {/* Today Card */}
                    <div className="bg-[#7BD747] p-1 md:p-1.5 rounded-full flex items-center pr-1 md:pr-1.5 shadow-sm">
                        <span className="text-white font-medium px-3 md:px-6 text-sm md:text-base">Today</span>
                        <div className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-4 py-1 md:py-1.5 rounded-full">
                            <span className="font-bold text-gray-800 text-xs md:text-sm">{stats.todayTasks}</span>
                            <span className="text-xs text-gray-500">Tasks</span>
                        </div>
                    </div>

                    {/* Open Tasks Card */}
                    <div className="bg-[#7BD747] p-1 md:p-1.5 rounded-full flex items-center pr-1 md:pr-1.5 shadow-sm">
                        <span className="text-white font-medium px-3 md:px-6 text-sm md:text-base">Task</span>
                        <div className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-4 py-1 md:py-1.5 rounded-full">
                            <span className="font-bold text-gray-800 text-xs md:text-sm">{stats.activeTasks}</span>
                            <span className="text-xs text-gray-500">Open</span>
                        </div>
                    </div>

                    {/* Recurring Card */}
                    <div className="bg-[#7BD747] p-1 md:p-1.5 rounded-full flex items-center pr-1 md:pr-1.5 shadow-sm">
                        <span className="text-white font-medium px-3 md:px-6 text-sm md:text-base">Recurring</span>
                        <div className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-4 py-1 md:py-1.5 rounded-full">
                            <span className="font-bold text-gray-800 text-xs md:text-sm">{stats.recurringTasks}</span>
                            <span className="text-xs text-gray-500">Tasks</span>
                        </div>
                    </div>
                </div>

                {/* Filters - Now uses built-in mobile support */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setFilters}
                    showMoreFilters={false}
                    showClearAll={true}
                    savedFilters={savedFilters}
                    onSaveFilter={handleSaveFilter}
                    onSelectSavedFilter={handleSelectSavedFilter}
                    onClearSavedFilter={handleClearSavedFilter}
                    activeSavedFilter={activeSavedFilter}
                    initialFilters={filters}
                    searchPlaceholder="Search tasks..."
                />

                {/* Mobile & Tablet Task Cards */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {isLoadingTasks ? (
                        <div className="text-center py-12 bg-white rounded-2xl sm:col-span-2">
                            <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C] mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Loading tasks...</p>
                        </div>
                    ) : filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => {
                            const statusDisplay = getStatusDisplay(task.status);
                            return (
                                <div
                                    key={task.id}
                                    onClick={() => setSelectedTask(task)}
                                    className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer active:bg-gray-50"
                                >
                                    {/* Title Row */}
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-semibold text-gray-800 text-base flex-1 pr-2">{task.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.className}`}>
                                            {statusDisplay.label}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex">
                                            <span className="text-gray-500 w-24">Property:</span>
                                            <span className="font-medium text-gray-800">{task.property}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-gray-500 w-24">Date:</span>
                                            <span className="font-medium text-gray-800">{task.date}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-gray-500 w-24">Frequency:</span>
                                            <span className="font-medium text-gray-800 capitalize">{task.frequency}</span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                        <div className="text-sm text-gray-500">
                                            Assigned to <span className="font-medium text-gray-800">{task.name}</span>
                                        </div>
                                        <div className="relative" ref={mobileMenuOpen === task.id ? mobileMenuRef : null}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMobileMenuOpen(mobileMenuOpen === task.id ? null : task.id);
                                                }}
                                                className="p-1.5 hover:bg-gray-100 rounded-full"
                                            >
                                                <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                            </button>
                                            {mobileMenuOpen === task.id && (
                                                <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditTask(task);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(task);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl sm:col-span-2">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5F5DC] rounded-2xl mb-4">
                                <ClipboardList className="w-8 h-8 text-[#8B8B4A]" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">No tasks yet</h3>
                            <p className="text-gray-500 text-sm mb-4">Create your first task</p>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="inline-flex items-center justify-center px-6 py-2.5 bg-[#7BD747] text-white font-medium rounded-full hover:bg-[#6bc93a] transition-colors"
                            >
                                Add Task
                            </button>
                        </div>
                    )}
                </div>

                {/* Desktop Table Section */}
                <div className="hidden lg:block">
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
                                                className={`appearance-none px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 pr-8 ${task.status === 'Resolved'
                                                    ? 'bg-[#E8F8F0] text-[#2E6819] focus:ring-[#2E6819]'
                                                    : 'bg-yellow-100 text-yellow-700 focus:ring-yellow-500'
                                                    } ${updateTaskMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                            <ChevronDown
                                                className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${task.status === 'Resolved' ? 'text-[#2E6819]' : 'text-yellow-700'
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
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5F5DC] rounded-2xl mb-4">
                                    <ClipboardList className="w-8 h-8 text-[#8B8B4A]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">No tasks yet</h3>
                                <p className="text-gray-500 text-sm mb-4">Create your first task</p>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="inline-flex items-center justify-center px-6 py-2.5 bg-[#7BD747] text-white font-medium rounded-full hover:bg-[#6bc93a] transition-colors"
                                >
                                    Add Task
                                </button>
                            </div>
                        )}
                    </div>
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
                itemName={taskToDelete?.title}
            />

        </div>
    );
};

export default Tasks;
