import React from "react";
import GetStartedButton from "../../../../../components/common/buttons/GetStartedButton";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureShowcaseWithCardsProps {
  reverse?: boolean; // Swap image and content sides
  eyebrow?: string; // Small tag above heading
  heading: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  imageSrc: string; // Main content image
  backgroundVectorSrc?: string; // Optional background vector image
  features: Feature[];
  backgroundColor?: string; // Background color for the section
  className?: string;
  imageMaxWidth?: string; // Max width for the image (e.g., "500px", "650px")
  pushImageOuter?: boolean; // Push image more to the outer edge
}

const FeatureShowcaseWithCards: React.FC<FeatureShowcaseWithCardsProps> = ({
  reverse = false,
  eyebrow,
  heading,
  description,
  buttonText,
  buttonLink = "#",
  imageSrc,
  backgroundVectorSrc,
  features,
  backgroundColor,
  className = "",
  imageMaxWidth = "650px",
  pushImageOuter = false,
}) => {
  const imageMaxClass = imageMaxWidth === "650px" ? "max-w-[650px]" : imageMaxWidth === "500px" ? "max-w-[500px]" : "";
  return (
    <section
      className={`w-full py-12 sm:py-20 px-6 sm:px-10 md:px-16 lg:px-20 relative overflow-hidden ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      {/* Background Vector - Hidden on mobile/tablet, appears on desktop */}
      {backgroundVectorSrc && (
        <div
          className={`hidden lg:block absolute top-1/2 -translate-y-1/2 z-0 ${
            reverse ? 'left-[-0.5rem] bg-left' : 'right-[-0.5rem] bg-right'
          } bg-contain bg-no-repeat bg-center w-1/2 h-4/5 min-h-[28.125rem]`}
          style={{ backgroundImage: `url(${backgroundVectorSrc})` }}
        />
      )}

      <div
        className={`max-w-7xl mx-auto flex flex-col ${
          reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } items-start justify-between gap-12 lg:gap-20 relative z-10`}
      >
        {/* --- CONTENT COLUMN (Left on LG) --- */}
        {/* This column contains text, and the mobile/tablet-only image */}
        <div className="w-full lg:w-[45%] flex flex-col z-10">
          {/* Top Text Part */}
          {eyebrow && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#E8F5E9] text-[#1F2937] mb-4 self-start">
              {eyebrow}
            </span>
          )}

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1F2937] leading-tight mb-5">
            {heading}
          </h2>

          <p className="text-[#4B5563] text-base md:text-lg leading-relaxed mb-3">
            {description}
          </p>

          {/* --- IMAGE (Mobile/Tablet Only) --- */}
          <div className="relative w-full flex items-center justify-center min-h-[18.75rem] sm:min-h-[25rem] lg:hidden mb-3">
            <div className={`relative z-10 w-full ${imageMaxClass}`}>
              <img 
                src={imageSrc} 
                alt={heading} 
                className="w-full rounded-2xl shadow-lg object-cover" 
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x500/cccccc/333333?text=Image+Error')}
              />
            </div>
          </div>

          {/* Bottom Content Part */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-start gap-3">
                <div className="bg-[#CDEBC3] rounded-xl p-3 w-12 h-12 flex items-center justify-center shadow-sm flex-shrink-0">
                  <div className="text-[#081029]">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-[#1F2937] text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-start mt-8 md:mt-10">
            <GetStartedButton
              text={buttonText}
              size="sm"
              to={buttonLink !== '#' ? buttonLink : undefined}
            />
          </div>
        </div>

        {/* --- IMAGE (Desktop Only) --- */}
        <div className="relative w-full lg:w-3/5 hidden lg:flex items-center justify-center lg:justify-end lg:min-h-[31.25rem]">
          <div
            className={`relative z-10 w-full ${imageMaxClass} ${
              pushImageOuter ? (reverse ? 'lg:mr-auto' : 'lg:ml-auto') : 'lg:ml-auto'
            }`}
          >
            <img 
              src={imageSrc} 
              alt={heading} 
              className="w-full rounded-2xl shadow-lg object-cover" 
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x500/cccccc/333333?text=Image+Error')}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcaseWithCards;
