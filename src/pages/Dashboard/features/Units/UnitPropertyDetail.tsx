import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronDown,
    Edit,
    MapPin,
    Users,
    Landmark,
    BedDouble,
    Bath,
    Maximize,
    Loader2,
} from 'lucide-react';
import SpecsTab from '../Properties/components/SpecsTab';
import ServiceProvidersTab from '../Properties/components/ServiceProvidersTab';
import PhotoGalleryModal from '../Properties/components/PhotoGalleryModal';
import DetailTabs from '../../components/DetailTabs';
import { useGetProperty } from '../../../../hooks/usePropertyQueries';
import { useGetUnit } from '../../../../hooks/useUnitQueries';
import Breadcrumb from '../../../../components/ui/Breadcrumb';

const UnitPropertyDetail: React.FC = () => {
    const { unitId } = useParams<{ unitId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const propertyId = searchParams.get('propertyId');
    const [activeTab, setActiveTab] = useState('profile');
    const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryStartIndex, setGalleryStartIndex] = useState(0);
    const actionDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
                setIsActionDropdownOpen(false);
            }
        };

        if (isActionDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isActionDropdownOpen]);

    // Fetch property data (for address and property name) - optional, can work without it
    const { data: backendProperty, isLoading: isLoadingProperty } = useGetProperty(propertyId || null, !!propertyId);

    // Fetch full unit data - required
    const { data: unitData, isLoading: isLoadingUnit, error: unitError } = useGetUnit(unitId || null, !!unitId);

    const isLoading = isLoadingUnit || (!!propertyId && isLoadingProperty);
    const error = unitError;

    // Transform unit data to component format
    const unit = useMemo(() => {
        if (!unitData) return null;

        // Format address from property (if available)
        let address = 'Address not available';
        if (backendProperty?.address) {
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

        // Get unit photos - ONLY use unit photos, no fallback to property
        const photos = unitData.photos && unitData.photos.length > 0
            ? unitData.photos.map((p: any) => p.photoUrl)
            : [];

        // Get primary image from unit photos only
        const image = photos.length > 0
            ? photos[0]
            : unitData.coverPhotoUrl || null;

        // Determine occupancy status
        let occupancyStatus = 'Vacant';
        if (unitData.listings && Array.isArray(unitData.listings) && unitData.listings.length > 0) {
            const activeListing = unitData.listings[0];
            if (activeListing.occupancyStatus === 'OCCUPIED' || activeListing.occupancyStatus === 'PARTIALLY_OCCUPIED') {
                occupancyStatus = 'Occupied';
            }
        } else if (unitData.leasing) {
            occupancyStatus = 'Occupied';
        }

        // Get financials
        const monthlyRent = unitData.rent
            ? (typeof unitData.rent === 'string' ? parseFloat(unitData.rent) : Number(unitData.rent)) || 0
            : 0;

        let deposit = 0;
        if (unitData.leasing?.securityDeposit) {
            deposit = typeof unitData.leasing.securityDeposit === 'string'
                ? parseFloat(unitData.leasing.securityDeposit) || 0
                : Number(unitData.leasing.securityDeposit) || 0;
        }

        // Get amenities from unit
        const unitAmenities = unitData.amenities;
        const features = unitAmenities?.propertyFeatures || [];
        const amenities = unitAmenities?.propertyAmenities || [];
        const parking = unitAmenities?.parking || 'NONE';
        const laundry = unitAmenities?.laundry || 'NONE';
        const airConditioning = unitAmenities?.airConditioning || 'NONE';

        return {
            id: unitData.id,
            name: backendProperty
                ? `${backendProperty.propertyName} - ${unitData.unitName || 'Unit'}`
                : unitData.unitName || 'Unit',
            address,
            country: backendProperty?.address?.country,
            image,
            photos,
            type: 'Single Family',
            status: occupancyStatus,
            specifications: {
                bedrooms: unitData.beds || 0,
                bathrooms: unitData.baths
                    ? (typeof unitData.baths === 'string' ? parseFloat(unitData.baths) : Number(unitData.baths)) || 0
                    : 0,
                sizeSqFt: unitData.sizeSqft
                    ? (typeof unitData.sizeSqft === 'string' ? parseFloat(unitData.sizeSqft) : Number(unitData.sizeSqft)) || 0
                    : 0,
            },
            financials: {
                balance: monthlyRent,
                currency: '$',
            },
            features,
            amenities,
            parking,
            laundry,
            airConditioning,
            description: unitData.description || '',
            marketRent: monthlyRent,
            deposit,
            yearBuilt: backendProperty?.yearBuilt?.toString() || '--',
            mlsNumber: backendProperty?.mlsNumber || '--',
            stats: {
                equipment: 0,
                recurringRequests: 0,
                tenants: occupancyStatus === 'Occupied' ? 1 : 0,
                maintenance: 0,
            },
        };
    }, [unitData, backendProperty]);

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto min-h-screen pb-10 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C] mx-auto mb-4" />
                    <p className="text-gray-600">Loading unit details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !unit) {
        return (
            <div className="max-w-6xl mx-auto min-h-screen pb-10 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-4">
                        {error instanceof Error ? error.message : 'Failed to load unit details'}
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/portfolio/units')}
                        className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5554] transition-colors"
                    >
                        Back to Units
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto min-h-screen pb-10">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Units', path: '/dashboard/portfolio/units' },
                    { label: unit?.name || 'Unit' }
                ]}
                className="mb-6"
            />

            <div className="bg-[#E0E8E7] rounded-[2rem] p-6 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">{unit?.name || 'Unit'}</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5554] transition-colors">
                            Move In
                        </button>
                        <div className="relative" ref={actionDropdownRef}>
                            <button
                                onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                                className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5554] transition-colors flex items-center gap-2"
                            >
                                Action
                                <ChevronDown className={`w-4 h-4 transition-transform ${isActionDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isActionDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            // Navigate first, then close dropdown
                                            if (unitId && propertyId) {
                                                navigate(`/dashboard/units/edit/${unitId}?propertyId=${propertyId}`);
                                            } else if (unitId) {
                                                navigate(`/dashboard/units/edit/${unitId}`);
                                            } else {
                                                console.error('unitId is missing, cannot navigate to edit page');
                                            }

                                            // Close dropdown after navigation
                                            setIsActionDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3A6D6C] transition-colors flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hero Image & Unit Info Section */}
                <div className="mb-10 p-6 rounded-[2rem] shadow-lg">
                    {/* Hero Image Banner */}
                    <div
                        className="w-full h-[400px] rounded-[2rem] overflow-hidden mb-6 shadow-md relative group cursor-pointer"
                        onClick={() => {
                            if (unit.photos && unit.photos.length > 0) {
                                setGalleryStartIndex(0);
                                setIsGalleryOpen(true);
                            }
                        }}
                    >
                        {unit.photos && unit.photos.length > 0 ? (
                            <img
                                src={unit.photos[0]}
                                alt={unit.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const placeholder = target.nextElementSibling as HTMLElement;
                                    if (placeholder) placeholder.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div
                            className={`w-full h-full ${unit.photos && unit.photos.length > 0 ? 'hidden' : 'flex'} items-center justify-center bg-gray-100 rounded-[2rem]`}
                        >
                            <div className="text-center">
                                <div className="text-gray-300 text-6xl mb-2">🏠</div>
                                <p className="text-gray-400 text-sm font-medium">No Image Available</p>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails Carousel */}
                    {unit.photos && unit.photos.length > 1 && (
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 w-full">
                                {unit.photos.slice(1).map((photo: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setGalleryStartIndex(index + 1);
                                            setIsGalleryOpen(true);
                                        }}
                                        className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all duration-300 opacity-90 hover:opacity-100 hover:scale-105 shadow-sm hover:shadow-md"
                                    >
                                        <img
                                            src={photo}
                                            alt={`View ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Unit Info Center */}
                    <div className="p-6 flex flex-col items-center">
                        <div className="bg-[#E8F3F1] px-6 py-2 rounded-full mb-3">
                            <h2 className="text-[#3A6D6C] font-bold text-lg">{unit?.name || 'Unit'}</h2>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm font-medium mb-6">
                            <MapPin className="w-4 h-4 mr-2" />
                            {unit?.address || 'Address not available'}
                        </div>

                        {/* Quick Stats Pills */}
                        <div className="flex gap-4 mb-8 flex-wrap justify-center">
                            <div className="flex items-center bg-white px-4 py-2 rounded-full border border-[#82D64D] shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-[#82D64D] text-white flex items-center justify-center text-xs font-bold mr-2">
                                    {unit.stats.equipment}
                                </div>
                                <span className="text-gray-700 text-sm font-medium">Equipment</span>
                            </div>
                            <div className="flex items-center bg-white px-4 py-2 rounded-full border border-[#82D64D] shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-[#82D64D] text-white flex items-center justify-center text-xs font-bold mr-2">
                                    {unit.stats.recurringRequests}
                                </div>
                                <span className="text-gray-700 text-sm font-medium">Recurring Requests</span>
                            </div>
                            <div className="flex items-center bg-white px-4 py-2 rounded-full border border-[#82D64D] shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-[#82D64D] text-white flex items-center justify-center text-xs font-bold mr-2">
                                    {unit.stats.tenants}
                                </div>
                                <span className="text-gray-700 text-sm font-medium">Tenants</span>
                            </div>
                            <div className="flex items-center bg-white px-4 py-2 rounded-full border border-[#82D64D] shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-[#82D64D] text-white flex items-center justify-center text-xs font-bold mr-2">
                                    {unit.stats.maintenance}
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
                                    <button className="py-2 px-6 rounded-full cursor-pointer bg-[#BEFB9B] text-[#2E6819] border-2 border-[#2E6819] font-bold text-sm hover:opacity-80 transition-opacity">
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
                                    <button className="py-2 px-6 rounded-full cursor-pointer bg-[#BEFB9B] text-[#2E6819] border-2 border-[#2E6819] font-bold text-sm hover:opacity-80 transition-opacity">
                                        Assign
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <DetailTabs
                    tabs={['Profile', 'Specs', 'Service Providers']}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Content based on active tab */}
                {activeTab === 'profile' && (
                    <>
                        {/* Financials Chart Section */}
                        <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Financials, {unit?.financials?.currency || 'INR'}</h3>
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
                                        {idx === 3 && unit?.financials && (
                                            <div className="mb-2 bg-[#E8E8EA] px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-gray-700 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-[#3A6D6C]"></div>
                                                {unit.financials.currency} {unit.financials.balance.toLocaleString()}
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
                            {/* Unit Features */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Unit features</h3>
                                    <span className="bg-[#82D64D] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                        {unit.features?.length || 0}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {unit?.features && unit.features.length > 0 ? (
                                        unit.features.map((feature: string, index: number) => (
                                            <span key={index} className="bg-[#82D64D] text-white px-6 py-2 rounded-full text-sm font-medium">
                                                {feature}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">No features listed</span>
                                    )}
                                </div>
                            </div>

                            {/* Unit Amenities */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Unit amenities</h3>
                                    <span className="bg-[#82D64D] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                        {unit.amenities?.length || 0}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {unit?.amenities && unit.amenities.length > 0 ? (
                                        unit.amenities.map((amenity: string, index: number) => (
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
                                <div className={`grid ${backendProperty ? 'grid-cols-4' : 'grid-cols-3'} gap-6 mb-6`}>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Unit name</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {unitData?.unitName || '--'}
                                        </div>
                                    </div>
                                    {backendProperty && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-2">Property name</label>
                                            <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                                {backendProperty.propertyName || '--'}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Year built</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {unit?.yearBuilt || '--'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Unit status</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {unit?.status || '--'}
                                        </div>
                                    </div>
                                </div>

                                {/* Specifications Section */}
                                <h4 className="text-base font-bold text-gray-700 mb-4">Unit Specifications</h4>
                                <div className="flex gap-4 mb-6">
                                    <div className="bg-[#82D64D] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                                        <BedDouble className="w-4 h-4" />
                                        Bedrooms
                                        <span className="bg-white text-[#82D64D] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{unit?.specifications?.bedrooms || 0}</span>
                                    </div>
                                    <div className="bg-[#82D64D] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                                        <Bath className="w-4 h-4" />
                                        Bathrooms
                                        <span className="bg-white text-[#82D64D] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{unit?.specifications?.bathrooms || 0}</span>
                                    </div>
                                    <div className="bg-[#82D64D] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                                        <Maximize className="w-4 h-4" />
                                        Size, sq.ft
                                        <span className="bg-white text-[#82D64D] min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-xs font-bold">{unit?.specifications?.sizeSqFt || 0}</span>
                                    </div>
                                </div>

                                <div className="bg-[#DCDCDF] rounded-2xl p-6 grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Parking</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {unit?.parking && unit.parking !== 'NONE' ? unit.parking.replace(/_/g, ' ') : 'None'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Laundry</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {unit?.laundry && unit.laundry !== 'NONE' ? unit.laundry.replace(/_/g, ' ') : 'None'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Air Conditioning</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {unit?.airConditioning && unit.airConditioning !== 'NONE' ? unit.airConditioning.replace(/_/g, ' ') : 'None'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Market Rent</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {unit?.financials?.currency} {unit?.marketRent?.toLocaleString() || '0'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Deposit</label>
                                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                            {unit?.financials?.currency} {unit?.deposit?.toLocaleString() || '0'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
                            <div className="bg-[#E8E8EA] rounded-[2rem] p-6 min-h-[160px]">
                                {unit?.description ? (
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{unit.description}</p>
                                ) : (
                                    <p className="text-gray-400 text-sm italic">No description available</p>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'specs' && <SpecsTab />}
                {activeTab === 'service providers' && <ServiceProvidersTab />}

                <PhotoGalleryModal
                    isOpen={isGalleryOpen}
                    onClose={() => setIsGalleryOpen(false)}
                    images={unit.photos || []}
                    initialIndex={galleryStartIndex}
                />
            </div>
        </div>
    );
};

export default UnitPropertyDetail;
