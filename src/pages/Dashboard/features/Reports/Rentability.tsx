import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchableDropdown from '../../../../components/ui/SearchableDropdown';

const Rentability: React.FC = () => {
    const navigate = useNavigate();
    const [selectedProperty, setSelectedProperty] = useState('');

    const propertyOptions = [
        'Unit 101 - Sunset Apartments',
        'Unit 102 - Sunset Apartments',
        'Unit 205 - Downtown Lofts',
        'Unit 3B - The Heights',
        'Single Family Home - 123 Maple St',
        'Luxury Villa - 456 Palm Dr'
    ];

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/reports')}>Reports</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Rentability</span>
            </div>

            <div className="p-8 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">Rentability</h1>

                {/* Info Cards Banner */}
                <div className="bg-[#F0F0F6] rounded-[3rem] p-3 shadow-sm mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-[#82D64D] rounded-[2rem] p-6 text-center shadow-sm relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col h-full">
                                <h3 className="text-white font-bold text-lg mb-4">Fill vacancies and maximize revenue</h3>
                                <div className="mt-auto bg-[#E3EBDE] backdrop-blur-sm rounded-[2rem] p-4 text-sm font-semibold text-gray-600">
                                    Competitive rent prices help you attract tenants faster. When you understand local market rental rates, you can make sure you aren't pricing too high or too low.
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#82D64D] rounded-[2rem] p-6 text-center shadow-sm relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col h-full">
                                <h3 className="text-white font-bold text-lg mb-4">Better understand your market</h3>
                                <div className="mt-auto bg-[#E3EBDE] backdrop-blur-sm rounded-[2rem] p-4 text-sm font-semibold text-gray-600">
                                    Since our reports are based on your specific property, you'll get insights into similar listings, market saturation, vacancy rates and trends for your area.
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#82D64D] rounded-[2rem] p-6 text-center shadow-sm relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col h-full">
                                <h3 className="text-white font-bold text-lg mb-4">Gain an edge with real-time reporting</h3>
                                <div className="mt-auto bg-[#E3EBDE] backdrop-blur-sm rounded-[2rem] p-4 text-sm font-semibold text-gray-600">
                                    We instantly pull internal and national data to make sure you have the most up-to-date market analysis available.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Information Form */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Property information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                            <SearchableDropdown
                                label="Property*"
                                value={selectedProperty}
                                options={propertyOptions}
                                onChange={setSelectedProperty}
                                placeholder="Select unit..."
                                className="w-full"
                                buttonClassName="bg-white text-gray-700 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Beds*</label>
                            <input
                                type="text"
                                placeholder="0"
                                className="w-full bg-white px-4 py-3 rounded-lg border-none shadow-sm focus:ring-2 focus:ring-[#4ad1a6] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Baths*</label>
                            <input
                                type="text"
                                placeholder="0"
                                className="w-full bg-white px-4 py-3 rounded-lg border-none shadow-sm focus:ring-2 focus:ring-[#4ad1a6] outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-6">
                    <p className="text-gray-800 text-sm font-medium">By purchasing you agree to the Rent Range Terms of Service.</p>

                    <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 mb-4">Total: $19.99</p>
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => navigate('/dashboard/reports')}
                        className="px-8 py-3 bg-[#6B7280] text-white font-bold rounded-lg shadow-md hover:bg-[#4B5563] transition-colors"
                    >
                        Back
                    </button>
                    <button className="px-8 py-3 bg-[#3A6D6C] text-white font-bold rounded-lg shadow-md hover:bg-[#2c5251] transition-colors">
                        Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Rentability;
