import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';
import ServiceFilters from '../../../components/ServiceFilters';

import { mockTransactions } from './mockData';

const ServiceAccounting = () => {
    // Mock Data
    const [transactions] = useState(mockTransactions);

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [scheduleFilter, setScheduleFilter] = useState('All');

    // Filter Logic Placeholder
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filteredTransactions = transactions.filter(t => {
        return (
            (searchTerm === '' || t.category.includes(searchTerm)) &&
            (dateFilter === 'All') &&
            (statusFilter === 'All' || t.status === statusFilter) &&
            (scheduleFilter === 'All' || t.category === scheduleFilter) // assuming schedule maps to category for now
        );
    });


    const outstanding = transactions
        .filter(t => t.status === 'Unpaid' || t.status === 'Overdue')
        .reduce((acc, t) => acc + parseFloat(t.total.replace(/,/g, '').replace(' INR', '')), 0)
        .toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div>
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Accounting', active: true }
                ]}
            />

            {/* Stats Card */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Accounting</h1>
                    <span className="text-gray-500 text-sm">Total {transactions.length}</span>
                </div>

                <hr className="border-gray-200 mb-4" />

                <div>
                    <h2 className="text-gray-500 text-sm font-medium mb-1">Outstanding</h2>
                    <div className="text-xl font-bold text-gray-800">{outstanding} INR</div>
                </div>
            </div>

            {/* Filters */}
            <ServiceFilters
                onSearch={setSearchTerm}

                // + Date
                currentProperty={dateFilter}
                onPropertyChange={setDateFilter}
                propertyLabel="Date"
                propertyOptions={['All', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month']}

                // + Transaction Status
                currentStatus={statusFilter}
                onStatusChange={setStatusFilter}
                statusLabel="Trans. Status"
                statusOptions={['All', 'Paid', 'Unpaid', 'Pending', 'Overdue']}

                // + Transaction schedule
                currentCategory={scheduleFilter}
                onCategoryChange={setScheduleFilter}
                categoryLabel="Trans. schedule"
                categoryOptions={['All', 'One-time', 'Recurring']}
            />

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-[#7BE156] text-white">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold">Status</th>
                            <th className="px-6 py-4 text-left font-semibold">Due Date</th>
                            <th className="px-6 py-4 text-left font-semibold">Category</th>
                            <th className="px-6 py-4 text-left font-semibold">Contact</th>
                            <th className="px-6 py-4 text-left font-semibold">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => navigate(`/service-dashboard/accounting/transaction/${transaction.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 font-medium text-sm ${transaction.status === 'Paid' ? 'text-green-600' :
                                            transaction.status === 'Overdue' ? 'text-red-500' :
                                                transaction.status === 'Pending' ? 'text-blue-500' :
                                                    'text-yellow-600' // Unpaid
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full ${transaction.status === 'Paid' ? 'bg-green-600' :
                                                transaction.status === 'Overdue' ? 'bg-red-500' :
                                                    transaction.status === 'Pending' ? 'bg-blue-500' :
                                                        'bg-yellow-600'
                                                }`}></span>
                                            {transaction.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.dueDate}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.contact}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{transaction.total}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="bg-gray-50 h-64 text-center text-gray-500">
                                    {/* Empty State */}
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ServiceAccounting;
