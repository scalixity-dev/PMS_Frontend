import React from "react";
import RentalFeatureCard from "../../../../components/common/cards/RentalFeatureCard";
import { CreditCard, Monitor, RotateCcw } from "lucide-react";

const RentalFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Monitor size={40} />,
      title: "Secure Your Home with Renters Insurance",
      description:
        "Purchase renters insurance directly from your PmsCloud account—fast, simple, and the easiest way to protect your belongings and peace of mind.",
    },
    {
      icon: <CreditCard size={40} />,
      title: "Build Credit by Reporting Your Rent",
      description:
        "Purchase renters insurance directly from your PmsCloud account—fast, simple, and the easiest way to protect your belongings and peace of mind.",
    },
    {
      icon: <RotateCcw size={40} />,
      title: "Support at Your Fingertips",
      description:
        "PMS support is here to help whenever you need it. From account setup to troubleshooting, our team makes sure you get answers quickly so you can keep managing your rental with ease.",
    },
  ];

  return (
    <section className="w-full py-16 px-6 flex flex-col items-center text-center bg-white">
      <h2 className="text-3xl md:text-5xl font-semibold text-[#0D1B2A] mb-16">
        Manage your rental anytime, anywhere
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {features.map((feature, idx) => (
          <RentalFeatureCard
            key={idx}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default RentalFeaturesSection;
