import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

import type { FilterState } from "../../utils/types";

interface PropertyFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
}


const PropertyFilters: React.FC<PropertyFiltersProps> = ({ isOpen, onClose, onApply }) => {
    const [search, setSearch] = useState("");
    const [propertyType, setPropertyType] = useState("All");
    const [region, setRegion] = useState("nearby locality");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(50000);
    const [bedrooms, setBedrooms] = useState("All");
    const [availability, setAvailability] = useState("All");
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const handleReset = () => {
        setSearch("");
        setPropertyType("All");
        setRegion("nearby locality");
        setMinPrice(0);
        setMaxPrice(50000);
        setBedrooms("All");
        setAvailability("All");
        setSelectedAmenities([]);
    };

    useEffect(() => {
        onApply({
            search,
            propertyType,
            region,
            minPrice,
            maxPrice,
            bedrooms,
            availability,
            selectedAmenities
        });
    }, [search, propertyType, region, minPrice, maxPrice, bedrooms, availability, selectedAmenities]);

    const propertyTypes = ["All", "Apartment", "Villa", "Plot", "Builder Floor"];
    const bedroomOptions = ["All", "1", "2", "3", "4", "4+"];
    const availabilityOptions = [
        "All",
        "Ready to move",
        "with in 6 months",
        "With in 1 year",
        "More than one year",
    ];
    const commonAmenities = ["Ready to move", "with in 6 months"];

    return (
        <div
            className={`absolute inset-0 z-[100] flex justify-end bg-black/10 transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            onClick={onClose}
        >
            <div
                className={`bg-[#F4F7F8] w-full max-w-[380px] h-full shadow-2xl transition-all duration-500 ease-in-out overflow-y-auto transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 space-y-4 relative">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                        <button
                            onClick={handleReset}
                            className="text-sm font-semibold text-[#8CD74B] hover:underline"
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
                        <div className="relative">
                            <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-md py-3 px-4 appearance-none text-gray-700 text-sm focus:outline-none shadow-sm"
                            >
                                <option value="nearby locality">nearby locality</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={18} />
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
                        <div
                            className="relative h-8 flex items-center px-1 mt-1 cursor-pointer"
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

                    {/* Amenities */}
                    <section className="space-y-2 pt-2 border-t border-gray-200 text-center">
                        <h3 className="text-base font-semibold text-[#202020] px-1 text-left">Amenities</h3>
                        <div className="bg-white rounded-md p-2 shadow-sm space-y-1.5">
                            <div className="space-y-1.5 text-left">
                                {commonAmenities.map((amenity) => (
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
                            <button className="text-[#8CD74B] text-[14px] font-semibold pt-1 transition-colors hover:text-[#76b83f]">
                                + View More Amenities
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PropertyFilters;
