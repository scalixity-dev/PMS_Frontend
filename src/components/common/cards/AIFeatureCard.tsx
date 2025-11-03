// src/components/AIFeatureCard.tsx
import React from "react";
import LearnMoreGradient from "../buttons/LearnMoreGradient";

interface AIFeatureCardProps {
  image: string;
  title: string;
  description: string;
}

const AIFeatureCard: React.FC<AIFeatureCardProps> = ({ image, title, description }) => {
  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-[#ACE2BF] to-[#FFFFFF] rounded-3xl p-6 text-center hover:shadow-xl transition-shadow duration-300 min-h-[320px]">
      {/* Image */}
    <div className="w-full flex justify-center">
        <img
          src={image}
          alt={title}
          className="rounded-lg max-w-full h-auto object-contain"
        />
      </div>

      {/* Title */}
  <h3 className="font-bold text-2xl text-[#1F2A01] mb-4">{title}</h3>

      {/* Description */}
  <p className="text-gray-500 font-medium text-sm mb-8 max-w-xs">{description}</p>

      {/* Button */}
      <div className="mt-auto w-full">
        <LearnMoreGradient/>
      </div>
    </div>
  );
};

export default AIFeatureCard;
