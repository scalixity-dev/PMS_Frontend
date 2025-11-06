import React from 'react';
import GetStartedButton from '../../buttons/GetStartedButton';
import LearnMoreButton from '../../buttons/LearnMoreButton';

export interface HeroContentProps {
  badge?: string;
  badgeLogo?: React.ReactNode;
  badgeCentered?: boolean;
  title: string | React.ReactNode;
  description: string;
  features: readonly string[];
  betweenTitleAndDescription?: React.ReactNode;
  learnMoreLabel?: string;
  getStartedLabel?: string;
  learnMoreHandler?: () => void;
  getStartedHandler?: () => void;
  learnMoreTo?: string;
  getStartedTo?: string;
  hasSideImages: boolean;
  titleMarginBottom?: string;
  descriptionMarginBottom?: string;
}

const HeroContent: React.FC<HeroContentProps> = ({
  badge,
  badgeLogo,
  badgeCentered = false,
  title,
  description,
  features,
  betweenTitleAndDescription,
  learnMoreLabel = 'Learn More',
  getStartedLabel = 'Get Started',
  learnMoreHandler,
  getStartedHandler,
  learnMoreTo,
  getStartedTo,
  hasSideImages,
  titleMarginBottom = 'mb-6',
  descriptionMarginBottom = 'mb-14',
}) => {
  const badgeClassName = "inline-flex items-center justify-center min-w-32 h-10 gap-1 rounded-lg px-4 py-3 border border-white bg-[#819A78] text-white shadow-[0px_4px_4px_0px_#00000040] font-heading font-medium text-sm leading-[150%] tracking-normal";

  return (
    <div>
      {badge && (
        <div className={`mb-6 flex items-center gap-4 ${badgeCentered ? 'justify-center' : ''}`}>
          <p className="font-heading text-2xl text-[#0B696B] font-medium leading-[150%] tracking-normal text-secondary">
            {badge}
          </p>
          {badgeLogo && (
            <div className="w-8 h-8 rounded-full bg-[#CFFBBF] flex items-center justify-center shrink-0 text-[var(--color-primary)] shadow-[0_4px_0_0_#00000040]">
              {badgeLogo}
            </div>
          )}
        </div>
      )}

      <h1 className={`${titleMarginBottom} font-heading lg:text-4xl xl:text-5xl font-medium leading-[120%] tracking-normal text-heading`}>
        {title}
      </h1>

      {betweenTitleAndDescription}

      <p className={`${descriptionMarginBottom} font-heading font-light lg:text-sm xl:text-base leading-[150%] tracking-normal text-subheading`}>
        {description}
      </p>

      <div className={`flex flex-wrap items-center gap-4 ${hasSideImages ? 'justify-center' : ''}`}>
        {learnMoreLabel && (
          <LearnMoreButton
            text={learnMoreLabel}
            onClick={learnMoreHandler}
            variant="hero"
            to={learnMoreTo}
          />
        )}
        <GetStartedButton
          text={getStartedLabel}
          onClick={getStartedHandler}
          to={getStartedTo}
        />
      </div>

      <div className={`mt-8 flex flex-wrap whitespace-nowrap gap-3 text-sm ${hasSideImages ? 'justify-center' : ''}`}>
        {features.map((text) => (
          <span key={text} className={badgeClassName}>{text}</span>
        ))}
      </div>
    </div>
  );
};

export default HeroContent;


