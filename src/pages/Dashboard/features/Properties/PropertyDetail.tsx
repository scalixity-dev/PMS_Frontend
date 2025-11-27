import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    MapPin,
    Users,
    CreditCard,
    BedDouble,
    Bath,
    Maximize,
} from 'lucide-react';

// Mock data - in a real app this would come from an API or shared state
const PROPERTY_DETAILS = {
    1: {
        id: 1,
        name: 'Luxury Apartment',
        address: '78 Scheme No 78 - II Indore, MP, 452010, IN',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80',
        type: 'Single Family',
        yearBuilt: '2024',
        mixId: '--',
        status: 'Active',
        stats: {
            equipment: 2,
            recurringRequests: 2,
            pms: 2,
            maintenance: 2
        },
        financials: {
            balance: 4000.00,
            currency: 'INR'
        },
        specifications: {
            bedrooms: 3,
            bathrooms: 2,
            sizeSqFt: 1850
        }
    }
};

const PropertyDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    // Default to the first property if ID not found or for demo
    const property = PROPERTY_DETAILS[Number(id) as keyof typeof PROPERTY_DETAILS] || PROPERTY_DETAILS[1];

    return (
        <div className="max-w-6xl mx-auto min-h-screen pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/properties')}>Properties</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{property.name}</span>
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-6 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/properties')}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">{property.name}</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5554] transition-colors">
                            Move In
                        </button>
                        <button className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5554] transition-colors">
                            Action
                        </button>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="w-full h-80 rounded-3xl overflow-hidden mb-8 shadow-lg">
                    <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Property Info Center */}
                <div className="flex flex-col items-center justify-center mb-10">
                    <div className="bg-[#E8F3F1] px-6 py-2 rounded-full mb-3">
                        <h2 className="text-[#3A6D6C] font-bold text-lg">{property.name}</h2>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm font-medium mb-6">
                        <MapPin className="w-4 h-4 mr-2" />
                        {property.address}
                    </div>

                    {/* Quick Stats Pills */}
                    <div className="flex gap-4 mb-8 flex-wrap justify-center">
                        <div className="flex items-center bg-white px-4 py-2 rounded-full border border-[#82D64D] shadow-sm">
                            <div className="w-5 h-5 rounded-full bg-[#82D64D] text-white flex items-center justify-center text-xs font-bold mr-2">
                                {property.stats.equipment}
                            </div>
                            <span className="text-gray-700 text-sm font-medium">Equipment</span>
                        </div>
                        <div className="flex items-center bg-white px-4 py-2 rounded-full border border-[#82D64D] shadow-sm">
                            <div className="w-5 h-5 rounded-full bg-[#82D64D] text-white flex items-center justify-center text-xs font-bold mr-2">
                                {property.stats.recurringRequests}
                            </div>
                            <span className="text-gray-700 text-sm font-medium">Recurring Requests</span>
                        </div>
                        <div className="flex items-center bg-white px-4 py-2 rounded-full border border-[#82D64D] shadow-sm">
                            <div className="w-5 h-5 rounded-full bg-[#82D64D] text-white flex items-center justify-center text-xs font-bold mr-2">
                                {property.stats.pms}
                            </div>
                            <span className="text-gray-700 text-sm font-medium">Pms</span>
                        </div>
                        <div className="flex items-center bg-white px-4 py-2 rounded-full border border-[#82D64D] shadow-sm">
                            <div className="w-5 h-5 rounded-full bg-[#82D64D] text-white flex items-center justify-center text-xs font-bold mr-2">
                                {property.stats.maintenance}
                            </div>
                            <span className="text-gray-700 text-sm font-medium">Maintenance</span>
                        </div>
                    </div>

                    {/* Assigned Team & Bank */}
                    <div className="flex gap-6 w-full max-w-4xl justify-center">
                        <div className="bg-[#F6F6F8] p-6 rounded-[2rem] flex-1 flex flex-col items-center text-center border border-[#82D64D] shadow-sm">
                            <div className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full flex items-center gap-2 mb-4 text-sm font-medium">
                                <Users className="w-4 h-4" />
                                Assigned Team
                            </div>
                            <p className="text-gray-500 text-sm mb-4">No assigned members</p>
                            <button className="bg-[#B5E48C] text-[#2c5554] px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#a3d975] transition-colors">
                                Assign
                            </button>
                        </div>
                        <div className="bg-[#F6F6F8] p-6 rounded-[2rem] flex-1 flex flex-col items-center text-center border border-[#82D64D] shadow-sm">
                            <div className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full flex items-center gap-2 mb-4 text-sm font-medium">
                                <CreditCard className="w-4 h-4" />
                                Bank Account
                            </div>
                            <p className="text-gray-500 text-sm mb-4">No bank account assigned</p>
                            <button className="bg-[#B5E48C] text-[#2c5554] px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#a3d975] transition-colors">
                                Assign
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-[#E8E8EA] p-1.5 rounded-full flex gap-2">
                        {['Profile', 'Specs', 'Financials', 'Service Providers'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.toLowerCase()
                                        ? 'bg-[#82D64D] text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Financials Chart Section */}
                <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Financials , INR</h3>
                        <button className="border border-gray-200 px-4 py-1.5 rounded-lg text-xs font-medium text-gray-600 flex items-center gap-2">
                            See All <ChevronLeft className="w-3 h-3 rotate-180" />
                        </button>
                    </div>

                    {/* Mock Chart Visualization */}
                    <div className="relative h-48 flex items-end justify-between gap-4 px-4">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="border-t border-dashed border-gray-200 w-full h-0"></div>
                            ))}
                        </div>

                        {/* Bars */}
                        {[10, 12, 12, 20, 12, 12, 12, 12].map((height, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 z-10 w-full">
                                {idx === 3 && (
                                    <div className="mb-2 bg-[#E8E8EA] px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-gray-700 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-[#3A6D6C]"></div>
                                        4,000.00
                                    </div>
                                )}
                                <div
                                    className={`w-full max-w-[40px] rounded-t-lg ${idx === 3 ? 'bg-[#10B981]' : 'bg-[#E8F3F1]'}`}
                                    style={{ height: `${height * 5}px` }}
                                ></div>
                                <span className="text-[10px] text-gray-400">1{idx} Nov</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* General Information */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">General information</h3>
                    <div className="bg-[#E8E8EA] rounded-[2rem] p-6">
                        <div className="grid grid-cols-4 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Property name</label>
                                <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                    {property.name}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Year built</label>
                                <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                    {property.yearBuilt}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Mix #</label>
                                <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                    {property.mixId}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Property status</label>
                                <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                    {property.status}
                                </div>
                            </div>
                        </div>

                        <h4 className="text-base font-bold text-gray-700 mb-4">Single-Family</h4>
                        <div className="flex gap-4 mb-6">
                            <div className="bg-[#82D64D] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                                <BedDouble className="w-4 h-4" />
                                Bedrooms
                                <span className="bg-white text-[#82D64D] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{property.specifications.bedrooms}</span>
                            </div>
                            <div className="bg-[#82D64D] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                                <Bath className="w-4 h-4" />
                                Bathrooms
                                <span className="bg-white text-[#82D64D] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{property.specifications.bathrooms}</span>
                            </div>
                            <div className="bg-[#82D64D] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                                <Maximize className="w-4 h-4" />
                                Size, sq.ft
                                <span className="bg-white text-[#82D64D] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{property.specifications.sizeSqFt}</span>
                            </div>
                        </div>

                        <div className="bg-[#DCDCDF] rounded-2xl p-6 grid grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Parking</label>
                                <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-400 shadow-sm">
                                    Driveway
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Parking</label>
                                <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-400 shadow-sm">
                                    Driveway
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Parking</label>
                                <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-400 shadow-sm">
                                    Driveway
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
                    <div className="bg-[#E8E8EA] rounded-[2rem] p-6 min-h-[160px]">
                        <textarea
                            placeholder="Type Details here.."
                            className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-sm text-gray-700 placeholder-gray-500"
                            rows={4}
                        />
                    </div>
                </div>

                {/* Property Attachments */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Property attachments</h3>
                    <div className="bg-[#E8E8EA] rounded-[2rem] p-6 min-h-[160px] flex items-start">
                        <p className="text-gray-500 text-sm">No attachments added</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
