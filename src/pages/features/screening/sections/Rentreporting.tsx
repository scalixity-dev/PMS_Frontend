import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const RentReportingSection: React.FC = () => {
  const features = ["Free 14 day trial", "Credit card required", "Cancel anytime"] as const;
  
  return (
    <HeroCard
      badge="Rent Reporting"
      title="Build credit with every rent payment"
      description="Help your tenants build credit while ensuring timely payments. Rent reporting increases on-time payment rates by 23%."
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
