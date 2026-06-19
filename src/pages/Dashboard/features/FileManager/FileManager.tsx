import React, { useState, useMemo, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MoreHorizontal, Check, X, FileText, UploadCloud, FolderPlus, Folder, ChevronLeft, Loader2 } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import Pagination from '../../components/Pagination';
import EditNameModal from './components/EditNameModal';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import {
    useGetFiles, useRenameFile, useDeleteFile, useUploadFile,
    useGetFolders, useCreateFolder, useRenameFolder, useDeleteFolder,
} from '../../../../hooks/useFilesQueries';
import { API_ENDPOINTS } from '../../../../config/api.config';
import { useTeamPermissions } from '../../../../context/TeamPermissionContext';

// File data structure
interface FileData {
    id: string;
    name: string;
    type: string;
    preview: string;
    date: string;
    property: string;
    sizeBytes?: number | null;
}

const isValidPreviewUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;

    try {
        const parsedUrl = new URL(url);

        // Allow https (and http for localhost)
        const isLocalhost = parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1';
        return parsedUrl.protocol === 'https:' || (isLocalhost && parsedUrl.protocol === 'http:');
    } catch {
        // Invalid URL format
        return false;
    }
};

const FilePreviewModal = ({ isOpen, file, onClose }: { isOpen: boolean; file: FileData | null; onClose: () => void }) => {
    if (!isOpen || !file) return null;

    const isPdf = file.type === 'pdf';
    const isUrlValid = isValidPreviewUrl(file.preview);

    // Fallback component for blocked/invalid URLs
    const BlockedPreviewFallback = () => (
        <div className="w-full bg-white rounded-lg h-[85vh] relative flex flex-col items-center justify-center">
            <button
                onClick={onClose}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-gray-800 shadow-lg hover:bg-gray-100 transition-colors z-50"
            >
                <X size={20} />
            </button>
            <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <X size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Preview Blocked</h3>
                <p className="text-gray-600 max-w-md">
                    This file cannot be previewed because the source URL is not from an approved domain
                    or does not meet security requirements.
                </p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>

                {isPdf ? (
                    isUrlValid ? (
                        <div className="w-full bg-white rounded-lg h-[85vh] relative flex flex-col">
                            <button
                                onClick={onClose}
                                className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-gray-800 shadow-lg hover:bg-gray-100 transition-colors z-50"
                            >
                                <X size={20} />
                            </button>
                            <iframe
                                src={file.preview}
                                className="w-full h-full rounded-lg border-0"
                                title="PDF Preview"
                            />
                        </div>
                    ) : (
                        <BlockedPreviewFallback />
                    )
                ) : isUrlValid ? (
                    <div className="relative">
                        <img
                            src={file.preview}
                            alt="Full preview"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                            referrerPolicy="no-referrer"
                        />
                        <button
                            onClick={onClose}
                            className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-gray-800 shadow-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <BlockedPreviewFallback />
                )}
            </div>
        </div>
    );
};



const ITEMS_PER_PAGE = 10;

// Custom error class for distinguishing terminal errors from network/CORS errors
class DownloadError extends Error {
    isTerminal: boolean;
    constructor(message: string, isTerminal: boolean = false) {
        super(message);
        this.name = 'DownloadError';
        this.isTerminal = isTerminal;
    }
}

// Types for filter state - extends Record for DashboardFilter compatibility
type FileFilters = Record<string, string[]> & {
    type: string[];
};

const FileManager: React.FC = () => {
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const { isTeamMember, canManage } = useTeamPermissions();
    const canEdit = !isTeamMember || canManage('document-templates');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [previewFile, setPreviewFile] = useState<FileData | null>(null);
    const [editingFile, setEditingFile] = useState<FileData | null>(null);
    const [deletingFile, setDeletingFile] = useState<FileData | null>(null);
    const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    // Folder navigation state
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
    const [folderPath, setFolderPath] = useState<{ id: string | undefined; name: string }[]>([{ id: undefined, name: 'Root' }]);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [editingFolder, setEditingFolder] = useState<{ id: string; name: string } | null>(null);
    const [deletingFolder, setDeletingFolder] = useState<{ id: string; name: string } | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Backend data - scoped to current folder
    const { data: rawFiles = [] } = useGetFiles(currentFolderId);
    const { data: rawFolders = [] } = useGetFolders(currentFolderId);
    const renameFileMutation = useRenameFile();
    const deleteFileMutation = useDeleteFile();
    const uploadFileMutation = useUploadFile();
    const createFolderMutation = useCreateFolder();
    const renameFolderMutation = useRenameFolder();
    const deleteFolderMutation = useDeleteFolder();

    // Upload handler: 2-step (multipart /upload/file → save metadata to /files/upload)
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError(null);
        setIsUploading(true);

        try {
            // Step 1: multipart upload to cloud via /upload/file
            const formData = new FormData();
            formData.append('file', file);
            
            let category = 'DOCUMENT';
            if (file.type.startsWith('image/')) category = 'IMAGE';
            else if (file.type.startsWith('video/')) category = 'VIDEO';
            
            formData.append('category', category);

            const uploadRes = await fetch(API_ENDPOINTS.UPLOAD.FILE, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!uploadRes.ok) {
                const err = await uploadRes.json().catch(() => ({}));
                throw new Error(err?.message || `Upload failed: ${uploadRes.statusText}`);
            }

            const uploadData = await uploadRes.json();
            const fileUrl = uploadData.url || uploadData.fileUrl;
            if (!fileUrl) throw new Error('Upload succeeded but no URL returned');

            // Step 2: save file metadata record
            await uploadFileMutation.mutateAsync({
                url: fileUrl,
                name: file.name,
                originalName: file.name,
                mimeType: file.type || undefined,
                sizeBytes: file.size,
                folderId: currentFolderId,
            });
        } catch (err: any) {
            setUploadError(err?.message || 'Upload failed');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            await createFolderMutation.mutateAsync({
                name: newFolderName.trim(),
                parentId: currentFolderId,
            });
            setNewFolderName('');
            setIsCreateFolderOpen(false);
        } catch (err: any) {
            setUploadError(err?.message || 'Failed to create folder');
        }
    };

    const handleEnterFolder = (folder: { id: string; name: string }) => {
        setCurrentFolderId(folder.id);
        setFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
        setCurrentPage(1);
    };

    const handleFolderBreadcrumbClick = (index: number) => {
        const target = folderPath[index];
        setCurrentFolderId(target.id);
        setFolderPath(folderPath.slice(0, index + 1));
        setCurrentPage(1);
    };

    const handleRenameFolderSubmit = async (newName: string) => {
        if (!editingFolder) return;
        try {
            await renameFolderMutation.mutateAsync({ id: editingFolder.id, name: newName });
            setEditingFolder(null);
        } catch (err: any) {
            setUploadError(err?.message || 'Failed to rename folder');
        }
    };

    const handleDeleteFolderConfirm = async () => {
        if (!deletingFolder) return;
        try {
            await deleteFolderMutation.mutateAsync(deletingFolder.id);
            setDeletingFolder(null);
        } catch (err: any) {
            setUploadError(err?.message || 'Failed to delete folder');
        }
    };

    // Map backend records to local FileData shape
    const files: FileData[] = rawFiles.map((f) => {
        const ext = f.originalName.split('.').pop()?.toLowerCase() ?? f.mimeType?.split('/').pop() ?? '';
        const d = new Date(f.createdAt);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const date = `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]}, ${d.getFullYear()}`;
        return {
            id: f.id,
            name: f.name,
            type: ext,
            preview: f.url,
            date,
            property: f.propertyId ?? 'General',
            sizeBytes: f.sizeBytes,
        };
    });

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setActiveActionMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Auto-dismiss download error after 5 seconds
    React.useEffect(() => {
        if (downloadError) {
            const timer = setTimeout(() => setDownloadError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [downloadError]);

    // This state would likely come from a backend in real app
    const [filters, setFilters] = useState<FileFilters>({
        type: []
    });

    const filterOptions: Record<string, FilterOption[]> = {
        type: [
            { value: 'jpg', label: 'Images (jpg)' },
            { value: 'png', label: 'Images (png)' },
            { value: 'pdf', label: 'PDF Documents' },
            { value: 'docx', label: 'Word Documents' },
        ]
    };

    const filterLabels: Record<string, string> = {
        type: 'File Type'
    };

    const filteredFiles = useMemo(() => {
        return files.filter(file => {
            const matchesSearch = searchQuery === '' ||
                file.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = filters.type.length === 0 || filters.type.includes(file.type);

            return matchesSearch && matchesType;
        });
    }, [searchQuery, filters, files]);

    const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
    const paginatedFiles = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredFiles.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, filteredFiles]);

    // Group files by property
    const groupedFiles = useMemo(() => {
        const groups: Record<string, FileData[]> = {};
        paginatedFiles.forEach(file => {
            if (!groups[file.property]) {
                groups[file.property] = [];
            }
            groups[file.property].push(file);
        });
        return groups;
    }, [paginatedFiles]);

    const propertyNames = Object.keys(groupedFiles);

    // Stats calculated from real files data
    const stats = useMemo(() => {
        const STORAGE_QUOTA_BYTES = 1024 * 1024 * 1024; // 1 GB
        const formatSize = (bytes: number): string => {
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
            if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
            return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
        };
        const parseSizeToBytes = (sizeStr: string | number | undefined): number => {
            if (typeof sizeStr === 'number') return sizeStr;
            if (!sizeStr) return 0;
            const m = String(sizeStr).match(/^([\d.]+)\s*(B|KB|MB|GB)?$/i);
            if (!m) return 0;
            const num = parseFloat(m[1]);
            const unit = (m[2] || 'B').toUpperCase();
            const mult: Record<string, number> = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
            return num * (mult[unit] || 1);
        };

        const allBytes = files.reduce((sum, f: any) => sum + parseSizeToBytes(f.sizeBytes), 0);
        const isImage = (f: any) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.name || '') || /image/i.test(f.type || '');
        const isVideo = (f: any) => /\.(mp4|mov|avi|webm|mkv)$/i.test(f.name || '') || /video/i.test(f.type || '');
        const isDoc = (f: any) => /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i.test(f.name || '') || /document|pdf/i.test(f.type || '');

        const imagesBytes = files.filter(isImage).reduce((s, f: any) => s + parseSizeToBytes(f.sizeBytes), 0);
        const videosBytes = files.filter(isVideo).reduce((s, f: any) => s + parseSizeToBytes(f.sizeBytes), 0);
        const docsBytes = files.filter(isDoc).reduce((s, f: any) => s + parseSizeToBytes(f.sizeBytes), 0);

        const pct = (bytes: number) => Math.min(100, Math.round((bytes / STORAGE_QUOTA_BYTES) * 100));

        return [
            { label: `All files (${files.length})`, usage: `${formatSize(allBytes)}/1 GB Used`, color: '#82D64D', percent: pct(allBytes) },
            { label: `Images (${files.filter(isImage).length})`, usage: `${formatSize(imagesBytes)}/1 GB Used`, color: '#82D64D', percent: pct(imagesBytes) },
            { label: `Documents (${files.filter(isDoc).length})`, usage: `${formatSize(docsBytes)}/1 GB Used`, color: '#82D64D', percent: pct(docsBytes) },
            { label: `Videos (${files.filter(isVideo).length})`, usage: `${formatSize(videosBytes)}/1 GB Used`, color: '#82D64D', percent: pct(videosBytes) },
        ];
    }, [files]);

    const toggleSelection = (id: string) => {
        setSelectedFiles(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleGroupSelection = (files: FileData[]) => {
        const allSelected = files.every(f => selectedFiles.includes(f.id));
        if (allSelected) {
            setSelectedFiles(prev => prev.filter(id => !files.find(f => f.id === id)));
        } else {
            const newIds = files.map(f => f.id).filter(id => !selectedFiles.includes(id));
            setSelectedFiles(prev => [...prev, ...newIds]);
        }
    };

    const handleDownload = async (file: FileData) => {
        let blobUrl: string | null = null;
        let link: HTMLAnchorElement | null = null;

        // Clear any previous download errors
        setDownloadError(null);

        try {
            // Validate the URL before attempting download
            if (!isValidPreviewUrl(file.preview)) {
                throw new DownloadError('Download blocked: URL is not from an approved domain', true);
            }

            const response = await fetch(file.preview);

            // Check if the response is successful (status 200-299)
            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                throw new DownloadError(
                    `Download failed: Server returned ${response.status} ${response.statusText}. ${errorText}`,
                    true
                );
            }

            const blob = await response.blob();
            blobUrl = window.URL.createObjectURL(blob);
            link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${file.name}.${file.type}`;
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            const isTerminalError = error instanceof DownloadError && error.isTerminal;
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

            if (isTerminalError) {
                // Terminal errors (validation failures, HTTP errors) - show to user
                setDownloadError(errorMessage);
            } else {
                // Network/CORS errors - attempt fallback direct download
                const fallbackLink = document.createElement('a');
                fallbackLink.href = file.preview;
                fallbackLink.download = `${file.name}.${file.type}`;
                fallbackLink.target = '_blank';
                document.body.appendChild(fallbackLink);
                fallbackLink.click();
                document.body.removeChild(fallbackLink);
            }
        } finally {
            // Cleanup: always revoke blob URL and remove link element
            if (blobUrl) {
                window.URL.revokeObjectURL(blobUrl);
            }
            if (link && document.body.contains(link)) {
                document.body.removeChild(link);
            }
        }
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            {/* Breadcrumb */}
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'File manager' }]} />
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">File manager</h1>

                {/* Folder breadcrumb + actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 bg-white rounded-2xl p-3 shadow-sm">
                    <div className="flex items-center gap-1 text-sm text-gray-700 flex-wrap">
                        {folderPath.length > 1 && (
                            <button
                                onClick={() => handleFolderBreadcrumbClick(folderPath.length - 2)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                                title="Back"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        )}
                        {folderPath.map((seg, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <span className="text-gray-400">/</span>}
                                <button
                                    onClick={() => handleFolderBreadcrumbClick(idx)}
                                    className={`px-2 py-1 rounded hover:bg-gray-100 ${idx === folderPath.length - 1 ? 'font-bold text-[#3A6D6C]' : 'text-gray-600'}`}
                                >
                                    {seg.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                    {canEdit && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsCreateFolderOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <FolderPlus size={16} />
                                New Folder
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="flex items-center gap-2 px-4 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm disabled:opacity-50"
                            >
                                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                                {isUploading ? 'Uploading...' : 'Upload File'}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    )}
                </div>

                {/* Upload error banner */}
                {uploadError && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700 flex items-center justify-between">
                        <span>{uploadError}</span>
                        <button onClick={() => setUploadError(null)} className="text-red-700 hover:text-red-900 text-xs font-bold">×</button>
                    </div>
                )}

                {/* Create folder inline form */}
                {isCreateFolderOpen && (
                    <div className="mb-4 bg-white rounded-2xl p-4 shadow-sm flex gap-2 items-center">
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Folder name"
                            autoFocus
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder(); }}
                        />
                        <button
                            onClick={handleCreateFolder}
                            disabled={!newFolderName.trim() || createFolderMutation.isPending}
                            className="px-4 py-2 bg-[#82D64D] text-white rounded-lg text-sm font-medium hover:bg-[#6EC132] disabled:opacity-50"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => { setIsCreateFolderOpen(false); setNewFolderName(''); }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Folders grid */}
                {rawFolders.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-sm font-semibold text-gray-600 mb-2">Folders</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {rawFolders.map((folder) => (
                                <div
                                    key={folder.id}
                                    className="group relative bg-white rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer"
                                    onDoubleClick={() => handleEnterFolder(folder)}
                                >
                                    <div
                                        onClick={() => handleEnterFolder(folder)}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <Folder size={40} className="text-[#F59E0B] fill-[#FDE68A]" />
                                        <span className="text-xs font-medium text-gray-700 text-center truncate w-full" title={folder.name}>
                                            {folder.name}
                                        </span>
                                    </div>
                                    {canEdit && (
                                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingFolder({ id: folder.id, name: folder.name }); }}
                                                className="p-1 bg-white rounded hover:bg-gray-100 shadow-sm"
                                                title="Rename"
                                            >
                                                <MoreHorizontal size={12} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDeletingFolder({ id: folder.id, name: folder.name }); }}
                                                className="p-1 bg-white rounded hover:bg-red-50 text-red-500 shadow-sm"
                                                title="Delete"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats Header */}
                <div className="bg-[#F0F0F6] p-4 lg:p-2 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:overflow-x-auto gap-4 rounded-3xl lg:rounded-full shadow-md mb-8 items-stretch lg:items-center scrollbar-hide">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-[#82D64D] rounded-2xl lg:rounded-full p-4 lg:p-2.5 lg:px-4 flex items-center justify-between shadow-sm w-full lg:flex-1 lg:min-w-[200px] relative">
                            <div className="flex flex-col justify-center gap-2 z-10 w-full">
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-white text-sm font-bold">{stat.label}</span>
                                    <div className="bg-[#E8F5E9] px-2.5 py-1 rounded-full shadow-sm">
                                        <span className="text-[#3A6D6C] text-[10px] font-bold">{stat.usage}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                        2
                                    </div>
                                    <div className="flex-1 bg-black/10 rounded-full h-2 overflow-hidden">
                                        <div className="bg-[#1EB998] h-full rounded-full shadow-sm" style={{ width: `${stat.percent}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters as FileFilters)}
                />

                {/* Download Error Toast */}
                {downloadError && (
                    <div className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 max-w-md animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">{downloadError}</span>
                            <button
                                onClick={() => setDownloadError(null)}
                                className="hover:bg-white/20 p-1 rounded-full transition-colors"
                                aria-label="Dismiss error"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Groups */}
                {propertyNames.length > 0 ? (
                    propertyNames.map((property) => {
                        const files = groupedFiles[property];
                        const isGroupSelected = files.every(f => selectedFiles.includes(f.id));

                        return (
                            <div key={property} className="mb-8">
                                {/* Group Header */}
                                <div className='mb-4 flex items-center'>
                                    <div className="bg-[#3A6D6C] rounded-full px-4 py-2 flex items-center gap-2 shadow-sm cursor-pointer hover:bg-[#2c5251] transition-colors"
                                        onClick={() => toggleGroupSelection(files)}
                                    >
                                        <span className="text-white font-semibold pr-2 border-r border-white/30">{property}</span>
                                        <div className="bg-[#82D64D] rounded-full w-5 h-5 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">!</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Header */}
                                <div className="hidden md:block bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                                    <div className="text-white px-6 py-4 grid grid-cols-[50px_1.5fr_1fr_1fr_1fr_50px] gap-4 items-center text-sm font-medium">
                                        <div className="text-center">
                                            <div className={`w-5 h-5 rounded border border-white/50 flex items-center justify-center cursor-pointer ${isGroupSelected ? 'bg-[#82D64D] border-transparent' : ''}`}
                                                onClick={() => toggleGroupSelection(files)}
                                            >
                                                {isGroupSelected && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                        <div className="">Name</div>
                                        <div className="">Type</div>
                                        <div className="">Preview</div>
                                        <div className="">Date</div>
                                        <div className="text-center"></div>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-b-[2rem]">
                                    {files.map((file) => {
                                        const isSelected = selectedFiles.includes(file.id);
                                        return (
                                            <div
                                                key={file.id}
                                                className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-[#82D64D]' : ''}`}
                                            >
                                                {/* Desktop View */}
                                                <div className="hidden md:grid px-6 py-4 grid-cols-[50px_1.5fr_1fr_1fr_1fr_50px] gap-4 items-center">
                                                    <div className="text-center flex justify-center">
                                                        <div
                                                            className={`w-5 h-5 rounded border border-gray-300 flex items-center justify-center cursor-pointer transition-colors ${isSelected ? 'bg-[#82D64D] border-transparent' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleSelection(file.id);
                                                            }}
                                                        >
                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-700 text-sm font-medium truncate">{file.name}</div>
                                                    <div className="text-gray-600 text-sm">{file.type}</div>
                                                    <div className="">
                                                        {file.type === 'pdf' ? (
                                                            <div
                                                                className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setPreviewFile(file);
                                                                }}
                                                            >
                                                                <FileText className="w-6 h-6 text-red-500" />
                                                            </div>
                                                        ) : file.preview ? (
                                                            <img
                                                                src={file.preview}
                                                                alt="preview"
                                                                className="w-12 h-12 rounded-lg object-cover bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setPreviewFile(file);
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                                N/A
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-[#D9F99D] px-3 py-1 rounded-full text-center">
                                                            <span className="text-[#365E32] text-xs font-medium">{file.date}</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-center flex justify-center relative">
                                                        <button
                                                            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveActionMenu(activeActionMenu === file.id ? null : file.id);
                                                            }}
                                                        >
                                                            <MoreHorizontal className="w-5 h-5" />
                                                        </button>

                                                        {activeActionMenu === file.id && (
                                                            <div
                                                                className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-50 overflow-hidden"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="flex flex-col text-sm font-medium text-gray-700">
                                                                    <button
                                                                        className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                                                                        onClick={() => {
                                                                            setActiveActionMenu(null);
                                                                            handleDownload(file);
                                                                        }}
                                                                    >
                                                                        Download
                                                                    </button>
                                                                    {canEdit && (
                                                                        <button
                                                                            className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                                                                            onClick={() => {
                                                                                setActiveActionMenu(null);
                                                                                setEditingFile(file);
                                                                            }}
                                                                        >
                                                                            Edit name
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                                                                        onClick={() => {
                                                                            setActiveActionMenu(null);
                                                                            setPreviewFile(file);
                                                                        }}
                                                                    >
                                                                        Preview
                                                                    </button>
                                                                    {canEdit && (
                                                                        <button
                                                                            className="px-4 py-3 hover:bg-red-50 text-red-500 transition-colors text-left font-semibold"
                                                                            onClick={() => {
                                                                                setActiveActionMenu(null);
                                                                                setDeletingFile(file);
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Mobile View */}
                                                <div className="md:hidden p-4 flex items-center gap-3">
                                                    {/* Checkbox */}
                                                    <div
                                                        className={`w-5 h-5 flex-shrink-0 rounded border border-gray-300 flex items-center justify-center cursor-pointer transition-colors ${isSelected ? 'bg-[#82D64D] border-transparent' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSelection(file.id);
                                                        }}
                                                    >
                                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                                    </div>

                                                    {/* Preview Thumbnail */}
                                                    <div className="flex-shrink-0">
                                                        {file.type === 'pdf' ? (
                                                            <div
                                                                className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setPreviewFile(file);
                                                                }}
                                                            >
                                                                <FileText className="w-5 h-5 text-red-500" />
                                                            </div>
                                                        ) : file.preview ? (
                                                            <img
                                                                src={file.preview}
                                                                alt="preview"
                                                                className="w-10 h-10 rounded-lg object-cover bg-gray-100 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setPreviewFile(file);
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                                                                N/A
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                                        <span className="text-gray-800 text-sm font-semibold truncate">{file.name}</span>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span className="uppercase">{file.type}</span>
                                                            <span>•</span>
                                                            <span>{file.date}</span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="relative">
                                                        <button
                                                            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveActionMenu(activeActionMenu === file.id ? null : file.id);
                                                            }}
                                                        >
                                                            <MoreHorizontal className="w-5 h-5" />
                                                        </button>

                                                        {activeActionMenu === file.id && (
                                                            <div
                                                                className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-50 overflow-hidden"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="flex flex-col text-sm font-medium text-gray-700">
                                                                    <button
                                                                        className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                                                                        onClick={() => {
                                                                            setActiveActionMenu(null);
                                                                            handleDownload(file);
                                                                        }}
                                                                    >
                                                                        Download
                                                                    </button>
                                                                    {canEdit && (
                                                                        <button
                                                                            className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                                                                            onClick={() => {
                                                                                setActiveActionMenu(null);
                                                                                setEditingFile(file);
                                                                            }}
                                                                        >
                                                                            Edit name
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                                                                        onClick={() => {
                                                                            setActiveActionMenu(null);
                                                                            setPreviewFile(file);
                                                                        }}
                                                                    >
                                                                        Preview
                                                                    </button>
                                                                    {canEdit && (
                                                                        <button
                                                                            className="px-4 py-3 hover:bg-red-50 text-red-500 transition-colors text-left font-semibold"
                                                                            onClick={() => {
                                                                                setActiveActionMenu(null);
                                                                                setDeletingFile(file);
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">No files found matching your filters</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            <FilePreviewModal
                isOpen={!!previewFile}
                file={previewFile}
                onClose={() => setPreviewFile(null)}
            />
            <EditNameModal
                isOpen={!!editingFile}
                currentName={editingFile?.name || ''}
                onClose={() => setEditingFile(null)}
                onSave={(newName) => {
                    if (editingFile) {
                        renameFileMutation.mutate({ id: editingFile.id, name: newName });
                    }
                    setEditingFile(null);
                }}
            />

            <DeleteConfirmationModal
                isOpen={!!deletingFile}
                itemName={deletingFile?.name}
                onClose={() => setDeletingFile(null)}
                onConfirm={() => {
                    if (deletingFile) {
                        deleteFileMutation.mutate(deletingFile.id);
                        setSelectedFiles(prev => prev.filter(id => id !== deletingFile.id));
                    }
                    setDeletingFile(null);
                }}
            />

            <EditNameModal
                isOpen={!!editingFolder}
                currentName={editingFolder?.name || ''}
                onClose={() => setEditingFolder(null)}
                onSave={handleRenameFolderSubmit}
            />

            <DeleteConfirmationModal
                isOpen={!!deletingFolder}
                itemName={deletingFolder?.name}
                onClose={() => setDeletingFolder(null)}
                onConfirm={handleDeleteFolderConfirm}
            />
        </div>
    );
};

export default FileManager;
