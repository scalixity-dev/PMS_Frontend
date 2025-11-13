import React from 'react';
import HeroContent from './Herocard/HeroContent';
import HeroRightImage from './Herocard/HeroRightImage';
import HeroStamp from './Herocard/HeroStamp';
import HeroSideImage from './Herocard/HeroSideImage';

interface HeroCardProps {
  badge?: string;
  badgeClassName?: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  features: readonly string[];
  // Optional content to render between the title and description
  betweenTitleAndDescription?: React.ReactNode;
  learnMoreLabel?: string;
  getStartedLabel?: string;
  learnMoreHandler?: () => void;
  getStartedHandler?: () => void;
  learnMoreTo?: string;
  getStartedTo?: string;
  imageSrc?: string;
  imageAlt?: string;
  // Optional: Show content in the center with two side images
  leftImageSrc?: string;
  leftImageAlt?: string;
  rightImageSrc?: string;
  rightImageAlt?: string;
  backgroundImageSrc?: string;
  backgroundImageTranslate?: string;
  showStamp?: boolean;
  showImageShadow?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  imageFullHeight?: boolean;
  imageNoTranslate?: boolean;
  imageMaxHeight?: string;
  imageTranslate?: string;
  leftImageTranslate?: string;
  rightImageTranslate?: string;
  titleMarginBottom?: string;
  descriptionMarginBottom?: string;
  showBackgroundCard?: boolean;
  reverseLayout?: boolean;
  imageContain?: boolean;
  sectionPaddingClassName?: string;
  contentPaddingClassName?: string;
  contentClassName?: string;
  sectionClassName?: string;
  sideContentLeft?: React.ReactNode;
  sideContentRight?: React.ReactNode;
  leftImageTopRightPattern?: boolean;
  leftImageBottomLeftPattern?: boolean;
  rightImageTopRightPattern?: boolean;
  rightImageBottomLeftPattern?: boolean;
  patternClassName?: string;
  rightSideLogo?: React.ReactNode;
  badgeLogoWrapperClassName?: string;
  badgeLogoPosition?: 'left' | 'right';
  badgeCentered?: boolean;
  hideImage?: boolean;
  isCentered?: boolean;
  backgroundCardClassName?: string;
  maxWidthClassName?: string;
  embeddedContent?: React.ReactNode;
}

const HeroCard: React.FC<HeroCardProps> = ({
  badge,
  badgeClassName,
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
  imageSrc = '/hero.png',
  imageAlt = 'Hero image',
  leftImageSrc,
  leftImageAlt,
  rightImageSrc,
  rightImageAlt,
  backgroundImageSrc,
  backgroundImageTranslate,
  showStamp = true,
  showImageShadow = true,
  imageWidth,
  imageHeight,
  imageFullHeight = false,
  imageNoTranslate = false,
  imageMaxHeight = 'max-h-[22.5rem]',
  imageTranslate,
  leftImageTranslate,
  rightImageTranslate,
  titleMarginBottom = 'mb-6',
  descriptionMarginBottom = 'mb-14',
  showBackgroundCard = true,
  reverseLayout = false,
  imageContain = false,
  sectionPaddingClassName = 'p-4 sm:p-4 lg:p-2 xl:p-6',
  contentPaddingClassName = 'px-6 py-10 sm:px-8 sm:py-14 lg:px-16 lg:py-14 2xl:py-20 3xl:px-20 4xl:px-2',
  contentClassName = '',
  sectionClassName = 'bg-white',
  sideContentLeft,
  sideContentRight,
  leftImageTopRightPattern = false,
  leftImageBottomLeftPattern = false,
  rightImageTopRightPattern = false,
  rightImageBottomLeftPattern = false,
  patternClassName,
  rightSideLogo,
  badgeLogoPosition = 'right',
  badgeLogoWrapperClassName,
  badgeCentered = false,
  hideImage = false,
  isCentered = false,
  backgroundCardClassName = 'bg-(--color-header-bg)',
  maxWidthClassName = 'max-w-9xl',
  embeddedContent,
}) => {
  const hasSideImages = Boolean(leftImageSrc && rightImageSrc);
  const gridCols = hasSideImages
    ? "lg:grid-cols-[30%_40%_30%]"
    : reverseLayout
      ? (showStamp ? "lg:grid-cols-[30%_15%_55%] 2xl:grid-cols-[40%_10%_50%]" : "lg:grid-cols-2")
      : (showStamp ? "lg:grid-cols-[55%_15%_30%] 2xl:grid-cols-[50%_10%_40%]" : "lg:grid-cols-2");
  
  const contentDiv = (
    <HeroContent
      badge={badge}
      badgeClassName={badgeClassName}
      badgeLogo={rightSideLogo}
      badgeLogoWrapperClassName={badgeLogoWrapperClassName}
      badgeLogoPosition={badgeLogoPosition}
      badgeCentered={badgeCentered}
      title={title}
      description={description}
      features={features}
      betweenTitleAndDescription={betweenTitleAndDescription}
      learnMoreLabel={learnMoreLabel}
      getStartedLabel={getStartedLabel}
      learnMoreHandler={learnMoreHandler}
      getStartedHandler={getStartedHandler}
      learnMoreTo={learnMoreTo}
      getStartedTo={getStartedTo}
      hasSideImages={hasSideImages}
      titleMarginBottom={titleMarginBottom}
      descriptionMarginBottom={descriptionMarginBottom}
      isCentered={isCentered || hideImage}
      sideContentLeft={sideContentLeft}
      sideContentRight={sideContentRight}
      embeddedContent={embeddedContent}
    />
  );

  const imageDiv = (
    <HeroRightImage
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      backgroundImageSrc={backgroundImageSrc}
      backgroundImageTranslate={backgroundImageTranslate}
      showImageShadow={showImageShadow}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
      imageFullHeight={imageFullHeight}
      imageNoTranslate={imageNoTranslate}
      imageMaxHeight={imageMaxHeight}
      imageTranslate={imageTranslate}
      imageContain={imageContain}
    />
  );

  const stampDiv = showStamp ? <HeroStamp /> : null;
  
  const content = hideImage ? (
    <div className="relative flex justify-center">
      <div className="w-full max-w-4xl">
        {contentDiv}
      </div>
    </div>
  ) : (
    <div className={`relative grid items-center gap-4 ${contentClassName} ${gridCols}`}>
      {hasSideImages ? (
        <>
          {/* Left: Image */}
          <div className="flex h-full">
            {leftImageSrc && (
              <HeroSideImage
                src={leftImageSrc}
                alt={leftImageAlt || 'Left image'}
                imageWidth={imageWidth}
                imageHeight={imageHeight}
                imageFullHeight={imageFullHeight}
                imageMaxHeight={imageMaxHeight}
                imageTranslate={imageTranslate}
                imageNoTranslate={imageNoTranslate}
                imageContain={imageContain}
                showImageShadow={showImageShadow}
                extraTranslateClassName={leftImageTranslate || ''}
                showTopRightPattern={leftImageTopRightPattern}
                showBottomLeftPattern={leftImageBottomLeftPattern}
                patternClassName={patternClassName}
              />
            )}
          </div>
          {/* Middle: Content */}
          <div className="mx-auto text-center">
            {contentDiv}
          </div>
          {/* Right: Image */}
          <div className="flex h-full justify-end flex-col items-end">
            {rightImageSrc && (
              <HeroSideImage
                src={rightImageSrc}
                alt={rightImageAlt || 'Right image'}
                imageWidth={imageWidth}
                imageHeight={imageHeight}
                imageFullHeight={imageFullHeight}
                imageMaxHeight={imageMaxHeight}
                imageTranslate={imageTranslate}
                imageNoTranslate={imageNoTranslate}
                imageContain={imageContain}
                showImageShadow={showImageShadow}
                extraTranslateClassName={rightImageTranslate || ''}
                showTopRightPattern={rightImageTopRightPattern}
                showBottomLeftPattern={rightImageBottomLeftPattern}
                patternClassName={patternClassName}
              />
            )}
          </div>
        </>
      ) : (
        <>
          {reverseLayout ? (
            <>
              {imageDiv}
              {stampDiv}
              {contentDiv}
            </>
          ) : (
            <>
              {contentDiv}
              {stampDiv}
              {imageDiv}
            </>
          )}
        </>
      )}
    </div>
  );

  return (
    <section className={`${maxWidthClassName} mx-auto ${sectionClassName} ${sectionPaddingClassName}`}>
      {showBackgroundCard ? (
        <div className={`rounded-3xl ${backgroundCardClassName} shadow-md lg:min-h-40 3xl:min-h-[48.5rem] overflow-visible ${contentPaddingClassName}`}>
          {content}
        </div>
      ) : (
        <div className={`${contentPaddingClassName}`}>
          {content}
        </div>
      )}
    </section>
  );
};

export default HeroCard;

