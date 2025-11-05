// src/components/AIFeatureCard.tsx
import React from "react";
import LearnMoreGradient from "../buttons/LearnMoreGradient";

interface AIFeatureCardProps {
  image?: string; // optional — some cards may not have an image
  title: string;
  description: string;
  color?: string; // optional solid background color (CSS color string)
  textColor?: string; // optional text color for title & description (CSS color string)
  buttonText?: string; // optional override for the card button text
}

const AIFeatureCard: React.FC<AIFeatureCardProps> = ({ image, title, description, color, textColor, buttonText }) => {
  const containerClass = `flex flex-col items-center rounded-3xl p-6 text-center hover:shadow-xl transition-shadow duration-300 min-h-[320px]`;
  const gradientClasses = "bg-gradient-to-b from-[#ACE2BF] to-[#FFFFFF]";

  return (
    <div className={containerClass + (color ? "" : ` ${gradientClasses}`)} style={color ? { backgroundColor: color } : undefined}>
      {/* Image (optional) */}
      {image ? (
        <div className="w-full flex justify-center">
          <img src={image} alt={title} className="rounded-lg max-w-full h-auto object-contain" />
        </div>
      ) : null}

      {/* Title */}
  <h3 className="font-bold text-2xl text-[#1F2A01] mb-4" style={textColor ? { color: textColor } : undefined}>{title}</h3>

      {/* Description */}
  <p className="text-gray-500 font-medium text-sm mb-8 max-w-xs" style={textColor ? { color: textColor } : undefined}>{description}</p>

      {/* Button */}
      <div className="mt-auto w-full">
        <LearnMoreGradient text={buttonText} />
      </div>
    </div>
  );
};

export default AIFeatureCard;
