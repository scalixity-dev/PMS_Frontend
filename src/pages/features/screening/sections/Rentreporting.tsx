import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const RentReportingSection: React.FC = () => {
  const features = ["Free 14 day trial", "Credit card required", "Cancel anytime"] as const;
  
  return (
    <HeroCard
      badge="Rent Reporting"
      title="Automated Rent Notifications"
      description="Never miss a payment again. PMS sends smart reminders to tenants before due dates, making rent collection smoother and more reliable."
      features={features}
      showStamp={false}
      learnMoreLabel=""
      showBackgroundCard={false}
      reverseLayout={true}
      imageSrc="/Group.png"
      showImageShadow={false}
      imageNoTranslate={true}
      imageTranslate="translate-y-22"
      imageMaxHeight="max-h-[35rem]"
      imageHeight={460}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default RentReportingSection;
