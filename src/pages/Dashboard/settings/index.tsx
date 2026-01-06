import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  BarChart2,
  ChevronDown,
  CreditCard,
  DollarSign,
  Gift,
  Home,
  PaintRoller,
  Settings as Cog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    icon: CreditCard,
    links: [
      { label: "Profile", path: "/dashboard/settings/profile" },
      { label: "Security", path: "/dashboard/settings/security" },
      { label: "Integration", path: "/dashboard/settings/integrations" },
      { label: "Notifications", path: "/dashboard/settings/notifications" },
    ],
  },
  {
    title: "Subscription",
    description: "Lets you control and update account information and enable other products.",
    icon: Gift,
    links: [
      { label: "My Plan", path: "/dashboard/settings/subscription/my-plan" },
      { label: "My Card", path: "/dashboard/settings/subscription/my-card" },
    ],
  },
  {
    title: "Accounting Settings",
    description: "Lets you control and update account information and enable other products.",
    icon: Cog,
    links: [
      { label: "Invoice", path: "/dashboard/settings/accounting/invoice" },
      { label: "QuickBooks", path: "/dashboard/settings/accounting/quickbook" },
      { label: "Tags", path: "/dashboard/settings/accounting/tags" },
    ],
  },
  {
    title: "Online Payment",
    description: "Lets you control and update account information and enable other products.",
    icon: DollarSign,
    links: [
      { label: "Configurations", path: "/dashboard/settings/online-payments/configurations" },
    ],
  },
  {
    title: "Rental Application",
    description: "Lets you control and update account information and enable other products.",
    icon: Home,
    links: [
      { label: "Online Application", path: "/dashboard/settings/rental-application/online-application" },
      { label: "Form Configuration", path: "/dashboard/settings/rental-application/form-configuration" },
      { label: "Terms & Signature", path: "/dashboard/settings/rental-application/terms-signature" },
    ],
  },
  {
    title: "Team Management",
    description: "Lets you control and update account information and enable other products.",
    icon: Users,
    links: [
      { label: "Roles & Permissions", path: "/dashboard/settings/team-management/roles-permissions" },
      { label: "Property Permissions", path: "/dashboard/settings/team-management/property-permissions" },
    ],
  },
  {
    title: "Request Settings",
    description: "Lets you control and update account information and enable other products.",
    icon: PaintRoller,
    links: [
      { label: "Request Settings", path: "/dashboard/settings/request-settings/request-settings" },
      { label: "Automation Settings", path: "/dashboard/settings/request-settings/automation-settings" },
    ],
  },
  {
    title: "Reports",
    description: "Lets you control and update account information and enable other products.",
    icon: BarChart2,
    links: [
      { label: "General Reports", path: "/dashboard/settings/report/general" },
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
        <div className="pt-3 pl-16 space-y-1 text-sm font-semibold text-[#44A445]">
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

export default function Settings() {
  const [openCardTitle, setOpenCardTitle] = useState<string | null>(null);

  // Safe context access
  const context = useOutletContext<DashboardContext>();
  const sidebarCollapsed = context?.sidebarCollapsed ?? false;
  const sidebarOpen = !sidebarCollapsed;

  const toggleCard = (title: string) => {
    setOpenCardTitle((prev) => (prev === title ? null : title));
  };

  return (
    <div className={`min-h-screen bg-[#f5f5f5] transition-all duration-300 mx-auto ${sidebarOpen ? 'max-w-7xl' : 'max-w-full'}`}>
      <div className="space-y-5">
        <div className="text-sm text-gray-700 font-medium">
          <span className="text-[#7BD747]">Dashboard</span> / <span>Settings</span>
        </div>

        <div className="bg-[#E2E8E0] rounded-2xl shadow-[0px_3.68px_3.68px_0px_#00000033] border border-[#E4E4E4] p-5">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
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
}


