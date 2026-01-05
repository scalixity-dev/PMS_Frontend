import type { Transaction, Lease } from "../../utils/types";

type StatusType = Transaction['status'] | Lease['status'];

export const StatusPill = ({ status }: { status: StatusType }) => {
    const styles: Record<StatusType, string> = {
        Open: "bg-[var(--status-open-bg)]/40 text-[var(--status-open-text)]",
        Overdue: "bg-[var(--status-overdue-bg)]/40 text-[var(--status-overdue-text)]",
        Active: "bg-[var(--status-active-bg)]/40 text-[var(--status-active-text)]",
        New: "bg-transparent text-[var(--status-new-text)]",
        Critical: "bg-[var(--status-critical-bg)]/40 text-white",
        Normal: "bg-[var(--status-normal-bg)]/40 text-white",
        Expired: "bg-[var(--status-expired-bg)]/40 text-[var(--status-expired-text)]",
        Pending: "bg-[var(--status-pending-bg)]/40 text-[var(--status-pending-text)]",
    };

    const dotStyles: Record<StatusType, string> = {
        Open: "bg-[var(--status-open-text)]",
        Overdue: "bg-[var(--status-overdue-text)]",
        Active: "bg-[var(--status-active-text)]",
        New: "bg-[var(--status-new-text)]",
        Critical: "bg-white",
        Normal: "bg-white",
        Expired: "bg-[var(--status-expired-text)]",
        Pending: "bg-[var(--status-pending-text)]",
    };

    return (
        <span className={`inline-flex items-center gap-2.5 px-3 py-1.5 ${styles[status]} text-xs font-bold rounded-md shadow-sm`}>
            <div className={`w-2 h-2 rounded-full ${dotStyles[status]}`}></div>
            {status}
        </span>
    );
};
