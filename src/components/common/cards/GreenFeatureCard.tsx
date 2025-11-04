// src/components/GreenFeatureCard.tsx
import React from "react";

// Type for Lucide-react icon props (or similar SVG component props)
type IconProps = {
  className?: string;
  size?: number;
  strokeWidth?: number;
};

interface GreenFeatureCardProps {
  icon: React.ReactNode;
  text: string;
}

const GreenFeatureCard: React.FC<GreenFeatureCardProps> = ({ icon, text }) => {
  // Ensure icons always render with consistent color and size
  const processedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<IconProps>, {
        className: "text-[var(--color-primary)]",
        size: 26
      })
    : icon;

  return (
    <div className="border border-[#36C291] border-2 rounded-md p-8 flex flex-col items-start gap-6 min-h-[180px] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center w-14 h-14 rounded-full border border-[#36C291] bg-white shadow-md">
        {processedIcon}
      </div>
      <p className="text-[#21313C] text-lg font-semibold leading-relaxed">{text}</p>
    </div>
  );
};

export default GreenFeatureCard;
