export const pricingPlans = [
  {
    plan: "Starter",
    description: "Designed for DIY landlords looking to automate tasks and simplify their portfolios.",
    priceText: "$ 15.00 /m",
    annualBillingText: "$198.00 if billed annually",
    includesTitle: "Includes:",
    features: ["Online Rent Payments", "Maintenance Management", "Listings and Applications"],
    isPopular: false,
  },
  {
    plan: "Growth",
    description: "Designed for mid-to-large landlords looking for additional organization and tenant tools.",
    priceText: "$ 32.00 /m",
    annualBillingText: "$385.00 if billed annually",
    includesTitle: "Everything in Starter, plus:",
    features: ["Enhanced Reporting", "Move In/Out Inspections", "Property Message Board"],
    isPopular: false,
  },
  {
    plan: "Pro",
    description: "Designed for mid-to-large landlords looking for premium features and efficiency",
    priceText: "$ 55.00 /m",
    annualBillingText: "$660.00 if billed annually",
    includesTitle: "Everything in Growth, plus:",
    features: ["Tax Reports", "Bank Reconciliation", "Separate Owner Portal"],
    isPopular: true,
    isPro: true,
  },
  {
    plan: "Business",
    description: "Designed for large companies looking for advanced features tailored to their needs.",
    priceText: "Custom",
    annualBillingText: "Starting at $100.00 / mo",
    includesTitle: "Everything in Pro, plus:",
    features: ["Team Management & Tools", "Task Management", "User-Interface Customization"],
    isPopular: false,
  },
];


export const allFeatureTables = [
  {
    title: "Property Management",
    features: [
      { name: "Properties & Units", starter: "Unlimited", growth: "Unlimited", pro: "Unlimited", business: "Unlimited" },
      { name: "Leases", starter: "10", growth: "30", pro: "60", business: "Unlimited" },
      { name: "Keys & Locks Management", starter: "5", growth: "15", pro: "100", business: "Unlimited" },
      { name: "Data Storage & Management", starter: "1 GB", growth: "10 GB", pro: "25 GB", business: "Custom" },
      { name: "Service Providers", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Data Export & Import", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Notification Center", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Landlord, SmartTenantAI, Service Pro & Owner Mobile Apps", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Global Search", starter: "-", growth: "check", pro: "check", business: "check" },
      { name: "SmartTenantAI Message Board", starter: "-", growth: "check", pro: "check", business: "check" },
    ]
  },
  {
    title: "Rental Marketing & Listing",
    features: [
      { name: "Rental Listings", starter: "Unlimited", growth: "Unlimited", pro: "Unlimited", business: "Unlimited" },
      { name: "Listing Syndication", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Listing Website & Logo", starter: "-", growth: "-", pro: "check", business: "check" },
      { name: "Listings Auto-Refresh", starter: "-", growth: "-", pro: "-", business: "check" },
      { name: "Custom Domain", starter: "-", growth: "-", pro: "-", business: "check" },
    ]
  },
  {
    title: "Leads Management",
    features: [
      { name: "Lead Tracking", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Lead Text Messaging", starter: "10", growth: "15", pro: "30", business: "Custom" },
      { name: "Tour Scheduling", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Premium Leads", starter: "-", growth: "check", pro: "check", business: "check" },
    ]
  },
  {
    title: "SmartTenantAI Screening",
    features: [
      { name: "Full SmartTenantAI Screenings", starter: "Free! (viva applied)", growth: "Free! (viva applied)", pro: "Free! (viva applied)", business: "Free! (viva applied)" },
      { name: "Local County Searches", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Income Insights", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Online Rental Applications", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Custom Applications", starter: "-", growth: "-", pro: "check", business: "check" },
      { name: "Rental Applications Board", starter: "-", growth: "-", pro: "Coming soon", business: "Coming soon" },
      { name: "Rental Pre-qualification", starter: "-", growth: "-", pro: "Coming soon", business: "Coming soon" },
    ]
  },
  {
    title: "Leasing & Renewals",
    features: [
      { name: "E-Signature", starter: "Risk (viva applied)", growth: "Risk (viva applied)", pro: "Risk (viva applied)", business: "Risk (viva applied)" },
      { name: "Document Templates", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Document Inspector", starter: "-", growth: "-", pro: "check", business: "check" },
      { name: "Move In / Out Inspections", starter: "10", growth: "25", pro: "50", business: "Unlimited" },
      { name: "Lease Rcs (PDF Upload on Create)", starter: "-", growth: "25", pro: "50", business: "Unlimited" },
      { name: "Landlord Forms (State-specific)", starter: "-", growth: "check", pro: "check", business: "check" },
    ]
  },
  {
    title: "Maintenance Management",
    features: [
      { name: "On-demand Maintenance Requests", starter: "Unlimited", growth: "Unlimited", pro: "Unlimited", business: "Unlimited" },
      { name: "Recurring Requests", starter: "10", growth: "20", pro: "100", business: "Unlimited" },
      { name: "Equipment Tracking", starter: "10", growth: "25", pro: "100", business: "Unlimited" },
      { name: "Service Management", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Service Pro Portal", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Service Pro Invoicing & Payments", starter: "-", growth: "check", pro: "check", business: "check" },
      { name: "Service Network", starter: "check", growth: "check", pro: "check", business: "check" },
      { name: "Auto-assign Maintenance Requests", starter: "-", growth: "-", pro: "check", business: "check" },
      { name: "Maintenance Requests Board", starter: "-", growth: "-", pro: "check", business: "check" },
    ]
  }
];