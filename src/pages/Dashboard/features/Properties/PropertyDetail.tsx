import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronDown,
    Edit,
    Trash2,
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
import PhotoGalleryModal from './components/PhotoGalleryModal';
import DeletePropertyModal from './components/DeletePropertyModal';
import DetailTabs from '../../components/DetailTabs';
import { useGetProperty } from '../../../../hooks/usePropertyQueries';
import { useGetUnit } from '../../../../hooks/useUnitQueries';
import { propertyService, isSummaryUnits } from '../../../../services/property.service';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Label, Legend, Pie, PieChart } from "recharts";

import { type UnitGroup } from '../Units/components/UnitGroupCard';

// Mock data from Units feature
const mockUnitsData: UnitGroup[] = [
    {
        id: '1',
        propertyName: 'Downtown Loft',
        address: '12 MG Road, Bangalore, KA 560001, IN',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        status: 'Occupied',
        units: [
            {
                id: 'u1',
                name: 'Studio',
                type: 'Single-Family',
                status: 'Occupied',
                rent: 18000,
                beds: 1,
                baths: 1,
                sqft: 850,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    {
        id: '1a',
        propertyName: 'Skyline Villa',
        address: '89 Whitefield, Bangalore, KA 560066, IN',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        status: 'Vacant',
        units: [
            {
                id: 'u1a',
                name: 'Penthouse',
                type: 'Single-Family',
                status: 'Vacant',
                rent: 35000,
                beds: 3,
                baths: 2,
                sqft: 1800,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    {
        id: '2',
        propertyName: 'Green Valley Complex',
        address: '45 Residency Road, Mumbai, MH 400020, IN',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        status: 'Partially Occupied',
        units: [
            {
                id: 'u2',
                name: 'Unit A',
                type: 'Apartment',
                status: 'Occupied',
                rent: 22000,
                beds: 2,
                baths: 2,
                sqft: 1400,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u3',
                name: 'Unit B',
                type: 'Apartment',
                status: 'Vacant',
                rent: 22000,
                beds: 2,
                baths: 2,
                sqft: 1400,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    {
        id: '3',
        propertyName: 'Sunrise Apartments',
        address: '78 Scheme No 78 - II, Indore, MP 452010, IN',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        status: 'Partially Occupied',
        units: [
            {
                id: 'u4',
                name: 'Unit 101',
                type: 'Apartment',
                status: 'Occupied',
                rent: 15000,
                beds: 2,
                baths: 1,
                sqft: 1200,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u5',
                name: 'Unit 102',
                type: 'Apartment',
                status: 'Vacant',
                rent: 15000,
                beds: 2,
                baths: 1,
                sqft: 1200,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u6',
                name: 'Unit 103',
                type: 'Apartment',
                status: 'Occupied',
                rent: 15000,
                beds: 2,
                baths: 1,
                sqft: 1200,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u7',
                name: 'Unit 104',
                type: 'Apartment',
                status: 'Vacant',
                rent: 15000,
                beds: 2,
                baths: 1,
                sqft: 1200,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u8',
                name: 'Unit 105',
                type: 'Apartment',
                status: 'Occupied',
                rent: 15000,
                beds: 2,
                baths: 1,
                sqft: 1200,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    {
        id: '4',
        propertyName: 'Maple Heights',
        address: '55 Park Street, Kolkata, WB 700016, IN',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        status: 'Occupied',
        units: [
            {
                id: 'u9',
                name: 'Unit 201',
                type: 'Apartment',
                status: 'Occupied',
                rent: 28000,
                beds: 3,
                baths: 2,
                sqft: 1800,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u10',
                name: 'Unit 202',
                type: 'Apartment',
                status: 'Occupied',
                rent: 28000,
                beds: 3,
                baths: 2,
                sqft: 1800,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u11',
                name: 'Unit 203',
                type: 'Apartment',
                status: 'Occupied',
                rent: 28000,
                beds: 3,
                baths: 2,
                sqft: 1800,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u12',
                name: 'Unit 204',
                type: 'Apartment',
                status: 'Occupied',
                rent: 28000,
                beds: 3,
                baths: 2,
                sqft: 1800,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u13',
                name: 'Unit 205',
                type: 'Apartment',
                status: 'Occupied',
                rent: 28000,
                beds: 3,
                baths: 2,
                sqft: 1800,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u14',
                name: 'Unit 206',
                type: 'Apartment',
                status: 'Occupied',
                rent: 28000,
                beds: 3,
                baths: 2,
                sqft: 1800,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u15',
                name: 'Unit 207',
                type: 'Apartment',
                status: 'Occupied',
                rent: 28000,
                beds: 3,
                baths: 2,
                sqft: 1800,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    {
        id: '5',
        propertyName: 'Ocean View Residency',
        address: '33 Marine Drive, Mumbai, MH 400002, IN',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        status: 'Partially Occupied',
        units: [
            {
                id: 'u16',
                name: 'Unit 301',
                type: 'Apartment',
                status: 'Occupied',
                rent: 45000,
                beds: 4,
                baths: 3,
                sqft: 2500,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u17',
                name: 'Unit 302',
                type: 'Apartment',
                status: 'Vacant',
                rent: 45000,
                beds: 4,
                baths: 3,
                sqft: 2500,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u18',
                name: 'Unit 303',
                type: 'Apartment',
                status: 'Occupied',
                rent: 45000,
                beds: 4,
                baths: 3,
                sqft: 2500,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u19',
                name: 'Unit 304',
                type: 'Apartment',
                status: 'Vacant',
                rent: 45000,
                beds: 4,
                baths: 3,
                sqft: 2500,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u20',
                name: 'Unit 305',
                type: 'Apartment',
                status: 'Occupied',
                rent: 45000,
                beds: 4,
                baths: 3,
                sqft: 2500,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u21',
                name: 'Unit 306',
                type: 'Apartment',
                status: 'Occupied',
                rent: 45000,
                beds: 4,
                baths: 3,
                sqft: 2500,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u22',
                name: 'Unit 307',
                type: 'Apartment',
                status: 'Vacant',
                rent: 45000,
                beds: 4,
                baths: 3,
                sqft: 2500,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 'u23',
                name: 'Unit 308',
                type: 'Apartment',
                status: 'Occupied',
                rent: 45000,
                beds: 4,
                baths: 3,
                sqft: 2500,
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
            }
        ]
    }
];

const PropertyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const unitId = searchParams.get('unitId'); // Get unit ID from query parameter
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };

    // All hooks must be declared before any early returns
    const [activeTab, setActiveTab] = useState('profile');
    const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryStartIndex, setGalleryStartIndex] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const actionDropdownRef = useRef<HTMLDivElement>(null);

    // Redirect to UnitPropertyDetail if viewing a unit
    useEffect(() => {
        if (unitId && id) {
            navigate(`/dashboard/units/${unitId}?propertyId=${id}`, { replace: true });
            return;
        }
    }, [unitId, id, navigate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
                setIsActionDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch property data from backend
    const { data: backendProperty, isLoading: isLoadingProperty, error: propertyError } = useGetProperty(id || null, !!id);

    // Fetch full unit data if viewing a specific unit
    const { data: fullUnitData, isLoading: isLoadingUnit, error: unitError } = useGetUnit(unitId || null, !!unitId && !!id);

    const isLoading = isLoadingProperty || isLoadingUnit;
    const error = propertyError || unitError;

    // Early return if redirecting (prevents rendering property detail)
    // This must come after all hooks to maintain hook call order
    if (unitId && id) {
        return null;
    }

    // Delete handler
    const handleDelete = async () => {
        if (!id) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await propertyService.delete(id);
            // Navigate to properties list after successful deletion
            navigate('/dashboard/properties');
        } catch (err) {
            console.error('Error deleting property:', err);
            setDeleteError(err instanceof Error ? err.message : 'Failed to delete property');
            setIsDeleting(false);
        }
    };

    // Check if we need to use mock data (when backend returns no data)
    const mockData = useMemo(() => {
        if (!id || backendProperty) return null;

        // Try to find property by ID
        const property = mockUnitsData.find(p => p.id === id);
        if (property) return { property, unit: property.units[0] };

        // Try to find unit by ID
        for (const p of mockUnitsData) {
            const unit = p.units.find(u => u.id === id);
            if (unit) return { property: p, unit };
        }

        return null;
    }, [id, backendProperty]);

    // Transform backend property to component format
    const property = useMemo(() => {
        // If we have mock property data, transform it
        if (mockData && !backendProperty) {
            const { property: mockProp, unit: targetUnit } = mockData;
            const totalUnits = mockProp.units.length;
            const occupiedUnits = mockProp.units.filter(u => u.status === 'Occupied').length;

            const isUnitView = targetUnit.id === id;

            const photos = [
                mockProp.image,
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600596542815-27b88e39e169?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
            ];

            return {
                id: mockProp.id,
                name: isUnitView ? `${mockProp.propertyName} - ${targetUnit.name}` : mockProp.propertyName,
                address: mockProp.address,
                country: 'IN',
                image: mockProp.image,
                photos,
                type: totalUnits > 1 ? 'Multi Family' : 'Single Family',
                yearBuilt: '--',
                mlsNumber: '--',
                status: mockProp.status,
                specifications: {
                    bedrooms: targetUnit?.beds || 0,
                    bathrooms: targetUnit?.baths || 0,
                    sizeSqFt: targetUnit?.sqft || 0,
                },
                financials: {
                    balance: targetUnit?.rent || 0,
                    currency: '₹',
                },
                features: [],
                amenities: [],
                parking: 'NONE',
                laundry: 'NONE',
                airConditioning: 'NONE',
                description: `${mockProp.propertyName} is a ${totalUnits > 1 ? `${totalUnits}-unit property` : 'single-family property'} located at ${mockProp.address}. Currently ${occupiedUnits} of ${totalUnits} units are occupied.`,
                attachments: [],
                stats: {
                    equipment: 0,
                    recurringRequests: 0,
                    tenants: occupiedUnits,
                    maintenance: 0
                },
                // Add units data for display
                units: mockProp.units,
                totalUnits,
                occupiedUnits,
                isUnitView,
                marketRent: targetUnit?.rent || 0,
                deposit: (targetUnit?.rent || 0) * 1.5,
            };
        }

        if (!backendProperty) return null;

        // Check if we're viewing a specific unit
        // Use full unit data from unit service if available, otherwise fall back to property response
        let selectedUnit: any = null;
        if (unitId && backendProperty.propertyType === 'MULTI') {
            if (fullUnitData) {
                // Use full unit data from unit service (includes photos, amenities, etc.)
                selectedUnit = fullUnitData;
            } else if (backendProperty.units) {
                // Fallback to simplified unit data from property response
                const unitsArray = isSummaryUnits(backendProperty.units)
                    ? backendProperty.units.units
                    : backendProperty.units;
                selectedUnit = unitsArray.find((u: any) => u.id === unitId);
            }
        }

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

        // Get image - for unit view, prioritize unit photos, otherwise use property photos
        let image: string | null = null;
        if (selectedUnit && fullUnitData) {
            // Use unit photos if available
            image = fullUnitData.photos && fullUnitData.photos.length > 0
                ? (fullUnitData.photos.find((p: any) => p.isPrimary)?.photoUrl || fullUnitData.photos[0].photoUrl)
                : fullUnitData.coverPhotoUrl || null;
        } else {
            // Use property photos
            image = backendProperty.coverPhotoUrl
                || backendProperty.photos?.find((p) => p.isPrimary)?.photoUrl
                || backendProperty.photos?.[0]?.photoUrl
                || null;
        }

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

        // Get specifications - use unit data if viewing a specific unit
        let bedrooms = 0;
        let bathrooms = 0;
        let sizeSqFt = 0;
        let monthlyRent = 0;
        let deposit = 0;

        if (selectedUnit) {
            // Use unit-specific data
            bedrooms = selectedUnit.beds || 0;
            bathrooms = selectedUnit.baths
                ? (typeof selectedUnit.baths === 'string' ? parseFloat(selectedUnit.baths) : Number(selectedUnit.baths)) || 0
                : 0;
            sizeSqFt = selectedUnit.sizeSqft
                ? (typeof selectedUnit.sizeSqft === 'string' ? parseFloat(selectedUnit.sizeSqft) : Number(selectedUnit.sizeSqft)) || 0
                : 0;
            monthlyRent = selectedUnit.rent
                ? (typeof selectedUnit.rent === 'string' ? parseFloat(selectedUnit.rent) : Number(selectedUnit.rent)) || 0
                : 0;
            // Get deposit from unit if available (from backend simplified response)
            if (selectedUnit.deposit !== undefined && selectedUnit.deposit !== null) {
                deposit = typeof selectedUnit.deposit === 'string'
                    ? parseFloat(selectedUnit.deposit) || 0
                    : Number(selectedUnit.deposit) || 0;
            }
        } else {
            // Use property-level data
            bedrooms = backendProperty.singleUnitDetails?.beds || 0;
            bathrooms = backendProperty.singleUnitDetails?.baths
                ? typeof backendProperty.singleUnitDetails.baths === 'string'
                    ? parseFloat(backendProperty.singleUnitDetails.baths) || 0
                    : Number(backendProperty.singleUnitDetails.baths) || 0
                : 0;
            sizeSqFt = backendProperty.sizeSqft
                ? typeof backendProperty.sizeSqft === 'string'
                    ? parseFloat(backendProperty.sizeSqft) || 0
                    : Number(backendProperty.sizeSqft) || 0
                : 0;

            // Get financials
            if (backendProperty.leasing?.monthlyRent) {
                monthlyRent = typeof backendProperty.leasing.monthlyRent === 'string'
                    ? parseFloat(backendProperty.leasing.monthlyRent) || 0
                    : Number(backendProperty.leasing.monthlyRent) || 0;
            } else if (backendProperty.marketRent) {
                monthlyRent = typeof backendProperty.marketRent === 'string'
                    ? parseFloat(backendProperty.marketRent) || 0
                    : Number(backendProperty.marketRent) || 0;
            }
        }

        // Get deposit (only if not already set from unit)
        if (deposit === 0 && backendProperty.leasing?.securityDeposit) {
            deposit = typeof backendProperty.leasing.securityDeposit === 'string'
                ? parseFloat(backendProperty.leasing.securityDeposit) || 0
                : Number(backendProperty.leasing.securityDeposit) || 0;
        }

        // Get features and amenities from backend
        // For unit view, use unit amenities if available, otherwise property amenities
        const unitAmenities = selectedUnit?.amenities;
        const features = unitAmenities?.propertyFeatures || backendProperty.amenities?.propertyFeatures || [];
        const amenities = unitAmenities?.propertyAmenities || backendProperty.amenities?.propertyAmenities || [];

        // Get parking, laundry, AC - use unit amenities if available
        const parking = unitAmenities?.parking || backendProperty.amenities?.parking || 'NONE';
        const laundry = unitAmenities?.laundry || backendProperty.amenities?.laundry || 'NONE';
        const airConditioning = unitAmenities?.airConditioning || backendProperty.amenities?.airConditioning || 'NONE';

        // Get photos - use unit photos if viewing a unit, otherwise use property photos
        let photos: string[] = [];
        if (selectedUnit && fullUnitData && fullUnitData.photos && fullUnitData.photos.length > 0) {
            // Use unit photos
            photos = fullUnitData.photos.map((p: any) => p.photoUrl);
        } else {
            // Use property photos
            photos = backendProperty.photos?.map((p: any) => p.photoUrl) || [];
        }
        if (photos.length === 0 && image) photos = [image];

        // Determine if this is a unit view
        const isUnitView = !!selectedUnit;

        // Build property name - include unit name if viewing a specific unit
        const propertyName = selectedUnit
            ? `${backendProperty.propertyName} - ${selectedUnit.unitName || 'Unit'}`
            : backendProperty.propertyName;

        return {
            id: backendProperty.id,
            name: propertyName,
            address,
            country,
            image,
            photos,
            type: selectedUnit ? 'Single Family' : type, // Show as single family when viewing a unit
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
                currency: '$',
            },
            features,
            amenities,
            parking,
            laundry,
            airConditioning,
            description: selectedUnit
                ? `${backendProperty.propertyName} - ${selectedUnit.unitName || 'Unit'}. ${backendProperty.description || ''}`
                : backendProperty.description || '',
            attachments: backendProperty.attachments || [],
            // Mock stats for now (can be replaced with real data when available)
            stats: {
                equipment: 0,
                recurringRequests: 0,
                tenants: isUnitView ? (selectedUnit?.listings?.[0]?.occupancyStatus === 'OCCUPIED' || selectedUnit?.leasing ? 1 : 0) : 0,
                maintenance: 0
            },
            isUnitView,
            marketRent: monthlyRent,
            deposit,
            // Handle units structure: for MULTI properties, backend returns { count, units: [...] }
            units: backendProperty.units
                ? (isSummaryUnits(backendProperty.units) ? backendProperty.units.units : backendProperty.units)
                : [],
            totalUnits: backendProperty.units
                ? (isSummaryUnits(backendProperty.units) ? backendProperty.units.count : backendProperty.units.length)
                : 0,
            occupiedUnits: backendProperty.units
                ? (isSummaryUnits(backendProperty.units)
                    ? backendProperty.units.units.filter((u: any) => u.status === 'OCCUPIED').length
                    : 0) // TODO: Calculate from unit status when available for detailed array
                : 0,
        };
    }, [backendProperty, mockData, unitId, fullUnitData]);

    // Loading state
    if (isLoading) {
        return (
            <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen pb-10 flex items-center justify-center transition-all duration-300`}>
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C] mx-auto mb-4" />
                    <p className="text-gray-600">Loading property details...</p>
                </div>
            </div>
        );
    }

    // Error state - only show error if both backend and mock data failed
    if ((error || !property) && !mockData) {
        return (
            <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen pb-10 flex items-center justify-center transition-all duration-300`}>
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

    // If property is still null at this point, return null
    if (!property) {
        return null;
    }

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen pb-10 transition-all duration-300`}>
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
                            onClick={() => navigate(-1)}
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
                        <div className="relative" ref={actionDropdownRef}>
                            <button
                                onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                                className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5554] transition-colors flex items-center gap-2"
                            >
                                Action
                                <ChevronDown className={`w-4 h-4 transition-transform ${isActionDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isActionDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setIsActionDropdownOpen(false);
                                            navigate(`/dashboard/properties/edit/${id}`);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3A6D6C] transition-colors flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsActionDropdownOpen(false);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hero Image & Property Info Section */}
                <div className="mb-10 p-6 rounded-[2rem] shadow-lg">
                    {/* Hero Image Banner (Fixed Cover) */}
                    <div
                        className="w-full h-[400px] rounded-[2rem] overflow-hidden mb-6 shadow-md relative group cursor-pointer"
                        onClick={() => {
                            if (property.photos && property.photos.length > 0) {
                                setGalleryStartIndex(0);
                                setIsGalleryOpen(true);
                            }
                        }}
                    >
                        {property.photos && property.photos.length > 0 ? (
                            <img
                                src={property.photos[0]}
                                alt={property.name}
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
                            className={`w-full h-full ${property.photos && property.photos.length > 0 ? 'hidden' : 'flex'} items-center justify-center bg-gray-100 rounded-[2rem]`}
                        >
                            <div className="text-center">
                                <div className="text-gray-300 text-6xl mb-2">🏠</div>
                                <p className="text-gray-400 text-sm font-medium">No Image Available</p>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails Carousel */}
                    <div className="flex items-center justify-between mb-8">
                        {/* Scrollable thumbnails */}
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 w-full">
                            {property.photos && property.photos.slice(1).map((photo: string, index: number) => (
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

                    {/* Property Info Center */}
                    <div className="p-6 flex flex-col items-center">
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
                    tabs={property.isUnitView ? ['Profile', 'Specs', 'Service Providers'] : ['Profile', 'Specs', 'Financials', 'Service Providers']}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />


                {/* Content based on active tab */}
                {
                    activeTab === 'profile' && (
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

                            {/* Features & Amenities Row (Conditional for Multi Family) */}
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 mb-8">
                                {property.type === 'Multi Family' ? (
                                    <>
                                        {/* Column 1: Property Amenities (Replaces Features) */}
                                        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col">
                                            <div className="flex items-center gap-3 mb-4">
                                                <h3 className="text-lg font-bold text-gray-800">Property amenities</h3>
                                                <span className="bg-[#82D64D] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                                    {property.amenities?.length || 0}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {property?.amenities && property.amenities.length > 0 ? (
                                                    property.amenities.filter((amenity: any) => typeof amenity === 'string').map((amenity: string, index: number) => (
                                                        <span key={index} className="bg-[#82D64D] text-white px-6 py-2 rounded-full text-sm font-medium">
                                                            {amenity}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-sm italic">No amenities listed</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Column 2: Units Occupancy Pie Chart (Replaces Amenities) */}
                                        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col w-[340px]">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-gray-800">Units Occupancy</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => navigate('/dashboard/portfolio/units')}
                                                    className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-[#2c5554] transition-colors"
                                                >
                                                    View Units
                                                </button>
                                            </div>
                                            <ChartContainer
                                                config={{
                                                    units: {
                                                        label: "Units",
                                                    },
                                                    occupied: {
                                                        label: "Occupied",
                                                        color: "#7E22CE",
                                                    },
                                                    vacant: {
                                                        label: "Vacant",
                                                        color: "#D8B4FE",
                                                    },
                                                } satisfies ChartConfig}
                                                className="mx-auto h-min w-full"
                                            >
                                                <PieChart>
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={<ChartTooltipContent hideLabel className="bg-white border-gray-200 border shadow-lg rounded-md" />}
                                                    />
                                                    <Legend
                                                        layout="vertical"
                                                        verticalAlign="middle"
                                                        align="left"
                                                        iconType="circle"
                                                        iconSize={8}
                                                        formatter={(value) => {
                                                            const config = {
                                                                occupied: "Occupied",
                                                                vacant: "Vacant"
                                                            } as const;
                                                            return <span className="text-gray-700 font-semibold text-sm">{config[value as keyof typeof config] || value}</span>;
                                                        }}
                                                        wrapperStyle={{ paddingLeft: "20px" }}
                                                    />
                                                    <Pie
                                                        data={[
                                                            { browser: "occupied", units: property.occupiedUnits || 0, fill: "var(--color-occupied)" },
                                                            { browser: "vacant", units: (property.totalUnits || 0) - (property.occupiedUnits || 0), fill: "var(--color-vacant)" }
                                                        ]}
                                                        dataKey="units"
                                                        nameKey="browser"
                                                        innerRadius={55}
                                                        outerRadius={80}
                                                        strokeWidth={0}
                                                    >
                                                        <Label
                                                            content={({ viewBox }) => {
                                                                if (viewBox && "width" in viewBox && "height" in viewBox) {
                                                                    const centerX = (viewBox.width || 0) * 0.7;
                                                                    const centerY = (viewBox.height || 0) * 0.5;
                                                                    return (
                                                                        <text
                                                                            x={centerX}
                                                                            y={centerY}
                                                                            textAnchor="middle"
                                                                            dominantBaseline="middle"
                                                                        >
                                                                            <tspan
                                                                                x={centerX}
                                                                                y={centerY + 4}
                                                                                className="fill-gray-900 text-2xl font-bold"
                                                                            >
                                                                                {property.totalUnits}
                                                                            </tspan>
                                                                            <tspan
                                                                                x={centerX}
                                                                                y={centerY + 24}
                                                                                className="fill-gray-500 text-xs"
                                                                            >
                                                                                Total Units
                                                                            </tspan>
                                                                        </text>
                                                                    )
                                                                }
                                                            }}
                                                        />
                                                    </Pie>
                                                </PieChart>
                                            </ChartContainer>
                                        </div>
                                    </>
                                ) : (
                                    <>
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
                                                    property.features.map((feature: string, index: number) => (
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
                                                    property.amenities.map((amenity: string, index: number) => (
                                                        <span key={index} className="bg-[#82D64D] text-white px-6 py-2 rounded-full text-sm font-medium">
                                                            {amenity}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-sm italic">No amenities listed</span>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
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

                                    {/* Specifications Section - Only for Single Family Properties */}
                                    {property?.type === 'Single Family' && (
                                        <>
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
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-2">Market Rent</label>
                                                    <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                                        {property?.financials?.currency} {property?.marketRent?.toLocaleString() || '0'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-2">Deposit</label>
                                                    <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                                                        {property?.financials?.currency} {property?.deposit?.toLocaleString() || '0'}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
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
                    )
                }

                {activeTab === 'specs' && <SpecsTab />}
                {activeTab === 'financials' && !property.isUnitView && <FinancialsTab />}
                {activeTab === 'service providers' && <ServiceProvidersTab />}

                <PhotoGalleryModal
                    isOpen={isGalleryOpen}
                    onClose={() => setIsGalleryOpen(false)}
                    images={property.photos || []}
                    initialIndex={galleryStartIndex}
                />

                <DeletePropertyModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteError(null);
                    }}
                    onConfirm={handleDelete}
                    propertyName={property?.name || 'Property'}
                    isLoading={isDeleting}
                />

                {deleteError && (
                    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
                        <p className="font-semibold">Error deleting property:</p>
                        <p className="text-sm">{deleteError}</p>
                        <button
                            onClick={() => setDeleteError(null)}
                            className="mt-2 text-xs underline hover:no-underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
            </div >
        </div >
    );
};

export default PropertyDetail;
