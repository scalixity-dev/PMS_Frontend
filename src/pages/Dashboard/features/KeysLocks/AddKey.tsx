import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Upload, Edit, Trash2 } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';
import { keysData } from './KeysLocks';

const AddKey = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // Find key data if in edit mode
    const keyItem = id ? keysData.find(k => k.id === Number(id)) : null;

    const [keyName, setKeyName] = useState(keyItem?.name || '');
    const [keyType, setKeyType] = useState(keyItem?.type || '');
    const [property, setProperty] = useState(keyItem?.property || '');
    const [details, setDetails] = useState(keyItem?.keyDescription || '');
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageUrlRef = useRef<string | null>(null);

    // Cleanup blob URL on component unmount
    useEffect(() => {
        return () => {
            if (imageUrlRef.current) {
                URL.revokeObjectURL(imageUrlRef.current);
            }
        };
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Revoke the previous blob URL to free up memory
            if (imageUrlRef.current) {
                URL.revokeObjectURL(imageUrlRef.current);
            }
            // Create and store the new blob URL
            const imageUrl = URL.createObjectURL(file);
            imageUrlRef.current = imageUrl;
            setImage(imageUrl);
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
        { value: 'Storage', label: 'Storage' },
        { value: 'Gate', label: 'Gate' },
    ];

    const propertyOptions = [
        { value: 'Luxury Property', label: 'Luxury Property' },
        { value: 'Abc Property', label: 'Abc Property' },
        { value: 'Avasa Dept.', label: 'Avasa Dept.' },
        { value: 'C1 Apartment', label: 'C1 Apartment' },
    ];

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
                            <img src={image} alt="Key Preview" className="w-full h-full object-contain relative z-10" />
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
                        <CustomDropdown
                            label="Property"
                            value={property}
                            onChange={setProperty}
                            options={propertyOptions}
                            placeholder="Select Property"
                            buttonClassName="bg-white border-none rounded-lg py-3 px-4 h-[46px] shadow-sm"
                            required={true}
                            textClassName="font-medium text-sm text-gray-700"
                        />
                    </div>
                </div>

                {/* Details Textarea */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-600 mb-2">
                        Property*
                    </label>
                    {/* Small correction: The screenshot shows 'Property*' label above the Property dropdown. 
                             I used CustomDropdown's internal label.
                             For the textarea below, it just has placeholder? Or label?
                             Screenshot shows "Type Details here.." inside the box. No external label visible in the crop?
                             Wait, looking closer at crop. "Type Details here.." is inside.
                             There is no external label for the large box.
                         */}
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
                        className="bg-white text-black px-10 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors border border-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => navigate(-1)} // Mock continue
                        className="bg-[#3A6D6C] text-white px-10 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-[#2c5251] transition-colors"
                    >
                        {isEditMode ? 'Update' : 'Continue'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddKey;
