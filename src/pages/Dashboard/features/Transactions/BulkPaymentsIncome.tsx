import React, { useState } from 'react';
import { ChevronLeft, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import TransactionToggle from './components/TransactionToggle';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import CustomDropdown from '../../components/CustomDropdown';

// Mock Data
const MOCK_PROPERTIES: Record<string, { value: string, label: string }[]> = {
    '1': [ // Service Pro
        { value: 'prop_1', label: 'Downtown Apartments' },
        { value: 'prop_2', label: 'Sunset Villa' },
    ],
    '2': [ // Tenant
        { value: 'prop_3', label: 'Greenwood Estate' },
    ]
};

const MOCK_INVOICES: Record<string, any[]> = {
    'prop_1': [
        { id: 'INV-20251122-8492', dueOn: '08 Dec', category: 'Rent', balance: '+69,0000', amount: '₹ 50,000' },
        { id: 'INV-20251123-9999', dueOn: '10 Dec', category: 'Deposit', balance: '+12,0000', amount: '₹ 10,000' }
    ],
    'prop_2': [
        { id: 'INV-20251201-1111', dueOn: '15 Dec', category: 'Laundry', balance: '+5,000', amount: '₹ 5,000' }
    ],
    'prop_3': [
        { id: 'INV-20250101-2222', dueOn: '01 Jan', category: 'Rent', balance: '+25,000', amount: '₹ 25,000' }
    ]
};

const BulkPaymentsIncome: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'Invoice' | 'General Invoices'>('Invoice');
    const [payerPayee, setPayerPayee] = useState<string>('');
    const [property, setProperty] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);

    // Dynamic Options and Data
    const propertyOptions = payerPayee ? (MOCK_PROPERTIES[payerPayee] || []) : [];
    const tableData = property ? (MOCK_INVOICES[property] || []) : [];

    const handlePayerChange = (value: string) => {
        setPayerPayee(value);
        setProperty(''); // Reset property when payer changes
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Transactions</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Bulk payments income</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        Bulk payments income
                    </button>
                    <button className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[#2c5251] transition-colors">
                        Action
                    </button>
                </div>

                {/* Toggle Switch */}
                <TransactionToggle
                    value={activeTab}
                    onChange={(val) => setActiveTab(val as 'Invoice' | 'General Invoices')}
                    options={[
                        { label: 'Invoice', value: 'Invoice' },
                        { label: 'General Invoices', value: 'General Invoices' }
                    ]}
                />

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
                        {/* Property (Visible/Enabled only if Payer selected) */}
                        <div className={`col-span-1 transition-opacity duration-300 ${payerPayee ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Property *</label>
                            <div className="relative">
                                <CustomDropdown
                                    value={property}
                                    onChange={setProperty}
                                    options={propertyOptions}
                                    placeholder="Select Property"
                                    searchable={true}
                                    disabled={!payerPayee}
                                    buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20 w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 pl-4">
                    {/* Table Header */}
                    <div className="text-white px-6 py-4 grid grid-cols-5 gap-4 items-center text-sm font-medium">
                        <div>Invoice ID</div>
                        <div>Due on</div>
                        <div>Category</div>
                        <div>Balance</div>
                        <div>Payment amount</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t min-h-[300px]">
                    {tableData.length > 0 ? (
                        tableData.map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl px-6 py-4 grid grid-cols-5 gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="font-semibold text-gray-800 text-sm">{item.id}</div>
                                <div className="text-gray-800 text-sm font-semibold">{item.dueOn}</div>
                                <div className="text-gray-800 text-sm font-semibold">{item.category}</div>
                                <div className="text-[#7BD747] text-sm font-bold">{item.balance}</div>
                                <div className="text-gray-800 text-sm font-semibold flex items-center justify-between">
                                    {item.amount}
                                    <div className="flex items-center gap-3">
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
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm mt-10">
                            {!payerPayee ? "Select Payer / Payee to continue." : "Select Property to view invoices."}
                        </div>
                    )}
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

export default BulkPaymentsIncome;
