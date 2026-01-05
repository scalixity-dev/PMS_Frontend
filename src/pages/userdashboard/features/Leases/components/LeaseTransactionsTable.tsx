import { useNavigate } from "react-router-dom";
import { StatusPill } from "./StatusPill";

/**
 * Transaction Interface for type safety
 */
interface LeaseTransaction {
    id: string;
    status: "Active" | "Pending" | "Overdue" | "Open" | "New" | "Critical" | "Normal" | "Expired";
    firstInvoice: string;
    category: string;
    nextInvoice: string;
    amount: number;
    currency: string;
}

/**
 * Utility to format currency
 */
const formatCurrency = (amount: number) => {
    return Math.abs(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

/**
 * LeaseTransactionsTable
 * A table component styled to match the main UserDashboard's TransactionTable style.
 */
export const LeaseTransactionsTable = () => {
    const navigate = useNavigate();
    // Mock data based on the provided image
    const transactions: LeaseTransaction[] = [
        {
            id: "1",
            status: "Active",
            firstInvoice: "17 Dec",
            category: "Rent",
            nextInvoice: "17 Dec",
            amount: -2611.00,
            currency: "INR"
        }
    ];

    return (
        <div className="bg-white rounded-[1rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 flex flex-col mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Table Header */}
            <div className="bg-[var(--dashboard-accent)] flex justify-between px-10 py-3 rounded-t-[1rem]">
                <span className="text-white font-normal text-lg flex-1">Status</span>
                <span className="text-white font-normal text-lg flex-1 text-center">First Invoice</span>
                <span className="text-white font-normal text-lg flex-1 text-center">Category</span>
                <span className="text-white font-normal text-lg flex-1 text-center">Next Invoice</span>
                <span className="text-white font-normal text-lg flex-[1.5] text-right">Total</span>
            </div>

            {/* Table Body */}
            <div className="flex flex-col">
                {transactions.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(`/userdashboard/transactions/${item.id}`)}
                        className={`flex items-center px-8 py-6 ${index !== transactions.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50/30 transition-all cursor-pointer`}
                    >
                        <div className="flex-1">
                            <StatusPill status={item.status} />
                        </div>
                        <div className="flex-1 text-center text-[var(--dashboard-text-main)] font-semibold text-sm">
                            {item.firstInvoice}
                        </div>
                        <div className="flex-1 text-center text-[var(--dashboard-text-main)] font-semibold text-sm">
                            {item.category}
                        </div>
                        <div className="flex-1 text-center text-[var(--dashboard-text-main)] font-semibold text-sm">
                            {item.nextInvoice}
                        </div>
                        <div className="flex-[1.5] flex justify-end items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[var(--dashboard-text-main)] font-medium text-base">
                                    {item.amount < 0 ? '-' : ''} ₹{formatCurrency(item.amount)}
                                </span>
                                <span className="text-[#FF2D55] font-semibold text-xs">
                                    ₹{formatCurrency(item.amount)}
                                </span>
                            </div>
                            <span className="text-gray-400 font-bold text-xs tracking-widest min-w-[30px]">{item.currency}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
