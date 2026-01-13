import type { Lease } from "../../../utils/types";
import { StatusPill } from "./StatusPill";
import { useNavigate } from "react-router-dom";

export const LeaseCard = ({ lease }: { lease: Lease }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-[#F7F7F7] rounded-[1.25rem] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#F1F1F1] transition-all duration-300 w-full gap-4 sm:gap-0">
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                <h3 className="text-xl sm:text-[22px] font-medium text-[#1A1A1A]">Lease #{lease.number}</h3>
                <p className="text-[#4B5563] text-sm sm:text-[15px] font-medium leading-none">
                    {lease.startDate} - {lease.endDate}
                </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                {/* Status Pill */}
                <StatusPill status={lease.status} />

                <div className="flex items-center gap-4 sm:gap-12">
                    {/* Avatar */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lease.landlord.avatarSeed || 'Felix'}`}
                            alt={lease.landlord.name || "Landlord"}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* View Button */}
                    <button
                        onClick={() => navigate(`/userdashboard/leases/${lease.id}`)}
                        className="text-[var(--dashboard-accent)] font-medium text-sm sm:text-base hover:opacity-80 transition-opacity pl-2 sm:pl-4 pr-1 sm:pr-2"
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};
