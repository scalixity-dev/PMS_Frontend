import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import CustomDropdown from '../../../components/CustomDropdown';
import CurrencySelector from '../../../../../components/ui/CurrencySelector';

interface AddUtilityProviderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: {
        providerType: string;
        servicePro: string;
        estimatedCost: string;
        currency: string;
    }) => void;
}

// Reuse the utility options from ResponsibilityModal or define shared constant
const PROVIDER_TYPE_OPTIONS = [
    { label: 'Cable/Satellite', value: 'Cable/Satellite' },
    { label: 'City Services', value: 'City Services' },
    { label: 'HOA/CAM/Strata', value: 'HOA/CAM/Strata' },
    { label: 'Internet', value: 'Internet' },
    { label: 'Phone', value: 'Phone' },
    { label: 'Landscaping', value: 'Landscaping' },
    { label: 'Electrical Services', value: 'Electrical Services' },
    { label: 'Garbage Service', value: 'Garbage Service' },
    { label: 'Home Security', value: 'Home Security' },
    { label: 'Gas Services', value: 'Gas Services' },
    { label: 'Laundry Services', value: 'Laundry Services' },
    { label: 'Government', value: 'Government' },
    { label: 'Cable & Communication Services', value: 'Cable & Communication Services' },
    { label: 'Pest Control', value: 'Pest Control' },
    { label: 'Snow Removal', value: 'Snow Removal' },
    { label: 'Sewer', value: 'Sewer' },
    { label: 'Water', value: 'Water' },
];

const SERVICE_PRO_OPTIONS = [
    { label: 'DirectTV Services Inc.', value: 'DirectTV Services Inc.' },
    { label: 'Xfinity', value: 'Xfinity' },
    { label: 'City Water Dept', value: 'City Water Dept' },
    { label: 'ADT Security', value: 'ADT Security' },
    // Mock options
];

const AddUtilityProviderModal: React.FC<AddUtilityProviderModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [providerType, setProviderType] = useState('');
    const [servicePro, setServicePro] = useState('');
    const [estimatedCost, setEstimatedCost] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleAdd = () => {
        const newErrors: { [key: string]: string } = {};

        if (!providerType) newErrors.providerType = 'Provider type is required';
        if (!servicePro) newErrors.servicePro = 'Service Pro is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onAdd({
            providerType,
            servicePro,
            estimatedCost,
            currency
        });

        // Reset
        setProviderType('');
        setServicePro('');
        setEstimatedCost('');
        setErrors({});
        setOpenDropdown(null);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">Add utility provider</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className={cn("p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out", openDropdown ? "pb-64" : "")}>
                    <div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            By adding the utility provider contacts this information will be shared with the connected tenants available in the lease so they will know whom to contact when setting up their utilities.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="font-bold text-[#2c3e50]">Utility provider</div>

                        {/* Provider Type */}
                        <div className={cn("transition-all duration-300 ease-in-out", openDropdown === 'providerType' ? "mb-64" : "")}>
                            <CustomDropdown
                                label="Utility provider type"
                                required={true}
                                value={providerType}
                                onChange={(val) => {
                                    setProviderType(val);
                                    if (errors.providerType) setErrors({ ...errors, providerType: '' });
                                }}
                                options={PROVIDER_TYPE_OPTIONS}
                                placeholder="Select provider type"
                                className="w-full"
                                isOpen={openDropdown === 'providerType'}
                                onToggle={(isOpen) => setOpenDropdown(isOpen ? 'providerType' : null)}
                                error={errors.providerType}
                                searchable={true}
                            />
                            {errors.providerType && <p className="text-red-600 text-xs mt-1 ml-1">{errors.providerType}</p>}
                        </div>

                        {/* Service Pro */}
                        <div className={cn("transition-all duration-300 ease-in-out", openDropdown === 'servicePro' ? "mb-64" : "")}>
                            <CustomDropdown
                                label="Service Pro"
                                required={true}
                                value={servicePro}
                                onChange={(val) => {
                                    setServicePro(val);
                                    if (errors.servicePro) setErrors({ ...errors, servicePro: '' });
                                }}
                                options={SERVICE_PRO_OPTIONS}
                                placeholder="Select Service Pro"
                                className="w-full"
                                isOpen={openDropdown === 'servicePro'}
                                onToggle={(isOpen) => setOpenDropdown(isOpen ? 'servicePro' : null)}
                                error={errors.servicePro}
                                searchable={true}
                            />
                            {errors.servicePro && <p className="text-red-600 text-xs mt-1 ml-1">{errors.servicePro}</p>}
                        </div>

                        {/* Estimated Cost */}
                        <div className={cn("transition-all duration-300 ease-in-out", openDropdown === 'currency' ? "mb-64" : "")}>
                            <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Estimated monthly cost</label>
                            <div className="flex rounded-lg shadow-sm">
                                <CurrencySelector
                                    value={currency}
                                    onChange={setCurrency}
                                    onToggle={(isOpen) => setOpenDropdown(isOpen ? 'currency' : null)}
                                    className="rounded-l-lg border-y border-l border-r-0 border-gray-200"
                                />
                                <input
                                    type="text"
                                    value={estimatedCost}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*\.?\d*$/.test(val)) {
                                            setEstimatedCost(val);
                                        }
                                    }}
                                    className="flex-1 w-full p-3 rounded-r-lg border border-gray-200 outline-none text-base sm:text-sm text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white ml-[-1px]"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 shrink-0 mt-auto">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddUtilityProviderModal;
