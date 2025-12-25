import { PiCaretDownBold } from "react-icons/pi";
import type { Transaction } from "../types";
import { TransactionRow } from "./TransactionRow";

interface TransactionTableProps {
    transactions: Transaction[];
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
    return (
        <div className="bg-white rounded-[1rem] overflow-hidden shadow-[0px_4px_4px_0px_#00000040] border border-gray-200 flex flex-col">
            {/* Table Header */}
            <div className="bg-[#8CD74B] flex justify-between px-4 py-3">
                <span className="text-white font-normal text-lg flex-[1.2]">Status</span>
                <span className="text-white font-normal text-lg flex-1 text-center">Due Date</span>
                <span className="text-white font-normal text-lg flex-1 text-center">Category</span>
                <span className="text-white font-normal text-lg flex-[2] text-center">Contact</span>
                <span className="text-white font-normal text-lg flex-[1.5] text-right">Total</span>
            </div>

            {/* Filter Section */}
            <div className="px-4 py-3 border-b border-gray-200">
                <div className="relative inline-block">
                    <button className="flex items-center justify-between gap-3 px-6 py-2.5 bg-white border border-gray-200 rounded-md text-gray-400 font-medium text-sm hover:border-[#8CD74B] transition-all min-w-[180px]">
                        All Time
                        <PiCaretDownBold className="text-xs" />
                    </button>
                </div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col">
                {transactions.map((transaction, index) => (
                    <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        isLast={index === transactions.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};
