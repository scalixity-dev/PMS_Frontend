// Fixed implicit any
import React, { useState, useEffect } from 'react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '../../../../../components/ui/DatePicker';
import Toggle from '../../../../../components/Toggle';
import { Plus, Trash2, X, AlertTriangle, ChevronLeft } from 'lucide-react';

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

interface TenantListItem {
    id: number;
    name: string;
    status: string;
    share: boolean;
    selected: boolean;
}

interface PropertyTenantsStepProps {
    onNext: () => void;
    onBack: () => void;
    properties: Array<{ id: string; name: string; address: string }>;
    initialData?: any;
}

const PropertyTenantsStep: React.FC<PropertyTenantsStepProps> = ({ onNext, onBack, properties, initialData }) => {
    const [selectedProperty, setSelectedProperty] = useState(initialData?.property || '');
    const [linkEquipment, setLinkEquipment] = useState(!!initialData?.equipment);
    const [selectedEquipment, setSelectedEquipment] = useState(initialData?.equipment || '');
    const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);
    const [equipmentSearchQuery, setEquipmentSearchQuery] = useState('');
    const [showCreateEquipmentModal, setShowCreateEquipmentModal] = useState(false);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [tenantAuthorization, setTenantAuthorization] = useState(initialData?.tenantAuthorization || false);
    const [dateOptions, setDateOptions] = useState<DateOption[]>(initialData?.dateOptions || []);
    const [tenantList, setTenantList] = useState<TenantListItem[]>(initialData?.tenantList || [
        { id: 1, name: 'Atul', status: 'Pending', share: false, selected: false },
        { id: 2, name: 'Ajay', status: 'Pending', share: false, selected: false },
    ]);
    const [accessCode, setAccessCode] = useState(initialData?.accessCode || '');
    const [petsInResidence, setPetsInResidence] = useState(initialData?.petsInResidence || '');
    const [selectedPets, setSelectedPets] = useState<string[]>(initialData?.selectedPets || []);
    const [validationError, setValidationError] = useState('');

    const handleContinue = () => {
        if (petsInResidence === 'yes' && selectedPets.length === 0) {
            setValidationError('Please select at least one pet type');
            return;
        }
        setValidationError('');
        onNext();
    };

    // Disable body scroll when modal is open
    useEffect(() => {
        if (showCreateEquipmentModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showCreateEquipmentModal]);

    // Clear selected pets when petsInResidence becomes 'no'
    useEffect(() => {
        if (petsInResidence === 'no') {
            setSelectedPets([]);
        }
    }, [petsInResidence]);

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

    const toggleTenantSelection = (id: number) => {
        setTenantList(prev => prev.map((tenant: TenantListItem) =>
            tenant.id === id ? { ...tenant, selected: !tenant.selected, share: !tenant.selected } : tenant
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
        <div className="w-full max-w-5xl mx-auto pb-12">
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
                />
            </div>

            {/* Equipment */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Equipment</h2>
                <p className="text-gray-500 text-sm mb-6">
                    You can link property/unit equipment to this maintenance request and keep track of its maintenance history. You can add/select up to 5 equipment. (This information is visible to you only and not shared to tenants or assigned Service Pros).
                </p>

                <div className="mb-4 p-4 px-8 bg-[var(--color-primary)] rounded-[3rem] w-fit">
                    <Toggle
                        checked={linkEquipment}
                        onChange={(checked) => {
                            setLinkEquipment(checked);
                            if (!checked) {
                                setShowEquipmentDropdown(false);
                            }
                        }}
                        label="Link equipment"
                        labelClassName="font-medium text-white"
                    />
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

            {/* Tenant Information */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Tenant Information</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Pick the tenant from the table below. If your tenant is connected with you, the request will be automatically shared with them and posted on their SmartTenantAI Portal.
                </p>

                <div className="bg-[#F0F2F5] rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 overflow-x-auto">
                    <div className="min-w-[600px]">
                        <div className="bg-[#3D7475] text-white rounded-t-xl grid grid-cols-3 px-8 py-4 font-bold">
                            <div>Name</div>
                            <div>Status</div>
                            <div>Share</div>
                        </div>
                        <div className="bg-white rounded-b-xl overflow-hidden">
                            {tenantList.map((tenant: TenantListItem, index: number) => (
                                <div key={tenant.id} className={`grid grid-cols-3 px-8 py-4 items-center ${index !== tenantList.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => toggleTenantSelection(tenant.id)}
                                            className="flex items-center justify-center border border-gray-200 transition-colors cursor-pointer"
                                        >
                                            <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors ${tenant.selected ? 'bg-[#7BD747] border-[#7BD747]' : 'border-gray-400 bg-white'}`}>
                                                {tenant.selected && (
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>
                                        <span className="font-medium text-gray-700">{tenant.name}</span>
                                    </div>
                                    <div className="text-[#2E6819] font-bold">{tenant.status}</div>
                                    <div>
                                        <Toggle
                                            checked={tenant.share}
                                            onChange={() => { }}
                                            size="small"
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/*      Date & Time */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Available date & time</h2>
                <p className="text-gray-500 text-sm mb-6">
                    If the property is rented, please provide the date and time to arrange the maintenance.
                </p>

                {/* Add Date Button and Authorization Toggle Row */}
                <div className="flex flex-col md:flex-row items-center md:items-center gap-4 mb-8">
                    <button
                        onClick={handleAddDate}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#3D7475] text-white font-bold hover:opacity-90 transition-opacity w-full md:w-auto"
                    >
                        Add Date
                        <Plus size={18} className="bg-white text-[#3D7475] rounded-full p-0.5" />
                    </button>

                    <div className="flex items-center gap-3 px-6 py-2 bg-[#3D7475] rounded-full w-full md:w-auto">
                        <Toggle
                            checked={tenantAuthorization}
                            onChange={setTenantAuthorization}
                            labelClassName="font-medium text-white"
                        />
                        <span className="text-white font-medium text-sm md:text-base">Authorization to enter their tenant space</span>
                    </div>
                </div>

                {/* Date Options List */}
                <div className="space-y-4 mb-8 w-full md:w-1/2">
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

                {/* Code & Pets Dropdowns */}
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Code*</label>
                        <input
                            type="text"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            placeholder="**********"
                            className="w-full bg-white rounded-md px-4 py-3 outline-none text-gray-700 font-medium placeholder-gray-400"
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <CustomDropdown
                            label="Pets in residence*"
                            value={petsInResidence}
                            onChange={setPetsInResidence}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' }
                            ]}
                            placeholder="Yes/No"
                            required
                            buttonClassName="!bg-white !border-none !rounded-md !py-3"
                        />

                        {/* Pet Type Checkboxes */}
                        {petsInResidence === 'yes' && (
                            <div className="flex flex-col mt-4">
                                <div className="flex items-center gap-8">
                                    {['Cat', 'Dog', 'Others'].map((pet) => (
                                        <label key={pet} className="flex items-center gap-2 cursor-pointer">
                                            <div
                                                onClick={() => {
                                                    setSelectedPets(prev => {
                                                        const newSelection = prev.includes(pet)
                                                            ? prev.filter(p => p !== pet)
                                                            : [...prev, pet];
                                                        if (newSelection.length > 0) setValidationError('');
                                                        return newSelection;
                                                    });
                                                }}
                                                className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors ${selectedPets.includes(pet) ? 'bg-[#7BD747]' : 'bg-white border border-gray-300'
                                                    }`}
                                            >
                                                {selectedPets.includes(pet) && (
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-gray-700 font-medium">{pet}</span>
                                        </label>
                                    ))}
                                </div>
                                {validationError && (
                                    <p className="text-red-500 text-xs mt-2 font-medium">{validationError}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 md:flex-none px-12 py-3 rounded-lg bg-white border border-gray-200 text-black font-bold hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    className="flex-1 md:flex-none px-12 py-3 rounded-lg bg-[#3D7475] text-white font-bold hover:opacity-90 transition-opacity shadow-md"
                >
                    Continue
                </button>
            </div>

            {/* Create Equipment Modal */}
            {showCreateEquipmentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#D9E0E0] rounded-2xl shadow-xl w-full max-w-xl mx-4 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-[#3D7475]">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowExitConfirmation(true)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                                <h3 className="text-xl font-bold text-white">Create equipment</h3>
                            </div>
                            <button
                                onClick={() => setShowExitConfirmation(true)}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            {/* Category Dropdown */}
                            <CustomDropdown
                                label="Category*"
                                value={newEquipment.category}
                                onChange={(value) => setNewEquipment({ ...newEquipment, category: value })}
                                options={[
                                    { value: 'hvac', label: 'HVAC' },
                                    { value: 'plumbing', label: 'Plumbing' },
                                    { value: 'electrical', label: 'Electrical' },
                                    { value: 'appliances', label: 'Appliances' }
                                ]}
                                placeholder="Choose Type"
                                required
                                buttonClassName="!bg-white !border-none !rounded-full !py-3 !px-6"
                            />

                            {/* Equipment Brand and Model */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Equipment Brand *</label>
                                    <input
                                        type="text"
                                        placeholder="Type here"
                                        value={newEquipment.brand}
                                        onChange={(e) => setNewEquipment({ ...newEquipment, brand: e.target.value })}
                                        className="w-full rounded-full border-none px-6 py-3 text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Model *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Type here"
                                            value={newEquipment.model}
                                            onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                                            className="w-full rounded-full border-none px-6 py-3 text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Serial */}
                            <div className="w-full md:w-1/2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Serial*</label>
                                <input
                                    type="text"
                                    placeholder="Type here"
                                    value={newEquipment.serial}
                                    onChange={(e) => setNewEquipment({ ...newEquipment, serial: e.target.value })}
                                    className="w-full rounded-full border-none px-6 py-3 text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20"
                                />
                            </div>

                            {/* Create Button */}
                            <div>
                                <button
                                    onClick={handleCreateEquipment}
                                    className="px-12 py-3 rounded-full bg-[#3D7475] text-white font-bold hover:opacity-90 transition-opacity"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Exit Confirmation Dialog */}
                    {showExitConfirmation && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                                {/* Header */}
                                <div className="bg-[#3D7475] px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-white">
                                        <AlertTriangle size={24} />
                                        <h3 className="text-lg font-bold">You're about to leave</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowExitConfirmation(false)}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-8 text-center">
                                    <p className="text-gray-700 text-lg">
                                        Are you sure you want to leave without saving ? You will lose any changes made.
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="flex gap-4 p-6 justify-center pb-8">
                                    <button
                                        onClick={() => setShowExitConfirmation(false)}
                                        className="w-32 py-2.5 rounded-lg bg-[#556370] text-white font-bold hover:opacity-90 transition-opacity"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowExitConfirmation(false);
                                            setShowCreateEquipmentModal(false);
                                        }}
                                        className="w-32 py-2.5 rounded-lg bg-[#3D7475] text-white font-bold hover:opacity-90 transition-opacity"
                                    >
                                        Yes I'm Sure
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PropertyTenantsStep;
