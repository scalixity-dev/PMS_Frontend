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
        size: 20,
      })
    : icon;

  return (
    <div className="border border-[#36C291] border-2 rounded-md p-4 sm:p-8 flex flex-col items-start gap-4 sm:gap-6 min-h-[140px] sm:min-h-[180px] shadow-sm hover:shadow-lg transform transition duration-200 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]">
      <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-[#36C291] bg-white shadow-md">
        {processedIcon}
      </div>
      <p className="text-[#21313C] text-base sm:text-lg font-semibold leading-relaxed">{text}</p>
    </div>
  );
};

export default GreenFeatureCard;
