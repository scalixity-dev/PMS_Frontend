import React from "react";
import GetStartedButton from './common/buttons/GetStartedButton'

interface FeatureHighlightSectionProps {
  badge?: string;
  badgeClassName?: string;
  badgeLogo?: React.ReactNode;
  badgeLogoPosition?: 'left' | 'right';
  title: string;
  subtitle: string;
  description: string;
  buttonText?: string;
  imageSrc?: string;
  bgClass?: string;
  transparent?: boolean;
}

const FeatureHighlightSection: React.FC<FeatureHighlightSectionProps> = ({
  badge,
  badgeClassName,
  badgeLogo,
  badgeLogoPosition = 'right',
  title,
  subtitle,
  description,
  imageSrc,
  bgClass,
  transparent,
}) => {
  const backgroundClass = bgClass ?? (transparent ? 'bg-transparent' : 'bg-gradient-to-b from-[#DFF1E3] to-[#FFFFFF]');
  return (
    <div className="px-4 sm:px-6">
        <section className={`w-full flex flex-col items-center text-center py-8 sm:py-12 lg:py-20 ${backgroundClass} rounded-2xl sm:rounded-3xl overflow-hidden`}>
      {/* Content Section */}
      <div className="max-w-3xl px-4 sm:px-6 mb-6 sm:mb-8 lg:mb-12">
        {badge && (
          <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 ${badgeClassName || 'bg-green-100 text-green-700'}`}>
            {badgeLogo && badgeLogoPosition === 'left' && (
              <span className="flex-shrink-0">{badgeLogo}</span>
            )}
            <span>{badge}</span>
            {badgeLogo && badgeLogoPosition === 'right' && (
              <span className="flex-shrink-0">{badgeLogo}</span>
            )}
          </div>
        )}
        <p className="text-sm sm:text-base lg:text-lg text-[#175700] font-semibold mb-3 sm:mb-4 lg:mb-5">{subtitle}</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#0D1B2A] mb-3 sm:mb-4 lg:mb-5">
          {title}
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-4 sm:mb-5 lg:mb-6">{description}</p>
        <GetStartedButton size="sm" widthClass="w-28 sm:w-32"/>
      </div>

      {/* Image Section - now in document flow (render only if imageSrc provided) */}
      {imageSrc && (
        <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <img
            src={imageSrc}
            alt="feature preview"
            loading="lazy"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
      )}
    </section>
    </div>
  );
};

export default FeatureHighlightSection;
