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
    Send
} from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryActionButton from "../../components/common/buttons/PrimaryActionButton";

// --- Types ---
interface PropertyFeature {
    icon: React.ReactNode;
    label: string;
    value: string;
}

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
    agent: {
        name: string;
        phone: string;
        email: string;
    };
}

// --- Internal Components ---

const ImageGallery: React.FC<{ images: string[]; discount?: string }> = ({ images, discount }) => {
    const mainImage = images[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800";
    const sideImages = images.slice(1, 4);
    const remainingCount = images.length > 5 ? images.length - 5 : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="relative rounded-[var(--radius-lg)] overflow-hidden aspect-[3/2] h-full">
                <img src={mainImage} alt="Main" className="w-full h-full object-cover" />
                {discount && (
                    <div className="absolute bottom-6 left-6 bg-[var(--dashboard-accent)] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm">
                        {discount}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {sideImages.map((img, idx) => (
                    <div key={idx} className="rounded-[var(--radius-lg)] overflow-hidden aspect-[3/2]">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    </div>
                ))}
                {images[4] && (
                    <div className="relative rounded-[var(--radius-lg)] overflow-hidden aspect-[3/2]">
                        <img src={images[4]} alt="Gallery 4" className="w-full h-full object-cover" />
                        {remainingCount > 0 && (
                            <div className="absolute bottom-4 right-4 bg-[var(--dashboard-accent)] text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                                +{remainingCount} Images
                            </div>
                        )}
                    </div>
                )}
            </div>
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
    const [activeTab, setActiveTab] = useState("Overview");
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
        agent: {
            name: "Carlo at Washington",
            phone: "(305) 651-2820",
            email: "carlo@gmail.com"
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] p-6 lg:p-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-lg font-medium mb-8">
                <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-bold">Dashboard</Link>
                <span className="text-gray-400">/</span>
                <Link to="/userdashboard/properties" className="text-gray-900 font-semibold">Properties</Link>
            </div>

            {/* Top Tabs */}
            <div className="flex items-center border-b border-gray-100 mb-8 overflow-hidden w-fit">
                {["Overview", "Map"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-2.5 text-sm font-semibold transition-all duration-200 ${activeTab === tab
                            ? "bg-[var(--dashboard-accent)] text-white rounded-t-lg"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <ImageGallery images={PROPERTY_DATA.images} discount={PROPERTY_DATA.discount} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--dashboard-text-main)] mb-2">{PROPERTY_DATA.title}</h1>
                        <p className="text-gray-500 text-lg flex items-center gap-2 font-medium">{PROPERTY_DATA.address}</p>
                    </div>

                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <p className="text-2xl font-bold text-[var(--dashboard-text-main)]">{PROPERTY_DATA.availabilityDate}</p>
                            <p className="text-gray-400 font-medium">Availability</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-[var(--dashboard-text-main)]">
                                {PROPERTY_DATA.currency}{PROPERTY_DATA.rent} <span className="text-gray-500 text-lg font-medium">month</span>
                            </p>
                            <p className="text-gray-400 font-medium">Rent</p>
                        </div>
                    </div>

                    <FeaturesGrid features={PROPERTY_DATA.features} />

                    <div className="mb-8">
                        <div className="mb-8 border-b-[0.5px] border-[var(--dashboard-border)] w-fit relative pb-0">
                            <div className="flex items-end gap-2 overflow-x-auto scrollbar-hide">
                                {["Description", "Features", "Amenities", "Lease Terms", "Policies"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveBottomTab(tab)}
                                        className={`relative px-6 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap ${activeBottomTab === tab
                                            ? "bg-[var(--dashboard-accent)] text-white rounded-t-2xl z-10"
                                            : "text-gray-400 hover:text-gray-600"
                                            }`}
                                    >
                                        {tab}
                                        {activeBottomTab === tab && (
                                            <div className="absolute -bottom-[60px] left-[-20%] right-[-20%] h-40 bg-[var(--dashboard-glow)] blur-[40px] -z-10 pointer-events-none rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-gray-500 leading-relaxed text-[15px]">
                            {activeBottomTab === "Description" ? (
                                <p>{PROPERTY_DATA.description}</p>
                            ) : (
                                <p>Content for {activeBottomTab} will be available soon.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[var(--radius-lg)] border border-gray-50 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sticky top-24">
                        <p className="text-[#4B5563] text-sm mb-1 uppercase tracking-normal font-normal">Listing Agent</p>
                        <h3 className="text-2xl font-bold text-[var(--dashboard-text-main)] mb-3">{PROPERTY_DATA.agent.name}</h3>

                        <div className="space-y-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--dashboard-accent)] flex items-center justify-center text-white shadow-[var(--shadow-sm)]">
                                    <Phone size={16} />
                                </div>
                                <span className="text-gray-600 font-medium">{PROPERTY_DATA.agent.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--dashboard-accent)] flex items-center justify-center text-white shadow-[var(--shadow-sm)]">
                                    <Mail size={16} />
                                </div>
                                <span className="text-gray-600 font-medium">{PROPERTY_DATA.agent.email}</span>
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

