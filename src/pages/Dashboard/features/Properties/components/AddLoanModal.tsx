import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Lightbulb } from 'lucide-react';
import DatePicker from '../../../../../components/ui/DatePicker';
import { format } from 'date-fns';
import { cn } from '../../../../../lib/utils';
import CustomDropdown from '../../../components/CustomDropdown';

interface AddLoanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: {
        title: string;
        loanAmount: string;
        annualInterestRate: string;
        loanStartDate: string;
        loanPeriod: string;
        loanType: string;
        paymentsDue: string;
        currentLoanBalance: string;
        bankName: string;
        contactPerson: string;
        email: string;
        phone: string;
    }) => void;
}

const AddLoanModal: React.FC<AddLoanModalProps> = ({ isOpen, onClose, onAdd }) => {
    // Form State
    const [title, setTitle] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [annualInterestRate, setAnnualInterestRate] = useState('');
    const [loanStartDate, setLoanStartDate] = useState<Date>();
    const [loanPeriod, setLoanPeriod] = useState('');
    const [loanType, setLoanType] = useState('');
    const [paymentsDue, setPaymentsDue] = useState('');
    const [currentLoanBalance, setCurrentLoanBalance] = useState('');
    const [bankName, setBankName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Validation State
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleAdd = () => {
        const newErrors: { [key: string]: string } = {};

        if (!title.trim()) newErrors.title = 'Title is required';

        if (!loanAmount.trim()) {
            newErrors.loanAmount = 'Loan amount is required';
        } else if (isNaN(Number(loanAmount.replace(/[^0-9.-]+/g, '')))) {
            newErrors.loanAmount = 'Must be a number';
        }

        if (!annualInterestRate.trim()) {
            newErrors.annualInterestRate = 'Interest rate is required';
        } else if (isNaN(Number(annualInterestRate))) {
            newErrors.annualInterestRate = 'Must be a number';
        }

        if (!loanStartDate) newErrors.loanStartDate = 'Start date is required';

        if (!loanPeriod.trim()) {
            newErrors.loanPeriod = 'Period is required';
        } else if (isNaN(Number(loanPeriod))) {
            newErrors.loanPeriod = 'Must be a number';
        }

        if (currentLoanBalance.trim() && isNaN(Number(currentLoanBalance.replace(/[^0-9.-]+/g, '')))) {
            newErrors.currentLoanBalance = 'Must be a number';
        }

        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onAdd({
            title: title.trim(),
            loanAmount: loanAmount.trim(),
            annualInterestRate: annualInterestRate.trim(),
            loanStartDate: loanStartDate ? format(loanStartDate, 'dd MMM, yyyy') : '',
            loanPeriod: loanPeriod.trim(),
            loanType,
            paymentsDue,
            currentLoanBalance: currentLoanBalance.trim(),
            bankName: bankName.trim(),
            contactPerson: contactPerson.trim(),
            email: email.trim(),
            phone: phone.trim()
        });

        // Reset and close
        setTitle('');
        setLoanAmount('');
        setAnnualInterestRate('');
        setLoanStartDate(undefined);
        setLoanPeriod('');
        setLoanType('');
        setPaymentsDue('');
        setCurrentLoanBalance('');
        setBankName('');
        setContactPerson('');
        setEmail('');
        setPhone('');
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
                    <h2 className="text-white text-lg font-medium">Add loan</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    <div>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium">
                            You can add, store and track the property loan information.<br />
                            You can add up to 3 loan records.
                        </p>
                    </div>

                    <div className="font-bold text-[#1e293b] text-base pt-2">Property loan information</div>

                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) setErrors({ ...errors, title: '' });
                                }}
                                className={cn(inputClasses, errors.title && 'border-red-500 focus:ring-red-500/20')}
                                placeholder="Enter a title"
                            />
                            {errors.title && <p className="text-red-600 text-xs mt-1 ml-1">{errors.title}</p>}
                        </div>

                        {/* Loan Amount */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Loan amount <span className="text-red-500">*</span></label>
                            <input
                                type="text" // Using text to allow currency formatting if needed later or simple input
                                value={loanAmount}
                                onChange={(e) => {
                                    setLoanAmount(e.target.value);
                                    if (errors.loanAmount) setErrors({ ...errors, loanAmount: '' });
                                }}
                                className={cn(inputClasses, errors.loanAmount && 'border-red-500 focus:ring-red-500/20')}
                                placeholder="Enter a loan amount"
                            />
                            {errors.loanAmount && <p className="text-red-600 text-xs mt-1 ml-1">{errors.loanAmount}</p>}
                            <Hint text="Enter the total amount of money you are borrowing." />
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Annual interest % <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={annualInterestRate}
                                onChange={(e) => {
                                    setAnnualInterestRate(e.target.value);
                                    if (errors.annualInterestRate) setErrors({ ...errors, annualInterestRate: '' });
                                }}
                                className={cn(inputClasses, errors.annualInterestRate && 'border-red-500 focus:ring-red-500/20')}
                                placeholder="Enter an interest rate"
                            />
                            {errors.annualInterestRate && <p className="text-red-600 text-xs mt-1 ml-1">{errors.annualInterestRate}</p>}
                            <Hint text="The interest that you would pay, assuming that you make all of your regular payments." />
                        </div>

                        {/* Term/Start Date */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Loan start date <span className="text-red-500">*</span></label>
                            <DatePicker
                                value={loanStartDate}
                                onChange={(date) => {
                                    setLoanStartDate(date);
                                    if (errors.loanStartDate) setErrors({ ...errors, loanStartDate: '' });
                                }}
                                className={cn("w-full border-gray-200", errors.loanStartDate && "border-red-500")}
                                placeholder="Select the start date"
                            />
                            {errors.loanStartDate && <p className="text-red-600 text-xs mt-1 ml-1">{errors.loanStartDate}</p>}
                            <Hint text="Assumes that the first payment date is at the end of the first period." />
                        </div>

                        {/* Loan Period */}
                        <div>
                            <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Loan period in years <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={loanPeriod}
                                onChange={(e) => {
                                    setLoanPeriod(e.target.value);
                                    if (errors.loanPeriod) setErrors({ ...errors, loanPeriod: '' });
                                }}
                                className={cn(inputClasses, errors.loanPeriod && 'border-red-500 focus:ring-red-500/20')}
                                placeholder="Enter a loan period"
                            />
                            {errors.loanPeriod && <p className="text-red-600 text-xs mt-1 ml-1">{errors.loanPeriod}</p>}
                            <Hint text="Enter the length of the loan in years (i.e., 15 or 30 years)." />
                        </div>

                        {/* Dropdowns & Balance */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Loan type</label>
                                <CustomDropdown
                                    options={[
                                        { label: 'Private', value: 'Private' },
                                        { label: 'Bank', value: 'Bank' },
                                        { label: 'Other', value: 'Other' }
                                    ]}
                                    value={loanType}
                                    onChange={(value) => setLoanType(value as string)}
                                    placeholder="Loan type"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Payments due</label>
                                <CustomDropdown
                                    options={[
                                        { label: 'Monthly', value: 'Monthly' },
                                        { label: 'Quarterly', value: 'Quarterly' },
                                        { label: 'Yearly', value: 'Yearly' }
                                    ]}
                                    value={paymentsDue}
                                    onChange={(value) => setPaymentsDue(value as string)}
                                    placeholder="Payments due"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Current loan balance</label>
                                <input
                                    type="text"
                                    value={currentLoanBalance}
                                    onChange={(e) => {
                                        setCurrentLoanBalance(e.target.value);
                                        if (errors.currentLoanBalance) setErrors({ ...errors, currentLoanBalance: '' });
                                    }}
                                    className={cn(inputClasses, errors.currentLoanBalance && 'border-red-500 focus:ring-red-500/20')}
                                    placeholder="0.00"
                                />
                                {errors.currentLoanBalance && <p className="text-red-600 text-xs mt-1 ml-1">{errors.currentLoanBalance}</p>}
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Bank name</label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className={inputClasses}
                                    placeholder="Enter bank name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Contact person</label>
                                <input
                                    type="text"
                                    value={contactPerson}
                                    onChange={(e) => setContactPerson(e.target.value)}
                                    className={inputClasses}
                                    placeholder="Enter contact person"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                    className={cn(inputClasses, errors.email && 'border-red-500 focus:ring-red-500/20')}
                                    placeholder="Enter email"
                                />
                                {errors.email && <p className="text-red-600 text-xs mt-1 ml-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-bold mb-1 ml-1">Phone</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={inputClasses}
                                    placeholder="Enter phone number"
                                />
                            </div>
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

export default AddLoanModal;
