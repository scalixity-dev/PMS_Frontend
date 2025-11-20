import React from "react";
import GetStartedButton from "./common/buttons/GetStartedButton";

interface Props {
  title: string;
  description: string;
  buttonText?: string;
  imageSrc: string;
  icon?: React.ReactNode;
  kicker?: string;
}

const SplitHeroFeatureReverseInverse: React.FC<Props> = ({
  title,
  description,
  imageSrc,
  icon,
  kicker,
}) => {
  return (
    <section className="relative w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-16">
      <div className="max-w-7xl mx-auto relative bg-[#85B474] overflow-hidden rounded-lg px-4 sm:px-6 md:px-12 pt-32 sm:pt-36 md:pt-40 pb-20 sm:pb-28 md:pb-32">
        {/* dotted pattern bg (right side) - hide on small screens */}
        <div className="hidden md:block absolute top-0 right-0 bottom-0 w-2/5 md:w-[38%] pointer-events-none translate-x-6 md:translate-x-12">
          <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <pattern
              id="dots2-inv"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="3" cy="3" r="1.5" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots2-inv)" />
          </svg>
        </div>

        {/* Diagonal top edge (inverted) */}
        <div
          className="absolute top-0 left-0 right-0 h-32 bg-white"
          style={{
            clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)',
            transform: 'translateY(-1px) scaleY(-1)'
          }}
        ></div>

  {/* Content */}
  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-8 sm:gap-10 md:gap-16">

          {/* Left text */}
          <div className="text-white order-1 md:order-1 px-1 sm:px-0">
            {(icon || kicker) && (
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                {icon && (
                  <div className="hidden md:flex w-14 h-14 sm:w-16 sm:h-16 items-center justify-center rounded-full bg-white text-[#8CB89A]">
                    {icon}
                  </div>
                )}

                {kicker && (
                  <span className="text-white text-base sm:text-lg md:text-xl font-semibold">
                    {kicker}
                  </span>
                )}
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 md:mb-6 leading-tight text-white">
              {title}
            </h2>

            <p className="text-white/95 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-full md:max-w-xl">
              {description}
            </p>

            <GetStartedButton size="sm" widthClass="w-28 sm:w-32" />
          </div>

          {/* Right image */}
          <div className="flex justify-center md:justify-end order-2 md:order-2">
            <img
              src={imageSrc}
              alt="feature"
              className="rounded-lg shadow-lg w-full max-w-full sm:max-w-[420px] md:max-w-[520px] lg:max-w-[640px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplitHeroFeatureReverseInverse;
