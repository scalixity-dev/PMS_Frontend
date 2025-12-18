import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';

export interface VehicleFormData {
    type: string;
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
    registeredIn: string;
}

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: VehicleFormData) => void;
}

const typeOptions = [
    { value: 'Car', label: 'Car' },
    { value: 'Truck', label: 'Truck' },
    { value: 'Motorcycle', label: 'Motorcycle' },
    { value: 'Other', label: 'Other' }
];

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<VehicleFormData>({
        type: '',
        make: '',
        model: '',
        year: '',
        color: '',
        licensePlate: '',
        registeredIn: ''
    });

    // Prevent background scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (key: keyof VehicleFormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
        // Reset form or keep it? unique to usage.
        setFormData({
            type: '',
            make: '',
            model: '',
            year: '',
            color: '',
            licensePlate: '',
            registeredIn: ''
        });
    };

    const inputClasses = "w-full bg-white p-3 rounded-lg border-none outline-none text-gray-700 placeholder-gray-400 shadow-sm";
    const labelClasses = "block text-sm font-semibold text-[#2c3e50] mb-1 ml-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-3xl w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative overflow-visible">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-3xl">
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-medium">Add a new vehicle</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelClasses}>Type *</label>
                            <CustomDropdown
                                value={formData.type}
                                onChange={(val) => handleChange('type', val)}
                                options={typeOptions}
                                placeholder="Choose Type"
                                buttonClassName={inputClasses}
                                dropdownClassName="max-h-60"
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Make *</label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className={inputClasses}
                                value={formData.make}
                                onChange={(e) => handleChange('make', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Model *</label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className={inputClasses}
                                value={formData.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelClasses}>Year *</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={inputClasses}
                                value={formData.year}
                                onChange={(e) => handleChange('year', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Color *</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={inputClasses}
                                value={formData.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>License Plate *</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={inputClasses}
                                value={formData.licensePlate}
                                onChange={(e) => handleChange('licensePlate', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelClasses}>Registered in*</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={inputClasses}
                                value={formData.registeredIn}
                                onChange={(e) => handleChange('registeredIn', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Add Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleSubmit}
                            className="bg-[#3A6D6C] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-md"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddVehicleModal;
