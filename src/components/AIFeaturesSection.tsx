// src/components/AIFeaturesSection.tsx
import React from "react";
import AIFeatureCard from "./common/cards/AIFeatureCard";

interface Feature {
  image?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  titleClassName?: string;
}

interface AIFeaturesSectionProps {
  features: Feature[];
  color?: string; // optional section-level color to apply to all cards
  textColor?: string; // optional text color (CSS color string) to override card title/description
  buttonText?: string; // optional button text override for all cards
}

const AIFeaturesSection: React.FC<AIFeaturesSectionProps> = ({ features, color, textColor, buttonText }) => {
  return (
    <section className="w-full py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-16 px-4 sm:px-6">
        {features.map((feature, index) => (
          <AIFeatureCard key={index} {...feature} color={color} textColor={textColor} buttonText={buttonText} />
        ))}
      </div>
    </section>
  );
};

export default AIFeaturesSection;
