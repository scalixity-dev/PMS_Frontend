import React, { useState, useEffect, useRef } from 'react';
import { Upload, Edit2, Check } from 'lucide-react';
import CustomDropdown from '../../../../Dashboard/components/CustomDropdown';
import BaseModal from '@/components/common/modals/BaseModal';

export interface PetFormData {
    type: string;
    name: string;
    weight: string;
    breed: string;
    photo?: File | null;
    existingPhotoUrl?: string | null;
}

interface UserAddPetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PetFormData) => void;
    initialData?: PetFormData;
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

const UserAddPetModal: React.FC<UserAddPetModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<PetFormData>({
        type: '',
        name: '',
        weight: '',
        breed: '',
        photo: null
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
            if (initialData.photo) {
                const url = URL.createObjectURL(initialData.photo);
                setPreviewUrl(url);
            } else if (initialData.existingPhotoUrl) {
                setPreviewUrl(initialData.existingPhotoUrl);
            }
        } else if (!isOpen) {
            setFormData({
                type: '',
                name: '',
                weight: '',
                breed: '',
                photo: null,
                existingPhotoUrl: null
            });
            setErrors({});
            setTouched({});
            setPreviewUrl(null);
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        if (formData.photo) {
            const url = URL.createObjectURL(formData.photo);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [formData.photo]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleChange('photo', e.target.files[0]);
        }
    };

    const validateField = (key: keyof PetFormData, value: any): string => {
        if (key === 'photo' || key === 'existingPhotoUrl') return '';
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

    const isFormValid = () => {
        const requiredFields: Array<keyof PetFormData> = ['type', 'name', 'weight', 'breed'];
        return requiredFields.every(key => !validateField(key, formData[key]));
    };

    const handleChange = (key: keyof PetFormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
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
        const requiredFields: Array<keyof PetFormData> = ['type', 'name', 'weight', 'breed'];
        const allTouched = requiredFields.reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        if (validateAllFields()) {
            onSave(formData);
            onClose();
        }
    };

    const inputClasses = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]";
    const labelClasses = "block text-xs font-semibold text-gray-700 mb-1";
    const errorClasses = "text-red-500 text-xs mt-1";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit pet' : 'Add a new pet'}
            maxWidth="max-w-2xl"
            footerButtons={[
                {
                    label: 'Cancel',
                    onClick: onClose,
                    variant: 'ghost',
                },
                {
                    label: initialData ? 'Save Changes' : 'Add',
                    onClick: handleSubmit,
                    disabled: !isFormValid(),
                    variant: 'primary',
                    className: "bg-[#7ED957] hover:bg-[#6BC847] border-none text-white",
                    icon: <Check size={16} strokeWidth={3} />
                }
            ]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
                {/* Image Upload Column */}
                <div className="md:col-span-1 flex flex-col items-center">
                    <label className={labelClasses}>Pet Photo</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 w-full aspect-square md:w-40 md:h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#7CD947] hover:bg-[#F4F9F0] transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group"
                    >
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <Edit2 size={20} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                                <span className="text-xs text-gray-500 font-medium">Click to upload</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fields Column */}
                <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Type</label>
                            <CustomDropdown
                                value={formData.type}
                                onChange={(val: string) => {
                                    handleChange('type', val);
                                    if (!touched.type) handleBlur('type', val);
                                }}
                                options={typeOptions}
                                placeholder="Choose Type"
                                buttonClassName={`${inputClasses} ${touched.type && errors.type ? 'border-red-500' : ''}`}
                            />
                            {touched.type && errors.type && <p className={errorClasses}>{errors.type}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Name</label>
                            <input
                                type="text"
                                placeholder="Enter Name"
                                className={`${inputClasses} ${touched.name && errors.name ? 'border-red-500' : ''}`}
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                onBlur={() => handleBlur('name')}
                            />
                            {touched.name && errors.name && <p className={errorClasses}>{errors.name}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Weight</label>
                            <CustomDropdown
                                value={formData.weight}
                                onChange={(val: string) => {
                                    handleChange('weight', val);
                                    if (!touched.weight) handleBlur('weight', val);
                                }}
                                options={weightOptions}
                                placeholder="Select Weight"
                                buttonClassName={`${inputClasses} ${touched.weight && errors.weight ? 'border-red-500' : ''}`}
                            />
                            {touched.weight && errors.weight && <p className={errorClasses}>{errors.weight}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Breed</label>
                            <input
                                type="text"
                                placeholder="Enter Breed"
                                className={`${inputClasses} ${touched.breed && errors.breed ? 'border-red-500' : ''}`}
                                value={formData.breed}
                                onChange={(e) => handleChange('breed', e.target.value)}
                                onBlur={() => handleBlur('breed')}
                            />
                            {touched.breed && errors.breed && <p className={errorClasses}>{errors.breed}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default UserAddPetModal;
