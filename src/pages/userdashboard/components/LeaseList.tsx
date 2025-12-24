import type { Lease } from "../types";
import { LeaseCard } from "./LeaseCard";

interface LeaseListProps {
    leases: Lease[];
}

export const LeaseList = ({ leases }: LeaseListProps) => {
    return (
        <div className="flex flex-col gap-2">
            {leases.map((lease) => (
                <LeaseCard key={lease.id} lease={lease} />
            ))}
        </div>
    );
};
