import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Check, Loader2, X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';
import UnsavedChangesModal from '../../components/UnsavedChangesModal';
import DatePicker from '../../../../components/ui/DatePicker';
import { format } from 'date-fns';
import { useCreateEquipment, useUpdateEquipment, useGetEquipment, useGetEquipmentCategories, useGetEquipmentSubcategories } from '../../../../hooks/useEquipmentQueries';
import { useGetAllProperties } from '../../../../hooks/usePropertyQueries';
import { API_ENDPOINTS } from '../../../../config/api.config';
import { getCurrencySymbol } from '../../../../utils/currency.utils';

const CreateEquipment = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    // Dirty state tracking for unsaved changes
    const [isDirty, setIsDirty] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingNavigationPath, setPendingNavigationPath] = useState<string | null>(null);

    // Initial loading ref to prevent dirty state on first load
    const isInitializingRef = useRef(true);

    const { data: properties = [], isLoading: isLoadingProperties } = useGetAllProperties();
    const { data: categories = [], isLoading: isLoadingCategories } = useGetEquipmentCategories();
    const { data: existingEquipment, isLoading: isLoadingEquipment, error: equipmentError } = useGetEquipment(id || null, isEditMode);
    const createEquipmentMutation = useCreateEquipment();
    const updateEquipmentMutation = useUpdateEquipment();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [attachmentErrors, setAttachmentErrors] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        categoryId: '',
        subcategoryId: '',
        brand: '',
        model: '',
        price: '',
        propertyId: '',
        serial: '',
        installationDate: '',
        hasWarranty: false,
        warrantyExpirationDate: '',
        isLifetimeWarranty: false,
        description: ''
    });

    // Allowed MIME types for document attachments (same as AddProperty)
    const allowedDocumentTypes = [
        'application/pdf',
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/plain', // .txt
    ];

    // Fetch subcategories when a category is selected
    const { data: subcategories = [], isLoading: isLoadingSubcategories } = useGetEquipmentSubcategories(
        formData.categoryId || null,
        !!formData.categoryId
    );

    // Pre-fill form data when equipment is being edited

    // Pre-fill form when editing
    useEffect(() => {
        if (isEditMode && existingEquipment) {
            isInitializingRef.current = true; // Start initialization
            const eq = existingEquipment as any;
            setFormData({
                categoryId: typeof eq.category === 'object' ? eq.category?.id || '' : '',
                subcategoryId: typeof eq.subcategory === 'object' ? eq.subcategory?.id || '' : '',
                brand: eq.brand || '',
                model: eq.model || '',
                price: typeof eq.price === 'string' ? eq.price.replace(/[^0-9.]/g, '') : String(eq.price || ''),
                propertyId: eq.propertyId || '',
                serial: eq.serialNumber || '',
                installationDate: eq.dateOfInstallation || '',
                hasWarranty: false, // Warranty fields not in backend yet
                warrantyExpirationDate: '',
                isLifetimeWarranty: false,
                description: eq.equipmentDetails || ''
            });
            if (eq.photoUrl) {
                setUploadedImageUrl(eq.photoUrl);
            }
            // Reset dirty state after a short delay to allow for state updates
            setTimeout(() => {
                setIsDirty(false);
                isInitializingRef.current = false;
            }, 100);
        } else {
            isInitializingRef.current = false;
        }
    }, [isEditMode, existingEquipment]);

    // Get selected property to extract currency
    const selectedProperty = useMemo(() => {
        return properties.find(prop => prop.id === formData.propertyId);
    }, [properties, formData.propertyId]);

    // Get currency symbol based on selected property's country
    const currencySymbol = useMemo(() => {
        if (selectedProperty?.address?.country) {
            return getCurrencySymbol(selectedProperty.address.country);
        }
        return '$'; // Default to USD
    }, [selectedProperty]);



    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            // Clear subcategory when category changes
            if (field === 'categoryId') {
                newData.subcategoryId = '';
            }
            return newData;
        });
        if (!isInitializingRef.current) {
            setIsDirty(true);
        }
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
                setIsDirty(true);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image. Please try again.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const remainingSlots = 10 - uploadedFiles.length;
        if (remainingSlots <= 0) {
            alert('Maximum 10 files allowed. Please remove some files first.');
            if (fileUploadRef.current) fileUploadRef.current.value = '';
            return;
        }

        const selectedFiles = Array.from(files).slice(0, remainingSlots);
        const validFiles: File[] = [];
        const invalidFiles: string[] = [];

        selectedFiles.forEach(file => {
            if (allowedDocumentTypes.includes(file.type)) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file.name);
            }
        });

        if (invalidFiles.length > 0) {
            const errorMessage = `Invalid file types: ${invalidFiles.join(', ')}. Allowed: PDF, Word, Excel, Text.`;
            setAttachmentErrors(prev => [...prev, errorMessage]);
            // Auto-clear this batch of errors after 5 seconds
            setTimeout(() => {
                setAttachmentErrors(prev => prev.filter(err => err !== errorMessage));
            }, 5000);
        }

        if (validFiles.length > 0) {
            setUploadedFiles(prev => [...prev, ...validFiles]);
            setIsDirty(true);
        }

        // Reset input so same file can be selected again if needed
        if (fileUploadRef.current) {
            fileUploadRef.current.value = '';
        }
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
        setIsDirty(true);
    };

    // Helper to upload a document file to the backend (same pattern as AddProperty)
    const uploadAttachmentFile = async (file: File, propertyId?: string): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'DOCUMENT');
        if (propertyId) {
            formData.append('propertyId', propertyId);
        }

        const response = await fetch(API_ENDPOINTS.UPLOAD.FILE, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response
                .json()
                .catch(() => ({ message: 'Failed to upload file' }));
            throw new Error(errorData.message || 'Failed to upload file');
        }

        const data = await response.json();
        return data.url;
    };

    const handleSubmit = async () => {
        if (!formData.categoryId || !formData.brand || !formData.model || !formData.price || !formData.propertyId || !formData.serial || !formData.installationDate) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const equipmentData = {
                propertyId: formData.propertyId,
                categoryId: formData.categoryId,
                subcategoryId: formData.subcategoryId && formData.subcategoryId.trim() !== '' ? formData.subcategoryId : undefined,
                brand: formData.brand,
                model: formData.model,
                serialNumber: formData.serial,
                price: parseFloat(formData.price.replace(/[^0-9.]/g, '')) || 0,
                dateOfInstallation: formData.installationDate,
                equipmentDetails: formData.description || undefined,
                photoUrl: uploadedImageUrl || undefined,
                ...(isEditMode ? {} : { status: 'ACTIVE' as const }),
            };

            if (isEditMode && id) {
                // Update existing equipment
                await updateEquipmentMutation.mutateAsync({
                    equipmentId: id,
                    updateData: equipmentData,
                });
            } else {
                // Create new equipment
                await createEquipmentMutation.mutateAsync(equipmentData);

                // Then, if there are any uploaded files, attach them to the property
                if (uploadedFiles.length > 0 && formData.propertyId) {
                    try {
                        await Promise.all(
                            uploadedFiles.map(file => uploadAttachmentFile(file, formData.propertyId)),
                        );
                    } catch (uploadError) {
                        console.error('Some attachments failed to upload:', uploadError);
                        // Equipment created, but warn user about attachment failure
                        alert('Equipment created, but some attachments failed to upload. Please try adding them again.');
                        navigate('/dashboard/equipments');
                        return;
                    }
                }
            }

            navigate('/dashboard/equipments');
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} equipment:`, error);
            alert(error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'create'} equipment`);
        }
    };

    const handleNavigation = (path: string) => {
        if (isDirty) {
            setPendingNavigationPath(path);
            setShowUnsavedModal(true);
        } else {
            navigate(path);
        }
    };

    const handleConfirmNavigation = () => {
        setShowUnsavedModal(false);
        setIsDirty(false);
        if (pendingNavigationPath === '-1') {
            navigate(-1);
        } else if (pendingNavigationPath) {
            navigate(pendingNavigationPath);
        }
    };

    const handleCancelNavigation = () => {
        setShowUnsavedModal(false);
        setPendingNavigationPath(null);
    };

    // Show loading state while categories or equipment data are being fetched
    if (isLoadingCategories || (isEditMode && isLoadingEquipment)) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-12">
                <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                    <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                    <span className="text-gray-500 text-sm mx-1">/</span>
                    <span className="text-gray-600 text-sm font-semibold">{isEditMode ? 'Edit Equipment' : 'Add Equipment'}</span>
                </div>
                <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                        <span className="text-sm text-gray-600">
                            {isEditMode ? 'Loading equipment data...' : 'Loading categories...'}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state if equipment not found in edit mode
    if (isEditMode && equipmentError) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-12">
                <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                    <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                    <span className="text-gray-500 text-sm mx-1">/</span>
                    <span className="text-gray-600 text-sm font-semibold">Edit Equipment</span>
                </div>
                <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] flex items-center justify-center">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md text-center">
                        <p className="text-red-800 font-semibold mb-2">Equipment not found</p>
                        <p className="text-sm text-red-700 mb-4">
                            {equipmentError instanceof Error ? equipmentError.message : 'The equipment you are trying to edit does not exist.'}
                        </p>
                        <button
                            onClick={() => handleNavigation('/dashboard/equipments')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                        >
                            Back to Equipments
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-12 transition-all duration-300">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold cursor-pointer" onClick={() => handleNavigation('/dashboard/equipments')}>Equipments</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{isEditMode ? 'Edit Equipment' : 'Add Equipment'}</span>
            </div>

            <div className="p-4 md:p-6 bg-[#E0E8E7] min-h-screen rounded-[1.5rem] md:rounded-[2rem]">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => handleNavigation('/dashboard/equipments')}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Equipment' : 'Add Equipment'}</h1>
                </div>

                {/* Cover Photo Upload */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Equipment Photo</h2>
                    <div className="bg-white rounded-[2rem] p-8 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-64 relative overflow-hidden group hover:border-[#4ad1a6] transition-colors">
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
                            <div className="relative w-full h-full min-h-64 flex flex-col items-center justify-center">
                                <img src={uploadedImageUrl} alt="Equipment" className="max-w-full max-h-64 object-contain relative z-10 rounded-lg" />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 rounded-lg">
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                    </div>
                                )}
                                {!isUploading && (
                                    <div className="mt-4 flex gap-3 z-10">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-[#3A6D6C] text-white rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors"
                                        >
                                            Replace Photo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUploadedImageUrl(null);
                                                setIsDirty(true);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                        >
                                            Remove Photo
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="z-10 flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-3">
                                    {isUploading ? (
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    ) : (
                                        <Upload className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                    {isUploading ? 'Uploading...' : 'Upload Equipment Photo'}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">Click to upload</span>
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
                </div>

                {/* General Information */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">General information</h2>
                    <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Category*</label>
                            <CustomDropdown
                                options={categories.map(cat => ({
                                    value: cat.id,
                                    label: cat.name,
                                }))}
                                value={formData.categoryId}
                                onChange={(val) => handleInputChange('categoryId', val)}
                                placeholder="Select Category"
                                buttonClassName="w-full bg-white rounded-xl border-none h-12"
                            />
                        </div>
                        {formData.categoryId && (
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Subcategory</label>
                                {isLoadingSubcategories ? (
                                    <div className="flex items-center gap-2 h-12">
                                        <Loader2 className="w-4 h-4 animate-spin text-[#3A6D6C]" />
                                        <span className="text-sm text-gray-500">Loading subcategories...</span>
                                    </div>
                                ) : subcategories.length > 0 ? (
                                    <CustomDropdown
                                        options={subcategories.map(subcat => ({
                                            value: subcat.id,
                                            label: subcat.name,
                                        }))}
                                        value={formData.subcategoryId}
                                        onChange={(val) => handleInputChange('subcategoryId', val)}
                                        placeholder="Select Subcategory (Optional)"
                                        buttonClassName="w-full bg-white rounded-xl border-none h-12"
                                    />
                                ) : (
                                    <div className="w-full bg-white rounded-xl border-none h-12 px-4 flex items-center text-sm text-gray-500">
                                        No subcategories available
                                    </div>
                                )}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Equipment Brand *</label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => handleInputChange('brand', e.target.value)}
                                placeholder="Enter brand name"
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
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Price * {formData.propertyId && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
                            </label>
                            <div className="relative">
                                {formData.propertyId && (
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">{currencySymbol}</span>
                                )}
                                <input
                                    type="text"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    placeholder={`${currencySymbol} 0.00`}
                                    className={`w-full bg-white rounded-xl border-none h-12 px-4 focus:ring-0 ${formData.propertyId ? 'pl-8' : ''}`}
                                />
                            </div>
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
                    </div>

                    <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8">
                        {/* Warranty Checkbox */}
                        <div className="mb-6">
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                    const newValue = !formData.hasWarranty;
                                    handleInputChange('hasWarranty', newValue);
                                    if (!newValue) {
                                        handleInputChange('warrantyExpirationDate', '');
                                        handleInputChange('isLifetimeWarranty', false);
                                    }
                                }}
                            >
                                <div
                                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${formData.hasWarranty ? 'bg-[#3A6D6C]' : 'bg-white border border-gray-300'}`}
                                >
                                    {formData.hasWarranty && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <label className="text-sm font-bold text-gray-800 cursor-pointer">This equipment has warranty</label>
                            </div>
                        </div>

                        {/* Warranty Details - Only show when hasWarranty is true */}
                        {formData.hasWarranty && (
                            <div className="space-y-6 border-t pt-6">
                                <div>
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
                        )}
                    </div>
                </div>

                {/* Equipment Details */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Equipment details</h2>
                        <span className="text-xs text-[#3A6D6C]">(Add any additional equipment details such as short description, sizes, color or a receipt file. (You can add up to 10 files.) )</span>
                    </div>

                    <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8">
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Type Details here.."
                            className="w-full bg-[#F0F0F6] rounded-xl border-none p-4 min-h-[150px] focus:ring-0 resize-none text-sm"
                        />
                    </div>

                    {/* File Upload Box */}
                    <div className="mt-4 bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8">
                        {attachmentErrors.length > 0 && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-xs text-red-700 space-y-1">
                                {attachmentErrors.map((err, idx) => (
                                    <p key={idx}>{err}</p>
                                ))}
                            </div>
                        )}
                        {uploadedFiles.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <div className="w-8 h-8 bg-[#3A6D6C] rounded flex items-center justify-center shrink-0">
                                                <Upload className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                                <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            className="ml-2 p-1 hover:bg-red-50 rounded transition-colors shrink-0"
                                        >
                                            <X className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-center">
                            <div className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg flex flex-col items-center cursor-pointer hover:bg-[#2c5251] transition-colors relative overflow-hidden">
                                <Upload className="w-5 h-5 mb-1" />
                                <span className="text-xs font-medium">
                                    {uploadedFiles.length >= 10 ? 'Maximum files reached' : `Upload File (${uploadedFiles.length}/10)`}
                                </span>
                                <input
                                    type="file"
                                    ref={fileUploadRef}
                                    onChange={handleFileUpload}
                                    multiple
                                    disabled={uploadedFiles.length >= 10}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
                                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create/Update Button */}
                <div>
                    <button
                        onClick={handleSubmit}
                        disabled={createEquipmentMutation.isPending || updateEquipmentMutation.isPending || isUploading}
                        className="w-full md:w-auto px-8 py-3 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5251] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {(createEquipmentMutation.isPending || updateEquipmentMutation.isPending || isUploading) && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {isEditMode ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
            {/* Unsaved Changes Modal */}
            <UnsavedChangesModal
                isOpen={showUnsavedModal}
                onClose={handleCancelNavigation}
                onConfirm={handleConfirmNavigation}
                title="Unsaved Changes"
                message="You have unsaved changes. Are you sure you want to leave without saving?"
                confirmText="Leave without saving"
                cancelText="Keep editing"
            />
        </div>
    );
};



export default CreateEquipment;
