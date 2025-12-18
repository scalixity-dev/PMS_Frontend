import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Upload, Edit, Trash2, Loader2 } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';
import { useGetKey, useCreateKey, useUpdateKey } from '../../../../hooks/useKeysQueries';
import { useGetAllProperties } from '../../../../hooks/usePropertyQueries';
import { API_ENDPOINTS } from '../../../../config/api.config';
import type { KeyType } from '../../../../services/keys.service';

// Map display key type to backend enum
const mapKeyTypeToBackend = (displayType: string): KeyType => {
  const typeMap: Record<string, KeyType> = {
    'Main Door': 'DOOR',
    'Mailbox': 'MAILBOX',
    'Garage': 'GARAGE',
    'Gate': 'GATE',
    'Storage': 'STORAGE',
    'Other': 'OTHER',
  };
  return typeMap[displayType] || 'OTHER';
};

// Map backend enum to display format
const mapKeyTypeToDisplay = (backendType: KeyType): string => {
  const typeMap: Record<KeyType, string> = {
    'DOOR': 'Main Door',
    'MAILBOX': 'Mailbox',
    'GARAGE': 'Garage',
    'GATE': 'Gate',
    'STORAGE': 'Storage',
    'OTHER': 'Other',
  };
  return typeMap[backendType] || 'Other';
};

const AddKey = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // Fetch key data if in edit mode
    const { data: keyData, isLoading: isLoadingKey } = useGetKey(id || null, isEditMode);
    const { data: properties = [], isLoading: isLoadingProperties } = useGetAllProperties();
    const createKeyMutation = useCreateKey();
    const updateKeyMutation = useUpdateKey();

    const [keyName, setKeyName] = useState('');
    const [keyType, setKeyType] = useState('');
    const [propertyId, setPropertyId] = useState('');
    const [details, setDetails] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageUrlRef = useRef<string | null>(null);
    const uploadedFileRef = useRef<File | null>(null);

    // Initialize form when key data is loaded
    useEffect(() => {
        if (isEditMode && keyData) {
            setKeyName(keyData.keyName);
            setKeyType(mapKeyTypeToDisplay(keyData.keyType));
            setPropertyId(keyData.propertyId);
            setDetails(keyData.description || '');
            setImage(keyData.keyPhotoUrl || null);
            setUploadedImageUrl(keyData.keyPhotoUrl || null);
        }
    }, [isEditMode, keyData]);

    // Cleanup blob URL on component unmount
    useEffect(() => {
        return () => {
            if (imageUrlRef.current) {
                URL.revokeObjectURL(imageUrlRef.current);
            }
        };
    }, []);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Store the file for later upload
            uploadedFileRef.current = file;
            
            // Revoke the previous blob URL to free up memory
            if (imageUrlRef.current) {
                URL.revokeObjectURL(imageUrlRef.current);
            }
            // Create and store the new blob URL for preview
            const imageUrl = URL.createObjectURL(file);
            imageUrlRef.current = imageUrl;
            setImage(imageUrl);

            // Upload image to backend
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

    const handleDeleteImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Revoke the blob URL to free up memory
        if (imageUrlRef.current) {
            URL.revokeObjectURL(imageUrlRef.current);
            imageUrlRef.current = null;
        }
        setImage(null);
        setUploadedImageUrl(null);
        uploadedFileRef.current = null;
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const keyTypeOptions = [
        { value: 'Main Door', label: 'Main Door' },
        { value: 'Mailbox', label: 'Mailbox' },
        { value: 'Garage', label: 'Garage' },
        { value: 'Gate', label: 'Gate' },
        { value: 'Storage', label: 'Storage' },
        { value: 'Other', label: 'Other' },
    ];

    const propertyOptions = properties.map(prop => ({
        value: prop.id,
        label: prop.propertyName,
    }));

    const handleSubmit = async () => {
        if (!keyName || !keyType || !propertyId) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const keyData = {
                propertyId,
                keyName,
                keyType: mapKeyTypeToBackend(keyType),
                description: details || undefined,
                keyPhotoUrl: uploadedImageUrl || undefined,
            };

            if (isEditMode && id) {
                await updateKeyMutation.mutateAsync({
                    keyId: id,
                    updateData: keyData,
                });
            } else {
                await createKeyMutation.mutateAsync(keyData);
            }

            navigate('/dashboard/portfolio/keys-locks');
        } catch (error) {
            console.error('Error saving key:', error);
            alert(error instanceof Error ? error.message : 'Failed to save key');
        }
    };

    if (isEditMode && isLoadingKey) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/portfolio/keys-locks')}>Keys & Locks</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{isEditMode ? 'Edit Key' : 'Add Key'}</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-black" />
                    </button>
                    <h1 className="text-2xl font-bold text-black">{isEditMode ? 'Edit Key' : 'Add Key'}</h1>
                </div>


                {/* Key Photo Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Key photo</h2>
                    <div
                        className="relative w-full h-80 bg-white rounded-2xl overflow-hidden shadow-sm group border border-white cursor-pointer"
                        onClick={triggerFileInput}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                        {/* Checkerboard pattern simulation */}
                        <div className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `
                                        linear-gradient(45deg, #000 25%, transparent 25%),
                                        linear-gradient(-45deg, #000 25%, transparent 25%),
                                        linear-gradient(45deg, transparent 75%, #000 75%),
                                        linear-gradient(-45deg, transparent 75%, #000 75%)
                                    `,
                                backgroundSize: '40px 40px',
                                backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
                            }}
                        />

                        {image ? (
                            <>
                                <img src={image} alt="Key Preview" className="w-full h-full object-contain relative z-10" />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 hover:bg-black/5 transition-colors">
                                <div className="bg-[#3A6D6C] p-2 rounded-lg mb-2">
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm font-bold text-gray-600">Upload Photos</span>
                            </div>
                        )}

                        {/* Action Icons */}
                        {image && (
                            <div className="absolute top-4 right-4 flex gap-3 z-20">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        triggerFileInput();
                                    }}
                                    className="p-2 bg-white/90 hover:bg-white rounded text-[#3A6D6C] shadow-sm transition-colors border border-gray-100"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDeleteImage}
                                    className="p-2 bg-white/90 hover:bg-white rounded text-red-500 shadow-sm transition-colors border border-gray-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-12 mb-8">
                    {/* Key Name Input */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-gray-600 mb-2">
                            Key Name*
                        </label>
                        <input
                            type="text"
                            value={keyName}
                            onChange={(e) => setKeyName(e.target.value)}
                            placeholder="Key Name"
                            className="w-full px-4 py-3 border-none rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 text-sm font-medium text-gray-700 placeholder-gray-400 shadow-sm"
                        />
                    </div>

                    {/* Key Type Dropdown */}
                    <div className="w-full">
                        <CustomDropdown
                            label="Key Type"
                            value={keyType}
                            onChange={setKeyType}
                            options={keyTypeOptions}
                            placeholder="Key Type"
                            buttonClassName="bg-white border-none rounded-lg py-3 px-4 h-[46px] shadow-sm"
                            required={true}
                            textClassName="font-medium text-sm text-gray-700"
                        />
                    </div>
                </div>

                {/* Property Dropdown */}
                <div className="w-full mb-8">
                    {/* Using a grid to limit width to 50% roughly to match screenshot logic if needed, but 
                             screenshot shows Key Name and Key Type sharing a row, and Property sharing a row?
                             Actually wait, Key Name and Key Type are on one row. Property is on the NEXT row.
                             The Property dropdown spans the full width or large width.
                             Let's look at the screenshot again carefully.
                             [Key Name] [Key Type]
                             [Property Type] (Looks like it's taking up about 50% width, aligned with Key Name column)
                         */}
                    <div className="w-[calc(50%-1.5rem)]">
                        {isLoadingProperties ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-[#3A6D6C]" />
                                <span className="text-sm text-gray-500">Loading properties...</span>
                            </div>
                        ) : (
                            <CustomDropdown
                                label="Property"
                                value={propertyId}
                                onChange={setPropertyId}
                                options={propertyOptions}
                                placeholder="Select Property"
                                buttonClassName="bg-white border-none rounded-lg py-3 px-4 h-[46px] shadow-sm"
                                required={true}
                                textClassName="font-medium text-sm text-gray-700"
                            />
                        )}
                    </div>
                </div>

                {/* Details Textarea */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-600 mb-2">
                        Description
                    </label>
                    <div className="bg-white rounded-3xl p-6 min-h-[200px] relative shadow-sm">
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Type Details here.."
                            className="w-full h-full min-h-[160px] resize-none outline-none text-sm text-gray-600 placeholder-gray-500 font-medium bg-transparent"
                        />
                        <div className="absolute bottom-5 right-5 pointer-events-none">
                            <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.5 1.5L1.5 8.5" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M8.5 5.5L5.5 8.5" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        disabled={createKeyMutation.isPending || updateKeyMutation.isPending}
                        className="bg-white text-black px-10 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors border border-transparent disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={createKeyMutation.isPending || updateKeyMutation.isPending || isUploading}
                        className="bg-[#3A6D6C] text-white px-10 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-[#2c5251] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {(createKeyMutation.isPending || updateKeyMutation.isPending) && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {isEditMode ? 'Update' : 'Continue'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddKey;
