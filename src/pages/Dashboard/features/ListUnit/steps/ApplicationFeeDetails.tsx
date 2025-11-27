import React, { useState, useEffect, useMemo } from 'react';
import { propertyService } from '../../../../../services/property.service';
import { getCurrencySymbol } from '../../../../../utils/currency.utils';

interface ApplicationFeeDetailsProps {
    data: any;
    updateData: (key: string, value: any) => void;
    propertyId?: string;
}

const ApplicationFeeDetails: React.FC<ApplicationFeeDetailsProps> = ({ data, updateData, propertyId }) => {
    const [property, setProperty] = useState<any>(null);

    // Fetch property data to get country for currency
    useEffect(() => {
        const fetchProperty = async () => {
            if (!propertyId) return;
            
            try {
                const propertyData = await propertyService.getOne(propertyId);
                setProperty(propertyData);
            } catch (err) {
                console.error('Error fetching property:', err);
            }
        };

        fetchProperty();
    }, [propertyId]);

    // Get currency symbol based on property's country
    const currencySymbol = useMemo(() => {
        const countryCode = property?.address?.country;
        return getCurrencySymbol(countryCode);
    }, [property?.address?.country]);
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
                        Application Fee* {currencySymbol && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
                    </label>
                    <div className="relative">
                        {currencySymbol && (
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium z-10">{currencySymbol}</span>
                        )}
                        <input
                            type="number"
                            value={data.applicationFeeAmount || ''}
                            onChange={(e) => updateData('applicationFeeAmount', e.target.value)}
                            placeholder={`${currencySymbol || '$'} 0.00`}
                            className={`w-full bg-[#84CC16] text-white placeholder-white/80 text-center text-lg font-medium py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#84CC16] ${currencySymbol ? 'pl-8' : ''}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationFeeDetails;
