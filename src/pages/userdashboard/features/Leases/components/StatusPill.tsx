import type { Transaction, Lease } from "../../../utils/types";

type StatusType = Transaction['status'] | Lease['status'];

export const StatusPill = ({ status }: { status: StatusType }) => {
    const styles: Record<StatusType, string> = {
        Open: "bg-[var(--status-open-bg)]/40 text-[var(--status-open-text)]",
        Overdue: "bg-[var(--status-overdue-bg)]/40 text-[var(--status-overdue-text)]",
        Active: "bg-[var(--status-active-bg)]/40 text-[var(--status-active-text)]",

        Expired: "bg-[var(--status-expired-bg)]/40 text-[var(--status-expired-text)]",
        Pending: "bg-[var(--status-pending-bg)]/40 text-[var(--status-pending-text)]",
        Paid: "bg-[var(--status-active-bg)]/40 text-[var(--status-active-text)]",
        Partial: "bg-yellow-100 text-yellow-700",
    };


    return (
        <span className={`inline-flex items-center px-3 py-1 ${styles[status]} text-xs font-semibold rounded-full`}>
            {status}
        </span>
    );
};
