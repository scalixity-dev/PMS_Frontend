// src/components/IconFeaturesRow.tsx
import React from "react";
import IconFeatureItem from "./common/cards/IconFeatureItem";

interface IconFeaturesRowProps {
  title: string;
  items: { icon: React.ReactNode; text: string }[];
}

const IconFeaturesRow: React.FC<IconFeaturesRowProps> = ({ title, items }) => {
  return (
    <section className="max-w-8xl py-16 mx-auto text-center">
      {/* Title */}
      <h2 className="text-2xl sm:text-4xl font-semibold text-[var(--color-primary)] mb-16">
        {title}
      </h2>

      {/* Items Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-center">
        {items.map((item, i) => (
          <IconFeatureItem key={i} icon={item.icon} text={item.text} />
        ))}
      </div>
    </section>
  );
};

export default IconFeaturesRow;
