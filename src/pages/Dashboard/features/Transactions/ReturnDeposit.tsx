import React, { useState } from 'react';
import { ChevronLeft, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddTenantModal from './components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';

// Mock options mapping
const MOCK_DEPOSIT_OPTIONS: Record<string, { value: string, label: string }[]> = {
    '1': [ // Service Pro
        { value: 'refund', label: 'Service Refund' },
        { value: 'overpayment', label: 'Overpayment Return' },
    ],
    '2': [ // Tenant
        { value: 'security_interest', label: 'Deposit Interest (Balance $40)' },
        { value: 'security_deposit', label: 'Security Deposit (Balance $1000)' },
        { value: 'pet_deposit', label: 'Pet Deposit (Balance $200)' },
    ]
};

const ReturnDeposit: React.FC = () => {
    const navigate = useNavigate();
    const [payerPayee, setPayerPayee] = useState<string>('');
    const [depositCategory, setDepositCategory] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);

    // Get dynamic options based on selected payer/payee
    const depositOptions = payerPayee ? (MOCK_DEPOSIT_OPTIONS[payerPayee] || []) : [];

    const handlePayerChange = (value: string) => {
        setPayerPayee(value);
        setDepositCategory(''); // Reset second dropdown when first changes
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Transactions</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Return deposit</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        Return deposit
                    </button>
                </div>

                {/* Form Section */}
                <div className="bg-[#f0f0f6] rounded-[1.5rem] p-6 mb-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Payer / Payee */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Payer /Payee *</label>
                            <div className="relative">
                                <PayerPayeeDropdown
                                    value={payerPayee}
                                    onChange={handlePayerChange}
                                    options={[
                                        { id: '1', label: 'Service Pro', type: 'Service Pro' },
                                        { id: '2', label: 'Tenant', type: 'tenant' },
                                    ]}
                                    onAddTenant={() => setIsAddTenantModalOpen(true)}
                                    placeholder="Paye"
                                />
                            </div>
                        </div>
                        {/* Deposit Category */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Deposit Category *</label>
                            <div className="relative">
                                <CustomDropdown
                                    value={depositCategory}
                                    onChange={setDepositCategory}
                                    options={depositOptions}
                                    placeholder={payerPayee ? "Search here" : "Select Payer first"}
                                    searchable={true}
                                    disabled={!payerPayee}
                                    buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 pl-4">
                    {/* Table Header */}
                    <div className="text-white px-6 py-4 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 items-center text-sm font-medium">
                        <div>Payment</div>
                        <div>Payer</div>
                        <div>Method</div>
                        <div>Balance</div>
                        <div>Refund Amount</div>
                        <div></div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t min-h-[300px]">
                    <div className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="font-semibold text-gray-800 text-sm">INV-20251122-8492</div>
                        <div className="text-gray-800 text-sm font-semibold">08 Dec</div>
                        <div className="text-gray-800 text-sm font-semibold">ABC</div>
                        <div className="text-[#7BD747] text-sm font-bold">+69,0000</div>
                        <div className="text-gray-800 text-sm font-semibold">₹ 50,000</div>

                        <div className="flex items-center justify-end gap-3">
                            <button className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors">
                                <Edit className="w-5 h-5" />
                            </button>
                            <button className="text-red-500 hover:text-red-600 transition-colors">
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 mt-8">
                    <button className="bg-[#7BD747] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#6cc73d] hover:shadow-lg transition-all duration-200">
                        Pay Now
                    </button>
                    <button className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200">
                        Mark as paid
                    </button>
                </div>

                <AddTenantModal
                    isOpen={isAddTenantModalOpen}
                    onClose={() => setIsAddTenantModalOpen(false)}
                    onSave={(_data) => {
                        // TODO: Implement proper tenant creation logic
                        setIsAddTenantModalOpen(false);
                    }}
                />

            </div>
        </div>
    );
};

export default ReturnDeposit;
