import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '@/pages/Dashboard/components/CustomDropdown';
import DatePicker from '@/components/ui/DatePicker';

interface EditLeaseTermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onUpdate: (data: any) => void;
}

const EditLeaseTermsModal: React.FC<EditLeaseTermsModalProps> = ({ isOpen, onClose, initialData, onUpdate }) => {
    const [property, setProperty] = useState('');
    const [leaseName, setLeaseName] = useState('');
    const [leaseType, setLeaseType] = useState('');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    // Mock options
    const propertyOptions = [
        { value: 'Luxury Apartments', label: 'Luxury Apartments' },
        { value: 'Grove Street', label: 'Grove Street' },
    ];

    const leaseTypeOptions = [
        { value: 'Fixed', label: 'Fixed' },
        { value: 'Month-to-Month', label: 'Month-to-Month' },
    ];

    useEffect(() => {
        if (isOpen && initialData) {
            setProperty(initialData.property || '');
            setLeaseName(initialData.lease || '');
            // setLeaseType... (mock data doesn't have local type, defaulting)
            // Parse dates if available
        } else {
            // Reset
            setProperty('');
            setLeaseName('');
            setLeaseType('');
            setStartDate(undefined);
            setEndDate(undefined);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleUpdate = () => {
        onUpdate({
            property,
            leaseName,
            leaseType,
            startDate,
            endDate
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-[#E0E8E7] w-full max-w-2xl rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-[#3D7475] px-6 py-4 flex items-center justify-between ">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="text-white hover:opacity-80 transition-opacity">
                            <ChevronLeft size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-white">Edit lease terms</h2>
                    </div>
                    <button onClick={onClose} className="text-white hover:opacity-80 transition-opacity">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        {/* Property */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#374151] font-bold text-sm ml-1">Property *</label>
                            <CustomDropdown
                                value={property}
                                onChange={setProperty}
                                options={propertyOptions}
                                placeholder="Choose Type"
                                buttonClassName="bg-white border-none rounded-lg px-4 py-3 h-[50px] w-full text-left"
                                textClassName="text-gray-700 font-medium"
                                dropdownClassName="rounded-lg mt-1 z-50"
                            />
                        </div>

                        {/* Lease */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#374151] font-bold text-sm ml-1">Lease *</label>
                            <input
                                type="text"
                                value={leaseName}
                                onChange={(e) => setLeaseName(e.target.value)}
                                className="bg-white rounded-lg px-4 py-3 h-[50px] w-full text-gray-700 font-medium outline-none focus:ring-2 focus:ring-[#3D7475]/20"
                                placeholder="Type here"
                            />
                        </div>

                        {/* Lease Type */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#374151] font-bold text-sm ml-1">Lease Type *</label>
                            <CustomDropdown
                                value={leaseType}
                                onChange={setLeaseType}
                                options={leaseTypeOptions}
                                placeholder="Choose Type"
                                buttonClassName="bg-white border-none rounded-lg px-4 py-3 h-[50px] w-full text-left"
                                textClassName="text-gray-700 font-medium"
                                dropdownClassName="rounded-lg mt-1 z-40"
                            />
                        </div>

                        {/* Start Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#374151] font-bold text-sm ml-1">Start Date*</label>
                            <DatePicker
                                value={startDate}
                                onChange={setStartDate}
                                className="bg-white rounded-lg px-4 py-3 h-[50px] w-full text-gray-700 font-medium outline-none focus:ring-2 focus:ring-[#3D7475]/20 shadow-none border-none"
                                placeholder="DD/MM/YYYY"
                                popoverClassName="z-[60]"
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#374151] font-bold text-sm ml-1">End Date*</label>
                            <DatePicker
                                value={endDate}
                                onChange={setEndDate}
                                className="bg-white rounded-lg px-4 py-3 h-[50px] w-full text-gray-700 font-medium outline-none focus:ring-2 focus:ring-[#3D7475]/20 shadow-none border-none"
                                placeholder="DD/MM/YYYY"
                                popoverClassName="z-[60]"
                            />
                        </div>
                    </div>

                    {/* Footer / Update Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleUpdate}
                            className="bg-[#3D7475] text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-[#2c5251] transition-colors shadow-lg"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLeaseTermsModal;
