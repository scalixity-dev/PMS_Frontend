import React, { useState, useMemo } from 'react';
import { Undo2, Check } from 'lucide-react';
import MultiSelectDropdown from '../../../../../components/MultiSelectDropdown';
import { useGetProperty } from '../../../../../hooks/usePropertyQueries';
import { getCurrencySymbol } from '../../../../../utils/currency.utils';
import { useListUnitStore } from '../store/listUnitStore';

interface PetDetailsProps {
    propertyId?: string;
}

const PetDetails: React.FC<PetDetailsProps> = ({ propertyId }) => {
    const { formData, updateFormData } = useListUnitStore();
    const [showOtherDropdown, setShowOtherDropdown] = useState(false);

    // Use React Query to fetch property data
    const { data: property } = useGetProperty(propertyId || null, !!propertyId);

    // Get currency symbol based on property's country
    const currencySymbol = useMemo(() => {
        const countryCode = property?.address?.country;
        return getCurrencySymbol(countryCode);
    }, [property?.address?.country]);

    const togglePet = (pet: string) => {
        const currentPets = formData.pets || [];
        if (currentPets.includes(pet)) {
            updateFormData('pets', currentPets.filter((p: string) => p !== pet));
        } else {
            updateFormData('pets', [...currentPets, pet]);
        }
    };

    const handleOtherChange = (selectedOthers: string[]) => {
        const mainPets = ['Cat', 'Dog', 'Horse', 'Rabbit'];
        const currentMainPets = (formData.pets || []).filter((p: string) => mainPets.includes(p));
        updateFormData('pets', [...currentMainPets, ...selectedOthers]);
    };

    const otherOptions = [
        { value: 'Bird', label: 'Bird' },
        { value: 'Fish', label: 'Fish' },
        { value: 'Hamster', label: 'Hamster' },
        { value: 'Reptile', label: 'Reptile' },
        { value: 'Guinea Pig', label: 'Guinea Pig' }
    ];

    const inputClass = "w-full p-3 bg-[#84CC16] text-white placeholder-white/70 border-none rounded-lg focus:ring-2 focus:ring-white/50 outline-none text-center font-medium";
    const labelClass = "block text-xs font-bold text-gray-700 mb-1 ml-1";

    const PetCheckbox = ({ label, value }: { label: string, value: string }) => {
        const isSelected = (formData.pets || []).includes(value);
        return (
            <div
                onClick={() => togglePet(value)}
                className="flex items-center gap-3 cursor-pointer"
            >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-[#84CC16]' : 'bg-[#DFE5E3]'}`}>
                    {isSelected ? (
                        <Check size={24} className="text-white" />
                    ) : (
                        <div className="w-6 h-6 border-2 border-gray-400 rounded-sm" />
                    )}
                </div>
                <span className="text-gray-700 font-medium text-lg">{label}</span>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 text-[var(--color-heading)]">Pets</h2>
                <p className="text-[var(--color-subheading)] text-gray-500">
                    Specify what animals are allowed and add the pet policy if necessary.
                </p>
            </div>

            {/* Pet Selection Card */}
            <div className="bg-[#F3F4F6] p-8 rounded-[2rem] shadow-sm w-full">
                <div className="flex flex-wrap justify-between items-center gap-4 px-4">
                    <PetCheckbox label="Cat" value="Cat" />
                    <PetCheckbox label="Dog" value="Dog" />
                    <PetCheckbox label="Horse" value="Horse" />
                    <PetCheckbox label="rabbit" value="Rabbit" />

                    {/* Other Option */}
                    <div className="flex flex-col relative min-w-[150px]">
                        <div
                            onClick={() => setShowOtherDropdown(!showOtherDropdown)}
                            className="flex items-center gap-3 cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${showOtherDropdown ? 'bg-[#84CC16]' : 'bg-[#DFE5E3]'}`}>
                                {showOtherDropdown ? <Check size={24} className="text-white" /> : <div className="w-6 h-6 border-2 border-gray-400 rounded-sm" />}
                            </div>
                            <span className="text-gray-700 font-medium text-lg">Other</span>
                        </div>

                        {showOtherDropdown && (
                            <div className="absolute top-14 left-0 w-64 z-20">
                                <MultiSelectDropdown
                                    options={otherOptions}
                                    selectedValues={(formData.pets || []).filter((p: string) => !['Cat', 'Dog', 'Horse', 'Rabbit'].includes(p))}
                                    onChange={handleOtherChange}
                                    placeholder="Select other pets"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Deposits Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>
                        Pet Deposit {currencySymbol && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
                    </label>
                    <div className="relative">
                        {currencySymbol && (
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium">{currencySymbol}</span>
                        )}
                        <input
                            type="number"
                            className={`${inputClass} ${currencySymbol ? 'pl-8' : ''}`}
                            value={formData.petDeposit || ''}
                            onChange={(e) => updateFormData('petDeposit', e.target.value)}
                            placeholder={`${currencySymbol || '₹'} 0.00`}
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>
                        Pet Fee {currencySymbol && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
                    </label>
                    <div className="relative">
                        {currencySymbol && (
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium">{currencySymbol}</span>
                        )}
                        <input
                            type="number"
                            className={`${inputClass} ${currencySymbol ? 'pl-8' : ''}`}
                            value={formData.petRent || ''}
                            onChange={(e) => updateFormData('petRent', e.target.value)}
                            placeholder={`${currencySymbol || '₹'} 0.00`}
                        />
                    </div>
                </div>
            </div>

            {/* Description Card */}
            <div className="w-full bg-[#F3F4F6] rounded-2xl overflow-hidden shadow-sm border border-gray-200/50">
                {/* Header */}
                <div className="bg-[#3D7475] px-6 py-4 flex items-center gap-3 text-white">
                    <Undo2 size={20} className="rotate-180" />
                    <span className="font-medium text-lg">Description</span>
                </div>

                {/* Textarea */}
                <div className="p-0">
                    <textarea
                        value={formData.petDescription || ''}
                        onChange={(e) => updateFormData('petDescription', e.target.value)}
                        placeholder="Add the marketing description here."
                        className="w-full h-48 p-6 bg-[#F3F4F6] resize-none focus:outline-none text-gray-700 placeholder-gray-500"
                    />
                    <div className="w-full flex justify-end px-4 pb-2">
                        <div className="text-gray-400">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M11 5L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M11 9L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetails;
