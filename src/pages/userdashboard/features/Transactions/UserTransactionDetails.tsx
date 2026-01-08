import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Printer, User, ChevronDown, CheckCircle2, Calendar, DollarSign, FileText, Download } from 'lucide-react';
import { formatMoney } from '../../../../utils/currency.utils';
import { mockTransactions } from '../../utils/mockData';
import { TransactionNotFound } from './components/TransactionNotFound';

const TransactionDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const foundTransaction = mockTransactions.find(t => t.id === id);

    if (!foundTransaction) {
        return <TransactionNotFound />;
    }

    // Amount Handling Logic
    const totalAmount = Math.abs(foundTransaction.amount);
    let paidAmount = 0;

    if (foundTransaction.status === 'Paid') {
        paidAmount = totalAmount;
    } else if (foundTransaction.status === 'Partial') {
        paidAmount = foundTransaction.paidAmount ?? 0;
    }
    // Open / Overdue -> paidAmount = 0

    const outstandingAmount = Math.max(0, totalAmount - paidAmount);

    // Progress Bar Safe Calculation
    const progress = totalAmount > 0
        ? Math.min(100, Math.max(0, (paidAmount / totalAmount) * 100))
        : 0;

    // Prepare transaction object for display
    const transaction = {
        ...foundTransaction,
        subCategory: "General", // Default as missing in mock
        contact: {
            ...foundTransaction.contact,
            email: "siddakbagga@gmail.com", // Default as missing in mock
        },
        amount: foundTransaction.amount, // Keep signed amount
        paidAmount,
        totalAmount,
        outstandingAmount,
        invoiceNumber: `INV-${foundTransaction.id}`,
        property: "Luxury Apartment", // Default
        unit: "-",
        type: `Expense / ${foundTransaction.schedule}`,
        attachments: [
            { id: 1, name: "Invoice-DEC-2025.pdf", size: "2.4 MB", type: "PDF", url: "https://pdfobject.com/pdf/sample.pdf" },
            { id: 2, name: "Receipt-1234.png", size: "1.2 MB", type: "Image", url: "https://images.unsplash.com/photo-1600596542815-e32904fc4969" }
        ]
    };

    const paymentRecords = transaction.paidAmount > 0 ? [
        {
            id: `pay-${transaction.id}`,
            date: transaction.dueDate, // Ideally this would be the actual payment date from backend history
            status: "Success",
            amount: transaction.paidAmount
        }
    ] : [];

    const handleDownload = (file: { name: string; url?: string }) => {
        // Since we're using mock data, we'll simulate a download
        // In a real app, this would be a link to the actual file
        const link = document.createElement('a');
        link.href = file.url || '#';
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(`Downloading: ${file.name}`);
    };

    return (
        <div className="flex flex-col gap-6 w-full min-h-screen bg-white p-4 lg:p-8">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-base font-medium">
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
            <div className="max-w-7xl mx-auto w-full space-y-6">

                {/* Header Card */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="px-2 py-2 border-b border-[#E5E7EB] flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ChevronLeft size={24} className="text-gray-900" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-900">Transaction</h1>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Printer size={24} className="text-gray-900" />
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Due Date & Description */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-900 font-medium mb-3">
                                <Calendar size={20} />
                                <span>Due on {transaction.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-semibold text-gray-900">
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
                        <div className="space-y-4 max-w-[75%]">
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
                                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md overflow-hidden bg-gray-100">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${transaction.contact.name}`}
                                        alt={transaction.contact.name}
                                        className="w-full h-full object-cover"
                                    />
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
                    <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
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
                    <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="px-6 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
                            <div className="flex items-center gap-2">

                                <h3 className="text-xl font-semibold text-gray-900">Payment & Activity <span className="text-gray-400 text-sm font-medium ml-2">({paymentRecords.length} Record)</span></h3>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="rounded-lg border border-gray-100 overflow-hidden bg-white">
                                {paymentRecords.map((record) => (
                                    <div key={record.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-1.5 rounded-full border border-gray-900 text-gray-900">
                                                <DollarSign size={16} strokeWidth={3} />
                                            </div>
                                            <span className="font-semibold text-gray-900 text-lg">{record.date}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-gray-900">
                                                {formatMoney(record.amount, transaction.currency)}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DCFCE7] text-[#16A34A] rounded-full text-xs font-bold">
                                                <CheckCircle2 size={12} strokeWidth={3} />
                                                {record.status}
                                            </span>
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${transaction.contact.name}`}
                                                    alt={transaction.contact.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                                                <ChevronDown size={20} className="text-gray-900" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attachments Section */}
                <div className="bg-[#F4F4F4] rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
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
                                            className="p-2 text-gray-400 hover:text-[#7ED957] hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
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
