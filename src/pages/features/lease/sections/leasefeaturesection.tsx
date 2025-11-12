// src/pages/features/lease/sections/everyfeaturesection.tsx
import React from "react";
import FeatureHighlightsGrid from "../../../../components/common/FeatureHighlightsGrid";
import { Globe, Layers, Palette, Gift } from "lucide-react";

const EveryFeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Globe />,
      title: "",
      description: "Build an impressive rental listing site with just a few clicks",
    },
    {
      icon: <Layers />,
      title: "",
      description: "List as many rentals as you want—it's all included",
    },
    {
      icon: <Palette />,
      title: "",
      description: "Feature your business logo, contact details, and more",
    },
    {
      icon: <Gift />,
      title: "",
      description: "Free for PMSCloud Pro and Business plans",
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
        <FeatureHighlightsGrid features={features} layout="vertical" align="left" descriptionClassName="text-[18px] text-[#195504]" />
      </div>
    </section>
  );
};

export default EveryFeatureSection;


