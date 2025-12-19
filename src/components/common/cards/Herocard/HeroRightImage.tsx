import React from 'react';

export interface HeroRightImageProps {
  imageSrc: string;
  imageAlt: string;
  backgroundImageSrc?: string;
  backgroundImageTranslate?: string;
  backgroundImageClassName?: string;
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
  imageContain?: boolean;
}

const HeroRightImage: React.FC<HeroRightImageProps> = ({
  imageSrc,
  imageAlt,
  backgroundImageSrc,
  backgroundImageTranslate,
  backgroundImageClassName,
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
  imageContain = false,
}) => {
  // Generate unique ID for this component instance
  const uniqueId = React.useMemo(() => `hero-image-${Math.random().toString(36).substring(2, 11)}`, []);
  
  // Build responsive height styles
  const getHeightStyle = () => {
    if (imageHeightMobile !== undefined || imageHeightDesktop !== undefined) {
      return {
        '--image-height-mobile': imageHeightMobile !== undefined ? `${imageHeightMobile}px` : 'auto',
        '--image-height-desktop': imageHeightDesktop !== undefined ? `${imageHeightDesktop}px` : 'auto',
      } as React.CSSProperties;
    }
    return imageHeight ? { height: `${imageHeight}px` } : {};
  };

  const heightStyle = getHeightStyle();
  const hasResponsiveHeight = imageHeightMobile !== undefined || imageHeightDesktop !== undefined;
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const hasTransformClass =
    typeof backgroundImageClassName === 'string'
      ? /\b(transform|translate|scale|rotate|skew)[-]/.test(backgroundImageClassName)
      : false;

  return (
    <>
      {hasResponsiveHeight && (
        <style>{`
          #${uniqueId} > img,
          #${uniqueId} .relative > img {
            height: var(--image-height-mobile, auto) !important;
          }
          @media (min-width: 1024px) {
            #${uniqueId} > img,
            #${uniqueId} .relative > img {
              height: var(--image-height-desktop, auto) !important;
            }
          }
        `}</style>
      )}
      <div 
        id={uniqueId}
        className={`flex h-full justify-center items-center ${backgroundImageSrc ? 'relative' : ''}`}
        style={hasResponsiveHeight ? heightStyle : {}}
      >
      {backgroundImageSrc && isDesktop && (
        <img
          src={backgroundImageSrc}
          alt="Background"
          className={`absolute w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rotate-0 rounded-2xl ${imageContain ? 'object-contain' : 'object-cover'} ${
            hideBackgroundOnMobile ? 'hidden sm:block' : ''
          } ${backgroundImageClassName ?? ''}`}
          style={{
            ...(imageWidth && { width: `${imageWidth}px` }),
            ...(hasResponsiveHeight ? {} : (imageHeight ? { height: `${imageHeight}px` } : {})),
            zIndex: 1,
            ...(!hasTransformClass
              ? { transform: backgroundImageTranslate || 'translate(80px, 80px)' }
              : {}),
          }}
        />
      )}
      {showImageShadow ? (
        <div className="relative">
          {/* Gradient shadow layer */}
          <div 
            className={`absolute inset-0 w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rounded-2xl`}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.08) 40%, transparent 70%)',
              filter: 'blur(20px)',
              transform: 'translateY(8px)',
              zIndex: backgroundImageSrc ? 1 : 0,
              ...(imageWidth && { width: `${imageWidth}px` }),
              ...(hasResponsiveHeight ? {} : (imageHeight ? { height: `${imageHeight}px` } : {})),
            }}
          />
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`relative w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rotate-0 rounded-2xl ${imageContain ? 'object-contain' : 'object-cover'} ${(imageTranslate && isDesktop) ? imageTranslate : imageNoTranslate ? '' : 'translate-y-0 sm:translate-y-0 md:translate-y-0 lg:translate-y-10 xl:translate-y-20 2xl:translate-y-20'}`}
            style={{
              ...(imageWidth && { width: `${imageWidth}px` }),
              ...(hasResponsiveHeight ? {} : (imageHeight ? { height: `${imageHeight}px` } : {})),
              ...(backgroundImageSrc && { position: 'relative', zIndex: 2 }),
            }}
          />
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rotate-0 rounded-2xl ${imageContain ? 'object-contain' : 'object-cover'} ${(imageTranslate && isDesktop) ? imageTranslate : imageNoTranslate ? '' : 'translate-y-0 sm:translate-y-0 md:translate-y-0 lg:translate-y-10 xl:translate-y-20 2xl:translate-y-20'}`}
          style={{
            ...(imageWidth && { width: `${imageWidth}px` }),
            ...(hasResponsiveHeight ? {} : (imageHeight ? { height: `${imageHeight}px` } : {})),
            ...(backgroundImageSrc && { position: 'relative', zIndex: 2 }),
          }}
        />
      )}
    </div>
    </>
  );
};

export default HeroRightImage;


