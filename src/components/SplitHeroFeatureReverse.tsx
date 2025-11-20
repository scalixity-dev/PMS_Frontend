import React from "react";
import GetStartedButton from "./common/buttons/GetStartedButton";

interface Props {
  title: string;
  description: string;
  buttonText?: string;
  imageSrc: string;
  icon?: React.ReactNode;
}

const SplitHeroFeatureReverse: React.FC<Props> = ({
  title,
  description,
  imageSrc,
  icon,
}) => {
  return (
  <section className="relative w-full max-w-7xl mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="relative bg-[#8CB89A] overflow-hidden rounded-lg px-4 sm:px-6 md:px-12 pt-8 md:pt-12 pb-32 md:pb-40">
  {/* dotted pattern bg (left side) - hide on small screens */}
  <div className="hidden md:block absolute top-0 left-0 bottom-0 w-2/5 md:w-[38%] pointer-events-none -translate-x-6 md:-translate-x-12">
  <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <pattern
            id="dots2"
            x="0"
            y="0"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="1.5" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots2)" />
        </svg>
      </div>

        {/* Diagonal bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-white"
             style={{
               clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)',
               transform: 'translateY(1px)'
             }}>
        </div>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-8 sm:gap-10 md:gap-16">
        
        {/* Left image (show first on mobile) */}
        <div className="flex justify-center md:justify-start order-1 md:order-1">
          <img
            src={imageSrc}
            alt="feature"
            className="rounded-lg w-full max-w-full sm:max-w-[420px] md:max-w-[520px] lg:max-w-[640px] object-contain"
          />
        </div>

        {/* Right text */}
        <div className="text-white order-2 md:order-2 px-1 sm:px-0">
          {icon && (
            <div className="hidden md:flex w-14 h-14 sm:w-16 sm:h-16 items-center justify-center rounded-full bg-white text-[#8CB89A] ml-auto md:ml-0 md:mr-0 mb-3">
              {icon}
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 leading-tight text-white">
            {title}
          </h2>

          <p className="text-white/95 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-full md:max-w-xl">
            {description}
          </p>

          <GetStartedButton size="sm" widthClass="w-28 sm:w-32"/>
        </div>
        </div>
      </div>
    </section>
  );
};

export default SplitHeroFeatureReverse;
