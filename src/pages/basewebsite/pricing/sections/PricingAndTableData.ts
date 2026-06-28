export const pricingPlans = [
  {
    plan: "Starter",
    description: "Designed for DIY landlords looking to automate tasks and simplify their portfolios.",
    priceText: "$ 15.00 /m",
    annualBillingText: "$198.00 if billed annually",
    includesTitle: "Includes:",
    features: ["Online Rent Payments", "Maintenance Requests", "Listings & Applications"],
    isPopular: false,
  },
  {
    plan: "Growth",
    description: "Designed for mid-to-large landlords looking for additional organization and tenant tools.",
    priceText: "$ 32.00 /m",
    annualBillingText: "$385.00 if billed annually",
    includesTitle: "Everything in Starter, plus:",
    features: ["Income & Expense Accounting", "Recurring Transactions", "Lead Tracking"],
    isPopular: false,
  },
  {
    plan: "Pro",
    description: "Designed for mid-to-large landlords looking for premium features and efficiency.",
    priceText: "$ 55.00 /m",
    annualBillingText: "$660.00 if billed annually",
    includesTitle: "Everything in Growth, plus:",
    features: ["Custom Application Forms", "Auto-assign Maintenance", "AI Property Assistant"],
    isPopular: true,
    isPro: true,
  },
  {
    plan: "Business",
    description: "Designed for large companies looking for advanced features tailored to their needs.",
    priceText: "Custom",
    annualBillingText: "Starting at $100.00 / mo",
    includesTitle: "Everything in Pro, plus:",
    features: ["Team Management & Permissions", "Unlimited Storage", "Priority Support"],
    isPopular: false,
  },
];

export const allFeatureTables = [
  {
    title: "Property & Portfolio Management",
    features: [
      { name: "Properties & Units",                starter: "Unlimited", growth: "Unlimited", pro: "Unlimited", business: "Unlimited" },
      { name: "Leases",                            starter: "10",        growth: "30",        pro: "60",        business: "Unlimited" },
      { name: "Keys & Locks Management",           starter: "5",         growth: "15",        pro: "100",       business: "Unlimited" },
      { name: "Equipment Tracking",                starter: "10",        growth: "25",        pro: "100",       business: "Unlimited" },
      { name: "File Manager & Document Storage",   starter: "1 GB",      growth: "10 GB",     pro: "25 GB",     business: "Custom" },
      { name: "Data Import (Properties, Tenants, Leases, Service Pros)", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Notification Center",               starter: "check",     growth: "check",     pro: "check",     business: "check" },
      { name: "Calendar & Reminders",              starter: "check",     growth: "check",     pro: "check",     business: "check" },
    ],
  },
  {
    title: "Rental Marketing & Listings",
    features: [
      { name: "Rental Listings",     starter: "Unlimited", growth: "Unlimited", pro: "Unlimited", business: "Unlimited" },
      { name: "List Unit Wizard",    starter: "check",     growth: "check",     pro: "check",     business: "check" },
      { name: "Listing Syndication", starter: "check",     growth: "check",     pro: "check",     business: "check" },
    ],
  },
  {
    title: "Leads & Leasing",
    features: [
      { name: "Lead Tracking (sources, notes, meetings, logs)", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Lead Messaging",                                 starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Online Rental Applications",                     starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Configurable Background Questions",              starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Custom Application Forms",                       starter: "-",     growth: "-",     pro: "check", business: "check" },
      { name: "Move-In Setup (Rent, Deposit, Late Fees)",       starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "AI Application Assistant",                       starter: "-",     growth: "check", pro: "check", business: "check" },
    ],
  },
  {
    title: "Documents & E-Signature",
    features: [
      { name: "Landlord Form Templates",      starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Custom Document Templates",    starter: "-",     growth: "check", pro: "check", business: "check" },
      { name: "E-Signature",                  starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Lease Agreements & Notices",   starter: "check", growth: "check", pro: "check", business: "check" },
    ],
  },
  {
    title: "Maintenance Management",
    features: [
      { name: "On-demand Maintenance Requests",   starter: "Unlimited", growth: "Unlimited", pro: "Unlimited", business: "Unlimited" },
      { name: "Recurring Requests",               starter: "10",        growth: "20",        pro: "100",       business: "Unlimited" },
      { name: "Service Provider Assignment",       starter: "check",     growth: "check",     pro: "check",     business: "check" },
      { name: "Service Pro Portal",                starter: "check",     growth: "check",     pro: "check",     business: "check" },
      { name: "Service Pro Invoicing & Statements", starter: "-",        growth: "check",     pro: "check",     business: "check" },
      { name: "Auto-assign Maintenance Requests", starter: "-",         growth: "-",         pro: "check",     business: "check" },
      { name: "Maintenance Board",                 starter: "-",         growth: "check",     pro: "check",     business: "check" },
    ],
  },
  {
    title: "Accounting & Payments",
    features: [
      { name: "Online Rent Payments",           starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Income & Expense Invoicing",     starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Recurring Transactions",         starter: "-",     growth: "check", pro: "check", business: "check" },
      { name: "Deposits & Credits",             starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Bulk Payments",                  starter: "-",     growth: "check", pro: "check", business: "check" },
      { name: "Refunds & Discounts",            starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Invoice Customization & Tags",   starter: "-",     growth: "check", pro: "check", business: "check" },
    ],
  },
  {
    title: "Reporting",
    features: [
      { name: "Rent Roll",                     starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Rentability Report",            starter: "-",     growth: "check", pro: "check", business: "check" },
      { name: "Vacant Rentals Report",         starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Income & Expense Reports",      starter: "-",     growth: "check", pro: "check", business: "check" },
      { name: "Property & Tenant Statements",  starter: "-",     growth: "check", pro: "check", business: "check" },
      { name: "Renters Insurance Report",      starter: "-",     growth: "check", pro: "check", business: "check" },
      { name: "Maintenance Requests Report",   starter: "-",     growth: "check", pro: "check", business: "check" },
      { name: "Report Export",                 starter: "-",     growth: "check", pro: "check", business: "check" },
    ],
  },
  {
    title: "AI Assistant",
    features: [
      { name: "AI Property Assistant",     starter: "-",     growth: "check", pro: "check", business: "check" },
      { name: "AI Application Assistant",  starter: "-",     growth: "check", pro: "check", business: "check" },
    ],
  },
  {
    title: "Team & Account",
    features: [
      { name: "Task Management",                          starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Profile, Security & Notification Settings", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Integrations",                             starter: "-",     growth: "check", pro: "check", business: "check" },
      { name: "Team Management (Roles & Permissions)",    starter: "-",     growth: "-",     pro: "check", business: "check" },
      { name: "Property-level Permissions",               starter: "-",     growth: "-",     pro: "check", business: "check" },
      { name: "Subscription & Billing",                   starter: "check", growth: "check", pro: "check", business: "check" },
    ],
  },
];
