import React, { useState, useMemo } from 'react';
import { Check, Plus, Pencil, Trash2 } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import AddTaskModal from './components/AddTaskModal';
import TaskDetailSideModal from './components/TaskDetailSideModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

// Task Interface
export interface Task {
    id: number;
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

// Mock Data
const MOCK_TASKS = [
    {
        id: 1,
        title: 'Check HVAC System',
        description: 'Perform routine maintenance check on the main HVAC unit in Building A. Inspect filters, check refrigerant levels, and clean coils.',
        name: 'Anii',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        date: '01 Nov, 2025',
        time: '11:00 AM',
        status: 'Resolved',
        property: 'prop1',
        frequency: 'daily',
        isRecurring: true,
        endDate: '31 Dec, 2025'
    },
    {
        id: 2,
        title: 'Inspect Roof Leak',
        description: 'Investigate reported leak in unit 4B. Check ceiling damage and inspect roof area above the unit for potential entry points.',
        name: 'Anuu',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        date: '01 Nov, 2025',
        time: '11:00 AM',
        status: 'Resolved',
        property: 'prop2',
        frequency: 'weekly',
        isRecurring: true,
        endDate: '30 Nov, 2025'
    },
    {
        id: 3,
        title: 'Garden Maintenance',
        description: 'Weekly landscaping service including lawn mowing, trimming hedges, and clearing debris from walkways.',
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        date: '02 Nov, 2025',
        time: '09:00 AM',
        status: 'Active',
        property: 'prop1',
        frequency: 'weekly',
        isRecurring: true,
        endDate: '01 Mar, 2026'
    },
    {
        id: 4,
        title: 'Pool Cleaning',
        description: 'Standard pool cleaning service: skim surface, vacuum bottom, and test/balance chemical levels.',
        name: 'Sarah Smith',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        date: '03 Nov, 2025',
        time: '02:00 PM',
        status: 'Active',
        property: 'prop2',
        frequency: 'daily',
        isRecurring: true,
        endDate: 'Indefinite'
    }
];

const Tasks: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleSaveTask = (taskData: any) => {
        if (editingTask) {
            console.log('Updating task:', { ...editingTask, ...taskData });
            // Here you would update the task in the list/backend
        } else {
            console.log('Creating new task:', taskData);
            // Here you would add the new task
        }
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

    const confirmDeleteTask = () => {
        console.log('Deleting task:', taskToDelete?.id);
        // Implement actual delete logic here

        // Cleanup
        if (selectedTask?.id === taskToDelete?.id) {
            setSelectedTask(null);
        }
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
    };

    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'active', label: 'Active' },
            { value: 'resolved', label: 'Resolved' },
        ],
        property: [
            { value: 'prop1', label: 'Property 1' },
            { value: 'prop2', label: 'Property 2' },
        ],
        date: [
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
        ],
        frequency: [
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
        ]
    };

    const filterLabels = {
        status: 'Status',
        property: 'Property & Units',
        date: 'Date',
        frequency: 'Frequency'
    };

    const filteredTasks = useMemo(() => {
        return MOCK_TASKS.filter(task => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.title.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = !filters.status || filters.status.length === 0 ||
                filters.status.includes(task.status.toLowerCase());

            // Property filter
            const matchesProperty = !filters.property || filters.property.length === 0 ||
                filters.property.includes(task.property);

            // Date filter
            const matchesDate = !filters.date || filters.date.length === 0 ||
                filters.date.some(dateFilter => {
                    const taskDate = new Date(task.date);
                    const today = new Date();

                    if (dateFilter === 'today') {
                        return taskDate.toDateString() === today.toDateString();
                    } else if (dateFilter === 'week') {
                        const weekFromNow = new Date();
                        weekFromNow.setDate(today.getDate() + 7);
                        return taskDate >= today && taskDate <= weekFromNow;
                    }
                    return false;
                });

            // Frequency filter
            const matchesFrequency = !filters.frequency || filters.frequency.length === 0 ||
                filters.frequency.includes(task.frequency);

            return matchesSearch && matchesStatus && matchesProperty && matchesDate && matchesFrequency;
        });
    }, [searchQuery, filters]);

    const handleSelectAll = () => {
        if (selectedTaskIds.length === filteredTasks.length) {
            setSelectedTaskIds([]);
        } else {
            setSelectedTaskIds(filteredTasks.map(task => task.id));
        }
    };

    const handleSelectTask = (id: number) => {
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
                                <span className="font-bold text-gray-800 text-sm">2</span>
                                <span className="text-xs text-gray-500">Open</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full">
                                <span className="font-bold text-gray-800 text-sm">2</span>
                                <span className="text-xs text-gray-500">Resolved</span>
                            </div>
                        </div>
                    </div>

                    {/* Today Card */}
                    <div className="bg-[#7BD747] p-1.5 rounded-full flex items-center min-w-fit pr-1.5 shadow-sm">
                        <span className="text-white font-medium px-6">Today</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full">
                                <span className="font-bold text-gray-800 text-sm">2</span>
                                <span className="text-xs text-gray-500">Tasks</span>
                            </div>
                        </div>
                    </div>

                    {/* Recurring Card */}
                    <div className="bg-[#7BD747] p-1.5 rounded-full flex items-center min-w-fit pr-1.5 shadow-sm">
                        <span className="text-white font-medium px-6">Recurring</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full">
                                <span className="font-bold text-gray-800 text-sm">2</span>
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
                    {filteredTasks.length > 0 ? (
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

                                    <div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${task.status === 'Resolved'
                                            ? 'bg-[#E8F8F0] text-[#2E6819]'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {task.status}
                                        </span>
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
                onEdit={() => handleEditTask(selectedTask)}
                onDelete={() => handleDeleteClick(selectedTask)}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setTaskToDelete(null);
                }}
                onConfirm={confirmDeleteTask}
                taskTitle={taskToDelete?.title}
            />
        </div>
    );
};

export default Tasks;
