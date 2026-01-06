import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import DatePicker from '../../../../../components/ui/DatePicker';
import { format } from 'date-fns';
import { cn } from '../../../../../lib/utils';

interface AddInsuranceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: {
        companyName: string;
        companyWebsite: string;
        agentName: string;
        agentEmail: string;
        agentPhone: string;
        policyNumber: string;
        price: string;
        effectiveDate: string;
        expirationDate: string;
        details: string;
        emailNotification: boolean;
    }) => void;
}

const AddInsuranceModal: React.FC<AddInsuranceModalProps> = ({ isOpen, onClose, onAdd }) => {
    // Form State
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [agentName, setAgentName] = useState('');
    const [agentEmail, setAgentEmail] = useState('');
    const [agentPhone, setAgentPhone] = useState('');
    const [policyNumber, setPolicyNumber] = useState('');
    const [price, setPrice] = useState('');
    const [effectiveDate, setEffectiveDate] = useState<Date>();
    const [expirationDate, setExpirationDate] = useState<Date>();
    const [details, setDetails] = useState('');
    const [emailNotification, setEmailNotification] = useState(false);

    // Validation State
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleAdd = () => {
        const newErrors: { [key: string]: string } = {};

        if (!companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!companyWebsite.trim()) newErrors.companyWebsite = 'Company website is required';
        if (agentEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agentEmail)) {
            newErrors.agentEmail = 'Invalid email format';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onAdd({
            companyName: companyName.trim(),
            companyWebsite: companyWebsite.trim(),
            agentName: agentName.trim(),
            agentEmail: agentEmail.trim(),
            agentPhone: agentPhone.trim(),
            policyNumber: policyNumber.trim(),
            price: price.trim(),
            effectiveDate: effectiveDate ? format(effectiveDate, 'dd MMM, yyyy') : '',
            expirationDate: expirationDate ? format(expirationDate, 'dd MMM, yyyy') : '',
            details: details.trim(),
            emailNotification
        });

        // Reset and close
        setCompanyName('');
        setCompanyWebsite('');
        setAgentName('');
        setAgentEmail('');
        setAgentPhone('');
        setPolicyNumber('');
        setPrice('');
        setEffectiveDate(undefined);
        setExpirationDate(undefined);
        setDetails('');
        setEmailNotification(false);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white";

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">Add insurance</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    <div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            You can add, store and track the expiration of homeowners insurance, flood insurance and earthquake insurance. You can add up to 10 insurance records.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="font-bold text-[#2c3e50]">New Insurance</div>

                        {/* Company Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Company name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                            if (errors.companyName) setErrors({ ...errors, companyName: '' });
                                        }}
                                        className={cn(inputClasses, errors.companyName && 'border-red-500 focus:ring-red-500/20')}
                                        placeholder="Company name"
                                    />
                                </div>
                                {errors.companyName && <p className="text-red-600 text-xs mt-1 ml-1">{errors.companyName}</p>}
                            </div>

                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Company website <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={companyWebsite}
                                        onChange={(e) => {
                                            setCompanyWebsite(e.target.value);
                                            if (errors.companyWebsite) setErrors({ ...errors, companyWebsite: '' });
                                        }}
                                        className={cn(inputClasses, errors.companyWebsite && 'border-red-500 focus:ring-red-500/20')}
                                        placeholder="Company website"
                                    />
                                </div>
                                {errors.companyWebsite && <p className="text-red-600 text-xs mt-1 ml-1">{errors.companyWebsite}</p>}
                            </div>
                        </div>

                        {/* Agent Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Agent name</label>
                                <input
                                    type="text"
                                    value={agentName}
                                    onChange={(e) => setAgentName(e.target.value)}
                                    className={inputClasses}
                                    placeholder="Agent name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Agent email</label>
                                <input
                                    type="email"
                                    value={agentEmail}
                                    onChange={(e) => {
                                        setAgentEmail(e.target.value);
                                        if (errors.agentEmail) setErrors({ ...errors, agentEmail: '' });
                                    }}
                                    className={cn(inputClasses, errors.agentEmail && 'border-red-500 focus:ring-red-500/20')}
                                    placeholder="Agent email"
                                />
                                {errors.agentEmail && <p className="text-red-600 text-xs mt-1 ml-1">{errors.agentEmail}</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Agent phone</label>
                                <input
                                    type="tel"
                                    value={agentPhone}
                                    onChange={(e) => setAgentPhone(e.target.value)}
                                    className={inputClasses}
                                    placeholder="Agent phone"
                                />
                            </div>
                        </div>

                        {/* Policy & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Policy #</label>
                                <input
                                    type="text"
                                    value={policyNumber}
                                    onChange={(e) => setPolicyNumber(e.target.value)}
                                    className={inputClasses}
                                    placeholder="Policy #"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Price</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className={inputClasses}
                                        placeholder="Price"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Effective date</label>
                                <DatePicker
                                    value={effectiveDate}
                                    onChange={setEffectiveDate}
                                    className="w-full border-gray-200"
                                    placeholder="Select date"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Expiration date</label>
                                <DatePicker
                                    value={expirationDate}
                                    onChange={setExpirationDate}
                                    className="w-full border-gray-200"
                                    placeholder="Select date"
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Details</label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className={`${inputClasses} h-24 resize-none`}
                                placeholder="Details"
                                maxLength={500}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                Character limit: {details.length} / 500
                            </div>
                        </div>

                        {/* Toggle */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={() => setEmailNotification(!emailNotification)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${emailNotification ? 'bg-[#5F8B8A]' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${emailNotification ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                            <span className="text-[#2c3e50] font-medium">Email notification due to expiration</span>
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

export default AddInsuranceModal;
