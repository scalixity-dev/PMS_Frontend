import React, { useState } from "react";
import { Link } from "react-router-dom";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import Toggle from "../../../../components/Toggle";
import CustomDropdown from "../../../Dashboard/components/CustomDropdown";

const PublicRenterProfile: React.FC = () => {
    const [lookingForPlace, setLookingForPlace] = useState(true);
    const [petsAllowed, setPetsAllowed] = useState(true);
    const [location, setLocation] = useState("");
    const [profileLink, setProfileLink] = useState("");
    const [beds, setBeds] = useState("Any");
    const [baths, setBaths] = useState("Any");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [renterType, setRenterType] = useState("");
    const [size, setSize] = useState("");

    const bedsOptions = [
        { label: "Any", value: "Any" },
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4+", value: "4+" },
    ];

    const bathsOptions = [
        { label: "Any", value: "Any" },
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4+", value: "4+" },
    ];

    const renterTypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Family", value: "Family" },
        { label: "Student", value: "Student" },
        { label: "Professional", value: "Professional" },
    ];

    const sizeOptions = [
        { label: "0-500", value: "0-500" },
        { label: "500-1000", value: "500-1000" },
        { label: "1000-1500", value: "1000-1500" },
        { label: "1500-2000", value: "1500-2000" },
        { label: "2000+", value: "2000+" },
    ];

    const MAX_VAL = 20000;
    const MIN_VAL = 0;

    const handleUpdate = () => {
        console.log("Updating preferences...", {
            lookingForPlace,
            location,
            profileLink,
            beds,
            baths,
            minPrice,
            maxPrice,
            renterType,
            size,
            petsAllowed
        });
    };

    return (
        <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <ol className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium ml-1">
                        <li>
                            <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
                        </li>
                        <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                        <li>
                            <Link to="/userdashboard/settings" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Settings</Link>
                        </li>
                        <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                        <li className="text-[#1A1A1A]  font-medium" aria-current="page">Public renter profile</li>
                    </ol>
                </nav>

                {/* Main Container */}
                <div className="bg-[#F4F4F4] border border-[#E5E7EB] pb-6 sm:pb-8 md:pb-10 rounded-[12px] md:rounded-[16px] lg:rounded-[20px] shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.2)]">
                    <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#E5E7EB]">
                        <h1 className="text-xl sm:text-2xl font-medium text-[#1A1A1A]">Public renter profile</h1>
                    </div>

                    {/* Content */}
                    <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-8">
                        {/* Search Preferences Section */}
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A1A] mb-1">Search preferences</h2>
                                <p className="text-xs sm:text-sm text-[#6B7280]">
                                    Set the default number of days early to post the recurring transactions before the invoice due date.
                                </p>
                            </div>

                            {/* Looking for a new place toggle */}
                            <div className="flex items-center gap-3">
                                <Toggle
                                    checked={lookingForPlace}
                                    onChange={setLookingForPlace}
                                    label="Looking for a new place"
                                    labelClassName="text-sm font-medium text-[#1A1A1A]"
                                    size="small"
                                />
                            </div>

                            {/* Specify the following details */}
                            <div className="w-full lg:w-3/4">
                                <p className="text-xs sm:text-sm font-medium text-[#6B7280] mb-4">Specify the following details</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {/* Location */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)] focus:border-transparent"
                                        />
                                    </div>

                                    {/* Your public renter profile link */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your public renter profile link"
                                            value={profileLink}
                                            onChange={(e) => setProfileLink(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Beds and Baths */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {/* Beds */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Beds</label>
                                        <CustomDropdown
                                            value={beds}
                                            onChange={setBeds}
                                            options={bedsOptions}
                                            searchable={false}
                                            placeholder="Select Beds"
                                            buttonClassName="w-full px-4 py-3 border-[#E5E7EB]"
                                        />
                                    </div>

                                    {/* Baths */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Baths</label>
                                        <CustomDropdown
                                            value={baths}
                                            onChange={setBaths}
                                            options={bathsOptions}
                                            searchable={false}
                                            placeholder="Select Baths"
                                            buttonClassName="w-full px-4 py-3 border-[#E5E7EB]"
                                        />
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]">Min:</span>
                                            <input
                                                type="number"
                                                value={minPrice}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (value >= MIN_VAL && value <= maxPrice) {
                                                        setMinPrice(value);
                                                    }
                                                }}
                                                className="w-20 sm:w-24 px-2 sm:px-3 py-1.5 sm:py-2 bg-white border-2 border-[#7BD747] rounded-lg text-xs sm:text-sm font-semibold text-[#7BD747] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]">Max:</span>
                                            <input
                                                type="number"
                                                value={maxPrice}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (value >= minPrice && value <= MAX_VAL) {
                                                        setMaxPrice(value);
                                                    } else if (value > MAX_VAL) {
                                                        setMaxPrice(MAX_VAL);
                                                    }
                                                }}
                                                className="w-20 sm:w-24 px-2 sm:px-3 py-1.5 sm:py-2 bg-white border-2 border-[#7BD747] rounded-lg text-xs sm:text-sm font-semibold text-[#7BD747] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]"
                                            />
                                        </div>
                                    </div>

                                    {/* Range Slider */}
                                    <div className="relative w-full h-2">
                                        <div className="absolute w-full h-2 bg-gray-300 rounded-full"></div>
                                        <div
                                            className="absolute h-2 bg-[#7BD747] rounded-full"
                                            style={{
                                                left: `${(minPrice / MAX_VAL) * 100}%`,
                                                right: `${Math.max(0, 100 - (maxPrice / MAX_VAL) * 100)}%`
                                            }}
                                        ></div>
                                        <input
                                            type="range"
                                            min={MIN_VAL}
                                            max={MAX_VAL}
                                            value={minPrice}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value <= maxPrice) {
                                                    setMinPrice(value);
                                                }
                                            }}
                                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#7BD747] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                                        />
                                        <input
                                            type="range"
                                            min={MIN_VAL}
                                            max={MAX_VAL}
                                            value={maxPrice}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value >= minPrice) {
                                                    setMaxPrice(value);
                                                }
                                            }}
                                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#7BD747] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                                        />
                                    </div>
                                </div>

                                {/* Renter Type and Size */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {/* Renter Type */}
                                    <div>
                                        <CustomDropdown
                                            value={renterType}
                                            onChange={setRenterType}
                                            options={renterTypeOptions}
                                            searchable={false}
                                            placeholder="Renter Type"
                                            buttonClassName="w-full px-4 py-3 border-[#E5E7EB]"
                                        />
                                    </div>

                                    {/* Size */}
                                    <div>
                                        <CustomDropdown
                                            value={size}
                                            onChange={setSize}
                                            options={sizeOptions}
                                            searchable={false}
                                            placeholder="Size (sqft)"
                                            buttonClassName="w-full px-4 py-3 border-[#E5E7EB]"
                                        />
                                    </div>
                                </div>

                                {/* Pets Allowed toggle */}
                                <div className="flex items-center gap-3 mb-6">
                                    <Toggle
                                        checked={petsAllowed}
                                        onChange={setPetsAllowed}
                                        label="Pets Allowed"
                                        labelClassName="text-sm font-medium text-[#1A1A1A]"
                                        size="small"
                                    />
                                </div>

                                {/* Update Button */}
                                <PrimaryActionButton
                                    onClick={handleUpdate}
                                    text="Update"
                                    className="w-full sm:w-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicRenterProfile;
