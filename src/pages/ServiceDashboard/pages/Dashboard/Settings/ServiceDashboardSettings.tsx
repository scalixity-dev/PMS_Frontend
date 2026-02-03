import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    DollarSign,
    Users,
    UserCircle,
    ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ServiceBreadCrumb from "../../../components/ServiceBreadCrumb";

interface SettingLink {
    label: string;
    path: string;
}

interface SettingCardData {
    title: string;
    description: string;
    icon: LucideIcon;
    links: SettingLink[];
}

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const SETTING_CARDS: SettingCardData[] = [
    {
        title: "Account settings",
        description: "Lets you control and update account information and enable other products.",
        icon: UserCircle,
        links: [
            { label: "Profile", path: "/service-dashboard/settings/profile" },
            { label: "Security", path: "/service-dashboard/settings/security" },
            { label: "Integrations", path: "/service-dashboard/settings/integrations" },
            { label: "Notifications", path: "/service-dashboard/settings/notifications" },
        ],
    },
    {
        title: "Business Profile",
        description: "Lets you control and update account information and enable other products.",
        icon: Users,
        links: [
            { label: "Business Profile", path: "/service-dashboard/settings/business-profile" },
            { label: "Job Preference", path: "/service-dashboard/settings/job-preference" },
        ],
    },
    {
        title: "Online Payment",
        description: "Lets you control and update account information and enable other products.",
        icon: DollarSign,
        links: [
            { label: "Bank Account", path: "/service-dashboard/settings/bank-account" },
            { label: "Entities", path: "/service-dashboard/settings/entities" },
            { label: "Tax Forms", path: "/service-dashboard/settings/tax-forms" },
        ],
    },
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
    const Icon = card.icon;

    return (
        <div
            className="rounded-lg bg-[#f6f7fb] border border-[#e6e6ed] shadow-[0_4px_12px_rgba(0,0,0,0.08)] px-5 py-6 min-h-32 cursor-pointer focus:outline-none"
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
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Icon className="text-gray-900" size={26} strokeWidth={2} />
                </div>
                <div className="flex-1 space-y-1">
                    <p className="text-lg font-semibold text-gray-900">{card.title}</p>
                    <p className="text-xs text-gray-600 leading-snug">{card.description}</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center shadow-inner shrink-0">
                    <ChevronDown
                        size={18}
                        className={`text-gray-700 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </div>
            {isOpen && (
                <div className="pt-3 pl-16 space-y-1 text-sm font-semibold text-[#7BD747]">
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
};

const ServiceDashboardSettings = () => {
    const [openCardTitle, setOpenCardTitle] = useState<string | null>(null);

    // Safe context access
    const context = useOutletContext<DashboardContext>();
    const sidebarCollapsed = context?.sidebarCollapsed ?? false;

    const toggleCard = (title: string) => {
        setOpenCardTitle((prev) => (prev === title ? null : title));
    };

    return (
        <div className={`min-h-screen transition-all duration-300 mx-auto w-full max-w-full overflow-x-hidden ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            <div className="space-y-5">
                <ServiceBreadCrumb
                    items={[
                        { label: 'Dashboard', to: '/service-dashboard' },
                        { label: 'Settings', active: true }
                    ]}
                />

                <div className="bg-[#F5F5F5] rounded-2xl shadow-[0px_3.68px_3.68px_0px_#00000033] border border-[#E4E4E4] p-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 items-start">
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

export default ServiceDashboardSettings;
