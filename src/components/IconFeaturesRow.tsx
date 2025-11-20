// src/components/IconFeaturesRow.tsx
import React from "react";
import IconFeatureItem from "./common/cards/IconFeatureItem";

interface IconFeaturesRowProps {
  title: string;
  items: { icon: React.ReactNode; text: string }[];
}

const IconFeaturesRow: React.FC<IconFeaturesRowProps> = ({ title, items }) => {
  return (
    <section className="max-w-8xl py-10 sm:py-12 md:py-16 mx-auto text-center px-4 sm:px-6">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[var(--color-primary)] mb-8 sm:mb-12 md:mb-16">
        {title}
      </h2>

      {/* Items Row */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 justify-center">
        {items.map((item, i) => (
          <div key={i} className="w-full">
            <IconFeatureItem icon={item.icon} text={item.text} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default IconFeaturesRow;
