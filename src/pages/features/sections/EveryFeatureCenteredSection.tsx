// src/components/EveryFeatureCenteredSection.tsx
import React from "react";
import FeatureHighlightsGrid from "../../../components/common/FeatureHighlightsGrid";
import { RefreshCw, Search, Lock, Users } from "lucide-react";

const EveryFeatureCenteredSection: React.FC = () => {
  const features = [
    {
      icon: <RefreshCw />,
      title: "Manage everything from screening to verification in one platform.",
      description: "",
    },
    {
      icon: <Search />,
      title: "Start instant AI-powered onboarding right from the application.",
      description: "",
    },
    {
      icon: <Lock />,
      title: "All-in-one AI listing platform for seamless leasing.",
      description: "",
    },
    {
      icon: <Users />,
      title: "Boost applications effortlessly with smart AI automation.",
      description: "",
    },
  ];

  return (
    <section className="w-full py-20 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-8">
        Every feature you’ll ever need, and more
      </h2>
      <p className="text-gray-600 mb-10 px-4 sm:px-0 max-w-3xl mx-auto">
        From listing and leasing to rent collection and maintenance — everything is built right in. Manage Pms, track finances, and automate daily tasks effortlessly.
      </p>

      <div className="max-w-5xl mx-auto px-4">
        <div className="border border-8 rounded-xl border-[var(--color-primary)]">
          <FeatureHighlightsGrid features={features} layout="vertical" />
        </div>
      </div>
    </section>
  );
};

export default EveryFeatureCenteredSection;
