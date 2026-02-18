import type { TenantSummary } from "../../../utils/types";

interface TenantCardProps {
    tenant: TenantSummary;
}

export const TenantCard = ({ tenant }: TenantCardProps) => {
    return (
        <div className="bg-[#F7F7F7] p-6 rounded-2xl border border-[#F3F4F6] flex items-center gap-5 w-full md:w-auto md:min-w-[340px] shadow-[0px_4px_4px_0px_#00000040]">
            <div className="relative">
                <div className="w-14 h-14 rounded-full bg-[#E4F2E2] text-[#2E6819] flex items-center justify-center font-bold text-lg shadow-inner">
                    {tenant.firstName?.[0]}{tenant.lastName?.[0]}
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#7ED957] border-2 border-white rounded-full"></div>
            </div>

            <div className="flex flex-col gap-0.5">
                <h4 className="text-[17px] font-semibold text-[#1A1A1A]">{tenant.firstName} {tenant.lastName}</h4>
                <p className="text-[13px] text-gray-500 font-medium">{tenant.phone}</p>
                <p className="text-[13px] text-gray-400">{tenant.email}</p>
            </div>
        </div>
    );
};
