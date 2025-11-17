// src/components/EveryFeatureCenteredSection.tsx
import React from "react";
import FeatureHighlightsGrid from "../../../../../components/common/FeatureHighlightsGrid";
import { FileText, Clock, ClipboardCheck, MessageCircle } from "lucide-react";

const EveryFeatureCenteredSection: React.FC = () => {
  const features = [
    {
      icon: <FileText />,
      title: "Link to invoices for fast, clear bookkeeping",
      description: "",
    },
    {
      icon: <Clock />,
      title: "Save up to 20 hours a week on admin tasks.",
      description: "",
    },
    {
      icon: <ClipboardCheck />,
      title: "Track time and materials, down to the detail",
      description: "",
    },
    {
      icon: <MessageCircle />,
      title: "Message Pms and vendors right from a request",
      description: "",
    },
  ];

  return (
    <section className="w-full py-20 text-center">
      <div className="text-4xl mb-4" aria-hidden="true">✨</div>
      <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary)] mb-8">
        Every feature you’ll ever need, and more
      </h2>
      

      <div className="max-w-5xl mx-auto px-4">
        <div className="border border-8 rounded-xl border-[var(--color-primary)]">
          <FeatureHighlightsGrid features={features} layout="vertical" descriptionClassName="text-[22px] text-[#195504]" />
        </div>
      </div>
    </section>
  );
};

export default EveryFeatureCenteredSection;

