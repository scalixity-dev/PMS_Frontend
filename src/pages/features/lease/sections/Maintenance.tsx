import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const MaintenanceSection: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'Credit card required',
    'Cancel anytime',
  ] as const;

  return (
    <HeroCard
      badge="Maintenance"
      title="AI handles maintenance requests instantly—from report to resolution."
      description="Save hours every week with AI-powered maintenance automation—track issues, assign tasks, and ensure quick resolutions effortlessly."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      imageSrc="/Group.png"
      backgroundImageSrc="/vector1.png"
      backgroundImageTranslate="translate(-40px, 0px)"
      showImageShadow={false}
      imageNoTranslate={true}
      imageTranslate="translate-y-6 sm:translate-y-10"
      imageContain={true}
      imageMaxHeight="max-h-[40rem]"
      imageHeight={460}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default MaintenanceSection;


