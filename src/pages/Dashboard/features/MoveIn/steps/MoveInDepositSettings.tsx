import React, { useState, useEffect } from 'react';
import DatePicker from '../../../../../components/ui/DatePicker';
import SearchableDropdown from '../../../../../components/ui/SearchableDropdown';
import { useMoveInStore } from '../store/moveInStore';

// Options from screenshot
const DEPOSIT_CATEGORIES = [
    'Deposit',
    'Cleaning Deposit',
    'Deposit Interest',
    'Gym & Facility',
    'Holding',
    'Key',
    'Last Month\'s Rent',
    'Other liability',
    'Owner Deposit',
    'Pet deposit',
    'Pre-paid Deposit',
    'Prepaid rent',
    'Security Deposit'
];

interface MoveInDepositSettingsProps {
    onNext: () => void;
    onBack: () => void;
}

const MoveInDepositSettings: React.FC<MoveInDepositSettingsProps> = ({ onNext }) => {
    const { formData, setDeposit } = useMoveInStore();
    
    // Initialize local state from store
    const [selectedCategory, setSelectedCategory] = useState(formData.deposit.category || 'Deposit');
    const [amount, setAmount] = useState(formData.deposit.amount || '');
    const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(formData.deposit.invoiceDate);

    // Update store when local state changes
    useEffect(() => {
        setDeposit({
            category: selectedCategory,
            amount,
            invoiceDate,
        });
    }, [selectedCategory, amount, invoiceDate, setDeposit]);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">Deposit information</h2>
                <p className="text-[#6B7280]">Enable the deposit for the lease.</p>
            </div>

            <div className="w-full max-w-2xl bg-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    {/* Category & Subcategory * */}
                    <SearchableDropdown
                        label="Category & Subcategory *"
                        value={selectedCategory}
                        options={DEPOSIT_CATEGORIES}
                        onChange={setSelectedCategory}
                    />

                    {/* Amount * */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Amount *</label>
                        <div className="relative">
                            <div className="w-full flex items-center bg-[#7BD747] text-white px-4 py-3 rounded-xl font-medium shadow-sm">
                                <span className="mr-1 text-white">$</span>
                                <input
                                    type="number"
                                    placeholder="00.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="bg-transparent text-white placeholder-white/70 outline-none w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Invoice Date * */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Invoice Date *</label>
                        <div className="relative">
                            <DatePicker
                                value={invoiceDate}
                                onChange={setInvoiceDate}
                                placeholder="dd/mm/yy"
                                className="bg-[#7BD747] text-white border-none rounded-xl hover:bg-[#7BD747]/90 placeholder:text-white"
                                popoverClassName="z-50"
                                iconClassName="text-white"
                                placeholderClassName="text-white"
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="w-full max-w-md mt-16 flex justify-center">
                <button
                    onClick={() => {
                        setDeposit({
                            category: selectedCategory,
                            amount,
                            invoiceDate,
                        });
                        onNext();
                    }}
                    className="px-12 py-3 rounded-lg font-medium text-white transition-all bg-[#3D7475] hover:bg-[#2c5554] shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MoveInDepositSettings;
