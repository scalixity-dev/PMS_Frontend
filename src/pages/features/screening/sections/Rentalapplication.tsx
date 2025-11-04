import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const RentalApplicationSection: React.FC = () => {
  const features = ["Free 14 day trial", "Credit card required", "Cancel anytime"] as const;
  
  return (
    <HeroCard
      badge="Rental Applications"
      title="List, apply, sign—all in one place"
      description="Landlords report reduced vacancy time and improved occupancy by 15% with PmsCloud’s leasing tools."
      features={features}
      showStamp={false}
      learnMoreLabel=""
      showBackgroundCard={false}
      imageSrc="/Group.png"
      showImageShadow={false}
      imageNoTranslate={true}
      imageTranslate="translate-y-24"
      imageMaxHeight="max-h-[35rem]"
      imageHeight={460}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default RentalApplicationSection;


