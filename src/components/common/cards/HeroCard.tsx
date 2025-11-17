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
  hideRightImageOnMobile?: boolean;
  mobileImageBetweenContent?: boolean;
  backgroundImageSrc?: string;
  backgroundImageTranslate?: string;
  showStamp?: boolean;
  showImageShadow?: boolean;
  hideBackgroundOnMobile?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  imageHeightMobile?: number;
  imageHeightDesktop?: number;
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
  reverseLayoutDesktop?: boolean;
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
  hideRightImageOnMobile = false,
  mobileImageBetweenContent = false,
  backgroundImageSrc,
  backgroundImageTranslate,
  showStamp = true,
  showImageShadow = true,
  hideBackgroundOnMobile = false,
  imageWidth,
  imageHeight,
  imageHeightMobile,
  imageHeightDesktop,
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
  reverseLayoutDesktop,
  imageContain = false,
  sectionPaddingClassName = 'p-2 sm:p-4 md:p-6 lg:p-2 xl:p-6',
  contentPaddingClassName = 'px-6 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-16 lg:py-14 2xl:py-20 3xl:px-20 4xl:px-2',
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
  const desktopReverseLayout = reverseLayoutDesktop !== undefined ? reverseLayoutDesktop : reverseLayout;
  const gridCols = hasSideImages
    ? "grid-cols-1 lg:grid-cols-[30%_40%_30%]"
    : desktopReverseLayout
      ? (showStamp ? "grid-cols-1 lg:grid-cols-[30%_15%_55%] 2xl:grid-cols-[40%_10%_50%]" : "grid-cols-1 lg:grid-cols-2")
      : (showStamp ? "grid-cols-1 lg:grid-cols-[55%_15%_30%] 2xl:grid-cols-[50%_10%_40%]" : "grid-cols-1 lg:grid-cols-2");
  
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
      hideBackgroundOnMobile={hideBackgroundOnMobile}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
      imageHeightMobile={imageHeightMobile}
      imageHeightDesktop={imageHeightDesktop}
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
    <>
      {/* Mobile/Tablet Layout: Content with image between description and buttons */}
      <div className={`lg:hidden flex flex-col ${contentClassName}`}>
        {hasSideImages ? (
          mobileImageBetweenContent ? (
            <>
              <div className="mx-auto text-center w-full">
                <HeroContent
                  badge={badge}
                  badgeClassName={badgeClassName}
                  badgeLogo={rightSideLogo}
                  badgeLogoWrapperClassName={badgeLogoWrapperClassName}
                  badgeLogoPosition={badgeLogoPosition}
                  badgeCentered={badgeCentered}
                  title={title}
                  description={description}
                  features={[]}
                  betweenTitleAndDescription={betweenTitleAndDescription}
                  learnMoreLabel=""
                  getStartedLabel=""
                  hasSideImages={hasSideImages}
                  titleMarginBottom={titleMarginBottom}
                  descriptionMarginBottom=""
                  isCentered={isCentered || hideImage}
                  sideContentLeft={sideContentLeft}
                  sideContentRight={sideContentRight}
                  embeddedContent={embeddedContent}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                {leftImageSrc && (
                  <div className="flex justify-center">
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
                  </div>
                )}
                {rightImageSrc && !hideRightImageOnMobile && (
                  <div className="flex justify-center">
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
                  </div>
                )}
              </div>
              <div className="mx-auto text-center w-full mt-6 sm:mt-8">
                <HeroContent
                  badge=""
                  badgeClassName={badgeClassName}
                  badgeLogo={rightSideLogo}
                  badgeLogoWrapperClassName={badgeLogoWrapperClassName}
                  badgeLogoPosition={badgeLogoPosition}
                  badgeCentered={badgeCentered}
                  title=""
                  description=""
                  features={features}
                  betweenTitleAndDescription={undefined}
                  learnMoreLabel={learnMoreLabel}
                  getStartedLabel={getStartedLabel}
                  learnMoreHandler={learnMoreHandler}
                  getStartedHandler={getStartedHandler}
                  learnMoreTo={learnMoreTo}
                  getStartedTo={getStartedTo}
                  hasSideImages={hasSideImages}
                  titleMarginBottom=""
                  descriptionMarginBottom=""
                  isCentered={isCentered || hideImage}
                  sideContentLeft={sideContentLeft}
                  sideContentRight={sideContentRight}
                  embeddedContent={undefined}
                />
              </div>
            </>
          ) : (
            <>
              {/* Mobile: Content first, then images */}
              <div className="mx-auto text-center w-full">
                {contentDiv}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                {leftImageSrc && (
                  <div className="flex justify-center">
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
                  </div>
                )}
                {rightImageSrc && !hideRightImageOnMobile && (
                  <div className="flex justify-center">
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
                  </div>
                )}
              </div>
            </>
          )
        ) : (
          <>
            {reverseLayout ? (
              <>
                {/* Mobile: Image first, then content */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  {imageDiv}
                </div>
                {contentDiv}
              </>
            ) : (
              <>
                {/* Mobile: Content top part, then image, then buttons */}
                <HeroContent
                  badge={badge}
                  badgeClassName={badgeClassName}
                  badgeLogo={rightSideLogo}
                  badgeLogoWrapperClassName={badgeLogoWrapperClassName}
                  badgeLogoPosition={badgeLogoPosition}
                  badgeCentered={badgeCentered}
                  title={title}
                  description={description}
                  features={[]}
                  betweenTitleAndDescription={betweenTitleAndDescription}
                  learnMoreLabel=""
                  getStartedLabel=""
                  hasSideImages={hasSideImages}
                  titleMarginBottom={titleMarginBottom}
                  descriptionMarginBottom=""
                  isCentered={isCentered || hideImage}
                  sideContentLeft={sideContentLeft}
                  sideContentRight={sideContentRight}
                  embeddedContent={embeddedContent}
                />
                {/* Image centered between description and buttons with equal spacing */}
                <div className="flex justify-center my-6 sm:my-8 md:my-10">
                  {imageDiv}
                </div>
                {/* Buttons and features */}
                <HeroContent
                  badge=""
                  badgeClassName={badgeClassName}
                  badgeLogo={rightSideLogo}
                  badgeLogoWrapperClassName={badgeLogoWrapperClassName}
                  badgeLogoPosition={badgeLogoPosition}
                  badgeCentered={badgeCentered}
                  title=""
                  description=""
                  features={features}
                  betweenTitleAndDescription={undefined}
                  learnMoreLabel={learnMoreLabel}
                  getStartedLabel={getStartedLabel}
                  learnMoreHandler={learnMoreHandler}
                  getStartedHandler={getStartedHandler}
                  learnMoreTo={learnMoreTo}
                  getStartedTo={getStartedTo}
                  hasSideImages={hasSideImages}
                  titleMarginBottom=""
                  descriptionMarginBottom=""
                  isCentered={isCentered || hideImage}
                  sideContentLeft={sideContentLeft}
                  sideContentRight={sideContentRight}
                  embeddedContent={undefined}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Desktop Layout: Grid layout */}
      <div className={`hidden lg:grid items-center gap-4 ${contentClassName} ${gridCols}`}>
      {hasSideImages ? (
        <>
          {/* Left: Image */}
            <div className="flex items-center order-2 lg:order-1 lg:self-center">
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
            <div className="mx-auto text-center order-1 lg:order-2 lg:self-center">
            {contentDiv}
          </div>
          {/* Right: Image */}
            <div className="flex justify-end items-center order-3 lg:order-3 lg:self-center">
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
          {desktopReverseLayout ? (
            <>
                <div className="order-2 lg:order-1 lg:self-center">{imageDiv}</div>
                {showStamp && <div className="order-3 lg:order-2 lg:self-center">{stampDiv}</div>}
                <div className={`order-1 ${showStamp ? 'lg:order-3' : 'lg:order-2'} lg:self-center`}>{contentDiv}</div>
            </>
          ) : (
            <>
                <div className="order-1 lg:order-1 lg:self-center">{contentDiv}</div>
                {showStamp && <div className="order-3 lg:order-2 lg:self-center">{stampDiv}</div>}
                <div className={`order-2 ${showStamp ? 'lg:order-3' : 'lg:order-2'} lg:self-center`}>{imageDiv}</div>
            </>
          )}
        </>
      )}
    </div>
    </>
  );

  return (
    <section className={`${maxWidthClassName} mx-auto ${sectionClassName} ${sectionPaddingClassName}`}>
      {showBackgroundCard ? (
        <div className={`rounded-3xl ${backgroundCardClassName} shadow-md min-h-0 md:min-h-32 lg:min-h-40 3xl:min-h-[48.5rem] overflow-visible ${contentPaddingClassName}`}>
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

