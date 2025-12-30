import { Plus, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertiesHeaderProps {
    onImport?: () => void;
    onAddProperty?: () => void;
}

const PropertiesHeader: React.FC<PropertiesHeaderProps> = ({ onImport, onAddProperty }) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onImport}
                    className="px-5 py-2 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#2c5251] transition-colors"
                >
                    Import
                </button>
                <button
                    onClick={onAddProperty}
                    className="flex items-center gap-1 px-5 py-2 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#2c5251] transition-colors"
                >
                    Add Property
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default PropertiesHeader;
