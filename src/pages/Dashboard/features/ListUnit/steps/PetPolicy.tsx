import React from 'react';
import YesNoToggle from '../../../../../components/common/YesNoToggle';
import { useListUnitStore } from '../store/listUnitStore';

interface PetPolicyProps {
    propertyId?: string;
}

const PetPolicy: React.FC<PetPolicyProps> = () => {
    const { formData, updateFormData } = useListUnitStore();

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-[var(--color-heading)]">
                    Do you allow pets in your property?
                </h2>
                <p className="text-[var(--color-subheading)] text-gray-500">
                    Let your tenants know if pets are allowed in the property.
                </p>
            </div>

            <YesNoToggle
                value={formData.petsAllowed}
                onChange={(val) => updateFormData('petsAllowed', val)}
            />
        </div>
    );
};

export default PetPolicy;
