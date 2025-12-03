import React from 'react';
import { Plus, Settings, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ListingHeaderProps {
    onAddListing?: () => void;
}

const ListingHeader: React.FC<ListingHeaderProps> = ({ onAddListing }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-start mb-6">
            <div className="flex items-center gap-6">
                <div className='flex'>
                    <button
                    onClick={() => navigate(-1)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Listings</h1>
                </div>
            
                <button
                    className="px-5 py-2 text-sm font-medium text-white bg-[#548C8C] rounded-full hover:bg-[#467676] transition-colors shadow-sm"
                >
                    My Website
                </button>
                <button
                    onClick={onAddListing}
                    className="flex items-center gap-1 px-5 py-2 text-sm font-medium text-white bg-[#548C8C] rounded-full hover:bg-[#467676] transition-colors shadow-sm"
                >
                    Add Listing
                    <Plus className="w-4 h-4" />
                </button>
                <button
                    className="flex items-center gap-1 px-5 py-2 text-sm font-medium text-white bg-[#548C8C] rounded-full hover:bg-[#467676] transition-colors shadow-sm"
                >
                    Settings
                    <Settings className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ListingHeader;
