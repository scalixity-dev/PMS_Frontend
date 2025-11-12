
import React from "react";
import FeatureHighlightsGrid from "../../../../components/common/FeatureHighlightsGrid";
import { BarChart3, Filter, Download, Users } from "lucide-react";

const EveryFeatureSection: React.FC = () => {
  const features = [
    {
      icon: <BarChart3 />,
      title: "",
      description: "Track every detail with customizable financial and property reports",
    },
    {
      icon: <Filter />,
      title: "",
      description: "Filter with precision by report type, date, property, and more",
    },
    {
      icon: <Download />,
      title: "",
      description: "Export or sync with ease to PDF, Excel, or QuickBooks",
    },
    {
      icon: <Users />,
      title: "",
      description: "Trusted by users—60% rely on Rent Roll daily, and 75% use monthly",
    },
  ];

  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-12 py-8 flex flex-col lg:flex-row items-center justify-between gap-10">
      <div className="lg:w-2/5 space-y-6 px-2 sm:px-4">
        <div className="flex flex-col space-y-2">
          <div className="text-4xl">✨</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] leading-snug">
            Every feature you'll ever need, and more
          </h2>
        </div>
        
      </div>

      <div className="lg:w-3/5 w-full">
        <FeatureHighlightsGrid features={features} layout="vertical" align="left" descriptionClassName="text-[18px] text-[#195504]" />
      </div>
    </section>
  );
};

export default EveryFeatureSection;


