import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const MaintenanceSection: React.FC = () => {
  return (
    <HeroCard
      badge="Maintenance"
      title="AI handles maintenance requests instantly—from report to resolution."
      description="Save hours every week with AI-powered maintenance automation—track issues, assign tasks, and ensure quick resolutions effortlessly."
      features={[]}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      imageSrc="/maintenance.png"
      showImageShadow={false}
      imageNoTranslate={true}
      imageContain={true}
      imageMaxHeight="max-h-[40rem]"
      imageHeight={460}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default MaintenanceSection;


