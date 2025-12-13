import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';

// Mock Data
const MOCK_LEASES: Record<string, { value: string, label: string }[]> = {
    '1': [ // Service Pro
        { value: 'lease_1', label: 'Unit 101 - 12 Month Term' },
    ],
    '2': [ // Tenant
        { value: 'lease_a', label: 'Unit 202 - Residential Lease' },
        { value: 'lease_b', label: 'Unit 305 - Commercial Lease' },
    ]
};

const MOCK_INVOICES: Record<string, any[]> = {
    '1': [
        { id: 'INV-20251122-8492', dueDate: '08 Dec', applyTo: 'ABC', subCategory: 'ABC', applyFrom: 'ABC', dueOn: '+69,0000', amountOwed: '+69,0000' }
    ],
    '2': [
        { id: 'INV-20251210-5555', dueDate: '15 Jan', applyTo: 'XYZ', subCategory: 'Rent', applyFrom: 'Deposit', dueOn: '+1200', amountOwed: '+1200' },
        { id: 'INV-20250101-1234', dueDate: '01 Feb', applyTo: 'LMN', subCategory: 'Utility', applyFrom: 'Credit', dueOn: '+150', amountOwed: '+150' }
    ]
};

const ApplyDepositAndCredit: React.FC = () => {
    const navigate = useNavigate();
    const [payerPayee, setPayerPayee] = useState<string>('');
    const [lease, setLease] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);

    // Dynamic Options and Data
    const leaseOptions = payerPayee ? (MOCK_LEASES[payerPayee] || []) : [];
    const tableData = payerPayee ? (MOCK_INVOICES[payerPayee] || []) : [];

    const handlePayerChange = (value: string) => {
        setPayerPayee(value);
        setLease(''); // Reset lease when payer changes
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Transactions</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Money transfer</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        Apply deposit & credits
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
                        {/* Lease */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Lease *</label>
                            <div className="relative">
                                <CustomDropdown
                                    value={lease}
                                    onChange={setLease}
                                    options={leaseOptions}
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
                    <div className="text-white px-6 py-4 grid grid-cols-7 gap-4 items-center text-sm font-medium">
                        <div>Invoice</div>
                        <div>Due date</div>
                        <div>Apply to</div>
                        <div>Sub-category</div>
                        <div>Apply from</div>
                        <div className="text-right">Due on</div>
                        <div className="text-right">Amount owed</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t min-h-[300px]">
                    {tableData.length > 0 ? (
                        tableData.map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl px-6 py-4 grid grid-cols-7 gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="font-semibold text-gray-800 text-sm">{item.id}</div>
                                <div className="text-gray-800 text-sm font-semibold">{item.dueDate}</div>
                                <div className="text-gray-800 text-sm font-semibold">{item.applyTo}</div>
                                <div className="text-gray-800 text-sm font-semibold">{item.subCategory}</div>
                                <div className="text-gray-800 text-sm font-semibold">{item.applyFrom}</div>
                                <div className="text-[#7BD747] text-sm font-bold text-right">{item.dueOn}</div>
                                <div className="text-[#7BD747] text-sm font-bold text-right">{item.amountOwed}</div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm mt-10">
                            {payerPayee ? "No invoices found for this payer." : "Select a Payer to view invoices."}
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="mt-8">
                    <button className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200">
                        Record as Applied
                    </button>
                </div>

                <AddTenantModal
                    isOpen={isAddTenantModalOpen}
                    onClose={() => setIsAddTenantModalOpen(false)}
                    onSave={(data) => console.log('New Tenant Data:', data)}
                />

            </div>
        </div>
    );
};

export default ApplyDepositAndCredit;
