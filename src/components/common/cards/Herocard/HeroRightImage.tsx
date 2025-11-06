import React from 'react';

export interface HeroRightImageProps {
  imageSrc: string;
  imageAlt: string;
  backgroundImageSrc?: string;
  showImageShadow?: boolean;
  imageWidth?: number;
  imageHeight?: number;
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
  showImageShadow = true,
  imageWidth,
  imageHeight,
  imageFullHeight = false,
  imageNoTranslate = false,
  imageMaxHeight = 'max-h-[22.5rem]',
  imageTranslate,
  imageContain = false,
}) => {
  return (
    <div className={`flex h-full ${backgroundImageSrc ? 'relative' : ''}`}>
      {backgroundImageSrc && (
        <img
          src={backgroundImageSrc}
          alt="Background"
          className={`absolute w-full max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rotate-0 rounded-2xl ${imageContain ? 'object-contain' : 'object-cover'}`}
          style={{
            ...(imageWidth && { width: `${imageWidth}px` }),
            ...(imageHeight && { height: `${imageHeight}px` }),
            zIndex: 1,
            transform: 'translate(80px, 80px)',
          }}
        />
      )}
      <img
        src={imageSrc}
        alt={imageAlt}
        className={`w-full max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rotate-0 rounded-2xl ${imageContain ? 'object-contain' : 'object-cover'} ${showImageShadow ? 'shadow-lg' : ''} ${imageTranslate ? imageTranslate : imageNoTranslate ? '' : 'translate-y-4 sm:translate-y-6 lg:translate-y-10 xl:translate-y-20 2xl:translate-y-28'}`}
        style={{
          ...(imageWidth && { width: `${imageWidth}px` }),
          ...(imageHeight && { height: `${imageHeight}px` }),
          ...(backgroundImageSrc && { position: 'relative', zIndex: 2 }),
        }}
      />
    </div>
  );
};

export default HeroRightImage;


