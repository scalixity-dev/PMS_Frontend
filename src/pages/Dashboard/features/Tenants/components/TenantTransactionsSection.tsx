import { CheckCircle2, MoreHorizontal, Trash2, Edit } from 'lucide-react';

interface Transaction {
    id: number;
    status: 'Paid' | 'Void' | 'Pending';
    dueDate: string;
    category: string;
    property: string;
    contact: string;
    total: number;
    balance: number;
}

interface TenantTransactionsSectionProps {
    tenant: {
        id: number;
        name: string;
    };
}

const TenantTransactionsSection = ({ tenant }: TenantTransactionsSectionProps) => {
    // Mock transaction data
    const transactions: Transaction[] = [
        {
            id: 1,
            status: 'Paid',
            dueDate: '08 Dec',
            category: 'Deposit',
            property: 'ABC',
            contact: 'Anjali Vyas',
            total: 690000,
            balance: 50000
        },
        {
            id: 2,
            status: 'Void',
            dueDate: '08 Dec',
            category: 'Deposit',
            property: 'ABC',
            contact: 'Anjali Vyas',
            total: 690000,
            balance: 50000
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid':
                return 'text-[#7BD747]';
            case 'Void':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="bg-white rounded-[1rem] shadow-lg overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="bg-[#3A6D6C] text-white">
                        <th className="px-4 py-3 text-left text-xs font-semibold">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Status
                            </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Due date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Property</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Balance</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
                    </tr>
                </thead>
            </table>
            <div className="p-2 space-y-3">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="bg-white rounded-[1rem] p-2 my-2 shadow-inner border border-gray-200 transition-shadow"
                    >
                        <div className="grid grid-cols-8 gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className={`w-5 h-5 ${getStatusColor(transaction.status)}`} />
                                <span className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                                    {transaction.status}
                                </span>
                            </div>
                            <span className="text-sm text-gray-700">{transaction.dueDate}</span>
                            <span className="text-sm text-gray-700">{transaction.category}</span>
                            <span className="text-sm text-gray-700">{transaction.property}</span>
                            <span className="text-sm text-gray-700">{transaction.contact}</span>
                            <span className="text-sm font-semibold text-[#7BD747]">
                                +₹{transaction.total.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-700">
                                ₹{transaction.balance.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                    <Edit className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TenantTransactionsSection;

