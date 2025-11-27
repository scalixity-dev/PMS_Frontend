import React, { useState, useEffect, useMemo } from 'react';
import { Country, State, City } from 'country-state-city';
import type { ICountry, IState, ICity } from 'country-state-city';
import CustomDropdown from '../../../../components/CustomDropdown';
import { propertyService } from '../../../../../../services/property.service';
import { authService } from '../../../../../../services/auth.service';
import NextStepButton from '../../components/NextStepButton';
import { getCurrencySymbol } from '../../../../../../utils/currency.utils';

interface GeneralInfoProps {
    data: any;
    updateData: (key: string, value: any) => void;
    onPropertyCreated?: (propertyId: string) => void;
    propertyId?: string; // If property already exists, use this to update instead of create
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ data, updateData, onPropertyCreated, propertyId }) => {
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [managerId, setManagerId] = useState<string | null>(null);

    // Load all countries on mount
    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    // Get current user ID on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                setManagerId(user.userId);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };
        fetchUser();
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (data.country) {
            const countryStates = State.getStatesOfCountry(data.country);
            setStates(countryStates);
            // Reset state and city when country changes
            if (data.stateRegion) {
                updateData('stateRegion', '');
            }
            if (data.city) {
                updateData('city', '');
            }
        } else {
            setStates([]);
        }
    }, [data.country]);

    // Load cities when state changes
    useEffect(() => {
        if (data.country && data.stateRegion) {
            const stateCities = City.getCitiesOfState(data.country, data.stateRegion);
            setCities(stateCities);
            // Reset city when state changes
            if (data.city) {
                updateData('city', '');
            }
        } else {
            setCities([]);
        }
    }, [data.country, data.stateRegion]);

    // Convert countries to dropdown options
    const countryOptions = useMemo(() => {
        return countries.map(country => ({
            value: country.isoCode,
            label: country.name
        })).sort((a, b) => a.label.localeCompare(b.label));
    }, [countries]);

    // Convert states to dropdown options
    const stateOptions = useMemo(() => {
        return states.map(state => ({
            value: state.isoCode,
            label: state.name
        })).sort((a, b) => a.label.localeCompare(b.label));
    }, [states]);

    // Convert cities to dropdown options
    const cityOptions = useMemo(() => {
        return cities.map(city => ({
            value: city.name,
            label: city.name
        })).sort((a, b) => a.label.localeCompare(b.label));
    }, [cities]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateData(name, value);
    };

    const handleRadioChange = (value: string) => {
        updateData('isManufactured', value);
    };

    const handleCountryChange = (value: string) => {
        updateData('country', value);
    };

    const handleStateChange = (value: string) => {
        updateData('stateRegion', value);
    };

    const handleCityChange = (value: string) => {
        updateData('city', value);
    };

    // Get current currency symbol based on selected country
    const currencySymbol = useMemo(() => {
        return getCurrencySymbol(data.country);
    }, [data.country]);

    // Validate required fields for GeneralInfo
    const isFormValid = () => {
        return !!(
            data.propertyName &&
            data.propertyType &&
            data.isManufactured &&
            data.marketRent &&
            data.beds &&
            data.bathrooms &&
            data.sizeSquareFt &&
            data.yearBuilt &&
            data.address &&
            data.city &&
            data.stateRegion &&
            data.country &&
            data.zip &&
            managerId
        );
    };

    // Map GeneralInfo data to backend format
    const mapGeneralInfoToBackend = () => {
        const propertyType: 'SINGLE' | 'MULTI' = 'SINGLE'; // Default to SINGLE for GeneralInfo

        const address = data.address && data.city && data.stateRegion && data.zip && data.country
            ? {
                streetAddress: data.address,
                city: data.city,
                stateRegion: data.stateRegion,
                zipCode: data.zip,
                country: data.country,
            }
            : undefined;

        const singleUnitDetails = data.beds
            ? {
                beds: parseInt(data.beds) || 0,
                baths: data.bathrooms ? parseFloat(data.bathrooms) : undefined,
                marketRent: data.marketRent ? parseFloat(data.marketRent) : undefined,
            }
            : undefined;

        return {
            managerId: managerId!,
            propertyName: data.propertyName,
            propertyType,
            yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : undefined,
            sizeSqft: data.sizeSquareFt ? parseFloat(data.sizeSquareFt) : undefined,
            marketRent: data.marketRent ? parseFloat(data.marketRent) : undefined,
            address,
            singleUnitDetails,
        };
    };

    // Handle save/create property
    const handleSaveAndContinue = async () => {
        if (!isFormValid()) {
            setSaveError('Please fill in all required fields');
            return;
        }

        if (!managerId) {
            setSaveError('User information not loaded. Please refresh the page.');
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            if (propertyId) {
                // Update existing property
                const updateData = mapGeneralInfoToBackend();
                await propertyService.update(propertyId, updateData);
                if (onPropertyCreated) {
                    onPropertyCreated(propertyId);
                }
            } else {
                // Create new property
                const createData = mapGeneralInfoToBackend();
                const createdProperty = await propertyService.create(createData);
                if (onPropertyCreated && createdProperty.id) {
                    onPropertyCreated(createdProperty.id);
                }
            }
        } catch (err) {
            console.error('Error saving property:', err);
            setSaveError(err instanceof Error ? err.message : 'Failed to save property. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Create New Property</h2>
                <p className="text-[var(--color-subheading)]">Enter the details for your new property.</p>
            </div>

            <div className="w-full max-w-2xl mx-auto space-y-6">
                {/* Property Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Name*
                    </label>
                    <input
                        type="text"
                        name="propertyName"
                        value={data.propertyName}
                        onChange={handleChange}
                        placeholder="Property Name"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
                        required
                    />
                </div>

                {/* Property Type */}
                <CustomDropdown
                    label="Property Type"
                    value={data.propertyType}
                    onChange={(value) => updateData('propertyType', value)}
                    options={[
                        { value: 'apartment', label: 'Apartment' },
                        { value: 'house', label: 'House' },
                        { value: 'condo', label: 'Condo' },
                        { value: 'townhouse', label: 'Townhouse' },
                        { value: 'duplex', label: 'Duplex' }
                    ]}
                    placeholder="Property Type"
                    required
                />

                {/* Manufactured Home Radio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Is this property a manufactured/mobile home?*
                    </label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="isManufactured"
                                value="yes"
                                checked={data.isManufactured === 'yes'}
                                onChange={() => handleRadioChange('yes')}
                                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
                                required
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="isManufactured"
                                value="no"
                                checked={data.isManufactured === 'no'}
                                onChange={() => handleRadioChange('no')}
                                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
                                required
                            />
                            <span className="text-sm text-gray-700">No</span>
                        </label>
                    </div>
                </div>

                {/* Market Rent & Beds */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Market Rent* {data.country && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">{currencySymbol}</span>
                            <input
                                type="number"
                                name="marketRent"
                                value={data.marketRent}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
                                required
                            />
                        </div>
                    </div>
                    <CustomDropdown
                        label="Beds"
                        value={data.beds}
                        onChange={(value) => updateData('beds', value)}
                        options={[
                            { value: '0', label: 'Studio' },
                            { value: '1', label: '1' },
                            { value: '2', label: '2' },
                            { value: '3', label: '3' },
                            { value: '4', label: '4' },
                            { value: '5', label: '5+' }
                        ]}
                        placeholder="Select beds"
                        required
                    />
                </div>

                {/* Baths & Size sq ft */}
                <div className="grid grid-cols-2 gap-4">
                    <CustomDropdown
                        label="Baths"
                        value={data.bathrooms}
                        onChange={(value) => updateData('bathrooms', value)}
                        options={[
                            { value: '1', label: '1' },
                            { value: '1.5', label: '1.5' },
                            { value: '2', label: '2' },
                            { value: '2.5', label: '2.5' },
                            { value: '3', label: '3' },
                            { value: '3.5', label: '3.5' },
                            { value: '4', label: '4+' }
                        ]}
                        placeholder="Select baths"
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Size sq ft*
                        </label>
                        <input
                            type="number"
                            name="sizeSquareFt"
                            value={data.sizeSquareFt}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
                            required
                        />
                    </div>
                </div>

                {/* Year Built */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year Built*
                    </label>
                    <input
                        type="number"
                        name="yearBuilt"
                        value={data.yearBuilt}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
                        required
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address*
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={data.address || ''}
                        onChange={handleChange}
                        placeholder="Enter street address"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
                        required
                    />
                </div>

                {/* Country & State/Region */}
                <div className="grid grid-cols-2 gap-4">
                    <CustomDropdown
                        label="Country*"
                        value={data.country}
                        onChange={handleCountryChange}
                        options={countryOptions}
                        placeholder="Select country"
                        required
                        disabled={countryOptions.length === 0}
                        searchable={true}
                    />
                    <CustomDropdown
                        label="State / Region*"
                        value={data.stateRegion}
                        onChange={handleStateChange}
                        options={stateOptions}
                        placeholder={data.country ? "Select state" : "Select country first"}
                        required
                        disabled={!data.country || stateOptions.length === 0}
                        searchable={true}
                    />
                </div>

                {/* City & Zip */}
                <div className="grid grid-cols-2 gap-4">
                    <CustomDropdown
                        label="City*"
                        value={data.city}
                        onChange={handleCityChange}
                        options={cityOptions}
                        placeholder={data.stateRegion ? "Select city" : data.country ? "Select state first" : "Select country first"}
                        required
                        disabled={!data.stateRegion || cityOptions.length === 0}
                        searchable={true}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zip*
                        </label>
                        <input
                            type="text"
                            name="zip"
                            value={data.zip}
                            onChange={handleChange}
                            placeholder="Zip Code"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
                            required
                        />
                    </div>
                </div>

                {/* Error Message */}
                {saveError && (
                    <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">{saveError}</p>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-center pt-6">
                    <NextStepButton 
                        onClick={handleSaveAndContinue} 
                        disabled={isSaving || !managerId || !isFormValid()}
                    >
                        {isSaving ? 'Saving...' : propertyId ? 'Update & Continue' : 'Save & Continue'}
                    </NextStepButton>
                </div>
            </div>
        </div>
    );
};

export default GeneralInfo;
