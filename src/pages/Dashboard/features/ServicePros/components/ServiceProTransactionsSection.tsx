import { ChevronUp, MoreHorizontal, Trash2, Edit } from 'lucide-react';

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

interface ServiceProTransactionsSectionProps {
    servicePro: any; // Using any for now as the servicePro structure is defined in parent
}

const ServiceProTransactionsSection = ({ servicePro }: ServiceProTransactionsSectionProps) => {
    // Mock transaction data specific to service pros
    const transactions: Transaction[] = [
        {
            id: 1,
            status: 'Paid',
            dueDate: '08 Dec',
            category: 'Plumbing',
            property: 'Sunset Apartments',
            contact: servicePro.name,
            total: 12000,
            balance: 0
        },
        {
            id: 2,
            status: 'Pending',
            dueDate: '15 Dec',
            category: 'Maintenance',
            property: 'Green Valley',
            contact: servicePro.name,
            total: 5000,
            balance: 5000
        },
        {
            id: 3,
            status: 'Void',
            dueDate: '01 Dec',
            category: 'Inspection',
            property: 'City Center',
            contact: servicePro.name,
            total: 3000,
            balance: 0
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid':
                return 'text-[#7BD747]';
            case 'Pending':
                return 'text-orange-500';
            case 'Void':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div>
            {/* Table Header Container matching Equipments */}
            <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8">
                {/* Table Header Grid */}
                <div className="text-white px-6 py-4 grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_100px] gap-4 items-center text-sm font-medium">
                    <div>Status</div>
                    <div className="flex items-center gap-1 cursor-pointer">
                        Due date
                        <ChevronUp className="w-3 h-3" />
                    </div>
                    <div>Category & property</div>
                    <div>Contact</div>
                    <div className="flex items-center gap-1 cursor-pointer">
                        Total & balance
                        <ChevronUp className="w-3 h-3" />
                    </div>
                    <div className="text-right">Actions</div>
                </div>
            </div>

            {/* Table Body Container matching Equipments */}
            <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t-none">
                {transactions.map(transaction => (
                    <div
                        key={transaction.id}
                        className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_100px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                        {/* Status Column */}
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${transaction.status === 'Paid' ? 'bg-[#7BD747]' : transaction.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                            <span className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                        </div>

                        {/* Due Date Column */}
                        <div className="text-sm text-gray-700 font-medium">{transaction.dueDate}</div>

                        {/* Category & Property Column */}
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">{transaction.category}</span>
                            <span className="text-xs text-gray-500">{transaction.property}</span>
                        </div>

                        {/* Contact Column */}
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
                                {servicePro.initials}
                            </div>
                            <span className="text-sm text-gray-700 truncate">{transaction.contact}</span>
                        </div>

                        {/* Total & Balance Column */}
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">₹{transaction.total.toLocaleString()}</span>
                            {transaction.balance > 0 && (
                                <span className="text-xs text-red-500">Bal: ₹{transaction.balance.toLocaleString()}</span>
                            )}
                        </div>

                        {/* Actions Column */}
                        <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><Edit className="w-4 h-4 text-gray-400" /></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><MoreHorizontal className="w-4 h-4 text-gray-400" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceProTransactionsSection;
