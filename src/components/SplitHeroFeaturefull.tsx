


import React from "react";
import GetStartedButton from "./common/buttons/GetStartedButton";

interface SplitHeroFeaturefullProps {
  title: string;
  description: string;
  imageSrc: string;
  icon?: React.ReactNode;
}

const SplitHeroFeaturefull: React.FC<SplitHeroFeaturefullProps> = ({
  title,
  description,
  imageSrc,
  icon,
}) => {
  return (
  <section className="relative w-screen left-1/2 -translate-x-1/2 py-12 sm:py-20 md:py-32 lg:py-40 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 bg-[#0CA474] overflow-hidden">
      {/* Dotted Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern
            id="dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
          {/* Draw dots only on the right 45% on larger screens */}
          <rect x="55%" y="0" width="45%" height="100%" fill="url(#dots)" className="hidden md:block" />
        </svg>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center max-w-7xl mx-auto">
        
        {/* Left Content */}
        <div className="text-white max-w-full md:max-w-lg order-2 md:order-1">
          {/* Optional icon passed via prop (renders above the heading) */}
          {icon && <div className="mb-3 sm:mb-4">{icon}</div>}

          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4 leading-tight">
            {title}
          </h2>

          <p className="text-white/90 text-sm sm:text-base md:text-base lg:text-lg font-normal mb-8 sm:mb-12 md:mb-16 leading-relaxed">
            {description}
          </p>

          <GetStartedButton size="sm" widthClass="w-32 sm:w-36 md:w-32" />
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end order-1 md:order-2">
          <img
            src={imageSrc}
            alt="feature preview"
            className="shadow-xl w-full max-w-full sm:max-w-[600px] md:max-w-[720px] lg:max-w-[860px] object-contain border border-white/30 rounded-sm"
          />
        </div>
      </div>
    </section>
  );
};

export default SplitHeroFeaturefull;
