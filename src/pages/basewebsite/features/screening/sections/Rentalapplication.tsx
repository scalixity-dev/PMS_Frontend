import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const RentalApplicationSection: React.FC = () => {
  const features = ["Free 14 day trial", "Credit card required", "Cancel anytime"] as const;
  
  return (
    <HeroCard
      badge="Rental Applications"
      title="List, apply, sign—all in one place"
      description="Landlords report reduced vacancy time and improved occupancy by 15% with PmsCloud's leasing tools."
      features={features}
      showStamp={false}
      learnMoreLabel=""
      showBackgroundCard={false}
      imageSrc="/Group.png"
      showImageShadow={false}
      imageNoTranslate={false}
      imageTranslate="translate-y-2 sm:translate-y-4 md:translate-y-8 lg:translate-y-16 xl:translate-y-24"
      imageMaxHeight="max-h-[18rem] sm:max-h-[22rem] md:max-h-[26rem] lg:max-h-[30rem] xl:max-h-[35rem]"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6 sm:mb-8 md:mb-10"
    />
  );
};

export default RentalApplicationSection;


