import React from "react";
// import GetStartedButton from "./common/buttons/GetStartedButton"; // Mocked
const GetStartedButton: React.FC<{
  size?: string;
  widthClass?: string;
  to?: string;
  className?: string;
  text?: string;
}> = ({ text = "Get Started", className, widthClass, to }) => (
  <a
    href={to || "#"}
    className={`inline-block px-5 py-2.5 font-semibold text-white bg-[#3D7475] rounded-lg border border-white shadow-md hover:bg-[#2c5858] transition-colors ${
      widthClass || ""
    } ${className || ""}`}
  >
    {text}
  </a>
);

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
  badgeVariant?: "default" | "elevated"; // Kept from V1
  backgroundClassName?: string;
  secondaryImageBackgroundClassName?: string;
  innerSpacingClassName?: string; // Kept from V1
  imageWrapperClassName?: string; // Kept from V1
  allowContentOverflow?: boolean; // Kept from V1
  imageBackgroundSrc?: string; // Kept from V1
  imageBackgroundClassName?: string; // Kept from V1
  outerMaxWidthClassName?: string; // Kept from V1
  features?: FeatureItem[];
}

type IconElementProps = {
  className?: string;
  strokeWidth?: number;
};

const SplitHeroFeature: React.FC<SplitHeroFeatureProps> = ({
  title,
  description,
  imageSrc,
  secondaryImageSrc,
  secondaryImageAlt,
  icon,
  badgeText,
  badgeVariant = "default", // Kept from V1
  backgroundClassName,
  secondaryImageBackgroundClassName,
  innerSpacingClassName, // Kept from V1
  imageWrapperClassName, // Kept from V1
  allowContentOverflow, // Kept from V1
  imageBackgroundSrc, // Kept from V1
  imageBackgroundClassName, // Kept from V1
  outerMaxWidthClassName, // Kept from V1
  features,
}) => {
  const appliedBackgroundClass = backgroundClassName ?? "bg-[#0CA474]";
  const secondaryBackgroundClass =
    secondaryImageBackgroundClassName ?? appliedBackgroundClass;
  // Kept V1 logic
  const innerSpacingClass =
    innerSpacingClassName ??
    "pt-12 pb-40 sm:pt-20 sm:pb-48 md:pt-28 md:pb-56 px-4 sm:px-6 md:px-12 lg:px-16";
  const outerMaxWidthClass = outerMaxWidthClassName ?? "max-w-7xl";

  // Kept from V1
  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    if (React.isValidElement(icon)) {
      const iconElement = icon as React.ReactElement<IconElementProps>;
      const existingClassName = iconElement.props.className ?? "";

      return React.cloneElement(iconElement, {
        className: `w-8 h-8 ${existingClassName}`.trim(),
        strokeWidth: iconElement.props.strokeWidth ?? 1.8,
      });
    }

    return icon;
  };

  return (
    <section className="relative w-full py-8 sm:py-12 lg:py-20 px-4 sm:px-6">
      <div className={`relative mx-auto ${outerMaxWidthClass}`}>
        <div
          className={`relative ${
            allowContentOverflow ? "overflow-visible" : "overflow-hidden"
          } ${innerSpacingClass} ${appliedBackgroundClass}`}
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
          {/* Dotted Background (hidden on small screens) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
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
          {/* Mobile-first: stack, become two-column at md */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start">
            {/* Left Content */}
            <div className="text-white max-w-lg">
              {/* Kept V1 logic */}
              {(badgeText || (badgeVariant === "elevated" && icon)) && (
                <div
                  className={`flex items-center ${
                    badgeVariant === "elevated" ? "gap-4 mb-6" : "gap-3 mb-4"
                  }`}
                >
                  {/* Kept V1 logic */}
                  {badgeVariant === "elevated" && icon && (
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white border border-white/60 text-[#0C6A58] shadow-lg shadow-black/10">
                      {renderIcon()}
                    </div>
                  )}
                  {badgeText && (
                    <>
                      {/* Kept V1 logic */}
                      {badgeVariant === "elevated" ? (
                        <span className="inline-flex items-center rounded-sm bg-white/95 border border-white/60 px-5 py-2 text-sm md:text-base font-semibold tracking-wide text-[#0C6A58] shadow-lg shadow-black/10">
                          {badgeText}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-[#B9E4C8]/50 border border-white/30 px-4 py-1 text-[22px] font-medium leading-[150%] tracking-normal text-white -ml-2">
                          {badgeText}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}

              <h2 className="text-3xl lg:text-4xl font-semibold mb-4 leading-tight">
                {title}
              </h2>

              <p className="text-white/90 text-sm lg:text-lg font-normal mb-10 leading-relaxed">
                {description}
              </p>

              {features && features.length > 0 && (
                <div className="mb-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div
                      key={`${feature.title}-${index}`}
                      className="flex items-start gap-4"
                    >
                      <div className="bg-[#CDEBC3] rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-sm shrink-0">
                        <div className="text-[#081029]">{feature.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white leading-snug">
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

              {/* Kept V1 component call */}
              <GetStartedButton size="sm" widthClass="w-32" />
            </div>

            {/* Right Image */}
            <div className="flex justify-center md:justify-end">
              <div
                // Kept V1 logic
                className={[
                  secondaryImageSrc || imageBackgroundSrc ? "relative" : "",
                  imageWrapperClassName ?? "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Kept V1 logic */}
                {imageBackgroundSrc && (
                  <img
                    src={imageBackgroundSrc}
                    alt=""
                    aria-hidden="true"
                    className={`absolute ${imageBackgroundClassName ?? ""}`.trim()}
                  />
                )}
                <img
                  src={imageSrc}
                  alt="feature preview"
                  className="w-full max-w-full sm:max-w-[520px] md:max-w-[720px] lg:max-w-[860px] object-contain"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/860x600/88AF95/FFFFFF?text=Feature+Preview")
                  }
                />
                {/* Kept V1 logic */}
                {secondaryImageSrc && (
                  <img
                    src={secondaryImageSrc}
                    alt={secondaryImageAlt ?? "additional feature preview"}
                    className={`hidden sm:block shadow-xl w-40 sm:w-48 lg:w-56 object-contain border border-white/30 rounded-3xl absolute -bottom-10 -left-10 lg:-left-16 ${secondaryBackgroundClass}`}
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/224x150/88AF95/FFFFFF?text=Details")
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Curved white wave at the bottom */}
        <div className="pointer-events-none absolute -bottom-px left-0 w-full h-15 md:h-20 lg:h-32 z-20">
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