import React, { useState } from "react";
import {
    BedDouble,
    Bath,
    Building2,
    Ruler,
    Shirt,
    AirVent,
    ParkingSquare,
    Dog,
    Phone,
    Mail,
    Send,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import type { PropertyFeature } from "../../utils/types";

// --- Types ---
interface PropertyData {
    id: string;
    title: string;
    address: string;
    availabilityDate: string;
    rent: number;
    currency: string;
    images: string[];
    discount: string;
    description: string;
    features: PropertyFeature[];
    detailedFeatures: { label: string; selected: boolean }[];
    amenities: { label: string; selected: boolean }[];
    leaseTerms: { label: string; value: string; selected?: boolean }[];
    policies: { label: string; value: string }[];
    policyDescription: string;
    agent: {
        name: string;
        phone: string;
        email: string;
    };
}


// --- Internal Components ---

const ImageGalleryModal: React.FC<{
    images: string[];
    onClose: () => void;
    initialIndex: number;
    title: string;
    rent: string;
}> = ({ images, onClose, initialIndex, title, rent }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Prevent body scroll when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 z-40 bg-black/10 lg:left-[var(--sidebar-width)] transition-all duration-300">


            <div className="w-full flex justify-center mt-6 lg:mt-20 px-10 p-10 transition-all duration-300">
                <div className="bg-white w-full max-w-7xl max-h-[calc(100vh-160px)] rounded-xl shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
                        <h3 className="text-lg font-bold text-gray-800">Property Images</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-1 overflow-hidden min-h-0">
                        {/* Main Image Area */}
                        <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center relative p-2 lg:p-4 overflow-hidden group">
                            <button
                                onClick={prevImage}
                                className="absolute left-4 p-2 rounded-full bg-white shadow-md text-gray-700 hover:text-black transition-all border border-gray-100 opacity-0 group-hover:opacity-100 z-10"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <img
                                src={images[currentIndex]}
                                alt={`Gallery ${currentIndex + 1}`}
                                className="max-w-full max-h-full object-contain drop-shadow-sm"
                            />

                            <button
                                onClick={nextImage}
                                className="absolute right-4 p-2 rounded-full bg-white shadow-md text-gray-700 hover:text-black transition-all border border-gray-100 opacity-0 group-hover:opacity-100 z-10"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* Sidebar: Details & Thumbnails */}
                        <div className="w-80 lg:w-96 bg-white border-l border-gray-100 flex flex-col h-full">
                            {/* Fixed Details Section */}
                            <div className="p-4 border-b border-gray-100 flex-shrink-0">
                                <h2 className="text-xl font-bold text-[var(--dashboard-text-main)] mb-1 leading-tight">{title}</h2>
                                <p className="text-[var(--dashboard-accent)] font-semibold text-lg">{rent}</p>
                                <p className="text-sm text-gray-500 mt-2">All Details</p>
                            </div>

                            {/* Scrollable Thumbnails Section */}
                            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar min-h-0">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">All Images ({images.length})</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${idx === currentIndex
                                                ? "border-[var(--dashboard-accent)] ring-1 ring-[var(--dashboard-accent)] shadow-sm"
                                                : "border-transparent hover:border-gray-200"
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ImageGallery: React.FC<{
    images: string[];
    discount?: string;
    title: string;
    rent: string;
}> = ({ images, discount, title, rent }) => {
    const [showModal, setShowModal] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);

    const mainImage = images[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800";
    const sideImages = images.slice(1, 4);
    const remainingCount = images.length > 5 ? images.length - 5 : 0;

    const openModal = (index: number) => {
        setInitialIndex(index);
        setShowModal(true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div
                className="relative rounded-[var(--radius-lg)] overflow-hidden aspect-[3/2] h-full cursor-pointer group"
                onClick={() => openModal(0)}
            >
                <img src={mainImage} alt="Main" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                {discount && (
                    <div className="absolute bottom-6 left-6 bg-[var(--dashboard-accent)] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm">
                        {discount}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {sideImages.map((img, idx) => (
                    <div
                        key={idx}
                        className="rounded-[var(--radius-lg)] overflow-hidden aspect-[3/2] cursor-pointer group relative"
                        onClick={() => openModal(idx + 1)}
                    >
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                ))}
                {images[4] && (
                    <div
                        className="relative rounded-[var(--radius-lg)] overflow-hidden aspect-[3/2] cursor-pointer group"
                        onClick={() => openModal(4)}
                    >
                        <img src={images[4]} alt="Gallery 4" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        {remainingCount > 0 && (
                            <div className="absolute bottom-2 right-2 bg-[var(--dashboard-accent)] text-white px-3 py-1 rounded-md text-xs font-bold shadow-sm z-10 hover:bg-[var(--dashboard-accent)]/90 transition-colors">
                                +{remainingCount} Images
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showModal && (
                <ImageGalleryModal
                    images={images}
                    onClose={() => setShowModal(false)}
                    initialIndex={initialIndex}
                    title={title}
                    rent={rent}
                />
            )}
        </div>
    );
};

const FeaturesGrid: React.FC<{ features: PropertyFeature[] }> = ({ features }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 bg-white border border-gray-100 rounded-[1rem] overflow-hidden mb-12 shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.2)]">
        {features.map((feature, index) => (
            <div
                key={index}
                className={`flex items-center gap-4 p-6 sm:p-7 border-gray-100 
                    ${index < 4 ? 'sm:border-b' : ''} 
                    ${index < 6 ? 'max-sm:border-b' : ''}
                    ${(index + 1) % 4 !== 0 ? 'sm:border-r' : ''}
                    ${(index + 1) % 2 !== 0 ? 'max-sm:border-r' : ''}
                `}
            >
                <div className="w-12 h-12 rounded-full bg-[var(--dashboard-accent)] flex items-center justify-center text-white flex-shrink-0">
                    {React.isValidElement(feature.icon)
                        ? React.cloneElement(feature.icon as React.ReactElement<{ size?: number }>, { size: 22 })
                        : feature.icon}
                </div>
                <div>
                    <p className="text-[16px] font-semibold text-[#1A1A1A] leading-tight mb-0.5">{feature.label}</p>
                    <p className="text-[14px] text-[#4B5563] font-medium leading-tight">{feature.value}</p>
                </div>
            </div>
        ))}
    </div>
);

const PropertyDetailUser: React.FC = () => {
    const [activeBottomTab, setActiveBottomTab] = useState("Description");

    const PROPERTY_DATA: PropertyData = {
        id: "1",
        title: "2 Bedroom Available",
        address: "3042 Washington Blvd, Ogden, UT, 84401, us",
        availabilityDate: "06 Dec, 2025",
        rent: 1424,
        currency: "$",
        images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            // Simulating 20+ images
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
        ],
        discount: "$500 off move in!",
        description: "Large 2 bedroom apartment available! WD included, off street parking, controlled access, and great location near downtown! If you are looking for a luxuriously modern apartment home conveniently located in Ogden, look no further than The Carlo on Washington! Your new living space features great community amenities, stylish interiors, and amazing views of the beautiful mountain landscape and downtown area. In addition to rent is required monthly fees: Internet: $85 Parking: $20 Tax: $11 Valet Trash: $15 Renters Insurance: $15",
        features: [
            { icon: <BedDouble />, label: "Bedrooms", value: "2" },
            { icon: <Bath />, label: "Bathrooms", value: "1" },
            { icon: <Ruler />, label: "Size", value: "834 sq.ft" },
            { icon: <Building2 />, label: "Built", value: "2021" },
            { icon: <ParkingSquare />, label: "Parking", value: "Dedicated Slot" },
            { icon: <Shirt />, label: "Laundry", value: "In-unit" },
            { icon: <AirVent />, label: "A.C", value: "Central air" },
            { icon: <Dog />, label: "Pets", value: "Yes" },
        ],
        detailedFeatures: [
            { label: "Dishwasher", selected: false },
            { label: "Hardwood floors", selected: true },
            { label: "Internet", selected: false },
            { label: "Carpet", selected: false },
            { label: "Unfurnished", selected: false },
            { label: "Renovated", selected: true },
            { label: "Beautifully designed floor plans", selected: true },
        ],
        amenities: [
            { label: "Dishwasher", selected: false },
            { label: "Hardwood floors", selected: true },
            { label: "Internet", selected: false },
            { label: "Carpet", selected: false },
            { label: "Unfurnished", selected: false },
        ],
        leaseTerms: [
            { label: "Lease Duration", value: "6 Months - 12 Months" },
            { label: "Security deposit", value: "300.00" },
            { label: "Amount Refundable", value: "300.00" },
            { label: "Month-to-month", value: "Yes", selected: true },
            { label: "Application fee", value: "45.00" },
            { label: "Screening", value: "Yes" },
        ],
        policies: [
            { label: "Cat", value: "Ok" },
            { label: "Small dog", value: "Yes" },
            { label: "Pet Deposit", value: "300.00" },
            { label: "Pet Fee", value: "40.00" },
        ],
        policyDescription: "We allow pets up to 60lbs. Pet deposit is $200 and non refundable pet fee is $200 with $40 per month in pet rent.",
        agent: {
            name: "Carlo at Washington",
            phone: "(305) 651-2820",
            email: "carlo@gmail.com"
        }

    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] p-6 lg:p-10 relative">
            <nav aria-label="Breadcrumb" className="mb-10">
                <ol className="flex items-center gap-2 text-base font-medium">
                    <li>
                        <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                    <li>
                        <Link to="/userdashboard/properties" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Properties</Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                    <li className="text-[#1A1A1A]  font-medium" aria-current="page">Property Details</li>
                </ol>
            </nav>

            <ImageGallery
                images={PROPERTY_DATA.images}
                discount={PROPERTY_DATA.discount}
                title={PROPERTY_DATA.title}
                rent={`${PROPERTY_DATA.currency}${PROPERTY_DATA.rent}`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-[var(--dashboard-text-main)] mb-2">{PROPERTY_DATA.title}</h1>
                        <p className="text-[#4B5563] text-xl flex items-center gap-2 font-light leading-relaxed">{PROPERTY_DATA.address}</p>
                    </div>

                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <p className="text-2xl font-medium text-[var(--dashboard-text-main)]">{PROPERTY_DATA.availabilityDate}</p>
                            <p className="text-[#4B5563] font-normal">Availability</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-medium text-[var(--dashboard-text-main)]">
                                {PROPERTY_DATA.currency}{PROPERTY_DATA.rent} <span className="text-gray-500 text-xl font-normal">month</span>
                            </p>
                            <p className="text-[#4B5563] font-normal">Rent</p>
                        </div>
                    </div>

                    <FeaturesGrid features={PROPERTY_DATA.features} />

                    <div className="mb-8">
                        <div className="mb-8 border-b-[0.5px] border-[var(--dashboard-border)] w-fit relative pb-0 overflow-hidden">
                            <div className="flex items-end gap-2">
                                {["Description", "Features", "Amenities", "Lease Terms", "Policies"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveBottomTab(tab)}
                                        className={`relative px-8 py-3 text-base font-medium transition-all duration-200 whitespace-nowrap ${activeBottomTab === tab
                                            ? "bg-[var(--dashboard-accent)] text-white rounded-t-[12px] z-10"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}

                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-gray-500 leading-relaxed text-[15px]">
                            {activeBottomTab === "Description" ? (
                                <p>{PROPERTY_DATA.description}</p>
                            ) : activeBottomTab === "Features" ? (
                                <div className="flex flex-wrap gap-4 mt-8">
                                    {PROPERTY_DATA.detailedFeatures.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-6 py-2.5 rounded-[10px] text-[15px] font-medium transition-all duration-200 border 
                                                ${feature.selected
                                                    ? "bg-[var(--dashboard-accent)] text-white border-[var(--dashboard-accent)] shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.15)]"
                                                    : "bg-white text-[#4B5563] border-gray-200 shadow-sm"
                                                }`}
                                        >
                                            {feature.label}
                                        </div>
                                    ))}
                                </div>
                            ) : activeBottomTab === "Amenities" ? (
                                <div className="flex flex-wrap gap-4 mt-8">
                                    {PROPERTY_DATA.amenities.map((amenity, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-6 py-2.5 rounded-[10px] text-[15px] font-medium transition-all duration-200 border 
                                                ${amenity.selected
                                                    ? "bg-[var(--dashboard-accent)] text-white border-[var(--dashboard-accent)] shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.15)]"
                                                    : "bg-white text-[#4B5563] border-gray-200 shadow-sm"
                                                }`}
                                        >
                                            {amenity.label}
                                        </div>
                                    ))}
                                </div>
                            ) : activeBottomTab === "Lease Terms" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                                    {PROPERTY_DATA.leaseTerms.map((term, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-3 py-3 rounded-2xl transition-all duration-200 border 
                                                ${term.selected
                                                    ? "bg-[#A3E671] border-[#A3E671] shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.15)]"
                                                    : "bg-white border-gray-50 shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.1)]"
                                                }`}
                                        >
                                            <p className={`text-[16px] font-medium mb-1 ${term.selected ? "text-[#1A1A1A]" : "text-[#1A1A1A]"}`}>
                                                {term.label}
                                            </p>
                                            <p className={`text-[15px] ${term.selected ? "text-[#4B5563]" : "text-[#4B5563]"}`}>
                                                {term.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : activeBottomTab === "Policies" ? (
                                <div className="mt-8">
                                    <div className="bg-white rounded-[20px] border border-gray-50 shadow-[0px_3.68px_15px_0px_rgba(0,0,0,0.08)] flex overflow-hidden w-full lg:w-fit">
                                        {PROPERTY_DATA.policies.map((policy, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex-1 px-6 py-4 min-w-[150px]  ${idx !== PROPERTY_DATA.policies.length - 1 ? "border-r border-gray-100" : ""
                                                    }`}
                                            >
                                                <p className="text-[17px] font-medium text-[#1A1A1A] mb-1">{policy.label}</p>
                                                <p className="text-[15px] text-[#4B5563]">{policy.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-8 text-[var(--dashboard-accent)] font-normal leading-relaxed max-w-xl">
                                        {PROPERTY_DATA.policyDescription}
                                    </p>
                                </div>
                            ) : (
                                <p>Content for {activeBottomTab} will be available soon.</p>
                            )}




                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[var(--radius-lg)] border border-gray-50 p-8 shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.2)] sticky top-24">
                        <p className="text-[#4B5563] text-sm mb-1 uppercase tracking-normal font-normal">Listing Agent</p>
                        <h3 className="text-2xl font-semibold text-[var(--dashboard-text-main)] mb-3">{PROPERTY_DATA.agent.name}</h3>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[var(--dashboard-accent)] flex items-center justify-center text-white shadow-[var(--shadow-sm)]">
                                    <Phone size={16} />
                                </div>
                                <span className="text-gray-600 text-sm font-medium">{PROPERTY_DATA.agent.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[var(--dashboard-accent)] flex items-center justify-center text-white shadow-[var(--shadow-sm)]">
                                    <Mail size={16} />
                                </div>
                                <span className="text-gray-600 text-sm font-medium">{PROPERTY_DATA.agent.email}</span>
                            </div>
                        </div>

                        <div className="bg-[#F5F5F5] border border-[#3333334D] rounded-2xl p-4 mb-6">
                            <textarea
                                className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none text-sm text-gray-600 resize-none h-24"
                                defaultValue={`Hello ${PROPERTY_DATA.agent.name.split(' ')[0]}, I would like to know more about the listing`}
                            />
                        </div>

                        <div className="flex justify-center">
                            <PrimaryActionButton
                                className="bg-[var(--dashboard-accent)] hover:bg-[var(--dashboard-accent)] text-white font-bold px-2 py-2 rounded-md flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_20px_rgba(140,215,75,0.3)]"
                            >
                                <Send size={18} />
                                Send a message
                            </PrimaryActionButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailUser;

