import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Clock, Plus, Edit2, Trash2, User, FileText, CheckSquare, LogIn } from 'lucide-react';
import AddNoteModal from './components/AddNoteModal';
import AddTaskModal from './components/AddTaskModal';
import AddLogModal from './components/AddLogModal';
import AddMeetingModal from './components/AddMeetingModal';
import MessageModal from './components/MessageModal';

interface ActivityItem {
    id: number;
    user: string;
    time: string;
    type: string;
    text: string;
    image?: string;
    originalData?: any;
}

interface DayActivity {
    id: number;
    date: string;
    items: ActivityItem[];
}

const LeadDetail = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [showLogOptions, setShowLogOptions] = useState(false);
    const [editingItem, setEditingItem] = useState<{ dayId: number; item: ActivityItem } | null>(null);
    const [status, setStatus] = useState('Working');
    const [showActionMenu, setShowActionMenu] = useState(false);
    const { id } = useParams();
    const [leadInfo, setLeadInfo] = useState({
        fullName: 'Sam',
        phone: '+91 98563 25832',
        email: 'gurjaratul0723@gmail.com'
    });

    useEffect(() => {
        const savedData = localStorage.getItem(`lead_${id || 1}`);
        if (savedData) {
            setLeadInfo(JSON.parse(savedData));
        }
    }, [id]);

    const [activities, setActivities] = useState<DayActivity[]>([
        {
            id: 1,
            date: '10 Dec',
            items: [
                { id: 101, user: 'Sam James', time: '5:23 pm', type: 'Activity', text: 'The status of the lead has been changed from New to Working.' },
                { id: 102, user: 'Sam James', time: '5:23 pm', type: 'Activity', text: 'The status of the lead has been changed from New to Working.' }
            ]
        }
    ]);

    const handleNoteConfirm = (noteText: string, file?: File | null) => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
        const date = now.toLocaleDateString([], { day: 'numeric', month: 'short' });

        if (editingItem) {
            setActivities(prev => prev.map(day => ({
                ...day,
                items: day.items.map((item: any) => {
                    if (item.id === editingItem.item.id) {
                        return {
                            ...item,
                            text: noteText,
                            image: file ? URL.createObjectURL(file) : item.image
                        };
                    }
                    return item;
                })
            })));
            setEditingItem(null);
            return;
        }

        const newNote = {
            id: Date.now(),
            user: 'Sam James',
            time: time,
            type: 'Note',
            text: noteText,
            image: file ? URL.createObjectURL(file) : undefined
        };

        setActivities(prev => {
            const todayIndex = prev.findIndex(day => day.date === date);
            if (todayIndex !== -1) {
                const newActivities = [...prev];
                newActivities[todayIndex] = {
                    ...newActivities[todayIndex],
                    items: [newNote, ...newActivities[todayIndex].items]
                };
                return newActivities;
            } else {
                return [
                    {
                        id: Date.now(),
                        date: date,
                        items: [newNote]
                    },
                    ...prev
                ];
            }
        });
    };

    const handleTaskCreate = (taskData: { details: string; date: string; assignee: string }, file?: File | null) => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
        const date = now.toLocaleDateString([], { day: 'numeric', month: 'short' });

        if (editingItem) {
            setActivities(prev => prev.map(day => ({
                ...day,
                items: day.items.map((item: ActivityItem) => {
                    if (item.id === editingItem.item.id) {
                        return {
                            ...item,
                            text: `${taskData.details} (Due: ${taskData.date})`,
                            originalData: taskData,
                            image: file ? URL.createObjectURL(file) : item.image
                        };
                    }
                    return item;
                })
            })));
            setEditingItem(null);
            return;
        }

        const newTask = {
            id: Date.now(),
            user: taskData.assignee || 'Sam James',
            time: time,
            type: 'Task',
            text: `${taskData.details} (Due: ${taskData.date})`,
            originalData: taskData,
            image: file ? URL.createObjectURL(file) : undefined
        };

        setActivities(prev => {
            const todayIndex = prev.findIndex(day => day.date === date);
            if (todayIndex !== -1) {
                const newActivities = [...prev];
                newActivities[todayIndex] = {
                    ...newActivities[todayIndex],
                    items: [newTask, ...newActivities[todayIndex].items]
                };
                return newActivities;
            } else {
                return [
                    {
                        id: Date.now(),
                        date: date,
                        items: [newTask]
                    },
                    ...prev
                ];
            }
        });
    };

    const handleLogCreate = (logData: { details: string; date: string; results: string }, file?: File | null) => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
        const date = now.toLocaleDateString([], { day: 'numeric', month: 'short' });

        if (editingItem) {
            setActivities(prev => prev.map(day => ({
                ...day,
                items: day.items.map((item: ActivityItem) => {
                    if (item.id === editingItem.item.id) {
                        return {
                            ...item,
                            text: `[Call Log] ${logData.details} - Result: ${logData.results} (at ${logData.date})`,
                            originalData: logData,
                            image: file ? URL.createObjectURL(file) : item.image
                        };
                    }
                    return item;
                })
            })));
            setEditingItem(null);
            return;
        }

        const newLog = {
            id: Date.now(),
            user: 'Sam James',
            time: time,
            type: 'Activity',
            text: `[Call Log] ${logData.details} - Result: ${logData.results} (at ${logData.date})`,
            originalData: logData,
            image: file ? URL.createObjectURL(file) : undefined
        };

        setActivities(prev => {
            const todayIndex = prev.findIndex(day => day.date === date);
            if (todayIndex !== -1) {
                const newActivities = [...prev];
                newActivities[todayIndex] = {
                    ...newActivities[todayIndex],
                    items: [newLog, ...newActivities[todayIndex].items]
                };
                return newActivities;
            } else {
                return [
                    {
                        id: Date.now(),
                        date: date,
                        items: [newLog]
                    },
                    ...prev
                ];
            }
        });
    };

    const handleMeetingCreate = (meetingData: { details: string; date: string }, file?: File | null) => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
        const date = now.toLocaleDateString([], { day: 'numeric', month: 'short' });


        if (editingItem) {
            setActivities(prev => prev.map(day => ({
                ...day,
                items: day.items.map((item: ActivityItem) => {
                    if (item.id === editingItem.item.id) {
                        return {
                            ...item,
                            text: `[Meeting Log] ${meetingData.details} (at ${meetingData.date})`,
                            originalData: meetingData,
                            image: file ? URL.createObjectURL(file) : item.image
                        };
                    }
                    return item;
                })
            })));
            setEditingItem(null);
            return;
        }

        const newMeeting = {
            id: Date.now(),
            user: 'Sam James',
            time: time,
            type: 'Activity',
            text: `[Meeting Log] ${meetingData.details} (at ${meetingData.date})`,
            originalData: meetingData,
            image: file ? URL.createObjectURL(file) : undefined
        };

        setActivities(prev => {
            const todayIndex = prev.findIndex(day => day.date === date);
            if (todayIndex !== -1) {
                const newActivities = [...prev];
                newActivities[todayIndex] = {
                    ...newActivities[todayIndex],
                    items: [newMeeting, ...newActivities[todayIndex].items]
                };
                return newActivities;
            } else {
                return [
                    {
                        id: Date.now(),
                        date: date,
                        items: [newMeeting]
                    },
                    ...prev
                ];
            }
        });
    };

    const handleMessageConfirm = (messageText: string, file?: File | null) => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
        const date = now.toLocaleDateString([], { day: 'numeric', month: 'short' });

        const newMessage = {
            id: Date.now(),
            user: 'Sam James',
            time: time,
            type: 'Activity',
            text: `[Text Message] ${messageText}`,
            image: file ? URL.createObjectURL(file) : undefined
        };

        setActivities(prev => {
            const todayIndex = prev.findIndex(day => day.date === date);
            if (todayIndex !== -1) {
                const newActivities = [...prev];
                newActivities[todayIndex] = {
                    ...newActivities[todayIndex],
                    items: [newMessage, ...newActivities[todayIndex].items]
                };
                return newActivities;
            } else {
                return [
                    {
                        id: Date.now(),
                        date: date,
                        items: [newMessage]
                    },
                    ...prev
                ];
            }
        });
    };

    const handleDeleteActivity = (dayId: number, itemId: number) => {
        setActivities(prev => prev.map(day => {
            if (day.id === dayId) {
                return {
                    ...day,
                    items: day.items.filter((item: any) => item.id !== itemId)
                };
            }
            return day;
        }).filter(day => day.items.length > 0));
    };

    const handleEditActivity = (dayId: number, item: any) => {
        setEditingItem({ dayId, item });
        if (item.type === 'Note') {
            setIsNoteModalOpen(true);
        } else if (item.text.includes('[Meeting Log]')) {
            setIsMeetingModalOpen(true);
        } else if (item.text.includes('[Call Log]')) {
            setIsLogModalOpen(true);
        } else if (item.type === 'Task') {
            setIsTaskModalOpen(true);
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] ml-2">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/leasing/leads')}>Leads</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{leadInfo.fullName}</span>
            </div>

            <div className="p-8 bg-[#DFE5E3] min-h-screen rounded-[3rem] shadow-sm border border-[#E0E0E0] mx-2">
                {/* Header */}
                <div className="flex items-center justify-start gap-4 mb-8 ml-2">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-1 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-8 h-8 text-gray-800" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">{leadInfo.fullName}</h1>
                    </div>

                    <div className={`${status === 'New' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        status === 'Working' ? 'bg-[#82D95B]/20 text-[#2D6A4F] border-[#82D95B]/40' :
                            'bg-red-100 text-red-700 border-red-200'
                        } h-11 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold border transition-colors`}>
                        {status} <Clock className="w-4 h-4" />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowActionMenu(!showActionMenu)}
                            className="bg-[#3A6D6C] text-white w-11 h-11 flex items-center justify-center rounded-2xl shadow-md hover:bg-[#2c5251] transition-all"
                        >
                            <MoreHorizontal className="w-6 h-6" />
                        </button>
                        {showActionMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-50"
                                    onClick={() => setShowActionMenu(false)}
                                />
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 py-3 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-outfit">
                                    <button
                                        onClick={() => navigate('/dashboard/leasing/leads/edit/1')}
                                        className="w-full text-left px-6 py-2.5 hover:bg-gray-50 text-gray-700 font-bold flex items-center gap-3 transition-colors text-sm"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit Lead
                                    </button>

                                    <div className="h-[1px] bg-gray-100 my-2 mx-4" />

                                    <h4 className="px-6 py-1 text-[10px] uppercase tracking-wider text-gray-400 font-black">Change Status</h4>

                                    {['New', 'Working', 'Closed'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                setStatus(s);
                                                setShowActionMenu(false);
                                            }}
                                            className={`w-full text-left px-6 py-2.5 transition-colors text-sm flex items-center justify-between ${status === s
                                                ? 'bg-[#E7F0E5] text-[#2D6A4F] font-bold'
                                                : 'text-gray-600 font-medium hover:bg-gray-50'
                                                }`}
                                        >
                                            {s}
                                            {status === s && <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />}
                                        </button>
                                    ))}

                                    <div className="h-[1px] bg-gray-100 my-2 mx-4" />

                                    <button
                                        onClick={() => setShowActionMenu(false)}
                                        className="w-full text-left px-6 py-2.5 hover:bg-red-50 text-red-500 font-bold flex items-center gap-3 transition-colors text-sm"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete Lead
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Top Section Card */}
                <div className="bg-[#F0F0F6] pt-4 px-8 pb-0 rounded-[3.5rem] border border-[#E0E0E0] shadow-sm mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
                        {/* Profile Card */}
                        <div className="bg-[#ECF3EA] p-5 rounded-[2.5rem] border border-[#E0E0E0] shadow-sm flex flex-col items-center mb-4">
                            <div className="w-20 h-20 bg-[#C9E5BC] rounded-[1.5rem] flex items-center justify-center mb-3 shadow-sm relative">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                                    <User className="w-7 h-7 text-[#C9E5BC]" strokeWidth={2.5} />
                                </div>
                            </div>

                            <div className="bg-[#E3EBDE] px-6 py-1.5 rounded-full text-[12px] font-bold text-[#4B5563] mb-4 shadow-[inset_2.49px_2.49px_0px_0px_#53535340] border border-gray-100">
                                Prospective tenant
                            </div>

                            <div className="w-full bg-[#3E706F] rounded-2xl p-3 text-center text-white space-y-0.5 mb-4 shadow-lg">
                                <p className="font-bold text-[12px]">{leadInfo.email}</p>
                                <p className="font-bold text-[12px]">{leadInfo.phone}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full">
                                <button className="bg-[#3E706F] text-white py-3 px-2 rounded-lg text-[11px] font-bold shadow-md hover:opacity-90 transition-all">
                                    Invite to Apply
                                </button>
                                <button
                                    onClick={() => setIsMessageModalOpen(true)}
                                    className="bg-[#D9D9D9] text-[#222] py-3 px-2 rounded-lg text-[11px] font-bold border border-[#C9C9C9] shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.25)] hover:bg-gray-300 transition-all uppercase tracking-tight"
                                >
                                    Send a Text Message
                                </button>
                            </div>
                        </div>

                        {/* Activity Filter Section */}
                        <div className="flex flex-col justify-between">
                            {/* Add Activity Controls */}
                            <div className="bg-[#3E706F] p-5 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center gap-4 relative">
                                <h3 className="text-white font-bold text-base">Add Activity</h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button
                                        onClick={() => setIsNoteModalOpen(true)}
                                        className="bg-[#82D95B] text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-[15px] font-bold shadow-lg hover:scale-105 transition-transform"
                                    >
                                        <FileText className="w-5 h-5" /> Note <div className="w-6 h-6 flex items-center justify-center border-2 border-white rounded-full"><Plus className="w-4 h-4 stroke-[4]" /></div>
                                    </button>
                                    <button
                                        onClick={() => setIsTaskModalOpen(true)}
                                        className="bg-[#82D95B] text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-[15px] font-bold shadow-lg hover:scale-105 transition-transform"
                                    >
                                        <CheckSquare className="w-5 h-5" /> Task <div className="w-6 h-6 flex items-center justify-center border-2 border-white rounded-full"><Plus className="w-4 h-4 stroke-[4]" /></div>
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowLogOptions(!showLogOptions)}
                                            className="bg-[#82D95B] text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-[15px] font-bold shadow-lg hover:scale-105 transition-transform"
                                        >
                                            <LogIn className="w-5 h-5" /> Log <div className="w-6 h-6 flex items-center justify-center border-2 border-white rounded-full"><Plus className="w-4 h-4 stroke-[4]" /></div>
                                        </button>
                                        {showLogOptions && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-50"
                                                    onClick={() => setShowLogOptions(false)}
                                                />
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 w-44 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                    <button
                                                        onClick={() => {
                                                            setIsLogModalOpen(true);
                                                            setShowLogOptions(false);
                                                        }}
                                                        className="w-full text-left px-6 py-3 hover:bg-[#F0F4F8] text-[#3E706F] font-bold transition-colors text-sm border-b border-gray-50 last:border-0"
                                                    >
                                                        Log a call
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsMeetingModalOpen(true);
                                                            setShowLogOptions(false);
                                                        }}
                                                        className="w-full text-left px-6 py-3 hover:bg-[#F0F4F8] text-[#3E706F] font-bold transition-colors text-sm"
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
                            <div className="bg-[#C9E5BC] p-6 rounded-t-[2.5rem] flex gap-4 shadow-inner">
                                {['All', 'Notes', 'Tasks', 'Activity'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        style={activeFilter === filter ? { borderBottom: '3px solid #FFFFFF' } : {}}
                                        className={`flex-1 py-3 px-1 rounded-full font-bold text-sm transition-all shadow-md ${activeFilter === filter
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
                <div className="bg-[#F0F0F650] p-10 rounded-[3rem] border border-white shadow-sm">
                    {/* Timeline */}
                    {(() => {
                        const filteredActivities = activities.map(day => ({
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
                                <div className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex flex-col items-center justify-center gap-1.5 mb-8 border border-gray-50 relative overflow-hidden group hover:scale-105 transition-transform">
                                        <div className="w-10 h-1 bg-gray-300 rounded-full" />
                                        <div className="w-10 h-1 bg-gray-300 rounded-full" />
                                        <div className="w-10 h-1 bg-gray-300 rounded-full" />
                                        <div className="absolute bottom-4 right-4 bg-[#3E706F] text-white rounded-lg p-1 shadow-lg transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                                            <Plus className="w-5 h-5 stroke-[3]" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#4B5563] mb-2">No {filterLabel}</h3>
                                    <p className="text-[#6B7280] font-medium text-lg">
                                        There is no added {filterLabel} on this page.
                                    </p>
                                </div>
                            );
                        }

                        return filteredActivities.map((day) => (
                            <div key={day.id} className="mb-12">
                                {/* Date Badge - Attached to card */}
                                <div className="inline-block bg-gradient-to-r from-[#17D16A] to-[#8EE238] text-white px-10 py-3 rounded-t-[1.8rem] text-xl font-bold shadow-sm relative z-10 -mb-[1px]">
                                    {day.date}
                                </div>

                                <div className="space-y-6 relative">
                                    {day.items.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-8 relative group ${index === 0 ? 'rounded-[2.5rem] rounded-tl-none' : 'rounded-[2.5rem]'
                                                }`}
                                        >
                                            {/* Left Info Group - Premium Box */}
                                            <div className="flex items-center gap-4 bg-[#EAF5E8] p-3 rounded-[2.2rem] border border-[#D9EDD3] shadow-sm">
                                                <div className="flex flex-col items-center relative">
                                                    <div className="w-16 h-16 bg-[#C9E5BC] rounded-[1.2rem] flex items-center justify-center relative shadow-inner overflow-hidden">
                                                        {item.image ? (
                                                            <img src={item.image} alt="Upload" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm -mt-3">
                                                                <User className="w-6 h-6 text-[#C9E5BC]" strokeWidth={2.5} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="bg-[#82D95B] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight shadow-sm absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                                                        {item.type}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 min-w-[100px]">
                                                    <div className="bg-[#3E706F] text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-md text-center">
                                                        {item.user}
                                                    </div>
                                                    <div className="bg-[#D9E3D8] text-[#555] px-4 py-1.5 rounded-xl text-[10px] font-bold shadow-inner text-center">
                                                        {item.time}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Activity Message Bubble */}
                                            <div
                                                className="bg-[#E7F0E5]/60 px-4 py-3 rounded-full text-[#374151] font-normal text-sm border border-[#D1E2CF] shadow-inner backdrop-blur-[4.979720592498779px] w-fit"
                                            >
                                                {item.text}
                                            </div>

                                            {/* Action Icons */}
                                            <div className="absolute top-4 right-6 flex items-center gap-3 opacity-100 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditActivity(day.id, item)}
                                                    className="text-[#3E706F] hover:scale-110 transition-transform p-1.5 "
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteActivity(day.id, item.id)}
                                                    className="text-red-500 hover:scale-110 transition-transform p-1.5 "
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ));
                    })()}
                </div>
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
                    details: editingItem.item.originalData?.details || '',
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
                initialData={editingItem?.item.text.includes('[Call Log]') ? {
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
                initialData={editingItem?.item.text.includes('[Meeting Log]') ? {
                    details: editingItem.item.originalData?.details || '',
                    date: editingItem.item.originalData?.date || '',
                    image: editingItem.item.image
                } : undefined}
            />
            <MessageModal
                isOpen={isMessageModalOpen}
                onClose={() => setIsMessageModalOpen(false)}
                onConfirm={handleMessageConfirm}
            />
        </div>
    );
};

export default LeadDetail;
