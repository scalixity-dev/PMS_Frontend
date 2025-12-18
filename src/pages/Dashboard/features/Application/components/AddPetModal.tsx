import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Upload } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';

export interface PetFormData {
    type: string;
    name: string;
    weight: string;
    breed: string;
    photo?: File | null;
}

interface AddPetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PetFormData) => void;
}

const typeOptions = [
    { value: 'Dog', label: 'Dog' },
    { value: 'Cat', label: 'Cat' },
    { value: 'Bird', label: 'Bird' },
    { value: 'Fish', label: 'Fish' },
    { value: 'Other', label: 'Other' }
];

const weightOptions = [
    { value: '< 5kg', label: '< 5kg' },
    { value: '5-10kg', label: '5-10kg' },
    { value: '10-20kg', label: '10-20kg' },
    { value: '> 20kg', label: '> 20kg' }
];

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<PetFormData>({
        type: '',
        name: '',
        weight: '',
        breed: '',
        photo: null
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Reset form and errors when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                type: '',
                name: '',
                weight: '',
                breed: '',
                photo: null
            });
            setErrors({});
            setTouched({});
            setPreviewUrl(null);
        }
    }, [isOpen]);

    // Image preview state
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (formData.photo) {
            const url = URL.createObjectURL(formData.photo);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [formData.photo]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleChange('photo', e.target.files[0]);
        }
    };

    if (!isOpen) return null;

    const validateField = (key: keyof PetFormData, value: any): string => {
        // Skip validation for optional photo field
        if (key === 'photo') {
            return '';
        }

        // Validate required string fields
        if (typeof value === 'string') {
            if (!value || value.trim() === '') {
                const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
                return `${fieldName} is required`;
            }
        }

        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // Validate only required fields (type, name, weight, breed)
        const requiredFields: Array<keyof PetFormData> = ['type', 'name', 'weight', 'breed'];

        requiredFields.forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (key: keyof PetFormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        // Clear error for this field when user starts typing/selecting
        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleBlur = (key: keyof PetFormData, currentValue?: any) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const value = currentValue !== undefined ? currentValue : formData[key];
        const error = validateField(key, value);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = () => {
        // Mark all required fields as touched
        const requiredFields: Array<keyof PetFormData> = ['type', 'name', 'weight', 'breed'];
        const allTouched = requiredFields.reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        // Validate all fields
        if (validateAllFields()) {
            onSave(formData);
            onClose();
        }
    };

    // Check if form is valid for button state
    const isFormValid = () => {
        const requiredFields: Array<keyof PetFormData> = ['type', 'name', 'weight', 'breed'];
        return requiredFields.every(key => {
            return !validateField(key, formData[key]);
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-3xl w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative overflow-visible">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-3xl">
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-medium">Add a new pet</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 grid grid-cols-3 gap-8">

                    {/* Left Column: Image Upload */}
                    <div className="col-span-1">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white rounded-3xl aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-gray-500 cursor-pointer hover:border-[#3A6D6C] hover:text-[#3A6D6C] transition-colors p-4 relative overflow-hidden group"
                            style={{
                                backgroundImage: `
                                    linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                                `,
                                backgroundSize: '20px 20px',
                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                            }}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-20 rounded-3xl" />
                            ) : (
                                <>
                                    <Upload size={40} className="mb-2 relative z-10" />
                                    <span className="font-semibold relative z-10">upload image</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Form Fields */}
                    <div className="col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Type */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-1 ml-1">Type *</label>
                                <CustomDropdown
                                    value={formData.type}
                                    onChange={(val) => {
                                        handleChange('type', val);
                                        if (!touched.type) {
                                            handleBlur('type', val);
                                        }
                                    }}
                                    options={typeOptions}
                                    placeholder="Choose Type"
                                    buttonClassName={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm ${touched.type && errors.type ? 'border-2 border-red-500' : 'border-none'
                                        }`}
                                    dropdownClassName="max-h-60"
                                />
                                {touched.type && errors.type && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.type}</p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-1 ml-1">Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter Name"
                                    className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm ${touched.name && errors.name ? 'border-2 border-red-500' : 'border-none'
                                        }`}
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    onBlur={() => handleBlur('name')}
                                />
                                {touched.name && errors.name && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Weight */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-1 ml-1">Weight *</label>
                                <CustomDropdown
                                    value={formData.weight}
                                    onChange={(val) => {
                                        handleChange('weight', val);
                                        if (!touched.weight) {
                                            handleBlur('weight', val);
                                        }
                                    }}
                                    options={weightOptions}
                                    placeholder="Choose Type"
                                    buttonClassName={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm ${touched.weight && errors.weight ? 'border-2 border-red-500' : 'border-none'
                                        }`}
                                    dropdownClassName="max-h-60"
                                />
                                {touched.weight && errors.weight && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.weight}</p>
                                )}
                            </div>

                            {/* Breed */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-1 ml-1">Breed *</label>
                                <input
                                    type="text"
                                    placeholder="Enter Breed"
                                    className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm ${touched.breed && errors.breed ? 'border-2 border-red-500' : 'border-none'
                                        }`}
                                    value={formData.breed}
                                    onChange={(e) => handleChange('breed', e.target.value)}
                                    onBlur={() => handleBlur('breed')}
                                />
                                {touched.breed && errors.breed && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.breed}</p>
                                )}
                            </div>
                        </div>

                        {/* Add Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid()}
                                className={`px-8 py-3 rounded-xl text-sm font-medium transition-colors shadow-md ${isFormValid()
                                        ? 'bg-[#3A6D6C] text-white hover:bg-[#2c5251] cursor-pointer'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Add
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddPetModal;
