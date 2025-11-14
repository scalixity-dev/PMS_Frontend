import React from 'react';

export interface HeroRightImageProps {
  imageSrc: string;
  imageAlt: string;
  backgroundImageSrc?: string;
  backgroundImageTranslate?: string;
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
  backgroundImageTranslate,
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
          transform: backgroundImageTranslate || 'translate(80px, 80px)',
          }}
        />
      )}
      {showImageShadow ? (
        <div className="relative">
          {/* Gradient shadow layer */}
          <div 
            className={`absolute inset-0 w-full max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rounded-2xl`}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.08) 40%, transparent 70%)',
              filter: 'blur(20px)',
              transform: 'translateY(8px)',
              zIndex: backgroundImageSrc ? 1 : 0,
              ...(imageWidth && { width: `${imageWidth}px` }),
              ...(imageHeight && { height: `${imageHeight}px` }),
            }}
          />
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`relative w-full max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rotate-0 rounded-2xl ${imageContain ? 'object-contain' : 'object-cover'} ${imageTranslate ? imageTranslate : imageNoTranslate ? '' : 'translate-y-4 sm:translate-y-6 lg:translate-y-10 xl:translate-y-20 2xl:translate-y-28'}`}
            style={{
              ...(imageWidth && { width: `${imageWidth}px` }),
              ...(imageHeight && { height: `${imageHeight}px` }),
              ...(backgroundImageSrc && { position: 'relative', zIndex: 2 }),
            }}
          />
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`w-full max-w-2xl ${imageFullHeight ? '' : imageMaxHeight} rotate-0 rounded-2xl ${imageContain ? 'object-contain' : 'object-cover'} ${imageTranslate ? imageTranslate : imageNoTranslate ? '' : 'translate-y-4 sm:translate-y-6 lg:translate-y-10 xl:translate-y-20 2xl:translate-y-28'}`}
          style={{
            ...(imageWidth && { width: `${imageWidth}px` }),
            ...(imageHeight && { height: `${imageHeight}px` }),
            ...(backgroundImageSrc && { position: 'relative', zIndex: 2 }),
          }}
        />
      )}
    </div>
  );
};

export default HeroRightImage;


