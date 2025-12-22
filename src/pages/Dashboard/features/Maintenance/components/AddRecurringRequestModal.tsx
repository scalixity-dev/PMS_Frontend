import React, { useEffect, useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '../../../../../components/ui/DatePicker';

interface AddRecurringRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RecurringRequestFormData) => void;
}

export interface RecurringRequestFormData {
    category: string;
    subCategory: string;
    property: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    frequency: string;
    description: string;
}

const AddRecurringRequestModal: React.FC<AddRecurringRequestModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<RecurringRequestFormData>({
        category: '',
        subCategory: '',
        property: '',
        startDate: undefined,
        endDate: undefined,
        frequency: '',
        description: '',
    });

    // Disable body scroll when modal is open
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

    const handleSubmit = () => {
        onSubmit(formData);
        // Reset form
        setFormData({
            category: '',
            subCategory: '',
            property: '',
            startDate: undefined,
            endDate: undefined,
            frequency: '',
            description: '',
        });
    };

    const handleClose = () => {
        onClose();
        // Reset form on close
        setFormData({
            category: '',
            subCategory: '',
            property: '',
            startDate: undefined,
            endDate: undefined,
            frequency: '',
            description: '',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#D9E0E0] rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#3D7475]">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <h3 className="text-xl font-bold text-white">Add Recurring Request</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-6">
                    {/* Category and Sub-Category */}
                    <div className="grid grid-cols-2 gap-6">
                        <CustomDropdown
                            label="Category*"
                            value={formData.category}
                            onChange={(value) => setFormData({ ...formData, category: value })}
                            options={[
                                { value: 'interior', label: 'Interior' },
                                { value: 'exterior', label: 'Exterior' },
                                { value: 'hvac', label: 'HVAC' },
                                { value: 'plumbing', label: 'Plumbing' },
                                { value: 'electrical', label: 'Electrical' }
                            ]}
                            placeholder="Select Category"
                            required
                            buttonClassName="!bg-white !border-none !rounded-lg !py-3 !px-6"
                        />
                        <CustomDropdown
                            label="Sub-Category*"
                            value={formData.subCategory}
                            onChange={(value) => setFormData({ ...formData, subCategory: value })}
                            options={[
                                { value: 'lights', label: 'Lights/Beaping' },
                                { value: 'roof', label: 'Roof & Gutters' },
                                { value: 'filter', label: 'Filter Replacement' },
                                { value: 'pipes', label: 'Pipes & Fixtures' }
                            ]}
                            placeholder="Select Sub-Category"
                            required
                            buttonClassName="!bg-white !border-none !rounded-lg !py-3 !px-6"
                        />
                    </div>

                    {/* Property */}
                    <CustomDropdown
                        label="Property*"
                        value={formData.property}
                        onChange={(value) => setFormData({ ...formData, property: value })}
                        options={[
                            { value: 'luxury_property', label: 'Luxury Property' },
                            { value: 'sunset_villa', label: 'Sunset Villa' },
                            { value: 'ocean_view', label: 'Ocean View Apartments' },
                            { value: 'garden_heights', label: 'Garden Heights' }
                        ]}
                        placeholder="Select Property"
                        required
                        buttonClassName="!bg-white !border-none !rounded-lg !py-3 !px-6"
                    />

                    {/* Start Date and End Date */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Start Date*</label>
                            <DatePicker
                                value={formData.startDate}
                                onChange={(date) => setFormData({ ...formData, startDate: date })}
                                placeholder="dd/mm/yyyy"
                                className="!rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">End Date*</label>
                            <DatePicker
                                value={formData.endDate}
                                onChange={(date) => setFormData({ ...formData, endDate: date })}
                                placeholder="dd/mm/yyyy"
                                className="!rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Frequency */}
                    <div className="w-1/2">
                        <CustomDropdown
                            label="Frequency*"
                            value={formData.frequency}
                            onChange={(value) => setFormData({ ...formData, frequency: value })}
                            options={[
                                { value: 'daily', label: 'Daily' },
                                { value: 'weekly', label: 'Weekly' },
                                { value: 'biweekly', label: 'Bi-Weekly' },
                                { value: 'monthly', label: 'Monthly' },
                                { value: 'quarterly', label: 'Quarterly' },
                                { value: 'yearly', label: 'Yearly' }
                            ]}
                            placeholder="Select Frequency"
                            required
                            buttonClassName="!bg-white !border-none !rounded-lg !py-3 !px-6"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter description for the recurring request..."
                            rows={3}
                            className="w-full rounded-lg border-none px-6 py-3 text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20 resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleClose}
                            className="px-8 py-3 rounded-full bg-[#556370] text-white font-bold hover:opacity-90 transition-opacity"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-12 py-3 rounded-full bg-[#3D7475] text-white font-bold hover:opacity-90 transition-opacity"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRecurringRequestModal;
