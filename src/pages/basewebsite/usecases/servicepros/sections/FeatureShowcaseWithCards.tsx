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
  // map some common image width values to Tailwind classes so we avoid inline styles
  const imageMaxClass = imageMaxWidth === "650px" ? "max-w-[650px]" : imageMaxWidth === "500px" ? "max-w-[500px]" : "";
  return (
    <section
      className={`w-full py-16 px-6 md:px-20 relative ${
        backgroundVectorSrc ? (reverse ? '-ml-2 overflow-visible' : '-mr-2 overflow-visible') : 'overflow-hidden'
      } ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      {/* Background Vector - Positioned relative to viewport edge */}
      {backgroundVectorSrc && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-0 ${reverse ? 'left-[-0.5rem] bg-left' : 'right-[-0.5rem] bg-right'} bg-contain bg-no-repeat bg-center w-[50vw] h-[80%] min-h-[450px]`}
          style={{ backgroundImage: `url(${backgroundVectorSrc})` }}
        />
      )}

      <div
        className={`max-w-7xl mx-auto flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-start justify-between gap-8 md:gap-12 relative z-10`}
      >
        {/* Content Section - Left Side */}
        <div className="w-full md:w-[45%] flex flex-col z-10">
          {eyebrow && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#E8F5E9] text-[#1F2937] mb-4 self-start">
              {eyebrow}
            </span>
          )}

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1F2937] leading-tight mb-4">
            {heading}
          </h2>

          <p className="text-[#4B5563] text-base md:text-lg leading-relaxed mb-8">
            {description}
          </p>

          {/* Feature Cards - 2x2 Grid with Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-start gap-3">
                <div className="bg-[#CDEBC3] rounded-2xl p-4 w-12 h-12 flex items-center justify-center shadow-sm flex-shrink-0">
                  <div className="text-[#081029]">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex flex-col gap-1 max-w-[12rem]">
                  <h3 className="font-semibold text-[#1F2937] text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
            
            {/* CTA Button in 2nd row, 2nd column */}
            <div className="flex items-center justify-start">
              <GetStartedButton
                text={buttonText}
                size="sm"
                to={buttonLink !== "#" ? buttonLink : undefined}
              />
            </div>
          </div>
        </div>

        {/* Image Section - Right Side */}
        <div className="relative w-full md:w-[55%] flex items-center justify-center md:justify-end min-h-[500px]">
          {/* Main Content Image */}
          <div
            className={`relative z-10 w-full ${imageMaxClass} ${pushImageOuter ? (reverse ? 'mr-auto' : 'ml-auto') : 'ml-auto'}`}
          >
            <img src={imageSrc} alt={heading} className="w-full rounded-2xl shadow-md object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcaseWithCards;
