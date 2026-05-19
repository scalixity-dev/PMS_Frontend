import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, Upload, Plus } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';

export interface PetFormData {
    type: string;
    name: string;
    weight: string;
    breed: string;
    photos: File[];
    existingPhotoUrls?: string[];
}

interface AddPetModalProps {
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

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
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
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (!isOpen) {
            setFormData({ type: '', name: '', weight: '', breed: '', photos: [] });
            setErrors({});
            setTouched({});
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        const urls = formData.photos.map(f => URL.createObjectURL(f));
        setPreviewUrls(urls);
        return () => urls.forEach(u => URL.revokeObjectURL(u));
    }, [formData.photos]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const incoming = Array.from(e.target.files);
        const remaining = MAX_PHOTOS - formData.photos.length - (formData.existingPhotoUrls?.length ?? 0);

        const valid: File[] = [];
        for (const file of incoming.slice(0, remaining)) {
            if (!file.type.startsWith('image/')) {
                alert(`"${file.name}" is not an image file and was skipped.`);
                continue;
            }
            if (file.size > MAX_BYTES) {
                alert(`"${file.name}" exceeds 5 MB and was skipped.`);
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

    if (!isOpen) return null;

    const validateField = (key: keyof PetFormData, value: any): string => {
        if (key === 'photos' || key === 'existingPhotoUrls') return '';
        if (typeof value === 'string' && (!value || value.trim() === '')) {
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
            return `${fieldName} is required`;
        }
        if ((key === 'name' || key === 'breed') && typeof value === 'string' && value) {
            if (!/^[a-zA-Z\s\-']+$/.test(value)) {
                const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
                return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
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
            if (error) { newErrors[key] = error; isValid = false; }
        });
        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (key: keyof PetFormData, value: any) => {
        if ((key === 'name' || key === 'breed') && typeof value === 'string') {
            if (value && !/^[a-zA-Z\s\-']*$/.test(value)) return;
        }
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

    const allPreviews = [
        ...previewUrls,
        ...(formData.existingPhotoUrls ?? []),
    ];
    const canAddMore = formData.photos.length + (formData.existingPhotoUrls?.length ?? 0) < MAX_PHOTOS;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-3xl w-[95%] sm:w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative overflow-visible">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-3xl">
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-medium">{initialData ? 'Edit pet' : 'Add a new pet'}</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-8 space-y-6">

                    {/* Photo upload area */}
                    <div>
                        <label className="block text-sm font-semibold text-[#2c3e50] mb-2 ml-1">
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
                                className="w-full h-36 bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#3A6D6C] hover:bg-[#3A6D6C]/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                            >
                                <Upload size={28} className="text-gray-400" />
                                <span className="text-sm text-gray-500 font-medium">Click to upload photos</span>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {allPreviews.map((url, i) => (
                                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                                        <img src={url} alt={`pet-${i}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(i)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={10} className="text-white" />
                                        </button>
                                    </div>
                                ))}
                                {canAddMore && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#3A6D6C] hover:bg-[#3A6D6C]/5 transition-all flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#3A6D6C]"
                                    >
                                        <Plus size={20} />
                                        <span className="text-[10px] font-medium">Add more</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-1 ml-1">Type *</label>
                            <CustomDropdown
                                value={formData.type}
                                onChange={(val) => { handleChange('type', val); if (!touched.type) handleBlur('type', val); }}
                                options={typeOptions}
                                placeholder="Choose Type"
                                buttonClassName={`w-full bg-white p-3 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm ${touched.type && errors.type ? 'border-2 border-red-500' : 'border-none'}`}
                                dropdownClassName="max-h-60"
                            />
                            {touched.type && errors.type && <p className="text-red-500 text-xs mt-1 ml-1">{errors.type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-1 ml-1">Name *</label>
                            <input
                                type="text"
                                placeholder="Enter Name"
                                className={`w-full bg-white p-3 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm ${touched.name && errors.name ? 'border-2 border-red-500' : 'border-none'}`}
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                onBlur={() => handleBlur('name')}
                            />
                            {touched.name && errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-1 ml-1">Weight *</label>
                            <CustomDropdown
                                value={formData.weight}
                                onChange={(val) => { handleChange('weight', val); if (!touched.weight) handleBlur('weight', val); }}
                                options={weightOptions}
                                placeholder="Select Weight"
                                buttonClassName={`w-full bg-white p-3 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm ${touched.weight && errors.weight ? 'border-2 border-red-500' : 'border-none'}`}
                                dropdownClassName="max-h-60"
                            />
                            {touched.weight && errors.weight && <p className="text-red-500 text-xs mt-1 ml-1">{errors.weight}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-1 ml-1">Breed *</label>
                            <input
                                type="text"
                                placeholder="Enter Breed"
                                className={`w-full bg-white p-3 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm ${touched.breed && errors.breed ? 'border-2 border-red-500' : 'border-none'}`}
                                value={formData.breed}
                                onChange={(e) => handleChange('breed', e.target.value)}
                                onBlur={() => handleBlur('breed')}
                            />
                            {touched.breed && errors.breed && <p className="text-red-500 text-xs mt-1 ml-1">{errors.breed}</p>}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-3 rounded-xl text-sm font-medium transition-colors shadow-md bg-[#3A6D6C] text-white hover:bg-[#2c5251] cursor-pointer"
                        >
                            {initialData ? 'Save' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPetModal;
