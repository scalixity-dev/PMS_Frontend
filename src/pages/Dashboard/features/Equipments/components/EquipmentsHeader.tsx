import React from 'react';
import { Plus, ChevronLeft } from 'lucide-react';

interface EquipmentsHeaderProps {
    onAddEquipment?: () => void;
}

const EquipmentsHeader: React.FC<EquipmentsHeaderProps> = ({ onAddEquipment }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <button className="flex items-center text-gray-800 text-xl font-bold gap-2 hover:text-gray-600 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                    Equipments
                </button>
                <button
                    onClick={onAddEquipment}
                    className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#2c5251] transition-colors"
                >
                    Add Equipment
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default EquipmentsHeader;
