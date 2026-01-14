import { RefreshCw } from "lucide-react";
import type { Transaction } from "../../../utils/types";
import { StatusPill } from "@/pages/userdashboard/features/Leases/components/StatusPill";
import { formatMoney } from "../../../../../utils/currency.utils";

interface TransactionCardProps {
    transaction: Transaction;
    onClick?: () => void;
}

export const TransactionCard = ({ transaction, onClick }: TransactionCardProps) => {
    const { status, dueDate, category, contact, amount, currency } = transaction;

    const totalAmount = Math.abs(amount);

    let paidAmount = 0;
    if (status === 'Paid') {
        paidAmount = totalAmount;
    } else if (status === 'Partial') {
        paidAmount = transaction.paidAmount ?? 0;
    }

    const outstandingAmount = Math.max(0, totalAmount - paidAmount);
    const isRecurring = transaction.schedule === "Monthly";

    return (
        <div
            onClick={onClick}
            className="group relative bg-white p-5 rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:border-[var(--dashboard-accent)] transition-all duration-300 cursor-pointer space-y-5"
        >
            {/* Header: Status and Amount */}
            <div className="flex justify-between items-start">
                <StatusPill status={status} />
                <div className="text-right">
                    <div className="text-[var(--dashboard-text-main)] font-semibold text-lg tracking-tight">
                        {amount < 0 ? '-' : ''} {formatMoney(totalAmount, currency)}
                    </div>
                    {outstandingAmount > 0 && (
                        <div className="text-[#FF2D55] font-medium text-xs mt-1">
                            Outstanding: {formatMoney(outstandingAmount, currency)}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-2">
                {/* Due Date */}
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Due Date</span>
                    <span className="text-[var(--dashboard-text-main)] font-semibold text-sm">
                        {dueDate}
                    </span>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Category</span>
                    <div className="flex items-center gap-1.5 text-[var(--dashboard-text-main)] font-semibold text-sm">
                        <span className="truncate">{category}</span>
                        {isRecurring && (
                            <RefreshCw size={12} className="text-gray-400 shrink-0" aria-label="Recurring transaction" />
                        )}
                    </div>
                </div>

                {/* Contact (Full Width) */}
                <div className="col-span-2 flex flex-col gap-2 pt-2 border-t border-dashed border-gray-100 mt-1">
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Contact</span>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50/50 group-hover:bg-gray-50 transition-colors">
                        <div
                            className="w-8 h-8 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm"
                            style={{ backgroundColor: contact.avatarColor }}
                        >
                            {contact.initials}
                        </div>
                        <span className="text-[var(--dashboard-secondary)] font-semibold text-sm">
                            {contact.name}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
