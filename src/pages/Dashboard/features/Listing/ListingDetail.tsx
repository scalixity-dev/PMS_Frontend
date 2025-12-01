import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    SquarePen,
    Check,
    PlayCircle,
    X,
    Plus,
} from 'lucide-react';
import { parse, format } from 'date-fns';
import SelectionModal from './components/SelectionModal';
import CustomDropdown from '../../components/CustomDropdown';
import DatePicker from '../../../../components/ui/DatePicker';

const ListingDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('listing');

    // Mock data based on the screenshot
    const listing = {
        id: id,
        name: 'Luxury Apartment',
        address: '78 Scheme No 78 - II, Indore, MP 452010, IN',
        price: 12000.00,
        expiryDate: '29 Dec, 2025',
        status: 'Listed',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80',
        unitDetails: {
            type: 'Single-Family',
            bedrooms: 1,
            size: '1200 sq ft',
            bathrooms: 0.5,
            yearBuilt: 2025
        },
        basicAmenities: ['Parking', 'Driveway', 'Laundry', 'On-site', 'Air conditioning', 'Central air'],
        onlineApplications: true,
        postingEnabled: true,
        leaseTerms: {
            dateAvailable: '12 Nov, 2025',
            securityDeposit: 5000.00,
            monthlyRent: 12000.00,
            amountRefundable: 12563,
            leaseDuration: 'Monthly',
            monthToMonth: 'No',
            details: '-'
        },
        media: {
            gallery: [
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1384&q=80'
            ],
            video: [
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1384&q=80'
            ]
        },
        promotions: {
            description: 'A perfect blend of comfort and convenience, this rental offers modern interiors, ample natural light, and a peaceful ambiance. Located close to key amenities, it ensures effortless living with style, making it an ideal choice for those seeking quality and value.'
        },
        features: ['Renovated', 'Furnished'],
        amenities: ['Basketball court', 'Business Court'],
        contact: {
            name: 'Shawn James',
            phone: '+91 78545 21026',
            email: 'james33434@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
        }
    };

    const [isGalleryEditing, setIsGalleryEditing] = useState(false);
    const [isVideoEditing, setIsVideoEditing] = useState(false);
    const [galleryImages, setGalleryImages] = useState(listing.media.gallery);
    const [videoItems, setVideoItems] = useState(listing.media.video);

    const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
    const [isRibbonEditing, setIsRibbonEditing] = useState(false);
    const [promotionDescription, setPromotionDescription] = useState(listing.promotions.description);
    const [promotionRibbon, setPromotionRibbon] = useState(listing.name);

    const [isLeaseTermsEditing, setIsLeaseTermsEditing] = useState(false);
    const [leaseTerms, setLeaseTerms] = useState(listing.leaseTerms);

    const [features, setFeatures] = useState(listing.features);
    const [amenities, setAmenities] = useState(listing.amenities);
    const [activeModal, setActiveModal] = useState<'features' | 'amenities' | null>(null);

    const [isContactEditing, setIsContactEditing] = useState(false);
    const [contactDetails, setContactDetails] = useState(listing.contact);

    const availableFeatures = ['Renovated', 'Furnished', 'Hardwood Floor', 'Fire place', 'Internet', 'Carpet', 'Storage', 'Balcony', 'Garden'];
    const availableAmenities = ['Basketball court', 'Business Court', 'Swimming Pool', 'Gym', 'Tennis Court', 'Clubhouse', 'Playground'];

    const galleryInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleDeleteGalleryImage = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteVideoItem = (index: number) => {
        setVideoItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryImages(prev => [reader.result as string, ...prev]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoItems(prev => [reader.result as string, ...prev]);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/portfolio/listing')}>Listings</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">#{id}</span>
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-6 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">#{id}</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-[#467676] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#3A6D6C] transition-colors">
                            List
                        </button>
                        <button className="bg-[#467676] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#3A6D6C] transition-colors">
                            Invite to apply
                        </button>
                        <button className="bg-[#467676] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#3A6D6C] transition-colors">
                            Share
                        </button>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{listing.name}</h2>
                            <div
                                className="bg-[#E3EBDE] font-medium px-4 py-1 rounded-full inline-block mt-2"
                                style={{ boxShadow: 'inset 2.49px 2.49px 0px 0px rgba(83, 83, 83, 0.25)' }}
                            >
                                <span className="text-gray-600 text-sm">{listing.address}</span>
                            </div>
                        </div>
                        <span className="bg-[#82D64D] text-white px-4 py-1 rounded-full text-sm font-bold">
                            {listing.status}
                        </span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Image & Price */}
                        <div className="flex gap-4">
                            <img
                                src={listing.image}
                                alt={listing.name}
                                className="w-44 h-44 rounded-2xl object-cover"
                            />
                            <div className="bg-[#3A6D6C] text-white p-4 rounded-2xl flex flex-col self-center h-fit min-w-[180px]">
                                <span className="text-xl font-bold">₹{listing.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                <span className="text-xs opacity-80">Monthly rent</span>
                                <span className="text-[10px] opacity-60 mt-1">Listing expires on {listing.expiryDate}</span>
                            </div>
                        </div>

                        {/* Unit Details */}
                        <div className="bg-[#82D64D] p-4 rounded-2xl flex-1 text-white">
                            <h3 className="text-sm font-bold mb-3">Unit details</h3>
                            <div className="flex flex-wrap gap-2">
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="text-xs">Unit type</span>
                                    <span className="bg-white text-[#82D64D] px-2 py-0.5 rounded-full text-xs font-bold">{listing.unitDetails.type}</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="text-xs">Bedrooms</span>
                                    <span className="bg-white text-[#82D64D] px-2 py-0.5 rounded-full text-xs font-bold">{listing.unitDetails.bedrooms}</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="text-xs">Size</span>
                                    <span className="bg-white text-[#82D64D] px-2 py-0.5 rounded-full text-xs font-bold">{listing.unitDetails.size}</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="text-xs">Bathrooms</span>
                                    <span className="bg-white text-[#82D64D] px-2 py-0.5 rounded-full text-xs font-bold">{listing.unitDetails.bathrooms}</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="text-xs">Year built</span>
                                    <span className="bg-white text-[#82D64D] px-2 py-0.5 rounded-full text-xs font-bold">{listing.unitDetails.yearBuilt}</span>
                                </div>
                            </div>
                        </div>

                        {/* Basic Amenities */}
                        <div className="bg-[#82D64D] p-4 rounded-2xl flex-1 text-white">
                            <h3 className="text-sm font-bold mb-3">Basic amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {listing.basicAmenities.map((amenity, index) => (
                                    <span key={index} className="bg-white text-[#82D64D] px-3 py-1 rounded-full text-xs font-bold">
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full lg:w-2/3">
                    <div className="bg-[#82D64D] rounded-full p-6 flex items-center justify-between text-white relative overflow-hidden">
                        <div className="z-10 grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 items-center">
                            <h3 className="font-bold">Accept online applications</h3>
                            <div className="flex items-center gap-3">
                                <span className="bg-[#3A6D6C] px-3 py-1 border border-white rounded-full text-xs">Enabled</span>
                                <SquarePen className="w-4 h-4" />
                            </div>

                            <button className="bg-white text-[#82D64D] px-4 py-1.5 rounded-full text-xs font-bold w-fit">No</button>
                            <button className="bg-gradient-to-r from-[#3A4E33] to-[#85B474] text-white px-4 py-1.5 border border-white text-xs font-medium w-fit">
                                Application fee
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#82D64D] rounded-full p-6 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold">Posting to Listing website</h3>
                            <span className="bg-[#3A6D6C] px-3 py-1 border border-white rounded-full text-xs">Enabled</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-[#F6F6F8] py-4 px-2 rounded-full w-full flex justify-center items-center gap-4 shadow-sm">
                        {['Listing', 'Statistics'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`px-10 py-3 rounded-full text-sm font-bold transition-all ${activeTab === tab.toLowerCase()
                                    ? 'bg-[#82D64D] text-white shadow-md'
                                    : 'bg-[#E0E0E0] text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'listing' && (
                    <>

                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Lease terms</h3>
                                <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                            </div>
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6 relative">
                                <button
                                    onClick={() => setIsLeaseTermsEditing(!isLeaseTermsEditing)}
                                    className={`absolute top-6 right-6 ${isLeaseTermsEditing ? 'bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 z-10' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {isLeaseTermsEditing ? (
                                        <>Done <Check className="w-4 h-4" /></>
                                    ) : (
                                        <SquarePen className="w-5 h-5" />
                                    )}
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Date available</span>
                                            {isLeaseTermsEditing ? (
                                                <div className="w-1/2">
                                                    <DatePicker
                                                        value={leaseTerms.dateAvailable ? parse(leaseTerms.dateAvailable, 'dd MMM, yyyy', new Date()) : undefined}
                                                        onChange={(date: Date | undefined) => setLeaseTerms({ ...leaseTerms, dateAvailable: date ? format(date, 'dd MMM, yyyy') : '' })}
                                                        placeholder="Select date"
                                                        className="text-xs font-bold text-gray-800 bg-transparent text-right focus:outline-none border-b border-gray-400 w-full rounded-none shadow-none px-0 py-1 justify-end focus:ring-0"
                                                        popoverClassName="w-[280px] right-0"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{leaseTerms.dateAvailable}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Monthly rent</span>
                                            {isLeaseTermsEditing ? (
                                                <input
                                                    type="number"
                                                    value={leaseTerms.monthlyRent}
                                                    onChange={(e) => setLeaseTerms({ ...leaseTerms, monthlyRent: parseFloat(e.target.value) || 0 })}
                                                    className="text-xs font-bold text-gray-800 mr-2 bg-transparent text-right focus:outline-none border-b border-gray-400 w-1/2"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{leaseTerms.monthlyRent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Lease duration</span>
                                            {isLeaseTermsEditing ? (
                                                <div className="w-1/2">
                                                    <CustomDropdown
                                                        value={leaseTerms.leaseDuration}
                                                        onChange={(value) => setLeaseTerms({ ...leaseTerms, leaseDuration: value })}
                                                        options={[
                                                            { value: 'Monthly', label: 'Monthly' },
                                                            { value: 'Annually', label: 'Annually' }
                                                        ]}
                                                        placeholder="Select"
                                                        buttonClassName="!py-1 !px-2 !border-0 !bg-transparent !text-right justify-end"
                                                        textClassName="!text-xs !font-bold !text-gray-800"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{leaseTerms.leaseDuration}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Security deposit</span>
                                            {isLeaseTermsEditing ? (
                                                <input
                                                    type="number"
                                                    value={leaseTerms.securityDeposit}
                                                    onChange={(e) => setLeaseTerms({ ...leaseTerms, securityDeposit: parseFloat(e.target.value) || 0 })}
                                                    className="text-xs font-bold text-gray-800 mr-2 bg-transparent text-right focus:outline-none border-b border-gray-400 w-1/2"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">₹{leaseTerms.securityDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Amount refundable</span>
                                            {isLeaseTermsEditing ? (
                                                <input
                                                    type="number"
                                                    value={leaseTerms.amountRefundable}
                                                    onChange={(e) => setLeaseTerms({ ...leaseTerms, amountRefundable: parseFloat(e.target.value) || 0 })}
                                                    className="text-xs font-bold text-gray-800 mr-2 bg-transparent text-right focus:outline-none border-b border-gray-400 w-1/2"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{leaseTerms.amountRefundable}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Month-to-month</span>
                                            {isLeaseTermsEditing ? (
                                                <div className="w-1/2">
                                                    <CustomDropdown
                                                        value={leaseTerms.monthToMonth}
                                                        onChange={(value) => setLeaseTerms({ ...leaseTerms, monthToMonth: value })}
                                                        options={[
                                                            { value: 'Yes', label: 'Yes' },
                                                            { value: 'No', label: 'No' }
                                                        ]}
                                                        placeholder="Select"
                                                        buttonClassName="!py-1 !px-2 !border-0 !bg-transparent !text-right justify-end"
                                                        textClassName="!text-xs !font-bold !text-gray-800"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{leaseTerms.monthToMonth}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-[#E3EBDE] mr-8 rounded-2xl p-4 shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                        <span className="text-xs font-medium text-gray-600 block mb-2">Details</span>
                                        {isLeaseTermsEditing ? (
                                            <textarea
                                                value={leaseTerms.details}
                                                onChange={(e) => setLeaseTerms({ ...leaseTerms, details: e.target.value })}
                                                className="text-sm text-gray-800 w-full bg-transparent focus:outline-none border-b border-gray-400 min-h-[60px]"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-800">{leaseTerms.details}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Media</h3>
                                <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                            </div>

                            {/* Gallery */}
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6 mb-4">
                                <div className="flex gap-4 mb-4">
                                    <span className="bg-[#82D64D] text-white px-6 py-1.5 rounded-full text-xs font-bold">Gallery</span>
                                    <button
                                        onClick={() => setIsGalleryEditing(!isGalleryEditing)}
                                        className={`${isGalleryEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors`}
                                    >
                                        {isGalleryEditing ? 'Done' : 'Edit'} <SquarePen className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className={`${isGalleryEditing ? 'flex overflow-x-auto gap-4 pb-2' : 'grid grid-cols-4 gap-4'}`}>
                                    <input
                                        type="file"
                                        ref={galleryInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleGalleryUpload}
                                    />
                                    {isGalleryEditing && (
                                        <div
                                            onClick={() => galleryInputRef.current?.click()}
                                            className="min-w-[150px] w-[150px] aspect-square rounded-2xl bg-[#E8E8EA] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#82D64D] flex items-center justify-center mb-2">
                                                <Plus className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">Add Image</span>
                                        </div>
                                    )}
                                    {galleryImages.map((img, idx) => (
                                        <div key={idx} className={`${isGalleryEditing ? 'min-w-[150px] w-[150px]' : ''} aspect-square rounded-2xl overflow-hidden relative group flex-shrink-0`}>
                                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                            {isGalleryEditing && (
                                                <button
                                                    onClick={() => handleDeleteGalleryImage(idx)}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-sm"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Video */}
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                                <div className="flex gap-4 mb-4">
                                    <span className="bg-[#82D64D] text-white px-6 py-1.5 rounded-full text-xs font-bold">Video</span>
                                    <button
                                        onClick={() => setIsVideoEditing(!isVideoEditing)}
                                        className={`${isVideoEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors`}
                                    >
                                        {isVideoEditing ? 'Done' : 'Edit'} <SquarePen className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className={`${isVideoEditing ? 'flex overflow-x-auto gap-4 pb-2' : 'grid grid-cols-4 gap-4'}`}>
                                    <input
                                        type="file"
                                        ref={videoInputRef}
                                        className="hidden"
                                        accept="video/*"
                                        onChange={handleVideoUpload}
                                    />
                                    {isVideoEditing && (
                                        <div
                                            onClick={() => videoInputRef.current?.click()}
                                            className="min-w-[150px] w-[150px] aspect-square rounded-2xl bg-[#E8E8EA] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#82D64D] flex items-center justify-center mb-2">
                                                <Plus className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">Add Video</span>
                                        </div>
                                    )}
                                    {videoItems.map((vid, idx) => (
                                        <div key={idx} className={`${isVideoEditing ? 'min-w-[150px] w-[150px]' : ''} aspect-square rounded-2xl overflow-hidden relative group cursor-pointer flex-shrink-0`}>
                                            <img src={vid} alt={`Video ${idx}`} className="w-full h-full object-cover" />
                                            <div className={`absolute inset-0 bg-black/20 flex items-center justify-center ${isGalleryEditing ? '' : 'group-hover:bg-black/30'} transition-colors`}>
                                                {!isVideoEditing && <PlayCircle className="w-10 h-10 text-white opacity-80 group-hover:opacity-100" />}
                                            </div>
                                            {isVideoEditing && (
                                                <button
                                                    onClick={() => handleDeleteVideoItem(idx)}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-sm z-10"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Promotions */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Promotions</h3>
                                <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => setIsDescriptionEditing(!isDescriptionEditing)}
                                        className={`${isDescriptionEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors`}
                                    >
                                        {isDescriptionEditing ? 'Done' : 'Edit description'} <SquarePen className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => setIsRibbonEditing(!isRibbonEditing)}
                                        className={`${isRibbonEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors`}
                                    >
                                        {isRibbonEditing ? 'Done' : 'Edit ribbon'} <SquarePen className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6 flex gap-6">
                                <img src={listing.image} alt="Promotion" className="w-32 h-32 rounded-2xl object-cover" />
                                <div className="flex-1">
                                    {isRibbonEditing ? (
                                        <input
                                            type="text"
                                            value={promotionRibbon}
                                            onChange={(e) => setPromotionRibbon(e.target.value)}
                                            className="font-bold text-gray-800 mb-2 w-full bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#82D64D]"
                                        />
                                    ) : (
                                        <h4 className="font-bold text-gray-800 mb-2">{promotionRibbon}</h4>
                                    )}

                                    {isDescriptionEditing ? (
                                        <textarea
                                            value={promotionDescription}
                                            onChange={(e) => setPromotionDescription(e.target.value)}
                                            className="text-sm text-gray-600 leading-relaxed w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#82D64D] min-h-[100px]"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600 leading-relaxed">{promotionDescription}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Property Features */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Property features</h3>
                                <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                            </div>

                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6 mb-4">
                                <div className="flex gap-4 mb-4">
                                    <span className="bg-[#82D64D] text-white px-6 py-1.5 rounded-full text-xs font-bold">Features</span>
                                    <button
                                        onClick={() => setActiveModal('features')}
                                        className="bg-[#888888] text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2"
                                    >
                                        Edit <SquarePen className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {features.map((feature, idx) => (
                                        <span key={idx} className="bg-[#E8E8EA] text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                                <div className="flex gap-4 mb-4">
                                    <span className="bg-[#82D64D] text-white px-6 py-1.5 rounded-full text-xs font-bold">Amenities</span>
                                    <button
                                        onClick={() => setActiveModal('amenities')}
                                        className="bg-[#888888] text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2"
                                    >
                                        Edit <SquarePen className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {amenities.map((amenity, idx) => (
                                        <span key={idx} className="bg-[#E8E8EA] text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <SelectionModal
                            isOpen={activeModal === 'features'}
                            onClose={() => setActiveModal(null)}
                            onSave={(selected) => {
                                setFeatures(selected);
                                setActiveModal(null);
                            }}
                            title="Property features"
                            subtitle="Select the property features below."
                            options={availableFeatures}
                            initialSelected={features}
                        />

                        <SelectionModal
                            isOpen={activeModal === 'amenities'}
                            onClose={() => setActiveModal(null)}
                            onSave={(selected) => {
                                setAmenities(selected);
                                setActiveModal(null);
                            }}
                            title="Amenities"
                            subtitle="Select the amenities below."
                            options={availableAmenities}
                            initialSelected={amenities}
                        />

                        {/* Listing Contact */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Listing contact</h3>
                                <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                            </div>
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                                <div className="flex items-center gap-4">
                                    <img src={contactDetails.avatar} alt={contactDetails.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#E8E8EA] px-4 py-2 rounded-full flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-500">Name</span>
                                            {isContactEditing ? (
                                                <input
                                                    type="text"
                                                    value={contactDetails.name}
                                                    onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                                                    className="text-sm font-bold text-gray-800 bg-transparent focus:outline-none border-b border-gray-400 w-full"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-gray-800">{contactDetails.name}</span>
                                            )}
                                        </div>
                                        <div className="bg-[#E8E8EA] px-4 py-2 rounded-full flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-500">Phone</span>
                                            {isContactEditing ? (
                                                <input
                                                    type="text"
                                                    value={contactDetails.phone}
                                                    onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
                                                    className="text-sm font-bold text-gray-800 bg-transparent focus:outline-none border-b border-gray-400 w-full"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-gray-800">{contactDetails.phone}</span>
                                            )}
                                        </div>
                                        <div className="bg-[#E8E8EA] px-4 py-2 rounded-full flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-500">Email</span>
                                            {isContactEditing ? (
                                                <input
                                                    type="text"
                                                    value={contactDetails.email}
                                                    onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                                                    className="text-sm font-bold text-gray-800 bg-transparent focus:outline-none border-b border-gray-400 w-full"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-gray-800">{contactDetails.email}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsContactEditing(!isContactEditing)}
                                        className={`${isContactEditing ? 'bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {isContactEditing ? (
                                            <>Done <Check className="w-4 h-4" /></>
                                        ) : (
                                            <SquarePen className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ListingDetail;
