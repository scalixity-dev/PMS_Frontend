import { RefreshCw } from "lucide-react";
import type { Transaction } from "../../../utils/types";
import { StatusPill } from "@/pages/userdashboard/features/Leases/components/StatusPill";
import { formatMoney } from "../../../../../utils/currency.utils";

interface TransactionRowProps {
    transaction: Transaction;
    isLast?: boolean;
    onClick?: () => void;
}

export const TransactionRow = ({ transaction, isLast, onClick }: TransactionRowProps) => {
    const { status, dueDate, category, contact, amount, currency } = transaction;

    const totalAmount = Math.abs(amount);

    let paidAmount = 0;
    if (status === 'Paid') {
        paidAmount = totalAmount;
    } else if (status === 'Partial') {
        // Enforce using provided paidAmount only for Partial status
        paidAmount = transaction.paidAmount ?? 0;
    }
    // For 'Open', 'Overdue', and others, paidAmount stays 0

    const outstandingAmount = Math.max(0, totalAmount - paidAmount);

    // Determine if the transaction is recurring
    const isRecurring = ["Rent", "Utility Bill"].includes(category) || category.includes("Monthly");

    return (
        <div
            onClick={onClick}
            className={`flex items-center px-8 py-3 ${!isLast ? 'border-b border-gray-100' : ''} hover:bg-gray-50/30 transition-all cursor-pointer`}
        >
            <div className="flex-[1.2]">
                <StatusPill status={status} />
            </div>
            <div className="flex-1 text-center text-[var(--dashboard-text-main)] font-semibold text-sm">{dueDate}</div>
            <div className="flex-1 flex items-center justify-center gap-1.5 text-[var(--dashboard-text-main)] font-semibold text-sm">
                {category}
                {isRecurring && (
                    <div className="relative group flex items-center">
                        <RefreshCw size={14} className="text-gray-400 " />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-sm">
                            Recurring transaction
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-[2] flex justify-center items-center gap-2">
                <div
                    className="w-7 h-7 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: contact.avatarColor }}
                >
                    {contact.initials}
                </div>
                <span className="text-[var(--dashboard-secondary)] font-bold text-sm hover:underline cursor-pointer">
                    {contact.name}
                </span>
            </div>
            <div className="flex-[1.5] flex justify-end items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-[var(--dashboard-text-main)] font-medium text-base">
                        {amount < 0 ? '-' : ''} {formatMoney(totalAmount, currency)}
                    </span>
                    <span className={`${outstandingAmount > 0 ? 'text-[#FF2D55]' : 'text-gray-400'} font-semibold text-xs`}>
                        {formatMoney(outstandingAmount, currency)}
                    </span>
                </div>
                <span className="text-gray-400 font-semibold text-xs tracking-widest min-w-[30px]">{currency}</span>
            </div>
        </div>
    );
};
