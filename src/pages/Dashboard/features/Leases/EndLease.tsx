import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import { useGetLease, useUpdateLease } from '../../../../hooks/useLeaseQueries';
import DatePicker from '../../../../components/ui/DatePicker';
import CustomTextBox from '../../components/CustomTextBox';

// --- Types ---


interface UnpaidInvoice {
    id: string;
    dueDate: string;
    category: string;
    payer: string;
    total: string;
    paid: string;
}

// Helper function to format dates
const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Helper function to format currency
const formatCurrency = (amount: string | number | null | undefined): string => {
    if (!amount) return '₹0.00';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(numAmount);
};

// --- Component ---
const EndLease: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());

    // Fetch lease data
    const { data: backendLease, isLoading, error } = useGetLease(id);
    const updateLeaseMutation = useUpdateLease();

    // Transform lease data for display
    const leaseData = useMemo(() => {
        if (!backendLease) return null;

        return {
            property: backendLease.property?.propertyName || 'Unknown Property',
            type: backendLease.recurringRent?.isMonthToMonth ? 'Month-to-Month' : 'Fixed',
            invoicing: 'Separated', // Default value - can be enhanced with actual data
            startDate: formatDate(backendLease.startDate),
            endDate: formatDate(backendLease.endDate || undefined),
            tenantName: backendLease.tenant?.fullName || 'Unknown Tenant',
            leaseNumber: `Lease ${backendLease.id.slice(-4)}`,
        };
    }, [backendLease]);

    // Transform deposits for display
    const depositData = useMemo(() => {
        if (!backendLease?.deposits || backendLease.deposits.length === 0) {
            return null;
        }

        const deposit = backendLease.deposits[0]; // Use first deposit
        return {
            category: deposit.category || 'Deposit',
            payer: backendLease.tenant?.fullName || 'Unknown Tenant',
            availableAmount: formatCurrency(deposit.amount),
        };
    }, [backendLease]);

    // TODO: Fetch unpaid invoices from accounting/invoice service
    // For now, using empty array - this should be replaced with actual invoice data
    const unpaidInvoices: UnpaidInvoice[] = [];

    // Calculate total unpaid
    const totalUnpaid = useMemo(() => {
        return unpaidInvoices.reduce((sum, invoice) => {
            const total = parseFloat(invoice.total.replace(/[₹,]/g, '')) || 0;
            return sum + total;
        }, 0);
    }, [unpaidInvoices]);

    const handleEndLease = async () => {
        if (!id || !endDate) return;

        try {
            await updateLeaseMutation.mutateAsync({
                id,
                data: {
                    status: 'TERMINATED' as const,
                    endDate: endDate.toISOString(),
                },
            });
            navigate('/dashboard/portfolio/leases');
        } catch (error) {
            console.error('Failed to end lease:', error);
            alert(error instanceof Error ? error.message : 'Failed to end lease. Please try again.');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                    <p className="text-gray-600">Loading lease details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !leaseData) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 text-sm">
                        {error instanceof Error ? error.message : 'Failed to load lease details. Please try again.'}
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/portfolio/leases')}
                        className="mt-4 text-red-600 hover:text-red-800 underline text-sm"
                    >
                        Back to Leases
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] overflow-x-auto whitespace-nowrap max-w-full">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/portfolio/leases')}>Leases</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate(`/dashboard/portfolio/leases/${id}`)}>{id}</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">End lease</span>
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] shadow-sm p-4 sm:p-8">
                <h1 className="text-xl font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4">End Lease Process</h1>

                {/* Lease Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-6 gap-x-12 mb-10 bg-white text-sm p-6 rounded-[2rem] shadow-sm">
                    <div>
                        <CustomTextBox
                            label="Property"
                            value={leaseData.property}
                        />
                    </div>
                    {/* Empty col for spacing matching screenshot roughly, or just responsive grid */}

                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <CustomTextBox
                                label="Lease Type"
                                value={leaseData.type}
                            />
                        </div>
                        <div>
                            <CustomTextBox
                                label="Start Date"
                                value={leaseData.startDate}
                            />
                        </div>
                        <div>
                            <CustomTextBox
                                label="Lease Invoicing"
                                value={leaseData.invoicing}
                            />
                        </div>
                        <div>
                            <CustomTextBox
                                label="End date"
                                value={leaseData.endDate}
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100 mb-8" />

                {/* Unpaid Invoices */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">UNPAID INVOICES</h2>
                        <div className="flex items-center gap-2 border border-red-200 bg-red-50 px-3 py-1.5 rounded-md text-red-600 text-xs font-bold">
                            <span>Total unpaid</span>
                            <span className="text-red-600">{formatCurrency(totalUnpaid)}</span>
                        </div>
                    </div>

                    {/* Equipments-style Table Construction */}
                    <div className="mt-4">
                        {/* Header */}
                        <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm hidden md:block">
                            <div className="text-white px-6 py-4 grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_50px] gap-4 items-center text-sm font-medium">
                                <div>Due date</div>
                                <div>Category</div>
                                <div>Payer</div>
                                <div className="text-right">Total</div>
                                <div className="text-right">Paid</div>
                                <div></div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col gap-3 md:bg-[#F0F0F6] md:p-4 md:rounded-[2rem] md:rounded-t-none">
                            {unpaidInvoices.length > 0 ? (
                                unpaidInvoices.map((invoice) => (
                                <div key={invoice.id} className="bg-white rounded-2xl px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_1fr_1fr_50px] gap-2 md:gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-gray-600 text-sm">{invoice.dueDate}</div>
                                    <div className="text-gray-800 font-medium text-sm">
                                        <span className="md:hidden text-gray-400 text-xs block mb-1">Category</span>
                                        {invoice.category}
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        <span className="md:hidden text-gray-400 text-xs block mb-1">Payer</span>
                                        {invoice.payer}
                                    </div>
                                    <div className="text-gray-800 font-medium text-sm md:text-right">
                                        <span className="md:hidden text-gray-400 text-xs block mb-1">Total</span>
                                        {invoice.total}
                                    </div>
                                    <div className="text-gray-600 text-sm md:text-right">
                                        <span className="md:hidden text-gray-400 text-xs block mb-1">Paid</span>
                                        {invoice.paid}
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-2xl px-6 py-8 text-center text-gray-500">
                                    <p className="text-sm">No unpaid invoices</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                        <button
                            onClick={() => navigate('/dashboard/accounting/transactions/income/add', {
                                state: {
                                    prefilledPayer: { label: leaseData.tenantName },
                                    prefilledLease: leaseData.leaseNumber,
                                    prefilledDate: new Date()
                                }
                            })}
                            className="flex items-center gap-2 text-[#3A6D6C] hover:text-[#2c5251] font-semibold text-sm transition-colors w-full sm:w-auto justify-center sm:justify-start"
                        >
                            <Plus size={18} />
                            Add new transaction
                        </button>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/dashboard/accounting/transactions/apply-deposit', {
                                    state: {
                                        prefilledPayer: { label: leaseData.tenantName },
                                        prefilledLease: leaseData.leaseNumber
                                    }
                                })}
                                className="flex-1 sm:flex-none bg-[#3A6D6C] hover:bg-[#2c5251] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm whitespace-nowrap"
                            >
                                Apply deposit
                            </button>
                            <button
                                onClick={() => navigate('/dashboard/accounting/transactions/bulk-payments-income', {
                                    state: {
                                        prefilledPayer: { label: leaseData.tenantName },
                                        prefilledProperty: leaseData.property
                                    }
                                })}
                                className="flex-1 sm:flex-none bg-[#3A6D6C] hover:bg-[#2c5251] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm whitespace-nowrap"
                            >
                                Record as paid
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100 mb-8" />

                {/* Return Deposit */}
                <div className="mb-10">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">RETURN DEPOSIT</h2>
                    {/* Equipments-style Table Construction */}
                    <div className="mb-4">
                        {/* Header */}
                        <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm hidden md:block">
                            <div className="text-white px-6 py-4 grid grid-cols-[1fr_1fr_1fr] gap-4 items-center text-sm font-medium">
                                <div>Category</div>
                                <div>Payer</div>
                                <div className="text-right">Available Amount</div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col gap-3 md:bg-[#F0F0F6] md:p-4 md:rounded-[2rem] md:rounded-t-none">
                            {depositData ? (
                                <div className="bg-white rounded-2xl px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-2 md:gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-gray-800 font-medium text-sm">
                                        <span className="md:hidden text-gray-400 text-xs block mb-1">Category</span>
                                        {depositData.category}
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        <span className="md:hidden text-gray-400 text-xs block mb-1">Payer</span>
                                        {depositData.payer}
                                    </div>
                                    <div className="text-gray-800 font-medium text-sm md:text-right">
                                        <span className="md:hidden text-gray-400 text-xs block mb-1">Available Amount</span>
                                        {depositData.availableAmount}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl px-6 py-8 text-center text-gray-500">
                                    <p className="text-sm">No deposits available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => navigate('/dashboard/accounting/transactions/return-deposit', {
                            state: {
                                prefilledPayer: { label: leaseData.tenantName },
                                prefilledDepositCategory: 'security_deposit'
                            }
                        })}
                        className="bg-[#3A6D6C] hover:bg-[#2c5251] text-white px-8 py-2 rounded-full text-sm font-bold transition-colors shadow-sm w-full sm:w-auto"
                    >
                        Return Deposit
                    </button>
                </div>
            </div>

            <hr className="border-dashed border-gray-200 mb-8" />

            {/* Footer Actions */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-end md:items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-2.5 border border-gray-400 text-gray-600 font-bold rounded-md hover:bg-gray-50 transition-colors w-full md:w-auto"
                >
                    Cancel
                </button>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-xs font-bold text-gray-600">Date ended</label>
                        <div className="w-full md:w-48">
                            <DatePicker
                                value={endDate}
                                onChange={setEndDate}
                                popoverClassName="bottom-full mb-2 mt-0 w-[300px]"
                                className="border-gray-300 shadow-none focus:ring-[#20CC95]/20 focus:border-[#20CC95]"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleEndLease}
                        disabled={updateLeaseMutation.isPending || !endDate}
                        className="bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-md font-bold transition-colors shadow-sm w-full md:w-auto h-[42px] mt-auto flex items-center justify-center gap-2"
                    >
                        {updateLeaseMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Ending...
                            </>
                        ) : (
                            'End the Lease'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndLease;
