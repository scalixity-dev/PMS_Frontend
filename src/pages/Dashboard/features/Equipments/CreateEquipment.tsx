import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Check, Loader2 } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';
import DatePicker from '../../../../components/ui/DatePicker';
import { format } from 'date-fns';
import { useCreateEquipment } from '../../../../hooks/useEquipmentQueries';
import { useGetAllProperties } from '../../../../hooks/usePropertyQueries';
import { API_ENDPOINTS } from '../../../../config/api.config';

const CreateEquipment = () => {
    const navigate = useNavigate();
    const { data: properties = [], isLoading: isLoadingProperties } = useGetAllProperties();
    const createEquipmentMutation = useCreateEquipment();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        category: '',
        brand: '',
        model: '',
        price: '',
        propertyId: '',
        serial: '',
        installationDate: '',
        warrantyExpirationDate: '',
        isLifetimeWarranty: false,
        description: ''
    });



    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(API_ENDPOINTS.UPLOAD.IMAGE, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const data = await response.json();
                setUploadedImageUrl(data.url || data.imageUrl || data.path);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image. Please try again.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.category || !formData.brand || !formData.model || !formData.price || !formData.propertyId || !formData.serial || !formData.installationDate) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const equipmentData = {
                propertyId: formData.propertyId,
                category: formData.category,
                brand: formData.brand,
                model: formData.model,
                serialNumber: formData.serial,
                price: parseFloat(formData.price.replace(/[^0-9.]/g, '')) || 0,
                dateOfInstallation: formData.installationDate,
                equipmentDetails: formData.description || undefined,
                photoUrl: uploadedImageUrl || undefined,
                status: 'ACTIVE' as const,
            };

            await createEquipmentMutation.mutateAsync(equipmentData);
            navigate('/dashboard/equipments');
        } catch (error) {
            console.error('Error creating equipment:', error);
            alert(error instanceof Error ? error.message : 'Failed to create equipment');
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-12">
            {/* Header */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Add Equipment</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                {/* Cover Photo Upload */}
                <div className="bg-white rounded-[2rem] p-8 mb-8 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-64 relative overflow-hidden group hover:border-[#4ad1a6] transition-colors cursor-pointer">
                    {/* Checkered background pattern */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), 
                            linear-gradient(-45deg, #000 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #000 75%), 
                            linear-gradient(-45deg, transparent 75%, #000 75%)`,
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }}
                    />
                    {uploadedImageUrl ? (
                        <>
                            <img src={uploadedImageUrl} alt="Equipment" className="w-full h-full object-contain relative z-10" />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="z-10 flex flex-col items-center">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-3">
                                {isUploading ? (
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                ) : (
                                    <Upload className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                                {isUploading ? 'Uploading...' : 'Upload Cover Photos'}
                            </span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                </div>

                {/* General Information */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">General information</h2>
                    <div className="bg-[#F0F0F6] rounded-[2rem] p-8 grid grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Category*</label>
                            <CustomDropdown
                                options={[
                                    { value: 'electric_meter', label: 'Electric meter' },
                                    { value: 'appliances', label: 'Appliances' }
                                ]}
                                value={formData.category}
                                onChange={(val) => handleInputChange('category', val)}
                                placeholder="Select Category"
                                buttonClassName="w-full bg-white rounded-xl border-none h-12"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Equipment Brand *</label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => handleInputChange('brand', e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-white rounded-xl border-none h-12 px-4 focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Model*</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => handleInputChange('model', e.target.value)}
                                placeholder="Type here"
                                className="w-full bg-white rounded-xl border-none h-12 px-4 focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Price *</label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-white rounded-xl border-none h-12 px-4 focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Property *</label>
                            {isLoadingProperties ? (
                                <div className="flex items-center gap-2 h-12">
                                    <Loader2 className="w-4 h-4 animate-spin text-[#3A6D6C]" />
                                    <span className="text-sm text-gray-500">Loading properties...</span>
                                </div>
                            ) : (
                                <CustomDropdown
                                    options={properties.map(prop => ({
                                        value: prop.id,
                                        label: prop.propertyName,
                                    }))}
                                    value={formData.propertyId}
                                    onChange={(val) => handleInputChange('propertyId', val)}
                                    placeholder="Select Property"
                                    buttonClassName="w-full bg-white rounded-xl border-none h-12"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Serial *</label>
                            <input
                                type="text"
                                value={formData.serial}
                                onChange={(e) => handleInputChange('serial', e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-white rounded-xl border-none h-12 px-4 focus:ring-0"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Date of Installation *</label>
                            <DatePicker
                                value={formData.installationDate ? new Date(formData.installationDate) : undefined}
                                onChange={(date) => handleInputChange('installationDate', date ? format(date, 'yyyy-MM-dd') : '')}
                                placeholder="Select Date"
                                className="w-full bg-white rounded-xl border-none h-12 px-4 focus:ring-0 text-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Warranty Settings */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Warranty settings</h2>
                        <div className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                            Warranty Expiration Date
                            <div className="w-4 h-4 bg-[#7BD747] rounded flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#F0F0F6] rounded-[2rem] p-8">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Warranty Expiration Date *</label>
                            <div className="relative max-w-md">
                                <DatePicker
                                    value={formData.warrantyExpirationDate ? new Date(formData.warrantyExpirationDate) : undefined}
                                    onChange={(date) => handleInputChange('warrantyExpirationDate', date ? format(date, 'yyyy-MM-dd') : '')}
                                    placeholder="Select Date"
                                    className="w-full bg-white rounded-xl border-none h-12 px-4 focus:ring-0 text-gray-500"
                                    disabled={formData.isLifetimeWarranty}
                                />
                            </div>
                        </div>
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                                const newValue = !formData.isLifetimeWarranty;
                                handleInputChange('isLifetimeWarranty', newValue);
                                if (newValue) {
                                    handleInputChange('warrantyExpirationDate', '');
                                }
                            }}
                        >
                            <label className="text-sm font-bold text-gray-800 cursor-pointer">Lifetime warranty</label>
                            <div
                                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${formData.isLifetimeWarranty ? 'bg-[#7BD747]' : 'bg-white border border-gray-300'}`}
                            >
                                {formData.isLifetimeWarranty && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Equipment Details */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Equipment details</h2>
                        <span className="text-xs text-[#3A6D6C]">(Add any additional equipment details such as short description, sizes, color or a receipt file. (You can add up to 10 files.) )</span>
                    </div>

                    <div className="bg-[#F0F0F6] rounded-[2rem] p-8">
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Type Details here.."
                            className="w-full bg-[#F0F0F6] rounded-xl border-none p-4 min-h-[150px] focus:ring-0 resize-none text-sm"
                        />
                    </div>

                    {/* File Upload Box */}
                    <div className="mt-4 bg-[#F0F0F6] rounded-[2rem] p-8 flex justify-center">
                        <div className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg flex flex-col items-center cursor-pointer hover:bg-[#2c5251] transition-colors relative overflow-hidden">
                            <Upload className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">Upload File</span>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* Create Button */}
                <div>
                    <button 
                        onClick={handleSubmit}
                        disabled={createEquipmentMutation.isPending || isUploading}
                        className="px-8 py-3 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5251] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        {(createEquipmentMutation.isPending || isUploading) && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};



export default CreateEquipment;
