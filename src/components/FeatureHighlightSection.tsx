import React from "react";
import GetStartedButton from './common/buttons/GetStartedButton'

interface FeatureHighlightSectionProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText?: string;
  imageSrc: string;
  bgClass?: string;
  transparent?: boolean;
}

const FeatureHighlightSection: React.FC<FeatureHighlightSectionProps> = ({
  title,
  subtitle,
  description,
  imageSrc,
  bgClass,
  transparent,
}) => {
  const backgroundClass = bgClass ?? (transparent ? 'bg-transparent' : 'bg-gradient-to-b from-[#DFF1E3] to-[#FFFFFF]');
  return (
    <div className="px-6">
        <section className={`w-full flex flex-col items-center text-center py-12 md:py-20 ${backgroundClass} rounded-3xl overflow-hidden`}>
      {/* Content Section */}
      <div className="max-w-3xl px-4 mb-8 md:mb-12">
        <p className="text-lg text-[#175700] font-semibold mb-5">{subtitle}</p>
        <h2 className="text-5xl md:text-5xl font-semibold text-[#0D1B2A] mb-5">
          {title}
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">{description}</p>
        <GetStartedButton size="sm" widthClass="w-32"/>
      </div>

      {/* Image Section - now in document flow */}
      <div className="w-full max-w-5xl px-4 md:px-8">
        <img
          src={imageSrc}
          alt="feature preview"
          loading="lazy"
          className="w-full h-auto object-contain rounded-lg"
        />
      </div>
    </section>
    </div>
  );
};

export default FeatureHighlightSection;
