// src/components/EveryFeatureSection.tsx
import React from "react";
import FeatureHighlightsGrid from "../../../../components/common/FeatureHighlightsGrid";
import { Search, TrendingUp, Wand, ClipboardCheck } from "lucide-react";

const EveryFeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Search />,
      title: "Precision You Can Trust",
      description: "99.9% background check accuracy",
    },
    {
      icon: <ClipboardCheck />,
      title: "Flexible Plans. Bigger Savings",
      description: "Save more with flexible bundles and add-ons",
    },
    {
      icon: <TrendingUp />,
      title: "Predict Smarter with AI",
      description:
        "ResidentScore® uses AI to deliver 15% better eviction risk prediction.",
    },
    {
      icon: <Wand />,
      title: "One Click to Verify with AI",
      description:
        "Fast and easy—run instant verifications right from the application.",
    },
  ];

  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-20 py-8 flex flex-col lg:flex-row items-center justify-between gap-10">
  <div className="lg:w-2/5 space-y-6 px-2 sm:px-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] leading-snug">
            Every feature you’ll ever need, and more
          </h2>
        </div>
        <p className="text-gray-600 leading-relaxed">
          From listing and leasing to rent collection and maintenance — everything is built right in. Manage Pms, track finances, and automate daily tasks effortlessly.
        </p>
      </div>
    
      <div className="lg:w-3/5 w-full">
        <FeatureHighlightsGrid features={features} />
      </div>
    </section>
  );
};

export default EveryFeatureSection;
