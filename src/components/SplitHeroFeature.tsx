import React from "react";
import GetStartedButton from "./common/buttons/GetStartedButton";

interface SplitHeroFeatureProps {
  title: string;
  description: string;
  imageSrc: string;
  icon?: React.ReactNode;
  badgeText?: string;
}

const SplitHeroFeature: React.FC<SplitHeroFeatureProps> = ({
  title,
  description,
  imageSrc,
  icon,
  badgeText,
}) => {
  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 pt-40 py-20 px-6 md:px-20">
      <div className="relative mx-auto max-w-5xl">
        <div className="relative overflow-hidden  bg-[#0CA474] py-28 px-6 md:px-16 lg:px-24">
          {/* Curved white wave at the top */}
          <div className="pointer-events-none absolute -top-px left-0 w-full h-32 z-20">
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0,0 Q720,30 1440,0 L1440,0 L0,0 Z" fill="white" />
            </svg>
          </div>
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
              {(badgeText || icon) && (
                <div className="flex items-center gap-3 mb-4">
                  {badgeText && (
                    <span
                      className="inline-flex items-center rounded-full bg-[#B9E4C8]/50 border border-white/30 px-4 py-1 text-[22px] font-medium leading-[150%] tracking-normal text-white -ml-2"
                    >
                      {badgeText}
                    </span>
                  )}

                  
                </div>
              )}

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
        </div>

        {/* Curved white wave at the bottom */}
        <div className="pointer-events-none absolute -bottom-px left-0 w-full h-32 z-20">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,90 Q720,0 1440,120 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default SplitHeroFeature;