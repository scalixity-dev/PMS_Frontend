import { useState } from 'react';
import { ChevronUp, MoreHorizontal, Trash2, Edit, Check } from 'lucide-react';

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
    tenantId: string;
    tenant: {
        id: number;
        name: string;
    };
}

const TenantTransactionsSection = ({ tenantId: _tenantId, tenant: _tenant }: TenantTransactionsSectionProps) => {
    // Note: There's no direct API for tenant transactions yet
    // This is a placeholder that shows empty state
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

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelectAll = () => {
        if (selectedIds.length === transactions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(transactions.map(t => t.id));
        }
    };

    const handleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(prevId => prevId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid':
                return 'text-[#7BD747]';
            case 'Void':
                return 'text-red-500';
            case 'Pending':
                return 'text-orange-500';
            default:
                return 'text-gray-500';
        }
    };

    const getInitials = (name: string): string => {
        if (!name) return '?';

        const parts = name.trim().split(/\s+/).filter(part => part.length > 0);

        if (parts.length === 0) return '?';

        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }

        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 bg-[#F0F0F6] rounded-[2rem]">
                <p className="text-gray-600">No transactions found for this tenant</p>
                <p className="text-sm text-gray-500 mt-2">Transaction data will appear here once available</p>
            </div>
        );
    }

    return (
        <div>
            {/* Table Header Container matching ServicePro */}
            <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm hidden md:block">
                {/* Table Header Grid */}
                <div className="text-white px-6 py-4 grid grid-cols-[40px_0.8fr_1fr_1fr_1fr_1fr_1fr_80px] gap-4 items-center text-sm font-medium">
                    <div className="flex items-center justify-center">
                        <div
                            onClick={handleSelectAll}
                            className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.length === transactions.length && transactions.length > 0 ? 'bg-[#7BD747] border-[#7BD747]' : 'border-gray-300 bg-white'}`}
                        >
                            {selectedIds.length === transactions.length && transactions.length > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                    </div>
                    <div>Status</div>
                    <div className="flex items-center gap-1 cursor-pointer">
                        Due date
                        <ChevronUp className="w-3 h-3" />
                    </div>
                    <div>Category</div>
                    <div>Property</div>
                    <div>Contact</div>
                    <div className="flex items-center gap-1 cursor-pointer">
                        Total & balance
                        <ChevronUp className="w-3 h-3" />
                    </div>
                    <div className="text-right">Actions</div>
                </div>
            </div>

            {/* Table Body Container matching ServicePro */}
            <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[1.5rem] sm:rounded-[2rem] rounded-t-none md:rounded-t-none">
                {transactions.map(transaction => (
                    <div
                        key={transaction.id}
                        className="bg-white rounded-2xl p-4 md:px-6 md:py-4 md:grid md:grid-cols-[40px_0.8fr_1fr_1fr_1fr_1fr_1fr_80px] md:gap-4 md:items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3"
                    >
                        {/* Mobile Header Row */}
                        <div className="flex md:hidden justify-between items-start border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3">
                                {/* Checkbox */}
                                <div
                                    onClick={(e) => { e.stopPropagation(); handleSelectOne(transaction.id); }}
                                    className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.includes(transaction.id) ? 'bg-[#7BD747] border-[#7BD747]' : 'border-gray-200 bg-gray-50'}`}
                                >
                                    {selectedIds.includes(transaction.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${transaction.status === 'Paid' ? 'bg-[#7BD747]' : transaction.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                                </div>
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><Edit className="w-4 h-4 text-gray-400" /></button>
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><MoreHorizontal className="w-4 h-4 text-gray-400" /></button>
                            </div>
                        </div>

                        {/* Mobile Content Body */}
                        <div className="flex md:hidden flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Category</span>
                                <span className="text-sm font-semibold text-gray-900">{transaction.category}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Due Date</span>
                                <span className="text-sm text-gray-700 font-medium">{transaction.dueDate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Property</span>
                                <span className="text-sm text-gray-500">{transaction.property}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Total</span>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-gray-900">₹{transaction.total.toLocaleString()}</span>
                                    {transaction.balance > 0 && (
                                        <span className="text-xs text-red-500">Bal: ₹{transaction.balance.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Contact</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 font-medium flex-shrink-0">
                                        {getInitials(transaction.contact)}
                                    </div>
                                    <span className="text-sm text-gray-700 truncate max-w-[120px]">{transaction.contact}</span>
                                </div>
                            </div>
                        </div>


                        {/* Desktop View Columns */}
                        <div className="hidden md:flex items-center justify-center">
                            <div
                                onClick={(e) => { e.stopPropagation(); handleSelectOne(transaction.id); }}
                                className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.includes(transaction.id) ? 'bg-[#7BD747] border-[#7BD747]' : 'border-gray-200 bg-gray-50'}`}
                            >
                                {selectedIds.includes(transaction.id) && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${transaction.status === 'Paid' ? 'bg-[#7BD747]' : transaction.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                            <span className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                        </div>

                        <div className="hidden md:block text-sm text-gray-700 font-medium">{transaction.dueDate}</div>
                        <div className="hidden md:block text-sm font-semibold text-gray-900">{transaction.category}</div>
                        <div className="hidden md:block text-sm text-gray-500">{transaction.property}</div>
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
                                {getInitials(transaction.contact)}
                            </div>
                            <span className="text-sm text-gray-700 truncate">{transaction.contact}</span>
                        </div>
                        <div className="hidden md:flex flex-col">
                            <span className="text-sm font-bold text-gray-900">₹{transaction.total.toLocaleString()}</span>
                            {transaction.balance > 0 && (
                                <span className="text-xs text-red-500">Bal: ₹{transaction.balance.toLocaleString()}</span>
                            )}
                        </div>
                        <div className="hidden md:flex items-center justify-end gap-2">
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

export default TenantTransactionsSection;

