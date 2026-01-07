import React, { useState, useEffect, useRef } from "react";
import { Search, Check } from "lucide-react";
import CustomDropdown from "../../../../../pages/Dashboard/components/CustomDropdown";

import type { FilterState, LocationFilter } from "../../../utils/types";

interface UserPreferences {
    location?: { country: string; state: string; city: string };
    rentalTypes?: string[];
    criteria?: {
        beds?: string | null;
        baths?: string | null;
        minPrice?: number;
        maxPrice?: number;
        petsAllowed?: boolean;
    };
}

interface PropertyFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    onReset: () => void;
    userPreferences?: UserPreferences | null;
    initialFilters: FilterState;
}


const PropertyFilters: React.FC<PropertyFiltersProps> = ({ 
    isOpen, 
    onClose, 
    onApply,
    onReset,
    userPreferences,
    initialFilters 
}) => {
    // Initialize state with preferences or initial filters
    const getInitialMinPrice = () => {
        if (initialFilters.minPrice !== undefined) return initialFilters.minPrice;
        if (userPreferences?.criteria?.minPrice !== undefined) return userPreferences.criteria.minPrice;
        return 0;
    };

    const getInitialMaxPrice = () => {
        if (initialFilters.maxPrice !== undefined) return initialFilters.maxPrice;
        if (userPreferences?.criteria?.maxPrice !== undefined) return userPreferences.criteria.maxPrice;
        return 50000;
    };

    const getInitialBedrooms = () => {
        if (initialFilters.bedrooms && initialFilters.bedrooms !== 'All') return initialFilters.bedrooms;
        if (userPreferences?.criteria?.beds && userPreferences.criteria.beds !== 'Any') {
            return userPreferences.criteria.beds;
        }
        return "All";
    };

    const [search, setSearch] = useState(initialFilters.search || "");
    const [propertyType, setPropertyType] = useState(initialFilters.propertyType || "All");
    const [region, setRegion] = useState(initialFilters.region || (userPreferences?.location?.city ? userPreferences.location.city : "All Locations"));
    const [minPrice, setMinPrice] = useState(getInitialMinPrice());
    const [maxPrice, setMaxPrice] = useState(getInitialMaxPrice());
    const [bedrooms, setBedrooms] = useState(getInitialBedrooms());
    const [availability, setAvailability] = useState(initialFilters.availability || "All");
    const [selectedAmenities, setSelectedAmenities] = useState(initialFilters.selectedAmenities || []);
    const [petsAllowed, setPetsAllowed] = useState(initialFilters.petsAllowed || "All");
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    // Ref to track if we're syncing from props (to prevent infinite loop)
    const isSyncingFromProps = useRef(false);
    const prevInitialFiltersRef = useRef(initialFilters);
    
    // Ref for the sidebar content container
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Scroll sidebar to top when it opens
    useEffect(() => {
        if (isOpen && sidebarRef.current) {
            sidebarRef.current.scrollTop = 0;
        }
    }, [isOpen]);

    // Update state when initialFilters or userPreferences change
    useEffect(() => {
        // Only sync if initialFilters actually changed
        const hasInitialFiltersChanged = prevInitialFiltersRef.current !== initialFilters;
        
        if (hasInitialFiltersChanged) {
            isSyncingFromProps.current = true;
            prevInitialFiltersRef.current = initialFilters;
        }
        
        if (hasInitialFiltersChanged) {
            setSearch(initialFilters.search || "");
            setPropertyType(initialFilters.propertyType || "All");
            setRegion(initialFilters.region || (userPreferences?.location?.city ? userPreferences.location.city : "All Locations"));
            setMinPrice(initialFilters.minPrice ?? getInitialMinPrice());
            setMaxPrice(initialFilters.maxPrice ?? getInitialMaxPrice());
            setBedrooms(initialFilters.bedrooms || getInitialBedrooms());
            setAvailability(initialFilters.availability || "All");
            setSelectedAmenities(initialFilters.selectedAmenities || []);
            setPetsAllowed(initialFilters.petsAllowed || "All");
        }
        
        // Reset the flag after a microtask to allow state updates to complete
        if (hasInitialFiltersChanged) {
            Promise.resolve().then(() => {
                isSyncingFromProps.current = false;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialFilters, userPreferences]);

    const handleReset = () => {
        // Call the store's reset function to ensure consistency
        onReset();
        // Local state will be synced via the useEffect when initialFilters changes
    };

    // Helper function to parse region display text into structured LocationFilter
    const parseRegionToLocationFilter = (regionText: string): LocationFilter | undefined => {
        if (!regionText || regionText === 'All Locations') {
            return { displayText: regionText, type: 'all' };
        }

        // Extract radius from region string (e.g., "Within 5km of Bhopal")
        const radiusMatch = regionText.match(/Within (\d+)km of (.+)/);
        if (radiusMatch) {
            return {
                displayText: regionText,
                type: 'radius',
                city: radiusMatch[2],
                radius: parseInt(radiusMatch[1], 10)
            };
        }

        // Handle "City & Nearby Areas" (default 10km radius)
        if (regionText.includes(' & Nearby Areas')) {
            const city = regionText.replace(' & Nearby Areas', '');
            return {
                displayText: regionText,
                type: 'nearby',
                city,
                radius: 10 // Default radius for nearby areas
            };
        }

        // Handle "All State" (e.g., "All Madhya Pradesh")
        if (regionText.startsWith('All ')) {
            const state = regionText.replace('All ', '');
            return {
                displayText: regionText,
                type: 'state',
                state
            };
        }

        // Handle direct city name or other formats
        return {
            displayText: regionText,
            type: 'city',
            city: regionText
        };
    };

    // Update filters when they change (but not when syncing from props)
    useEffect(() => {
        // Don't call onApply if we're syncing from props to prevent infinite loop
        if (isSyncingFromProps.current) {
            return;
        }
        
        const locationFilter = parseRegionToLocationFilter(region);
        
        onApply({
            search,
            propertyType,
            region,
            locationFilter,
            minPrice,
            maxPrice,
            bedrooms,
            availability,
            selectedAmenities,
            petsAllowed
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, propertyType, region, minPrice, maxPrice, bedrooms, availability, selectedAmenities, petsAllowed]);

    // Generate region options based on user's location from preferences
    const getRegionOptions = () => {
        const options: { value: string; label: string }[] = [
            { value: "All Locations", label: "All Locations" }
        ];
        
        if (userPreferences?.location) {
            const { city, state } = userPreferences.location;
            
            // Add user's city as primary option
            if (city) {
                options.push({ value: `${city} & Nearby Areas`, label: `${city} & Nearby Areas` });
            }
            
            // Add nearby/surrounding areas option
            if (city) {
                options.push({ value: `Within 5km of ${city}`, label: `Within 5km of ${city}` });
                options.push({ value: `Within 10km of ${city}`, label: `Within 10km of ${city}` });
                options.push({ value: `Within 25km of ${city}`, label: `Within 25km of ${city}` });
            }
            if (state && city !== state) {
                options.push({ value: `All ${state}`, label: `All ${state}` });
            }
        } else {
            // Default options if no user location
            options.push({ value: "Nearby Locality", label: "Nearby Locality" });
        }
        
        return options;
    };

    const regionOptions = getRegionOptions();
    const propertyTypes = ["All", "Single Unit", "Multi Unit"];
    const bedroomOptions = ["All", "1", "2", "3", "4", "4+"];
    const availabilityOptions = [
        "All",
        "Ready to move",
        "with in 6 months",
        "With in 1 year",
        "More than one year",
    ];
    const allAmenities = [
        "Air Conditioning",
        "Heating",
        "Dishwasher",
        "Washer/Dryer",
        "Parking",
        "Swimming Pool",
        "Fitness Center",
        "Pet Friendly",
        "Balcony/Patio",
        "Garden",
        "Garage",
        "Security System",
        "Elevator",
        "Hardwood Floors",
        "WiFi/Internet",
        "Cable TV"
    ];
    const commonAmenities = allAmenities.slice(0, 6);

    return (
        <div
            className={`fixed top-[64px] left-0 right-0 bottom-0 z-[100] flex justify-end bg-black/10 transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            onClick={onClose}
        >
            <div
                ref={sidebarRef}
                className={`bg-[#F4F7F8] w-full max-w-[380px] h-full shadow-2xl transition-all duration-500 ease-in-out overflow-y-auto transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 space-y-4 relative">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                        <button
                            onClick={handleReset}
                            className="text-sm font-medium text-[#8CD74B] "
                        >
                            Reset
                        </button>
                    </div>

                    {/* Header Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Find city, address, name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-md py-2.5 px-4 pr-10 text-[14px] focus:outline-none focus:border-[#8CD74B] shadow-sm placeholder:text-gray-400"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                    </div>

                    {/* Property Type */}
                    <section className="space-y-2">
                        <h3 className="text-base font-semibold text-[#202020] px-1">Property type</h3>
                        <div className="bg-white rounded-md p-4 shadow-sm space-y-1.5">
                            {propertyTypes.map((type) => (
                                <div
                                    key={type}
                                    className="flex justify-between items-center cursor-pointer py-0.5"
                                    onClick={() => setPropertyType(type)}
                                >
                                    <span className={`text-[14px] ${propertyType === type ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                                        {type}
                                    </span>
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${propertyType === type
                                            ? "bg-[#8CD74B] border-[#8CD74B]"
                                            : "border-[#8CD74B] bg-white opacity-40"
                                            }`}
                                    >
                                        {propertyType === type && <Check size={12} className="text-white" strokeWidth={4} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Region */}
                    <section className="space-y-2 pt-2 border-t border-gray-200">
                        <h3 className="text-base font-semibold text-[#202020] px-1">Region</h3>
                        <CustomDropdown
                            value={region}
                            onChange={setRegion}
                            options={regionOptions}
                            placeholder="Select region"
                            buttonClassName="py-2.5 border-gray-200 shadow-sm !rounded-md"
                            dropdownClassName="!rounded-md"
                            textClassName="text-sm"
                        />
                    </section>

                    {/* Price Range */}
                    <section className="space-y-2 pt-2 border-t border-gray-200">
                        <h3 className="text-base font-semibold text-[#202020] px-1">Price Range</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-[14px] font-semibold text-[#202020]">Min:</span>
                                <input
                                    type="text"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Math.min(maxPrice, Number(e.target.value) || 0))}
                                    className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-center text-[#8CD74B] font-semibold text-base focus:outline-none"
                                />
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-[14px] font-semibold text-[#202020]">Max:</span>
                                <input
                                    type="text"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Math.max(minPrice, Number(e.target.value) || 0))}
                                    className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-center text-[#8CD74B] font-semibold text-base focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Range Slider */}
                        <div className="px-4 mt-1">
                            <div
                                className="relative h-8 flex items-center cursor-pointer"
                                onMouseDown={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const updatePrice = (clientX: number) => {
                                        const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
                                        const val = Math.round((percent / 100) * 50000);

                                        if (Math.abs(val - minPrice) < Math.abs(val - maxPrice)) {
                                            setMinPrice(Math.min(val, maxPrice));
                                        } else {
                                            setMaxPrice(Math.max(val, minPrice));
                                        }
                                    };
                                    updatePrice(e.clientX);
                                    const onMouseMove = (moveEvent: MouseEvent) => updatePrice(moveEvent.clientX);
                                    const onMouseUp = () => {
                                        window.removeEventListener('mousemove', onMouseMove);
                                        window.removeEventListener('mouseup', onMouseUp);
                                    };
                                    window.addEventListener('mousemove', onMouseMove);
                                    window.addEventListener('mouseup', onMouseUp);
                                }}
                            >
                                <div className="w-full h-2 bg-gray-200 rounded-full relative">
                                    <div
                                        className="h-full bg-[#8CD74B] rounded-full absolute"
                                        style={{
                                            left: `${(minPrice / 50000) * 100}%`,
                                            right: `${100 - (maxPrice / 50000) * 100}%`
                                        }}
                                    ></div>
                                </div>
                                <div
                                    className="absolute w-6 h-6 bg-white border-2 border-[#8CD74B] rounded-full shadow-md -translate-x-1/2 pointer-events-none z-10"
                                    style={{ left: `${(minPrice / 50000) * 100}%` }}
                                ></div>
                                <div
                                    className="absolute w-6 h-6 bg-white border-2 border-[#8CD74B] rounded-full shadow-md -translate-x-1/2 pointer-events-none z-10"
                                    style={{ left: `${(maxPrice / 50000) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </section>

                    {/* Bed Rooms */}
                    <section className="space-y-2 pt-2 border-t border-gray-200">
                        <h3 className="text-base font-semibold text-[#202020] px-1">Bed Rooms</h3>
                        <div className="flex gap-2">
                            {bedroomOptions.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setBedrooms(opt)}
                                    className={`flex-1 py-2 rounded-sm border transition-all text-base font-medium shadow-sm font-['Urbanist'] ${bedrooms === opt
                                        ? "bg-white border-[#8CD74B] text-gray-900"
                                        : "bg-white border-gray-100 text-gray-500"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Availability */}
                    <section className="space-y-2 pt-2 border-t border-gray-200">
                        <h3 className="text-base font-semibold text-[#202020] px-1">Availablity</h3>
                        <div className="bg-white rounded-md p-2 shadow-sm space-y-1.5">
                            {availabilityOptions.map((opt) => (
                                <div
                                    key={opt}
                                    className="flex justify-between items-center cursor-pointer py-0.5"
                                    onClick={() => setAvailability(opt)}
                                >
                                    <span className={`text-[14px] ${availability === opt ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                                        {opt}
                                    </span>
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${availability === opt
                                            ? "bg-[#8CD74B] border-[#8CD74B]"
                                            : "border-[#8CD74B] bg-white opacity-40"
                                            }`}
                                    >
                                        {availability === opt && <Check size={12} className="text-white" strokeWidth={4} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pets Allowed */}
                    <section className="space-y-2 pt-2 border-t border-gray-200">
                        <h3 className="text-base font-semibold text-[#202020] px-1">Pets Allowed</h3>
                        <div className="bg-white rounded-md p-2 shadow-sm space-y-1.5">
                            {["All", "Yes", "No"].map((opt) => (
                                <div
                                    key={opt}
                                    className="flex justify-between items-center cursor-pointer py-0.5"
                                    onClick={() => setPetsAllowed(opt)}
                                >
                                    <span className={`text-[14px] ${petsAllowed === opt ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                                        {opt}
                                    </span>
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${petsAllowed === opt
                                            ? "bg-[#8CD74B] border-[#8CD74B]"
                                            : "border-[#8CD74B] bg-white opacity-40"
                                            }`}
                                    >
                                        {petsAllowed === opt && <Check size={12} className="text-white" strokeWidth={4} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Amenities */}
                    <section className="space-y-2 pt-2 border-t border-gray-200 text-center">
                        <h3 className="text-base font-semibold text-[#202020] px-1 text-left">Amenities</h3>
                        <div className="bg-white rounded-md p-2 shadow-sm space-y-1.5">
                            <div className="space-y-1.5 text-left">
                                {(showAllAmenities ? allAmenities : commonAmenities).map((amenity) => (
                                    <div
                                        key={amenity}
                                        className="flex justify-between items-center cursor-pointer py-0.5"
                                        onClick={() => {
                                            if (selectedAmenities.includes(amenity)) {
                                                setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                            } else {
                                                setSelectedAmenities([...selectedAmenities, amenity]);
                                            }
                                        }}
                                    >
                                        <span className={`text-[14px] ${selectedAmenities.includes(amenity) ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                                            {amenity}
                                        </span>
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedAmenities.includes(amenity)
                                                ? "bg-[#8CD74B] border-[#8CD74B]"
                                                : "border-[#8CD74B] bg-white opacity-40"
                                                }`}
                                        >
                                            {selectedAmenities.includes(amenity) && <Check size={12} className="text-white" strokeWidth={4} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => setShowAllAmenities(!showAllAmenities)}
                                className="text-[#8CD74B] text-[14px] font-semibold pt-1 transition-colors hover:text-[#76b83f]"
                            >
                                {showAllAmenities ? "- Show Less Amenities" : `+ View More Amenities (${allAmenities.length - commonAmenities.length} more)`}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PropertyFilters;
