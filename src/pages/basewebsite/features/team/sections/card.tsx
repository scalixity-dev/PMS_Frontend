import React from "react";
import type { ReactNode } from "react";
import AIFeaturesSection from "../../../../../components/AIFeaturesSection";

interface CardProps {
  children?: ReactNode;
  className?: string;
  innerClassName?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  innerClassName,
}) => {
  const features = [
    {
      title: "Your Description in 3 Easy Steps",
      description: "Add your key details:  kye ai uses your photos, amenities, and listing data to build your description.",
      titleClassName: "pt-8",
    },
    {
      title: "Already have a listing?  kye ai got it.",
      description: "Simply click “edit” on any property listing and  kye ai can enhance your existing text for a stronger first impression.",
      titleClassName: "pt-8",
    },
    {
      title: "Create brilliant descriptions with confidences",
      description: " kye ai helps you do what you already do, just faster (and with a lot less typing). Clean, easily accessible listings mean more clicks, ",
      titleClassName: "pt-4",
    },
  ];

  return (
    <section
      className={`relative w-screen bg-[#CDFFEF] my-24 py-16 overflow-hidden left-1/2 -translate-x-1/2 ${
        className ?? ""
      }`}
    >
      <div className={`max-w-8xl mx-auto px-12 relative z-10 ${innerClassName ?? ""}`}>
        {children}
        <AIFeaturesSection
          features={features}
          color="#B3F5C9"
          textColor="#0F5132"
          buttonText="Learn more"
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(5px 4px 4px rgba(0, 0, 0, 0.25))" }}
        >
          <path d="M0,120 Q720,0 1440,120 L1440,120 L0,120 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default Card;
