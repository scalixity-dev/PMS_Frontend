import React, { useState } from 'react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '../../../../../components/ui/DatePicker';
import { Plus, Trash2, X, Search } from 'lucide-react';

interface DateOption {
    id: string;
    date: Date | undefined;
    timeSlots: string[];
}

interface Equipment {
    id: string;
    name: string;
    category: string;
}

interface PropertyTenantsStepProps {
    onNext: () => void;
    onBack: () => void;
    properties: Array<{ id: string; name: string; address: string }>;
}

const PropertyTenantsStep: React.FC<PropertyTenantsStepProps> = ({ onNext, onBack, properties }) => {
    const [selectedProperty, setSelectedProperty] = useState('');
    const [linkEquipment, setLinkEquipment] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);
    const [equipmentSearchQuery, setEquipmentSearchQuery] = useState('');
    const [showCreateEquipmentModal, setShowCreateEquipmentModal] = useState(false);
    const [tenantAuthorization, setTenantAuthorization] = useState(false);
    const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
    const [pmsList, setPmsList] = useState([
        { id: 1, name: 'Atul', status: 'Pending', share: true },
        { id: 2, name: 'Ajay', status: 'Pending', share: true },
    ]);

    // Create Equipment Form State
    const [newEquipment, setNewEquipment] = useState({
        category: '',
        brand: '',
        model: '',
        serial: ''
    });

    // Mock equipment data
    const availableEquipment: Equipment[] = [
        { id: '1', name: 'Air Conditioner Unit', category: 'HVAC' },
        { id: '2', name: 'Water Heater', category: 'Plumbing' },
        { id: '3', name: 'Refrigerator', category: 'Appliances' }
    ];

    const filteredEquipment = availableEquipment.filter(eq =>
        eq.name.toLowerCase().includes(equipmentSearchQuery.toLowerCase())
    );

    const propertyOptions = properties.map(p => ({
        value: p.id,
        label: p.name
    }));

    const togglePmsShare = (id: number) => {
        setPmsList(pmsList.map(pms =>
            pms.id === id ? { ...pms, share: !pms.share } : pms
        ));
    };

    const handleAddDate = () => {
        const newOption: DateOption = {
            id: Math.random().toString(36).substr(2, 9),
            date: undefined,
            timeSlots: []
        };
        setDateOptions([...dateOptions, newOption]);
    };

    const handleDeleteDate = (id: string) => {
        setDateOptions(dateOptions.filter((opt) => opt.id !== id));
    };

    const handleDateChange = (id: string, date: Date | undefined) => {
        setDateOptions(dateOptions.map(opt =>
            opt.id === id ? { ...opt, date } : opt
        ));
    };

    const handleTimeSlotToggle = (id: string, slot: string) => {
        setDateOptions(dateOptions.map(opt => {
            if (opt.id === id) {
                const hasSlot = opt.timeSlots.includes(slot);
                return {
                    ...opt,
                    timeSlots: hasSlot
                        ? opt.timeSlots.filter(s => s !== slot)
                        : [...opt.timeSlots, slot]
                };
            }
            return opt;
        }));
    };

    const handleCreateEquipment = () => {
        // Handle equipment creation
        console.log('Creating equipment:', newEquipment);
        setShowCreateEquipmentModal(false);
        setNewEquipment({
            category: '',
            brand: '',
            model: '',
            serial: ''
        });
    };

    const handleSelectEquipment = (equipmentId: string) => {
        setSelectedEquipment(equipmentId);
        setShowEquipmentDropdown(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto pb-12">`
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Property</h2>
                <p className="text-gray-500 text-sm">
                    Select the property and a unit (if applicable) from the list below.
                </p>
            </div>

            {/* Property Selection */}
            <div className="mb-12">
                <CustomDropdown
                    label="Property*"
                    value={selectedProperty}
                    onChange={setSelectedProperty}
                    options={propertyOptions}
                    placeholder="Select Property"
                    required
                    buttonClassName="!bg-white !border-none !rounded-md !py-3"
                    labelClassName="font-bold text-gray-700"
                />
            </div>

            {/* Equipment */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Equipment</h2>
                <p className="text-gray-500 text-sm mb-6">
                    You can link property/unit equipment to this maintenance request and keep track of its maintenance history. You can add/select up to 5 equipment. (This information is visible to you only and not shared to Pms or assigned Service Pros).
                </p>

                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => {
                            setLinkEquipment(!linkEquipment);
                            if (!linkEquipment) {
                                setShowEquipmentDropdown(false);
                            }
                        }}
                        className={`w-14 h-8 rounded-full transition-colors relative ${linkEquipment ? 'bg-[#7BD747]' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${linkEquipment ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className="font-medium text-gray-700">Link equipment</span>
                </div>

                {/* Equipment Dropdown */}
                {linkEquipment && (
                    <div className="relative">
                        <div
                            onClick={() => setShowEquipmentDropdown(!showEquipmentDropdown)}
                            className="cursor-pointer"
                        >
                            <label className="block text-sm font-bold text-gray-700 mb-2">Equipment *</label>
                            {selectedEquipment ? (
                                <div className="w-full bg-[#7BD747] text-white font-bold rounded-full px-4 py-3 flex items-center justify-between">
                                    <span>{availableEquipment.find(e => e.id === selectedEquipment)?.name}</span>
                                </div>
                            ) : (
                                <div className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 flex items-center justify-between hover:border-gray-400 transition-colors">
                                    <span className="text-gray-400">Select an equipment</span>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Dropdown Menu */}
                        {showEquipmentDropdown && (
                            <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
                                {/* Create Equipment Button */}
                                <div className="px-3 py-6 bg-[var(--color-primary)] border-b border-gray-200">
                                    <button
                                        onClick={() => {
                                            setShowCreateEquipmentModal(true);
                                            setShowEquipmentDropdown(false);
                                        }}
                                        className="w-auto flex items-center justify-between px-4 py-3 bg-[#7BD747] text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                                    >
                                        <span>Create equipment</span>
                                        <Plus className="w-5 h-5 bg-white ml-2 text-[#7BD747] rounded-full p-0.5" />
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="p-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={equipmentSearchQuery}
                                            onChange={(e) => setEquipmentSearchQuery(e.target.value)}
                                            className="w-full pl-4 pr-4 py-3 bg-[#C4C4C4] text-gray-700 placeholder-gray-500 rounded-full focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Equipment List */}
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredEquipment.length > 0 ? (
                                        filteredEquipment.map((equipment) => (
                                            <button
                                                key={equipment.id}
                                                onClick={() => handleSelectEquipment(equipment.id)}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="font-medium text-gray-800">{equipment.name}</div>
                                                <div className="text-xs text-gray-500">{equipment.category}</div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center text-gray-400">
                                            No results
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* PMS Information */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Pms Information</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Pick the Pms from the table below. If your Pms is connected with you, the request will be automatically shared with them and posted on their Pms Portal.
                </p>

                <div className="bg-[#F0F2F5] rounded-[3rem] p-6">
                    <div className="bg-[#3D7475] text-white rounded-t-xl grid grid-cols-3 px-8 py-4 font-bold">
                        <div>Name</div>
                        <div>Status</div>
                        <div>Share</div>
                    </div>
                    <div className="bg-white rounded-b-xl overflow-hidden">
                        {pmsList.map((pms, index) => (
                            <div key={pms.id} className={`grid grid-cols-3 px-8 py-4 items-center ${index !== pmsList.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center border border-gray-200">
                                        {/* Placeholder Checkbox style */}
                                        <div className="w-5 h-5 border-2 border-gray-400 rounded-sm"></div>
                                    </div>
                                    <span className="font-medium text-gray-700">{pms.name}</span>
                                </div>
                                <div className="text-[#2E6819] font-bold">{pms.status}</div>
                                <div>
                                    <button
                                        onClick={() => togglePmsShare(pms.id)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${pms.share ? 'bg-[#7BD747]' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${pms.share ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Available Date & Time */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Available date & time</h2>
                <p className="text-gray-500 text-sm mb-6">
                    If the property is rented, please provide the date and time to arrange the maintenance.
                </p>

                {/* Date Options List */}
                <div className="space-y-4 mb-4">
                    {dateOptions.map((option, index) => (
                        <div key={option.id} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-700">Option {index + 1}</span>
                                <button
                                    onClick={() => handleDeleteDate(option.id)}
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Date Input */}
                            <div className="mb-3 w-56">
                                <label className="block text-xs text-gray-600 mb-1">Date *</label>
                                <DatePicker
                                    value={option.date}
                                    onChange={(date) => handleDateChange(option.id, date)}
                                    placeholder="dd/mm/yyyy"
                                />
                            </div>

                            {/* Time Slots */}
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`${option.id}-slot1`}
                                        checked={option.timeSlots.includes('8am-12pm')}
                                        onChange={() => handleTimeSlotToggle(option.id, '8am-12pm')}
                                        className="rounded border-gray-300 text-[#3D7475] focus:ring-[#3D7475]"
                                    />
                                    <label htmlFor={`${option.id}-slot1`} className="text-sm text-gray-700">8am - 12pm</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`${option.id}-slot2`}
                                        checked={option.timeSlots.includes('12pm-4pm')}
                                        onChange={() => handleTimeSlotToggle(option.id, '12pm-4pm')}
                                        className="rounded border-gray-300 text-[#3D7475] focus:ring-[#3D7475]"
                                    />
                                    <label htmlFor={`${option.id}-slot2`} className="text-sm text-gray-700">12pm - 4pm</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`${option.id}-slot3`}
                                        checked={option.timeSlots.includes('4pm-8pm')}
                                        onChange={() => handleTimeSlotToggle(option.id, '4pm-8pm')}
                                        className="rounded border-gray-300 text-[#3D7475] focus:ring-[#3D7475]"
                                    />
                                    <label htmlFor={`${option.id}-slot3`} className="text-sm text-gray-700">4pm - 8pm</label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddDate}
                    className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#7BD747] text-black font-bold bg-white hover:bg-gray-50 transition-colors"
                >
                    Add Date
                    <Plus size={18} />
                </button>
            </div>

            {/* Tenant Authorization Toggle */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => setTenantAuthorization(!tenantAuthorization)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${tenantAuthorization ? 'bg-[#7BD747]' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${tenantAuthorization ? 'left-7' : 'left-1'}`} />
                </button>
                <span className="font-medium text-gray-700">Authorization to enter in tenant's absence</span>
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
                    onClick={onNext}
                    className="px-12 py-3 rounded-lg bg-[#3D7475] text-white font-bold hover:opacity-90 transition-opacity shadow-md"
                >
                    Continue
                </button>
            </div>

            {/* Create Equipment Modal */}
            {showCreateEquipmentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">Create equipment</h3>
                            <button
                                onClick={() => setShowCreateEquipmentModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Category Dropdown */}
                            <CustomDropdown
                                label="Category"
                                value={newEquipment.category}
                                onChange={(value) => setNewEquipment({ ...newEquipment, category: value })}
                                options={[
                                    { value: 'hvac', label: 'HVAC' },
                                    { value: 'plumbing', label: 'Plumbing' },
                                    { value: 'electrical', label: 'Electrical' },
                                    { value: 'appliances', label: 'Appliances' }
                                ]}
                                placeholder="Select main category"
                                required
                                buttonClassName="!bg-white !border !border-gray-300 !rounded-md !py-3"
                                labelClassName="font-bold text-gray-700"
                            />

                            {/* Equipment Brand */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Equipment brand *</label>
                                <input
                                    type="text"
                                    placeholder="Type in a brand name"
                                    value={newEquipment.brand}
                                    onChange={(e) => setNewEquipment({ ...newEquipment, brand: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20 focus:border-[#3D7475]"
                                />
                            </div>

                            {/* Model # and Serial # */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Model #</label>
                                    <input
                                        type="text"
                                        placeholder="Type in a number"
                                        value={newEquipment.model}
                                        onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20 focus:border-[#3D7475]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Serial #</label>
                                    <input
                                        type="text"
                                        placeholder="Type in a number"
                                        value={newEquipment.serial}
                                        onChange={(e) => setNewEquipment({ ...newEquipment, serial: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20 focus:border-[#3D7475]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 border-t border-gray-200 justify-end">
                            <button
                                onClick={() => setShowCreateEquipmentModal(false)}
                                className="px-8 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateEquipment}
                                className="px-8 py-2.5 rounded-lg bg-[#7BD747] text-white font-bold hover:opacity-90 transition-opacity"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyTenantsStep;
