import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const LeaseHeroSection: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'Credit card required',
    'Cancel anytime',
  ] as const;

  return (
    <HeroCard
      badge="Online Leases"
      title="Save time with customizable lease templates"
      betweenTitleAndDescription={
        <img
          src="/lease_hero2.png"
          alt="Lease templates preview"
          className="mb-4 w-full max-w-3xs rounded-xl"
        />
      }
      description="Cut down on paperwork and save up to 20 hours a week with PmsCloud’s built-in lease templates. Pick from ready-to-go forms or create your own—customize once, reuse every time."
      features={features}
      showStamp={false}
      learnMoreLabel=""
      showBackgroundCard={false}
      imageSrc="/lease_hero.png"
      showImageShadow={false}
      imageNoTranslate={true}
      
      imageMaxHeight="max-h-[27rem]"
      imageContain={true}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default LeaseHeroSection;
