import React, { useState, useMemo } from 'react';
import { MoreHorizontal, Check, X, FileText } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import EditNameModal from './components/EditNameModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

// Mock Data structure based on the screenshot
interface FileData {
    id: number;
    name: string;
    type: string;
    preview: string;
    date: string;
    property: string;
}

const FilePreviewModal = ({ isOpen, file, onClose }: { isOpen: boolean; file: FileData | null; onClose: () => void }) => {
    if (!isOpen || !file) return null;

    const isPdf = file.type === 'pdf';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>

                {isPdf ? (
                    <div className="w-full bg-white rounded-lg h-[85vh] relative flex flex-col">
                        <button
                            onClick={onClose}
                            className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-gray-800 shadow-lg hover:bg-gray-100 transition-colors z-50"
                        >
                            <X size={20} />
                        </button>
                        <iframe src={file.preview} className="w-full h-full rounded-lg" title="PDF Preview"></iframe>
                    </div>
                ) : (
                    <div className="relative">
                        <img src={file.preview} alt="Full preview" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain" />
                        <button
                            onClick={onClose}
                            className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-gray-800 shadow-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};



const MOCK_FILES: FileData[] = [
    {
        id: 1,
        name: 'aae8b9dd888f955418f7',
        type: 'jpg',
        preview: 'https://images.unsplash.com/photo-1600596542815-e32904fc4969?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        date: '04 Nov, 2026',
        property: 'Luxury Property'
    },
    {
        id: 2,
        name: 'floor_plan_v2',
        type: 'pdf',
        preview: 'https://pdfobject.com/pdf/sample.pdf',
        date: '10 Dec, 2026',
        property: 'Luxury Property'
    },
    {
        id: 3,
        name: 'lease_agreement_signed',
        type: 'docx',
        preview: '', // No preview for docs usually, handle logic later
        date: '15 Jan, 2027',
        property: 'Ax Apartment'
    },
    {
        id: 4,
        name: 'kitchen_renovation_final',
        type: 'png',
        preview: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1',
        date: '02 Feb, 2027',
        property: 'Ax Apartment'
    }
];

const ITEMS_PER_PAGE = 10;

const FileManager: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
    const [previewFile, setPreviewFile] = useState<FileData | null>(null);
    const [editingFile, setEditingFile] = useState<FileData | null>(null);
    const [deletingFile, setDeletingFile] = useState<FileData | null>(null);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setActiveActionMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // This state would likely come from a backend in real app
    const [filters, setFilters] = useState<{
        type: string[];
    }>({
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
        return MOCK_FILES.filter(file => {
            const matchesSearch = searchQuery === '' ||
                file.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = filters.type.length === 0 || filters.type.includes(file.type);

            return matchesSearch && matchesType;
        });
    }, [searchQuery, filters]);

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

    // Stats calculations (mocked for visual matching)
    // In a real app these would be calculated or fetched
    const stats = [
        { label: 'All files', usage: '26.57 MB/1 GB Used', color: '#82D64D', percent: 25 },
        { label: 'Images', usage: '26.57 MB/1 GB Used', color: '#82D64D', percent: 15 },
        { label: 'Documents', usage: '26.57 MB/1 GB Used', color: '#82D64D', percent: 10 },
        { label: 'All files', usage: '26.57 MB/1 GB Used', color: '#82D64D', percent: 25 }, // Repeated in screenshot?
    ];

    const toggleSelection = (id: number) => {
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
        try {
            const response = await fetch(file.preview);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${file.name}.${file.type}`;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback for when CORS blocks blob fetch
            const link = document.createElement('a');
            link.href = file.preview;
            link.download = `${file.name}.${file.type}`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">File manager</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">File manager</h1>

                {/* Stats Header */}
                <div className="bg-[#F0F0F6] p-2 flex overflow-x-auto gap-4 rounded-full shadow-md mb-8 items-center no-scrollbar">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-[#82D64D] rounded-full p-2.5 px-4 flex items-center justify-between shadow-sm flex-1 min-w-[200px] relative">
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
                    onFiltersChange={(newFilters) => setFilters(newFilters as any)}
                />

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
                                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
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
                                                className={`bg-white rounded-2xl px-6 py-4 grid grid-cols-[50px_1.5fr_1fr_1fr_1fr_50px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-[#82D64D]' : ''}`}
                                            >
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
                                                                <button
                                                                    className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                                                                    onClick={() => {
                                                                        setActiveActionMenu(null);
                                                                        setEditingFile(file);
                                                                    }}
                                                                >
                                                                    Edit name
                                                                </button>
                                                                <button
                                                                    className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                                                                    onClick={() => {
                                                                        setActiveActionMenu(null);
                                                                        setPreviewFile(file);
                                                                    }}
                                                                >
                                                                    Preview
                                                                </button>
                                                                <button
                                                                    className="px-4 py-3 hover:bg-red-50 text-red-500 transition-colors text-left font-semibold"
                                                                    onClick={() => {
                                                                        setActiveActionMenu(null);
                                                                        setDeletingFile(file);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
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
                    console.log('Renaming file', editingFile?.id, 'to', newName);
                    // Implement actual rename logic here (e.g., API call, state update)
                    setEditingFile(null);
                }}
            />

            <DeleteConfirmationModal
                isOpen={!!deletingFile}
                fileName={deletingFile?.name}
                onClose={() => setDeletingFile(null)}
                onConfirm={() => {
                    console.log('Deleting file', deletingFile?.id);
                    // Implement actual delete logic here
                    setDeletingFile(null);
                }}
            />
        </div>
    );
};

export default FileManager;
