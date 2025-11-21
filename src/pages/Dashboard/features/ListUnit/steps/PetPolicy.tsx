import React from 'react';

interface PetPolicyProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

const PetPolicy: React.FC<PetPolicyProps> = ({ data, updateData }) => {
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

            <div className="bg-[#F0F0F6] p-6 rounded-full shadow-sm w-full max-w-2xl flex justify-center items-center gap-12">
                <button
                    onClick={() => updateData('petsAllowed', true)}
                    className={`w-38 py-2 rounded-full text-white font-medium text-lg transition-all duration-200 ${data.petsAllowed === true
                        ? 'bg-[#84CC16] shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]'
                        : 'bg-[#84CC16] hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]'
                        }`}
                >
                    Yes
                </button>
                <button
                    onClick={() => updateData('petsAllowed', false)}
                    className={`w-38 py-2 rounded-full text-white font-medium text-lg transition-all duration-200 ${data.petsAllowed === false
                        ? 'bg-[#84CC16] shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]'
                        : 'bg-[#84CC16] hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]'
                        }`}
                >
                    No
                </button>
            </div>
        </div>
    );
};

export default PetPolicy;
