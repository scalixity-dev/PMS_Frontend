import React from 'react';
import CustomDropdown from '../../../components/CustomDropdown';

interface LeasingDetailsProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

const LeasingDetails: React.FC<LeasingDetailsProps> = ({ data, updateData }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Rent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            value={data.rent || ''}
            onChange={(e) => updateData('rent', e.target.value)}
            placeholder="0.00"
          />
        </div>

        {/* Security Deposit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit ($)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            value={data.deposit || ''}
            onChange={(e) => updateData('deposit', e.target.value)}
            placeholder="0.00"
          />
        </div>

        {/* Lease Duration */}
        <div className="col-span-2 md:col-span-1">
          <CustomDropdown
            label="Lease Duration"
            value={data.leaseDuration || ''}
            onChange={(value) => updateData('leaseDuration', value)}
            options={[
              { value: '6', label: '6 Months' },
              { value: '12', label: '12 Months' },
              { value: '18', label: '18 Months' },
              { value: '24', label: '24 Months' }
            ]}
            placeholder="Select duration"
          />
        </div>

        {/* Available Date */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Available</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            value={data.availableDate || ''}
            onChange={(e) => updateData('availableDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default LeasingDetails;
