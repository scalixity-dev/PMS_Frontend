import profilePic from "../../../../assets/images/generated_profile_avatar.png";
import { Link } from "react-router-dom";
import { useDashboardStore } from "../../store/dashboardStore";
import { useAuthStore } from "../../features/Profile/store/authStore";
import { mockTransactions } from "../../utils/mockData";

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

export const Sidebar = () => {
    const { finances } = useDashboardStore();
    const { userInfo } = useAuthStore();
    const userName = `${userInfo.firstName} ${userInfo.lastName}`;
    const userEmail = userInfo.email;
    const { deposits, credits } = finances;

    // Calculate outstanding amount dynamically from transactions to match Rent page
    const outstandingAmount = mockTransactions
        .filter((t) => t.status === "Open" || t.status === "Overdue")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Use calculated outstanding instead of store value which might be stale/0
    const outstanding = outstandingAmount.toFixed(2);
    const roommateAvatar = undefined;
    return (
        <div className="w-full lg:w-64 flex flex-col gap-4">
            {/* Profile Card */}
            <div className="bg-[var(--dashboard-bg-light)] rounded-[1rem] p-3 flex flex-col items-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-50">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-200 via-pink-200 to-orange-300 flex items-center justify-center overflow-hidden transition-transform hover:scale-105 cursor-pointer shadow-lg mb-6 group relative">
                    <div className="w-full h-full flex items-center justify-center relative bg-[#F4D1AE]">
                        <img
                            src={userInfo.profileImage || profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `
                                    <svg width="100%" height="100%" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute">
                                        <circle cx="35" cy="28" r="12" fill="#F4D1AE" />
                                        <path d="M35 16C28 16 23 20 23 26C23 28 24 30 25 31C25 25 28 20 35 20C42 20 45 25 45 31C46 30 47 28 47 26C47 20 42 16 35 16Z" fill="#2D3748" />
                                        <path d="M30 32Q35 36 40 32" stroke="#4A5568" stroke-width="2" stroke-linecap="round" fill="none" />
                                        <circle cx="31" cy="26" r="1.5" fill="#4A5568" />
                                        <circle cx="39" cy="26" r="1.5" fill="#4A5568" />
                                        <path d="M25 35C25 40 30 45 35 45C40 45 45 40 45 35L45 50C45 55 40 60 35 60C30 60 25 55 25 50Z" fill="#87CEEB" />
                                    </svg>
                                `;
                            }}
                        />
                    </div>
                </div>
                <h2 className="text-3xl font-medium text-[var(--dashboard-text-main)] mb-1">{userName}</h2>
                <p className="text-gray-500 text-sm font-normal">{userEmail}</p>
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
                <span className="text-[var(--dashboard-text-main)] font-medium text-lg">Rental Profile</span>
                <Link to="/userdashboard/settings/public-renter-profile" className="text-[var(--dashboard-accent)] font-semibold hover:underline">View</Link>
            </div>
        </div>
    );
};
