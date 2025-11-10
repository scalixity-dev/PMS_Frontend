import { InfoCard } from './ResourceCards';
import { Accounting, Calendar, Contacts, Dashboard, Documents, GetPaid, GetStarted, Leasing, Maintenance, Portfolio, Reports, Settings } from './resourceIcons';

export const LandlordCards = () => {
    return(
        <div className="flex flex-wrap justify-center gap-y-8 gap-x-5">
          {/* Row 1 */}
          <InfoCard
            title="Get Started"
            subtitle="How to get started, Account types overview"
            icon={<GetStarted />}
            iconColorClass="text-green-500"
            variant="light"
          />
          <InfoCard
            title="Dashboard"
            subtitle="Dashboard, Widgets"
            icon={<Dashboard />}
            iconColorClass="text-teal-500"
            variant="primary"
          />
          <InfoCard
            title="Settings"
            subtitle="Profile settings, Account settings, subscription, Affiliate program."
            icon={<Settings />}
            iconColorClass="text-slate-500" // Updated
            variant="light"
          />

          {/* Row 2 */}
          <InfoCard
            title="Get Paid"
            subtitle="Online Payments, Late Fees, ACH Fees"
            icon={<GetPaid />}
            iconColorClass="text-green-500" // Updated
            variant="primary"
          />
          <InfoCard
            title="Portfolio"
            subtitle="Properties, Units, Keys & Locks, Equipment"
            icon={<Portfolio />} // Updated
            iconColorClass="text-slate-500" // Updated
            variant="light" // Updated
          />
          <InfoCard
            title="Leasing"
            subtitle="Pms Screenings, listings, leads, CRM tools"
            icon={<Leasing />}
            iconColorClass="text-slate-500" // Updated
            variant="light" // Updated
          />

          {/* Row 3 */}
          <InfoCard
            title="Accounting"
            subtitle="Invoices, Payments, Deposits, Discounts"
            icon={<Accounting />}
            iconColorClass="text-slate-500"
            variant="light"
          />
          <InfoCard
            title="Documents"
            subtitle="Templates, File manager, Forms"
            icon={<Documents />}
            iconColorClass="text-slate-500"
            variant="light"
          />
          <InfoCard
            title="Contacts & Connections"
            subtitle="Pms, Service Pros, Owners, Contractors"
            icon={<Contacts />}
            iconColorClass="text-teal-500" // Updated
            variant="primary" // Updated
          />

          {/* Row 4 */}
          <InfoCard
            title="Reports"
            subtitle="Tax Reports, Statements, Trackers"
            icon={<Reports />}
            iconColorClass="text-slate-500"
            variant="light"
          />
          <InfoCard
            title="Calendar"
            subtitle="Calendar, Tasks"
            icon={<Calendar />}
            iconColorClass="text-teal-500"
            variant="primary"
          />
          <InfoCard
            title="Maintenance Requests"
            subtitle="Online maintenance, Recurring requests, Bids"
            icon={<Maintenance />}
            iconColorClass="text-slate-500"
            variant="light"
          />
        </div>
    )
}