import React, { useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronRight, Edit, Trash2, Plus, Repeat, Printer, Paperclip, FileText } from 'lucide-react';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import ChangeStatusModal from './components/ChangeStatusModal';
import AssigneeModal from './components/AssigneeModal';
import MakeRecurringModal from './components/MakeRecurringModal';
import Breadcrumb from '../../../../components/ui/Breadcrumb';

// --- Reusable Components ---

const CollapsibleSection = ({ title, children, defaultOpen = false, action }: { title: string; children: React.ReactNode; defaultOpen?: boolean; action?: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 group"
                >
                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-gray-600">{title}</h2>
                    <div className="transform transition-transform duration-200">
                        {isOpen ? <ChevronDown className="w-5 h-5 text-gray-800" /> : <ChevronRight className="w-5 h-5 text-gray-800" />}
                    </div>
                </button>
                {action && <div>{action}</div>}
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0'}`}>
                {children}
            </div>
        </div>
    );
};

// --- Main Component ---

const MaintenanceRequestsDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { sidebarCollapsed = false } = useOutletContext<{ sidebarCollapsed?: boolean }>() || {}; const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [status, setStatus] = useState('New');
    const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
    const [assignee, setAssignee] = useState<string | null>(null); // null = unassigned
    const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);

    const handleDelete = () => {
        // Implement delete logic here (API call)
        console.log('Deleting request:', id);
        setIsDeleteModalOpen(false);
        navigate('/dashboard/maintenance/requests'); // Navigate back to list
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        setIsStatusModalOpen(false);
        console.log('Status updated to:', newStatus);
    };

    const handleAssigneeChange = (newAssignee: string) => {
        setAssignee(newAssignee === 'Unassigned' ? null : newAssignee);
        setIsAssigneeModalOpen(false);
        console.log('Assignee updated to:', newAssignee);
    };

    const handleRecurringCreate = (data: any) => {
        console.log('Creating recurring request:', data);
        setIsRecurringModalOpen(false);
    };

    // Mock Data for Materials
    const materials = [
        { id: 1, item: 'Paint (Gallon)', quantity: 2 },
        { id: 2, item: 'Drywall Screws (Box)', quantity: 1 },
        { id: 3, item: 'Lumber (2x4)', quantity: 5 },
        { id: 4, item: 'Sandpaper (Pack)', quantity: 3 }
    ];

    // Mock Data for Tenant Information
    const tenantInfo = {
        authorizationToEnter: 'Yes',
        authorizationCode: '4521',
        pets: ['Dog', 'Cat'],
        setUpDateTime: '24 Nov 2025, 10:00 AM',
        availability: [
            { id: 1, date: '2025-11-24', timeSlots: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'] },
            { id: 2, date: '2025-11-25', timeSlots: ['10:00 AM - 1:00 PM'] }
        ]
    };

    // Mock Data for Equipment
    const equipment = [
        { id: 1, name: 'Power Drill', serialNumber: 'PD-2024-001', condition: 'Good' },
        { id: 2, name: 'Ladder (8ft)', serialNumber: 'LD-2024-015', condition: 'Fair' },
        { id: 3, name: 'Paint Sprayer', serialNumber: 'PS-2024-003', condition: 'Excellent' }
    ];

    // Mock Data for Transactions
    const transactions = [
        { id: 1, date: '20 Nov 2025', type: 'Money Out', description: 'Materials Purchase', amount: -250.00 },
        { id: 2, date: '22 Nov 2025', type: 'Money Out', description: 'Labor Cost', amount: -150.00 },
        { id: 3, date: '24 Nov 2025', type: 'Money In', description: 'Tenant Payment', amount: 400.00 }
    ];

    // Mock Data for Attachments
    const attachments = [
        { id: 1, name: 'Invoice_Materials.pdf', size: '245 KB', type: 'application/pdf' },
        { id: 2, name: 'Work_Order.pdf', size: '128 KB', type: 'application/pdf' },
        { id: 3, name: 'Before_Photo.jpg', size: '1.2 MB', type: 'image/jpeg' }
    ];

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit pb-12 transition-all duration-300`}>
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Requests', path: '/dashboard/maintenance/requests' },
                    { label: 'Request Details' }
                ]}
                className="mb-6"
            />

            <div className="p-4 md:p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="flex items-center justify-center">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Maintenance request</h1>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto flex-wrap">
                        <button
                            onClick={() => setIsStatusModalOpen(true)}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            Change Status
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                                className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                            >
                                Action
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {isActionDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-100 overflow-hidden">
                                    <button
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                                        onClick={() => {
                                            setIsActionDropdownOpen(false);
                                            navigate('/dashboard/maintenance/request', { state: { editMode: true, id } });
                                        }}
                                    >
                                        <div className="p-1.5 bg-[#E8F0F0] rounded-md text-[#3A6D6C]">
                                            <Edit size={16} />
                                        </div>
                                        <span className="font-medium">Edit</span>
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 from-gray-50"
                                        onClick={() => {
                                            setIsActionDropdownOpen(false);
                                            setIsRecurringModalOpen(true);
                                        }}
                                    >
                                        <div className="p-1.5 bg-[#E8F0F0] rounded-md text-[#3A6D6C]">
                                            <Repeat size={16} />
                                        </div>
                                        <span className="font-medium">Make Recurring</span>
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50"
                                        onClick={() => {
                                            setIsActionDropdownOpen(false);
                                            console.log('Printing request:', id);
                                            window.print();
                                        }}
                                    >
                                        <div className="p-1.5 bg-[#E8F0F0] rounded-md text-[#3A6D6C]">
                                            <Printer size={16} />
                                        </div>
                                        <span className="font-medium">Print</span>
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                                        onClick={() => {
                                            setIsActionDropdownOpen(false);
                                            setIsDeleteModalOpen(true);
                                        }}
                                    >
                                        <div className="p-1.5 bg-red-50 rounded-md text-red-500">
                                            <Trash2 size={16} />
                                        </div>
                                        <span className="font-medium">Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ID and Property Card */}
                <div className="bg-[#f0f0f6] rounded-[2rem] md:rounded-[3rem] p-4 flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center mb-8 shadow-sm">
                    <div className="bg-[#7BD747] text-white px-6 py-3 rounded-full flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto md:min-w-[300px]">
                        <span className="font-bold text-sm whitespace-nowrap">ID - {id || '1331895'}</span>
                        <div className="bg-white/90 text-[#3A6D6C] text-[10px] px-2 py-0.5 rounded-full font-bold break-words whitespace-normal text-left">
                            Exterior / Gates / Fences /Awning / landscape
                        </div>
                    </div>
                    <div className="bg-[#7BD747] text-white px-6 py-3 rounded-full flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto md:min-w-[200px]">
                        <span className="font-bold text-sm">Property</span>
                        <div className="bg-white/90 text-[#3A6D6C] text-[10px] px-3 py-0.5 rounded-full font-bold">
                            ABC
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Description</h2>
                    <div className="bg-[#F0F0F6] rounded-2xl p-6 min-h-[120px] shadow-sm">
                        <span className="text-gray-500 text-sm">Type Details Here...</span>
                    </div>
                </div>

                {/* Media */}
                <CollapsibleSection title="Media" defaultOpen={true}>
                    <div className="bg-[#F0F0F6] rounded-xl p-6 shadow-sm flex gap-4 overflow-x-auto">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-32 h-32 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                                <img
                                    src={`https://images.unsplash.com/photo-${1580000000000 + i}?auto=format&fit=crop&w=200&q=80`}
                                    alt={`Media ${i}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=No+Image';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </CollapsibleSection>


                {/* Assignee Information */}
                <CollapsibleSection
                    title="Assignee information"
                    defaultOpen={true}
                    action={
                        <button
                            onClick={() => setIsAssigneeModalOpen(true)}
                            className="px-4 py-1.5 bg-[#3A6D6C] text-white rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors"
                        >
                            {assignee ? 'Re-Assign' : 'Add Assignee'}
                        </button>
                    }
                >
                    <div className="flex flex-col xl:flex-row gap-6 bg-[#f0f0f6] p-4 md:p-6 rounded-xl">
                        {/* Profile Card */}
                        <div className="bg-[#F0F0F6] rounded-3xl p-6 w-full xl:w-80 flex flex-col items-center justify-center shadow-sm">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden mb-4 bg-gray-200">
                                {assignee ? (
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <button
                                        onClick={() => setIsAssigneeModalOpen(true)}
                                        className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                                    >
                                        <span className="text-4xl">?</span>
                                    </button>
                                )}
                            </div>

                            {assignee ? (
                                <div className="bg-[#3A6D6C] text-white text-center py-2 px-6 rounded-xl w-full mb-4">
                                    <h3 className="font-bold text-sm">{assignee}</h3>
                                    <p className="text-[10px] opacity-90">+91 9876543210</p>
                                    <p className="text-[10px] opacity-90 break-all">{assignee.toLowerCase().replace(' ', '')}@gmail.com</p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAssigneeModalOpen(true)}
                                    className="bg-[#3A6D6C] text-white text-center py-2 px-6 rounded-xl w-full mb-4 hover:bg-[#2c5251] transition-colors cursor-pointer group"
                                >
                                    <h3 className="font-bold text-sm">
                                        <span className="group-hover:hidden">Not Assigned</span>
                                        <span className="hidden group-hover:inline">+ Add Assignee</span>
                                    </h3>
                                </button>
                            )}

                            {assignee && (
                                <button className="bg-[#D1D1D1] text-gray-700 text-xs font-bold py-2 px-8 rounded-full hover:bg-gray-300 transition-colors">
                                    View Profile
                                </button>
                            )}
                        </div>

                        {/* Details Grid */}
                        <div className="flex-1 bg-[#7BD747] rounded-3xl p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-12 gap-y-4 shadow-sm">
                            <div className="space-y-4">
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Type</span>
                                    <span className="text-gray-800 text-xs font-bold">One time</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Priority</span>
                                    <span className="text-gray-800 text-xs font-bold">Normal</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Date initiated</span>
                                    <span className="text-gray-800 text-xs font-bold">24 Nov, 2025</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Date due</span>
                                    <span className="text-gray-800 text-xs font-bold">24 Nov, 2025</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Started work</span>
                                    <span className="text-gray-800 text-xs font-bold">-</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Ended work</span>
                                    <span className="text-gray-800 text-xs font-bold">-</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Labor time</span>
                                    <span className="text-gray-800 text-xs font-bold">-</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Key returned</span>
                                    <span className="text-gray-800 text-xs font-bold">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Tenant Information */}
                <CollapsibleSection title="Tenant information" defaultOpen={true}>
                    <div className="bg-[#f0f0f6] p-6 rounded-xl shadow-sm">
                        <div className="bg-[#7BD747] rounded-3xl p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-12 gap-y-4 shadow-sm max-w-4xl">
                            <div className="space-y-4">
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Authorization to Enter</span>
                                    <span className="text-gray-800 text-xs font-bold">{tenantInfo.authorizationToEnter}</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Authorization Code</span>
                                    <span className="text-gray-800 text-xs font-bold">{tenantInfo.authorizationCode}</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Pets</span>
                                    <span className="text-gray-800 text-xs font-bold">{tenantInfo.pets.join(', ')}</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Set Up Date/Time</span>
                                    <span className="text-gray-800 text-xs font-bold">{tenantInfo.setUpDateTime}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {tenantInfo.availability.map((slot, index) => (
                                    <div key={slot.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                                        <span className="text-gray-500 text-xs font-medium block mb-1">Availability {index + 1}</span>
                                        <div className="text-gray-800 text-xs font-bold">
                                            <p>Date: {new Date(slot.date).toLocaleDateString()}</p>
                                            <p className="text-gray-600">Time: {slot.timeSlots.join(', ')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Materials */}
                <CollapsibleSection
                    title="Materials"
                    defaultOpen={true}
                    action={
                        <button
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#3A6D6C] text-white rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors"
                            onClick={() => navigate('/dashboard/maintenance/request', { state: { editMode: true, id, targetSection: 'materials' } })}
                        >
                            Add material
                            <Plus className="w-3 h-3" />
                        </button>
                    }
                >
                    <div className="bg-[#F0F0F6] rounded-3xl p-4 shadow-sm overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            {/* Table Header */}
                            <div className="bg-[#3A6D6C] text-white rounded-t-xl px-6 py-3 grid grid-cols-[1fr_1fr_100px] text-xs font-bold min-w-[500px]">
                                <div>Item</div>
                                <div>Quantity</div>
                                <div className="text-right">Actions</div>
                            </div>

                            {/* Table Body */}
                            <div className="bg-white rounded-b-xl px-6 py-2 min-w-[500px]">
                                {materials.map((m) => (
                                    <div key={m.id} className="grid grid-cols-[1fr_1fr_100px] items-center py-3 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-gray-800">{m.item}</span>
                                        </div>
                                        <div className="text-sm font-medium text-black pl-1">{m.quantity}</div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                className="text-[#3A6D6C] hover:text-[#2c5251]"
                                                onClick={() => navigate('/dashboard/maintenance/request', { state: { editMode: true, id, targetSection: 'materials' } })}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-500 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {materials.map((m) => (
                                <div key={m.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-bold text-gray-800">{m.item}</span>
                                        <div className="flex gap-2">
                                            <button
                                                className="text-[#3A6D6C] p-1.5 hover:bg-gray-50 rounded-full"
                                                onClick={() => navigate('/dashboard/maintenance/request', { state: { editMode: true, id, targetSection: 'materials' } })}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-500 p-1.5 hover:bg-red-50 rounded-full">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Quantity:</span>
                                        <span className="font-semibold text-gray-800 text-sm">{m.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Equipment Section */}
                <CollapsibleSection title="Equipment" defaultOpen={true}>
                    <div className="bg-[#F0F0F6] rounded-3xl p-4 shadow-sm overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            {/* Table Header */}
                            <div className="bg-[#3A6D6C] text-white rounded-t-xl px-6 py-3 grid grid-cols-[1fr_1fr_1fr_100px] text-xs font-bold min-w-[500px]">
                                <div>Name</div>
                                <div>Serial Number</div>
                                <div>Condition</div>
                                <div className="text-right">Actions</div>
                            </div>

                            {/* Table Body */}
                            <div className="bg-white rounded-b-xl px-6 py-2 min-w-[500px]">
                                {equipment.map((e) => (
                                    <div key={e.id} className="grid grid-cols-[1fr_1fr_1fr_100px] items-center py-3 border-b border-gray-50 last:border-0">
                                        <div className="text-sm font-semibold text-gray-800">{e.name}</div>
                                        <div className="text-sm font-medium text-gray-600">{e.serialNumber}</div>
                                        <div className="text-sm font-medium text-[#3A6D6C]">{e.condition}</div>
                                        <div className="flex justify-end gap-3">
                                            <button className="text-[#3A6D6C] hover:text-[#2c5251]">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-500 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {equipment.map((e) => (
                                <div key={e.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-bold text-gray-800">{e.name}</span>
                                        <div className="flex gap-2">
                                            <button className="text-[#3A6D6C] p-1.5 hover:bg-gray-50 rounded-full">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-500 p-1.5 hover:bg-red-50 rounded-full">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                        <div>
                                            <span className="block">Serial:</span>
                                            <span className="font-semibold text-gray-800">{e.serialNumber}</span>
                                        </div>
                                        <div>
                                            <span className="block">Condition:</span>
                                            <span className="font-semibold text-[#3A6D6C]">{e.condition}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Transactions Section */}
                <CollapsibleSection
                    title="Transactions"
                    defaultOpen={true}
                    action={
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/dashboard/accounting/transactions/expense/add')}
                                className="px-5 py-1.5 bg-[#3A6D6C] text-white rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors"
                            >
                                Money out
                            </button>
                            <button
                                onClick={() => navigate('/dashboard/accounting/transactions/income/add')}
                                className="px-5 py-1.5 bg-[#3A6D6C] text-white rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors"
                            >
                                Money In
                            </button>
                        </div>
                    }
                >
                    <div className="bg-[#F0F0F6] rounded-3xl p-4 shadow-sm overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            {/* Table Header */}
                            <div className="bg-[#3A6D6C] text-white rounded-t-xl px-6 py-3 grid grid-cols-[1fr_1fr_2fr_1fr] text-xs font-bold min-w-[500px]">
                                <div>Date</div>
                                <div>Type</div>
                                <div>Description</div>
                                <div className="text-right">Amount</div>
                            </div>

                            {/* Table Body */}
                            <div className="bg-white rounded-b-xl px-6 py-2 min-w-[500px]">
                                {transactions.map((t) => (
                                    <div key={t.id} className="grid grid-cols-[1fr_1fr_2fr_1fr] items-center py-3 border-b border-gray-50 last:border-0">
                                        <div className="text-sm font-medium text-gray-800">{t.date}</div>
                                        <div className={`text-sm font-medium ${t.type === 'Money In' ? 'text-green-600' : 'text-red-500'}`}>{t.type}</div>
                                        <div className="text-sm text-gray-600">{t.description}</div>
                                        <div className={`text-sm font-bold text-right ${t.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {transactions.map((t) => (
                                <div key={t.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-bold text-gray-800">{t.description}</span>
                                        <span className={`text-sm font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>{t.date}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.type === 'Money In' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                            {t.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Attachments Section */}
                <CollapsibleSection title="Attachments" defaultOpen={true}>
                    <div className="bg-[#F0F0F6] rounded-2xl p-4 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {attachments.map((file) => (
                                <div key={file.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-500 group-hover:bg-[#f0fdf4] group-hover:text-[#166534] transition-colors">
                                            {file.type.includes('pdf') ? <FileText className="w-5 h-5" /> : <Paperclip className="w-5 h-5" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate" title={file.name}>{file.name}</p>
                                            <p className="text-xs text-gray-500">{file.size}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CollapsibleSection>

            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Request"
                itemName="this maintenance request"
            />

            <ChangeStatusModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                currentStatus={status}
                onSave={handleStatusChange}
            />

            <AssigneeModal
                isOpen={isAssigneeModalOpen}
                onClose={() => setIsAssigneeModalOpen(false)}
                currentAssignee={assignee || 'Unassigned'}
                onSave={handleAssigneeChange}
            />

            <MakeRecurringModal
                isOpen={isRecurringModalOpen}
                onClose={() => setIsRecurringModalOpen(false)}
                requestDetails={{
                    category: 'Exterior',
                    subCategory: 'Gates',
                    issue: 'Detailed Issue',
                    subIssue: 'Specific Sub-issue',
                    title: 'Exterior / Gates / Fences /Awning / landscape'
                }}
                onSave={handleRecurringCreate}
            />
        </div>
    );
};

export default MaintenanceRequestsDetail;
