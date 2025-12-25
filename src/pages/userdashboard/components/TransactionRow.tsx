import type { Transaction } from "../types";
import { StatusPill } from "./StatusPill";

interface TransactionRowProps {
    transaction: Transaction;
    isLast?: boolean;
}

export const TransactionRow = ({ transaction, isLast }: TransactionRowProps) => {
    const { status, dueDate, category, contact, amount, currency } = transaction;

    return (
        <div className={`flex items-center px-4 py-4 ${!isLast ? 'border-b border-gray-100' : ''} hover:bg-gray-50/30 transition-all`}>
            <div className="flex-[1.2]">
                <StatusPill status={status} />
            </div>
            <div className="flex-1 text-center text-[#1A1A1A] font-bold text-sm">{dueDate}</div>
            <div className="flex-1 text-center text-[#1A1A1A] font-bold text-sm">{category}</div>
            <div className="flex-[2] flex justify-center items-center gap-2">
                <div
                    className="w-7 h-7 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: contact.avatarColor }}
                >
                    {contact.initials}
                </div>
                <span className="text-[#4D7E7D] font-bold text-sm hover:underline cursor-pointer">
                    {contact.name}
                </span>
            </div>
            <div className="flex-[1.5] flex justify-end items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-[#1A1A1A] font-bold text-base">
                        {amount < 0 ? '-' : ''} ₹{Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[#FF2D55] font-bold text-xs">
                        ₹{Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <span className="text-gray-400 font-bold text-xs tracking-widest min-w-[30px]">{currency}</span>
            </div>
        </div>
    );
};
