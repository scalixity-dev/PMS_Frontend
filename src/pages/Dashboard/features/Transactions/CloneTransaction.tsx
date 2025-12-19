import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomDropdown from '../../components/CustomDropdown';
import DatePicker from '@/components/ui/DatePicker';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddTenantModal from '../Tenants/components/AddTenantModal';

import { useTransactionStore } from './store/transactionStore';

interface CloneTransactionState {
    transactionData?: any;
}

const CloneTransaction: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clonedTransactionData } = useTransactionStore();

    // Prefer store data, fallback to location state
    const transactionData = clonedTransactionData || (location.state as CloneTransactionState)?.transactionData;

    const [category, setCategory] = useState('');
    const [dueOn, setDueOn] = useState<Date | undefined>(undefined);
    const [amount, setAmount] = useState('');
    const [payer, setPayer] = useState('');
    const [lease, setLease] = useState('');
    const [tags, setTags] = useState('');
    const [details, setDetails] = useState('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);

    useEffect(() => {
        // Prefill data if available
        if (transactionData) {
            // Simplified prefilling for MVP
            setCategory(transactionData.category || 'General Income');
            if (transactionData.date) {
                setDueOn(new Date(transactionData.date));
            }
            setAmount(transactionData.amount ? transactionData.amount.replace(/[^0-9.]/g, '') : '');
            setPayer(transactionData.user || '');
        }
    }, [transactionData]);

    const inputClasses = "w-full rounded-md bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all shadow-sm";
    const labelClasses = "block text-xs font-bold text-gray-700 mb-2 ml-1";

    return (
        <div className="p-6 max-w-6xl mx-auto font-['Urbanist']">
            <div className="bg-[#E7ECEB] rounded-[2rem] p-8 shadow-sm min-h-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors mr-2"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Invoice clone</h1>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Category */}
                    <div>
                        <label className={labelClasses}>Category & subcategory*</label>
                        <input
                            type="text"
                            placeholder="Select Category"
                            className={inputClasses}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    {/* Due On */}
                    <div>
                        <label className={labelClasses}>Due on*</label>
                        <div className="relative">
                            <DatePicker
                                value={dueOn}
                                onChange={setDueOn}
                                placeholder="Select Date"
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {/* Payer / Payee */}
                    <div>
                        <label className={labelClasses}>Payer /Payee *</label>
                        <PayerPayeeDropdown
                            value={payer}
                            onChange={setPayer}
                            options={[
                                { id: '1', label: 'Nihal Puse', type: 'Service Pro' },
                                { id: '2', label: 'Ojshav Saxena', type: 'tenant' },
                            ]}
                            onAddTenant={() => setIsAddTenantModalOpen(true)}
                        />
                    </div>
                    <AddTenantModal
                        isOpen={isAddTenantModalOpen}
                        onClose={() => setIsAddTenantModalOpen(false)}
                        onSave={(data) => console.log('New Tenant Data:', data)}
                    />

                    {/* Lease */}
                    <div>
                        <label className={labelClasses}>Lease*</label>
                        <CustomDropdown
                            value={lease}
                            onChange={setLease}
                            options={[
                                { value: 'Lease #101', label: 'Lease #101' },
                            ]}
                            placeholder="Select Lease"
                            buttonClassName="!rounded-md"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className={labelClasses}>Amount*</label>
                        <input
                            type="text"
                            placeholder="Enter Amount"
                            className={inputClasses}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tags */}
                <div className="mb-8">
                    <label className={labelClasses}>Tags *</label>
                    <div className="w-1/2 pr-4"> {/* Constraining width closer to screenshot */}
                        <CustomDropdown
                            value={tags}
                            onChange={setTags}
                            options={[
                                { value: 'tags', label: 'Tags' },
                            ]}
                            placeholder="Select Tags"
                            buttonClassName="!rounded-md"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
                    <div className="bg-[#F3F4F6] rounded-2xl p-6">
                        <textarea
                            className="w-full h-32 bg-transparent text-sm text-gray-700 outline-none resize-none placeholder-gray-500"
                            placeholder="Write Some details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button className="bg-[#84CC16] text-white px-8 py-3 rounded-md font-semibold shadow-lg shadow-[#84CC16]/20 hover:bg-[#65a30d] transition-all duration-200">
                        Upload File
                    </button>
                    <button className="bg-[#3D7475] text-white px-10 py-3 rounded-md font-semibold shadow-lg shadow-[#3D7475]/20 hover:bg-[#2c5556] transition-all duration-200">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloneTransaction;
