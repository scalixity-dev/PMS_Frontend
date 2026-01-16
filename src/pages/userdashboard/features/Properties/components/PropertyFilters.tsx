import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Check } from "lucide-react";
import { Country, State, City } from 'country-state-city';
import type { ICountry, IState, ICity } from 'country-state-city';
import CustomDropdown from "../../../../../pages/Dashboard/components/CustomDropdown";

import type { FilterState } from "../../../utils/types";

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
    availableAmenities?: string[];
}


const PropertyFilters: React.FC<PropertyFiltersProps> = ({
    isOpen,
    onClose,
    onApply,
    onReset,
    userPreferences,
    initialFilters,
    availableAmenities = []
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


    // Location State
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);

    const [country, setCountry] = useState(initialFilters.locationFilter?.country || userPreferences?.location?.country || "");
    const [stateRegion, setStateRegion] = useState(initialFilters.locationFilter?.state || userPreferences?.location?.state || "");
    const [city, setCity] = useState(initialFilters.locationFilter?.city || userPreferences?.location?.city || "");

    // Maintain region string for backward compatibility or display
    const [region, setRegion] = useState(initialFilters.region || (userPreferences?.location?.city ? userPreferences.location.city : "All Locations"));
    const [locationModified, setLocationModified] = useState(initialFilters.locationModified || false);
    const [minPrice, setMinPrice] = useState(getInitialMinPrice());
    const [maxPrice, setMaxPrice] = useState(getInitialMaxPrice());
    const [priceModified, setPriceModified] = useState(initialFilters.priceModified || false);
    const [bedrooms, setBedrooms] = useState(getInitialBedrooms());
    const [availability, setAvailability] = useState(initialFilters.availability || "All");
    const [selectedAmenities, setSelectedAmenities] = useState(initialFilters.selectedAmenities || []);
    const [petsAllowed, setPetsAllowed] = useState(initialFilters.petsAllowed || "All");
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    // Ref to track if we're syncing from props (to prevent infinite loop)
    const isSyncingFromProps = useRef(false);
    const prevInitialFiltersRef = useRef(initialFilters);
    const prevUserPreferencesRef = useRef(userPreferences);

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
        // Only sync if initialFilters or userPreferences actually changed
        const hasInitialFiltersChanged = prevInitialFiltersRef.current !== initialFilters;
        const hasUserPreferencesChanged = prevUserPreferencesRef.current !== userPreferences;

        if (hasInitialFiltersChanged || hasUserPreferencesChanged) {
            isSyncingFromProps.current = true;
            prevInitialFiltersRef.current = initialFilters;
            prevUserPreferencesRef.current = userPreferences;
        }

        if (hasInitialFiltersChanged || hasUserPreferencesChanged) {
            setSearch(initialFilters.search || "");
            setPropertyType(initialFilters.propertyType || "All");


            // Sync Location
            // Explicitly only sync from preferences if the location hasn't been manually modified.
            // This prevents turning "My Preferences" ON/OFF from overwriting a user's manual work.
            if (!initialFilters.locationModified) {
                setCountry(userPreferences?.location?.country || "");
                setStateRegion(userPreferences?.location?.state || "");
                setCity(userPreferences?.location?.city || "");
                setRegion(userPreferences?.location?.city ? userPreferences.location.city : "All Locations");
            }
            // Ensure local state reflects the store's modified status
            setLocationModified(initialFilters.locationModified || false);
            setMinPrice(initialFilters.minPrice ?? getInitialMinPrice());
            setMaxPrice(initialFilters.maxPrice ?? getInitialMaxPrice());
            setPriceModified(initialFilters.priceModified || false);
            setBedrooms(initialFilters.bedrooms || getInitialBedrooms());
            setAvailability(initialFilters.availability || "All");
            setSelectedAmenities(initialFilters.selectedAmenities || []);
            setPetsAllowed(initialFilters.petsAllowed || "All");
        }

        // Reset the flag after a microtask to allow state updates to complete
        if (hasInitialFiltersChanged || hasUserPreferencesChanged) {
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



    // Load all countries on mount
    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (country) {
            const countryStates = State.getStatesOfCountry(country);
            setStates(countryStates);
            // We don't reset stateRegion here to allow syncing from props to work naturally, 
            // but in user interaction validation happens via UI options
        } else {
            setStates([]);
        }
    }, [country]);

    // Load cities when state changes
    useEffect(() => {
        if (country && stateRegion) {
            const stateCities = City.getCitiesOfState(country, stateRegion);
            setCities(stateCities);
        } else {
            setCities([]);
        }
    }, [country, stateRegion]);

    // Convert to options for CustomDropdown
    const countryOptions = useMemo(() => countries.map(c => ({ value: c.isoCode, label: c.name })).sort((a, b) => a.label.localeCompare(b.label)), [countries]);
    const stateOptions = useMemo(() => states.map(s => ({ value: s.isoCode, label: s.name })).sort((a, b) => a.label.localeCompare(b.label)), [states]);
    const cityOptions = useMemo(() => cities.map(c => ({ value: c.name, label: c.name })).sort((a, b) => a.label.localeCompare(b.label)), [cities]);

    // Update region string when location parts change
    useEffect(() => {
        if (!isSyncingFromProps.current) {
            if (city && stateRegion && country) {
                // Construct a display string
                // Find names for codes if needed, but we store isoCode for country/state usually? 
                // Wait, TenantOnboarding stored isoCode for value but maybe we want readable?
                // CustomDropdown value is what is stored.
                // Let's use the values directly.
                setRegion(city);
            } else {
                // Clear region when location is partially cleared
                setRegion("All Locations");
            }
        }
    }, [country, stateRegion, city, countries, states]);

    // Update filters when they change (but not when syncing from props)
    useEffect(() => {
        // Don't call onApply if we're syncing from props to prevent infinite loop
        if (isSyncingFromProps.current) {
            return;
        }



        onApply({
            search,
            propertyType,
            region,
            locationModified,

            locationFilter: {
                displayText: region,
                type: 'city',
                country,
                state: stateRegion,
                city
            },
            minPrice,
            maxPrice,
            priceModified,
            bedrooms,
            availability,
            selectedAmenities,
            petsAllowed
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, propertyType, region, locationModified, country, stateRegion, city, minPrice, maxPrice, priceModified, bedrooms, availability, selectedAmenities, petsAllowed]);


    const propertyTypes = ["All", "Single Unit", "Multi Unit"];
    const bedroomOptions = ["All", "1", "2", "3", "4", "4+"];
    const availabilityOptions = [
        "All",
        "Ready to move",
        "with in 6 months",
        "With in 1 year",
        "More than one year",
    ];

    // Use availableAmenities from props if provided, otherwise use hardcoded list
    const hardcodedAmenities = [
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
    const allAmenities = availableAmenities.length > 0 ? availableAmenities : hardcodedAmenities;
    const commonAmenities = allAmenities.slice(0, 6);

    return (
        <>
            {/* Desktop Sidebar (md and up) */}
            <div
                className={`hidden md:block fixed top-[64px] left-0 right-0 bottom-0 z-[100] md:flex justify-end bg-black/10 transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPropertyType(type); } }}
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

                        {/* Location Filters */}
                        <section className="space-y-4 pt-2 border-t border-gray-200">
                            <h3 className="text-base font-semibold text-[#202020] px-1">Location</h3>

                            <div className="space-y-4">
                                {/* Country */}
                                <CustomDropdown
                                    value={country}
                                    onChange={(val: string) => {
                                        setCountry(val);
                                        setStateRegion("");
                                        setCity("");
                                        setLocationModified(true);
                                    }}
                                    options={countryOptions}
                                    placeholder="Select country"
                                    buttonClassName="py-2.5 border-gray-200 shadow-sm rounded-md!"
                                    dropdownClassName="rounded-md!"
                                    textClassName="text-sm"
                                    searchable={true}
                                />

                                {/* State */}
                                <CustomDropdown
                                    value={stateRegion}
                                    onChange={(val: string) => {
                                        setStateRegion(val);
                                        setCity("");
                                        setLocationModified(true);
                                    }}
                                    options={stateOptions}
                                    placeholder={country ? "Select state" : "Select country first"}
                                    disabled={!country}
                                    buttonClassName="py-2.5 border-gray-200 shadow-sm rounded-md!"
                                    dropdownClassName="rounded-md!"
                                    textClassName="text-sm"
                                    searchable={true}
                                />

                                {/* City */}
                                <CustomDropdown
                                    value={city}
                                    onChange={(val: string) => {
                                        setCity(val);
                                        setLocationModified(true);
                                    }}
                                    options={cityOptions}
                                    placeholder={stateRegion ? "Select city" : "Select state first"}
                                    disabled={!stateRegion}
                                    buttonClassName="py-2.5 border-gray-200 shadow-sm rounded-md!"
                                    dropdownClassName="rounded-md!"
                                    textClassName="text-sm"
                                    searchable={true}
                                />
                            </div>
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
                                        onChange={(e) => {
                                            const value = Number(e.target.value) || 0;
                                            const clampedValue = Math.max(0, Math.min(50000, value));
                                            setMinPrice(Math.min(maxPrice, clampedValue));
                                            setPriceModified(true);
                                        }}
                                        className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-center text-[#8CD74B] font-semibold text-base focus:outline-none"
                                    />
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                    <span className="text-[14px] font-semibold text-[#202020]">Max:</span>
                                    <input
                                        type="text"
                                        value={maxPrice}
                                        onChange={(e) => {
                                            const value = Number(e.target.value) || 0;
                                            const clampedValue = Math.max(0, Math.min(50000, value));
                                            setMaxPrice(Math.max(minPrice, clampedValue));
                                            setPriceModified(true);
                                        }}
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
                                            setPriceModified(true);
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
                                                left: `${Math.min(100, (minPrice / 50000) * 100)}%`,
                                                right: `${Math.max(0, 100 - (maxPrice / 50000) * 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div
                                        className="absolute w-6 h-6 bg-white border-2 border-[#8CD74B] rounded-full shadow-md -translate-x-1/2 pointer-events-none z-10"
                                        style={{ left: `${Math.min(100, (minPrice / 50000) * 100)}%` }}
                                    ></div>
                                    <div
                                        className="absolute w-6 h-6 bg-white border-2 border-[#8CD74B] rounded-full shadow-md -translate-x-1/2 pointer-events-none z-10"
                                        style={{ left: `${Math.min(100, (maxPrice / 50000) * 100)}%` }}
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
                            <h3 className="text-base font-semibold text-[#202020] px-1">Availability</h3>
                            <div className="bg-white rounded-md p-2 shadow-sm space-y-1.5">
                                {availabilityOptions.map((opt) => (
                                    <div
                                        key={opt}
                                        className="flex justify-between items-center cursor-pointer py-0.5"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAvailability(opt); } }}
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
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPetsAllowed(opt); } }}
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
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    if (selectedAmenities.includes(amenity)) {
                                                        setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                                    } else {
                                                        setSelectedAmenities([...selectedAmenities, amenity]);
                                                    }
                                                }
                                            }}
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

            {/* Mobile Bottom Sheet (below md) */}
            <div
                className={`md:hidden fixed inset-0 z-[100] transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={onClose}
                ></div>

                {/* Bottom Sheet */}
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-[#F4F7F8] rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"
                        }`}
                    style={{ height: "70vh" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Handle Bar */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Header with Close Button */}
                    <div className="flex justify-between items-center px-4 pb-3 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleReset}
                                className="text-sm font-medium text-[#8CD74B]"
                            >
                                Reset
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                                aria-label="Close filters"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto h-[calc(70vh-80px)] px-4 py-4 space-y-4">
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
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPropertyType(type); } }}
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

                        {/* Location Filters */}
                        <section className="space-y-4 pt-2 border-t border-gray-200">
                            <h3 className="text-base font-semibold text-[#202020] px-1">Location</h3>

                            <div className="space-y-4">
                                {/* Country */}
                                <CustomDropdown
                                    value={country}
                                    onChange={(val: string) => {
                                        setCountry(val);
                                        setStateRegion("");
                                        setCity("");
                                        setLocationModified(true);
                                    }}
                                    options={countryOptions}
                                    placeholder="Select country"
                                    buttonClassName="py-2.5 border-gray-200 shadow-sm rounded-md!"
                                    dropdownClassName="rounded-md!"
                                    textClassName="text-sm"
                                    searchable={true}
                                />

                                {/* State */}
                                <CustomDropdown
                                    value={stateRegion}
                                    onChange={(val: string) => {
                                        setStateRegion(val);
                                        setCity("");
                                        setLocationModified(true);
                                    }}
                                    options={stateOptions}
                                    placeholder={country ? "Select state" : "Select country first"}
                                    disabled={!country}
                                    buttonClassName="py-2.5 border-gray-200 shadow-sm rounded-md!"
                                    dropdownClassName="rounded-md!"
                                    textClassName="text-sm"
                                    searchable={true}
                                />

                                {/* City */}
                                <CustomDropdown
                                    value={city}
                                    onChange={(val: string) => {
                                        setCity(val);
                                        setLocationModified(true);
                                    }}
                                    options={cityOptions}
                                    placeholder={stateRegion ? "Select city" : "Select state first"}
                                    disabled={!stateRegion}
                                    buttonClassName="py-2.5 border-gray-200 shadow-sm rounded-md!"
                                    dropdownClassName="rounded-md!"
                                    textClassName="text-sm"
                                    searchable={true}
                                />
                            </div>
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
                                        onChange={(e) => {
                                            const value = Number(e.target.value) || 0;
                                            const clampedValue = Math.max(0, Math.min(50000, value));
                                            setMinPrice(Math.min(maxPrice, clampedValue));
                                            setPriceModified(true);
                                        }}
                                        className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-center text-[#8CD74B] font-semibold text-base focus:outline-none"
                                    />
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                    <span className="text-[14px] font-semibold text-[#202020]">Max:</span>
                                    <input
                                        type="text"
                                        value={maxPrice}
                                        onChange={(e) => {
                                            const value = Number(e.target.value) || 0;
                                            const clampedValue = Math.max(0, Math.min(50000, value));
                                            setMaxPrice(Math.max(minPrice, clampedValue));
                                            setPriceModified(true);
                                        }}
                                        className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-center text-[#8CD74B] font-semibold text-base focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Range Slider */}
                            <div className="px-4 mt-1">
                                <div
                                    className="relative h-8 flex items-center cursor-pointer"
                                    onTouchStart={(e) => {
                                        const touch = e.touches[0];
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const updatePrice = (clientX: number) => {
                                            const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
                                            const val = Math.round((percent / 100) * 50000);

                                            if (Math.abs(val - minPrice) < Math.abs(val - maxPrice)) {
                                                setMinPrice(Math.min(val, maxPrice));
                                            } else {
                                                setMaxPrice(Math.max(val, minPrice));
                                            }
                                            setPriceModified(true);
                                        };
                                        updatePrice(touch.clientX);
                                        const onTouchMove = (moveEvent: TouchEvent) => {
                                            const moveTouch = moveEvent.touches[0];
                                            updatePrice(moveTouch.clientX);
                                        };
                                        const onTouchEnd = () => {
                                            window.removeEventListener('touchmove', onTouchMove);
                                            window.removeEventListener('touchend', onTouchEnd);
                                        };
                                        window.addEventListener('touchmove', onTouchMove);
                                        window.addEventListener('touchend', onTouchEnd);
                                    }}
                                >
                                    <div className="w-full h-2 bg-gray-200 rounded-full relative">
                                        <div
                                            className="h-full bg-[#8CD74B] rounded-full absolute"
                                            style={{
                                                left: `${Math.min(100, (minPrice / 50000) * 100)}%`,
                                                right: `${Math.max(0, 100 - (maxPrice / 50000) * 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div
                                        className="absolute w-6 h-6 bg-white border-2 border-[#8CD74B] rounded-full shadow-md -translate-x-1/2 pointer-events-none z-10"
                                        style={{ left: `${Math.min(100, (minPrice / 50000) * 100)}%` }}
                                    ></div>
                                    <div
                                        className="absolute w-6 h-6 bg-white border-2 border-[#8CD74B] rounded-full shadow-md -translate-x-1/2 pointer-events-none z-10"
                                        style={{ left: `${Math.min(100, (maxPrice / 50000) * 100)}%` }}
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
                            <h3 className="text-base font-semibold text-[#202020] px-1">Availability</h3>
                            <div className="bg-white rounded-md p-2 shadow-sm space-y-1.5">
                                {availabilityOptions.map((opt) => (
                                    <div
                                        key={opt}
                                        className="flex justify-between items-center cursor-pointer py-0.5"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAvailability(opt); } }}
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
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPetsAllowed(opt); } }}
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
                        <section className="space-y-2 pt-2 border-t border-gray-200 text-center pb-4">
                            <h3 className="text-base font-semibold text-[#202020] px-1 text-left">Amenities</h3>
                            <div className="bg-white rounded-md p-2 shadow-sm space-y-1.5">
                                <div className="space-y-1.5 text-left">
                                    {(showAllAmenities ? allAmenities : commonAmenities).map((amenity) => (
                                        <div
                                            key={amenity}
                                            className="flex justify-between items-center cursor-pointer py-0.5"
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    if (selectedAmenities.includes(amenity)) {
                                                        setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                                    } else {
                                                        setSelectedAmenities([...selectedAmenities, amenity]);
                                                    }
                                                }
                                            }}
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
        </>
    );
};

export default PropertyFilters;
