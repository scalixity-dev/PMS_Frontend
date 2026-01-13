import type { Lease } from "../../../utils/types";
import { LeaseCard } from "./LeaseCard";

interface LeaseListProps {
    leases: Lease[];
}

export const LeaseList = ({ leases }: LeaseListProps) => {
    return (
        <div className="grid grid-cols-1 lg:flex lg:flex-col gap-6">
            {leases.map((lease) => (
                <LeaseCard key={lease.id} lease={lease} />
            ))}
        </div>
    );
};
