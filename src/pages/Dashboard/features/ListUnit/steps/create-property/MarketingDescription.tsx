import React from 'react';
import { Undo2 } from 'lucide-react';
import TiptapEditor from '../../../../../../components/common/Editor/TiptapEditor';
import { useCreatePropertyStore } from '../../store/createPropertyStore';

const MarketingDescription: React.FC = () => {
  const { formData: data, updateFormData } = useCreatePropertyStore();

  const updateData = (value: string) => {
    updateFormData('marketingDescription' as any, value);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Marketing description</h2>
        <p className="text-[var(--color-subheading)]">Good descriptions communicate a rental's features, along with the benefits, which make it the most desirable choice.</p>
      </div>

      <div className="w-full max-w-3xl bg-[#F3F4F6] rounded-2xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-[#3D7475] px-6 py-4 flex items-center gap-3 text-white">
          <Undo2 size={20} className="rotate-180" />
          <span className="font-medium text-lg">Description</span>
        </div>

        {/* Rich text editor */}
        <div className="p-0">
          <TiptapEditor
            content={data.marketingDescription || ''}
            onChange={updateData}
            placeholder="Add the marketing description here."
            className="prose-base bg-[#F3F4F6]"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketingDescription;
