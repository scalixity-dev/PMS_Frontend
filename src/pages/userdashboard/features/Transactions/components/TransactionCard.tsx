import { RefreshCw } from "lucide-react";
import type { Transaction } from "../../../utils/types";
import { StatusPill } from "@/pages/userdashboard/features/Leases/components/StatusPill";
import { formatMoney } from "../../../../../utils/currency.utils";

interface TransactionCardProps {
    transaction: Transaction;
    onClick?: () => void;
    isInsideContainer?: boolean;
}

export const TransactionCard = ({ transaction, onClick, isInsideContainer }: TransactionCardProps) => {
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
            className={`${isInsideContainer ? 'bg-white p-6' : 'bg-white rounded-[1rem] p-4 shadow-sm border border-gray-100'} flex flex-col gap-4 hover:bg-gray-50/50 transition-all cursor-pointer`}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-sm"
                        style={{ backgroundColor: contact.avatarColor }}
                    >
                        {contact.initials}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[var(--dashboard-secondary)] font-bold text-sm">
                            {contact.name}
                        </span>
                        <span className="text-gray-400 text-xs font-medium">
                            {dueDate}
                        </span>
                    </div>
                </div>
                <StatusPill status={status} />
            </div>

            <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[var(--dashboard-text-main)] font-semibold text-sm">
                        {category}
                        {isRecurring && <RefreshCw size={14} className="text-gray-400" />}
                    </div>
                    <span className="text-gray-400 text-xs tracking-wider">{currency}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[var(--dashboard-text-main)] font-bold text-lg">
                        {amount < 0 ? '-' : ''} {formatMoney(totalAmount, currency)}
                    </span>
                    <span className={`${outstandingAmount > 0 ? 'text-[#FF2D55]' : 'text-gray-400'} font-semibold text-[10px]`}>
                        {outstandingAmount > 0 ? `Outstanding: ${formatMoney(outstandingAmount, currency)}` : 'Fully Paid'}
                    </span>
                </div>
            </div>
        </div>
    );
};
