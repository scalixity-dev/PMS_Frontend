import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';
import TemplateEditor from '../components/TemplateEditor';
import Breadcrumb from '../../../../../components/ui/Breadcrumb';
import { useGetTemplate, useUpdateTemplate } from '../../../../../hooks/useDocumentsQueries';
import { useToast } from '../../../../../components/common/Toast';

const EditTemplate: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams<{ id: string }>();

    const { data: template, isLoading, isError } = useGetTemplate(id ?? '');
    const updateTemplate = useUpdateTemplate();

    const [editorContent, setEditorContent] = useState('');
    const [documentTitle, setDocumentTitle] = useState('');
    const [documentType, setDocumentType] = useState('');

    // Prefill when data arrives
    useEffect(() => {
        if (template) {
            setDocumentTitle(template.title);
            setDocumentType(template.category ?? '');
            setEditorContent(template.content ?? '');
        }
    }, [template]);

    const templateName = documentTitle || 'Template';

    const handleUpdate = async () => {
        if (!id) return;
        try {
            await updateTemplate.mutateAsync({
                id,
                dto: {
                    title: documentTitle || undefined,
                    content: editorContent,
                },
            });
            toast.success('Template updated');
            navigate(`/dashboard/documents/my-templates/${id}`);
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update template');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10 flex items-center justify-center">
                <p className="text-gray-600">Loading template...</p>
            </div>
        );
    }

    if (isError || !template) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 font-semibold mb-4">Template not found.</p>
                    <PrimaryActionButton
                        onClick={() => navigate('/dashboard/documents/my-templates')}
                        text="Back to Templates"
                        className="!bg-[#3D7475]"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-8 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Documents Template', path: '/dashboard/documents/my-templates' }, { label: templateName, path: `/dashboard/documents/my-templates/${id}` }, { label: 'Edit template' }]} />
            </div>

            {/* Main Edit Container */}
            <div className="bg-[#DFE5E3] p-4 md:p-10 rounded-3xl md:rounded-[3rem] shadow-sm">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">Edit Template</h1>

                {/* Header Inputs Section */}
                <div className="bg-[#3A6D6C] p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] mb-6 md:mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Document Title */}
                        <div className="bg-white/40 rounded-xl md:rounded-[1.5rem] p-4">
                            <label className="block text-gray-800 text-xs font-bold mb-2">Document Title*</label>
                            <input
                                type="text"
                                value={documentTitle}
                                onChange={(event) => setDocumentTitle(event.target.value)}
                                placeholder="Enter Title"
                                className="w-full bg-white rounded-lg px-4 py-2.5 text-sm text-gray-600 border-none focus:ring-0 outline-none shadow-sm"
                            />
                        </div>

                        {/* Document Type */}
                        <div className="bg-white/40 rounded-xl md:rounded-[1.5rem] p-4">
                            <label className="block text-gray-800 text-xs font-bold mb-2">Document Type*</label>
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
                <div className="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-6 mt-8 md:mt-10">
                    <PrimaryActionButton
                        onClick={() => navigate(-1)}
                        text="Cancel"
                        className="bg-white !text-gray-800 w-full md:w-auto px-10 md:px-14 py-3.5 rounded-2xl font-bold text-lg shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-100 hover:bg-gray-50 min-w-[180px]"
                    />
                    <PrimaryActionButton
                        onClick={handleUpdate}
                        disabled={updateTemplate.isPending}
                        text={updateTemplate.isPending ? 'Saving...' : 'Update'}
                        className="w-full md:w-auto px-10 md:px-14 py-3.5 rounded-2xl font-bold text-lg shadow-[0_4px_15px_rgba(58,109,108,0.4)] min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
            </div>
        </div>
    );
};

export default EditTemplate;
