import React from "react";
import GetStartedButton from "./common/buttons/GetStartedButton";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SplitHeroFeatureProps {
  title: string;
  description: string;
  imageSrc: string;
  secondaryImageSrc?: string;
  secondaryImageAlt?: string;
  icon?: React.ReactNode;
  badgeText?: string;
  backgroundClassName?: string;
  secondaryImageBackgroundClassName?: string;
  features?: FeatureItem[];
}

const SplitHeroFeature: React.FC<SplitHeroFeatureProps> = ({
  title,
  description,
  imageSrc,
  secondaryImageSrc,
  secondaryImageAlt,
  icon,
  badgeText,
  backgroundClassName,
  secondaryImageBackgroundClassName,
  features,
}) => {
  const appliedBackgroundClass =
    backgroundClassName ?? "bg-[#0CA474]";
  const secondaryBackgroundClass =
    secondaryImageBackgroundClassName ?? appliedBackgroundClass;

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 pt-20 py-20 px-6 md:px-0">
      <div className="relative mx-auto max-w-7xl">
        <div
          className={`relative overflow-hidden py-28 px-6 md:px-16 lg:px-16 ${appliedBackgroundClass}`}
        >
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
          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-start">
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

              <p className="text-white/90 text-sm md:text-lg font-normal mb-10 leading-relaxed">
                {description}
              </p>

              {features && features.length > 0 && (
                <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div
                      key={`${feature.title}-${index}`}
                      className="flex items-start gap-4"
                    >
                      <div className="bg-[#CDEBC3] rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-sm shrink-0">
                        <div className="text-[#081029]">{feature.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#1F2937] leading-snug">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm text-[#FFFFFF]/71 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <GetStartedButton size="sm" widthClass="w-32" />
            </div>

            {/* Right Image */}
            <div className="flex justify-center md:justify-end">
              <div className={secondaryImageSrc ? "relative" : undefined}>
                <img
                  src={imageSrc}
                  alt="feature preview"
                  className=" w-full max-w-[760px] md:max-w-[720px] lg:max-w-[860px] object-contain  "
                />
                {secondaryImageSrc && (
                  <img
                    src={secondaryImageSrc}
                    alt={secondaryImageAlt ?? "additional feature preview"}
                    className={`shadow-xl w-40 md:w-48 lg:w-56 object-contain border border-white/30 rounded-3xl absolute -bottom-10 -left-10 md:-left-16 ${secondaryBackgroundClass}`}
                  />
                )}
              </div>
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
              d="M0,90 Q720,0 1440,90 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default SplitHeroFeature;