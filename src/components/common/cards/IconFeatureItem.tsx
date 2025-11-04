// src/components/IconFeatureItem.tsx
import React from "react";

interface IconFeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

const IconFeatureItem: React.FC<IconFeatureItemProps> = ({ icon, text }) => {
  // If the passed icon is a React element (e.g., a lucide-react icon),
  // clone it and reduce its stroke width and size so it appears lighter.
  const processedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, ({ strokeWidth: 1.5, size: 24 } as any))
    : icon;

  return (
    <div className="flex flex-col items-center text-center gap-3">
      {/* Icon wrapper with offset shadow */}
      <div className="relative w-14 h-14">
        {/* offset shadow circle behind the icon */}
        <div className="absolute left-0 top-0 w-14 h-14 rounded-full bg-gray-300/90 transform translate-y-1" />

        {/* main icon circle (on top) */}
        <div className="relative z-10 w-14 h-14 flex items-center justify-center rounded-full bg-[#D8F5C8]">
          <span className="text-[var(--color-primary)] text-3xl">{processedIcon}</span>
        </div>
      </div>

      {/* Text */}
      <p className="text-[#195504] text-lg font-semibold leading-relaxed max-w-xs">
        {text}
      </p>
    </div>
  );
};

export default IconFeatureItem;
