import React, { useState } from "react";
import { Link } from "react-router-dom";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";

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
        <div className="min-h-screen bg-white p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-lg font-medium ml-1">
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
                <div className="bg-[#F4F4F4] border border-[#E5E7EB] pb-10 rounded-[20px] overflow-hidden shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.2)]">
                    <div className="px-6 py-3 border-b border-[#E5E7EB]">
                        <h1 className="text-2xl font-medium text-[#1A1A1A]">Public renter profile</h1>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-8 space-y-8">
                        {/* Search Preferences Section */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">Search preferences</h2>
                                <p className="text-sm text-[#6B7280]">
                                    Set the default number of days early to post the recurring transactions before the invoice due date.
                                </p>
                            </div>

                            {/* Looking for a new place toggle */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setLookingForPlace(!lookingForPlace)}
                                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${lookingForPlace ? "bg-[#4CAF50]" : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${lookingForPlace ? "translate-x-8" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                                <span className="text-sm font-medium text-[#1A1A1A]">Looking for a new place</span>
                            </div>

                            {/* Specify the following details */}
                            <div className="w-3/4">
                                <p className="text-sm font-medium text-[#6B7280] mb-4">Specify the following details</p>

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
                                        <select
                                            value={beds}
                                            onChange={(e) => setBeds(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)] focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.2em] bg-[right_0.7rem_center] bg-no-repeat"
                                        >
                                            <option>Any</option>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4+</option>
                                        </select>
                                    </div>

                                    {/* Baths */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Baths</label>
                                        <select
                                            value={baths}
                                            onChange={(e) => setBaths(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)] focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.2em] bg-[right_0.7rem_center] bg-no-repeat"
                                        >
                                            <option>Any</option>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4+</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-8 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-[#1A1A1A]">Min:</span>
                                            <input
                                                type="number"
                                                value={minPrice}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (value <= maxPrice) {
                                                        setMinPrice(value);
                                                    }
                                                }}
                                                className="w-24 px-3 py-2 bg-white border-2 border-[#4CAF50] rounded-lg text-sm font-semibold text-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-[#1A1A1A]">Max:</span>
                                            <input
                                                type="number"
                                                value={maxPrice}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (value >= minPrice) {
                                                        setMaxPrice(value);
                                                    }
                                                }}
                                                className="w-24 px-3 py-2 bg-white border-2 border-[#4CAF50] rounded-lg text-sm font-semibold text-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]"
                                            />
                                        </div>
                                    </div>

                                    {/* Range Slider */}
                                    <div className="relative w-full h-2">
                                        <div className="absolute w-full h-2 bg-gray-300 rounded-full"></div>
                                        <div
                                            className="absolute h-2 bg-[#4CAF50] rounded-full"
                                            style={{
                                                left: `${(minPrice / 20000) * 100}%`,
                                                right: `${100 - (maxPrice / 20000) * 100}%`
                                            }}
                                        ></div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="20000"
                                            value={minPrice}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value <= maxPrice) {
                                                    setMinPrice(value);
                                                }
                                            }}
                                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#4CAF50] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="20000"
                                            value={maxPrice}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value >= minPrice) {
                                                    setMaxPrice(value);
                                                }
                                            }}
                                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#4CAF50] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                                        />
                                    </div>
                                </div>

                                {/* Renter Type and Size */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {/* Renter Type */}
                                    <div>
                                        <select
                                            value={renterType}
                                            onChange={(e) => setRenterType(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)] focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.2em] bg-[right_0.7rem_center] bg-no-repeat"
                                        >
                                            <option value="">Renter Type</option>
                                            <option>Individual</option>
                                            <option>Family</option>
                                            <option>Student</option>
                                            <option>Professional</option>
                                        </select>
                                    </div>

                                    {/* Size */}
                                    <div>
                                        <select
                                            value={size}
                                            onChange={(e) => setSize(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)] focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.2em] bg-[right_0.7rem_center] bg-no-repeat"
                                        >
                                            <option value="">Size (sqft)</option>
                                            <option>0-500</option>
                                            <option>500-1000</option>
                                            <option>1000-1500</option>
                                            <option>1500-2000</option>
                                            <option>2000+</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Pets Allowed toggle */}
                                <div className="flex items-center gap-3 mb-6">
                                    <button
                                        onClick={() => setPetsAllowed(!petsAllowed)}
                                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${petsAllowed ? "bg-[#4CAF50]" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${petsAllowed ? "translate-x-8" : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                    <span className="text-sm font-medium text-[#1A1A1A]">Pets Allowed</span>
                                </div>

                                {/* Update Button */}
                                <PrimaryActionButton
                                    onClick={handleUpdate}
                                    text="Update"
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
