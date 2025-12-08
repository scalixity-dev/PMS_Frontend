import React, { useState } from 'react';
import DatePicker from '../../../../../components/ui/DatePicker';
import CustomCheckbox from '../../../../../components/ui/CustomCheckbox';
import SearchableDropdown from '../../../../../components/ui/SearchableDropdown';

interface MoveInRecurringRentSettingsProps {
    onNext: () => void;
    onBack: () => void;
    amount: string;
    onAmountChange: (amount: string) => void;
}

const SCHEDULE_OPTIONS = [
    'Daily',
    'Weekly',
    'Every two weeks',
    'Every four weeks',
    'Monthly',
    'Every two months',
    'Quarterly',
    'Yearly'
];


const MoveInRecurringRentSettings: React.FC<MoveInRecurringRentSettingsProps> = ({ onNext, amount, onAmountChange }) => {
    // State for form fields
    const [invoiceSchedule, setInvoiceSchedule] = useState('Monthly');
    const [startOn, setStartOn] = useState<Date | undefined>(undefined);
    const [endOn, setEndOn] = useState<Date | undefined>(undefined);
    const [isMonthToMonth, setIsMonthToMonth] = useState(false);
    const [markPastPaid, setMarkPastPaid] = useState(false);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">Recurring Rent settings</h2>
                <p className="text-[#6B7280]">Enable the automatic lease rent invoicing.</p>
            </div>

            <div className="w-full max-w-2xl bg-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    {/* Amount * */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Amount *</label>
                        <div className="relative">
                            <div className="w-full flex items-center bg-[#7BD747] text-white px-4 py-3 rounded-xl font-medium shadow-sm">
                                <span className="mr-1 text-white">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => onAmountChange(e.target.value)}
                                    className="bg-transparent text-white placeholder-white/70 outline-none w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Start on * */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Start on *</label>
                        <div className="relative">
                            <DatePicker
                                value={startOn}
                                onChange={setStartOn}
                                placeholder="dd/mm/yyyy"
                                className="bg-[#7BD747] text-white border-none rounded-xl hover:bg-[#7BD747]/90 placeholder:text-white"
                                popoverClassName="z-50"
                                iconClassName="text-white"
                                placeholderClassName="text-white"
                            />
                        </div>
                    </div>

                    {/* Invoice Schedule * - New Dropdown */}
                    <SearchableDropdown
                        label="Invoice Schedule *"
                        value={invoiceSchedule}
                        options={SCHEDULE_OPTIONS}
                        onChange={setInvoiceSchedule}
                    />

                    {/* End on * */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">End on *</label>
                        <div className="relative">
                            <DatePicker
                                value={endOn}
                                onChange={setEndOn}
                                placeholder="dd/mm/yyyy"
                                className="bg-[#7BD747] text-white border-none rounded-xl hover:bg-[#7BD747]/90 placeholder:text-white"
                                popoverClassName="z-50"
                                iconClassName="text-white"
                                placeholderClassName="text-white"
                                disabled={isMonthToMonth}
                            />
                        </div>
                    </div>

                </div>



                {/* Checkboxes */}
                <div className="flex flex-col md:flex-row gap-6 mt-8">
                    {/* Month-to-month */}
                    <CustomCheckbox
                        label="Month-to-month"
                        checked={isMonthToMonth}
                        onChange={setIsMonthToMonth}
                    />

                    {/* Mark all past invoices as paid */}
                    <CustomCheckbox
                        label="Mark all past invoices as paid"
                        checked={markPastPaid}
                        onChange={setMarkPastPaid}
                    />
                </div>
            </div>

            <div className="w-full max-w-md mt-16 flex justify-center">
                <button
                    onClick={onNext}
                    className="px-12 py-3 rounded-lg font-medium text-white transition-all bg-[#3D7475] hover:bg-[#2c5554] shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MoveInRecurringRentSettings;
