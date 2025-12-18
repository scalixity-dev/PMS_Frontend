import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AddVehicleModal, { type VehicleFormData } from '../components/AddVehicleModal';
import { useApplicationStore } from '../store/applicationStore';

interface VehiclesStepProps {
    onNext: () => void;
}

const VehicleItem: React.FC<{ vehicle: any; onDelete: () => void }> = ({ vehicle, onDelete }) => {
    return (
        <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                {/* Vehicle generic icon or initial? Using a simple box for now or Initials */}
                <div className="w-12 h-12 rounded-xl bg-[#3A6D6C] flex items-center justify-center text-white font-bold">
                    {vehicle.make?.[0]}{vehicle.model?.[0]}
                </div>
                <div>
                    <p className="font-bold text-gray-900">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                    <p className="text-sm text-gray-500">{vehicle.type} • {vehicle.color} • {vehicle.licensePlate}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">{vehicle.registeredIn}</span>
                <button
                    onClick={onDelete}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

const VehiclesStep: React.FC<VehiclesStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();
    const [isAdding, setIsAdding] = useState(false);

    const handleSaveVehicle = (data: VehicleFormData) => {
        const newVehicle = {
            id: Math.random().toString(36).substr(2, 9),
            ...data
        };
        const currentVehicles = formData.vehicles ?? [];
        updateFormData('vehicles', [...currentVehicles, newVehicle]);
    };

    const handleDeleteVehicle = (id: string) => {
        const currentVehicles = formData.vehicles ?? [];
        const updatedVehicles = currentVehicles.filter((v) => v.id !== id);
        updateFormData('vehicles', updatedVehicles);
    };

    const vehicles = formData.vehicles ?? [];

    return (
        <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#2c3e50] mb-2">Vehicles</h2>
            <p className="text-center text-gray-600 mb-8">
                Provide the information about your vehicles below.
            </p>

            <div className="bg-[#F0F0F6] rounded-full p-8 shadow-sm flex flex-col items-center justify-center gap-6 max-w-3xl mx-auto">

                {/* List of Vehicles */}
                {vehicles.length > 0 && (
                    <div className="w-full max-w-2xl grid gap-4">
                        {vehicles.map((vehicle: any) => (
                            <VehicleItem
                                key={vehicle.id}
                                vehicle={vehicle}
                                onDelete={() => handleDeleteVehicle(vehicle.id)}
                            />
                        ))}
                    </div>
                )}

                <div className="flex gap-10">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#3A6D6C] text-white border border-white/20 px-6 py-3 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                    >
                        Add a Vehicle
                        <Plus className="w-4 h-4 rounded-full border border-white p-0.5" />
                    </button>

                    <button
                        onClick={onNext}
                        className="bg-[#3A6D6C] text-white border border-white/20 px-16 py-3 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>

            <AddVehicleModal
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                onSave={handleSaveVehicle}
            />
        </div>
    );
};

export default VehiclesStep;
