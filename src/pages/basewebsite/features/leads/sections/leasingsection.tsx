// src/components/EveryFeatureCenteredSection.tsx
import React from "react";
import FeatureHighlightsGrid from "../../../../../components/common/FeatureHighlightsGrid";
import { Globe, Send, CalendarClock, ClipboardCheck } from "lucide-react";

const LeasingSection: React.FC = () => {
  const features = [
    {
      icon: <Globe />,
      title: "",
      description: "Build an impressive rental listing site with just a few clicks",
    },
    {
      icon: <Send />,
      title: "",
      description: "Send instant responses to emails and phone calls, keeping potential tenants engaged and in the loop.",
    },
    {
      icon: <CalendarClock />,
      title: "",
      description: "Self-access viewings let you automatically schedule showings without lifting a finger.",
    },
    {
      icon: <ClipboardCheck />,
      title: "",
      description: "Manage applications, screenings, and leases effortlessly in one place for max efficiency.",
    },
  ];

  return (
    <section className="w-full pb-20 text-center">
      <h2 className="text-3xl sm:text-4xl font-semibold text-(--color-primary) mb-6">
        Meet the all-in-one leasing solution
      </h2>
      <p className="text-lg  px-16 text-[#414141]  mb-10 max-w-xl mx-auto">
        List properties, schedule showings, and turn leads into tenants faster than ever.
      </p>
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-8 rounded-xl border-[color:var(--color-primary)]">
          <FeatureHighlightsGrid features={features} layout="vertical" descriptionClassName="text-[22px] text-[#195504]" />
        </div>
      </div>
    </section>
  );
};

export default LeasingSection;


