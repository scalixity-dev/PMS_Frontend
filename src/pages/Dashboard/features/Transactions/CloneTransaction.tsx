import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from '@/components/ui/DatePicker';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import { useCreateTenant } from '@/hooks/useTenantQueries';
import { useTransactionStore } from './store/transactionStore';
import type { TransactionData } from './store/transactionStore';
import { useCreateIncomeInvoice, useCreateExpenseInvoice, useCreateDeposit, useCreateCredit } from '../../../../hooks/useTransactionQueries';
import { useToast } from '../../../../components/common/Toast';

interface CloneTransactionState {
    transactionData?: TransactionData;
}

const CloneTransaction: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { clonedTransactionData } = useTransactionStore();
    const createTenantMutation = useCreateTenant();

    const transactionData = clonedTransactionData || (location.state as CloneTransactionState)?.transactionData;

    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [dueOn, setDueOn] = useState<Date | undefined>(undefined);
    const [amount, setAmount] = useState('');
    const [details, setDetails] = useState('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createIncomeMutation = useCreateIncomeInvoice();
    const createExpenseMutation = useCreateExpenseInvoice();
    const createDepositMutation = useCreateDeposit();
    const createCreditMutation = useCreateCredit();

    useEffect(() => {
        if (transactionData) {
            setCategory(transactionData.category || '');
            setSubcategory(transactionData.subcategory || '');
            if (transactionData.rawDueDate) {
                setDueOn(new Date(transactionData.rawDueDate));
            } else if (transactionData.date) {
                setDueOn(new Date(transactionData.date));
            }
            setAmount(transactionData.amount ? transactionData.amount.replace(/[^0-9.]/g, '') : '');
            setDetails(transactionData.details || '');
        }
    }, [transactionData]);

    const handleCreate = async () => {
        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum) || amountNum <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        const scope = transactionData?.rawScope || 'GENERAL';
        const currency = (transactionData?.rawCurrency as any) || 'USD';
        const payerId = transactionData?.rawPayerId;
        const payeeId = transactionData?.rawPayeeId;
        const contactId = transactionData?.rawContactId;
        const propertyId = transactionData?.rawPropertyId;
        const unitId = transactionData?.rawUnitId;
        const leaseId = transactionData?.rawLeaseId;
        const dueDate = dueOn ? dueOn.toISOString() : undefined;

        const basePayload = {
            scope,
            currency,
            category: category || undefined,
            subcategory: subcategory || undefined,
            dueDate,
            amount: amountNum,
            contactId,
            propertyId,
            unitId,
            leaseId,
            details: details || undefined,
        };

        const rawType = transactionData?.rawType || 'INVOICE';

        setIsSubmitting(true);
        try {
            if (rawType === 'EXPENSE') {
                await createExpenseMutation.mutateAsync({
                    invoiceData: { ...basePayload, payeeId },
                });
            } else if (rawType === 'DEPOSIT') {
                await createDepositMutation.mutateAsync({
                    depositData: { ...basePayload, payerId },
                });
            } else if (rawType === 'CREDIT') {
                await createCreditMutation.mutateAsync({
                    creditData: { ...basePayload, payeeId },
                });
            } else {
                // INCOME or INVOICE
                await createIncomeMutation.mutateAsync({
                    invoiceData: { ...basePayload, payerId },
                });
            }
            toast.success('Transaction cloned successfully');
            navigate('/dashboard/accounting/transactions');
        } catch (error: any) {
            toast.error(error.message || 'Failed to clone transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full rounded-md bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all shadow-sm";
    const labelClasses = "block text-xs font-bold text-gray-700 mb-2 ml-1";

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <div className="bg-[#E7ECEB] rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-sm min-h-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                    {/* Category */}
                    <div>
                        <label className={labelClasses}>Category*</label>
                        <input
                            type="text"
                            placeholder="Enter Category"
                            className={inputClasses}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    {/* Subcategory */}
                    <div>
                        <label className={labelClasses}>Subcategory</label>
                        <input
                            type="text"
                            placeholder="Enter Subcategory"
                            className={inputClasses}
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                        />
                    </div>

                    {/* Due On */}
                    <div>
                        <label className={labelClasses}>Due on</label>
                        <div className="relative">
                            <DatePicker
                                value={dueOn}
                                onChange={setDueOn}
                                placeholder="Select Date"
                                className={inputClasses}
                            />
                        </div>
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

                {/* Details */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
                    <div className="bg-[#F3F4F6] rounded-2xl p-6">
                        <textarea
                            className="w-full h-32 bg-transparent text-sm text-gray-700 outline-none resize-none placeholder-gray-500"
                            placeholder="Write some details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        disabled={isSubmitting}
                        onClick={handleCreate}
                        className="bg-[#3D7475] text-white px-10 py-3 rounded-md font-semibold shadow-lg shadow-[#3D7475]/20 hover:bg-[#2c5556] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting && (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>

            <AddTenantModal
                isOpen={isAddTenantModalOpen}
                onClose={() => setIsAddTenantModalOpen(false)}
                onSave={async (data) => {
                    try {
                        await createTenantMutation.mutateAsync({
                            firstName: data.firstName,
                            lastName: data.lastName,
                            phoneNumber: data.phone,
                            email: data.email,
                        });
                        setIsAddTenantModalOpen(false);
                    } catch {
                        // handled by mutation
                    }
                }}
            />
        </div>
    );
};

export default CloneTransaction;
