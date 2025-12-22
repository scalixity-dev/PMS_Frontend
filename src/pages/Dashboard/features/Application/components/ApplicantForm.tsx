import React, { useMemo, useEffect } from 'react';
import { Upload, Search, ChevronDown } from 'lucide-react';
import { Country } from 'country-state-city';
import DatePicker from '@/components/ui/DatePicker';
import ImageCropModal from '../../Tenants/components/ImageCropModal';

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
    onCancel?: () => void;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({
    data,
    onChange,
    onSubmit,
    title,
    subTitle,
    submitLabel = 'Continue',
    onCancel
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const phoneCodeRef = React.useRef<HTMLDivElement>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [touched, setTouched] = React.useState<Record<string, boolean>>({});
    const [isCropModalOpen, setIsCropModalOpen] = React.useState(false);
    const [imageToCrop, setImageToCrop] = React.useState<string | null>(null);
    const [isPhoneCodeOpen, setIsPhoneCodeOpen] = React.useState(false);
    const [phoneCodeSearch, setPhoneCodeSearch] = React.useState('');
    
    // Refs for form fields to enable focus management
    const firstNameRef = React.useRef<HTMLInputElement>(null);
    const lastNameRef = React.useRef<HTMLInputElement>(null);
    const emailRef = React.useRef<HTMLInputElement>(null);
    const phoneRef = React.useRef<HTMLInputElement>(null);
    const dobRef = React.useRef<HTMLDivElement>(null);
    const bioRef = React.useRef<HTMLInputElement>(null);
    const moveInDateRef = React.useRef<HTMLDivElement>(null);

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

    // Filter phone codes based on search
    const filteredPhoneCodes = useMemo(() => {
        if (!phoneCodeSearch) return phoneCountryCodes;
        const searchLower = phoneCodeSearch.toLowerCase();
        return phoneCountryCodes.filter(code => 
            code.name.toLowerCase().includes(searchLower) ||
            code.phonecode.includes(searchLower) ||
            code.isoCode.toLowerCase().includes(searchLower)
        );
    }, [phoneCodeSearch, phoneCountryCodes]);

    // Get selected phone code display
    const selectedPhoneCode = useMemo(() => {
        if (!data.phoneCountryCode) return null;
        return phoneCountryCodes.find(code => code.value === data.phoneCountryCode);
    }, [data.phoneCountryCode, phoneCountryCodes]);

    // Close phone code dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (phoneCodeRef.current && !phoneCodeRef.current.contains(event.target as Node)) {
                setIsPhoneCodeOpen(false);
                setPhoneCodeSearch('');
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    React.useEffect(() => {
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
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                setImageToCrop(imageUrl);
                setIsCropModalOpen(true);
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
        // Required fields validation
        if (['firstName', 'lastName', 'email', 'phoneNumber', 'shortBio'].includes(key)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                const fieldName = key.charAt(0).toUpperCase() + key.slice(1)
                    .replace(/([A-Z])/g, ' $1').trim();
                return `${fieldName} is required`;
            }
        }

        // Email format validation
        if (key === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Please enter a valid email address';
            }
        }

        // Phone format validation (basic - allows various international formats)
        if (key === 'phoneNumber' && value) {
            // Remove spaces, dashes, parentheses, and plus signs to count actual digits
            const digitsOnly = value.replace(/[\s\-\+\(\)]/g, '');
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            
            // Check if it contains only valid characters
            if (!phoneRegex.test(value)) {
                return 'Please enter a valid phone number';
            }
            
            // Check if it has at least 4 digits (minimum for most countries)
            // and at most 15 digits (ITU-T E.164 standard maximum)
            if (digitsOnly.length < 4) {
                return 'Phone number must contain at least 4 digits';
            }
            
            if (digitsOnly.length > 15) {
                return 'Phone number cannot exceed 15 digits';
            }
        }

        // Date fields validation
        if (key === 'dob' && !value) {
            return 'Date of birth is required';
        }

        if (key === 'moveInDate' && !value) {
            return 'Preferred move in date is required';
        }

        return '';
    };

    const validateAllFields = (): { isValid: boolean; firstErrorField: string | null } => {
        const newErrors: Record<string, string> = {};
        let firstErrorField: string | null = null;

        // Validate all required fields in order
        const fieldsToValidate: Array<{ key: keyof FormData; ref: React.RefObject<any> }> = [
            { key: 'firstName', ref: firstNameRef },
            { key: 'lastName', ref: lastNameRef },
            { key: 'email', ref: emailRef },
            { key: 'phoneNumber', ref: phoneRef },
            { key: 'dob', ref: dobRef },
            { key: 'shortBio', ref: bioRef },
            { key: 'moveInDate', ref: moveInDateRef }
        ];

        fieldsToValidate.forEach(({ key }) => {
            const error = validateField(key, data[key]);
            if (error) {
                newErrors[key] = error;
                if (!firstErrorField) {
                    firstErrorField = key;
                }
            }
        });

        setErrors(newErrors);
        return { isValid: Object.keys(newErrors).length === 0, firstErrorField };
    };

    const handleBlur = (key: keyof FormData) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const error = validateField(key, data[key]);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleFieldChange = (key: keyof FormData, value: any) => {
        onChange(key, value);
        
        // Clear error for this field when user starts typing
        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleSubmitClick = () => {
        // Mark all required fields as touched
        const allTouched: Record<string, boolean> = {
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            dob: true,
            shortBio: true,
            moveInDate: true
        };
        setTouched(allTouched);

        // Validate all fields
        const { isValid, firstErrorField } = validateAllFields();

        if (!isValid) {
            // Focus on the first error field for accessibility
            if (firstErrorField) {
                const refMap: Record<string, React.RefObject<any>> = {
                    firstName: firstNameRef,
                    lastName: lastNameRef,
                    email: emailRef,
                    phoneNumber: phoneRef,
                    dob: dobRef,
                    shortBio: bioRef,
                    moveInDate: moveInDateRef
                };
                
                const fieldRef = refMap[firstErrorField];
                if (fieldRef?.current) {
                    fieldRef.current.focus();
                    fieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            return; // Prevent submission
        }

        // All validation passed, call onSubmit
        onSubmit();
    };

    const isFormValid = (): boolean => {
        const requiredFields: Array<keyof FormData> = [
            'firstName', 'lastName', 'email', 'phoneNumber', 'dob', 'shortBio', 'moveInDate'
        ];
        
        return requiredFields.every(key => {
            return !validateField(key, data[key]);
        });
    };

    const getInputClass = (fieldName: string) => {
        const baseClass = "w-full p-3 rounded-xl border text-sm focus:outline-none focus:border-[#3A6D6C] bg-white";
        const errorClass = touched[fieldName] && errors[fieldName] 
            ? "border-red-500 border-2" 
            : "border-gray-200";
        return `${baseClass} ${errorClass}`;
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#2c3e50] mb-2">{title}</h2>
            <p className="text-center text-gray-600 mb-8">
                {subTitle}
            </p>

            <div className="bg-[#EEEEF0] rounded-[2rem] p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Upload Section */}
                    <div className="w-full lg:w-48 flex-shrink-0">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white rounded-xl p-4 flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 relative overflow-hidden group hover:border-[#3A6D6C] transition-colors cursor-pointer"
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
                                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-20" />
                            ) : (
                                <>
                                    <button className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm relative z-10 pointer-events-none">
                                        <Upload className="w-3 h-3" />
                                        Upload Image
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Row 1 */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">First Name *</label>
                            <input
                                ref={firstNameRef}
                                type="text"
                                placeholder="Enter First name"
                                className={getInputClass('firstName')}
                                value={data.firstName || ''}
                                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                                onBlur={() => handleBlur('firstName')}
                                aria-invalid={touched.firstName && !!errors.firstName}
                                aria-describedby={touched.firstName && errors.firstName ? 'firstName-error' : undefined}
                            />
                            {touched.firstName && errors.firstName && (
                                <span id="firstName-error" className="text-red-500 text-xs mt-1" role="alert">
                                    {errors.firstName}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Middle Name</label>
                            <input
                                type="text"
                                placeholder="Enter Middle name"
                                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#3A6D6C] bg-white"
                                value={data.middleName || ''}
                                onChange={(e) => onChange('middleName', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Last Name *</label>
                            <input
                                ref={lastNameRef}
                                type="text"
                                placeholder="Enter Last name"
                                className={getInputClass('lastName')}
                                value={data.lastName || ''}
                                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                                onBlur={() => handleBlur('lastName')}
                                aria-invalid={touched.lastName && !!errors.lastName}
                                aria-describedby={touched.lastName && errors.lastName ? 'lastName-error' : undefined}
                            />
                            {touched.lastName && errors.lastName && (
                                <span id="lastName-error" className="text-red-500 text-xs mt-1" role="alert">
                                    {errors.lastName}
                                </span>
                            )}
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Email *</label>
                            <input
                                ref={emailRef}
                                type="email"
                                placeholder="Enter Email"
                                className={getInputClass('email')}
                                value={data.email || ''}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                aria-invalid={touched.email && !!errors.email}
                                aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                            />
                            {touched.email && errors.email && (
                                <span id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                                    {errors.email}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Phone Number *</label>
                            <div className={`flex border rounded-xl transition-all ${
                                touched.phoneNumber && errors.phoneNumber 
                                    ? 'border-red-500 border-2' 
                                    : 'border-gray-200 focus-within:ring-2 focus-within:ring-[#3A6D6C] focus-within:border-[#3A6D6C]'
                            }`}>
                                {/* Phone Code Selector */}
                                <div className="relative" ref={phoneCodeRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                                        className={`flex items-center gap-1 px-3 py-3 border-r bg-white rounded-l-xl focus:outline-none text-sm min-w-[100px] hover:bg-gray-50 transition-colors ${
                                            touched.phoneNumber && errors.phoneNumber 
                                                ? 'border-red-500' 
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <span className="text-sm font-medium">
                                            {selectedPhoneCode ? (
                                                <span className="flex items-center gap-1">
                                                    <span>{selectedPhoneCode.flag}</span>
                                                    <span className="hidden sm:inline">{selectedPhoneCode.phonecode}</span>
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">Code</span>
                                            )}
                                        </span>
                                        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isPhoneCodeOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown */}
                                    {isPhoneCodeOpen && (
                                        <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-300 rounded-xl shadow-lg z-[100] max-h-80 overflow-hidden flex flex-col">
                                            {/* Search Input */}
                                            <div className="p-2 border-b border-gray-200">
                                                <div className="relative">
                                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search country or code..."
                                                        value={phoneCodeSearch}
                                                        onChange={(e) => setPhoneCodeSearch(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] text-sm"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            {/* Options List */}
                                            <div className="overflow-y-auto max-h-64">
                                                {filteredPhoneCodes.length > 0 ? (
                                                    filteredPhoneCodes.map((code) => (
                                                        <button
                                                            key={code.value}
                                                            type="button"
                                                            onClick={() => {
                                                                onChange('phoneCountryCode', code.value);
                                                                setIsPhoneCodeOpen(false);
                                                                setPhoneCodeSearch('');
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3A6D6C]/10 transition-colors text-left ${
                                                                data.phoneCountryCode === code.value ? 'bg-[#3A6D6C]/10' : ''
                                                            }`}
                                                        >
                                                            <span className="text-xl">{code.flag}</span>
                                                            <span className="flex-1 text-sm font-medium text-gray-900">{code.name}</span>
                                                            <span className="text-sm text-gray-600">{code.phonecode}</span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                        No countries found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Phone Number Input */}
                                <input
                                    ref={phoneRef}
                                    type="tel"
                                    placeholder="Enter Phone Number"
                                    className="flex-1 min-w-0 px-4 py-3 rounded-r-xl focus:outline-none text-sm placeholder-gray-400 bg-white border-0"
                                    value={data.phoneNumber || ''}
                                    onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                                    onBlur={() => handleBlur('phoneNumber')}
                                    aria-invalid={touched.phoneNumber && !!errors.phoneNumber}
                                    aria-describedby={touched.phoneNumber && errors.phoneNumber ? 'phoneNumber-error' : undefined}
                                />
                            </div>
                            {touched.phoneNumber && errors.phoneNumber && (
                                <span id="phoneNumber-error" className="text-red-500 text-xs mt-1" role="alert">
                                    {errors.phoneNumber}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Date of birth*</label>
                            <div ref={dobRef} tabIndex={-1}>
                                <DatePicker
                                    value={data.dob}
                                    onChange={(date) => {
                                        handleFieldChange('dob', date);
                                        if (!touched.dob) {
                                            handleBlur('dob');
                                        }
                                    }}
                                    placeholder="DD/MM/YYYY"
                                    className={getInputClass('dob')}
                                />
                            </div>
                            {touched.dob && errors.dob && (
                                <span id="dob-error" className="text-red-500 text-xs mt-1" role="alert">
                                    {errors.dob}
                                </span>
                            )}
                        </div>

                        {/* Row 3 - Spanning cols for Bio */}
                        <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                            <label className="text-sm font-semibold text-[#2c3e50]">Short Bio*</label>
                            <input
                                ref={bioRef}
                                type="text"
                                placeholder="Add some Details"
                                className={getInputClass('shortBio')}
                                value={data.shortBio || ''}
                                onChange={(e) => handleFieldChange('shortBio', e.target.value)}
                                onBlur={() => handleBlur('shortBio')}
                                aria-invalid={touched.shortBio && !!errors.shortBio}
                                aria-describedby={touched.shortBio && errors.shortBio ? 'shortBio-error' : undefined}
                            />
                            {touched.shortBio && errors.shortBio && (
                                <span id="shortBio-error" className="text-red-500 text-xs mt-1" role="alert">
                                    {errors.shortBio}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Preferred move in Date *</label>
                            <div ref={moveInDateRef} tabIndex={-1}>
                                <DatePicker
                                    value={data.moveInDate}
                                    onChange={(date) => {
                                        handleFieldChange('moveInDate', date);
                                        if (!touched.moveInDate) {
                                            handleBlur('moveInDate');
                                        }
                                    }}
                                    placeholder="DD/MM/YYYY"
                                    className={getInputClass('moveInDate')}
                                />
                            </div>
                            {touched.moveInDate && errors.moveInDate && (
                                <span id="moveInDate-error" className="text-red-500 text-xs mt-1" role="alert">
                                    {errors.moveInDate}
                                </span>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Image Crop Modal */}
            {isCropModalOpen && imageToCrop && (
                <ImageCropModal
                    image={imageToCrop}
                    onClose={() => {
                        setIsCropModalOpen(false);
                        setImageToCrop(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    }}
                    onCropComplete={handleCropComplete}
                    aspectRatio={1}
                    circularCrop={false}
                    containerSize={256}
                />
            )}

            <div className="flex justify-center gap-4 mt-8">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="bg-white text-gray-600 border border-gray-300 px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                )}
                <button
                    onClick={handleSubmitClick}
                    disabled={!isFormValid()}
                    className={`px-8 py-3 rounded-lg text-sm font-medium transition-colors shadow-md ${
                        isFormValid()
                            ? 'bg-[#3A6D6C] text-white hover:bg-[#2c5251] cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    aria-label={submitLabel}
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
};

export default ApplicantForm;
