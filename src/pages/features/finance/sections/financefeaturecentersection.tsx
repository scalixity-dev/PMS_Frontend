// src/components/EveryFeatureCenteredSection.tsx
import React from "react";
import FeatureHighlightsGrid from "../../../../components/common/FeatureHighlightsGrid";
import { FileText, Clock, ClipboardCheck, MessageCircle } from "lucide-react";

const EveryFeatureCenteredSection: React.FC = () => {
  const features = [
    {
      icon: <FileText />,
      title: "",
      description: "Pull and reconcile transactions in seconds",
    },
    {
      icon: <Clock />,
      title: "",
      description: "Stay organized with a payment overview",
    },
    {
      icon: <ClipboardCheck />,
      title: "",
      description: "Track everything in our secure, mobile-friendly portal",
    },
    {
      icon: <MessageCircle />,
      title: "",
      description: "Reduce human error with automatic matching",
    },
  ];

  return (
    <section className="w-full pb-20 text-center">
      <div className="text-4xl mb-4" aria-hidden="true">✨</div>
      <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary)] mb-8">
        Every feature you'll ever need, and more
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

