import type { Lease } from "../types";

export const LeaseCard = ({ lease }: { lease: Lease }) => {
    return (
        <div className="bg-white rounded-[1.25rem] p-6 mb-4 flex items-center justify-between shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-gray-100/50 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">Lease #{lease.number}</h3>
                <p className="text-[#9BA3AF] text-base font-medium">
                    {lease.startDate} - {lease.endDate}
                </p>
            </div>

            <div className="flex items-center gap-16">
                {/* Status Pill */}
                <div className="bg-[#E9FBE7] text-[#4CD964] px-5 py-2 rounded-xl flex items-center gap-2.5 font-bold text-base">
                    <div className="w-3 h-3 rounded-full bg-[#4CD964]"></div>
                    {lease.status}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white shadow-sm">
                    <img
                        src={lease.landlordAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                        alt="Landlord"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* View Button */}
                <button className="text-[#8CD74B] font-bold text-lg hover:underline pr-4">
                    View
                </button>
            </div>
        </div>
    );
};
