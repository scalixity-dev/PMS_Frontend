import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface SettingLink {
    label: string;
    path: string;
}

interface SettingCardData {
    title: string;
    description: string;
    icon: React.ReactNode;
    links?: SettingLink[];
    link?: string;
}

const SETTING_CARDS: SettingCardData[] = [
    {
        title: "Account settings",
        description: "Lets you control and update account information and enable other products.",
        icon: (
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                <svg width="36" height="36" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Account settings icon" className="w-9 h-9 sm:w-11 sm:h-11">
                    <path d="M28 4C24.8483 4 21.7274 4.62078 18.8156 5.82689C15.9038 7.033 13.258 8.80083 11.0294 11.0294C8.80083 13.258 7.033 15.9038 5.82689 18.8156C4.62078 21.7274 4 24.8483 4 28C4 31.1517 4.62078 34.2726 5.82689 37.1844C7.033 40.0962 8.80083 42.742 11.0294 44.9706C13.258 47.1992 15.9038 48.967 18.8156 50.1731C21.7274 51.3792 24.8483 52 28 52C34.3652 52 40.4697 49.4714 44.9706 44.9706C49.4714 40.4697 52 34.3652 52 28C52 21.6348 49.4714 15.5303 44.9706 11.0294C40.4697 6.52856 34.3652 4 28 4ZM0 28C0 20.5739 2.94999 13.452 8.20101 8.20101C13.452 2.94999 20.5739 0 28 0C35.4261 0 42.548 2.94999 47.799 8.20101C53.05 13.452 56 20.5739 56 28C56 35.4261 53.05 42.548 47.799 47.799C42.548 53.05 35.4261 56 28 56C20.5739 56 13.452 53.05 8.20101 47.799C2.94999 42.548 0 35.4261 0 28ZM28 45C35.732 45 42 40.144 42 32.856C42 30.172 39.824 28 37.144 28H18.86C16.176 28 14.004 30.176 14.004 32.856C14.004 40.14 20.272 45 28.004 45H28ZM28 25C28.9847 25.0003 29.9597 24.8066 30.8695 24.43C31.7793 24.0534 32.606 23.5014 33.3025 22.8053C33.9989 22.1092 34.5514 21.2828 34.9285 20.3732C35.3055 19.4636 35.4997 18.4887 35.5 17.504C35.5003 16.5193 35.3066 15.5443 34.93 14.6345C34.5534 13.7247 34.0014 12.898 33.3053 12.2015C32.6092 11.5051 31.7828 10.9526 30.8732 10.5755C29.9636 10.1985 28.9887 10.0043 28.004 10.004C26.0154 10.0035 24.1081 10.7929 22.7015 12.1987C21.295 13.6045 20.5045 15.5114 20.504 17.5C20.5035 19.4886 21.2929 21.396 22.6987 22.8025C24.1045 24.209 26.0114 24.9995 28 25Z" fill="#1A1A1A" />
                </svg>
            </div>
        ),
        links: [
            { label: "Profile", path: "/userdashboard/settings/account/profile" },
            { label: "My Cards", path: "/userdashboard/settings/account/cards" },
            { label: "Security", path: "/userdashboard/settings/account/security" },
            { label: "Notifications", path: "/userdashboard/settings/account/notifications" },
        ],
    },
    {
        title: "Renter Profile",
        description: "Lets you control and update account information and enable other products.",
        icon: (
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                <svg width="36" height="36" viewBox="0 0 56 58" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Renter profile icon" className="w-9 h-9 sm:w-11 sm:h-11">
                    <path d="M52.6805 15.6907L51.3632 13.408C50.3685 11.68 49.8698 10.816 49.0218 10.472C48.1765 10.1253 47.2192 10.4 45.3018 10.9413L42.0485 11.8587C40.8245 12.1413 39.5418 11.9813 38.4272 11.4053L37.5285 10.888C36.5711 10.2744 35.8348 9.37093 35.4272 8.30933L34.5365 5.648C33.9498 3.888 33.6565 3.008 32.9605 2.50667C32.2645 2 31.3365 2 29.4858 2H26.5125C24.6618 2 23.7365 2 23.0378 2.50667C22.3418 3.008 22.0512 3.888 21.4645 5.648L20.5738 8.30933C20.1655 9.37131 19.4283 10.2749 18.4698 10.888L17.5712 11.408C16.4565 11.9813 15.1712 12.1413 13.9498 11.8613L10.6965 10.9413C8.77916 10.4 7.82183 10.128 6.9765 10.472C6.1285 10.816 5.62983 11.68 4.63516 13.4053L3.3205 15.6907C2.38716 17.312 1.9205 18.12 2.01116 18.9813C2.10183 19.8453 2.72583 20.5387 3.97383 21.928L6.72316 25.0027C7.39516 25.8533 7.8725 27.336 7.8725 28.6693C7.8725 30.0027 7.39516 31.4853 6.72583 32.336L3.97383 35.408C2.72583 36.7973 2.10183 37.4933 2.01116 38.3547C1.9205 39.216 2.3845 40.0267 3.31783 41.6453L4.63516 43.9307C5.62983 45.656 6.1285 46.52 6.9765 46.864C7.8245 47.208 8.77916 46.9387 10.6965 46.3947L13.9498 45.4773C15.1735 45.1972 16.4568 45.3578 17.5738 45.9307L18.4698 46.448C19.4298 47.0613 20.1658 47.968 20.5712 49.0293L21.4618 51.688C22.0485 53.448 22.3418 54.328 23.0378 54.8347C23.7365 55.336 24.6618 55.336 26.5125 55.336H29.4858C31.3365 55.336 32.2645 55.336 32.9605 54.832C33.6565 54.328 33.9498 53.448 34.5338 51.688L35.4272 49.0293C35.8325 47.9653 36.5685 47.0613 37.5285 46.448L38.4245 45.9307C39.5445 45.3573 40.8245 45.1947 42.0512 45.4773L45.3045 46.3947C47.2192 46.9387 48.1765 47.2107 49.0218 46.8667C49.8698 46.52 50.3685 45.656 51.3632 43.9307L52.6778 41.6453C53.6112 40.0267 54.0778 39.2187 53.9872 38.3547C53.8965 37.4907 53.2725 36.7973 52.0245 35.408L49.2752 32.336C48.6032 31.4827 48.1258 30.0027 48.1258 28.6693C48.1258 27.336 48.6032 25.8533 49.2725 25.0027L52.0245 21.928C53.2725 20.5413 53.8965 19.8453 53.9872 18.9813C54.0778 18.1173 53.6138 17.312 52.6805 15.6907Z" stroke="#201F23" strokeWidth="4" strokeLinecap="round" />
                    <path d="M18.5 39.3151C19.4458 37.6769 20.8064 36.3165 22.4448 35.371C24.0832 34.4254 25.9416 33.9278 27.8333 33.9284C29.725 33.9278 31.5835 34.4254 33.2219 35.371C34.8603 36.3165 36.2208 37.6769 37.1667 39.3151M33.1667 21.9818C33.1667 23.3963 32.6048 24.7528 31.6046 25.753C30.6044 26.7532 29.2478 27.3151 27.8333 27.3151C26.4188 27.3151 25.0623 26.7532 24.0621 25.753C23.0619 24.7528 22.5 23.3963 22.5 21.9818C22.5 20.5673 23.0619 19.2107 24.0621 18.2105C25.0623 17.2103 26.4188 16.6484 27.8333 16.6484C29.2478 16.6484 30.6044 17.2103 31.6046 18.2105C32.6048 19.2107 33.1667 20.5673 33.1667 21.9818Z" stroke="#201F23" strokeWidth="4" strokeLinecap="round" />
                </svg>
            </div>
        ),
        links: [
            { label: "Public renter profile", path: "/userdashboard/settings/public-renter-profile" },
        ],
    }
];

const SettingCard = ({
    card,
    isOpen,
    onToggle,
}: {
    card: SettingCardData;
    isOpen: boolean;
    onToggle: () => void;
}) => {
    const navigate = useNavigate();

    if (card.links && card.links.length > 0) {
        return (
            <div
                className="rounded-lg bg-[#F0F0F6] border border-transparent shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 sm:px-4 py-6 sm:py-8 md:py-10 cursor-pointer focus:outline-none self-start"
                onClick={onToggle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggle();
                    }
                }}
            >
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                    <div className="shrink-0">
                        {card.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-base sm:text-lg md:text-xl font-medium text-[#1A1A1A]">{card.title}</p>
                        <p className="text-xs sm:text-[13px] md:text-[13.5px] text-[#6B7280] leading-[1.4] font-medium max-w-[240px]">
                            {card.description}
                        </p>
                    </div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-[38px] md:h-[38px] rounded-full border-[1.5px] sm:border-[1.8px] border-[#1A1A1A] bg-white flex items-center justify-center shadow-inner shrink-0">
                        <ChevronDown
                            size={20}
                            className={`sm:w-6 sm:h-6 text-[#1A1A1A] transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                    </div>
                </div>
                {isOpen && (
                    <div className="pt-3 pl-12 sm:pl-16 md:pl-18 space-y-1 text-xs sm:text-sm font-semibold text-[var(--dashboard-accent)]">
                        {card.links.map((link) => (
                            <p
                                key={link.path}
                                className="cursor-pointer hover:underline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(link.path);
                                }}
                            >
                                {link.label}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            to={card.link || "#"}
            className="flex items-center gap-3 sm:gap-4 md:gap-6 bg-[#F0F0F6] px-3 sm:px-4 py-6 sm:py-8 md:py-10 rounded-[10px] border border-transparent shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300 group self-start"
        >
            <div className="shrink-0">
                {card.icon}
            </div>
            <div className="flex-1">
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-[#1A1A1A] mb-1">{card.title}</h3>
                <p className="text-xs sm:text-[13px] md:text-[13.5px] text-[#6B7280] leading-[1.4] font-medium max-w-[240px]">
                    {card.description}
                </p>
            </div>
            <div className="shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-[38px] md:h-[38px] rounded-full border-[1.5px] sm:border-[1.8px] border-[#1A1A1A] flex items-center justify-center transition-all duration-300 group-hover:bg-[#1A1A1A] group-hover:text-white">
                    <ChevronDown size={20} className="sm:w-6 sm:h-6 text-[#1A1A1A] group-hover:text-white" />
                </div>
            </div>
        </Link>
    );
};

const Settings: React.FC = () => {
    const [openCardTitle, setOpenCardTitle] = useState<string | null>(null);

    const toggleCard = (title: string) => {
        setOpenCardTitle((prev) => (prev === title ? null : title));
    };

    return (
        <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6 lg:p-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                <ol className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium mb-6 sm:mb-8 ml-1">
                    <li>
                        <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-smedium hover:opacity-80 transition-opacity">Dashboard</Link>
                    </li>
                    <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                    <li className="text-[#1A1A1A] font-medium" aria-current="page">Settings</li>
                </ol>
            </nav>

            {/* Main Settings Container */}
            <div className="bg-[#F4F4F4] border border-[#E5E7EB] rounded-[12px] md:rounded-[16px] lg:rounded-[20px] shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.2)]">
                <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#E5E7EB]">
                    <h1 className="text-xl sm:text-2xl font-medium text-[#1A1A1A] ">Settings</h1>
                </div>

                <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 min-h-[400px] sm:min-h-[500px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
                        {SETTING_CARDS.map((card) => (
                            <SettingCard
                                key={card.title}
                                card={card}
                                isOpen={openCardTitle === card.title}
                                onToggle={() => toggleCard(card.title)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
