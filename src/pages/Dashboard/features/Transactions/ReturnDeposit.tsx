import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Edit } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import { validateFile } from '../../../../utils/fileValidation';
import CustomDropdown from '../../components/CustomDropdown';
import { useGetAllTenants } from '../../../../hooks/useTenantQueries';
import { useGetAllApplications } from '../../../../hooks/useApplicationQueries';
import { serviceProviderService } from '../../../../services/service-provider.service';
import { useGetReturnableDeposits, useReturnDeposit } from '../../../../hooks/useTransactionQueries';
import Breadcrumb from '../../../../components/ui/Breadcrumb';

const ReturnDeposit: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const returnDepositMutation = useReturnDeposit();

    // Fetch data from backend
    const { data: tenants = [] } = useGetAllTenants();
    const { data: applications = [] } = useGetAllApplications();
    const { data: serviceProviders = [] } = useQuery({
        queryKey: ['service-providers'],
        queryFn: () => serviceProviderService.getAll(true),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });

    const [payerPayee, setPayerPayee] = useState<string>('');
    const [payerId, setPayerId] = useState<string>('');
    const [contactId, setContactId] = useState<string>('');
    const [depositCategory, setDepositCategory] = useState<string>('');
    const [selectedDepositId, setSelectedDepositId] = useState<string>('');
    const [refundAmount, setRefundAmount] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Transform payer/payee options for PayerPayeeDropdown
    const payerPayeeOptions = useMemo(() => {
        const options: Array<{ id: string; label: string; type: 'tenant' | 'Service Pro' | 'other' }> = [];

        // Add tenants
        tenants.forEach((tenant) => {
            if (tenant.userId) {
                const name = tenant.user?.fullName || tenant.user?.email || 'Unknown Tenant';
                options.push({
                    id: tenant.userId,
                    label: name,
                    type: 'tenant',
                });
            }
        });

        // Add applicants
        applications.forEach((app) => {
            app.applicants?.forEach((applicant) => {
                const name = `${applicant.firstName} ${applicant.lastName}`.trim() || applicant.email;
                options.push({
                    id: applicant.email, // Use email as ID for applicants
                    label: name,
                    type: 'other',
                });
            });
        });

        // Add service providers
        serviceProviders.forEach((sp) => {
            const nameParts = [sp.firstName, sp.middleName, sp.lastName].filter(Boolean);
            const name = nameParts.length > 0 ? nameParts.join(' ') : sp.email || 'Unknown Service Provider';
            options.push({
                id: sp.id,
                label: name,
                type: 'Service Pro',
            });
        });

        return options;
    }, [tenants, applications, serviceProviders]);

    // Find selected payer details
    const selectedPayerOption = useMemo(() => {
        return payerPayeeOptions.find(opt => opt.id === payerPayee);
    }, [payerPayeeOptions, payerPayee]);

    // Update payer IDs when payer changes
    useEffect(() => {
        if (selectedPayerOption) {
            if (selectedPayerOption.type === 'tenant' || selectedPayerOption.type === 'other') {
                setPayerId(selectedPayerOption.id);
                setContactId('');
            } else if (selectedPayerOption.type === 'Service Pro') {
                setContactId(selectedPayerOption.id);
                setPayerId('');
            }
        } else {
            setPayerId('');
            setContactId('');
        }
        setDepositCategory('');
        setSelectedDepositId('');
        setRefundAmount('');
    }, [selectedPayerOption]);

    // Fetch returnable deposits
    const { data: returnableDeposits = [], isLoading: isLoadingDeposits } = useGetReturnableDeposits(
        payerId || contactId
            ? {
                  payerId: payerId || undefined,
                  contactId: contactId || undefined,
                  category: depositCategory || undefined,
              }
            : undefined
    );

    // Generate deposit category options from fetched deposits
    const depositCategoryOptions = useMemo(() => {
        const categories = new Set<string>();
        returnableDeposits.forEach((deposit) => {
            if (deposit.category) {
                categories.add(deposit.category);
            }
        });
        return Array.from(categories)
            .sort()
            .map((cat) => ({
                value: cat,
                label: cat,
            }));
    }, [returnableDeposits]);

    // Filter deposits by selected category
    const filteredDeposits = useMemo(() => {
        if (!depositCategory) return returnableDeposits;
        return returnableDeposits.filter((deposit) => deposit.category === depositCategory);
    }, [returnableDeposits, depositCategory]);

    // Get selected deposit details
    const selectedDeposit = useMemo(() => {
        return filteredDeposits.find((d) => d.id === selectedDepositId);
    }, [filteredDeposits, selectedDepositId]);

    // Update refund amount when deposit is selected
    useEffect(() => {
        if (selectedDeposit) {
            setRefundAmount(selectedDeposit.balance.toString());
        } else {
            setRefundAmount('');
        }
    }, [selectedDeposit]);

    // Handle prefilled data
    useEffect(() => {
        if (location.state?.prefilledPayer) {
            const prefilledOption = payerPayeeOptions.find(
                opt => opt.id === location.state.prefilledPayer || opt.label === location.state.prefilledPayer
            );
            if (prefilledOption) {
                setPayerPayee(prefilledOption.id);
            }
        }
        if (location.state?.prefilledDepositCategory) {
            setDepositCategory(location.state.prefilledDepositCategory);
        }
    }, [location.state, payerPayeeOptions]);

    const handlePayerChange = (value: string) => {
        setPayerPayee(value);
        setDepositCategory('');
        setSelectedDepositId('');
        setRefundAmount('');
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

    const handleReturnDeposit = async () => {
        setError('');
        setSuccess('');

        if (!selectedDepositId) {
            setError('Please select a deposit to return');
            return;
        }

        if (!refundAmount || parseFloat(refundAmount) <= 0) {
            setError('Please enter a valid refund amount');
            return;
        }

        const deposit = selectedDeposit;
        if (!deposit) {
            setError('Selected deposit not found');
            return;
        }

        if (parseFloat(refundAmount) > deposit.balance) {
            setError(`Refund amount cannot exceed balance (${deposit.balance})`);
            return;
        }

        try {
            await returnDepositMutation.mutateAsync({
                returnData: {
                    transactionId: deposit.id,
                    refundAmount: parseFloat(refundAmount),
                    currency: deposit.currency as any,
                    paymentMethod: paymentMethod || undefined,
                    notes: notes || undefined,
                    refundDate: new Date().toISOString(),
                },
                file: selectedFile || undefined,
            });

            setSuccess('Deposit returned successfully');
            // Reset form
            setSelectedDepositId('');
            setRefundAmount('');
            setPaymentMethod('');
            setNotes('');
            setSelectedFile(null);
            // Navigate back after a short delay
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to return deposit');
        }
    };

    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Transactions', path: '/dashboard/accounting/transactions' },
                    { label: 'Return deposit' },
                ]}
                className="mb-6"
            />

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

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                        {success}
                    </div>
                )}

                {/* Form Section */}
                <div className="bg-[#f0f0f6] rounded-[1.5rem] p-6 mb-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Payer / Payee */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Payer / Payee *</label>
                            <div className="relative">
                                <PayerPayeeDropdown
                                    value={payerPayee}
                                    onChange={handlePayerChange}
                                    options={payerPayeeOptions}
                                    onAddTenant={() => setIsAddTenantModalOpen(true)}
                                    placeholder="Select payer/payee"
                                />
                            </div>
                        </div>
                        {/* Deposit Category */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Deposit Category</label>
                            <div className="relative">
                                <CustomDropdown
                                    value={depositCategory}
                                    onChange={setDepositCategory}
                                    options={depositCategoryOptions}
                                    placeholder={payerPayee ? "Select category (optional)" : "Select Payer first"}
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
                    {isLoadingDeposits ? (
                        <div className="text-center py-10 text-gray-500">Loading deposits...</div>
                    ) : !payerPayee ? (
                        <div className="text-center py-10 text-gray-500">Please select a payer/payee to view deposits</div>
                    ) : filteredDeposits.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No returnable deposits found</div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            {filteredDeposits.map((deposit) => (
                                <div
                                    key={deposit.id}
                                    onClick={() => {
                                        setSelectedDepositId(deposit.id);
                                    }}
                                    className={`hidden md:grid bg-white rounded-2xl px-6 py-4 grid-cols-[1.5fr_1fr_1fr_1fr_1fr_100px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                        selectedDepositId === deposit.id ? 'ring-2 ring-[#3A6D6C]' : ''
                                    }`}
                                >
                                    <div className="font-semibold text-gray-800 text-sm">{deposit.payment}</div>
                                    <div className="text-gray-800 text-sm font-semibold">{deposit.payer}</div>
                                    <div className="text-gray-800 text-sm font-semibold">{deposit.method || 'N/A'}</div>
                                    <div className="text-[#7BD747] text-sm font-bold">
                                        {formatCurrency(deposit.balance, deposit.currency)}
                                    </div>
                                    <div className="text-gray-800 text-sm font-semibold">
                                        <input
                                            type="number"
                                            value={selectedDepositId === deposit.id ? refundAmount : ''}
                                            onChange={(e) => {
                                                if (selectedDepositId === deposit.id) {
                                                    setRefundAmount(e.target.value);
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="0.00"
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            min="0"
                                            max={deposit.balance}
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedDepositId(deposit.id);
                                            }}
                                            className={`p-2 rounded-full transition-colors ${
                                                selectedDepositId === deposit.id
                                                    ? 'bg-[#3A6D6C] text-white'
                                                    : 'text-[#3A6D6C] hover:bg-gray-100'
                                            }`}
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Mobile Card View */}
                            {filteredDeposits.map((deposit) => (
                                <div
                                    key={deposit.id}
                                    onClick={() => setSelectedDepositId(deposit.id)}
                                    className={`md:hidden bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 ${
                                        selectedDepositId === deposit.id ? 'ring-2 ring-[#3A6D6C]' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 text-base">{deposit.payment}</span>
                                            <span className="text-gray-500 text-xs">{formatDate(deposit.date)}</span>
                                        </div>
                                        <span className="text-[#7BD747] font-bold text-sm bg-green-50 px-2 py-1 rounded-lg">
                                            Bal: {formatCurrency(deposit.balance, deposit.currency)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-3">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs">Payer</span>
                                            <span className="text-gray-800 font-medium">{deposit.payer}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-gray-500 text-xs">Method</span>
                                            <span className="text-gray-800 font-medium">{deposit.method || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {selectedDepositId === deposit.id && (
                                        <div className="border-t border-gray-100 pt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-2">Refund Amount</label>
                                            <input
                                                type="number"
                                                value={refundAmount}
                                                onChange={(e) => setRefundAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                min="0"
                                                max={deposit.balance}
                                                step="0.01"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Refund Details Section (shown when deposit is selected) */}
                {selectedDeposit && (
                    <div className="bg-[#f0f0f6] rounded-[1.5rem] p-6 mb-8 shadow-sm mt-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Refund Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Payment Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3A6D6C] focus:border-transparent"
                                >
                                    <option value="">Select method</option>
                                    <option value="CASH">Cash</option>
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                    <option value="CHEQUE">Cheque</option>
                                    <option value="UPI">UPI</option>
                                    <option value="CARD">Card</option>
                                    <option value="OTHERS">Others</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Notes (Optional)</label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add notes..."
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3A6D6C] focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                )}

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
                        onClick={handleReturnDeposit}
                        disabled={!selectedDepositId || returnDepositMutation.isPending}
                        className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {returnDepositMutation.isPending ? 'Processing...' : 'Return Deposit'}
                    </button>
                </div>

                <AddTenantModal
                    isOpen={isAddTenantModalOpen}
                    onClose={() => setIsAddTenantModalOpen(false)}
                    onSave={(_data) => {
                        setIsAddTenantModalOpen(false);
                    }}
                />
            </div>
        </div>
    );
};

export default ReturnDeposit;
