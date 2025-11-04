// src/components/GreenFeatureCard.tsx
import React from "react";

interface GreenFeatureCardProps {
  icon: React.ReactNode;
  text: string;
}

const GreenFeatureCard: React.FC<GreenFeatureCardProps> = ({ icon, text }) => {
  return (
    <div className="border border-[#36C291] border-2 rounded-md p-8 flex flex-col items-start gap-6 min-h-[180px] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center w-14 h-14 rounded-full border border-[#36C291] bg-white shadow-md">
        {icon}
      </div>
      <p className="text-[#21313C] text-lg font-semibold leading-relaxed">{text}</p>
    </div>
  );
};

export default GreenFeatureCard;
