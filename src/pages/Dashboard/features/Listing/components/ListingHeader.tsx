import React from 'react';
import { Plus, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ListingHeaderProps {
    onAddListing?: () => void;
}

const ListingHeader: React.FC<ListingHeaderProps> = ({ onAddListing }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-1 md:gap-2">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1.5 md:p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Listings</h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button
                    onClick={onAddListing}
                    className="flex items-center gap-1 px-3 md:px-5 py-2 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#467676] transition-colors shadow-sm"
                >
                    <span className="hidden md:inline">Add Listing</span>
                    <span className="md:hidden">Add</span>
                    <Plus className="w-4 h-4" />
                </button>
                {/* <button
                    className="flex items-center gap-1 px-5 py-2 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#467676] transition-colors shadow-sm"
                >
                    Settings
                    <Settings className="w-4 h-4" />
                </button> */}
            </div>
        </div>
    );
};

export default ListingHeader;
