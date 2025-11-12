import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

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
      reverseLayout={true}
      imageSrc="/Group.png"
      showImageShadow={false}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[30rem]"
      backgroundImageSrc="/vector4.png"
      backgroundImageTranslate="translate(-60px, -60px) scale(1.1)"
      imageTranslate="-translate-x-6 sm:-translate-x-2 translate-y-6 sm:translate-y-2"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default RentalPropertySection;


