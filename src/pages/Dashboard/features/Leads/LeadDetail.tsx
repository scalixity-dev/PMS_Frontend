import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Clock, Plus, Edit2, Trash2, User, FileText, CheckSquare, LogIn } from 'lucide-react';
import AddNoteModal from './components/AddNoteModal';
import AddTaskModal from './components/AddleadsTaskModal';
import AddLogModal from './components/AddLogModal';
import AddMeetingModal from './components/AddMeetingModal';
import MessageModal from './components/MessageModal';
import InviteToApplyModal from './components/InviteToApplyModal';
import { useGetAllListings } from '../../../../hooks/useListingQueries';

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
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
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

    const { data: listingsData } = useGetAllListings();
    const listings = listingsData?.map(l => ({
        id: l.id,
        title: l.title || l.property?.propertyName || 'Untitled Listing'
    })) || [];

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

    const handleInviteSend = (email: string, listing: string) => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
        const date = now.toLocaleDateString([], { day: 'numeric', month: 'short' });

        // 1. Update status to Working if it's New
        if (status === 'New') {
            setStatus('Working');
        }

        // 2. Add Activity to timeline
        const newActivity = {
            id: Date.now(),
            user: 'Sam James',
            time: time,
            type: 'Activity',
            text: `Sent invitation to ${email} for listing: ${listing}`,
        };

        setActivities(prev => {
            const todayIndex = prev.findIndex(day => day.date === date);
            if (todayIndex !== -1) {
                const newActivities = [...prev];
                newActivities[todayIndex] = {
                    ...newActivities[todayIndex],
                    items: [newActivity, ...newActivities[todayIndex].items]
                };
                return newActivities;
            } else {
                return [
                    {
                        id: Date.now(),
                        date: date,
                        items: [newActivity]
                    },
                    ...prev
                ];
            }
        });

        // 3. Show success (In a real app, we'd use a toast library here)
        console.log(`Successfully invited ${email} to ${listing}`);
        setIsInviteModalOpen(false);
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

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2.5rem] shadow-sm border border-[#E0E0E0] mx-2">
                {/* Header */}
                <div className="flex items-center justify-start gap-3 mb-6 ml-2">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-1 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">{leadInfo.fullName}</h1>
                    </div>

                    <div className={`${status === 'New' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        status === 'Working' ? 'bg-[#82D95B]/20 text-[#2D6A4F] border-[#82D95B]/40' :
                            'bg-red-100 text-red-700 border-red-200'
                        } h-9 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold border transition-colors`}>
                        {status} <Clock className="w-3.5 h-3.5" />
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
                                        onClick={() => navigate(`/dashboard/leasing/leads/edit/${id || 1}`)}
                                        className="w-full text-left px-5 py-2 hover:bg-gray-50 text-gray-700 font-bold flex items-center gap-2 transition-colors text-xs"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" /> Edit Lead
                                    </button>

                                    <div className="h-[1px] bg-gray-100 my-1 mx-4" />

                                    <h4 className="px-5 py-1 text-[9px] uppercase tracking-wider text-gray-400 font-black">Change Status</h4>

                                    {['New', 'Working', 'Closed'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                setStatus(s);
                                                setShowActionMenu(false);
                                            }}
                                            className={`w-full text-left px-5 py-2 transition-colors text-xs flex items-center justify-between ${status === s
                                                ? 'bg-[#E7F0E5] text-[#2D6A4F] font-bold'
                                                : 'text-gray-600 font-medium hover:bg-gray-50'
                                                }`}
                                        >
                                            {s}
                                            {status === s && <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />}
                                        </button>
                                    ))}

                                    <div className="h-[1px] bg-gray-100 my-1 mx-4" />

                                    <button
                                        onClick={() => setShowActionMenu(false)}
                                        className="w-full text-left px-5 py-2 hover:bg-red-50 text-red-500 font-bold flex items-center gap-2 transition-colors text-xs"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete Lead
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

                            <div className="w-full bg-[#3E706F] rounded-xl p-2.5 text-center text-white space-y-0.5 mb-3 shadow-lg">
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
                                    onClick={() => setIsMessageModalOpen(true)}
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

                                            {/* Action Icons */}
                                            <div className="absolute top-3 right-5 flex items-center gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditActivity(day.id, item)}
                                                    className="text-[#3E706F] hover:scale-110 transition-transform p-1.5 "
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteActivity(day.id, item.id)}
                                                    className="text-red-500 hover:scale-110 transition-transform p-1.5 "
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
            <InviteToApplyModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSend={handleInviteSend}
                initialEmail={leadInfo.email}
                listings={listings}
            />
        </div >
    );
};

export default LeadDetail;