import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Lightbulb, UploadCloud } from 'lucide-react';
import DatePicker from '../../../../../components/ui/DatePicker';
import { format } from 'date-fns';
import { cn } from '../../../../../lib/utils';
import CustomDropdown from '../../../components/CustomDropdown';

interface AddPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: {
        purchasePrice: string;
        startDate: string;
        downPayment: string;
        depreciableYears: string;
        annualDepreciation: string;
        landValue: string;
        details: string;
    }) => void;
}

const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({ isOpen, onClose, onAdd }) => {
    // Form State
    const [purchasePrice, setPurchasePrice] = useState('');
    const [startDate, setStartDate] = useState<Date>();
    const [downPayment, setDownPayment] = useState('');
    const [depreciableYears, setDepreciableYears] = useState('');
    const [annualDepreciation, setAnnualDepreciation] = useState('');
    const [landValue, setLandValue] = useState('');
    const [details, setDetails] = useState('');

    // Validation State
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleAdd = () => {
        const newErrors: { [key: string]: string } = {};

        if (!purchasePrice.trim()) {
            newErrors.purchasePrice = 'Purchase price is required';
        } else if (isNaN(Number(purchasePrice.replace(/[^0-9.-]+/g, '')))) {
            newErrors.purchasePrice = 'Must be a number';
        }

        if (!startDate) newErrors.startDate = 'Start date is required';

        if (!depreciableYears) newErrors.depreciableYears = 'Depreciable years is required';

        if (downPayment.trim() && isNaN(Number(downPayment.replace(/[^0-9.-]+/g, '')))) {
            newErrors.downPayment = 'Must be a number';
        }

        if (annualDepreciation.trim() && isNaN(Number(annualDepreciation.replace(/[^0-9.-]+/g, '')))) {
            newErrors.annualDepreciation = 'Must be a number';
        }

        if (landValue.trim() && isNaN(Number(landValue.replace(/[^0-9.-]+/g, '')))) {
            newErrors.landValue = 'Must be a number';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onAdd({
            purchasePrice: purchasePrice.trim(),
            startDate: startDate ? format(startDate, 'dd MMM, yyyy') : '',
            downPayment: downPayment.trim(),
            depreciableYears,
            annualDepreciation: annualDepreciation.trim(),
            landValue: landValue.trim(),
            details: details.trim(),
        });

        // Reset and close
        setPurchasePrice('');
        setStartDate(undefined);
        setDownPayment('');
        setDepreciableYears('');
        setAnnualDepreciation('');
        setLandValue('');
        setDetails('');
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white";

    // Hint Component for the "subtle" look
    const Hint = ({ text }: { text: string }) => (
        <div className="flex items-start gap-3 mt-1 mb-4">
            <div className="flex flex-col items-center gap-1 mt-1">
                <div className="bg-[#EAB308] rounded-full p-0.5 shadow-sm">
                    <Lightbulb size={12} className="text-white fill-current" />
                </div>
            </div>
            <div className="flex-1 pt-0.5">
                <div className="h-px bg-[#EAB308]/50 w-full mb-1"></div>
                <p className="text-[#334155] font-semibold text-xs leading-relaxed">{text}</p>
            </div>
        </div>
    );

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">Add purchase</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    <div className="font-bold text-[#1e293b] text-base pt-2">Property purchase information</div>

                    <div className="space-y-4">
                        {/* Purchase Price */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Purchase price <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={purchasePrice}
                                onChange={(e) => {
                                    setPurchasePrice(e.target.value);
                                    if (errors.purchasePrice) setErrors({ ...errors, purchasePrice: '' });
                                }}
                                className={cn(inputClasses, errors.purchasePrice && 'border-red-500 focus:ring-red-500/20')}
                                placeholder="Enter purchase price"
                            />
                            {errors.purchasePrice && <p className="text-red-600 text-xs mt-1 ml-1">{errors.purchasePrice}</p>}
                            <Hint text="Enter the original price of the asset. The amount you paid for the property or asset." />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Start date <span className="text-red-500">*</span></label>
                            <DatePicker
                                value={startDate}
                                onChange={(date) => {
                                    setStartDate(date);
                                    if (errors.startDate) setErrors({ ...errors, startDate: '' });
                                }}
                                className={cn("w-full border-gray-200", errors.startDate && "border-red-500")}
                                placeholder="Select start date"
                            />
                            {errors.startDate && <p className="text-red-600 text-xs mt-1 ml-1">{errors.startDate}</p>}
                            <Hint text="Select the date the asset started being used for its intended purpose. In most cases, this is the purchase date." />
                        </div>

                        {/* Down Payment */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Down payment</label>
                            <input
                                type="text"
                                value={downPayment}
                                onChange={(e) => {
                                    setDownPayment(e.target.value);
                                    if (errors.downPayment) setErrors({ ...errors, downPayment: '' });
                                }}
                                className={cn(inputClasses, errors.downPayment && 'border-red-500 focus:ring-red-500/20')}
                                placeholder="Enter down payment"
                            />
                            {errors.downPayment && <p className="text-red-600 text-xs mt-1 ml-1">{errors.downPayment}</p>}
                        </div>

                        {/* Depreciable Years */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Depreciable years <span className="text-red-500">*</span></label>
                            <CustomDropdown
                                options={[
                                    { label: '27.5 Years', value: '27.5' },
                                    { label: '39 Years', value: '39' },
                                    { label: 'Other', value: 'Other' }
                                ]}
                                value={depreciableYears}
                                onChange={(value) => {
                                    setDepreciableYears(value as string);
                                    if (errors.depreciableYears) setErrors({ ...errors, depreciableYears: '' });
                                }}
                                placeholder="Select depreciable years"
                                className="w-full"
                                error={errors.depreciableYears}
                            />
                            {typeof errors.depreciableYears === 'string' && <p className="text-red-600 text-xs mt-1 ml-1">{errors.depreciableYears}</p>}
                            <Hint text="This is the number of years, during which the cost basis of an item of property is recovered. In the US it's 27.5 years." />
                        </div>

                        {/* Annual Depreciation */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Annual depreciation</label>
                            <input
                                type="text"
                                value={annualDepreciation}
                                onChange={(e) => {
                                    setAnnualDepreciation(e.target.value);
                                    if (errors.annualDepreciation) setErrors({ ...errors, annualDepreciation: '' });
                                }}
                                className={cn(inputClasses, errors.annualDepreciation && 'border-red-500 focus:ring-red-500/20')}
                                placeholder="Enter annual depreciation"
                            />
                            {errors.annualDepreciation && <p className="text-red-600 text-xs mt-1 ml-1">{errors.annualDepreciation}</p>}
                        </div>

                        {/* Land Value */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Land value</label>
                            <input
                                type="text"
                                value={landValue}
                                onChange={(e) => {
                                    setLandValue(e.target.value);
                                    if (errors.landValue) setErrors({ ...errors, landValue: '' });
                                }}
                                className={cn(inputClasses, errors.landValue && 'border-red-500 focus:ring-red-500/20')}
                                placeholder="Enter land value"
                            />
                            {errors.landValue && <p className="text-red-600 text-xs mt-1 ml-1">{errors.landValue}</p>}
                        </div>

                        {/* Details */}
                        <div className="relative">
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Details</label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value.slice(0, 500))}
                                className={cn(inputClasses, "min-h-[100px] resize-none")}
                                placeholder="Enter details"
                            />
                            <div className="absolute bottom-2 right-2 text-[10px] text-gray-400 font-medium">
                                Character limit: {details.length} / 500
                            </div>
                        </div>

                        {/* Upload */}
                        <div>
                            <button className="flex items-center gap-2 text-[#4CAF50] font-bold text-sm hover:underline">
                                <UploadCloud size={20} />
                                Upload
                            </button>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 shrink-0">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddPurchaseModal;
