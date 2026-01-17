import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiPlus, PiChatCircleText, PiDotsThreeOutlineFill } from "react-icons/pi";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
    useDroppable,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';
import ServiceFilters from '../../../components/ServiceFilters';
import DashboardButton from '../../../components/DashboardButton';

// Types
type Request = {
    id: string;
    status: string;
    category: string;
    subCategory: string;
    property: string;
    priority: string;
    client: string;
    avatar: string; // Using random avatars for now
};

type ColumnId = 'New' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';

const COLUMNS: ColumnId[] = ['New', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

// --- Sortable Item Component (The Card) ---
const SortableRequestCard = ({ request }: { request: Request }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: request.id, data: { status: request.status } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${isDragging ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
        >
            {/* Card Content - Same design as before */}
            <div className="flex justify-between items-start mb-3">
                <span className="text-gray-400 text-sm font-medium">#{request.id}</span>
                <div className="flex items-center gap-2">
                    <button className="text-gray-500 hover:text-gray-700 relative">
                        <PiChatCircleText size={20} />
                        {/* Dot for Normal as seen in image, red for critical (removed logic for critical based on user pref, keeping visual consistent with others) */}
                        <span className={`absolute top-0 right-0 block h-2 w-2 rounded-full ring-1 ring-white ${request.priority === 'Critical' ? 'bg-red-500' : 'bg-gray-300'} transform translate-x-1/4 -translate-y-1/4`}></span>
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                        <PiDotsThreeOutlineFill size={20} />
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="font-semibold text-gray-800 text-base">{request.category} / {request.subCategory || 'General'}</h4>
                <p className="text-gray-500 text-sm mt-1">{request.property}</p>
            </div>

            <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white inline-flex items-center gap-1 ${request.priority === 'Critical' ? 'bg-red-500' :
                    request.priority === 'High' ? 'bg-orange-500' :
                        request.priority === 'Low' ? 'bg-blue-500' :
                            'bg-green-500' // Normal
                    }`}>
                    {/* Only show dot if NOT critical, per user previous request, although visual consistency suggests otherwise. Sticking to request. */}
                    {request.priority !== 'Critical' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    {request.priority}
                </span>
            </div>

            <hr className="border-gray-100 mb-4" />

            <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center overflow-hidden">
                    <img src={request.avatar} alt={request.client} className="w-full h-full object-cover" />
                </div>
                <button className="text-[#8BDC5E] text-sm font-medium hover:underline">
                    View
                </button>
            </div>
        </div>
    );
};

// --- Column Component ---
const KanbanColumn = ({ id, requests }: { id: string, requests: Request[] }) => {
    const { setNodeRef } = useDroppable({ id: id, data: { type: 'Column' } }); // Make column droppable context

    return (
        <div ref={setNodeRef} className="flex flex-col flex-none w-[85vw] md:flex-1 md:min-w-0 md:w-auto h-full bg-gray-50/50 rounded-xl p-3 border border-gray-100/50 snap-center">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">{id}</h3>
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">{requests.length}</span>
            </div>

            <SortableContext items={requests.map(r => r.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 overflow-y-auto pr-1 min-h-[100px] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                    {requests.map(req => (
                        <SortableRequestCard key={req.id} request={req} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};


const ServiceRequestsBoard = () => {
    const [requests, setRequests] = useState<Request[]>([
        { id: '12345', status: 'New', category: 'Appliances', subCategory: 'General', property: 'Sunset Apartments', priority: 'Critical', client: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: '12346', status: 'In Progress', category: 'Plumbing', subCategory: 'Leak', property: 'Downtown Lofts', priority: 'Normal', client: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=2' },
        { id: '12347', status: 'On Hold', category: 'Electrical', subCategory: 'Wiring', property: 'Sunset Apartments', priority: 'High', client: 'Charlie Davis', avatar: 'https://i.pravatar.cc/150?u=3' },
        { id: '12348', status: 'Completed', category: 'HVAC', subCategory: 'AC', property: 'Ocean View Villa', priority: 'Low', client: 'Diana Evans', avatar: 'https://i.pravatar.cc/150?u=4' },
        { id: '12349', status: 'Cancelled', category: 'Appliances', subCategory: 'Oven', property: 'Downtown Lofts', priority: 'Normal', client: 'Ethan Foster', avatar: 'https://i.pravatar.cc/150?u=5' },
        { id: '12350', status: 'New', category: 'General', subCategory: 'Maintenance', property: 'Mountain Retreat', priority: 'Critical', client: 'Fiona Green', avatar: 'https://i.pravatar.cc/150?u=6' },
        { id: '12351', status: 'In Progress', category: 'Plumbing', subCategory: 'Toilet', property: 'Sunset Apartments', priority: 'High', client: 'George Hill', avatar: 'https://i.pravatar.cc/150?u=7' },
        { id: '12352', status: 'New', category: 'HVAC', subCategory: 'Heater', property: 'Downtown Lofts', priority: 'Normal', client: 'Hannah Iver', avatar: 'https://i.pravatar.cc/150?u=8' }
    ]);

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // Note: Filtering columns might effectively hide them or empty them
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [propertyFilter, setPropertyFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [activeId, setActiveId] = useState<string | null>(null);

    // Filter Logic
    // For Kanban board, we filter the ITEMS, but usually keep columns visible unless status filter excludes them? 
    // If status filter is 'New', we'd only see the New column or only items in New? 
    // Standard approach: Show all columns or filtered columns. Let's filter ITEMS.
    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.id.includes(searchTerm);

        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
        const matchesCategory = categoryFilter === 'All' || req.category === categoryFilter;
        const matchesProperty = propertyFilter === 'All' || req.property === propertyFilter;
        const matchesPriority = priorityFilter === 'All' || req.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesCategory && matchesProperty && matchesPriority;
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Distance 5px prevents accidental drags on click
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveRequest = active.data.current?.status; // Check if dragging a request

        if (!isActiveRequest) return;

        // Implements sorting logic if needed, but for simple Status change, onDragEnd is enough to retarget.
        // However, standard Kanban allows reordering.
        // We'll trust onDragEnd for the final commit.
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = String(active.id);
        const overId = over.id;

        const activeRequest = requests.find(r => r.id === activeId);
        if (!activeRequest) {
            setActiveId(null);
            return;
        }

        let newStatus = activeRequest.status;

        // Ensure overId is treated as string for column check
        const overIdString = String(overId);

        if (COLUMNS.includes(overIdString as ColumnId)) {
            // Dropped strictly on a column container
            newStatus = overIdString;
        } else {
            // Dropped on another item, find that item's status
            const overRequest = requests.find(r => r.id === overId);
            if (overRequest) {
                newStatus = overRequest.status;
            }
        }

        if (newStatus !== activeRequest.status) {
            setRequests(items => {
                return items.map(item =>
                    item.id === activeId ? { ...item, status: newStatus } : item
                );
            });
        }

        // If we wanted to reorder within same list, we'd use arrayMove here based on indices.
        // For now, simple status change is sufficient for "Logic".
        setActiveId(null);
    };

    // Group items for rendering
    const columns = COLUMNS.reduce((acc, colId) => {
        acc[colId] = filteredRequests.filter(req => req.status === colId);
        return acc;
    }, {} as Record<string, Request[]>);

    // Only show columns matching status filter if not All
    const visibleColumns = statusFilter === 'All' ? COLUMNS : COLUMNS.filter(c => c === statusFilter);


    return (
        <div className="h-full flex flex-col">
            {/* Fixed Header Area */}
            <div className="flex-none">
                <ServiceBreadCrumb
                    items={[
                        { label: 'Dashboard', to: '/service-dashboard' },
                        { label: 'Requests Board', active: true }
                    ]}
                />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            Requests Board
                            <span className="cursor-pointer text-gray-500"><svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        </h1>
                        <span className="text-gray-400 text-sm mt-1">Total {filteredRequests.length}</span>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => navigate('/service-dashboard/requests')}
                            className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                            title="Switch to List View"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 5.83333H17.5" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.5 10H17.5" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.5 14.1667H17.5" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <DashboardButton bgColor="#8BDC5E" textColor="text-white" onClick={() => { }}>
                            Find a Job
                        </DashboardButton>
                        <DashboardButton bgColor="white" textColor="text-gray-700" icon={PiPlus} onClick={() => { }}>
                            Add Request
                        </DashboardButton>
                    </div>
                </div>

                <hr className="mb-6 border-gray-100" />

                <ServiceFilters
                    onSearch={setSearchTerm}
                    currentStatus={statusFilter}
                    onStatusChange={setStatusFilter}
                    currentCategory={categoryFilter}
                    onCategoryChange={setCategoryFilter}
                    currentProperty={propertyFilter}
                    onPropertyChange={setPropertyFilter}
                    currentPriority={priorityFilter}
                    onPriorityChange={setPriorityFilter}
                />
            </div>

            {/* Scrollable Board Area */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex h-full pb-4 gap-4 px-1">
                        {visibleColumns.map(colId => (
                            <KanbanColumn key={colId} id={colId} requests={columns[colId]} />
                        ))}
                    </div>

                    <DragOverlay>
                        {(() => {
                            const activeRequest = requests.find(r => r.id === activeId);
                            return activeRequest ? (
                                <div className="rotate-3 cursor-grabbing opacity-90">
                                    <SortableRequestCard request={activeRequest} />
                                </div>
                            ) : null;
                        })()}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
};

export default ServiceRequestsBoard;
