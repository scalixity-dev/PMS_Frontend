import { PiUserCircleFill } from "react-icons/pi";

interface SidebarProps {
    userName: string;
    userEmail: string;
    outstanding: string;
    deposits: string;
    credits: string;
    roommateAvatar?: string;
}

const FinancialCard = ({ title, amount, currency, action }: { title: string; amount: string; currency: string; action?: string }) => (
    <div className="bg-white rounded-lg px-3 py-1 shadow-sm border border-gray-50">
        <div className="flex justify-between items-start mb-1">
            <span className="text-[#4B5563] text-sm font-semibold tracking-wide">{title}</span>
            {action && (
                <button className="text-[11px] text-gray-400 font-bold hover:text-[var(--dashboard-accent)] uppercase tracking-tighter">
                    {action}
                </button>
            )}
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-medium text-[var(--dashboard-text-main)]">{amount}</span>
            <span className="text-2xl font-medium text-[var(--dashboard-text-main)]">{currency}</span>
        </div>
    </div>
);

export const Sidebar = ({ userName, userEmail, outstanding, deposits, credits, roommateAvatar }: SidebarProps) => {
    return (
        <div className="w-full lg:w-60 flex flex-col gap-4">
            {/* Profile Card */}
            <div className="bg-[var(--dashboard-bg-light)] rounded-[1rem] p-3 flex flex-col items-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-50">
                <div className="w-20 h-20 bg-[var(--dashboard-text-main)] rounded-full flex items-center justify-center mb-6 transition-transform hover:scale-105 cursor-pointer shadow-lg">
                    <PiUserCircleFill className="text-white text-7xl" />
                </div>
                <h2 className="text-3xl font-medium text-[var(--dashboard-text-main)] mb-1">{userName}</h2>
                <p className="text-gray-500 text-sm font-medium">{userEmail}</p>
            </div>

            {/* Info Cards Container */}
            <div className="bg-[var(--dashboard-bg-light)] rounded-[1rem] p-4 flex flex-col gap-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-50">
                <FinancialCard title="Outstanding" amount={outstanding} currency="INR" action="Pay online" />
                <FinancialCard title="Deposits" amount={deposits} currency="INR" />
                <FinancialCard title="Credits" amount={credits} currency="INR" />

                {/* Roommates Card */}
                <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-50">
                    <p className="text-[#4B5563] text-sm font-semibold tracking-wide mb-3">Roommates</p>
                    <div className="w-12 h-12 bg-[#D1E9FF] rounded-full flex items-center justify-center border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer overflow-hidden">
                        <img
                            src={roommateAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"}
                            alt="roommate"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Rental Profile Card */}
            <div className="bg-[var(--dashboard-bg-light)] rounded-[1rem] p-4 flex justify-between items-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-50 hover:border-[var(--dashboard-accent)]/30 transition-colors group">
                <span className="text-[var(--dashboard-text-main)] font-bold text-lg">Rental Profile</span>
                <button className="text-[var(--dashboard-accent)] font-bold hover:underline">View</button>
            </div>
        </div>
    );
};
