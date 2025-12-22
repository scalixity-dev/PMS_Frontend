import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronRight, Edit, Trash2, Plus, Repeat, Printer } from 'lucide-react';
import ConfirmationModal from '../KeysLocks/ConfirmationModal';
import ChangeStatusModal from './components/ChangeStatusModal';
import AssigneeModal from './components/AssigneeModal';
import MakeRecurringModal from './components/MakeRecurringModal';

// --- Reusable Components ---

const CollapsibleSection = ({ title, children, defaultOpen = false, action }: { title: string; children: React.ReactNode; defaultOpen?: boolean; action?: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
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
    const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [status, setStatus] = useState('New');
    const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
    const [assignee, setAssignee] = useState('Anjali Vyas');
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
        setAssignee(newAssignee);
        setIsAssigneeModalOpen(false);
        console.log('Assignee updated to:', newAssignee);
    };

    const handleRecurringCreate = (data: any) => {
        console.log('Creating recurring request:', data);
        setIsRecurringModalOpen(false);
    };

    // Mock Data (Replace with functionality)
    const materials = [
        { id: 1, item: 'Paint (Gallon)', quantity: 2 },
        { id: 2, item: 'Drywall Screws (Box)', quantity: 1 },
        { id: 3, item: 'Lumber (2x4)', quantity: 5 },
        { id: 4, item: 'Sandpaper (Pack)', quantity: 3 }
    ];

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-12">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/maintenance/requests')}>Requests</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">

                {/* Header */}
                <div className="flex items-center gap-8 mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="flex items-center justify-center">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Maintenance request</h1>
                    </div>
                    <div className="flex gap-3">
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
                <div className="bg-[#f0f0f6] rounded-[3rem] p-4 flex flex-wrap gap-4 items-center mb-8 shadow-sm">
                    <div className="bg-[#7BD747] text-white px-6 py-3 rounded-full flex items-center gap-4 min-w-[300px]">
                        <span className="font-bold text-sm">ID - {id || '1331895'}</span>
                        <div className="bg-white/90 text-[#3A6D6C] text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Exterior / Gates / Fences /Awning / landscape
                        </div>
                    </div>
                    <div className="bg-[#7BD747] text-white px-6 py-3 rounded-full flex items-center gap-4 min-w-[200px]">
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
                            Re-Assign
                        </button>
                    }
                >
                    <div className="flex flex-col md:flex-row gap-6 bg-[#f0f0f6] p-6 rounded-xl">
                        {/* Profile Card */}
                        <div className="bg-[#F0F0F6] rounded-3xl p-6 w-full md:w-80 flex flex-col items-center justify-center shadow-sm">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden mb-4 bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Profile" className="w-full h-full object-cover" />
                            </div>

                            <div className="bg-[#3A6D6C] text-white text-center py-2 px-6 rounded-xl w-full mb-4">
                                <h3 className="font-bold text-sm">{assignee}</h3>
                                <p className="text-[10px] opacity-90">+91 9876543210</p>
                                <p className="text-[10px] opacity-90">{assignee.toLowerCase().replace(' ', '')}@gmail.com</p>
                            </div>

                            <button className="bg-[#D1D1D1] text-gray-700 text-xs font-bold py-2 px-8 rounded-full hover:bg-gray-300 transition-colors">
                                View Profile
                            </button>
                        </div>

                        {/* Details Grid */}
                        <div className="flex-1 bg-[#7BD747] rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 shadow-sm">
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

                {/* PMS Information */}
                <CollapsibleSection title="Pms information" defaultOpen={true}>
                    <div className="bg-[#f0f0f6] p-6 rounded-xl shadow-sm">
                        <div className="bg-[#7BD747] rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 shadow-sm max-w-4xl">
                            <div className="space-y-4">
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Authorization</span>
                                    <span className="text-gray-800 text-xs font-bold">-</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Alarm code</span>
                                    <span className="text-gray-800 text-xs font-bold">-</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Pets</span>
                                    <span className="text-gray-800 text-xs font-bold">-</span>
                                </div>
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Date due</span>
                                    <span className="text-gray-800 text-xs font-bold">-</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                                    <span className="text-gray-500 text-xs font-medium">Availability time 1</span>
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
                        {/* Table Header */}
                        <div className="bg-[#3A6D6C] text-white rounded-t-xl px-6 py-3 grid grid-cols-[1fr_1fr_100px] text-xs font-bold">
                            <div>Item</div>
                            <div>Quantity</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Table Body */}
                        <div className="bg-white rounded-b-xl px-6 py-2">
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
                </CollapsibleSection>

                {/* Equipment Placeholder */}
                <CollapsibleSection title="Equipment" defaultOpen={false}>
                    <div className="bg-[#F0F0F6] rounded-xl p-8 text-center text-gray-400 text-sm">
                        No equipment added yet
                    </div>
                </CollapsibleSection>

                {/* Transactions Placeholder */}
                <CollapsibleSection
                    title="Transactions"
                    defaultOpen={false}
                    action={
                        <div className="flex gap-4">
                            <button className="px-5 py-1.5 bg-[#3A6D6C] text-white rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors">
                                Money out
                            </button>
                            <button className="px-5 py-1.5 bg-[#3A6D6C] text-white rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors">
                                Money In
                            </button>
                        </div>
                    }
                >
                    <div className="bg-[#F0F0F6] rounded-xl p-12 text-center text-gray-400 text-sm">

                    </div>
                </CollapsibleSection>

                {/* Attachments Placeholder */}
                <CollapsibleSection title="Attachments" defaultOpen={true}>
                    <div className="bg-[#F0F0F6] rounded-2xl p-12 text-center text-gray-500 text-sm font-medium">
                        No attachments yet
                    </div>
                </CollapsibleSection>

            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Request"
                message="Are you sure you want to delete this maintenance request? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
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
                currentAssignee={assignee}
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
