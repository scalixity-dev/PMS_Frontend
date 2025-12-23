import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Plus, X, UploadCloud } from 'lucide-react';

const MyTemplateDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const [template, setTemplate] = useState<{ id: number, title: string, subtitle: string, content?: string } | null>(null);

    useEffect(() => {
        if (!id) {
            setTemplate(null);
            return;
        }
        const saved = localStorage.getItem('myTemplates');
        let found = null;
        if (saved) {
            const templates = JSON.parse(saved);
            found = templates.find((t: any) => t.id.toString() === id);
        }

        // Fallback for demo if not found in local storage
        if (!found && id === '1') {
            found = { id: 1, title: 'Best Deals', subtitle: 'Tenants Agreements' };
        }

        setTemplate(found || null);
    }, [id]);

    const templateName = template?.title || "Template Detail";
    const templateSubtitle = template?.subtitle || "Tenants Agreements";

    const allTemplates = (() => {
        const saved = localStorage.getItem('myTemplates');
        if (saved) {
            return JSON.parse(saved);
        }
        // Fallback mocks same as MyTemplates.tsx
        return [
            { id: 1, title: 'Best Deals', subtitle: 'Tenants Agreements' },
            { id: 2, title: 'Title', subtitle: 'Tenants Agreements' },
            { id: 3, title: 'Title', subtitle: 'Tenants Agreements' },
        ];
    })();

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>
                    Dashboard
                </span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold cursor-pointer" onClick={() => navigate('/documents/my-templates')}>
                    Documents Template
                </span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{templateName}</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-800">{templateName}</h1>
                        <p className="text-gray-500 font-medium text-sm mt-1">{templateSubtitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-[#3A6D6C] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2d5650] transition-colors shadow-sm">
                            Use Template
                            <Plus size={16} className="bg-white/20 rounded-full p-0.5" />
                        </button>
                        <button className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2d5650] transition-colors shadow-sm">
                            Actions
                        </button>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-[#F0F2F5] rounded-[2rem] overflow-hidden shadow-sm mb-6 pb-20">
                    {/* Dark Teal Header Band */}
                    <div className="bg-[#3A6D6C] mx-6 mt-6 rounded-[2rem] px-6 py-4 flex items-center justify-center gap-4 relative">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-white text-[#3A6D6C] px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 min-w-[140px] justify-between shadow-sm"
                            >
                                Template
                                <ChevronDown size={16} />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-10 max-h-60 overflow-y-auto custom-scrollbar">
                                    {allTemplates.map((t: any) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                navigate(`/documents/my-templates/${t.id}`);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-50 ${t.id.toString() === id ? 'bg-gray-50 text-[#3A6D6C] font-semibold' : 'text-gray-700'
                                                }`}
                                        >
                                            {t.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate(`/documents/my-templates/${id}/edit`)}
                            className="bg-[#4CD9A4] text-white px-8 py-2 rounded-full text-sm font-medium hover:bg-[#42bd93] transition-colors shadow-sm"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Content Placeholder */}
                    <div className="px-12 py-8 min-h-[300px]">
                        {template?.content ? (
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: template.content }} />
                        ) : (
                            <p className="text-gray-400 text-sm">| Type here</p>
                        )}
                    </div>
                </div>

                {/* Attachments Section */}
                <div className="bg-[#F0F2F5] rounded-[2rem] p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-800">Attachments</h2>
                            <ChevronDown size={16} className="text-gray-800" />
                        </div>

                        <button
                            onClick={() => setIsAttachmentModalOpen(true)}
                            className="bg-[#4CD9A4] text-white px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#42bd93] transition-colors shadow-sm"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="bg-white rounded-[2rem] p-12 flex items-center justify-center border border-gray-100 shadow-inner h-40">
                        <p className="text-gray-500 font-medium text-sm">No attachments yet</p>
                    </div>
                </div>
            </div>

            {/* Attachments Edit Modal */}
            {isAttachmentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 ">
                    <div className="bg-[#E0E8E7] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="bg-[#3A6D6C] px-8 py-5 flex items-center justify-between text-white">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsAttachmentModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                    <ChevronLeft size={24} />
                                </button>
                                <h2 className="text-xl font-bold">Attachments</h2>
                            </div>
                            <button onClick={() => setIsAttachmentModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-10 flex flex-col items-center">
                            <p className="text-[#000000] text-center font-bold text-xl mb-8 max-w-[500px] leading-snug">
                                You can attach the related attachments that are specific to this template.
                            </p>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                            />

                            {/* Upload Area */}
                            <div
                                onClick={handleUploadClick}
                                className="w-full bg-white rounded-[2rem] p-16 mb-6 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shadow-[0px_4px_10px_rgba(0,0,0,0.05)] border-2 border-dashed border-gray-100 hover:border-[#3A6D6C]/30 transition-all"
                            >
                                {/* Checkerboard Pattern simulating the image */}
                                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0' }}></div>

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <UploadCloud size={64} className="text-gray-600 mb-4" strokeWidth={1.5} />
                                    <p className="text-gray-500 font-medium text-lg">store documents and templates</p>
                                    <p className="text-gray-400 text-sm mt-2">Click to browse or drag and drop</p>
                                </div>
                            </div>

                            {/* Selected Files Preview */}
                            {selectedFiles.length > 0 && (
                                <div className="w-full mb-8 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-white/50 px-4 py-2 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-[#3A6D6C]/10 rounded-lg">
                                                    <UploadCloud size={16} className="text-[#3A6D6C]" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-700 truncate max-w-[300px]">{file.name}</span>
                                                    <span className="text-[10px] text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                                className="p-1 hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Footer/Action */}
                            <div className="w-full flex justify-start">
                                <button
                                    onClick={() => setIsAttachmentModalOpen(false)}
                                    className="bg-[#3A6D6C] text-white px-12 py-3.5 rounded-2xl font-bold text-lg hover:bg-[#2d5650] transition-all shadow-[0_4px_12px_rgba(58,109,108,0.4)]"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTemplateDetail;
