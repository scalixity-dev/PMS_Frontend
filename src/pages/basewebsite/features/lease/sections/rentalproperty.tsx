import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const RentalPropertySection: React.FC = () => {
  const features = [] as const;

  return (
    <HeroCard
      badge="Rental Property"
      title="Create a rental property website in seconds"
      description="Choose a template, add your company details, list a property for rent, and watch applicants roll in."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      reverseLayout={false}
      reverseLayoutDesktop={true}
      imageSrc="/Group.png"
      hideBackgroundOnMobile
      showImageShadow={false}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[26rem] sm:max-h-[30rem] md:max-h-[34rem]"
      backgroundImageSrc="/vector4.png"
      backgroundImageTranslate="translate(-20px, -40px) lg:translate(-60px, -60px) scale(1.1)"
      imageTranslate="-translate-x-2 sm:-translate-x-6 translate-y-4 lg:translate-y-12"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default RentalPropertySection;


