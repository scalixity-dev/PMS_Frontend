import React from 'react';
import { Undo2 } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import Toggle from '../../../../../components/Toggle';

interface LeasingDetailsProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

const LeasingDetails: React.FC<LeasingDetailsProps> = ({ data, updateData }) => {
  const inputClass = "w-full p-3 bg-[#84CC16] text-white placeholder-white/70 border-none rounded-lg focus:ring-2 focus:ring-white/50 outline-none text-center font-medium";
  const labelClass = "block text-xs font-medium text-gray-700 mb-1 ml-1";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Main Lease Details Card */}
      <div className="bg-[#F3F4F6] p-8 rounded-[2rem] shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Monthly Rent */}
          <div>
            <label className={labelClass}>Monthly rent*</label>
            <input
              type="number"
              className={inputClass}
              value={data.rent || ''}
              onChange={(e) => updateData('rent', e.target.value)}
              placeholder="₹ 50,000"
            />
          </div>

          {/* Security Deposit */}
          <div>
            <label className={labelClass}>Security deposit*</label>
            <input
              type="number"
              className={inputClass}
              value={data.deposit || ''}
              onChange={(e) => updateData('deposit', e.target.value)}
              placeholder="000.00"
            />
          </div>

          {/* Amount Refundable */}
          <div>
            <label className={labelClass}>Amount refundable*</label>
            <input
              type="number"
              className={inputClass}
              value={data.refundable || ''}
              onChange={(e) => updateData('refundable', e.target.value)}
              placeholder="000.00"
            />
          </div>

          {/* Date Available */}
          <div>
            <label className={labelClass}>Date Available*</label>
            <div className="relative">
              <input
                type={data.availableDate ? "date" : "text"}
                className={`${inputClass} cursor-pointer mt-1`}
                value={data.availableDate || ''}
                onChange={(e) => updateData('availableDate', e.target.value)}
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
              value={data.minLeaseDuration || ''}
              onChange={(value: string) => updateData('minLeaseDuration', value)}
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
              value={data.maxLeaseDuration || ''}
              onChange={(value: string) => updateData('maxLeaseDuration', value)}
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
            checked={data.monthToMonth || false}
            onChange={(checked: boolean) => updateData('monthToMonth', checked)}
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
            value={data.description || ''}
            onChange={(e) => updateData('description', e.target.value)}
            placeholder="Add the marketing description here."
            className="w-full h-48 p-6 bg-[#F3F4F6] resize-none focus:outline-none text-gray-700 placeholder-gray-500"
          />
          
        </div>
      </div>
    </div>
  );
};

export default LeasingDetails;
