import React from 'react';

export interface HeroSideImageProps {
  src: string;
  alt: string;
  imageWidth?: number;
  imageHeight?: number;
  imageFullHeight?: boolean;
  imageMaxHeight?: string;
  imageTranslate?: string;
  imageNoTranslate?: boolean;
  imageContain?: boolean;
  showImageShadow?: boolean;
  extraTranslateClassName?: string;
  showTopRightPattern?: boolean;
  showBottomLeftPattern?: boolean;
  patternClassName?: string;
}

const HeroSideImage: React.FC<HeroSideImageProps> = ({
  src,
  alt,
  imageWidth,
  imageHeight,
  imageFullHeight = false,
  imageMaxHeight = 'max-h-[22.5rem]',
  imageTranslate,
  imageNoTranslate = false,
  imageContain = false,
  showImageShadow = true,
  extraTranslateClassName = '',
  showTopRightPattern = false,
  showBottomLeftPattern = false,
  patternClassName = '',
}) => {
  const baseClassName = `w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rotate-0 rounded-2xl ${imageContain ? 'object-contain' : 'object-cover'} ${showImageShadow ? 'shadow-lg' : ''} ${imageTranslate ? imageTranslate : imageNoTranslate ? '' : 'translate-y-2 sm:translate-y-4 md:translate-y-6 lg:translate-y-10 xl:translate-y-20 2xl:translate-y-28'}`;

  return (
    <div className="relative w-full">
      <img
        src={src}
        alt={alt}
        className={`${baseClassName} ${extraTranslateClassName}`}
        style={{
          ...(imageWidth && { width: `${imageWidth}px` }),
          ...(imageHeight && { height: `${imageHeight}px` }),
        }}
      />
      {showTopRightPattern && (
        <img
          src="/Line-pattern.png"
          alt=""
          aria-hidden="true"
          className={`pointer-events-none select-none absolute -top-60 right-2 w-16 sm:w-40 ${patternClassName}`}
        />
      )}
      {showBottomLeftPattern && (
        <img
          src="/Line-pattern.png"
          alt=""
          aria-hidden="true"
          className={`pointer-events-none select-none absolute -bottom-28 left-0 w-16 sm:w-40  ${patternClassName}`}
        />
      )}
    </div>
  );
};

export default HeroSideImage;


