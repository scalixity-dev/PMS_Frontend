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
  buttonTo?: string; // optional link destination for the button
}

const AIFeaturesSection: React.FC<AIFeaturesSectionProps> = ({ features, color, textColor, buttonText, buttonTo }) => {
  return (
    <section className="w-full py-6 sm:py-8 md:py-10 lg:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-16 px-4 sm:px-6 auto-rows-fr">
        {features.map((feature, index) => (
          <div key={index} className="w-full h-full">
            <AIFeatureCard {...feature} color={color} textColor={textColor} buttonText={buttonText} buttonTo={buttonTo} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AIFeaturesSection;
