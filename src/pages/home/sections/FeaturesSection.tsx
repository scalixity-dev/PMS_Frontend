import React from "react";
import FeatureCard from "../../../components/common/cards/FeatureCard";
import PaginationButtons from "../../../components/common/buttons/PaginationButtons";
import ViewAllButton from "../../../components/common/buttons/ViewAllButton";
import { DollarSign, Building, FileText, Bot } from "lucide-react";
import { useHorizontalInfiniteScroll } from "../../../hooks/useHorizontalInfiniteScroll";

const FeaturesSection: React.FC = () => {
  const { scrollContainerRef, handlePrevClick, handleNextClick } =
    useHorizontalInfiniteScroll({
      scrollAmount: 430, // Card width: 389px + gap: 32px = 421px, rounded to 430
    });

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
      icon: <Building className="text-[var(--color-primary)]" />,
      title: "Property Management",
      subtitle: "Handle all your properties effortlessly",
      description:
        "Manage multiple properties from one dashboard — track tenants, leases, and maintenance in one place.",
      points: [
        "Add, edit, and organize properties in seconds",
        "Real-time occupancy and performance insights",
        "Streamline landlord–tenant communication",
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
    {
      icon: <Bot className="text-[var(--color-primary)]" />,
      title: "AI-Powered Assistance",
      subtitle: "Smarter management through automation",
      description:
        "Leverage AI to simplify daily tasks — auto-fill property details, assist with payment queries, and predict late payments.",
      points: [
        "AI-driven chat support for tenants and landlords",
        "Smart rent prediction and reminder system",
        "Auto-generate leases, notices, and reports",
      ],
  color: "--color-card-2",
    },
  ];

  // Duplicate features for infinite scroll
  const duplicatedFeatures = [...features, ...features, ...features];

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
              <ViewAllButton to="/features" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards + Pagination container */}
      <div className="mb-8">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-8">
            {duplicatedFeatures.map((feature, idx) => (
              <div key={idx} className="w-[389px] flex-shrink-0">
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination aligned bottom-right */}
        <div className="flex justify-end">
          <PaginationButtons 
            containerClassName="flex gap-2 mt-6" 
            onPrev={handlePrevClick}
            onNext={handleNextClick}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
