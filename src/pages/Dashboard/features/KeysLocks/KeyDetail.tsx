import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import CustomTextBox from '../../components/CustomTextBox';
import { keysData } from './KeysLocks';

const KeyDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const keyItem = keysData.find(k => k.id === Number(id));
    const [isActionDropdownOpen, setIsActionDropdownOpen] = React.useState(false);

    if (!keyItem) {
        return <div>Key not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Keys & Locks</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Key no. {id || '123'}</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-black" />
                    </button>
                    <h1 className="text-2xl font-bold text-black mr-auto">Keys</h1>

                    <button className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm">
                        Unassign
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                        >
                            Action
                        </button>
                        {isActionDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-auto min-w-[4rem] bg-white rounded-lg shadow-lg z-10 border border-gray-100 overflow-hidden">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                                    onClick={() => {
                                        setIsActionDropdownOpen(false);
                                        // Add edit logic
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
                                    onClick={() => {
                                        setIsActionDropdownOpen(false);
                                        // Add delete logic
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-[#F0F0F6] rounded-[2rem] p-6 shadow-sm">
                    {/* Key Section */}
                    <div className="flex gap-6 mb-8">
                        {/* Key Image */}
                        <div className="w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=400"
                                alt="Key"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Green Card */}
                        <div className="flex-1 bg-[#7BD747] rounded-[2rem] p-6 relative overflow-hidden">
                            <h2 className="text-white text-xl font-bold mb-4">Key no. {keyItem.id}</h2>
                            <div className="w-full">
                                <CustomTextBox
                                    value={keyItem.keyDescription || "No description available"}
                                    readOnly={true}
                                    className="bg-[#E0E5E5]/90 h-24 items-start pt-2 rounded-lg"
                                    valueClassName="text-gray-600 text-sm whitespace-pre-wrap"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Section */}
                    <div className="bg-[#E0E5E5] rounded-[2rem] p-6 border border-white/50">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{keyItem.property}</h3>
                                <div className="mt-2">
                                    <CustomTextBox
                                        value={keyItem.propertyAddress || "Address not available"}
                                        readOnly={true}
                                        className="bg-[#D9EBD3] border border-white/50 rounded-lg"
                                        valueClassName="text-gray-700 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400"
                                    alt="Property"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col gap-4">
                                <div>
                                    <button className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors shadow-sm">
                                        View Properties
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <CustomTextBox
                                        value={keyItem.propertyDescription || "No description available"}
                                        readOnly={true}
                                        className="bg-[#E0E5E5] border border-gray-200 h-full items-start pt-2 rounded-lg"
                                        valueClassName="text-gray-600 text-sm whitespace-pre-wrap"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyDetail;
