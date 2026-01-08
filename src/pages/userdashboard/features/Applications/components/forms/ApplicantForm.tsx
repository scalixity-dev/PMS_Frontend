import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Upload, Search, ChevronDown, Check } from 'lucide-react';
import { Country } from 'country-state-city';
import DatePicker from '@/components/ui/DatePicker';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';
import ImageCropModal from '../../../../../Dashboard/features/Tenants/components/ImageCropModal';

interface FormData {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode?: string;
    dob: Date | undefined;
    shortBio: string;
    moveInDate: Date | undefined;
    photo?: File | null;
}

interface ApplicantFormProps {
    data: FormData;
    onChange: (key: keyof FormData, value: any) => void;
    onSubmit: () => void;
    title: string;
    subTitle: string;
    submitLabel?: string;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({
    data,
    onChange,
    onSubmit,
    title,
    subTitle,
    submitLabel = 'Next',
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const phoneCodeRef = useRef<HTMLDivElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
    const [phoneCodeSearch, setPhoneCodeSearch] = useState('');

    // Phone country codes
    const phoneCountryCodes = useMemo(() => {
        return Country.getAllCountries().map(country => ({
            label: `${country.flag} ${country.phonecode.startsWith('+') ? '' : '+'}${country.phonecode}`,
            value: `${country.isoCode}|${country.phonecode}`,
            name: country.name,
            phonecode: country.phonecode.startsWith('+') ? country.phonecode : `+${country.phonecode}`,
            flag: country.flag,
            isoCode: country.isoCode,
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const filteredPhoneCodes = useMemo(() => {
        if (!phoneCodeSearch) return phoneCountryCodes;
        const searchLower = phoneCodeSearch.toLowerCase();
        return phoneCountryCodes.filter(code =>
            code.name.toLowerCase().includes(searchLower) ||
            code.phonecode.includes(searchLower) ||
            code.isoCode.toLowerCase().includes(searchLower)
        );
    }, [phoneCodeSearch, phoneCountryCodes]);

    const selectedPhoneCode = useMemo(() => {
        if (!data.phoneCountryCode) return null;
        return phoneCountryCodes.find(code => code.value === data.phoneCountryCode);
    }, [data.phoneCountryCode, phoneCountryCodes]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (phoneCodeRef.current && !phoneCodeRef.current.contains(event.target as Node)) {
                setIsPhoneCodeOpen(false);
                setPhoneCodeSearch('');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (data.photo) {
            const url = URL.createObjectURL(data.photo);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [data.photo]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validation: File Type
            const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
            if (!ALLOWED_TYPES.includes(file.type)) {
                setErrors(prev => ({ ...prev, photo: "Please select a valid image file (JPEG, PNG, or WebP)." }));
                return;
            }

            // Validation: File Size (5MB limit)
            const MAX_SIZE = 5 * 1024 * 1024;
            if (file.size > MAX_SIZE) {
                setErrors(prev => ({ ...prev, photo: "File is too large. Please select an image smaller than 5MB." }));
                return;
            }

            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.photo;
                return newErrors;
            });

            const reader = new FileReader();
            reader.onload = (event) => {
                setImageToCrop(event.target?.result as string);
                setIsCropModalOpen(true);
            };
            reader.onerror = () => {
                setErrors(prev => ({ ...prev, photo: "Failed to read the file. Please try again." }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImageUrl: string, croppedFile: File) => {
        onChange('photo', croppedFile);
        setPreviewUrl(croppedImageUrl);
        setImageToCrop(null);
    };

    const validateField = (key: keyof FormData, value: any): string => {
        if (['firstName', 'lastName', 'email', 'phoneNumber', 'shortBio'].includes(key)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                return 'This field is required';
            }
        }
        if (key === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
        }
        if (key === 'dob' && !value) return 'Date of birth is required';
        if (key === 'moveInDate' && !value) return 'Preferred move in date is required';
        return '';
    };

    const handleBlur = (key: keyof FormData) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        setErrors(prev => ({ ...prev, [key]: validateField(key, data[key]) }));
    };

    const handleFieldChange = (key: keyof FormData, value: any) => {
        onChange(key, value);
        if (touched[key]) {
            setErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
        }
    };

    const isFormValid = (): boolean => {
        const requiredFields: Array<keyof FormData> = [
            'firstName', 'lastName', 'email', 'phoneNumber', 'dob', 'shortBio', 'moveInDate'
        ];
        return requiredFields.every(key => !validateField(key, data[key]));
    };

    const inputClass = (fieldName: string) => `
        w-full px-4 py-3 bg-white border rounded-[10px] text-sm font-medium transition-all
        ${touched[fieldName] && errors[fieldName]
            ? 'border-red-500 ring-1 ring-red-200'
            : 'border-[#E5E7EB] focus:border-[#7ED957] focus:ring-1 focus:ring-[#7ED957]/20'}
        text-[#1A1A1A] placeholder:text-[#ADADAD]
    `;

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">{title}</h2>
                <p className="text-gray-400 text-sm">{subTitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                {/* Profile Photo Section */}
                <div className="md:col-span-3 flex flex-col items-center">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 rounded-full border-2 border-dashed border-[#E5E7EB] flex items-center justify-center cursor-pointer hover:border-[#7ED957] transition-all overflow-hidden relative group bg-gray-50"
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-[#ADADAD]">
                                <Upload size={24} />
                                <span className="text-[10px] mt-2 font-medium">Upload Photo</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload size={20} className="text-white" />
                        </div>
                    </div>
                    {errors.photo && <span className="text-red-500 text-[10px] font-medium mt-2 text-center">{errors.photo}</span>}
                </div>

                {/* Form Fields Section */}
                <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#1A1A1A]">First Name *</label>
                        <input
                            type="text"
                            placeholder="First name"
                            className={inputClass('firstName')}
                            value={data.firstName}
                            onChange={(e) => handleFieldChange('firstName', e.target.value)}
                            onBlur={() => handleBlur('firstName')}
                        />
                        {touched.firstName && errors.firstName && <span className="text-red-500 text-[11px] font-medium">{errors.firstName}</span>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#1A1A1A]">Last Name *</label>
                        <input
                            type="text"
                            placeholder="Last name"
                            className={inputClass('lastName')}
                            value={data.lastName}
                            onChange={(e) => handleFieldChange('lastName', e.target.value)}
                            onBlur={() => handleBlur('lastName')}
                        />
                        {touched.lastName && errors.lastName && <span className="text-red-500 text-[11px] font-medium">{errors.lastName}</span>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#1A1A1A]">Email Address *</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email"
                                className={inputClass('email')}
                                value={data.email}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                            />
                            {!errors.email && data.email && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#7ED957] rounded-full flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={4} /></div>}
                        </div>
                        {touched.email && errors.email && <span className="text-red-500 text-[11px] font-medium">{errors.email}</span>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#1A1A1A]">Phone Number *</label>
                        <div className="flex gap-2">
                            <div className="relative w-28" ref={phoneCodeRef}>
                                <button
                                    onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                                    className="w-full h-full px-3 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm font-medium flex items-center justify-between"
                                >
                                    <span className="truncate">{selectedPhoneCode ? selectedPhoneCode.phonecode : 'Code'}</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </button>
                                {isPhoneCodeOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#E5E7EB] rounded-[10px] shadow-lg z-50 max-h-60 overflow-hidden flex flex-col">
                                        <div className="p-2 border-b border-[#E5E7EB]">
                                            <div className="relative">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search code"
                                                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md focus:outline-none focus:border-[#7ED957]"
                                                    value={phoneCodeSearch}
                                                    onChange={(e) => setPhoneCodeSearch(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto">
                                            {filteredPhoneCodes.map(code => (
                                                <button
                                                    key={code.value}
                                                    onClick={() => { onChange('phoneCountryCode', code.value); setIsPhoneCodeOpen(false); }}
                                                    className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <span>{code.flag}</span>
                                                    <span className="font-medium">{code.name}</span>
                                                    <span className="text-gray-400 ml-auto">{code.phonecode}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="tel"
                                placeholder="Number"
                                className={`${inputClass('phoneNumber')} flex-1`}
                                value={data.phoneNumber}
                                onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                                onBlur={() => handleBlur('phoneNumber')}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#1A1A1A]">Date of Birth *</label>
                        <DatePicker
                            value={data.dob}
                            onChange={(date) => handleFieldChange('dob', date)}
                            placeholder="Select Date"
                            className={inputClass('dob')}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#1A1A1A]">Preferred Move-in Date *</label>
                        <DatePicker
                            value={data.moveInDate}
                            onChange={(date) => handleFieldChange('moveInDate', date)}
                            placeholder="Select Date"
                            className={inputClass('moveInDate')}
                        />
                    </div>

                    <div className="col-span-full space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#1A1A1A]">Short Bio *</label>
                        <textarea
                            placeholder="Tell us a bit about yourself"
                            className={`${inputClass('shortBio')} min-h-[100px] resize-none`}
                            value={data.shortBio}
                            onChange={(e) => handleFieldChange('shortBio', e.target.value)}
                            onBlur={() => handleBlur('shortBio')}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-12">
                <PrimaryActionButton
                    text={submitLabel}
                    onClick={onSubmit}
                    disabled={!isFormValid()}
                    className={`px-16 py-3.5 rounded-full font-bold uppercase transition-all
                        ${isFormValid()
                            ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                            : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'}`}
                />
            </div>

            {isCropModalOpen && imageToCrop && (
                <ImageCropModal
                    image={imageToCrop}
                    onClose={() => { setIsCropModalOpen(false); setImageToCrop(null); }}
                    onCropComplete={handleCropComplete}
                    aspectRatio={1}
                    circularCrop={false}
                />
            )}
        </div>
    );
};

export default ApplicantForm;
