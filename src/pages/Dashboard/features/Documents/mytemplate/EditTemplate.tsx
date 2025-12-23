import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';
import TemplateEditor from '../components/TemplateEditor';

const EditTemplate: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [editorContent, setEditorContent] = useState('');
    const [documentTitle, setDocumentTitle] = useState('');
    const [documentType, setDocumentType] = useState('');

    const templateName = documentTitle || "Basic Residential Lease Agreement";

    useEffect(() => {
        if (!id) {
            setDocumentTitle("Basic Residential Lease Agreement");
            setDocumentType("Tenants Agreement");
            return;
        }

        const saved = localStorage.getItem('myTemplates');
        if (!saved) {
            setDocumentTitle("Basic Residential Lease Agreement");
            setDocumentType("Tenants Agreement");
            return;
        }

        try {
            const templates = JSON.parse(saved) as Array<{
                id: number;
                title: string;
                subtitle: string;
                content?: string;
            }>;

            const numericId = Number(id);
            const existing = templates.find((template) => template.id === numericId);

            if (existing) {
                setDocumentTitle(existing.title);
                setDocumentType(existing.subtitle);
                setEditorContent(existing.content ?? '');
            } else {
                setDocumentTitle("Basic Residential Lease Agreement");
                setDocumentType("Tenants Agreement");
            }
        } catch {
            setDocumentTitle("Basic Residential Lease Agreement");
            setDocumentType("Tenants Agreement");
        }
    }, [id]);

    const handleUpdate = () => {
        const numericId = id ? Number(id) : Date.now();
        const saved = localStorage.getItem('myTemplates');

        let templates: Array<{
            id: number;
            title: string;
            subtitle: string;
            content?: string;
        }> = [];

        if (saved) {
            try {
                templates = JSON.parse(saved);
            } catch {
                templates = [];
            }
        }

        const existingIndex = templates.findIndex((template) => template.id === numericId);

        if (existingIndex !== -1) {
            templates[existingIndex] = {
                ...templates[existingIndex],
                title: documentTitle || templates[existingIndex].title,
                subtitle: documentType || templates[existingIndex].subtitle,
                content: editorContent,
            };
        } else {
            templates.push({
                id: numericId,
                title: documentTitle || "Basic Residential Lease Agreement",
                subtitle: documentType || "Tenants Agreements",
                content: editorContent,
            });
        }

        localStorage.setItem('myTemplates', JSON.stringify(templates));
        navigate(`/documents/my-templates/${numericId}`);
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-8 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>
                    Dashboard
                </span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/documents/my-templates')}>
                    Documents Template
                </span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate(`/documents/my-templates/${id}`)}>
                    {templateName}
                </span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Edit template</span>
            </div>

            {/* Main Edit Container */}
            <div className="bg-[#DFE5E3] p-10 rounded-[3rem] shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">Edit Template</h1>

                {/* Header Inputs Section */}
                <div className="bg-[#3A6D6C] p-6 rounded-[2.5rem] mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Documents Title */}
                        <div className="bg-white/40 rounded-[1.5rem] p-4">
                            <label className="block text-gray-800 text-xs font-bold mb-2">Documents Title*</label>
                            <input
                                type="text"
                                value={documentTitle}
                                onChange={(event) => setDocumentTitle(event.target.value)}
                                placeholder="Enter Title"
                                className="w-full bg-white rounded-lg px-4 py-2.5 text-sm text-gray-600 border-none focus:ring-0 outline-none shadow-sm"
                            />
                        </div>

                        {/* Documents Type */}
                        <div className="bg-white/40 rounded-[1.5rem] p-4">
                            <label className="block text-gray-800 text-xs font-bold mb-2">Documents Type*</label>
                            <input
                                type="text"
                                value={documentType}
                                onChange={(event) => setDocumentType(event.target.value)}
                                className="w-full bg-white rounded-lg px-4 py-2.5 text-sm text-gray-600 border-none focus:ring-0 outline-none shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Combined Content, Fields and Signature Section */}
                <TemplateEditor
                    initialEditorContent={editorContent}
                    onEditorContentChange={setEditorContent}
                    showPreviewButton={true}
                    showSignatureSection={true}
                />

                {/* Footer Buttons Shifted Inside */}
                <div className="flex items-center gap-6 mt-10">
                    <PrimaryActionButton
                        onClick={() => navigate(-1)}
                        text="Cancel"
                        className="bg-white !text-gray-800 px-14 py-3.5 rounded-2xl font-bold text-lg shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-100 hover:bg-gray-50 min-w-[180px]"
                    />
                    <PrimaryActionButton
                        onClick={handleUpdate}
                        text="Update"
                        className="px-14 py-3.5 rounded-2xl font-bold text-lg shadow-[0_4px_15px_rgba(58,109,108,0.4)] min-w-[180px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default EditTemplate;
