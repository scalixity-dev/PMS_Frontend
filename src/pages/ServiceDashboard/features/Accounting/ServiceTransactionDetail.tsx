import { useParams, useNavigate } from 'react-router-dom';
import { PiPrinter, PiUserCircle, PiCheckCircle, PiDotsThreeOutline, PiCurrencyDollar } from "react-icons/pi";
import { ChevronLeft, Calendar } from 'lucide-react';
import ServiceBreadCrumb from '../../components/ServiceBreadCrumb';

import { mockTransactions } from './mockData';

const ServiceTransactionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find transaction from mock data
    const transaction = mockTransactions.find(t => t.id === id) || mockTransactions[0]; // Fallback to first if not found (or handle 404)

    // Check if valid transaction
    if (!transaction) return <div>Transaction not found</div>;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Transaction Receipt - ${transaction.id}</title>
                <style>
                    body { font-family: 'Inter', sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                    .brand h1 { margin: 0; color: #111; font-size: 24px; }
                    .brand p { margin: 5px 0 0; color: #666; font-size: 14px; }
                    .meta { text-align: right; }
                    .meta p { margin: 2px 0; color: #666; font-size: 14px; }
                    .section { margin-bottom: 30px; }
                    .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 10px; font-weight: 600; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                    .value { font-weight: 500; }
                    .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    .table th { text-align: left; border-bottom: 1px solid #ddd; padding: 10px 0; font-size: 12px; text-transform: uppercase; color: #666; }
                    .table td { padding: 15px 0; border-bottom: 1px solid #eee; }
                    .total-section { margin-top: 30px; border-top: 2px solid #eee; padding-top: 20px; text-align: right; }
                    .total-row { display: flex; justify-content: flex-end; gap: 40px; margin-bottom: 5px; }
                    .total-row.final { font-size: 18px; font-weight: bold; color: #111; margin-top: 10px; }
                    .status-badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; background: #eee; }
                    .status-Paid { background: #e6f7e9; color: #2e7d32; }
                    .status-Unpaid { background: #fff3e0; color: #ef6c00; }
                    .footer { margin-top: 60px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="brand">
                        <h1>Service Receipt</h1>
                        <p>Scalixity Services</p>
                    </div>
                    <div class="meta">
                        <p><strong>Receipt #:</strong> ${transaction.id}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Due Date:</strong> ${transaction.dueDate}</p>
                        <br/>
                        <span class="status-badge status-${transaction.status}">${transaction.status}</span>
                    </div>
                </div>

                <div class="row">
                    <div class="section" style="width: 45%">
                        <div class="section-title">Bill To</div>
                        <div class="value">${transaction.payer.name}</div>
                        <div style="font-size: 14px; color: #666;">${transaction.payer.email}</div>
                    </div>
                    <div class="section" style="width: 45%; text-align: right;">
                        <div class="section-title">Property Info</div>
                        <div class="value">${transaction.property}</div>
                        <div style="font-size: 14px; color: #666;">Unit: ${transaction.unit}</div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Description</div>
                    <p style="font-size: 16px; margin: 0;">${transaction.description}</p>
                    <p style="font-size: 14px; color: #666; margin: 5px 0 0;">Category: ${transaction.category} • Type: ${transaction.type}</p>
                </div>

                <div class="section">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${transaction.description}</td>
                                <td style="text-align: right;">$${transaction.amount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="total-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>$${transaction.amount.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Paid:</span>
                        <span>$${(transaction.amount - transaction.amountLeft).toFixed(2)}</span>
                    </div>
                    <div class="total-row final">
                        <span>Amount Due:</span>
                        <span>$${transaction.amountLeft.toFixed(2)}</span>
                    </div>
                </div>

                <div class="footer">
                    <p>Thank you for your business!</p>
                    <p>If you have any questions, please contact support.</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <div className="">
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Accounting', to: '/service-dashboard/accounting' },
                    { label: 'Transaction', active: true }
                ]}
            />

            {/* Main Transaction Card */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 md:p-6 mb-6">
                <div className="flex justify-between items-start mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-700"
                    >
                        <ChevronLeft size={24} />
                        Transaction
                    </button>
                    <button
                        onClick={handlePrint}
                        className="text-gray-900 hover:text-gray-700"
                        title="Print Receipt"
                    >
                        <PiPrinter size={24} />
                    </button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                        <Calendar size={20} />
                        Due on {transaction.dueDate}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {transaction.description} for ${transaction.amount.toFixed(2)}
                    </h2>

                    {/* Progress Bar */}
                    <div className="mb-2">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#D8D9D7] to-[#7ED949]"
                                style={{ width: `${((transaction.amount - transaction.amountLeft) / transaction.amount) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1 font-medium">
                            <span>${(transaction.amount - transaction.amountLeft).toFixed(2)} Paid</span>
                            <span>${transaction.amountLeft.toFixed(2)} Left</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <PiUserCircle className="text-xl" />
                            <span className="font-bold text-gray-900">Payer</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <img
                                src={transaction.payer.avatar}
                                alt={transaction.payer.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <div className="font-bold text-gray-900">{transaction.payer.name}</div>
                                <div className="text-gray-500 text-sm">{transaction.payer.email}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Summary Card */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Summary <span className="text-gray-500 font-normal text-sm">(Invoice Details)</span></h3>
                    <div className="space-y-6">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Property</div>
                            <div className="font-semibold text-gray-900">{transaction.property}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Transaction ID</div>
                            <div className="font-semibold text-gray-900">{transaction.id}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Unit</div>
                            <div className="font-semibold text-gray-900">{transaction.unit}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Type</div>
                            <div className="font-semibold text-gray-900">{transaction.type}</div>
                        </div>
                    </div>
                </div>

                {/* Payment & Activity Card */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <PiCurrencyDollar className="text-xl" />
                        Payment & Activity <span className="text-gray-500 font-normal text-sm">({transaction.activity.length} Record)</span>
                    </h3>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {transaction.activity.map((item, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg border border-gray-100 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <PiCurrencyDollar className="text-xl text-gray-700" />
                                    <span className="font-semibold text-gray-900 text-sm">{item.date}</span>
                                    <span className="bg-[#E8F7E5] text-[#34A853] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <PiCheckCircle size={12} fill="currentColor" />
                                        {item.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img src={item.user.avatar} className="w-8 h-8 rounded-full" alt="user" />
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <PiDotsThreeOutline size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Scrollbar placeholder if needed */}
                </div>

            </div>
        </div>
    );
};

export default ServiceTransactionDetail;
