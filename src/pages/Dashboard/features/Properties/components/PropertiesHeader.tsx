import React from 'react';
import { Plus } from 'lucide-react';

interface PropertiesHeaderProps {
    onImport?: () => void;
    onAddProperty?: () => void;
}

const PropertiesHeader: React.FC<PropertiesHeaderProps> = ({ onImport, onAddProperty }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
                <button
                    onClick={onImport}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#2c5251] transition-colors"
                >
                    Import
                </button>
                <button
                    onClick={onAddProperty}
                    className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#2c5251] transition-colors"
                >
                    Add Property
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default PropertiesHeader;
