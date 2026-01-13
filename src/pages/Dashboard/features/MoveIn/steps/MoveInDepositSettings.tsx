import React, { useState, useEffect } from 'react';
import DatePicker from '../../../../../components/ui/DatePicker';
import SearchableDropdown from '../../../../../components/ui/SearchableDropdown';
import { useMoveInStore } from '../store/moveInStore';
import { useCreateLease } from '../../../../../hooks/useLeaseQueries';
import { Loader2 } from 'lucide-react';

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
    const createLeaseMutation = useCreateLease();
    
    // Initialize local state from store
    const [selectedCategory, setSelectedCategory] = useState(formData.deposit.category || 'Deposit');
    const [amount, setAmount] = useState(formData.deposit.amount || '');
    const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(formData.deposit.invoiceDate);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Update store when local state changes
    useEffect(() => {
        setDeposit({
            category: selectedCategory,
            amount,
            invoiceDate,
        });
    }, [selectedCategory, amount, invoiceDate, setDeposit]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!selectedCategory) {
            newErrors.category = 'Category is required';
        }
        if (!amount || parseFloat(amount) <= 0) {
            newErrors.amount = 'Amount is required and must be greater than zero';
        }
        if (!invoiceDate) {
            newErrors.invoiceDate = 'Invoice date is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validateForm()) {
            return;
        }

        // Update store with final values
        setDeposit({
            category: selectedCategory,
            amount,
            invoiceDate,
        });

        // Proceed to next step
        onNext();
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">Deposit information</h2>
                <p className="text-[#6B7280]">Enable the deposit for the lease.</p>
            </div>

            <div className="w-full max-w-2xl bg-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    {/* Category & Subcategory * */}
                    <div className="flex flex-col gap-2">
                        <SearchableDropdown
                            label="Category & Subcategory *"
                            value={selectedCategory}
                            options={DEPOSIT_CATEGORIES}
                            onChange={(value) => {
                                setSelectedCategory(value);
                                if (errors.category) {
                                    setErrors(prev => {
                                        const next = { ...prev };
                                        delete next.category;
                                        return next;
                                    });
                                }
                            }}
                        />
                        {errors.category && (
                            <span className="text-red-500 text-xs ml-2">{errors.category}</span>
                        )}
                    </div>

                    {/* Amount * */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Amount *</label>
                        <div className="relative">
                            <div className={`w-full flex items-center bg-[#7BD747] text-white px-4 py-3 rounded-xl font-medium shadow-sm ${errors.amount ? 'ring-2 ring-red-500' : ''}`}>
                                <span className="mr-1 text-white">$</span>
                                <input
                                    type="number"
                                    placeholder="00.00"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        if (errors.amount) {
                                            setErrors(prev => {
                                                const next = { ...prev };
                                                delete next.amount;
                                                return next;
                                            });
                                        }
                                    }}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="bg-transparent text-white placeholder-white/70 outline-none w-full"
                                />
                            </div>
                        </div>
                        {errors.amount && (
                            <span className="text-red-500 text-xs ml-2">{errors.amount}</span>
                        )}
                    </div>

                    {/* Invoice Date * */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Invoice Date *</label>
                        <div className="relative">
                            <DatePicker
                                value={invoiceDate}
                                onChange={(date) => {
                                    setInvoiceDate(date);
                                    if (errors.invoiceDate) {
                                        setErrors(prev => {
                                            const next = { ...prev };
                                            delete next.invoiceDate;
                                            return next;
                                        });
                                    }
                                }}
                                placeholder="dd/mm/yy"
                                className={`bg-[#7BD747] text-white border-none rounded-xl hover:bg-[#7BD747]/90 placeholder:text-white ${errors.invoiceDate ? 'ring-2 ring-red-500' : ''}`}
                                popoverClassName="z-50"
                                iconClassName="text-white"
                                placeholderClassName="text-white"
                            />
                        </div>
                        {errors.invoiceDate && (
                            <span className="text-red-500 text-xs ml-2">{errors.invoiceDate}</span>
                        )}
                    </div>

                </div>
            </div>

            <div className="w-full max-w-md mt-16 flex flex-col items-center gap-4">
                {Object.keys(errors).length > 0 && (
                    <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm font-medium mb-2">Please fix the following errors:</p>
                        <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                            {Object.values(errors).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {createLeaseMutation.isError && (
                    <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">
                            {createLeaseMutation.error instanceof Error 
                                ? createLeaseMutation.error.message 
                                : 'An error occurred while saving'}
                        </p>
                    </div>
                )}

                <button
                    onClick={handleNext}
                    disabled={createLeaseMutation.isPending}
                    className="px-12 py-3 rounded-lg font-medium text-white transition-all bg-[#3D7475] hover:bg-[#2c5554] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                    {createLeaseMutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Next'
                    )}
                </button>
            </div>
        </div>
    );
};

export default MoveInDepositSettings;
