import React, { useMemo, useEffect, useRef } from 'react';
import { Undo2 } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import Toggle from '../../../../../components/Toggle';
import { useGetProperty } from '../../../../../hooks/usePropertyQueries';
import { getCurrencySymbol } from '../../../../../utils/currency.utils';
import { useListUnitStore } from '../store/listUnitStore';

interface LeasingDetailsProps {
  propertyId?: string;
}

const LeasingDetails: React.FC<LeasingDetailsProps> = ({ propertyId }) => {
  const { formData, updateFormData } = useListUnitStore();
  const previousPropertyIdRef = useRef<string | undefined>(propertyId);
  
  // Use React Query to fetch property data
  const { data: property } = useGetProperty(propertyId || null, !!propertyId);

  // Clear form data when propertyId changes to prevent data leakage
  useEffect(() => {
    // Only clear if propertyId actually changed (not on initial mount with same property)
    if (previousPropertyIdRef.current !== undefined && previousPropertyIdRef.current !== propertyId) {
      // Property changed - clear all leasing fields to prevent showing data from previous property
      updateFormData('rent', '');
      updateFormData('deposit', '');
      updateFormData('refundable', '');
      updateFormData('availableDate', '');
      updateFormData('minLeaseDuration', '');
      updateFormData('maxLeaseDuration', '');
      updateFormData('description', '');
    }
    // Update ref to track current propertyId
    previousPropertyIdRef.current = propertyId;
  }, [propertyId, updateFormData]);
  
  const inputClass = "w-full p-3 bg-[#84CC16] text-white placeholder-white/70 border-none rounded-lg focus:ring-2 focus:ring-white/50 outline-none text-center font-medium";
  const labelClass = "block text-xs font-medium text-gray-700 mb-1 ml-1";

  // Get currency symbol based on property's country
  const currencySymbol = useMemo(() => {
    const countryCode = property?.address?.country;
    return getCurrencySymbol(countryCode);
  }, [property?.address?.country]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Main Lease Details Card */}
      <div className="bg-[#F3F4F6] p-8 rounded-[2rem] shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Monthly Rent */}
          <div>
            <label className={labelClass}>
              Monthly rent* {currencySymbol && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
            </label>
            <div className="relative">
              {currencySymbol && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium">{currencySymbol}</span>
              )}
              <input
                type="number"
                className={`${inputClass} ${currencySymbol ? 'pl-8' : ''}`}
                value={formData.rent || ''}
                onChange={(e) => updateFormData('rent', e.target.value)}
                placeholder={`${currencySymbol || '₹'} 50,000`}
              />
            </div>
          </div>

          {/* Security Deposit */}
          <div>
            <label className={labelClass}>
              Security deposit* {currencySymbol && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
            </label>
            <div className="relative">
              {currencySymbol && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium">{currencySymbol}</span>
              )}
              <input
                type="number"
                className={`${inputClass} ${currencySymbol ? 'pl-8' : ''}`}
                value={formData.deposit || ''}
                onChange={(e) => updateFormData('deposit', e.target.value)}
                placeholder={`${currencySymbol || '₹'} 0.00`}
              />
            </div>
          </div>

          {/* Amount Refundable */}
          <div>
            <label className={labelClass}>
              Amount refundable* {currencySymbol && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
            </label>
            <div className="relative">
              {currencySymbol && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium">{currencySymbol}</span>
              )}
              <input
                type="number"
                className={`${inputClass} ${currencySymbol ? 'pl-8' : ''}`}
                value={formData.refundable || ''}
                onChange={(e) => updateFormData('refundable', e.target.value)}
                placeholder={`${currencySymbol || '₹'} 0.00`}
              />
            </div>
          </div>

          {/* Date Available */}
          <div>
            <label className={labelClass}>Date Available*</label>
            <div className="relative">
              <input
                type={formData.availableDate ? "date" : "text"}
                className={`${inputClass} cursor-pointer mt-1`}
                value={formData.availableDate || ''}
                onChange={(e) => updateFormData('availableDate', e.target.value)}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                placeholder="Select Date"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* Min Lease Duration */}
          <div>
            <CustomDropdown
              label="Min lease duration*"
              value={formData.minLeaseDuration || ''}
              onChange={(value: string) => updateFormData('minLeaseDuration', value)}
              options={[
                { value: '6', label: '6 Months' },
                { value: '12', label: '12 Months' },
                { value: '18', label: '18 Months' },
                { value: '24', label: '24 Months' }
              ]}
              placeholder="Min lease duration"
              buttonClassName="!bg-[#84CC16] !border-none text-white hover:!border-none"
              textClassName="text-white font-medium"
            />
          </div>

          {/* Max Lease Duration */}
          <div>
            <CustomDropdown
              label="Max lease duration*"
              value={formData.maxLeaseDuration || ''}
              onChange={(value: string) => updateFormData('maxLeaseDuration', value)}
              options={[
                { value: '12', label: '12 Months' },
                { value: '24', label: '24 Months' },
                { value: '36', label: '36 Months' }
              ]}
              placeholder="Max lease duration"
              buttonClassName="!bg-[#84CC16] !border-none text-white hover:!border-none"
              textClassName="text-white font-medium"
            />
          </div>
        </div>

        {/* Month-to-Month Toggle */}
        <div className="flex items-center gap-3 mt-4">
          <Toggle
            checked={formData.monthToMonth || false}
            onChange={(checked: boolean) => updateFormData('monthToMonth', checked)}
          />
          <span className="text-sm font-medium text-gray-700">Month-to-Month</span>
        </div>
      </div>

      {/* Description Card */}
      <div className="w-full bg-[#F3F4F6] rounded-4xl overflow-hidden shadow-sm border border-gray-200/50">
        {/* Header */}
        <div className="bg-[#3D7475] px-6 py-4 flex items-center gap-3 text-white">
          <Undo2 size={20} className="rotate-180" />
          <span className="font-medium text-lg">Description</span>
        </div>

        {/* Textarea */}
        <div className="p-0">
          <textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Add the marketing description here."
            className="w-full h-48 p-6 bg-[#F3F4F6] resize-none focus:outline-none text-gray-700 placeholder-gray-500"
          />
          
        </div>
      </div>
    </div>
  );
};

export default LeasingDetails;
