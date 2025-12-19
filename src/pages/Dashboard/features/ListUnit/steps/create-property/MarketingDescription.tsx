import React, { useMemo } from 'react';
import { Undo2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useCreatePropertyStore } from '../../store/createPropertyStore';

interface MarketingDescriptionProps {
    data?: any; // Optional - now using Zustand store
    updateData?: (key: string, value: any) => void; // Optional - now using Zustand store
}

const MarketingDescription: React.FC<MarketingDescriptionProps> = () => {
    const { formData: data, updateFormData } = useCreatePropertyStore();
    
    const updateData = (key: string, value: any) => {
        updateFormData(key as any, value);
    };

  // Quill toolbar & formats: allow bold, italic, lists, headings, etc.
  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link'],
        ['clean'],
      ],
    }),
    [],
  );

  const quillFormats: string[] = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
  ];

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Marketing description</h2>
                <p className="text-[var(--color-subheading)]">Good descriptions communicate a rental's features, along with the benefits, which make it the most desirable choice.</p>
            </div>

            <div className="w-full max-w-3xl bg-[#F3F4F6] rounded-2xl overflow-hidden shadow-sm">
                {/* Header */}
                <div className="bg-[#3D7475] px-6 py-4 flex items-center gap-3 text-white">
                    <Undo2 size={20} className="rotate-180" /> {/* Using rotate to mimic the icon in design if needed, or just a similar icon */}
                    <span className="font-medium text-lg">Description</span>
                </div>

                {/* Rich text editor */}
                <div className="p-0">
                    <ReactQuill
                        theme="snow"
                        value={data.marketingDescription || ''}
                        onChange={(value: string) => updateData('marketingDescription', value)}
                        placeholder="Add the marketing description here."
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-[#F3F4F6]"
                    />
                </div>
            </div>
        </div>
    );
};

export default MarketingDescription;
