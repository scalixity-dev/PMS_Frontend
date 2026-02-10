import React, { useMemo, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, Search, MoreVertical, Printer, XCircle, Paperclip, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import RequestSuccessModal from "./components/RequestSuccessModal";
import DeleteConfirmationModal from "../../../../components/common/modals/DeleteConfirmationModal";
import { useRequestStore } from "./store/requestStore";
import type { ServiceRequest, AvailabilityOption } from "../../utils/types";

// Constants
const STATUS_OPTIONS = [
  { label: "New", value: "New" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

const PRIORITY_OPTIONS = [
  { label: "Critical", value: "Critical" },
  { label: "Normal", value: "Normal" },
  { label: "Low", value: "Low" },
];

const CATEGORY_OPTIONS = [
  { label: "Appliances", value: "Appliances" },
  { label: "Plumbing", value: "Plumbing" },
  { label: "Electrical", value: "Electrical" },
  { label: "Exterior", value: "Exterior" },
  { label: "Households", value: "Households" },
  { label: "Outdoors", value: "Outdoors" },
];

// Utility functions (moved outside component for better performance)
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-600";
    case "Normal":
      return "bg-green-100 text-green-600";
    case "Low":
      return "bg-blue-100 text-blue-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "New":
      return "bg-red-500";
    case "In Progress":
      return "bg-yellow-500";
    case "Completed":
      return "bg-green-500";
    case "Cancelled":
      return "bg-gray-400";
    default:
      return "bg-gray-200";
  }
};

const getStatusTextColor = (status: string): string => {
  switch (status) {
    case "New":
      return "text-red-500";
    case "In Progress":
      return "text-yellow-500";
    case "Completed":
      return "text-green-500";
    case "Cancelled":
      return "text-gray-400";
    default:
      return "text-gray-500";
  }
};

// Types
interface MenuPosition {
  top: number;
  right: number;
}

interface ActionMenuProps {
  isOpen: boolean;
  position: MenuPosition | null;
  onClose: () => void;
  onPrint: () => void;
  onCancel: () => void;
  onDelete: () => void;
  canCancel: boolean;
}

// Action Menu Component
const ActionMenu: React.FC<ActionMenuProps> = ({ isOpen, position, onClose, onPrint, onCancel, onDelete, canCancel }) => {
  if (!isOpen || !position) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[100]"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        className="fixed z-[101] bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-40 animate-in fade-in zoom-in-95 duration-200"
        style={{
          top: position.top,
          right: position.right,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-2 space-y-0.5">
          <button
            onClick={onPrint}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Printer size={14} className="text-gray-400" />
            Print
          </button>
          <button
            onClick={onCancel}
            disabled={!canCancel}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${canCancel ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'
              }`}
          >
            <XCircle size={14} className={canCancel ? "text-gray-400" : "text-gray-200"} />
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} className="text-red-400" />
            Delete
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

interface RequestRowProps {
  request: ServiceRequest;
  onRowClick: () => void;
  onAttachmentClick: (e: React.MouseEvent) => void;
  onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isMenuOpen: boolean;
  menuPosition: MenuPosition | null;
  onMenuClose: () => void;
  onPrint: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onChatClick: (e: React.MouseEvent) => void;
  canCancel: boolean;
}

// Request Row Component
const RequestRow: React.FC<RequestRowProps> = ({
  request,
  onRowClick,
  onAttachmentClick,
  onMenuClick,
  isMenuOpen,
  menuPosition,
  onMenuClose,
  onPrint,
  onCancel,
  onDelete,
  onChatClick,
  canCancel,
}) => (
  <tr
    onClick={onRowClick}
    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
  >
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(request.status)}`} />
        <span className={`text-sm font-medium ${getStatusTextColor(request.status)}`}>
          {request.status}
        </span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-700">{request.requestId}</td>
    <td className="px-6 py-4 text-sm text-gray-700">{request.category}</td>
    <td className="px-6 py-4 text-sm text-gray-700">
      {new Date(request.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </td>
    <td className="px-6 py-4">
      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${getPriorityColor(request.priority)}`}>
        <div className="w-1.5 h-1.5 bg-current rounded-full" />
        {request.priority}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-gray-700">
      {request.assignee || "Not Assigned"}
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center justify-center gap-3">
        {(request.attachments && request.attachments.length > 0) || request.video ? (
          <button
            className="text-[var(--dashboard-accent)] hover:opacity-80 mb-1 transition-opacity"
            onClick={onAttachmentClick}
            title="Download attachments"
          >
            <Paperclip size={18} />
          </button>
        ) : null}
        <button
          className="text-[var(--dashboard-accent)] hover:opacity-80 mb-1 transition-opacity"
          onClick={onChatClick}
        >
          <MessageSquare size={18} />
        </button>
        <div className="relative">
          <button
            onClick={onMenuClick}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          <ActionMenu
            isOpen={isMenuOpen}
            position={menuPosition}
            onClose={onMenuClose}
            onPrint={onPrint}
            onCancel={onCancel}
            onDelete={onDelete}
            canCancel={canCancel}
          />
        </div>
      </div>
    </td>
  </tr>
);

interface RequestMobileCardProps {
  request: ServiceRequest;
  onCardClick: () => void;
  onAttachmentClick: (e: React.MouseEvent) => void;
  onChatClick: (e: React.MouseEvent) => void;
  onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isMenuOpen: boolean;
  menuPosition: MenuPosition | null;
  onMenuClose: () => void;
  onPrint: () => void;
  onCancel: () => void;
  onDelete: () => void;
  canCancel: boolean;
}

const RequestMobileCard: React.FC<RequestMobileCardProps> = ({
  request,
  onCardClick,
  onAttachmentClick,
  onChatClick,
  onMenuClick,
  isMenuOpen,
  menuPosition,
  onMenuClose,
  onPrint,
  onCancel,
  onDelete,
  canCancel,
}) => (
  <div
    onClick={onCardClick}
    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:border-[var(--dashboard-accent)] transition-all duration-300 cursor-pointer space-y-4"
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(request.status)}`} />
        <span className={`text-sm font-medium ${getStatusTextColor(request.status)}`}>
          {request.status}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {(request.attachments && request.attachments.length > 0) || request.video ? (
          <button
            className="p-2 text-[var(--dashboard-accent)] hover:bg-gray-100 rounded-full transition-colors"
            onClick={onAttachmentClick}
            title="Download attachments"
          >
            <Paperclip size={18} />
          </button>
        ) : null}
        <button
          onClick={onChatClick}
          className="p-2 text-[var(--dashboard-accent)] hover:bg-gray-100 rounded-full transition-colors"
        >
          <MessageSquare size={18} />
        </button>
        <div className="relative">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          <ActionMenu
            isOpen={isMenuOpen}
            position={menuPosition}
            onClose={onMenuClose}
            onPrint={onPrint}
            onCancel={onCancel}
            onDelete={onDelete}
            canCancel={canCancel}
          />
        </div>
      </div>
    </div>

    <div className="space-y-1">
      <div className="flex justify-between items-baseline gap-2">
        <h3 className="text-[var(--dashboard-text-main)] font-semibold text-lg truncate">{request.category}</h3>
        <span className="text-gray-400 text-xs font-medium whitespace-nowrap uppercase tracking-wider">{request.requestId}</span>
      </div>
      <p className="text-[var(--dashboard-secondary)] text-sm font-medium line-clamp-1">
        {new Date(request.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>

    <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100 mt-1">
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(request.priority)}`}>
        {request.priority}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Assignee</span>
        <span className="text-[var(--dashboard-text-main)] font-semibold text-xs truncate max-w-[100px]">
          {request.assignee || "Not Assigned"}
        </span>
      </div>
    </div>
  </div>
);

interface PrintableRequestProps {
  request: ServiceRequest | null;
}

// Printable Request Component
const PrintableRequest: React.FC<PrintableRequestProps> = ({ request }) => {
  if (!request) return null;

  return (
    <div className="hidden print:block p-8" id="printable-request">
      <div className="max-w-4xl mx-auto space-y-8 font-sans">
        <div className="flex justify-between items-start border-b-2 border-black pb-4">
          <div>
            <h1 className="text-2xl font-bold">Maintenance Request #</h1>
            <p className="text-3xl font-bold mt-1">{request.requestId}</p>
            <p className="text-sm mt-2">Status: {request.status}</p>
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
              <p className="font-bold">{request.property}</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-bold">Title:</p>
                <p className="text-sm">
                  {request.category} / {request.subCategory || "N/A"} / {request.problem || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-bold">Categories:</p>
                <p className="text-sm">{request.category}</p>
              </div>
              <div>
                <p className="font-bold">Description:</p>
                <p className="text-sm">{request.problem || "N/A"}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-black pt-4">
          <h2 className="text-xl font-bold mb-4">Assignee Information</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm">{request.assignee || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold text-sm">Priority:</p>
              <p className="text-sm">{request.priority}</p>
            </div>
            <div>
              <p className="font-bold text-sm">Date initiated:</p>
              <p className="text-sm">{new Date(request.createdAt).toLocaleDateString()}</p>
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
              <p className="text-sm">{request.authorizationToEnter || "Allowed to enter"}</p>
            </div>
            <div>
              <p className="font-bold text-sm">Alarm code:</p>
              <p className="text-sm">{request.authorizationCode || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold text-sm">Pets:</p>
              <p className="text-sm">
                {request.pets && request.pets.length > 0 ? request.pets.join(", ") : "N/A"}
              </p>
            </div>
            {request.availability && request.availability.length > 0 ? (
              request.availability.map((slot: AvailabilityOption, index: number) => (
                <div key={index}>
                  <p className="font-bold text-sm">Availability time {index + 1}:</p>
                  <p className="text-sm">
                    {(() => {
                      const [year, month, day] = slot.date.split("-").map(Number);
                      return new Date(year, month - 1, day).toLocaleDateString();
                    })()} - {slot.timeSlots.join(", ")}
                  </p>
                </div>
              ))
            ) : (
              <div>
                <p className="font-bold text-sm">Availability:</p>
                <p className="text-sm">N/A</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-black pt-4 pb-20">
          <h2 className="text-xl font-bold mb-4">Transactions</h2>
          <p className="text-sm">N/A</p>
        </div>
      </div>
    </div>
  );
};

const ROWS_PER_PAGE = 10;

const Requests: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestFilters, setRequestFilters, resetRequestFilters, requests, updateRequestStatus, deleteRequest } = useRequestStore();
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [printingRequest, setPrintingRequest] = useState<ServiceRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<ServiceRequest | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<ServiceRequest | null>(null);
  const { search: searchQuery, status: statusFilter, priority: priorityFilter, category: categoryFilter } = requestFilters;

  const showSuccess = location.state?.showSuccess;
  const submittedRequestId = location.state?.requestId;

  // Close menu on scroll or resize
  useEffect(() => {
    const handleScroll = () => {
      if (activeMenuId !== null) setActiveMenuId(null);
    };
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [activeMenuId]);

  const handleCloseModal = useCallback(() => {
    navigate(location.pathname, { replace: true, state: {} });
  }, [navigate, location.pathname]);

  const handlePrint = useCallback((request: ServiceRequest) => {
    setPrintingRequest(request);
    setActiveMenuId(null);
    setTimeout(() => {
      window.print();
    }, 100);
  }, []);

  const handleCancel = useCallback((request: ServiceRequest) => {
    if (request.status !== "New") return;
    setRequestToCancel(request);
    setIsCancelModalOpen(true);
    setActiveMenuId(null);
  }, []);

  const confirmCancel = useCallback(() => {
    if (requestToCancel) {
      updateRequestStatus(requestToCancel.id, "Cancelled");
      setIsCancelModalOpen(false);
      setRequestToCancel(null);
    }
  }, [updateRequestStatus, requestToCancel]);

  const handleDelete = useCallback((request: ServiceRequest) => {
    setRequestToDelete(request);
    setIsDeleteModalOpen(true);
    setActiveMenuId(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (requestToDelete) {
      deleteRequest(requestToDelete.id);
      setIsDeleteModalOpen(false);
      setRequestToDelete(null);
    }
  }, [deleteRequest, requestToDelete]);

  const handleDownloadAttachments = useCallback((e: React.MouseEvent, request: ServiceRequest) => {
    e.stopPropagation();

    // Helper to trigger download
    const downloadFile = (file: File | string, fileName: string) => {
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (typeof file === 'string') {
        const a = document.createElement('a');
        a.href = file;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };

    // Collect all files to download
    const filesToDownload: Array<{ file: File | string; name: string }> = [];

    // Add attachments
    if (request.attachments && request.attachments.length > 0) {
      request.attachments.forEach((file, index) => {
        let name = "";
        if (file instanceof File) {
          name = file.name;
        } else {
          const isVideo = file.startsWith('data:video/');
          const isPdf = file.startsWith('data:application/pdf');
          const ext = isVideo ? '.mp4' : isPdf ? '.pdf' : '.jpg';
          name = `attachment-${request.requestId}-${index + 1}${ext}`;
        }
        filesToDownload.push({ file, name });
      });
    }

    // Add video
    if (request.video) {
      let name = "";
      if (request.video instanceof File) {
        name = request.video.name;
      } else {
        name = `video-${request.requestId}.mp4`;
      }
      filesToDownload.push({ file: request.video, name });
    }

    // Download files with delays to prevent browser blocking
    filesToDownload.forEach(({ file, name }, index) => {
      setTimeout(() => {
        downloadFile(file, name);
      }, index * 300); // 300ms delay between each download
    });
  }, []);

  const handleMenuClick = useCallback((event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    event.stopPropagation();
    if (activeMenuId === id) {
      setActiveMenuId(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
    setActiveMenuId(id);
  }, [activeMenuId]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !request.requestId.toLowerCase().includes(query) &&
          !request.category.toLowerCase().includes(query) &&
          !request.property.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter && request.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter && request.priority !== priorityFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter && request.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, requests]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRequests.length / ROWS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter]);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-full mx-auto p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-base font-medium">
            <li>
              <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
            </li>
            <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
            <li className="text-[#1A1A1A]  font-medium" aria-current="page">Request</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center pt-3 justify-between gap-4">
          <div className="flex items-center gap-5">
            <h1 className="text-2xl font-semibold text-gray-900">Requests</h1>
            <span className="text-[#4B5563] text-sm">Total {requests.length}</span>
          </div>
          <PrimaryActionButton
            text="Add Request"
            onClick={() => navigate("/userdashboard/new-request")}
            className="bg-[#7ED957] hover:bg-[#6BC847] !px-6 !py-2.5 w-full sm:w-auto"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5E7EB]"></div>

        {/* Filters Section */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full md:w-auto md:flex-1 max-w-none md:max-w-xs">
            <input
              type="text"
              placeholder="Search Anything..."
              value={searchQuery}
              onChange={(e) => setRequestFilters({ search: e.target.value })}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-600 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-transparent shadow-[0px_2px_4px_rgba(0,0,0,0.05)]"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white rounded-lg p-1.5 hover:bg-gray-800 transition-colors">
              <Search size={14} />
            </button>
          </div>

          <FilterDropdown
            placeholder="Status"
            value={statusFilter}
            onSelect={(val) => setRequestFilters({ status: val })}
            options={STATUS_OPTIONS}
          />

          <FilterDropdown
            placeholder="Priority"
            value={priorityFilter}
            onSelect={(val) => setRequestFilters({ priority: val })}
            options={PRIORITY_OPTIONS}
          />

          <FilterDropdown
            placeholder="Category"
            value={categoryFilter}
            onSelect={(val) => setRequestFilters({ category: val })}
            options={CATEGORY_OPTIONS}
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:flex bg-white rounded-[1rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden flex-col">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#7ED957] to-[#6BC847]">
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Assignee
                  </th>
                  <th className="px-6 py-4 text-center text-white font-semibold text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <RequestRow
                      key={request.id}
                      request={request}
                      onRowClick={() => navigate(`/userdashboard/requests/${request.id}`)}
                      onAttachmentClick={(e) => handleDownloadAttachments(e, request)}
                      onMenuClick={(e) => handleMenuClick(e, request.id)}
                      isMenuOpen={activeMenuId === request.id}
                      menuPosition={menuPosition}
                      onMenuClose={() => setActiveMenuId(null)}
                      onPrint={() => handlePrint(request)}
                      onCancel={() => handleCancel(request)}
                      onDelete={() => handleDelete(request)}
                      canCancel={request.status === "New"}
                      onChatClick={(e) => {
                        e.stopPropagation();
                        navigate('/userdashboard/messages', {
                          state: { viewMode: 'MR', requestId: request.id }
                        });
                      }}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <p className="text-sm">No requests found</p>
                        <button
                          onClick={resetRequestFilters}
                          className="mt-2 text-[#7ED957] hover:underline text-sm font-medium"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination for Desktop */}
          {filteredRequests.length > ROWS_PER_PAGE && (
            <div className="px-8 py-4 border-t border-gray-200 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full transition-colors ${currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-all ${currentPage === page
                    ? 'bg-[#3A7D76] text-white shadow-lg'
                    : 'bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full transition-colors ${currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden flex flex-col gap-4">
          {paginatedRequests.length > 0 ? (
            paginatedRequests.map((request) => (
              <RequestMobileCard
                key={request.id}
                request={request}
                onCardClick={() => navigate(`/userdashboard/requests/${request.id}`)}
                onAttachmentClick={(e) => handleDownloadAttachments(e, request)}
                onChatClick={(e) => {
                  e.stopPropagation();
                  navigate('/userdashboard/messages', {
                    state: { viewMode: 'MR', requestId: request.id }
                  });
                }}
                onMenuClick={(e) => handleMenuClick(e, request.id)}
                isMenuOpen={activeMenuId === request.id}
                menuPosition={menuPosition}
                onMenuClose={() => setActiveMenuId(null)}
                onPrint={() => handlePrint(request)}
                onCancel={() => handleCancel(request)}
                onDelete={() => handleDelete(request)}
                canCancel={request.status === "New"}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400 font-medium border border-gray-200 shadow-sm">
              <p>No requests found</p>
              <button
                onClick={resetRequestFilters}
                className="mt-2 text-[#7ED957] hover:underline text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination for Mobile */}
          {filteredRequests.length > ROWS_PER_PAGE && (
            <div className="flex justify-center items-center gap-2 py-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full transition-colors ${currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-all ${currentPage === page
                    ? 'bg-[#3A7D76] text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full transition-colors ${currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
      <RequestSuccessModal
        isOpen={!!showSuccess}
        onClose={handleCloseModal}
        requestId={submittedRequestId || ""}
        propertyName="Main Street Apartment"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Request"
        itemName={requestToDelete?.requestId}
      />

      <DeleteConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Request"
        message={
          <>
            Are you sure you want to cancel request <span className="font-bold text-gray-800">{requestToCancel?.requestId}</span>?
            <br />This action will stop the maintenance process.
          </>
        }
        confirmText="Cancel Request"
        confirmButtonClass="bg-yellow-500 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-yellow-600 transition-colors shadow-sm"
        headerClassName="bg-yellow-500"
      />

      <PrintableRequest request={printingRequest} />

    </div>
  );
};

export default Requests;



