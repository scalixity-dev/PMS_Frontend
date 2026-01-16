import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddTenantModal from '../Tenants/components/AddTenantModal';
import { validateFile } from '../../../../utils/fileValidation';
import CustomDropdown from '../../components/CustomDropdown';
import { useGetAllTenants } from '../../../../hooks/useTenantQueries';
import { useGetAllApplications } from '../../../../hooks/useApplicationQueries';
import { serviceProviderService } from '../../../../services/service-provider.service';
import { useGetLeasesByTenant } from '../../../../hooks/useLeaseQueries';
import { useGetApplicableInvoices, useGetAvailableDepositsAndCredits, useApplyDepositCredit } from '../../../../hooks/useTransactionQueries';
import type { ApplicableInvoice, AvailableDepositCredit } from '../../../../services/transaction.service';
import Breadcrumb from '../../../../components/ui/Breadcrumb';

interface SelectedApplication {
  invoiceId: string;
  depositCreditId: string;
  amount: number;
}

const ApplyDepositAndCredit: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const applyDepositCreditMutation = useApplyDepositCredit();

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
    const [payeeId, setPayeeId] = useState<string>('');
    const [contactId, setContactId] = useState<string>('');
    const [selectedPayeeType, setSelectedPayeeType] = useState<'tenant' | 'Service Pro' | 'other'>('tenant');
    const [lease, setLease] = useState<string>('');
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [selectedApplications, setSelectedApplications] = useState<Record<string, SelectedApplication>>({});
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Transform payer/payee options
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
                if (applicant.email) {
                    const name = [applicant.firstName, applicant.middleName, applicant.lastName]
                        .filter(Boolean)
                        .join(' ') || applicant.email;
                    options.push({
                        id: applicant.email, // Use email as ID for applicants
                        label: name,
                        type: 'other',
                    });
                }
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

    // Find selected payer/payee details
    const selectedPayeeOption = useMemo(() => {
        return payerPayeeOptions.find(opt => opt.id === payerPayee);
    }, [payerPayeeOptions, payerPayee]);

    // Update payee type and IDs when payer/payee changes
    useEffect(() => {
        if (selectedPayeeOption) {
            setSelectedPayeeType(selectedPayeeOption.type);
            if (selectedPayeeOption.type === 'tenant' || selectedPayeeOption.type === 'other') {
                setPayeeId(selectedPayeeOption.id);
                setContactId('');
            } else if (selectedPayeeOption.type === 'Service Pro') {
                setContactId(selectedPayeeOption.id);
                setPayeeId('');
            }
        } else {
            setPayeeId('');
            setContactId('');
            setSelectedPayeeType('tenant');
        }
        setLease(''); // Reset lease when payer changes
        setSelectedApplications({}); // Reset selected applications
    }, [selectedPayeeOption]);

    // Fetch leases for tenant if payer is a tenant
    const { data: leasesByTenant = [] } = useGetLeasesByTenant(
        payeeId && selectedPayeeType === 'tenant' ? payeeId : null,
        selectedPayeeType === 'tenant' && !!payeeId
    );

    // Get lease options for tenants
    const leaseOptions = useMemo(() => {
        if (selectedPayeeType !== 'tenant' || !payeeId) return [];
        
        return leasesByTenant.map((leaseItem) => {
            const propertyName = leaseItem.property?.propertyName || 'Unknown Property';
            const unitName = leaseItem.unit?.unitName ? ` - ${leaseItem.unit.unitName}` : '';
            const label = `${propertyName}${unitName}`;
            return {
                value: leaseItem.id,
                label,
            };
        });
    }, [leasesByTenant, selectedPayeeType, payeeId]);

    // Fetch applicable invoices
    const { data: applicableInvoices = [] } = useGetApplicableInvoices(
        payeeId || null,
        contactId || null,
        lease || null,
    );

    // Fetch available deposits and credits
    const { data: availableDepositsCredits = [] } = useGetAvailableDepositsAndCredits(
        payeeId || null,
        contactId || null,
        lease || null,
    );

    // Handle prefilled data from navigation
    useEffect(() => {
        if (location.state?.prefilledPayer) {
            const prefilledOption = payerPayeeOptions.find(
                opt => opt.id === location.state.prefilledPayer || opt.label === location.state.prefilledPayer
            );
            if (prefilledOption) {
                setPayerPayee(prefilledOption.id);
            }
        }
        if (location.state?.prefilledLease) {
            setLease(location.state.prefilledLease);
        }
    }, [location.state, payerPayeeOptions]);

    const handlePayerChange = (value: string) => {
        setPayerPayee(value);
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

    // Handle selecting deposit/credit to apply to invoice
    const handleApplicationChange = (invoiceId: string, depositCreditId: string, amount: number) => {
        if (amount <= 0) {
            const newApplications = { ...selectedApplications };
            delete newApplications[invoiceId];
            setSelectedApplications(newApplications);
            return;
        }

        // Find the invoice and deposit/credit to validate amounts
        const invoice = applicableInvoices.find((inv: ApplicableInvoice) => inv.id === invoiceId);
        const depositCredit = availableDepositsCredits.find((dc: AvailableDepositCredit) => dc.id === depositCreditId);

        if (!invoice || !depositCredit) return;

        // Validate amount doesn't exceed invoice balance or deposit/credit balance
        const maxAmount = Math.min(invoice.balance, depositCredit.balance);
        const finalAmount = Math.min(amount, maxAmount);

        setSelectedApplications({
            ...selectedApplications,
            [invoiceId]: {
                invoiceId,
                depositCreditId,
                amount: finalAmount,
            },
        });
    };

    const handleRecord = async () => {
        setError('');
        setSuccess('');

        if (!payerPayee) {
            setError('Please select a payer/payee');
            return;
        }

        const applications = Object.values(selectedApplications);
        if (applications.length === 0) {
            setError('Please select at least one deposit/credit to apply to an invoice');
            return;
        }

        try {
            await applyDepositCreditMutation.mutateAsync({
                applyData: {
                    payerId: payeeId || undefined,
                    contactId: contactId || undefined,
                    leaseId: lease || undefined,
                    applications: applications.map(app => ({
                        sourceTransactionId: app.depositCreditId,
                        targetTransactionId: app.invoiceId,
                        amount: app.amount,
                    })),
                },
                file: selectedFile || undefined,
            });

            setSuccess('Deposits/credits applied successfully');
            // Navigate back after a short delay
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to apply deposits/credits');
        }
    };

    // Transform invoices for display
    const tableData = useMemo(() => {
        return applicableInvoices.map((invoice: ApplicableInvoice) => {
            const selectedApp = selectedApplications[invoice.id];
            const appliedFromValue = selectedApp
                ? availableDepositsCredits.find((dc: AvailableDepositCredit) => dc.id === selectedApp.depositCreditId)?.type || 'N/A'
                : 'N/A';

            return {
                id: invoice.id,
                transactionId: invoice.transactionId,
                dueDate: invoice.dueDate,
                applyTo: invoice.category,
                subCategory: invoice.category,
                applyFrom: appliedFromValue,
                dueOn: `+${invoice.balance.toFixed(2)}`,
                amountOwed: `+${invoice.balance.toFixed(2)}`,
                invoice,
            };
        });
    }, [applicableInvoices, selectedApplications, availableDepositsCredits]);

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Transactions', path: '/dashboard/accounting/transactions' },
                    { label: 'Apply deposit & credits' },
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
                        Apply deposit & credits
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
                        {/* Lease */}
                        {selectedPayeeType === 'tenant' && (
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Lease</label>
                                <div className="relative">
                                    <CustomDropdown
                                        value={lease}
                                        onChange={setLease}
                                        options={leaseOptions}
                                        placeholder={payeeId ? "Select lease" : "Select payer first"}
                                        searchable={true}
                                        disabled={!payeeId}
                                        buttonClassName="!py-3 !rounded-md !border-0 !shadow-sm focus:!ring-[#3A6D6C]/20"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Section */}
                {tableData.length > 0 && (
                    <>
                        <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 pl-4 hidden md:block">
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

                        <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t min-h-[300px]">
                            {tableData.map((item: any) => {
                                const selectedApp = selectedApplications[item.id];
                                const availableDeposits = availableDepositsCredits.filter(
                                    (dc: AvailableDepositCredit) => dc.balance > 0 && (!selectedApp || dc.id === selectedApp.depositCreditId)
                                );

                                return (
                                    <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
                                        {/* Desktop View */}
                                        <div className="hidden md:grid grid-cols-7 gap-4 items-center">
                                            <div className="font-semibold text-gray-800 text-sm">{item.transactionId}</div>
                                            <div className="text-gray-800 text-sm font-semibold">{item.dueDate}</div>
                                            <div className="text-gray-800 text-sm font-semibold">{item.applyTo}</div>
                                            <div className="text-gray-800 text-sm font-semibold">{item.subCategory}</div>
                                            <div className="text-gray-800 text-sm">
                                                <select
                                                    value={selectedApp?.depositCreditId || ''}
                                                    onChange={(e) => {
                                                        const depositCredit = availableDepositsCredits.find((dc: AvailableDepositCredit) => dc.id === e.target.value);
                                                        if (depositCredit) {
                                                            handleApplicationChange(item.id, e.target.value, Math.min(item.invoice.balance, depositCredit.balance));
                                                        }
                                                    }}
                                                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                                                >
                                                    <option value="">Select...</option>
                                                    {availableDeposits.map((dc) => (
                                                        <option key={dc.id} value={dc.id}>
                                                            {dc.type} - {dc.transactionId} (Balance: {dc.balance.toFixed(2)})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="text-[#7BD747] text-sm font-bold text-right">
                                                {selectedApp ? (
                                                    <input
                                                        type="number"
                                                        value={selectedApp.amount}
                                                        onChange={(e) => handleApplicationChange(item.id, selectedApp.depositCreditId, parseFloat(e.target.value) || 0)}
                                                        min="0"
                                                        max={Math.min(item.invoice.balance, availableDepositsCredits.find(dc => dc.id === selectedApp.depositCreditId)?.balance || 0)}
                                                        step="0.01"
                                                        className="w-24 text-right rounded-md border border-gray-300 px-2 py-1 text-sm"
                                                    />
                                                ) : (
                                                    item.dueOn
                                                )}
                                            </div>
                                            <div className="text-[#7BD747] text-sm font-bold text-right">{item.amountOwed}</div>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="md:hidden bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 text-base">{item.transactionId}</span>
                                                    <span className="text-gray-500 text-xs text-nowrap">Due: {item.dueDate}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-gray-500">Owed</span>
                                                    <span className="text-[#7BD747] font-bold text-base">{item.amountOwed}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-3 mt-1">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-500 text-xs">Apply To</span>
                                                    <span className="text-gray-800 font-medium">{item.applyTo}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-500 text-xs mb-1">Apply From</span>
                                                    <select
                                                        value={selectedApp?.depositCreditId || ''}
                                                        onChange={(e) => {
                                                            const depositCredit = availableDepositsCredits.find((dc: AvailableDepositCredit) => dc.id === e.target.value);
                                                            if (depositCredit) {
                                                                handleApplicationChange(item.id, e.target.value, Math.min(item.invoice.balance, depositCredit.balance));
                                                            }
                                                        }}
                                                        className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                                                    >
                                                        <option value="">Select...</option>
                                                        {availableDeposits.map((dc) => (
                                                            <option key={dc.id} value={dc.id}>
                                                                {dc.type} - {dc.transactionId}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {selectedApp && (
                                                <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-500 text-xs">Sub-category</span>
                                                        <span className="text-gray-800 font-medium">{item.subCategory}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-500 text-xs mb-1">Amount to Apply</span>
                                                        <input
                                                            type="number"
                                                            value={selectedApp.amount}
                                                            onChange={(e) => handleApplicationChange(item.id, selectedApp.depositCreditId, parseFloat(e.target.value) || 0)}
                                                            min="0"
                                                            max={Math.min(item.invoice.balance, availableDepositsCredits.find((dc: AvailableDepositCredit) => dc.id === selectedApp.depositCreditId)?.balance || 0)}
                                                            step="0.01"
                                                            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {!payerPayee && (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm mt-10 bg-[#F0F0F6] rounded-[2rem] p-8">
                        Select a Payer to view invoices.
                    </div>
                )}

                {payerPayee && tableData.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm mt-10 bg-[#F0F0F6] rounded-[2rem] p-8">
                        No invoices found for this payer.
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
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
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
                        onClick={handleRecord}
                        disabled={applyDepositCreditMutation.isPending || Object.keys(selectedApplications).length === 0}
                        className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2c5251] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {applyDepositCreditMutation.isPending ? 'Applying...' : 'Record as Applied'}
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

export default ApplyDepositAndCredit;
