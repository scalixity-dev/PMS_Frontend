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
  <section className="relative w-full py-16 md:py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto relative bg-[#8CB89A] overflow-hidden px-6 md:px-12 md:pt-16 pb-45">
  {/* dotted pattern bg (left side - moved further left) */}
  <div className="absolute top-0 left-0 bottom-0 w-2/5 md:w-[38%] pointer-events-none -translate-x-6 md:-translate-x-12">
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
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-white"
             style={{
               clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)',
               transform: 'translateY(1px)'
             }}>
        </div>

        {/* Content */}
        <div className="relative z-10 grid md:grid-cols-2 items-center gap-8 md:gap-16">
        
        {/* Left image */}
        <div className="flex justify-center md:justify-start order-2 md:order-1">
          <img
            src={imageSrc}
            alt="feature"
            className="rounded-lg w-full max-w-[500px] object-contain"
          />
        </div>

        {/* Right text */}
        <div className="text-white order-1 md:order-2">
          {icon && (
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white text-[#8CB89A] ml-auto md:ml-0 md:mr-0">
              {icon}
            </div>
          )}

          <h2 className="text-3xl md:text-5xl font-semibold mb-6 leading-tight text-white">
            {title}
          </h2>

          <p className="text-white/95 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
            {description}
          </p>

          <GetStartedButton size="sm" widthClass="w-28"/>
        </div>
        </div>
      </div>
    </section>
  );
};

export default SplitHeroFeatureReverse;
