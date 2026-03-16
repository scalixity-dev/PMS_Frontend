import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '../../../../../components/ui/DatePicker';
import { useMaintenanceRequestFormStore, type MaintenanceMaterial, type ChargeToOption } from '../store/maintenanceRequestStore';

interface Material extends MaintenanceMaterial {}

interface DueDateMaterialsStepProps {
    onNext: (data: { dateInitiated: Date | undefined; dateDue: Date | undefined; priority: string; materials: Material[]; chargeTo: ChargeToOption }) => void;
    onBack: () => void;
    initialData?: {
        dateInitiated?: Date;
        dateDue?: Date;
        priority?: string;
        materials?: Material[];
        chargeTo?: ChargeToOption;
    };
}

const DueDateMaterialsStep: React.FC<DueDateMaterialsStepProps> = ({ onNext, onBack, initialData }) => {
    const [dateInitiated, setDateInitiated] = useState<Date | undefined>(initialData?.dateInitiated || new Date());
    const [dateDue, setDateDue] = useState<Date | undefined>(initialData?.dateDue);
    const [priority, setPriority] = useState(initialData?.priority || '');
    const [chargeTo, setChargeTo] = useState<ChargeToOption>(initialData?.chargeTo || 'LANDLORD');
    const [materials, setMaterials] = useState<Material[]>(initialData?.materials || []);

    const setDue = useMaintenanceRequestFormStore((state) => state.setDue);

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

            {/* Date Initiated, Date Due, Priority & Charge To */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                <div>
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
                        buttonClassName="!bg-white !border-none !rounded-md !py-2.5"
                    />
                </div>
                <div>
                    <CustomDropdown
                        label="Charge To"
                        value={chargeTo}
                        onChange={(v) => setChargeTo(v as ChargeToOption)}
                        options={[
                            { value: 'LANDLORD', label: 'Landlord' },
                            { value: 'TENANT', label: 'Tenant' },
                            { value: 'PENDING', label: 'Pending' }
                        ]}
                        placeholder="Landlord"
                        buttonClassName="!bg-white !border-none !rounded-md !py-2.5"
                    />
                </div>
            </div>

            {/* Materials Section */}
            <div className="mb-12 max-w-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Materials</h2>
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-500 text-sm">
                        You can add supplies/materials and quantity of every item.
                    </p>
                    <button
                        onClick={handleAddMaterial}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3D7475] text-white font-bold hover:opacity-90 transition-opacity"
                    >
                        Add Row
                        <Plus size={18} className="bg-white text-[#3D7475] rounded-full p-0.5" />
                    </button>
                </div>

                {/* Materials List */}
                {materials.length > 0 && (
                    <div className="space-y-4">
                        {materials.map((material) => (
                            <div key={material.id} className="bg-[#E9E9E9] rounded-[2rem] p-6 shadow-sm">
                                <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4">
                                    <div className="flex-1 w-full md:max-w-md">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Item*</label>
                                        <input
                                            type="text"
                                            value={material.name}
                                            onChange={(e) => handleMaterialChange(material.id, 'name', e.target.value)}
                                            placeholder="Type item name"
                                            className="w-full rounded-md border-none px-4 py-3 text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20"
                                        />
                                    </div>

                                    {/* Quantity Selector & Delete */}
                                    <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(material.id, -1)}
                                                className="w-10 h-10 rounded-md bg-white border-2 border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <div className="w-14 h-10 bg-white border-2 border-gray-300 rounded-md flex items-center justify-center font-semibold text-gray-800">
                                                {material.quantity}
                                            </div>
                                            <button
                                                onClick={() => handleQuantityChange(material.id, 1)}
                                                className="w-10 h-10 rounded-md bg-white border-2 border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteMaterial(material.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors mb-0.5"
                                        >
                                            <Trash2 size={22} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4">
                {/* Footer Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={onBack}
                        className="flex-1 md:flex-none px-12 py-3 rounded-lg bg-white border border-gray-200 text-black font-bold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => {
                            setDue({
                                dateInitiated,
                                dateDue,
                                priority,
                                materials,
                                chargeTo,
                            });
                            onNext({ dateInitiated, dateDue, priority, materials, chargeTo });
                        }}
                        className="flex-1 md:flex-none px-12 py-3 rounded-lg bg-[#3D7475] text-white font-bold hover:opacity-90 transition-opacity shadow-md"
                    >
                        Create Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DueDateMaterialsStep;
