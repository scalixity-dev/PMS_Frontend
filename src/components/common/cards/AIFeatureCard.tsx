// src/components/AIFeatureCard.tsx
import React from "react";
import LearnMoreGradient from "../buttons/LearnMoreGradient";

interface AIFeatureCardProps {
  image?: string; // optional — some cards may not have an image
  icon?: React.ReactNode; // optional — render icon instead of image when provided
  title: string;
  description: string;
  color?: string; // optional solid background color (CSS color string)
  textColor?: string; // optional text color for title & description (CSS color string)
  buttonText?: string; // optional override for the card button text
  titleClassName?: string; // optional extra classes for the title element
  buttonTo?: string; // optional link destination for the button
}

const AIFeatureCard: React.FC<AIFeatureCardProps> = ({ image, icon, title, description, color, textColor, buttonText, titleClassName, buttonTo }) => {
  const containerClass = `flex flex-col items-center rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center hover:shadow-xl transition-shadow duration-300 h-full`;
  const gradientClasses = "bg-gradient-to-b from-[#ACE2BF] to-[#FFFFFF]";
  const titleClasses = ["font-bold", "text-xl", "sm:text-2xl", "text-[#1F2A01]", "mb-3", "sm:mb-4"];

  if (titleClassName) {
    titleClasses.push(titleClassName);
  }

  return (
    <div className={containerClass + (color ? "" : ` ${gradientClasses}`)} style={color ? { backgroundColor: color } : undefined}>
      {/* Image (optional) */}
      {icon ? (
        <div className="w-full flex justify-center mb-3 sm:mb-4 shrink-0">
          <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/60">{icon}</div>
        </div>
      ) : image ? (
        <div className="w-full flex justify-center mb-3 sm:mb-4 shrink-0 h-24 sm:h-28">
          <img src={image} alt={title} className="rounded-lg w-full h-full object-contain" />
        </div>
      ) : (
        <div className="w-full flex justify-center mb-3 sm:mb-4 shrink-0 h-24 sm:h-28"></div>
      )}

      {/* Title */}
      <h3 className={titleClasses.join(" ") + " shrink-0"} style={textColor ? { color: textColor } : undefined}>{title}</h3>

      {/* Description */}
      <p className="text-gray-500 font-medium text-xs sm:text-sm mb-6 sm:mb-8 grow w-full px-2" style={textColor ? { color: textColor } : undefined}>{description}</p>

      {/* Button */}
      <div className="mt-auto w-full flex justify-center shrink-0">
        <LearnMoreGradient text={buttonText} to={buttonTo} />
      </div>
    </div>
  );
};

export default AIFeatureCard;
