import React, { useState, useEffect } from "react";
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
    ChevronRight,
    FileText
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import SendMessageModal from "./components/SendMessageModal";
import type { PropertyFeature } from "../../utils/types";
import { API_ENDPOINTS } from "../../../../config/api.config";
import { formatMoney } from "../../../../utils/currency.utils";
import { formatAmenityLabel } from "../../../../utils/string.utils";


// --- Types ---
interface PropertyData {
    id: string;
    title: string;
    address: string;
    availabilityDate: string;
    rent: number;
    currency: string;
    currencyCode?: string; // ISO currency code (e.g., "USD", "INR", "EUR")
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
        <div className="fixed top-[var(--header-height)] left-0 lg:left-[var(--sidebar-width)] right-0 bottom-0 z-50 bg-black/10 flex items-center justify-center p-2 sm:p-4 lg:p-10 transition-all duration-300">


            <div className="w-full h-full flex items-center justify-center transition-all duration-300">
                <div className="bg-white w-full max-w-7xl max-h-full rounded-lg sm:rounded-xl shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300">

                    {/* Header */}
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100 flex-shrink-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-800">Property Images</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                        >
                            <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                        {/* Main Image Area */}
                        <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center relative p-2 sm:p-3 lg:p-4 overflow-hidden group">
                            <button
                                onClick={prevImage}
                                className="absolute left-2 sm:left-4 p-1.5 sm:p-2 rounded-full bg-white shadow-md text-gray-700 hover:text-black transition-all border border-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                            >
                                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                            </button>

                            <img
                                src={images[currentIndex]}
                                alt={`Gallery ${currentIndex + 1}`}
                                className="max-w-full max-h-full object-contain drop-shadow-sm"
                            />

                            <button
                                onClick={nextImage}
                                className="absolute right-2 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white shadow-md text-gray-700 hover:text-black transition-all border border-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                            >
                                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Sidebar: Details & Thumbnails */}
                        <div className="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-gray-100 flex flex-col max-h-[40%] md:max-h-full">
                            {/* Fixed Details Section */}
                            <div className="p-3 sm:p-4 border-b border-gray-100 flex-shrink-0">
                                <h2 className="text-lg sm:text-xl font-bold text-[var(--dashboard-text-main)] mb-1 leading-tight">{title}</h2>
                                <p className="text-[var(--dashboard-accent)] font-semibold text-base sm:text-lg">{rent}</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-2">All Details</p>
                            </div>

                            {/* Scrollable Thumbnails Section */}
                            <div className="p-3 sm:p-4 flex-1 overflow-y-auto custom-scrollbar min-h-0">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">All Images ({images.length})</p>
                                <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div
                className="relative rounded-lg sm:rounded-[var(--radius-lg)] overflow-hidden aspect-[3/2] h-full cursor-pointer group"
                onClick={() => openModal(0)}
            >
                <img src={mainImage} alt="Main" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                {discount && (
                    <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 bg-[var(--dashboard-accent)] text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-sm">
                        {discount}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                {sideImages.map((img, idx) => (
                    <div
                        key={idx}
                        className="rounded-lg sm:rounded-[var(--radius-lg)] overflow-hidden aspect-[3/2] cursor-pointer group relative"
                        onClick={() => openModal(idx + 1)}
                    >
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                ))}
                {images[4] && (
                    <div
                        className="relative rounded-lg sm:rounded-[var(--radius-lg)] overflow-hidden aspect-[3/2] cursor-pointer group"
                        onClick={() => openModal(4)}
                    >
                        <img src={images[4]} alt="Gallery 4" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        {remainingCount > 0 && (
                            <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-[var(--dashboard-accent)] text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold shadow-sm z-10 hover:bg-[var(--dashboard-accent)]/90 transition-colors">
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
    <div className="bg-white border-t border-l border-gray-100 rounded-lg sm:rounded-[1rem] overflow-hidden mb-8 sm:mb-12 shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.2)]">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 lg:p-7 bg-white h-full border-b border-r border-gray-100"
                >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--dashboard-accent)] flex items-center justify-center text-white flex-shrink-0">
                        {React.isValidElement(feature.icon)
                            ? React.cloneElement(feature.icon as React.ReactElement<{ size?: number }>, { size: 18 })
                            : feature.icon}
                    </div>
                    <div>
                        <p className="text-sm sm:text-[16px] font-semibold text-[#1A1A1A] leading-tight mb-0.5">{feature.label}</p>
                        <p className="text-xs sm:text-[14px] text-[#4B5563] font-medium leading-tight">{feature.value}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const PropertyDetailUser: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeBottomTab, setActiveBottomTab] = useState("Description");
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [propertyData, setPropertyData] = useState<PropertyData | null>(null);

    useEffect(() => {
        const fetchPropertyDetail = async () => {
            if (!id) {
                setError("Property ID is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);


                let propertyId = id;
                if (id.length > 36) {

                    propertyId = id.substring(0, 36);
                }

                const response = await fetch(API_ENDPOINTS.PROPERTY.GET_PUBLIC_DETAIL(propertyId), {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Property not found');
                    }
                    throw new Error('Failed to fetch property details');
                }

                const data = await response.json();

                // Map backend data to PropertyData format
                const address = data.address;
                const addressString = address
                    ? `${address.streetAddress || ''}, ${address.city || ''}, ${address.stateRegion || ''}, ${address.zipCode || ''}, ${address.country || ''}`
                    : '';

                const price = data.listing?.monthlyRent
                    ? parseFloat(data.listing.monthlyRent)
                    : data.listing?.listingPrice
                        ? parseFloat(data.listing.listingPrice)
                        : data.marketRent
                            ? parseFloat(data.marketRent)
                            : 0;

                // Get currency from backend response, fallback to property country or default
                const currencyInfo = data.currency || (address?.country ? {
                    code: address.country === 'India' || address.country === 'IN' ? 'INR' : 'USD',
                    symbol: address.country === 'India' || address.country === 'IN' ? '₹' : '$',
                    name: address.country === 'India' || address.country === 'IN' ? 'Indian Rupee' : 'US Dollar'
                } : { code: 'USD', symbol: '$', name: 'US Dollar' });

                const beds = data.singleUnitDetail?.beds ?? null;
                const title = data.listing?.title ||
                    (beds !== null ? `${beds} Bedroom ${data.propertyType === 'SINGLE' ? 'Property' : 'Unit'}` : data.propertyName);

                // Format availability date
                const formatDate = (date: string | Date | null): string => {
                    if (!date) return 'Available now';
                    const d = new Date(date);
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const day = d.getDate().toString().padStart(2, '0');
                    const month = months[d.getMonth()];
                    const year = d.getFullYear();
                    return `${day} ${month}, ${year}`;
                };

                // Get images from photos array
                const images = data.photos?.map((p: any) => p.photoUrl) || [];
                if (data.coverPhotoUrl && !images.includes(data.coverPhotoUrl)) {
                    images.unshift(data.coverPhotoUrl);
                }

                // Build features array
                const features: PropertyFeature[] = [];
                if (beds !== null) {
                    features.push({ icon: <BedDouble />, label: "Bedrooms", value: beds.toString() });
                }
                if (data.singleUnitDetail?.baths) {
                    features.push({ icon: <Bath />, label: "Bathrooms", value: parseFloat(data.singleUnitDetail.baths).toString() });
                }
                if (data.sizeSqft) {
                    features.push({ icon: <Ruler />, label: "Size", value: `${data.sizeSqft} sq.ft` });
                }
                if (data.yearBuilt) {
                    features.push({ icon: <Building2 />, label: "Built", value: data.yearBuilt.toString() });
                }

                // Add amenities to features
                const amenities = data.amenities || data.singleUnitDetail?.amenities;
                if (amenities) {
                    if (amenities.parking && amenities.parking !== 'NONE') {
                        features.push({ icon: <ParkingSquare />, label: "Parking", value: formatAmenityLabel(amenities.parking) });
                    }
                    if (amenities.laundry && amenities.laundry !== 'NONE') {
                        features.push({ icon: <Shirt />, label: "Laundry", value: formatAmenityLabel(amenities.laundry) });
                    }
                    if (amenities.airConditioning && amenities.airConditioning !== 'NONE') {
                        features.push({ icon: <AirVent />, label: "A.C", value: formatAmenityLabel(amenities.airConditioning) });
                    }
                    if (data.listing?.petsAllowed) {
                        features.push({ icon: <Dog />, label: "Pets", value: "Yes" });
                    }
                }

                // Build detailed features from propertyFeatures array
                const detailedFeatures = amenities?.propertyFeatures?.map((feature: string) => ({
                    label: formatAmenityLabel(feature),
                    selected: true
                })) || [];

                // Build amenities list from propertyAmenities array
                const amenitiesList = amenities?.propertyAmenities?.map((amenity: string) => ({
                    label: formatAmenityLabel(amenity),
                    selected: true
                })) || [];


                // Build lease terms
                const leaseTerms = [];
                if (data.listing?.minLeaseDuration && data.listing?.maxLeaseDuration) {
                    leaseTerms.push({
                        label: "Lease Duration",
                        value: `${data.listing.minLeaseDuration.replace(/_/g, ' ')} - ${data.listing.maxLeaseDuration.replace(/_/g, ' ')}`
                    });
                }
                if (data.listing?.securityDeposit) {
                    leaseTerms.push({
                        label: "Security deposit",
                        value: formatMoney(parseFloat(data.listing.securityDeposit), currencyInfo.code)
                    });
                }
                if (data.listing?.amountRefundable) {
                    leaseTerms.push({
                        label: "Amount Refundable",
                        value: formatMoney(parseFloat(data.listing.amountRefundable), currencyInfo.code)
                    });
                }
                if (data.listing?.applicationFee) {
                    leaseTerms.push({
                        label: "Application fee",
                        value: formatMoney(parseFloat(data.listing.applicationFee), currencyInfo.code)
                    });
                }

                // Build policies
                const policies = [];
                if (data.listing?.petsAllowed) {
                    if (data.listing.petCategory?.length > 0) {
                        data.listing.petCategory.forEach((category: string) => {
                            policies.push({ label: category, value: "Ok" });
                        });
                    }
                    if (data.listing.petDeposit) {
                        policies.push({
                            label: "Pet Deposit",
                            value: formatMoney(parseFloat(data.listing.petDeposit), currencyInfo.code)
                        });
                    }
                    if (data.listing.petFee) {
                        policies.push({
                            label: "Pet Fee",
                            value: formatMoney(parseFloat(data.listing.petFee), currencyInfo.code)
                        });
                    }
                }

                const mappedData: PropertyData = {
                    id: data.id,
                    title: title,
                    address: addressString,
                    availabilityDate: formatDate(data.listing?.availableFrom),
                    rent: price,
                    currency: currencyInfo.symbol,
                    currencyCode: currencyInfo.code,
                    images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"],
                    discount: "", // Can be added from listing if available
                    description: data.description || data.listing?.description || "No description available.",
                    features: features,
                    detailedFeatures: detailedFeatures,
                    amenities: amenitiesList,
                    leaseTerms: leaseTerms,
                    policies: policies,
                    policyDescription: data.listing?.petDescription || "",
                    agent: {
                        name: data.manager?.fullName || data.listingContactName || "Property Manager",
                        phone: data.listingPhoneNumber ? `(${data.listingPhoneCountryCode || ''}) ${data.listingPhoneNumber}` : "N/A",
                        email: data.manager?.email || data.listingEmail || "N/A"
                    }
                };

                setPropertyData(mappedData);
            } catch (err) {
                console.error('Error fetching property detail:', err);
                setError(err instanceof Error ? err.message : 'Failed to load property details');
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--dashboard-accent)]"></div>
                    <p className="mt-4 text-gray-600">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error || !propertyData) {
        return (
            <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <p className="text-red-500 text-lg mb-4">{error || 'Property not found'}</p>
                    <button
                        onClick={() => navigate('/userdashboard/properties')}
                        className="text-[var(--dashboard-accent)] font-medium hover:underline"
                    >
                        Back to Properties
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#F5F5F5] p-3 sm:p-4 md:p-6 lg:p-10 relative">
            <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 lg:mb-10">
                <ol className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-medium overflow-x-auto">
                    <li className="whitespace-nowrap">
                        <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                    <li className="whitespace-nowrap">
                        <Link to="/userdashboard/properties" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Properties</Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                    <li className="text-[#1A1A1A] font-medium whitespace-nowrap" aria-current="page">Property Details</li>
                </ol>
            </nav>

            <ImageGallery
                images={propertyData.images}
                discount={propertyData.discount}
                title={propertyData.title}
                rent={propertyData.currencyCode ? formatMoney(propertyData.rent, propertyData.currencyCode) : `${propertyData.currency}${propertyData.rent}`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                <div className="lg:col-span-2">
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--dashboard-text-main)] mb-2">{propertyData.title}</h1>
                        <p className="text-[#4B5563] text-sm sm:text-base md:text-xl flex items-center gap-2 font-light leading-relaxed">{propertyData.address}</p>
                    </div>


                    <div className="flex flex-row justify-between items-start gap-2 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                        <div>
                            <p className="text-lg sm:text-xl md:text-2xl font-medium text-[var(--dashboard-text-main)]">{propertyData.availabilityDate}</p>
                            <p className="text-sm sm:text-base text-[#4B5563] font-normal">Availability</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg sm:text-xl md:text-2xl font-medium text-[var(--dashboard-text-main)]">
                                {propertyData.currencyCode ? formatMoney(propertyData.rent, propertyData.currencyCode) : `${propertyData.currency}${propertyData.rent}`} <span className="text-gray-500 text-base sm:text-lg md:text-xl font-normal">month</span>
                            </p>
                            <p className="text-sm sm:text-base text-[#4B5563] font-normal">Rent</p>
                        </div>
                    </div>

                    <FeaturesGrid features={propertyData.features} />

                    <div className="mb-6 sm:mb-8">
                        <style>{`
                            .tabs-scroll-container::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        <div
                            className="tabs-scroll-container mb-6 sm:mb-8 border-b-[0.5px] border-[var(--dashboard-border)] w-full relative pb-0 overflow-x-auto overflow-y-hidden"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch'
                            } as React.CSSProperties}
                        >
                            <div className="flex items-end gap-0.5 sm:gap-1 md:gap-2">
                                {["Description", "Features", "Amenities", "Lease Terms", "Policies"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveBottomTab(tab)}
                                        className={`relative px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-[11px] sm:text-xs md:text-sm lg:text-base font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${activeBottomTab === tab
                                            ? "bg-[var(--dashboard-accent)] text-white rounded-t-[6px] sm:rounded-t-[8px] md:rounded-t-[10px] lg:rounded-t-[12px] z-10"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}

                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-gray-500 leading-relaxed text-sm sm:text-[15px]">
                            {activeBottomTab === "Description" ? (
                                <p>{propertyData.description}</p>
                            ) : activeBottomTab === "Features" ? (
                                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
                                    {propertyData.detailedFeatures.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-[10px] text-xs sm:text-sm md:text-[15px] font-medium transition-all duration-200 border 
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
                                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
                                    {propertyData.amenities.map((amenity, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-[10px] text-xs sm:text-sm md:text-[15px] font-medium transition-all duration-200 border 
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
                                    {propertyData.leaseTerms.map((term, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-3 py-3 rounded-xl sm:rounded-2xl transition-all duration-200 border 
                                                ${term.selected
                                                    ? "bg-[#A3E671] border-[#A3E671] shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.15)]"
                                                    : "bg-white border-gray-50 shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.1)]"
                                                }`}
                                        >
                                            <p className={`text-sm sm:text-[15px] md:text-[16px] font-medium mb-1 ${term.selected ? "text-[#1A1A1A]" : "text-[#1A1A1A]"}`}>
                                                {term.label}
                                            </p>
                                            <p className={`text-xs sm:text-sm md:text-[15px] ${term.selected ? "text-[#4B5563]" : "text-[#4B5563]"}`}>
                                                {term.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : activeBottomTab === "Policies" ? (
                                <div className="mt-4 sm:mt-6 md:mt-8">
                                    <div className="bg-white rounded-xl sm:rounded-[20px] border border-gray-50 shadow-[0px_3.68px_15px_0px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row overflow-hidden w-full">
                                        {propertyData.policies.map((policy, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex-1 px-4 sm:px-5 md:px-6 py-3 sm:py-4 min-w-0 sm:min-w-[150px] ${idx !== propertyData.policies.length - 1 ? "border-b sm:border-b-0 sm:border-r border-gray-100" : ""
                                                    }`}
                                            >
                                                <p className="text-sm sm:text-base md:text-[17px] font-medium text-[#1A1A1A] mb-1">{policy.label}</p>
                                                <p className="text-xs sm:text-sm md:text-[15px] text-[#4B5563]">{policy.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base text-[var(--dashboard-accent)] font-normal leading-relaxed max-w-xl">
                                        {propertyData.policyDescription}
                                    </p>
                                </div>
                            ) : (
                                <p>Content for {activeBottomTab} will be available soon.</p>
                            )}




                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg sm:rounded-[var(--radius-lg)] border border-gray-50 p-4 sm:p-6 lg:p-5 xl:p-6 shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.2)] lg:sticky lg:top-24">
                        <p className="text-[#4B5563] text-xs sm:text-sm mb-1 uppercase tracking-normal font-normal">Listing Agent</p>
                        <h3 className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-semibold text-[var(--dashboard-text-main)] mb-3">{propertyData.agent.name}</h3>

                        <div className="space-y-2 sm:space-y-3 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--dashboard-accent)] flex items-center justify-center text-white shadow-[var(--shadow-sm)] flex-shrink-0">
                                    <Phone size={14} className="sm:w-4 sm:h-4" />
                                </div>
                                <span className="text-gray-600 text-xs sm:text-sm font-medium break-all">{propertyData.agent.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--dashboard-accent)] flex items-center justify-center text-white shadow-[var(--shadow-sm)] flex-shrink-0">
                                    <Mail size={14} className="sm:w-4 sm:h-4" />
                                </div>
                                <span className="text-gray-600 text-xs sm:text-sm font-medium break-all">{propertyData.agent.email}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3">
                            <PrimaryActionButton
                                onClick={() => navigate('/userdashboard/new-application', { state: { propertyId: propertyData.id } })}
                                className="w-full bg-[var(--dashboard-accent)] hover:bg-[var(--dashboard-accent)] hover:brightness-98 text-white font-bold py-2 sm:py-2.5 text-sm sm:text-base lg:text-sm xl:text-base rounded-md flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 shadow-[0_4px_10px_rgba(140,215,75,0.4)]"
                            >
                                <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="whitespace-nowrap">Apply to this listing</span>
                            </PrimaryActionButton>

                            <PrimaryActionButton
                                onClick={() => setIsMessageModalOpen(true)}
                                className="bg-[var(--dashboard-accent)] hover:bg-[var(--dashboard-accent)] hover:brightness-98 text-white font-bold px-2 py-2 sm:py-2.5 text-sm sm:text-base lg:text-sm xl:text-base rounded-md flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 shadow-[0_10px_20px_rgba(140,215,75,0.3)]"
                            >
                                <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="whitespace-nowrap">Send a message</span>
                            </PrimaryActionButton>
                        </div>
                    </div>
                </div>
            </div>
            <SendMessageModal
                isOpen={isMessageModalOpen}
                onClose={() => setIsMessageModalOpen(false)}
                propertyTitle={propertyData.title}
                landlordName={propertyData.agent.name}
            />
        </div>
    );
};

export default PropertyDetailUser;

