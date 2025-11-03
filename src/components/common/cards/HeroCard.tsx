import React from 'react';
import GetStartedButton from '../buttons/GetStartedButton';
import LearnMoreButton from '../buttons/LearnMoreButton';

interface HeroCardProps {
  badge: string;
  title: string;
  description: string;
  features: readonly string[];
  learnMoreLabel?: string;
  getStartedLabel?: string;
  learnMoreHandler?: () => void;
  getStartedHandler?: () => void;
  imageSrc?: string;
  imageAlt?: string;
  showStamp?: boolean;
  showImageShadow?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  imageFullHeight?: boolean;
  imageNoTranslate?: boolean;
  imageMaxHeight?: string;
  titleMarginBottom?: string;
  descriptionMarginBottom?: string;
}

const HeroCard: React.FC<HeroCardProps> = ({
  badge,
  title,
  description,
  features,
  learnMoreLabel = 'Learn More',
  getStartedLabel = 'Get Started',
  learnMoreHandler,
  getStartedHandler,
  imageSrc = '/hero.png',
  imageAlt = 'Hero image',
  showStamp = true,
  showImageShadow = true,
  imageWidth,
  imageHeight,
  imageFullHeight = false,
  imageNoTranslate = false,
  imageMaxHeight = 'max-h-90',
  titleMarginBottom = 'mb-6',
  descriptionMarginBottom = 'mb-14',
}) => {
  const badgeClassName = "inline-flex items-center justify-center min-w-32 h-10 gap-1 rounded-lg px-4 py-3 border border-white bg-[#819A78] text-white shadow-md font-heading font-medium text-sm leading-[150%] tracking-normal";
  const gridCols = showStamp ? "lg:grid-cols-[55%_15%_30%] 2xl:grid-cols-[50%_10%_40%]" : "lg:grid-cols-2";
  
  return (
    <section className="max-w-9xl mx-auto bg-white p-4 sm:p-4 lg:p-2 xl:p-6">
      <div className="rounded-3xl bg-(--color-header-bg) px-6 py-10 shadow-md sm:px-8 sm:py-14 lg:min-h-40 3xl:min-h-[48.5rem] lg:px-16 lg:py-14 2xl:py-20 3xl:px-20 4xl:px-2 overflow-visible">
        <div className={`relative grid items-center gap-4 ${gridCols}`}>
          {/* Left: Content */}
          <div>
            <p className="mb-6 font-heading text-2xl text-[#0B696B] font-medium leading-[150%] tracking-normal text-secondary">
              {badge}
            </p>

            <h1 className={`${titleMarginBottom} font-heading lg:text-4xl xl:text-5xl font-medium leading-[120%] tracking-normal text-heading`}>
              {title}
            </h1>

            <p className={`${descriptionMarginBottom} font-heading font-light lg:text-sm xl:text-base leading-[150%] tracking-normal text-subheading`}>
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {learnMoreLabel && (
                <LearnMoreButton
                  text={learnMoreLabel}
                  onClick={learnMoreHandler}
                  variant="hero"
                />
              )}
              <GetStartedButton
                text={getStartedLabel}
                onClick={getStartedHandler}
              />
            </div>

            <div className="mt-8 flex flex-wrap whitespace-nowrap gap-3 text-sm">
              {features.map((text) => (
                <span key={text} className={badgeClassName}>{text}</span>
              ))}
            </div>
          </div>

          {/* Middle: Stamp */}
          {showStamp && (
            <div className="flex items-end justify-end">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-black shadow-md border border-gray-700 p-3 -translate-y-28">
                <svg
                  viewBox="0 0 132 132"
                  className="h-full w-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <path
                      id="circlePath"
                      d="M66,66 m-51,0a51,51 0 1,1 102,0a51,51 0 1,1 -102,0"
                      fill="none"
                    />
                  </defs>

                  {/* Full circular text */}
                  <g transform="rotate(260,66,66)"> 
                    <text fill="white" fontSize="12" fontWeight="600" letterSpacing="3.5">
                      <textPath href="#circlePath" startOffset="0%">
                        ✨ Discover Your Dream Property 
                      </textPath>
                    </text>
                  </g>

                  {/* Inner circle */}
                  <circle cx="66" cy="66" r="30.1116" fill="#0f0f0f" stroke="#262626" strokeWidth="1.2" opacity="1" />

                  {/* Arrow */}
                  <path
                    d="M 57.9559 66 L 66 57.9559 L 74.0441 66 M 66 57.9559 L 66 80"
                    stroke="white"
                    strokeWidth="1.51"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="1"
                    transform="rotate(45,66,66)"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Right: Image */}
          <div className="flex h-full">
            <img
              src={imageSrc}
              alt={imageAlt}
              className={`w-full max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rotate-0 rounded-2xl object-cover ${showImageShadow ? 'shadow-lg' : ''} ${imageNoTranslate ? '' : 'translate-y-4 sm:translate-y-6 lg:translate-y-10 xl:translate-y-20 2xl:translate-y-28'}`}
              style={{
                ...(imageWidth && { width: `${imageWidth}px` }),
                ...(imageHeight && { height: `${imageHeight}px` }),
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCard;

