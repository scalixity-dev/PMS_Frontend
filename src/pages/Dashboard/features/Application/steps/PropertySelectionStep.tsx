import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Building, Loader2 } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import PropertyCard from '../../ListUnit/components/PropertyCard';
import { unitService } from '../../../../../services/unit.service';
import { useGetAllProperties, useGetProperty } from '../../../../../hooks/usePropertyQueries';
import { useGetUnit } from '../../../../../hooks/useUnitQueries';
import type { BackendUnit } from '../../../../../services/unit.service';
import { useApplicationStore } from '../store/applicationStore';

interface PropertySelectionStepProps {
    onNext: () => void;
}

// Interface for selectable items (properties or units)
interface SelectableItem {
    id: string;
    name: string;
    address: string;
    type: 'property' | 'unit';
    propertyId: string;
    unitId?: string;
    propertyType?: 'SINGLE' | 'MULTI';
    image?: string;
}

const PropertySelectionStep: React.FC<PropertySelectionStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();
    const [isOpen, setIsOpen] = useState(false);
    const [selectableItems, setSelectableItems] = useState<SelectableItem[]>([]);

    // Derived from store
    const selectedPropertyId = formData.propertyId;
    const selectedUnitId = formData.unitId;

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Use React Query to fetch all properties
    const {
        data: allBackendProperties = [],
        isLoading: loading,
        error: queryError,
    } = useGetAllProperties(true, false);

    // Get all MULTI properties to fetch their units
    const multiProperties = useMemo(() => {
        return allBackendProperties.filter(p => p.propertyType === 'MULTI') || [];
    }, [allBackendProperties]);

    // Fetch units for all MULTI properties in parallel
    const unitQueries = useQueries({
        queries: multiProperties.map(property => ({
            queryKey: ['units', 'list', property.id],
            queryFn: () => unitService.getAllByProperty(property.id),
            enabled: !!property.id,
            staleTime: 2 * 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
        })),
    });

    // Use React Query to fetch full property data when selected
    const {
        data: fullPropertyData
    } = useGetProperty(selectedPropertyId || null, !!selectedPropertyId);

    // Fetch unit data if unitId is selected
    const { data: selectedUnitData } = useGetUnit(selectedUnitId || null, !!selectedUnitId);

    // Build selectable items list
    useEffect(() => {
        if (!allBackendProperties || allBackendProperties.length === 0) {
            setSelectableItems([]);
            return;
        }

        const items: SelectableItem[] = [];
        const unitsByPropertyId = new Map<string, BackendUnit[]>();

        multiProperties.forEach((property, index) => {
            const unitsData = unitQueries[index]?.data;
            if (unitsData && Array.isArray(unitsData)) {
                unitsByPropertyId.set(property.id, unitsData);
            }
        });

        allBackendProperties.forEach((backendProperty) => {
            const address = backendProperty.address
                ? `${backendProperty.address.streetAddress}, ${backendProperty.address.city}, ${backendProperty.address.stateRegion} ${backendProperty.address.zipCode}, ${backendProperty.address.country}`
                : 'Address not available';

            if (backendProperty.propertyType === 'SINGLE') {
                items.push({
                    id: backendProperty.id,
                    name: backendProperty.propertyName,
                    address,
                    type: 'property',
                    propertyId: backendProperty.id,
                    propertyType: 'SINGLE',
                    image: backendProperty.coverPhotoUrl || backendProperty.photos?.[0]?.photoUrl || '',
                });
            } else if (backendProperty.propertyType === 'MULTI') {
                // Add units for MULTI property
                const units = unitsByPropertyId.get(backendProperty.id) || [];
                units.forEach(unit => {
                    const unitImage = unit.photos?.find((p: any) => p.isPrimary)?.photoUrl
                        || unit.photos?.[0]?.photoUrl
                        || unit.coverPhotoUrl
                        || backendProperty.coverPhotoUrl
                        || '';

                    items.push({
                        id: unit.id,
                        name: `${backendProperty.propertyName} - ${unit.unitName || 'Unit'}`,
                        address,
                        type: 'unit',
                        propertyId: backendProperty.id,
                        unitId: unit.id,
                        propertyType: 'MULTI',
                        image: unitImage,
                    });
                });
            }
        });

        setSelectableItems(items);

    }, [allBackendProperties, multiProperties, unitQueries]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (item: SelectableItem) => {
        updateFormData('propertyId', item.propertyId);
        if (item.type === 'unit' && item.unitId) {
            updateFormData('unitId', item.unitId);
        } else {
            updateFormData('unitId', '');
        }
        setIsOpen(false);
    };

    const handleDelete = () => {
        updateFormData('propertyId', '');
        updateFormData('unitId', '');
    };

    // Prepare data for PropertyCard
    // Get cover photo URL
    const propertyImage = selectedUnitData?.photos?.find((p: any) => p.isPrimary)?.photoUrl
        || selectedUnitData?.photos?.[0]?.photoUrl
        || selectedUnitData?.coverPhotoUrl
        || fullPropertyData?.coverPhotoUrl
        || fullPropertyData?.photos?.find((p) => p.isPrimary)?.photoUrl
        || fullPropertyData?.photos?.[0]?.photoUrl
        || '';

    // Fallback to item image if data not loaded yet
    const selectedItem = selectableItems.find(item => {
        if (selectedUnitId) return item.type === 'unit' && item.unitId === selectedUnitId;
        return item.type === 'property' && item.propertyId === selectedPropertyId;
    });

    const displayImage = propertyImage || selectedItem?.image || '';
    const displayName = selectedItem?.name || fullPropertyData?.propertyName || '';
    const displayAddress = selectedItem?.address || '';

    // Get price, bedrooms, bathrooms from unit or property
    const price = selectedUnitData?.rent
        ? (typeof selectedUnitData.rent === 'string' ? parseFloat(selectedUnitData.rent) : Number(selectedUnitData.rent))
        : (fullPropertyData?.marketRent
            ? (typeof fullPropertyData.marketRent === 'string' ? parseFloat(fullPropertyData.marketRent) : Number(fullPropertyData.marketRent))
            : 0);

    const bedrooms = selectedUnitData?.beds || fullPropertyData?.singleUnitDetails?.beds || 0;
    const bathrooms = selectedUnitData?.baths
        ? (typeof selectedUnitData.baths === 'string' ? parseFloat(selectedUnitData.baths) : Number(selectedUnitData.baths))
        : (fullPropertyData?.singleUnitDetails?.baths
            ? (typeof fullPropertyData.singleUnitDetails.baths === 'string' ? parseFloat(fullPropertyData.singleUnitDetails.baths) : Number(fullPropertyData.singleUnitDetails.baths))
            : 0);

    const country = fullPropertyData?.address?.country || (selectedItem?.address ? selectedItem.address.split(', ').pop() : undefined);


    const error = queryError ? (queryError instanceof Error ? queryError.message : 'Failed to load properties') : null;

    if (loading) {
        return (
            <div className="bg-transparent p-8 rounded-lg w-full flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-transparent p-8 rounded-lg w-full flex flex-col items-center">
                <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#2c3e50] mb-2">Create an Application</h2>
            <p className="text-center text-gray-600 mb-8">
                Select a property below and proceed to filling out the rental application for it.
            </p>

            <div className="bg-transparent p-8 rounded-lg w-full flex flex-col items-center">
                {(selectedPropertyId) ? (
                    // Show Property Card when selected
                    <div className="flex flex-col items-center w-full">
                        <PropertyCard
                            property={{
                                id: selectedUnitId || selectedPropertyId,
                                name: displayName,
                                address: displayAddress,
                                price,
                                bedrooms,
                                bathrooms,
                                image: displayImage,
                                country,
                            }}
                            onDelete={handleDelete}
                            onBack={handleDelete}
                            onNext={onNext}
                        // Hide edit button for now as it's not part of the requirement
                        // onEdit={...} 
                        />
                        
                    </div>
                ) : (
                    // Show Dropdown when no selection
                    <div className="w-full max-w-md relative" ref={dropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>

                        {/* Dropdown Trigger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-[#3A6D6C] focus:outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Building size={16} />
                                </div>
                                <span className="text-gray-500">Select a property</span>
                            </div>
                            <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                <div className="max-h-60 overflow-y-auto">
                                    {selectableItems.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            No properties found.
                                        </div>
                                    ) : (
                                        selectableItems.map((item) => (
                                            <button
                                                key={`${item.type}-${item.id}`}
                                                onClick={() => handleSelect(item)}
                                                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'unit' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        <Building size={16} />
                                                    </div>
                                                    <div className="text-left flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{item.address}</p>
                                                        {item.type === 'unit' && (
                                                            <p className="text-xs text-green-600 mt-0.5">Unit</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertySelectionStep;
