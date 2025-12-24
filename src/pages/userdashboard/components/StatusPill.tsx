import type { Transaction } from "../types";

export const StatusPill = ({ status }: { status: Transaction['status'] }) => {
    const styles = {
        Open: "bg-[#B8BDC9] text-white",
        Overdue: "bg-[#FFEBEC] text-[#FF2D55]",
        Paid: "bg-[#8CD74B] text-white", // Added Paid from conversation history
    };

    const dotStyles = {
        Open: "bg-[#757E94]",
        Overdue: "bg-[#FF2D55]",
        Paid: "bg-[#52D3A2]", // Color from previous conversation
    };

    return (
        <span className={`inline-flex items-center gap-2.5 px-4 py-2 ${styles[status]} text-xs font-bold rounded-lg shadow-sm`}>
            <div className={`w-2 h-2 rounded-full ${dotStyles[status]} border-2 border-white/20`}></div>
            {status}
        </span>
    );
};
