// src/components/AIFeaturesSection.tsx
import React from "react";
import AIFeatureCard from "./common/cards/AIFeatureCard";

interface Feature {
  image: string;
  title: string;
  description: string;
}

interface AIFeaturesSectionProps {
  features: Feature[];
}

const AIFeaturesSection: React.FC<AIFeaturesSectionProps> = ({ features }) => {
  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 px-6">
        {features.map((feature, index) => (
          <AIFeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default AIFeaturesSection;
