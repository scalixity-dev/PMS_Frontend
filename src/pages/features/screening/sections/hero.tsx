import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const FeaturesHeroSection: React.FC = () => {
  const features = ["Free 14 day trial", "Credit card required", "Cancel anytime"] as const;
  
  return (
    <HeroCard
      badge="PMS Screening"
      title="PMS screening designed for landlords"
      description="Streamline your tenant selection with PMS’s intelligent screening system — automating identity verification and helping you discover trustworthy renters faster."
      features={features}
      showStamp={false}
      learnMoreLabel=""
      imageSrc="/hero2.png"
      showImageShadow={false}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[27rem]"
      imageContain={true}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default FeaturesHeroSection;

