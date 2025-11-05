// src/components/GreenFeaturesSliderSection.tsx
import React from "react";
import GreenFeatureCard from "./common/cards/GreenFeatureCard";
import PaginationButtons from "./common/buttons/PaginationButtons";
import { BarChart2, CreditCard, FileCheck } from "lucide-react";

type FeatureItem = {
  icon: React.ReactNode;
  text: string;
};

interface GreenFeaturesSliderProps {
  data?: FeatureItem[];
}

const defaultData: FeatureItem[] = [
  { icon: <BarChart2 />, text: "Automatic monthly reporting—always included." },
  { icon: <CreditCard />, text: "Report the last 24 months of payments, all at once" },
  { icon: <FileCheck />, text: "Get real-time verification updates with automated tracking." },
];

const GreenFeaturesSliderSection: React.FC<GreenFeaturesSliderProps> = ({ data = defaultData }) => {
  return (
    <section className="max-w-8xl mx-auto w-full py-16 px-6 lg:px-20">
      {/* Header */}
      <div className="flex flex-col items-center md:flex-row md:justify-between mb-12">
        <h2 className="text-[32px] font-semibold text-[#0A0A0A] text-center md:text-left">
          Every feature you’ll ever need, and more
        </h2>

        <PaginationButtons containerClassName="flex gap-2" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item, i) => (
          <GreenFeatureCard key={i} icon={item.icon} text={item.text} />
        ))}
      </div>
    </section>
  );
};

export default GreenFeaturesSliderSection;
