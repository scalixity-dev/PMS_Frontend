import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, MessageSquare, Printer, Tag,
    ImageIcon, ChevronDown, ChevronUp, User,
    DollarSign, Paperclip,
    FileText, Download, X
} from 'lucide-react';
import { useRequestStore } from './store/requestStore';

const RequestDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { requests } = useRequestStore();
    const [selectedMedia, setSelectedMedia] = useState<{ type: string; url: string; name: string } | null>(null);

    // Find the request from the store - try matching by both id and requestId
    // Handle both string and number ID comparisons
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
        console.log('RequestDetails - Request IDs:', requests.map(r => ({ id: r.id, requestId: r.requestId })));
        console.log('RequestDetails - Found request:', foundRequest);
    }, [id, requests, foundRequest]);

    // Determine if sections have content for initial state
    const hasMedia = foundRequest?.attachments?.length || foundRequest?.video;
    const hasTransactions = false; // Transactions array is currently always empty
    const hasAttachments = foundRequest?.attachments?.length;

    // Initial state for collapsibles - open only if has content
    const [expandedSections, setExpandedSections] = useState({
        media: !!hasMedia,
        transactions: !!hasTransactions,
        attachments: !!hasAttachments
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

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
        // Use actual fields from the request
        subCategory: foundRequest.subCategory || "",
        problem: foundRequest.problem || "",
        description: foundRequest.description || "No description provided",
        // Convert attachments and video to media array for display
        media: (() => {
            const mediaItems: Array<{ id: number; type: string; url: string; name: string }> = [];

            // Add attachments as images
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
                        // It's a data URL (stored from localStorage)
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

            // Add video if present
            if (foundRequest.video) {
                if (foundRequest.video instanceof File) {
                    mediaItems.push({
                        id: mediaItems.length + 1,
                        type: "video",
                        url: URL.createObjectURL(foundRequest.video),
                        name: foundRequest.video.name
                    });
                } else if (typeof foundRequest.video === 'string') {
                    // It's a data URL (stored from localStorage)
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
            name: foundRequest.assignee || "Not Assigned",
            email: "",
            avatarSeed: foundRequest.assignee || "User",
            type: "One Time",
            dateInitiated: foundRequest.createdAt ? new Date(foundRequest.createdAt).toLocaleDateString() : "-",
            dateDue: "-"
        },
        transactions: [],
        attachments: foundRequest.attachments || []
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Critical": return "bg-red-100 text-red-600";
            case "Normal": return "bg-[#DCFCE7] text-[#16A34A]"; // Matching image green
            case "Low": return "bg-blue-100 text-blue-600";
            default: return "bg-gray-100 text-gray-600";
        }
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
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ChevronLeft size={24} className="text-gray-900" />
                            </button>
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Maintenance request</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/userdashboard/messages', {
                                    state: { viewMode: 'MR', requestId: foundRequest.id }
                                })}
                                className="p-2  transition-colors"
                            >
                                <MessageSquare size={20} />
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="p-2 transition-colors"
                            >
                                <Printer size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex gap-4">
                            {/* Icon */}
                            <div className="pt-1">
                                <Tag size={20} className="text-gray-500" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                {/* Request ID & Title */}
                                <div className="space-y-2">
                                    <div className="text-gray-900 font-medium text-sm md:text-base">
                                        No. {request.requestId.replace('REQ-', '')}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
                                        {request.category} / {request.subCategory} / {request.problem}
                                    </h2>
                                </div>

                                {/* Property */}
                                <div className="flex gap-4">

                                    <div className="flex-1 space-y-1">
                                        <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider">Property</p>
                                        <p className="text-lg md:text-xl font-semibold text-gray-900">{request.property}</p>
                                    </div>
                                </div>

                                {/* Description */}
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
                    <button
                        onClick={() => toggleSection('media')}
                        className="w-full px-6 py-4 flex items-center justify-between transition-colors"
                    >
                        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                            <ImageIcon size={20} />
                            <span>Media</span>
                        </div>
                        {expandedSections.media ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {expandedSections.media && (
                        <div className="p-6 border-t border-gray-200">
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
                    )}
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
                            {/* Profile Card */}
                            <div className="row-span-3">
                                <div className="bg-white rounded-xl p-4 border border-gray-100 text-center shadow-sm">
                                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-red-100 mb-3">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.assigneeInfo.avatarSeed}`}
                                            alt={request.assigneeInfo.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{request.assigneeInfo.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1 truncate" title={request.assigneeInfo.email}>{request.assigneeInfo.email}</p>
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
                                        ? (foundRequest.authorizationToEnter.toLowerCase() === "yes"
                                            ? "Yes"
                                            : foundRequest.authorizationToEnter.toLowerCase() === "no"
                                                ? "No"
                                                : foundRequest.authorizationToEnter)
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
                                    {foundRequest.pets && foundRequest.pets.length > 0
                                        ? foundRequest.pets.join(", ")
                                        : "No pets"}
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
                                                        const [year, month, day] = slot.date.split("-").map(Number);
                                                        return new Date(year, month - 1, day).toLocaleDateString();
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
                    <button
                        onClick={() => toggleSection('transactions')}
                        className="w-full px-6 py-4 flex items-center justify-between  transition-colors"
                    >
                        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                            <DollarSign size={20} />
                            <span>Transactions</span>
                        </div>
                        {expandedSections.transactions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {expandedSections.transactions && (
                        <div className="p-6 border-t border-gray-200">
                            {request.transactions.length > 0 ? (
                                <div>{/* Transaction list would go here */}</div>
                            ) : (
                                <p className="text-gray-500 italic">No transactions recorded.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Attachments Section */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <button
                        onClick={() => toggleSection('attachments')}
                        className="w-full px-6 py-4 flex items-center justify-between  transition-colors"
                    >
                        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                            <Paperclip size={20} />
                            <span>Attachments</span>
                        </div>
                        {expandedSections.attachments ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {expandedSections.attachments && (
                        <div className="p-6 border-t border-gray-200">
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
                                                            a.href = url;
                                                            a.download = file.name;
                                                            a.click();
                                                            URL.revokeObjectURL(url);
                                                        } else if (typeof file === 'string') {
                                                            const a = document.createElement('a');
                                                            a.href = file;
                                                            a.download = fileName;
                                                            a.click();
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
                    )}
                </div>

            </div>

            {/* Media Modal */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4 md:p-10 lg:p-20"
                    onClick={() => setSelectedMedia(null)}
                >
                    {/* Media Content */}
                    <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        {/* Close Button - positioned on top-right of content */}
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
                                {/* Mobile Download Button */}
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
                            <p>Ashendra Sharma</p>
                            <p className="text-sm">ashendrasharma360@gmail.com</p>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold mb-4">General Information</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                                    Property Information:
                                </p>
                                <p className="font-bold">{foundRequest.property}</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-bold">Title:</p>
                                    <p className="text-sm">
                                        {foundRequest.category} / {foundRequest.subCategory || "N/A"} / {foundRequest.problem || "N/A"}
                                    </p>
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
                            <div>
                                <p className="text-sm">{foundRequest.assignee || "N/A"}</p>
                            </div>
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
                                <p className="text-sm">N/A</p>
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
                                <p className="text-sm">
                                    {foundRequest.pets && foundRequest.pets.length > 0 ? foundRequest.pets.join(", ") : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-request, #printable-request * {
                        visibility: visible;
                    }
                    #printable-request {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}} />
        </div>
    );
};

export default RequestDetails;
