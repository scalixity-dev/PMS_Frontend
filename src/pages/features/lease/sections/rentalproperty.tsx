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
      imageSrc="/rental-property.png"
      showImageShadow={false}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[27rem]"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default RentalPropertySection;


