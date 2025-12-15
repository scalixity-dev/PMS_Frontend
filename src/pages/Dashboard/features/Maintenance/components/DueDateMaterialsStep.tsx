import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '../../../../../components/ui/DatePicker';

interface Material {
    id: string;
    name: string;
    quantity: number;
}

interface DueDateMaterialsStepProps {
    onNext: (data: { dateInitiated: Date | undefined; dateDue: Date | undefined; priority: string; materials: Material[] }) => void;
    onBack: () => void;
    initialData?: {
        dateInitiated?: Date;
        dateDue?: Date;
        priority?: string;
        materials?: Material[];
    };
}

const DueDateMaterialsStep: React.FC<DueDateMaterialsStepProps> = ({ onNext, onBack, initialData }) => {
    const [dateInitiated, setDateInitiated] = useState<Date | undefined>(initialData?.dateInitiated || new Date());
    const [dateDue, setDateDue] = useState<Date | undefined>(initialData?.dateDue);
    const [priority, setPriority] = useState(initialData?.priority || '');
    const [materials, setMaterials] = useState<Material[]>(initialData?.materials || []);

    const handleAddMaterial = () => {
        const newMaterial: Material = {
            id: Math.random().toString(36).substr(2, 9),
            name: '',
            quantity: 1,
        };
        setMaterials([...materials, newMaterial]);
    };

    const handleMaterialChange = (id: string, field: 'name', value: string) => {
        setMaterials(prev => prev.map(m =>
            m.id === id ? { ...m, [field]: value } : m
        ));
    };

    const handleQuantityChange = (id: string, delta: number) => {
        setMaterials(prev => prev.map(m => {
            if (m.id === id) {
                const newQuantity = Math.max(1, m.quantity + delta);
                return { ...m, quantity: newQuantity };
            }
            return m;
        }));
    };

    const handleDeleteMaterial = (id: string) => {
        setMaterials(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="w-full max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Details</h2>
                <p className="text-gray-500 text-sm">
                    Capture the date when you would like the issue to be fixed.
                </p>
            </div>

            {/* Date Initiated & Date Due */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date Initiated*</label>
                    <DatePicker
                        value={dateInitiated}
                        onChange={setDateInitiated}
                        placeholder="19/02/2025"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date Due*</label>
                    <DatePicker
                        value={dateDue}
                        onChange={setDateDue}
                        placeholder="dd/mm/yyyy"
                    />
                </div>
            </div>

            {/* Priority Dropdowns */}
            <div className="mb-12">
                <CustomDropdown
                    label="Priority *"
                    value={priority}
                    onChange={setPriority}
                    options={[
                        { value: 'low', label: 'Low' },
                        { value: 'normal', label: 'Normal' },
                        { value: 'high', label: 'High' },
                        { value: 'urgent', label: 'Urgent' }
                    ]}
                    placeholder="Normal"
                    required
                    buttonClassName="!bg-white !border-none !rounded-md !py-3"
                />

            </div>

            {/* Materials Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Materials</h2>
                <p className="text-gray-500 text-sm mb-6">
                    You can add supplies/materials and quantity of every item.
                </p>

                <button
                    onClick={handleAddMaterial}
                    className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#7BD747] text-black font-bold bg-white hover:bg-gray-50 transition-colors mb-4"
                >
                    Add Row
                    <Plus size={18} />
                </button>

                {/* Materials List */}
                {materials.length > 0 && (
                    <div className="space-y-3">
                        {materials.map((material) => (
                            <div key={material.id} className="flex gap-3 items-center">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Item *</label>
                                    <input
                                        type="text"
                                        placeholder="Type a name"
                                        value={material.name}
                                        onChange={(e) => handleMaterialChange(material.id, 'name', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20 focus:border-[#3D7475]"
                                    />
                                </div>

                                <div className="flex items-center gap-2 mt-6">
                                    <button
                                        onClick={() => handleQuantityChange(material.id, -1)}
                                        className="w-10 h-10 rounded-md bg-white border-2 border-[#7BD747] flex items-center justify-center text-[#7BD747] hover:bg-[#7BD747] hover:text-white transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <div className="w-16 h-10 bg-white border-2 border-gray-300 rounded-md flex items-center justify-center font-semibold text-gray-800">
                                        {material.quantity}
                                    </div>
                                    <button
                                        onClick={() => handleQuantityChange(material.id, 1)}
                                        className="w-10 h-10 rounded-md bg-white border-2 border-[#7BD747] flex items-center justify-center text-[#7BD747] hover:bg-[#7BD747] hover:text-white transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMaterial(material.id)}
                                        className="w-10 h-10 rounded-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors ml-2"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="px-12 py-3 rounded-lg bg-white border border-gray-200 text-black font-bold hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Back
                </button>
                <button
                    onClick={() => onNext({ dateInitiated, dateDue, priority, materials })}
                    className="px-12 py-3 rounded-lg bg-[#3D7475] text-white font-bold hover:opacity-90 transition-opacity shadow-md"
                >
                    Create Request
                </button>
            </div>
        </div>
    );
};

export default DueDateMaterialsStep;
