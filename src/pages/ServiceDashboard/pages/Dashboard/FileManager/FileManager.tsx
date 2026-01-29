import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FileText, Image, File, Video, MoreVertical, Download, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createPortal } from "react-dom";
import ServiceFilters from "../../../components/ServiceFilters";

interface FileItem {
    id: number;
    name: string;
    type: "PDF" | "Image" | "Document" | "Video";
    size: string;
    date: string;
}

interface MenuPosition {
    top: number;
    right: number;
}

interface ActionMenuProps {
    isOpen: boolean;
    position: MenuPosition | null;
    onClose: () => void;
    onDownload: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

interface FileMobileCardProps {
    file: FileItem;
    onDownload: () => void;
    onEdit: () => void;
    onDelete: () => void;
    handleMenuClick: (e: React.MouseEvent, id: number) => void;
    activeMenuId: number | null;
    menuPosition: MenuPosition | null;
    setActiveMenuId: (id: number | null) => void;
    getFileIcon: (type: string) => React.ReactNode;
}

const FileMobileCard: React.FC<FileMobileCardProps> = ({
    file,
    onDownload,
    onEdit,
    onDelete,
    handleMenuClick,
    activeMenuId,
    menuPosition,
    setActiveMenuId,
    getFileIcon,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-xl">
                        {getFileIcon(file.type)}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                            {file.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{file.type} • {file.size}</p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={(e) => handleMenuClick(e, file.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <MoreVertical size={18} />
                    </button>
                    <ActionMenu
                        isOpen={activeMenuId === file.id}
                        position={menuPosition}
                        onClose={() => setActiveMenuId(null)}
                        onDownload={onDownload}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                    {new Date(file.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    })}
                </span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onDownload}
                        className="text-[var(--dashboard-accent)] text-xs font-semibold flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    >
                        <Download size={14} />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

const ActionMenu: React.FC<ActionMenuProps> = ({
    isOpen,
    position,
    onClose,
    onDownload,
    onEdit,
    onDelete,
}) => {
    if (!isOpen || !position) return null;

    return createPortal(
        <>
            <div className="fixed inset-0 z-[100]" onClick={onClose} />
            <div
                className="fixed z-[101] bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-44 animate-in fade-in zoom-in-95 duration-200"
                style={{
                    top: position.top,
                    right: position.right,
                }}
            >
                <div className="px-2 space-y-0.5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload();
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <Download size={16} className="text-gray-400" />
                        Download
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <Edit2 size={16} className="text-gray-400" />
                        Edit name
                    </button>
                    <div className="h-px bg-gray-100 my-1 mx-2" />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} className="text-red-400" />
                        Delete
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
};

const ROWS_PER_PAGE = 10;

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const ServiceFileManager: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };
    const [searchQuery, setSearchQuery] = useState("");
    const [fileTypeFilter, setFileTypeFilter] = useState("All");
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
    const [editingFileId, setEditingFileId] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [files, setFiles] = useState<FileItem[]>([
        { id: 1, name: "Lease Agreement.pdf", type: "PDF", size: "2.4 MB", date: "2024-01-15" },
        { id: 2, name: "Property Photos.jpg", type: "Image", size: "5.8 MB", date: "2024-01-20" },
        { id: 3, name: "Maintenance Report.docx", type: "Document", size: "1.2 MB", date: "2024-02-01" },
        { id: 4, name: "Inspection Video.mp4", type: "Video", size: "45.6 MB", date: "2024-02-05" },
        { id: 5, name: "Tenant Agreement.pdf", type: "PDF", size: "3.1 MB", date: "2024-01-10" },
        { id: 6, name: "Floor Plan.png", type: "Image", size: "4.2 MB", date: "2024-01-25" },
    ]);

    // Close menu on scroll
    useEffect(() => {
        const handleScroll = () => setActiveMenuId(null);
        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, []);

    const handleMenuClick = useCallback((e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
        });
        setActiveMenuId(activeMenuId === id ? null : id);
    }, [activeMenuId]);

    const handleDownload = (file: FileItem) => {
        const dummyContent = `Mock content for ${file.name}`;
        const blob = new Blob([dummyContent], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleDelete = (id: number) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleEditInit = (file: FileItem) => {
        setEditingFileId(file.id);
        setNewName(file.name);
    };

    const handleSaveName = () => {
        if (editingFileId && newName.trim()) {
            setFiles(prev => prev.map(f =>
                f.id === editingFileId ? { ...f, name: newName.trim() } : f
            ));
            setEditingFileId(null);
        }
    };

    const filteredFiles = useMemo(() => {
        return files.filter((file) => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!file.name.toLowerCase().includes(query) && !file.type.toLowerCase().includes(query)) {
                    return false;
                }
            }
            if (fileTypeFilter !== "All" && file.type !== fileTypeFilter) return false;
            return true;
        });
    }, [searchQuery, fileTypeFilter, files]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredFiles.length / ROWS_PER_PAGE);
    const paginatedFiles = useMemo(() => {
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = startIndex + ROWS_PER_PAGE;
        return filteredFiles.slice(startIndex, endIndex);
    }, [filteredFiles, currentPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, fileTypeFilter]);

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

    const totalSize = useMemo(() => {
        const totalMB = files.reduce((acc, file) => {
            const sizeVal = parseFloat(file.size.split(' ')[0]);
            return isNaN(sizeVal) ? acc : acc + sizeVal;
        }, 0);
        return `${totalMB.toFixed(1)} MB`;
    }, [files]);

    const stats = [
        { label: "All Files", value: files.length },
        { label: "Total Size", value: totalSize },
        { label: "Documents", value: files.filter(f => f.type === "PDF" || f.type === "Document").length },
        { label: "Media", value: files.filter(f => f.type === "Image" || f.type === "Video").length },
    ];

    const getFileIcon = (type: string) => {
        switch (type) {
            case "PDF": return <FileText size={16} className="text-red-600" />;
            case "Image": return <Image size={16} className="text-blue-600" />;
            case "Document": return <FileText size={16} className="text-blue-600" />;
            case "Video": return <Video size={16} className="text-purple-600" />;
            default: return <File size={16} className="text-gray-600" />;
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <div className={`mx-auto space-y-4 md:space-y-6 transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-base font-medium ">
                        <li>
                            <button onClick={() => navigate("/service-dashboard")} className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</button>
                        </li>
                        <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                        <li className="text-[#1A1A1A] font-medium" aria-current="page">File manager</li>
                    </ol>
                </nav>

                <div className="flex flex-col sm:flex-row sm:items-center pt-3 justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">File manager</h1>
                </div>

                <div className="border-t border-[#E5E7EB]"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-[#F4F4F4] border border-[#E5E7EB] rounded-lg p-6 shadow-sm">
                            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <ServiceFilters
                    onSearch={setSearchQuery}
                    currentStatus={fileTypeFilter}
                    onStatusChange={setFileTypeFilter}
                    statusOptions={['All', 'PDF', 'Image', 'Document', 'Video']}
                    statusLabel="File type"
                />

                <div className="hidden lg:flex bg-white rounded-[1rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#7ED957] to-[#6BC847]">
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">Name</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">Type</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">Size</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">Date</th>
                                    <th className="px-6 py-4 text-center text-white font-semibold text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedFiles.length > 0 ? (
                                    paginatedFiles.map((file) => (
                                        <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {getFileIcon(file.type)}
                                                    <span className="text-sm text-gray-900 font-medium">{file.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{file.type}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{file.size}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {new Date(file.date).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="relative inline-block">
                                                    <button
                                                        onClick={(e) => handleMenuClick(e, file.id)}
                                                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                    <ActionMenu
                                                        isOpen={activeMenuId === file.id}
                                                        position={menuPosition}
                                                        onClose={() => setActiveMenuId(null)}
                                                        onDownload={() => handleDownload(file)}
                                                        onEdit={() => handleEditInit(file)}
                                                        onDelete={() => handleDelete(file.id)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-gray-400">No files found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination for Desktop */}
                    {filteredFiles.length > ROWS_PER_PAGE && (
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
                    {paginatedFiles.length > 0 ? (
                        paginatedFiles.map((file) => (
                            <FileMobileCard
                                key={file.id}
                                file={file}
                                onDownload={() => handleDownload(file)}
                                onEdit={() => handleEditInit(file)}
                                onDelete={() => handleDelete(file.id)}
                                handleMenuClick={handleMenuClick}
                                activeMenuId={activeMenuId}
                                menuPosition={menuPosition}
                                setActiveMenuId={setActiveMenuId}
                                getFileIcon={getFileIcon}
                            />
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 font-medium border border-gray-200 shadow-sm">
                            <p>No files found</p>
                        </div>
                    )}

                    {/* Pagination for Mobile */}
                    {filteredFiles.length > ROWS_PER_PAGE && (
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

            {/* Edit Modal */}
            {editingFileId !== null && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit File Name</h3>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] mb-6"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditingFileId(null)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveName}
                                className="flex-1 px-4 py-2.5 bg-[#7ED957] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-[#7ED957]/30"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceFileManager;
