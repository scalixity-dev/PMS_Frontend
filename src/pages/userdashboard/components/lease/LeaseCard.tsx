import type { Lease } from "../../utils/types";
import { StatusPill } from "./StatusPill";

export const LeaseCard = ({ lease }: { lease: Lease }) => {
    return (
        <div className="bg-[#F7F7F7] rounded-[1.25rem] p-5 flex items-center justify-between shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#F1F1F1] hover:shadow-lg transition-all duration-300 w-full">
            <div className="flex flex-col gap-1.5">
                <h3 className="text-[22px] font-medium text-[#1A1A1A]">Lease #{lease.number}</h3>
                <p className="text-[#4B5563] text-[15px] font-medium leading-none">
                    {lease.startDate} - {lease.endDate}
                </p>
            </div>

            <div className="flex items-center gap-12">
                {/* Status Pill */}
                <StatusPill status={lease.status} />

                {/* Avatar */}
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img
                        src={lease.landlordAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                        alt="Landlord"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* View Button */}
                <button className="text-[var(--dashboard-accent)] font-semibold text-base hover:opacity-80 transition-opacity pl-4 pr-2">
                    View
                </button>
            </div>
        </div>
    );
};
