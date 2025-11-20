import { InfoCard } from './ResourceCards';
import { Accounting, Calendar, Contacts, Dashboard, Documents, GetPaid, GetStarted, Leasing, Maintenance, Portfolio, Reports, Settings } from './resourceIcons';

type FilterType = "Landlord" | "Tenant" | "Service Pro" | "Property Manager";

interface ResourceCardsProps {
  filter: FilterType;
  searchQuery?: string;
}

export const ResourceCards = ({ filter, searchQuery = "" }: ResourceCardsProps) => {
  const cardData = {
    Landlord: [
      {
        title: "Get Started",
        subtitle: "Learn how to set up your account, understand different account types, and navigate the platform to get the most out of your property management experience.",
        icon: <GetStarted />,
        iconColorClass: "text-green-500",
        variant: "light" as const,
      },
      {
        title: "Dashboard",
        subtitle: "Master your dashboard overview, customize widgets to track key metrics, and organize your workspace for efficient property management.",
        icon: <Dashboard />,
        iconColorClass: "text-teal-500",
        variant: "primary" as const,
      },
      {
        title: "Settings",
        subtitle: "Configure your profile settings, manage account preferences, update subscription plans, and explore our affiliate program opportunities.",
        icon: <Settings />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Get Paid",
        subtitle: "Set up online payment processing, configure late fee structures, understand ACH fee schedules, and streamline rent collection.",
        icon: <GetPaid />,
        iconColorClass: "text-green-500",
        variant: "primary" as const,
      },
      {
        title: "Portfolio",
        subtitle: "Manage your property portfolio, organize units efficiently, track keys and locks, and maintain equipment inventory across all properties.",
        icon: <Portfolio />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Leasing",
        subtitle: "Utilize comprehensive tenant screening tools, create and manage property listings, track leads effectively, and leverage CRM tools for better conversions.",
        icon: <Leasing />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Accounting",
        subtitle: "Generate and manage invoices, track all payments and deposits, apply discounts when needed, and maintain accurate financial records.",
        icon: <Accounting />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Documents",
        subtitle: "Access customizable templates, organize files with the file manager, and create professional forms for all your rental documentation needs.",
        icon: <Documents />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Contacts & Connections",
        subtitle: "Manage relationships with tenants, service professionals, property owners, and contractors all in one centralized contact management system.",
        icon: <Contacts />,
        iconColorClass: "text-teal-500",
        variant: "primary" as const,
      },
      {
        title: "Reports",
        subtitle: "Generate comprehensive tax reports, create detailed financial statements, and utilize tracking tools to monitor your property performance metrics.",
        icon: <Reports />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Calendar",
        subtitle: "Organize your schedule with the integrated calendar system, set up recurring tasks and reminders, and never miss important property management deadlines.",
        icon: <Calendar />,
        iconColorClass: "text-teal-500",
        variant: "primary" as const,
      },
      {
        title: "Maintenance Requests",
        subtitle: "Handle online maintenance requests efficiently, manage recurring maintenance schedules, compare bids from service providers, and track work completion.",
        icon: <Maintenance />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
    ],
    Tenant: [
      {
        title: "Getting Started",
        subtitle: "Learn how to create your tenant account, complete your profile setup, and understand how to navigate the platform to manage your rental experience.",
        icon: <GetStarted />,
        iconColorClass: "text-green-500",
        variant: "light" as const,
      },
      {
        title: "Rent Payments",
        subtitle: "Set up automatic rent payments, view payment history, understand payment methods available, and manage your recurring payment schedules securely.",
        icon: <GetPaid />,
        iconColorClass: "text-teal-500",
        variant: "primary" as const,
      },
      {
        title: "Maintenance Requests",
        subtitle: "Submit maintenance requests online, track the status of your requests, communicate with property managers, and view maintenance history for your unit.",
        icon: <Maintenance />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Lease Documents",
        subtitle: "Access your lease agreement, download important documents, view lease terms and conditions, and manage all your rental documentation in one place.",
        icon: <Documents />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Account Settings",
        subtitle: "Update your personal information, manage notification preferences, change your password, and customize your account settings to fit your needs.",
        icon: <Settings />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Payment History",
        subtitle: "View detailed payment history, download receipts for tax purposes, track upcoming payment due dates, and monitor your account balance.",
        icon: <Accounting />,
        iconColorClass: "text-green-500",
        variant: "primary" as const,
      },
      {
        title: "Contact Management",
        subtitle: "Communicate with your property manager, contact maintenance staff when needed, and access important contact information for your rental property.",
        icon: <Contacts />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Calendar & Reminders",
        subtitle: "Set up reminders for rent due dates, track important lease milestones, and manage your personal calendar related to your rental property.",
        icon: <Calendar />,
        iconColorClass: "text-teal-500",
        variant: "primary" as const,
      },
    ],
    "Service Pro": [
      {
        title: "Getting Started",
        subtitle: "Learn how to register as a service professional, complete your business profile, and understand how to connect with property managers and landlords.",
        icon: <GetStarted />,
        iconColorClass: "text-green-500",
        variant: "light" as const,
      },
      {
        title: "Job Management",
        subtitle: "View available maintenance jobs, accept work orders, track job status, and manage your service requests efficiently through the platform.",
        icon: <Dashboard />,
        iconColorClass: "text-teal-500",
        variant: "primary" as const,
      },
      {
        title: "Bidding & Quotes",
        subtitle: "Submit competitive bids for maintenance projects, create detailed quotes for property managers, and track your bidding history and success rates.",
        icon: <Maintenance />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Payment Processing",
        subtitle: "Set up payment methods, track completed job payments, view payment history, and manage invoices for services rendered to property owners.",
        icon: <GetPaid />,
        iconColorClass: "text-green-500",
        variant: "primary" as const,
      },
      {
        title: "Client Management",
        subtitle: "Build relationships with property managers and landlords, maintain contact information, and track your service history with each client.",
        icon: <Contacts />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Service Documentation",
        subtitle: "Upload work completion photos, create service reports, maintain service records, and organize documentation for all completed maintenance jobs.",
        icon: <Documents />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Business Settings",
        subtitle: "Manage your business profile, update service categories, configure notification preferences, and customize your account settings.",
        icon: <Settings />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Schedule Management",
        subtitle: "Organize your service schedule, set availability, manage multiple job assignments, and coordinate with property managers for optimal scheduling.",
        icon: <Calendar />,
        iconColorClass: "text-teal-500",
        variant: "primary" as const,
      },
    ],
    "Property Manager": [
      {
        title: "Getting Started",
        subtitle: "Learn how to set up your property management account, understand account features, and navigate the platform to manage multiple properties effectively.",
        icon: <GetStarted />,
        iconColorClass: "text-green-500",
        variant: "light" as const,
      },
      {
        title: "Portfolio Overview",
        subtitle: "Manage multiple property portfolios, organize properties by location or owner, track key performance metrics, and maintain comprehensive property databases.",
        icon: <Portfolio />,
        iconColorClass: "text-teal-500",
        variant: "primary" as const,
      },
      {
        title: "Tenant Management",
        subtitle: "Screen prospective tenants, manage lease agreements, track tenant communications, handle renewals, and maintain detailed tenant records across all properties.",
        icon: <Leasing />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Financial Management",
        subtitle: "Track income and expenses, generate owner statements, manage escrow accounts, process rent collections, and maintain comprehensive financial records.",
        icon: <Accounting />,
        iconColorClass: "text-green-500",
        variant: "primary" as const,
      },
      {
        title: "Maintenance Coordination",
        subtitle: "Coordinate maintenance requests, manage service provider relationships, track work orders, compare bids, and ensure timely property maintenance completion.",
        icon: <Maintenance />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Document Management",
        subtitle: "Store and organize lease agreements, property documents, inspection reports, and all legal documentation in a secure, accessible document management system.",
        icon: <Documents />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Owner Relations",
        subtitle: "Communicate with property owners, generate owner reports, manage owner portals, and provide transparent updates on property performance and financials.",
        icon: <Contacts />,
        iconColorClass: "text-teal-500",
        variant: "primary" as const,
      },
      {
        title: "Reporting & Analytics",
        subtitle: "Generate comprehensive property reports, analyze performance metrics, create owner statements, and utilize analytics tools for data-driven decision making.",
        icon: <Reports />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "System Settings",
        subtitle: "Configure account settings, manage user permissions, set up automated workflows, customize notification preferences, and optimize your management system.",
        icon: <Settings />,
        iconColorClass: "text-slate-500",
        variant: "light" as const,
      },
      {
        title: "Task & Calendar",
        subtitle: "Organize property inspections, schedule maintenance appointments, set reminders for lease renewals, and manage all property-related tasks efficiently.",
        icon: <Calendar />,
        iconColorClass: "text-teal-500",
        variant: "primary" as const,
      },
    ],
  };

  const allCards = cardData[filter] || cardData.Landlord;

  // Filter cards based on search query
  const filteredCards = searchQuery.trim()
    ? allCards.filter((card) => {
        const query = searchQuery.toLowerCase();
        const titleMatch = card.title.toLowerCase().includes(query);
        const subtitleMatch = card.subtitle.toLowerCase().includes(query);
        return titleMatch || subtitleMatch;
      })
    : allCards;

  return (
    <div className="flex flex-wrap justify-center gap-y-8 gap-x-5">
      {filteredCards.length > 0 ? (
        filteredCards.map((card, index) => (
          <InfoCard
            key={`${filter}-${index}`}
            title={card.title}
            subtitle={card.subtitle}
            icon={card.icon}
            iconColorClass={card.iconColorClass}
            variant={card.variant}
          />
        ))
      ) : (
        <div className="w-full text-center py-12">
          <p className="text-lg text-slate-600">No results found for "{searchQuery}"</p>
          <p className="text-sm text-slate-500 mt-2">Try searching with different keywords</p>
        </div>
      )}
    </div>
  );
};

// Keep for backward compatibility
export const LandlordCards = () => {
  return <ResourceCards filter="Landlord" />;
};