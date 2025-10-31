import React from "react";
import FeatureCard from "../../../components/common/cards/FeatureCard";
import PaginationButtons from "../../../components/common/buttons/PaginationButtons";
import ViewAllButton from "../../../components/common/buttons/ViewAllButton";
import { DollarSign, UserCheck, FileText } from "lucide-react";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <DollarSign className="text-[var(--color-primary)]" />,
      title: "Accounting",
      subtitle: "Collect payments, effortlessly",
      description:
        "No more chasing down payments. With PmsCloud, tenants have a flexible, convenient way to pay rent online, and you get peace of mind.",
      points: [
        "Accept credit, debit, ACH, cash, or checks",
        "Reduce late payments by 90% with auto pay",
        "Automatically track paid and overdue invoices",
      ],
  color: "--color-card-1",
    },
    {
      icon: <UserCheck className="text-[var(--color-primary)]" />,
      title: "Pms Screening",
      subtitle: "Find the right renters, faster",
      description:
        "Automate your leasing process from listing to lease. Collect applications, run background and credit checks, and finalize lease agreements.",
      points: [
        "Screen Pms with 99.9% accuracy",
        "Set pre-screening questions",
        "Choose from several screening packages",
      ],
  color: "--color-card-2",
    },
    {
      icon: <FileText className="text-[var(--color-primary)]" />,
      title: "Rent Collection",
      subtitle: "Take full control of your accounting",
      description:
        "With our suite of accounting features, you can set automatic invoices, run custom reports, track your cash flow.",
      points: [
        "Real-time reporting",
        "Landlords report 20 hours/week saved",
        "Connect to QuickBooks and add multiple banks",
      ],
  color: "--color-card-3",
    },
  ];

  return (
  <section className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex-1">
          <h2 className="text-3xl font-semibold font-[var(--font-heading)] text-[var(--color-heading)] flex items-center gap-2">
            ✨Our Features
          </h2>
          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-6">
            <p className="text-[var(--color-subheading)] text-sm max-w-4xl">
              Powerful tools built to simplify property management — from rent
              collection to tenant screening and beyond. Save time, stay organized,
              and manage your entire portfolio from one intuitive dashboard.
            </p>
            <div className="flex-shrink-0 md:ml-auto">
              <ViewAllButton />
            </div>
          </div>
        </div>
      </div>

      {/* Cards + Pagination container */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>

        {/* Pagination aligned bottom-right */}
        <div className="flex justify-end">
          <PaginationButtons containerClassName="flex gap-2 mt-6" />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
