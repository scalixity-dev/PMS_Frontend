import React from "react";
import GetStartedButton from "./common/buttons/GetStartedButton";

interface SplitHeroFeatureProps {
  title: string;
  description: string;
  imageSrc: string;
}

const SplitHeroFeature: React.FC<SplitHeroFeatureProps> = ({
  title,
  description,
  imageSrc,
}) => {
  return (
  <section className="relative w-screen left-1/2 -translate-x-1/2 py-40 px-6 md:px-32 bg-[#0CA474] overflow-hidden">
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
          {/* Draw dots only on the right 45% */}
          <rect x="55%" y="0" width="45%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <div className="text-white max-w-lg">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">
            {title}
          </h2>

          <p className="text-white/90 text-sm md:text-lg font-normal mb-16 leading-relaxed">
            {description}
          </p>

          <GetStartedButton size="sm" widthClass="w-32" />
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <img
            src={imageSrc}
            alt="feature preview"
            className="shadow-xl w-full max-w-[760px] md:max-w-[720px] lg:max-w-[860px] object-contain border border-white/30"
          />
        </div>
      </div>
    </section>
  );
};

export default SplitHeroFeature;
