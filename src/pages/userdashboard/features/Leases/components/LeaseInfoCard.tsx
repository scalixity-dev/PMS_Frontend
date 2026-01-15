import type { LucideIcon } from 'lucide-react';

interface LeaseInfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    className?: string;
}

export const LeaseInfoCard = ({ icon: Icon, label, value, className = "" }: LeaseInfoCardProps) => {
    return (
        <div className={`bg-[#FFFFFE] p-5 pr-10 rounded-2xl shadow-[0px_2px_4px_0px_#00000026] border border-gray-100 flex items-start gap-4 w-full md:w-auto md:min-w-[240px] ${className}`}>
            <div className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                <Icon className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[13px] font-medium text-gray-500">{label}</p>
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{value}</h3>
            </div>
        </div>
    );
};
