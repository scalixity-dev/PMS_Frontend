import React from 'react';
import { Upload } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';

interface FormData {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
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
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

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
            onChange('photo', e.target.files[0]);
        }
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
                                type="text"
                                placeholder="Enter First name"
                                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#3A6D6C] bg-white"
                                value={data.firstName || ''}
                                onChange={(e) => onChange('firstName', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Middle Name *</label>
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
                                type="text"
                                placeholder="Enter Last name"
                                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#3A6D6C] bg-white"
                                value={data.lastName || ''}
                                onChange={(e) => onChange('lastName', e.target.value)}
                            />
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Email *</label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#3A6D6C] bg-white"
                                value={data.email || ''}
                                onChange={(e) => onChange('email', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Phone Number *</label>
                            <input
                                type="tel"
                                placeholder="Enter Phone Number"
                                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#3A6D6C] bg-white"
                                value={data.phoneNumber || ''}
                                onChange={(e) => onChange('phoneNumber', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Date of birth*</label>
                            <DatePicker
                                value={data.dob}
                                onChange={(date) => onChange('dob', date)}
                                placeholder="DD/MM/YYYY"
                                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:ring-0 focus:border-[#3A6D6C] bg-white shadow-none"
                            />
                        </div>

                        {/* Row 3 - Spanning cols for Bio */}
                        <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                            <label className="text-sm font-semibold text-[#2c3e50]">Short Bio*</label>
                            <input
                                type="text"
                                placeholder="Add some Details"
                                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#3A6D6C] bg-white"
                                value={data.shortBio || ''}
                                onChange={(e) => onChange('shortBio', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[#2c3e50]">Preffered move in Date *</label>
                            <DatePicker
                                value={data.moveInDate}
                                onChange={(date) => onChange('moveInDate', date)}
                                placeholder="DD/MM/YYYY"
                                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:ring-0 focus:border-[#3A6D6C] bg-white shadow-none"
                            />
                        </div>

                    </div>
                </div>
            </div>

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
                    onClick={onSubmit}
                    className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-md"
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
};

export default ApplicantForm;
