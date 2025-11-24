import React from 'react';

interface ApplicationFeeDetailsProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

const ApplicationFeeDetails: React.FC<ApplicationFeeDetailsProps> = ({ data, updateData }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-[var(--color-heading)]">
                    Application fee
                </h2>
                <p className="text-[var(--color-subheading)] text-gray-500 max-w-lg mx-auto">
                    You can find more details on how application fee can be changed in the Rental Application Settings.
                </p>
            </div>

            <div className="w-full max-w-2xl bg-[#F0F0F6] p-8 rounded-[30px] shadow-sm flex justify-center">
                <div className="w-full max-w-md">
                    <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                        Application Fees*
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={data.applicationFeeAmount || ''}
                            onChange={(e) => updateData('applicationFeeAmount', e.target.value)}
                            placeholder="00.00"
                            className="w-full bg-[#84CC16] text-white placeholder-white/80 text-center text-lg font-medium py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#84CC16]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationFeeDetails;
