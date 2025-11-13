import React from 'react';
import GetStartedButton from '../../buttons/GetStartedButton';
import LearnMoreButton from '../../buttons/LearnMoreButton';

export interface HeroContentProps {
  badge?: string;
  badgeLogo?: React.ReactNode;
  badgeCentered?: boolean;
  badgeLogoWrapperClassName?: string;
  badgeClassName?: string;
  badgeLogoPosition?: 'left' | 'right';
  title: string | React.ReactNode;
  description: string | React.ReactNode;
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
  isCentered?: boolean;
  sideContentLeft?: React.ReactNode;
  sideContentRight?: React.ReactNode;
  embeddedContent?: React.ReactNode;
}

const HeroContent: React.FC<HeroContentProps> = ({
  badge,
  badgeLogo,
  badgeLogoWrapperClassName,
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
  badgeClassName,
  isCentered = false,
  sideContentLeft,
  sideContentRight,
  badgeLogoPosition = 'right',
  embeddedContent,
}) => {
  const featurePillClassName = "inline-flex items-center justify-center min-w-32 h-10 gap-1 rounded-lg px-4 py-3 border border-white bg-[#819A78] text-white shadow-[0px_4px_4px_0px_#00000040] font-heading font-medium text-sm leading-[150%] tracking-normal";
  const shouldCenter = isCentered || hasSideImages;
  const hasSideContent = Boolean(sideContentLeft || sideContentRight);
  const featuresContainerClass = [
    'flex whitespace-nowrap gap-3 text-sm',
    shouldCenter ? 'justify-center' : '',
    hasSideContent ? 'flex-nowrap overflow-x-auto lg:overflow-visible' : 'flex-wrap',
  ].join(' ').trim();
  const ctaTopMarginClass = embeddedContent ? 'mt-10' : '';

  return (
    <div className={shouldCenter ? 'text-center flex flex-col items-center' : ''}>
      {badge && (
        <div className={`mb-6 flex items-center gap-4 ${badgeCentered || shouldCenter ? 'justify-center' : ''}`}>
          <p className={badgeClassName ? badgeClassName : "font-heading text-2xl text-[#0B696B] font-medium leading-[150%] tracking-normal text-secondary"}>
            <span className="inline-flex items-center gap-3">
              {badgeLogo && badgeLogoPosition === 'left' && (
                <span className={badgeLogoWrapperClassName ?? "inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#CFFBBF] shrink-0 text-primary shadow-[0_4px_0_0_#00000040]"}>
                  {badgeLogo}
                </span>
              )}
              <span>{badge}</span>
              {badgeLogo && badgeLogoPosition === 'right' && (
                <span className={badgeLogoWrapperClassName ?? "inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#CFFBBF] shrink-0 text-primary shadow-[0_4px_0_0_#00000040]"}>
                  {badgeLogo}
                </span>
              )}
            </span>
          </p>
        </div>
      )}

      <h1 className={`${titleMarginBottom} font-heading lg:text-4xl xl:text-5xl font-medium leading-[120%] tracking-normal text-heading ${shouldCenter ? 'text-center' : ''}`}>
        {title}
      </h1>

      {betweenTitleAndDescription}

      <p className={`${descriptionMarginBottom} font-heading font-light lg:text-sm xl:text-base leading-[150%] tracking-normal text-subheading ${shouldCenter ? 'text-center' : ''}`}>
        {description}
      </p>

      {embeddedContent ? (
        <div className={`mt-10 w-full ${shouldCenter ? 'flex justify-center' : ''}`}>
          <div className={`${shouldCenter ? 'w-full max-w-5xl' : ''}`}>
            {embeddedContent}
          </div>
        </div>
      ) : null}

      {sideContentLeft || sideContentRight ? (
        <div className="mt-8 flex w-full flex-col items-center gap-6 lg:flex-row lg:justify-center">
          {sideContentLeft && (
            <div className="flex justify-center lg:justify-start">
              {sideContentLeft}
            </div>
          )}
          <div className={`flex flex-col items-center gap-6 ${ctaTopMarginClass}`}>
            <div className={`flex flex-wrap items-center gap-4 ${shouldCenter ? 'justify-center' : ''}`}>
              {learnMoreLabel && (
                <LearnMoreButton
                  text={learnMoreLabel}
                  onClick={learnMoreHandler}
                  variant="hero"
                  to={learnMoreTo}
                />
              )}
              {getStartedLabel && (
                <GetStartedButton
                  text={getStartedLabel}
                  onClick={getStartedHandler}
                  to={getStartedTo}
                />
              )}
            </div>
            <div className={featuresContainerClass}>
              {features.map((text) => (
                <span key={text} className={featurePillClassName}>{text}</span>
              ))}
            </div>
          </div>
          {sideContentRight && (
            <div className="flex justify-center lg:justify-end">
              {sideContentRight}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={`flex flex-wrap items-center gap-4 ${shouldCenter ? 'justify-center' : ''} ${ctaTopMarginClass}`}>
            {learnMoreLabel && (
              <LearnMoreButton
                text={learnMoreLabel}
                onClick={learnMoreHandler}
                variant="hero"
                to={learnMoreTo}
              />
            )}
            {getStartedLabel && (
              <GetStartedButton
                text={getStartedLabel}
                onClick={getStartedHandler}
                to={getStartedTo}
              />
            )}
          </div>
          <div className={`mt-8 ${featuresContainerClass}`}>
            {features.map((text) => (
              <span key={text} className={featurePillClassName}>{text}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroContent;


