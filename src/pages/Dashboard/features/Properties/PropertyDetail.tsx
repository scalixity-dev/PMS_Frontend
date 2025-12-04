import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    MapPin,
    Users,
    Landmark,
    BedDouble,
    Bath,
    Maximize,
    Loader2,
} from 'lucide-react';
import SpecsTab from './components/SpecsTab';
import FinancialsTab from './components/FinancialsTab';
import ServiceProvidersTab from './components/ServiceProvidersTab';
import DetailTabs from '../../components/DetailTabs';
import { useGetProperty } from '../../../../hooks/usePropertyQueries';
import { getCurrencySymbol } from '../../../../utils/currency.utils';

const PropertyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    // Fetch property data from backend
    const { data: backendProperty, isLoading, error } = useGetProperty(id || null, !!id);

    // Transform backend property to component format
    const property = useMemo(() => {
        if (!backendProperty) return null;

        // Format address
        let address = 'Address not available';
        let country: string | undefined;
        if (backendProperty.address) {
            country = backendProperty.address.country;
            const addressParts = [
                backendProperty.address.streetAddress,
                backendProperty.address.city,
                backendProperty.address.stateRegion,
                backendProperty.address.zipCode,
                backendProperty.address.country,
            ].filter(part => part && part.trim() !== '');
            
            if (addressParts.length > 0) {
                address = addressParts.join(', ');
            }
        }

        // Get image - prioritize coverPhotoUrl, then primary photo, then first photo
        const image = backendProperty.coverPhotoUrl 
            || backendProperty.photos?.find((p) => p.isPrimary)?.photoUrl 
            || backendProperty.photos?.[0]?.photoUrl 
            || null;

        // Map status
        const statusMap: Record<string, string> = {
            'ACTIVE': 'Active',
            'INACTIVE': 'Inactive',
            'ARCHIVED': 'Archived',
        };
        const status = backendProperty.status 
            ? statusMap[backendProperty.status] || 'Inactive'
            : 'Inactive';

        // Map property type
        const propertyTypeMap: Record<string, string> = {
            'SINGLE': 'Single Family',
            'MULTI': 'Multi Family',
        };
        const type = propertyTypeMap[backendProperty.propertyType] || 'Property';

        // Get specifications
        const bedrooms = backendProperty.singleUnitDetails?.beds || 0;
        const bathrooms = backendProperty.singleUnitDetails?.baths
            ? typeof backendProperty.singleUnitDetails.baths === 'string'
                ? parseFloat(backendProperty.singleUnitDetails.baths) || 0
                : Number(backendProperty.singleUnitDetails.baths) || 0
            : 0;
        const sizeSqFt = backendProperty.sizeSqft
            ? typeof backendProperty.sizeSqft === 'string'
                ? parseFloat(backendProperty.sizeSqft) || 0
                : Number(backendProperty.sizeSqft) || 0
            : 0;

        // Get financials
        let monthlyRent = 0;
        if (backendProperty.leasing?.monthlyRent) {
            monthlyRent = typeof backendProperty.leasing.monthlyRent === 'string'
                ? parseFloat(backendProperty.leasing.monthlyRent) || 0
                : Number(backendProperty.leasing.monthlyRent) || 0;
        } else if (backendProperty.marketRent) {
            monthlyRent = typeof backendProperty.marketRent === 'string'
                ? parseFloat(backendProperty.marketRent) || 0
                : Number(backendProperty.marketRent) || 0;
        }

        // Get features and amenities from backend
        const features = backendProperty.amenities?.propertyFeatures || [];
        const amenities = backendProperty.amenities?.propertyAmenities || [];

        // Get parking, laundry, AC
        const parking = backendProperty.amenities?.parking || 'NONE';
        const laundry = backendProperty.amenities?.laundry || 'NONE';
        const airConditioning = backendProperty.amenities?.airConditioning || 'NONE';

        return {
            id: backendProperty.id,
            name: backendProperty.propertyName,
            address,
            country,
            image,
            type,
            yearBuilt: backendProperty.yearBuilt?.toString() || '--',
            mlsNumber: backendProperty.mlsNumber || '--',
            status,
            specifications: {
                bedrooms,
                bathrooms,
                sizeSqFt,
            },
            financials: {
                balance: monthlyRent,
                currency: getCurrencySymbol(country),
            },
            features,
            amenities,
            parking,
            laundry,
            airConditioning,
            description: backendProperty.description || '',
            attachments: backendProperty.attachments || [],
            // Mock stats for now (can be replaced with real data when available)
            stats: {
                equipment: 0,
                recurringRequests: 0,
                tenants: 0,
                maintenance: 0
            },
        };
    }, [backendProperty]);

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto min-h-screen pb-10 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C] mx-auto mb-4" />
                    <p className="text-gray-600">Loading property details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !property) {
        return (
            <div className="max-w-6xl mx-auto min-h-screen pb-10 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-4">
                        {error instanceof Error ? error.message : 'Failed to load property details'}
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/properties')}
                        className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5554] transition-colors"
                    >
                        Back to Properties
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto min-h-screen pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/properties')}>Properties</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{property?.name || 'Property'}</span>
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
                        <h1 className="text-2xl font-bold text-gray-800">{property?.name || 'Property'}</h1>
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

                {/* Hero Image & Property Info Section */}
                <div className="mb-10 p-6 shadow-lg rounded-3xl border border-gray-300">
                    {/* Hero Image */}
                    <div className="w-full h-80 rounded-3xl overflow-hidden mb-8 shadow-lg">
                        {property.image ? (
                            <img
                                src={property.image}
                                alt={property.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // If image fails to load, show placeholder
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const placeholder = target.nextElementSibling as HTMLElement;
                                    if (placeholder) {
                                        placeholder.style.display = 'flex';
                                    }
                                }}
                            />
                        ) : null}
                        <div 
                            className={`w-full h-full ${property.image ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300`}
                        >
                            <div className="text-center">
                                <div className="text-gray-400 text-6xl mb-2">🏠</div>
                                <p className="text-gray-500 text-sm font-medium">No Image Available</p>
                            </div>
                        </div>
                    </div>

                    {/* Property Info Center */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-[#E8F3F1] px-6 py-2 rounded-full mb-3">
                            <h2 className="text-[#3A6D6C] font-bold text-lg">{property?.name || 'Property'}</h2>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm font-medium mb-6">
                            <MapPin className="w-4 h-4 mr-2" />
                            {property?.address || 'Address not available'}
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
                                    {property.stats.tenants}
                                </div>
                                <span className="text-gray-700 text-sm font-medium">Tenants</span>
                            </div>
                            <div className="flex items-center bg-white px-4 py-2 rounded-full border border-[#82D64D] shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-[#82D64D] text-white flex items-center justify-center text-xs font-bold mr-2">
                                    {property.stats.maintenance}
                                </div>
                                <span className="text-gray-700 text-sm font-medium">Maintenance</span>
                            </div>
                        </div>

                        {/* Assigned Team & Bank */}
                        <div className="flex flex-col md:flex-row gap-12 mt-5 w-full justify-center items-center">
                            <div className="relative w-80">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#3d7475] text-white px-10 py-3 rounded-full flex items-center gap-2 font-bold shadow-sm z-10 whitespace-nowrap">
                                    <Users className="w-5 h-5" strokeWidth={2.5} />
                                    <span>Assigned Team</span>
                                </div>
                                <div className="bg-[#F0F0F6] border-2 border-[#7BD747] rounded-[2.5rem] p-4 pt-10 flex flex-col items-center justify-center h-auto w-full">
                                    <p className="text-[#5C6B7F] text-center font-medium mb-4">No assigned members</p>
                                    <button className="py-2 px-6 rounded-full cursor-pointer bg-[#BEFB9B] text-[#2E6819] border border-2 border-[#2E6819] font-bold text-sm hover:opacity-80 transition-opacity">
                                        Assign
                                    </button>
                                </div>
                            </div>
                            <div className="relative w-80">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#3d7475] text-white px-10 py-3 rounded-full flex items-center gap-2 font-bold shadow-sm z-10 whitespace-nowrap">
                                    <Landmark className="w-5 h-5" strokeWidth={2.5} />
                                    <span>Bank Account</span>
                                </div>
                                <div className="bg-[#F0F0F6] border-2 border-[#7BD747] rounded-[2.5rem] p-4 pt-10 flex flex-col items-center justify-center h-auto w-full">
                                    <p className="text-[#5C6B7F] text-center font-medium mb-4">No bank account assigned</p>
                                    <button className="py-2 px-6 rounded-full cursor-pointer bg-[#BEFB9B] text-[#2E6819] border border-2 border-[#2E6819] font-bold text-sm hover:opacity-80 transition-opacity">
                                        Assign
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <DetailTabs
                    tabs={['Profile', 'Specs', 'Financials', 'Service Providers']}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />


                {/* Content based on active tab */}
                {activeTab === 'profile' && (
                    <>
                        {/* Financials Chart Section */}
                        <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Financials, {property?.financials?.currency || 'INR'}</h3>
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
                                        {idx === 3 && property?.financials && (
                                            <div className="mb-2 bg-[#E8E8EA] px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-gray-700 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-[#3A6D6C]"></div>
                                                {property.financials.currency} {property.financials.balance.toLocaleString()}
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

                        {/* Features & Amenities Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Property Features */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Property features</h3>
                                    <span className="bg-[#82D64D] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                        {property.features?.length || 0}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {property?.features && property.features.length > 0 ? (
                                        property.features.map((feature, index) => (
                                            <span key={index} className="bg-[#82D64D] text-white px-6 py-2 rounded-full text-sm font-medium">
                                                {feature}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">No features listed</span>
                                    )}
                                </div>
                            </div>

                            {/* Property Amenities */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Property amenities</h3>
                                    <span className="bg-[#82D64D] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                        {property.amenities?.length || 0}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {property?.amenities && property.amenities.length > 0 ? (
                                        property.amenities.map((amenity, index) => (
                                            <span key={index} className="bg-[#82D64D] text-white px-6 py-2 rounded-full text-sm font-medium">
                                                {amenity}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">No amenities listed</span>
                                    )}
                                </div>
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
                                            {property?.name || '--'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Year built</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {property?.yearBuilt || '--'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">MLS #</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {property?.mlsNumber || '--'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Property status</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {property?.status || '--'}
                                        </div>
                                    </div>
                                </div>

                                <h4 className="text-base font-bold text-gray-700 mb-4">{property?.type || 'Property'}</h4>
                                <div className="flex gap-4 mb-6">
                                    <div className="bg-[#82D64D] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                                        <BedDouble className="w-4 h-4" />
                                        Bedrooms
                                        <span className="bg-white text-[#82D64D] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{property?.specifications?.bedrooms || 0}</span>
                                    </div>
                                    <div className="bg-[#82D64D] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                                        <Bath className="w-4 h-4" />
                                        Bathrooms
                                        <span className="bg-white text-[#82D64D] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{property?.specifications?.bathrooms || 0}</span>
                                    </div>
                                    <div className="bg-[#82D64D] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                                        <Maximize className="w-4 h-4" />
                                        Size, sq.ft
                                        <span className="bg-white text-[#82D64D] min-w-[1.25rem] h-5 px-1.5 rounded-full flex items-center justify-center text-xs font-bold">{property?.specifications?.sizeSqFt || 0}</span>
                                    </div>
                                </div>

                                <div className="bg-[#DCDCDF] rounded-2xl p-6 grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Parking</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {property?.parking && property.parking !== 'NONE' ? property.parking.replace(/_/g, ' ') : 'None'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Laundry</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {property?.laundry && property.laundry !== 'NONE' ? property.laundry.replace(/_/g, ' ') : 'None'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Air Conditioning</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {property?.airConditioning && property.airConditioning !== 'NONE' ? property.airConditioning.replace(/_/g, ' ') : 'None'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
                            <div className="bg-[#E8E8EA] rounded-[2rem] p-6 min-h-[160px]">
                                {property?.description ? (
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{property.description}</p>
                                ) : (
                                    <p className="text-gray-400 text-sm italic">No description available</p>
                                )}
                            </div>
                        </div>

                        {/* Property Attachments */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Property attachments</h3>
                            <div className="bg-[#E8E8EA] rounded-[2rem] p-6 min-h-[160px]">
                                {property?.attachments && property.attachments.length > 0 ? (
                                    <div className="flex flex-wrap gap-4">
                                        {property.attachments.map((attachment: any, index: number) => (
                                            <a
                                                key={index}
                                                href={attachment.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                {attachment.description || attachment.fileType || 'Attachment'}
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No attachments added</p>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'specs' && <SpecsTab />}
                {activeTab === 'financials' && <FinancialsTab />}
                {activeTab === 'service providers' && <ServiceProvidersTab />}

            </div>
        </div>
    );
};

export default PropertyDetail;
