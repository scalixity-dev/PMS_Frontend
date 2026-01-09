import React, { useState } from 'react';
import { Plus, Trash2, Car } from 'lucide-react';
import { useUserApplicationStore } from '../store/userApplicationStore';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';
import UserAddVehicleModal, { type VehicleFormData } from '../components/UserAddVehicleModal';

const VehicleItem: React.FC<{ vehicle: any; onDelete: () => void }> = ({ vehicle, onDelete }) => {
    return (
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[12px] bg-[#F3F4F6] flex items-center justify-center text-[#71717A] group-hover:bg-[#7ED957]/10 group-hover:text-[#7ED957] transition-colors font-bold text-xs">
                    {vehicle.make?.[0]}{vehicle.model?.[0]}
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold text-[#1A1A1A] text-sm">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                    <p className="text-[11px] text-[#ADADAD]">{vehicle.type} • {vehicle.color} • {vehicle.licensePlate}</p>
                </div>
            </div>
            <button
                onClick={onDelete}
                className="text-gray-300 hover:text-red-500 transition-colors p-2"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};

interface VehiclesStepProps {
    onNext: () => void;
}

const VehiclesStep: React.FC<VehiclesStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useUserApplicationStore();
    const [isAdding, setIsAdding] = useState(false);

    const handleSaveVehicle = (data: VehicleFormData) => {
        const newVehicle = {
            id: Math.random().toString(36).substr(2, 9),
            ...data
        };
        const currentVehicles = formData.vehicles ?? [];
        updateFormData('vehicles', [...currentVehicles, newVehicle]);
        setIsAdding(false);
    };

    const handleDeleteVehicle = (id: string) => {
        const currentVehicles = formData.vehicles ?? [];
        updateFormData('vehicles', currentVehicles.filter((v) => v.id !== id));
    };

    const vehicles = formData.vehicles ?? [];

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Vehicles</h2>
                <p className="text-gray-400 text-sm">Provide information about your vehicles.</p>
            </div>

            <div className="min-h-[250px] flex flex-col items-center">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {vehicles.map((vehicle: any) => (
                        <VehicleItem key={vehicle.id} vehicle={vehicle} onDelete={() => handleDeleteVehicle(vehicle.id)} />
                    ))}

                    {vehicles.length === 0 && (
                        <div className="col-span-full border-2 border-dashed border-[#E5E7EB] rounded-2xl py-12 flex flex-col items-center justify-center text-[#ADADAD]">
                            <Car size={40} strokeWidth={1.5} className="mb-3" />
                            <p className="text-sm font-medium">No vehicles added yet</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#7ED957] text-[#7ED957] font-bold text-sm uppercase hover:bg-[#7ED957]/5 transition-all"
                    >
                        <span>Add Vehicle</span>
                        <Plus size={18} />
                    </button>

                    <PrimaryActionButton
                        onClick={onNext}
                        text="Next"
                        className={`px-16 py-3.5 rounded-full font-bold uppercase transition-all ${true
                            ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                            : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'
                            }`}
                    />
                </div>
            </div>

            <UserAddVehicleModal
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                onSave={handleSaveVehicle}
            />
        </div>
    );
};

export default VehiclesStep;
