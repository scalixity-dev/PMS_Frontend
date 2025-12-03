import React, { useState, useMemo } from 'react';
import { MoreHorizontal, ChevronDown, Check, Plus } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import AddTaskModal from './components/AddTaskModal';

// Mock Data
const MOCK_TASKS = [
    {
        id: 1,
        name: 'Anii',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        date: '01 Nov, 2025 11:00 AM',
        status: 'Resolved'
    },
    {
        id: 2,
        name: 'Anuu',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        date: '01 Nov, 2025 11:00 AM',
        status: 'Resolved'
    }
];

const Tasks: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
                task.name.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = !filters.status || filters.status.length === 0 ||
                filters.status.includes(task.status.toLowerCase());

            return matchesSearch && matchesStatus;
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

                {/* Input Fields Section */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category & subcategory*</label>
                            <input
                                type="text"
                                placeholder="General Income"
                                className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-[#7BD747] bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Due on*</label>
                            <input
                                type="text"
                                placeholder="0,00"
                                className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-[#7BD747] bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount*</label>
                            <div className="relative">
                                <select className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-[#7BD747] bg-white text-sm appearance-none text-gray-500">
                                    <option>Search</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payer /Payee *</label>
                        <div className="relative">
                            <select className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-[#7BD747] bg-white text-sm appearance-none text-gray-500">
                                <option>Paye</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags *</label>
                        <div className="relative">
                            <select className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-[#7BD747] bg-white text-sm appearance-none text-gray-500">
                                <option>Tags</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Task List Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={handleSelectAll}>
                        <div className="w-12 h-12 rounded-full bg-[#7BD747]/20 flex items-center justify-center">
                            <div className={`w-6 h-6 rounded-sm flex items-center justify-center transition-colors ${isAllSelected ? 'bg-[#7BD747]' : 'bg-white border-2 border-gray-300'}`}>
                                <Check className={`w-5 h-5 ${isAllSelected ? 'text-white' : 'text-transparent'}`} strokeWidth={3} />
                            </div>
                        </div>
                        <span className="text-gray-600 text-xl font-medium">Select All</span>
                    </div>
                    <button className="bg-[#7BD747] text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-[#6ac13c] transition-colors">
                        Action
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Task List */}
                <div className="space-y-4">
                    {filteredTasks.map((task) => {
                        const isSelected = selectedTaskIds.includes(task.id);
                        return (
                            <div key={task.id} className="bg-[#F0F0F6] p-4 rounded-[2rem] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors ${isSelected ? 'bg-[#7BD747]' : 'bg-white border border-gray-300'}`}
                                        onClick={() => handleSelectTask(task.id)}
                                    >
                                        <Check className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-transparent'}`} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-700 font-medium">{task.name}</span>
                                        <img src={task.avatar} alt={task.name} className="w-8 h-8 rounded-full object-cover" />
                                    </div>
                                </div>

                                <div className="text-gray-600 font-medium">
                                    {task.date}
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="bg-[#7BD747] text-white px-6 py-2 rounded-full text-sm font-medium">
                                        {task.status}
                                    </span>
                                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
};

export default Tasks;
