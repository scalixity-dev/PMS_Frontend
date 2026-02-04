import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ImageIcon, Tag, FileText, Settings, DollarSign, Paperclip,
    Download, X, MessageSquare, User, Printer, Calendar, ShoppingCart, Wrench,
    Pencil, Trash2
} from 'lucide-react';
import { useRequestStore } from './store/requestStore';

const RequestDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { requests } = useRequestStore();
    const [selectedMedia, setSelectedMedia] = useState<{ type: string; url: string; name: string } | null>(null);
    const { updateRequest } = useRequestStore();

    // Materials Editing State
    const [editingItem, setEditingItem] = useState<{ type: 'material' | 'equipment'; data: any } | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'material' | 'equipment'; id: any } | null>(null);

    // Find the request from the store - try matching by both id and requestId
    const foundRequest = requests.find(r => {
        const requestIdStr = String(r.id);
        const requestIdNum = Number(r.id);
        const urlIdNum = Number(id);
        return (
            requestIdStr === id ||
            requestIdNum === urlIdNum ||
            r.requestId === id
        );
    });

    // Debug logging
    useEffect(() => {
        console.log('RequestDetails - URL id:', id);
        console.log('RequestDetails - Total requests:', requests.length);
        console.log('RequestDetails - Found request:', foundRequest);
    }, [id, requests, foundRequest]);

    if (!foundRequest) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Not Found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="text-[#7ED957] hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Use actual request data, with fallbacks for missing fields
    const request = {
        ...foundRequest,
        subCategory: foundRequest.subCategory || "",
        problem: foundRequest.problem || "",
        description: foundRequest.description || "No description provided",
        media: (() => {
            const mediaItems: Array<{ id: number; type: string; url: string; name: string }> = [];

            if (foundRequest.attachments && foundRequest.attachments.length > 0) {
                foundRequest.attachments.forEach((file, index) => {
                    if (file instanceof File) {
                        mediaItems.push({
                            id: index + 1,
                            type: file.type.startsWith('video/') ? "video" : "image",
                            url: URL.createObjectURL(file),
                            name: file.name
                        });
                    } else if (typeof file === 'string') {
                        const isVideoFile = file.startsWith('data:video/');
                        mediaItems.push({
                            id: index + 1,
                            type: isVideoFile ? "video" : "image",
                            url: file,
                            name: `attachment-${index + 1}${isVideoFile ? '.mp4' : '.jpg'}`
                        });
                    }
                });
            }

            if (foundRequest.video) {
                if (foundRequest.video instanceof File) {
                    mediaItems.push({
                        id: mediaItems.length + 1,
                        type: "video",
                        url: URL.createObjectURL(foundRequest.video),
                        name: foundRequest.video.name
                    });
                } else if (typeof foundRequest.video === 'string') {
                    mediaItems.push({
                        id: mediaItems.length + 1,
                        type: "video",
                        url: foundRequest.video,
                        name: "video.mp4"
                    });
                }
            }

            return mediaItems;
        })(),

        assigneeInfo: {
            name: foundRequest.assignee || "",
            email: "Not specified",
            phone: "Not specified",
            avatarSeed: foundRequest.assignee || "",

            type: "Not specified",
            dateInitiated: foundRequest.createdAt ? new Date(foundRequest.createdAt).toLocaleDateString() : "Not specified",
            dateDue: foundRequest.dateDue ? new Date(foundRequest.dateDue).toLocaleDateString() : "Not specified",
            startedWork: "Not specified",
            endedWork: "Not specified",
            laborTime: "Not specified",
            keyReturned: "Not specified"
        },
        materials: foundRequest.materials || [],

        subIssue: foundRequest.subIssue || "",
        title: foundRequest.title || "",
        transactions: [] as Array<{ id: number; date: string; type: string; description: string; amount: number }>,
        attachments: foundRequest.attachments || [],

        equipmentList: foundRequest.equipment ? [
            {
                id: 1,
                name: foundRequest.equipment,
                serialNumber: foundRequest.equipmentSerial || 'Not specified',
                condition: foundRequest.equipmentCondition || 'Not specified'
            }
        ] : []

    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Critical": return "bg-red-100 text-red-600";
            case "Normal": return "bg-[#DCFCE7] text-[#16A34A]";
            case "Low": return "bg-blue-100 text-blue-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const handleDeleteClick = (type: 'material' | 'equipment', id: any) => {
        setItemToDelete({ type, id });
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!itemToDelete || !foundRequest) return;

        if (itemToDelete.type === 'material') {
            const updatedMaterials = (foundRequest.materials || []).filter((m: any, index: number) => {
                const materialId = m.id || index;
                return String(materialId) !== String(itemToDelete.id);
            });
            updateRequest(foundRequest.id, { materials: updatedMaterials });
        } else if (itemToDelete.type === 'equipment') {
            // If it's the main equipment field
            if (foundRequest.equipment) {
                updateRequest(foundRequest.id, {
                    equipment: null,
                    equipmentSerial: null,
                    equipmentCondition: null
                });
            }
        }

        setIsDeleteConfirmOpen(false);
        setItemToDelete(null);
    };

    const handleEditMaterial = (material: any, index: number) => {
        setEditingItem({
            type: 'material',
            data: { ...material, index }
        });
    };

    const handleEditEquipment = (equipment: any) => {
        setEditingItem({
            type: 'equipment',
            data: { ...equipment }
        });
    };

    const saveEdit = (updatedData: any) => {
        if (!editingItem || !foundRequest) return;

        if (editingItem.type === 'material') {
            const updatedMaterials = [...(foundRequest.materials || [])];
            updatedMaterials[editingItem.data.index] = {
                ...updatedMaterials[editingItem.data.index],
                ...updatedData
            };
            updateRequest(foundRequest.id, { materials: updatedMaterials });
        } else if (editingItem.type === 'equipment') {
            // Update the equipment details
            updateRequest(foundRequest.id, {
                equipment: updatedData.name,
                equipmentSerial: updatedData.serialNumber,
                equipmentCondition: updatedData.condition
            });
        }

        setEditingItem(null);
    };

    return (
        <div className="flex flex-col gap-4 md:gap-6 w-full min-h-screen bg-white p-4 md:p-8">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center flex-wrap gap-2 text-base font-medium">
                    <li>
                        <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                    <li>
                        <Link to="/userdashboard/requests" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Request</Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                    <li className="text-[#1A1A1A] font-medium" aria-current="page">Details</li>
                </ol>
            </nav>

            <div className="max-w-7xl mx-auto w-full space-y-6">
                {/* Header / Main Info Card */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="px-2 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
                        <div className="flex items-center gap-1 lg:gap-2">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ChevronLeft size={24} className="text-gray-900" />
                            </button>
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Maintenance request</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/userdashboard/messages', { state: { viewMode: 'MR', requestId: foundRequest.id } })} className="p-2 transition-colors">
                                <MessageSquare size={20} />
                            </button>
                            <button onClick={() => window.print()} className="p-2 transition-colors">
                                <Printer size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex gap-4">
                            <div className="pt-1">
                                <Tag size={20} className="text-gray-500" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <div className="text-gray-900 font-medium text-sm md:text-base">
                                        No. {request.requestId.replace('REQ-', '')}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
                                        {request.title || `${request.category} / ${request.subCategory} / ${request.problem}${request.subIssue ? ` / ${request.subIssue}` : ''} `}
                                    </h2>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider">Property</p>
                                        <p className="text-lg md:text-xl font-semibold text-gray-900">{request.property}</p>
                                        {foundRequest.equipment && (
                                            <div className="mt-2 inline-flex items-center gap-2 bg-[#E4F2E2] text-[#2E6819] px-3 py-1 rounded-full text-xs font-bold">
                                                <div className="w-1.5 h-1.5 bg-[#2E6819] rounded-full"></div>
                                                Linked Equipment: {foundRequest.equipment}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider">Description</p>
                                    <p className="text-gray-900 font-medium text-lg md:text-xl leading-relaxed">{request.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media Section */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                            <ImageIcon size={20} />
                            <span>Media</span>
                        </div>
                    </div>
                    <div className="p-6">
                        {request.media.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {request.media.map((item) => (
                                    <div
                                        key={item.id}
                                        className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setSelectedMedia(item)}
                                    >
                                        {item.type === "video" ? (
                                            <video src={item.url} className="w-full h-full object-cover pointer-events-none">
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No media files uploaded.</p>
                        )}
                    </div>
                </div>

                {/* Info Grid (Assignee & Tenant) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assignee Information */}
                    <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-6 space-y-6">
                        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                            <User size={20} />
                            <span>Assignee Information</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Type</p>
                                <p className="text-[var(--dashboard-text-main)] font-semibold">{request.assigneeInfo.type}</p>
                            </div>
                            <div className="row-span-3">
                                <div className="bg-white rounded-xl p-4 border border-gray-100 text-center shadow-sm">
                                    {request.assigneeInfo.name ? (
                                        <>
                                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-[#E4F2E2] text-[#2E6819] font-bold text-2xl mb-3 shadow-inner">
                                                {(() => {
                                                    const nameParts = request.assigneeInfo.name.split(' ');
                                                    return nameParts.map(n => n[0]).join('').toUpperCase().slice(0, 2);
                                                })()}
                                            </div>
                                            <h3 className="font-semibold text-gray-900">{request.assigneeInfo.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1 truncate" title={request.assigneeInfo.email}>{request.assigneeInfo.email}</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-2xl mb-3 shadow-inner">
                                                <User size={32} />
                                            </div>
                                            <h3 className="font-semibold text-gray-500">Not Assigned</h3>
                                            <p className="text-xs text-gray-400 mt-1">No assignee yet</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Priority</p>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(request.priority)}`}>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    {request.priority}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Date Initiated</p>
                                <p className="text-[var(--dashboard-text-main)] font-semibold text-sm">{request.assigneeInfo.dateInitiated}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Date Due</p>
                                <p className="text-[var(--dashboard-text-main)] font-semibold text-sm">{request.assigneeInfo.dateDue}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-100 sm:col-span-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-medium mb-1 uppercase tracking-wider">Started Work</p>
                                        <p className="text-gray-900 font-bold text-xs">{request.assigneeInfo.startedWork}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-medium mb-1 uppercase tracking-wider">Ended Work</p>
                                        <p className="text-gray-900 font-bold text-xs">{request.assigneeInfo.endedWork}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-medium mb-1 uppercase tracking-wider">Labor Time</p>
                                        <p className="text-gray-900 font-bold text-xs">{request.assigneeInfo.laborTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-medium mb-1 uppercase tracking-wider">Key Returned</p>
                                        <p className="text-gray-900 font-bold text-xs">{request.assigneeInfo.keyReturned}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tenant Information */}
                    <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-6 space-y-6">
                        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                            <div className="rotate-90"><div className="rotate-180"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg></div></div>
                            <span>Tenant Information</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Authorization to Enter</p>
                                <p className="text-gray-900 font-medium">
                                    {foundRequest.authorizationToEnter
                                        ? (foundRequest.authorizationToEnter.toLowerCase() === "yes" ? "Yes" : foundRequest.authorizationToEnter.toLowerCase() === "no" ? "No" : foundRequest.authorizationToEnter)
                                        : "Not specified"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Authorization Code</p>
                                <p className="text-gray-900 font-medium">{foundRequest.authorizationCode || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Pets</p>
                                <p className="text-gray-900 font-medium">
                                    {foundRequest.pets && foundRequest.pets.length > 0 ? foundRequest.pets.join(", ") : "No pets"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Set Up Date/Time</p>
                                <p className="text-gray-900 font-medium">{foundRequest.setUpDateTime || "Not specified"}</p>
                            </div>
                            {foundRequest.availability && foundRequest.availability.length > 0 && (
                                <>
                                    {foundRequest.availability.map((slot, index) => (
                                        <div key={slot.id || index} className="sm:col-span-2">
                                            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">
                                                Availability {index + 1 > 0 ? `(${index + 1})` : ""}
                                            </p>
                                            <div className="text-[var(--dashboard-text-main)] font-semibold text-sm">
                                                {slot.date && (
                                                    <p>Date: {(() => {
                                                        try {
                                                            if (!slot.date) return "N/A";
                                                            const dateObj = new Date(slot.date);
                                                            if (isNaN(dateObj.getTime())) return slot.date;
                                                            return dateObj.toLocaleDateString();
                                                        } catch (e) {
                                                            return slot.date || "N/A";
                                                        }
                                                    })()}</p>
                                                )}
                                                {slot.timeSlots && slot.timeSlots.length > 0 && (
                                                    <p>Time: {slot.timeSlots.join(", ")}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                            {(!foundRequest.availability || foundRequest.availability.length === 0) && (
                                <div className="sm:col-span-2">
                                    <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Availability</p>
                                    <p className="text-gray-900 font-medium">Not specified</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Transactions Section */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                            <DollarSign size={20} />
                            <span>Transactions</span>
                        </div>
                    </div>
                    <div className="p-0 bg-white">
                        {request.transactions.length > 0 ? (
                            <>
                                <div className="hidden md:grid grid-cols-3 px-8 py-3 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <div>Date</div>
                                    <div>Description</div>
                                    <div className="text-right">Amount</div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {request.transactions.map((t) => (
                                        <div key={t.id} className="grid grid-cols-1 md:grid-cols-3 px-8 py-5 items-center hover:bg-gray-50 transition-colors gap-3 md:gap-0">
                                            <div className="flex items-center gap-2.5 text-sm text-gray-500 font-semibold">
                                                <Calendar size={16} className="text-gray-400" />
                                                {t.date}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-[#64748B] shrink-0 border border-gray-100 shadow-sm">
                                                    {t.description.toLowerCase().includes('material') ? <ShoppingCart size={18} /> : <Wrench size={18} />}
                                                </div>
                                                <span className="text-sm text-gray-900 font-bold">{t.description}</span>
                                            </div>
                                            <div className={`text-right text-lg font-semibold ${t.amount < 0 ? 'text-[#FF3B30]' : 'text-[#34C759]'}`}>
                                                {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center text-gray-500 italic">
                                No transaction found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Materials Section */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="w-full px-6 py-4 flex items-center gap-2 text-xl font-semibold text-gray-900 border-b border-gray-200">
                        <Tag size={20} />
                        <span>Materials Used</span>
                    </div>
                    <div className="p-6 bg-white">
                        {request.materials && request.materials.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {request.materials.map((material: any, index: number) => (
                                    <div key={material.id || index} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between shadow-sm group">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{material.name}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Quantity:</span>
                                                    <span className="text-xs font-bold text-[#2E6819] bg-[#E4F2E2] px-2 py-0.5 rounded">x{material.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditMaterial(material, index)}
                                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Material"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick('material', material.id || index)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Material"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 italic py-4">
                                No materials used found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Equipment Section */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                            <Settings size={20} />
                            <span>Linked Equipment</span>
                        </div>
                    </div>
                    <div className="p-6 bg-white">
                        {request.equipmentList && request.equipmentList.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {request.equipmentList.map((eq: any) => (
                                    <div key={eq.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-900">{eq.name}</h4>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${eq.condition === 'Good' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {eq.condition}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-4px]">
                                                <button
                                                    onClick={() => handleEditEquipment(eq)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Equipment"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick('equipment', eq.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Equipment"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Serial Number</p>
                                            <p className="text-sm font-semibold text-gray-700">{eq.serialNumber}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 italic py-4">
                                No linked equipment found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Attachments Section */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                            <Paperclip size={20} />
                            <span>Attachments</span>
                        </div>
                    </div>
                    <div className="p-6 bg-white">
                        {request.attachments && request.attachments.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {request.attachments.map((file: File | string, index: number) => {
                                    const fileName = file instanceof File ? file.name : `attachment-${index + 1}`;
                                    const fileSize = file instanceof File ? `${(file.size / 1024).toFixed(2)} KB` : 'N/A';
                                    const fileType = file instanceof File ? file.type : 'unknown';

                                    return (
                                        <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-500 group-hover:bg-[#f0fdf4] group-hover:text-[#166534] transition-colors">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate" title={fileName}>{fileName}</p>
                                                    <p className="text-xs text-gray-500">{fileSize} • {fileType}</p>
                                                </div>
                                            </div>
                                            <button
                                                className="p-2 text-gray-400 hover:text-[#7ED957] hover:bg-gray-50 rounded-lg transition-colors shrink-0"
                                                title="Download"
                                                onClick={() => {
                                                    if (file instanceof File) {
                                                        const url = URL.createObjectURL(file);
                                                        const a = document.createElement('a');
                                                        a.href = url; a.download = file.name; a.click();
                                                        URL.revokeObjectURL(url);
                                                    } else if (typeof file === 'string') {
                                                        const a = document.createElement('a');
                                                        a.href = file; a.download = fileName; a.click();
                                                    }
                                                }}
                                            >
                                                <Download size={20} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No attachments found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Media Modal */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4 md:p-10 lg:p-20"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setSelectedMedia(null)}
                            className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 md:-top-8 md:-right-12 bg-white rounded-full p-2 md:p-3 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl z-[110]"
                            aria-label="Close"
                        >
                            <X size={20} className="text-gray-700 md:hidden" strokeWidth={2.5} />
                            <X size={24} className="text-gray-700 hidden md:block" strokeWidth={2.5} />
                        </button>
                        {selectedMedia.type === "video" ? (
                            <video
                                src={selectedMedia.url}
                                controls
                                className="max-w-full max-h-full rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                                autoPlay
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                <img
                                    src={selectedMedia.url}
                                    alt={selectedMedia.name}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const a = document.createElement('a');
                                        a.href = selectedMedia.url;
                                        a.download = selectedMedia.name;
                                        a.click();
                                    }}
                                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg md:hidden"
                                >
                                    <Download size={20} className="text-gray-700" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Print Only Component */}
            <div className="hidden print:block p-8" id="printable-request">
                <div className="max-w-4xl mx-auto space-y-8 font-sans">
                    <div className="flex justify-between items-start border-b-2 border-black pb-4">
                        <div>
                            <h1 className="text-2xl font-bold">Maintenance Request #</h1>
                            <p className="text-3xl font-bold mt-1">{foundRequest.requestId}</p>
                            <p className="text-sm mt-2">Status: {foundRequest.status}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">Landlord:</p>
                            <p>Not specified</p>
                            <p className="text-sm">Not specified</p>
                        </div>
                    </div>
                    <section>
                        <h2 className="text-xl font-bold mb-4">General Information</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Property Information:</p>
                                <p className="font-bold">{foundRequest.property}</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-bold">Title:</p>
                                    <p className="text-sm">{foundRequest.category} / {foundRequest.subCategory || "N/A"} / {foundRequest.problem || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="font-bold">Categories:</p>
                                    <p className="text-sm">{foundRequest.category}</p>
                                </div>
                                <div>
                                    <p className="font-bold">Description:</p>
                                    <p className="text-sm">{foundRequest.problem || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="border-t border-black pt-4">
                        <h2 className="text-xl font-bold mb-4">Assignee Information</h2>
                        <div className="grid grid-cols-4 gap-4">
                            <div><p className="text-sm">{foundRequest.assignee || "N/A"}</p></div>
                            <div>
                                <p className="font-bold text-sm">Priority:</p>
                                <p className="text-sm">{foundRequest.priority}</p>
                            </div>
                            <div>
                                <p className="font-bold text-sm">Date initiated:</p>
                                <p className="text-sm">{new Date(foundRequest.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="font-bold text-sm">Due date:</p>
                                <p className="text-sm">{foundRequest.dateDue ? new Date(foundRequest.dateDue).toLocaleDateString() : "Not specified"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-black pt-4">
                        <h2 className="text-xl font-bold mb-4">Tenant Information</h2>
                        <div className="grid grid-cols-3 gap-y-6">
                            <div>
                                <p className="font-bold text-sm">Authorization:</p>
                                <p className="text-sm">{foundRequest.authorizationToEnter || "Allowed to enter"}</p>
                            </div>
                            <div>
                                <p className="font-bold text-sm">Alarm code:</p>
                                <p className="text-sm">{foundRequest.authorizationCode || "N/A"}</p>
                            </div>
                            <div>
                                <p className="font-bold text-sm">Pets:</p>
                                <p className="text-sm">{foundRequest.pets && foundRequest.pets.length > 0 ? foundRequest.pets.join(", ") : "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="p-2 bg-red-50 rounded-full">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Remove {itemToDelete?.type === 'material' ? 'Material' : 'Equipment'}?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to remove this {itemToDelete?.type} from the request? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsDeleteConfirmOpen(false);
                                    setItemToDelete(null);
                                }}
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Item Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Edit {editingItem.type === 'material' ? 'Material' : 'Equipment'}</h3>
                            <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const updatedData: any = {};
                            formData.forEach((value, key) => {
                                updatedData[key] = value;
                            });
                            saveEdit(updatedData);
                        }} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Name</label>
                                <input
                                    name="name"
                                    defaultValue={editingItem.data.name}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7ED957] focus:ring-4 focus:ring-[#7ED957]/10 outline-none transition-all font-semibold"
                                    placeholder="Enter name"
                                    required
                                />
                            </div>

                            {editingItem.type === 'material' ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Quantity</label>
                                    <input
                                        name="quantity"
                                        type="number"
                                        defaultValue={editingItem.data.quantity}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7ED957] focus:ring-4 focus:ring-[#7ED957]/10 outline-none transition-all font-semibold"
                                        placeholder="Enter quantity"
                                        required
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Condition</label>
                                        <select
                                            name="condition"
                                            defaultValue={editingItem.data.condition}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7ED957] focus:ring-4 focus:ring-[#7ED957]/10 outline-none transition-all font-semibold appearance-none bg-white"
                                        >
                                            <option value="Good">Good</option>
                                            <option value="Fair">Fair</option>
                                            <option value="Needs Replacement">Needs Replacement</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Serial Number</label>
                                        <input
                                            name="serialNumber"
                                            defaultValue={editingItem.data.serialNumber}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7ED957] focus:ring-4 focus:ring-[#7ED957]/10 outline-none transition-all font-semibold"
                                            placeholder="Enter serial number"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="flex-1 px-6 py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3.5 bg-[#7ED957] text-white font-bold rounded-xl hover:bg-[#6ec34a] transition-all shadow-lg shadow-[#7ED957]/20 active:scale-95"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-request, #printable-request * { visibility: visible; }
                    #printable-request { position: absolute; left: 0; top: 0; width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default RequestDetails;
