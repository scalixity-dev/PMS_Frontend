import React from 'react';
import CustomDropdown from '../../../../components/CustomDropdown';
import { Check } from 'lucide-react';
import property from '../../../../../../assets/images/property.jpg';
import { useCreatePropertyStore } from '../../store/createPropertyStore';

interface AddRibbonProps {
    data?: any; // Optional - now using Zustand store
    updateData?: (key: string, value: any) => void; // Optional - now using Zustand store
}

const AddRibbon: React.FC<AddRibbonProps> = () => {
    const { formData: data, updateFormData } = useCreatePropertyStore();
    const ribbonType = data.ribbonType || 'none';

    const updateData = (key: string, value: any) => {
        updateFormData(key as any, value);
    };

    const handleTypeChange = (type: string) => {
        updateData('ribbonType', type);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8 max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Would you like to add a ribbon to your listing?</h2>
                <p className="text-[var(--color-subheading)]">Ribbons are a great way to highlight your property's best feature. Select the ribbon color and type your own ribbon title.</p>
            </div>

            <div className="w-full max-w-4xl bg-[#F3F4F6] p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-start">

                {/* Left Side: Controls */}
                <div className="flex-1 w-full space-y-8">

                    {/* Ribbon Type Selection */}
                    <div className="flex items-center gap-4 bg-white p-2 rounded-full w-fit shadow-sm">
                        <button
                            onClick={() => handleTypeChange('chat')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${ribbonType === 'chat' ? 'bg-[#86D24A] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Chat
                            {ribbonType === 'chat' && <div className="bg-white rounded-full p-0.5"><Check size={12} className="text-[#86D24A]" /></div>}
                        </button>

                        <button
                            onClick={() => handleTypeChange('custom')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${ribbonType === 'custom' ? 'bg-[#86D24A] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Custom
                            {ribbonType === 'custom' && <div className="bg-white rounded-full p-0.5"><Check size={12} className="text-[#86D24A]" /></div>}
                        </button>

                        <button
                            onClick={() => handleTypeChange('none')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${ribbonType === 'none' ? 'bg-[#86D24A] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            None
                            {ribbonType === 'none' && <div className="bg-white rounded-full p-0.5"><Check size={12} className="text-[#86D24A]" /></div>}
                        </button>
                    </div>

                    {/* Ribbon Title Input */}
                    <div className="w-full">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Ribbon title*</label>
                        {ribbonType === 'custom' ? (
                            <input
                                type="text"
                                value={data.ribbonTitle || ''}
                                onChange={(e) => updateData('ribbonTitle', e.target.value)}
                                placeholder="Enter ribbon title"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
                            />
                        ) : (
                            <CustomDropdown
                                label="" // Label handled above
                                value={data.ribbonTitle || ''}
                                onChange={(value) => updateData('ribbonTitle', value)}
                                options={[
                                    { value: 'special_offer', label: 'Special Offer' },
                                    { value: 'new_listing', label: 'New Listing' },
                                    { value: 'featured', label: 'Featured' }
                                ]}
                                placeholder="Select ribbon title"
                                disabled={ribbonType === 'none'}
                                buttonClassName="bg-white border-none shadow-sm"
                            />
                        )}
                    </div>

                </div>

                {/* Right Side: Preview */}
                <div className="w-full md:w-1/3">
                    <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/3]">
                        <img src={property} alt="Property Preview" className="w-full h-full object-cover" />

                        {/* Ribbon Overlay Preview */}
                        {ribbonType !== 'none' && (
                            <div className="absolute top-4 left-0 bg-[#86D24A] text-white px-3 py-1 text-sm font-medium rounded-r-md shadow-sm">
                                {data.ribbonTitle ? data.ribbonTitle.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Ribbon Title'}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddRibbon;
