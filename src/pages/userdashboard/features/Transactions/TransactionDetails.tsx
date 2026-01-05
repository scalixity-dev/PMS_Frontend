import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Printer, User, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const TransactionDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Mock data based on ID - in a real app this would fetch from API
    const transaction = {
        id: id || "1234567",
        status: "Open" as const,
        dueDate: "Apr 10, 2025",
        category: "Cleaning",
        subCategory: "General",
        contact: {
            name: "Siddak Bagga",
            email: "siddakbagga@gmail.com",
            initials: "SB",
            avatarColor: "#FF6B6B"
        },
        amount: 600.00,
        paidAmount: 0.00,
        currency: "USD",
        invoiceNumber: id || "1234567",
        property: "Luxury Apartment",
        unit: "-",
        type: "Income / One Time"
    };

    const paymentRecords = [
        {
            id: "p1",
            date: "Apr 10, 2025",
            status: "Success",
            amount: 600.00
        }
    ];

    return (
        <div className="flex flex-col gap-6 w-full min-h-screen bg-[#F7F7F7] p-4 lg:p-8">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-sm font-medium">
                    <li>
                        <Link to="/userdashboard" className="text-[#7ED957] hover:opacity-80 transition-opacity">Dashboard</Link>
                    </li>
                    <li aria-hidden="true" className="text-gray-400">/</li>
                    <li>
                        <Link to="/userdashboard/rent" className="text-[#7ED957] hover:opacity-80 transition-opacity">Accounting</Link>
                    </li>
                    <li aria-hidden="true" className="text-gray-400">/</li>
                    <li className="text-gray-900" aria-current="page">Transaction</li>
                </ol>
            </nav>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto w-full space-y-6">

                {/* Header Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ChevronLeft size={24} className="text-gray-700" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-900">Transaction</h1>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Printer size={24} className="text-gray-700" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Due Date & Description */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                                <span className="bg-gray-100 p-1.5 rounded-lg">📅</span>
                                <span>Due on {transaction.dueDate}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {transaction.category} / {transaction.subCategory} for ${transaction.amount.toFixed(2)}
                            </h2>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-3">
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#7ED957] rounded-full"
                                    style={{ width: `${(transaction.paidAmount / transaction.amount) * 100 || 0}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-sm font-semibold text-gray-500">
                                <span>${transaction.paidAmount.toFixed(2)} Left</span>
                                <span>${transaction.amount.toFixed(2)} Left</span>
                            </div>
                        </div>

                        {/* Payer Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <div className="p-1.5 bg-gray-50 rounded-full border border-gray-200">
                                    <User size={18} />
                                </div>
                                <span>Payer</span>
                            </div>
                            <div className="flex items-center gap-4 pl-2">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
                                    style={{ backgroundColor: transaction.contact.avatarColor }}
                                >
                                    {transaction.contact.initials}
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{transaction.contact.name}</p>
                                    <p className="text-gray-500 font-medium">{transaction.contact.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Summary & Payment Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Summary Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-800">Summary <span className="text-gray-400 text-sm font-medium ml-2">(Invoice Details)</span></h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-1">
                                <p className="text-gray-400 font-semibold text-sm uppercase tracking-wider">Property</p>
                                <p className="text-lg font-bold text-gray-900">{transaction.property}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-semibold text-sm uppercase tracking-wider">Transaction ID</p>
                                <p className="text-lg font-bold text-gray-900">{transaction.invoiceNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-semibold text-sm uppercase tracking-wider">Unit</p>
                                <p className="text-lg font-bold text-gray-900">{transaction.unit}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 font-semibold text-sm uppercase tracking-wider">Type</p>
                                <p className="text-lg font-bold text-gray-900">{transaction.type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Activity Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gray-100 rounded-full">
                                    <span className="font-bold text-gray-700">$</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Payment & Activity <span className="text-gray-400 text-sm font-medium ml-2">({paymentRecords.length} Record)</span></h3>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="rounded-xl border border-gray-100 overflow-hidden">
                                {paymentRecords.map((record) => (
                                    <div key={record.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-gray-50 rounded-full border border-gray-100">
                                                <span className="font-bold text-gray-900">$</span>
                                            </div>
                                            <span className="font-bold text-gray-800">{record.date}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
                                                <CheckCircle2 size={12} />
                                                {record.status}
                                            </span>
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                                                style={{ backgroundColor: transaction.contact.avatarColor }}
                                            >
                                                {transaction.contact.initials}
                                            </div>
                                            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                                                <MoreHorizontal size={20} className="text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;
