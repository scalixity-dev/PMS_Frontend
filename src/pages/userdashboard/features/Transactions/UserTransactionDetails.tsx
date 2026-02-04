import { useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { handleDocumentPrint } from '../../../Dashboard/features/Documents/utils/printPreviewUtils';
import { ChevronLeft, Printer, User, ChevronDown, CheckCircle2, Calendar, DollarSign, FileText, Download, Loader2 } from 'lucide-react';
import { formatMoney } from '../../../../utils/currency.utils';
import { TransactionNotFound } from './components/TransactionNotFound';
import { useGetTransaction } from '../../../../hooks/useTransactionQueries';
import type { BackendTransaction } from '../../../../services/transaction.service';

const TransactionDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const contentRef = useRef<HTMLDivElement>(null);

    // Fetch transaction from API
    const { data: backendTransaction, isLoading, error } = useGetTransaction(id);

    // Transform backend transaction to frontend format
    const transaction = useMemo(() => {
        if (!backendTransaction) return null;

        const tx = backendTransaction as BackendTransaction;

        // Map backend status to frontend status
        const statusMap: Record<string, 'Open' | 'Overdue' | 'Paid' | 'Partial'> = {
            'Pending': 'Open',
            'Paid': 'Paid',
            'Void': 'Open',
            'PARTIALLY_PAID': 'Partial',
            'PENDING': 'Open',
            'PAID': 'Paid',
            'VOID': 'Open',
            'REFUNDED': 'Paid'
        };

        let status: 'Open' | 'Overdue' | 'Paid' | 'Partial' = statusMap[tx.status] || 'Open';

        // Check if overdue
        if (status === 'Open' && tx.dueDate) {
            const dueDate = new Date(tx.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dueDate.setHours(0, 0, 0, 0);
            if (dueDate < today && parseFloat(tx.balance) > 0) {
                status = 'Overdue';
            }
        }

        // Calculate amounts
        const totalAmount = Math.abs(parseFloat(tx.amount));
        const balance = parseFloat(tx.balance);
        const paidAmount = totalAmount - balance;
        const outstandingAmount = Math.max(0, balance);

        // Get contact information
        let contactName = 'N/A';
        let contactEmail = 'N/A';
        if (tx.payer) {
            contactName = tx.payer.fullName || tx.payer.email || 'N/A';
            contactEmail = tx.payer.email || 'N/A';
        } else if (tx.payee) {
            contactName = tx.payee.fullName || tx.payee.email || 'N/A';
            contactEmail = tx.payee.email || 'N/A';
        } else if (tx.contact) {
            const nameParts = [
                tx.contact.firstName,
                tx.contact.middleName,
                tx.contact.lastName,
            ].filter(Boolean);
            contactName = nameParts.length > 0 ? nameParts.join(' ') : tx.contact.email || 'N/A';
            contactEmail = tx.contact.email || 'N/A';
        }

        // Format due date
        const dueDateFormatted = tx.dueDate
            ? new Date(tx.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'N/A';

        // Determine transaction type
        const schedule = tx.isRecurring ? 'Monthly' : 'One-time';
        const typeLabel = tx.type === 'INVOICE'
            ? (tx.payerId ? 'Income' : 'Expense')
            : tx.type;
        const type = `${typeLabel} / ${schedule}`;

        // Format attachments
        const attachments = (tx.attachments || []).map((att, index) => {
            // Try to determine file size from URL or use default
            const fileExtension = att.fileName?.split('.').pop()?.toLowerCase() || 'file';
            const fileType = fileExtension === 'pdf' ? 'PDF'
                : ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension) ? 'Image'
                    : ['doc', 'docx'].includes(fileExtension) ? 'Document'
                        : 'File';

            return {
                id: att.id || `att-${index}`,
                name: att.fileName || `attachment-${index}.${fileExtension}`,
                size: 'N/A', // Backend doesn't provide size, could be enhanced
                type: fileType,
                url: att.fileUrl
            };
        });

        return {
            id: tx.id,
            status,
            dueDate: dueDateFormatted,
            category: tx.subcategory || tx.category || 'General',
            subCategory: tx.subcategory || 'General',
            contact: {
                name: contactName,
                email: contactEmail,
                initials: contactName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
            },
            amount: -Math.abs(totalAmount), // Negative for expenses/rent
            paidAmount: paidAmount > 0 ? paidAmount : 0,
            totalAmount,
            outstandingAmount,
            invoiceNumber: tx.transactionId || `INV-${tx.id}`,
            property: tx.property?.propertyName || 'N/A',
            unit: tx.unit?.unitName || '-',
            type,
            currency: tx.currency || 'INR',
            attachments
        };
    }, [backendTransaction]);

    // Calculate progress
    const progress = useMemo(() => {
        if (!transaction) return 0;
        return transaction.totalAmount > 0
            ? Math.min(100, Math.max(0, (transaction.paidAmount / transaction.totalAmount) * 100))
            : 0;
    }, [transaction]);

    // Format payment records from backend
    const paymentRecords = useMemo(() => {
        if (!backendTransaction || !backendTransaction.payments || backendTransaction.payments.length === 0) {
            return [];
        }

        return backendTransaction.payments.map((payment) => {
            const paymentDate = typeof payment.paymentDate === 'string'
                ? new Date(payment.paymentDate)
                : payment.paymentDate;

            return {
                id: payment.id,
                date: paymentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                status: 'Success' as const,
                amount: parseFloat(payment.amount),
                method: payment.method,
                referenceNumber: payment.referenceNumber,
                notes: payment.notes
            };
        });
    }, [backendTransaction]);

    const handlePrint = () => {
        const title = transaction ? transaction.invoiceNumber : `Transaction-${id}`;
        handleDocumentPrint(contentRef, { title });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 w-full min-h-screen bg-white p-4 lg:p-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--dashboard-accent)]" />
                        <p className="text-gray-600">Loading transaction...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !transaction) {
        return <TransactionNotFound />;
    }

    const handleDownload = (file: { name: string; url?: string }) => {
        if (file.url) {
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full min-h-screen bg-white p-4 lg:p-8">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center flex-wrap gap-2 text-base font-medium">
                    <li>
                        <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                    <li>
                        <Link to="/userdashboard/rent" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Accounting</Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                    <li className="text-[#1A1A1A] font-medium" aria-current="page">Transaction</li>
                </ol>
            </nav>

            {/* Main Content Area */}
            <div ref={contentRef} className="max-w-7xl mx-auto w-full space-y-6">

                {/* Header Card */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden avoid-break">
                    <div className="px-2 py-2 border-b border-[#E5E7EB] flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors print:hidden"
                            >
                                <ChevronLeft size={24} className="text-gray-900" />
                            </button>
                            <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">Transaction</h1>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors print:hidden"
                        >
                            <Printer size={24} className="text-gray-900" />
                        </button>
                    </div>

                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Due Date & Description */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-900 font-medium mb-3">
                                <Calendar size={20} />
                                <span>Due on {transaction.dueDate}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                                    {transaction.category} / {transaction.subCategory} for {formatMoney(transaction.totalAmount, transaction.currency)}
                                </h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${transaction.status === 'Open' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    transaction.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' :
                                        transaction.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' :
                                            transaction.status === 'Partial' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                'bg-gray-50 text-gray-600 border-gray-100'
                                    }`}>
                                    {transaction.status}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-4 w-full lg:max-w-[75%]">
                            <div className={`w-full h-3 rounded-full overflow-hidden ${transaction.status === 'Open' ? 'bg-blue-100' :
                                transaction.status === 'Overdue' ? 'bg-red-100' :
                                    transaction.status === 'Partial' ? 'bg-yellow-100' :
                                        'bg-gray-100'
                                }`}>
                                <div
                                    className={`h-full rounded-full ${transaction.status === 'Open' ? 'bg-blue-500' :
                                        transaction.status === 'Overdue' ? 'bg-red-500' :
                                            transaction.status === 'Paid' ? 'bg-[#7ED957]' :
                                                transaction.status === 'Partial' ? 'bg-yellow-500' :
                                                    'bg-gray-400'
                                        }`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-sm font-medium text-gray-500">
                                <span>{formatMoney(transaction.outstandingAmount, transaction.currency)} Left</span>
                                <span>{formatMoney(transaction.paidAmount, transaction.currency)} Paid</span>
                            </div>
                        </div>

                        {/* Payer Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                                <div className="p-1 rounded-full border border-gray-900">
                                    <User size={16} className="text-gray-900" />
                                </div>
                                <span>Payer</span>
                            </div>
                            <div className="flex items-center gap-4 pl-1">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center text-[#2E6819] bg-[#E4F2E2] text-xl font-bold shadow-md overflow-hidden">
                                    {transaction.contact.initials}
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-gray-900">{transaction.contact.name}</p>
                                    <p className="text-gray-500 font-medium">{transaction.contact.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Summary & Payment Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Summary Card */}
                    <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden avoid-break">
                        <div className="px-6 py-3 border-b border-[#E5E7EB] ">
                            <h3 className="text-xl font-semibold text-gray-900">Summary <span className="text-gray-400 text-sm font-medium ml-2">(Invoice Details)</span></h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-1">
                                <p className="text-gray-400 font-normal text-sm ">Property</p>
                                <p className="text-lg font-semibold text-gray-900">{transaction.property}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-normal text-sm ">Transaction ID</p>
                                <p className="text-lg font-semibold text-gray-900">{transaction.invoiceNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-normal text-sm ">Unit</p>
                                <p className="text-lg font-semibold text-gray-900">{transaction.unit}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-normal text-sm ">Type</p>
                                <p className="text-lg font-semibold text-gray-900">{transaction.type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Activity Card */}
                    <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden avoid-break">
                        <div className="px-6 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
                            <div className="flex items-center gap-2">

                                <h3 className="text-xl font-semibold text-gray-900">Payment & Activity <span className="text-gray-400 text-sm font-medium ml-2">({paymentRecords.length} Record)</span></h3>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="rounded-lg border border-gray-100 overflow-hidden bg-white">
                                {paymentRecords.length > 0 ? (
                                    paymentRecords.map((record) => (
                                        <div key={record.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors gap-4 sm:gap-0">
                                            <div className="flex items-center gap-4">
                                                <div className="p-1.5 rounded-full border border-gray-900 text-gray-900">
                                                    <DollarSign size={16} strokeWidth={3} />
                                                </div>
                                                <span className="font-semibold text-gray-900 text-lg">{record.date}</span>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-semibold text-gray-900">
                                                        {formatMoney(record.amount, transaction.currency)}
                                                    </span>
                                                    {record.method && (
                                                        <span className="text-sm text-gray-600">({record.method})</span>
                                                    )}
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DCFCE7] text-[#16A34A] rounded-full text-xs font-bold">
                                                        <CheckCircle2 size={12} strokeWidth={3} />
                                                        {record.status}
                                                    </span>
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#2E6819] bg-[#E4F2E2] text-xs font-bold overflow-hidden border border-gray-100">
                                                        {transaction.contact.initials}
                                                    </div>
                                                </div>
                                                <button className="p-1 hover:bg-gray-100 rounded-md transition-colors print:hidden">
                                                    <ChevronDown size={20} className="text-gray-900" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
                                        <p>No payment records found for this transaction.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attachments Section */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden avoid-break">
                    <div className="px-6 py-3 border-b border-[#E5E7EB]">
                        <h3 className="text-xl font-semibold text-gray-900">Attachments <span className="text-gray-400 text-sm font-medium ml-2">({transaction.attachments?.length || 0} Files)</span></h3>
                    </div>
                    <div className="p-6">
                        {transaction.attachments && transaction.attachments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {transaction.attachments.map((file) => (
                                    <div key={file.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500 group-hover:bg-[#f0fdf4] group-hover:text-[#166534] transition-colors">
                                                <FileText size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate" title={file.name}>{file.name}</p>
                                                <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="p-2 text-gray-400 hover:text-[#7ED957] hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0 print:hidden"
                                            title="Download"
                                            onClick={() => handleDownload(file)}
                                        >
                                            <Download size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                                <p>No attachments found for this transaction.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;
