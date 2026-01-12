import React, { useState } from 'react';
import { ChevronLeft, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import { validateFile } from '../../../../utils/fileValidation';
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const location = useLocation();

    // Handle prefilled data
    React.useEffect(() => {
        if (location.state?.prefilledPayer) {
            setPayerPayee('2'); // defaulting to Tenant
        }
        if (location.state?.prefilledDepositCategory) {
            setDepositCategory('security_deposit'); // defaulting to Security Deposit
        }
    }, [location.state]);

    // Get dynamic options based on selected payer/payee
    const depositOptions = payerPayee ? (MOCK_DEPOSIT_OPTIONS[payerPayee] || []) : [];

    const handlePayerChange = (value: string) => {
        setPayerPayee(value);
        setDepositCategory(''); // Reset second dropdown when first changes
    };

    const handleFileClick = () => {
        setUploadError('');
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateFile(file);
        if (!validation.isValid) {
            setUploadError(validation.error || 'Invalid file');
            return;
        }

        setSelectedFile(file);
        setUploadError('');
    };

    const handleAction = (action: 'pay_now' | 'mark_paid') => {
        console.log({
            action,
            payerPayee,
            depositCategory,
            file: selectedFile
        });
        // TODO: Implement API call
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
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 pl-4 hidden md:block">
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
                    {/* Desktop View */}
                    <div className="hidden md:grid bg-white rounded-2xl px-6 py-4 grid-cols-[1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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

                    {/* Mobile Card View */}
                    <div className="md:hidden bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-800 text-base">INV-20251122-8492</span>
                                <span className="text-gray-500 text-xs">08 Dec</span>
                            </div>
                            <span className="text-[#7BD747] font-bold text-sm bg-green-50 px-2 py-1 rounded-lg">
                                Bal: +69,0000
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-3">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs">Payer</span>
                                <span className="text-gray-800 font-medium">ABC</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-gray-500 text-xs">Refund Amount</span>
                                <span className="text-gray-800 font-bold text-lg">₹ 50,000</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                            <button className="p-2 text-[#3A6D6C] bg-gray-50 rounded-full hover:bg-gray-100">
                                <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 bg-gray-50 rounded-full hover:bg-gray-100">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* File Upload Error/Success Message */}
                {uploadError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                        {uploadError}
                    </div>
                )}
                {selectedFile && !uploadError && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                        File selected: {selectedFile.name}
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={handleFileClick}
                        className="bg-[#20CC95] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#1bb584] hover:shadow-lg transition-all duration-200"
                    >
                        Upload File
                    </button>
                    <button
                        onClick={() => handleAction('pay_now')}
                        className="bg-[#7BD747] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#6cc73d] hover:shadow-lg transition-all duration-200"
                    >
                        Pay Now
                    </button>
                    <button
                        onClick={() => handleAction('mark_paid')}
                        className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200"
                    >
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
