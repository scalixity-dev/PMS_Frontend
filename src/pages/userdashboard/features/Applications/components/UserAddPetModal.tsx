import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Check, Plus } from 'lucide-react';
import CustomDropdown from '../../../../Dashboard/components/CustomDropdown';
import BaseModal from '@/components/common/modals/BaseModal';
import { useToast } from '../../../../../components/common/Toast';

export interface PetFormData {
    type: string;
    name: string;
    weight: string;
    breed: string;
    photos: File[];
    existingPhotoUrls?: string[];
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

const MAX_PHOTOS = 5;
const MAX_BYTES = 5 * 1024 * 1024;

const UserAddPetModal: React.FC<UserAddPetModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const toast = useToast();
    const [formData, setFormData] = useState<PetFormData>({
        type: '',
        name: '',
        weight: '',
        breed: '',
        photos: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (!isOpen) {
            setFormData({ type: '', name: '', weight: '', breed: '', photos: [] });
            setErrors({});
            setTouched({});
        }
    }, [isOpen, initialData]);

    // Keep preview URLs in sync with formData.photos
    useEffect(() => {
        const urls = formData.photos.map(f => URL.createObjectURL(f));
        setPreviewUrls(urls);
        return () => urls.forEach(u => URL.revokeObjectURL(u));
    }, [formData.photos]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const incoming = Array.from(e.target.files);
        const remaining = MAX_PHOTOS - formData.photos.length;

        const valid: File[] = [];
        for (const file of incoming.slice(0, remaining)) {
            if (!file.type.startsWith('image/')) {
                toast.error(`"${file.name}" is not an image file and was skipped.`);
                continue;
            }
            if (file.size > MAX_BYTES) {
                toast.error(`"${file.name}" exceeds 5 MB and was skipped.`);
                continue;
            }
            valid.push(file);
        }

        if (valid.length > 0) {
            setFormData(prev => ({ ...prev, photos: [...prev.photos, ...valid] }));
        }
        e.target.value = '';
    };

    const removePhoto = (index: number) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index),
        }));
    };

    const validateField = (key: keyof PetFormData, value: any): string => {
        if (key === 'photos' || key === 'existingPhotoUrls') return '';
        if (typeof value === 'string' && (!value || value.trim() === '')) {
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
            return `${fieldName} is required`;
        }
        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;
        const requiredFields: Array<keyof PetFormData> = ['type', 'name', 'weight', 'breed'];
        requiredFields.forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) { newErrors[key] = error; isValid = false; }
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
            setErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
        }
    };

    const handleBlur = (key: keyof PetFormData, currentValue?: any) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const value = currentValue !== undefined ? currentValue : formData[key];
        setErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
    };

    const handleSubmit = () => {
        const requiredFields: Array<keyof PetFormData> = ['type', 'name', 'weight', 'breed'];
        const allTouched: Record<string, boolean> = {};
        const allErrors: Record<string, string> = {};
        requiredFields.forEach(key => {
            allTouched[key] = true;
            const error = validateField(key, formData[key]);
            if (error) allErrors[key] = error;
        });
        setTouched(allTouched);
        setErrors(allErrors);
        if (validateAllFields()) { onSave(formData); onClose(); }
    };

    const inputClasses = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]";
    const labelClasses = "block text-xs font-semibold text-gray-700 mb-1";
    const errorClasses = "text-red-500 text-xs mt-1";

    const allPreviews = [
        ...previewUrls,
        ...(formData.existingPhotoUrls ?? []),
    ];
    const canAddMore = formData.photos.length + (formData.existingPhotoUrls?.length ?? 0) < MAX_PHOTOS;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit pet' : 'Add a new pet'}
            maxWidth="max-w-2xl"
            footerButtons={[
                { label: 'Cancel', onClick: onClose, variant: 'ghost' },
                {
                    label: initialData ? 'Save Changes' : 'Add',
                    onClick: handleSubmit,
                    disabled: false,
                    variant: 'primary',
                    className: "bg-[#7ED957] hover:bg-[#6BC847] border-none text-white",
                    icon: <Check size={16} strokeWidth={3} />
                }
            ]}
        >
            <div className="space-y-4 py-2">
                {/* Photo upload area */}
                <div>
                    <label className={labelClasses}>
                        Pet Photos <span className="text-gray-400 font-normal">(up to {MAX_PHOTOS})</span>
                    </label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />

                    {allPreviews.length === 0 ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#7CD947] hover:bg-[#F4F9F0] transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                        >
                            <Upload size={22} className="text-gray-400" />
                            <span className="text-xs text-gray-500 font-medium">Click to upload photos</span>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {allPreviews.map((url, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={url} alt={`pet-${i}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(i)}
                                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} className="text-white" />
                                    </button>
                                </div>
                            ))}
                            {canAddMore && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#7CD947] hover:bg-[#F4F9F0] transition-all flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#7CD947]"
                                >
                                    <Plus size={18} />
                                    <span className="text-[10px] font-medium">Add more</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Type *</label>
                        <CustomDropdown
                            value={formData.type}
                            onChange={(val: string) => { handleChange('type', val); if (!touched.type) handleBlur('type', val); }}
                            options={typeOptions}
                            placeholder="Choose Type"
                            buttonClassName={`${inputClasses} ${touched.type && errors.type ? 'border-red-500' : ''}`}
                        />
                        {touched.type && errors.type && <p className={errorClasses}>{errors.type}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Name *</label>
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
                        <label className={labelClasses}>Weight *</label>
                        <CustomDropdown
                            value={formData.weight}
                            onChange={(val: string) => { handleChange('weight', val); if (!touched.weight) handleBlur('weight', val); }}
                            options={weightOptions}
                            placeholder="Select Weight"
                            buttonClassName={`${inputClasses} ${touched.weight && errors.weight ? 'border-red-500' : ''}`}
                        />
                        {touched.weight && errors.weight && <p className={errorClasses}>{errors.weight}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Breed *</label>
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
        </BaseModal>
    );
};

export default UserAddPetModal;
