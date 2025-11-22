import React from 'react';
import YesNoToggle from '../../../../../components/common/YesNoToggle';

interface ApplicationFeeProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

const ApplicationFee: React.FC<ApplicationFeeProps> = ({ data, updateData }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-[var(--color-heading)]">
                    Do you require your applicants to pay application fee?
                </h2>
                <p className="text-[var(--color-subheading)] text-gray-500">
                    You can find more details in the Rental applications settings.
                </p>
            </div>

            <YesNoToggle
                value={data.applicationFee}
                onChange={(val) => updateData('applicationFee', val)}
            />
        </div>
    );
};

export default ApplicationFee;
