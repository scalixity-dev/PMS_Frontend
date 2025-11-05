import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const RentalLeaseSection: React.FC = () => {
  return (
    <HeroCard
      badge=""
      title="Create a Rental Lease in Minutes"
      description="No more copying and pasting details for every lease. With the help of AI, PMS auto-generates accurate, ready-to-sign lease agreements using your property and Pms data—saving time, reducing errors, and ensuring every document is consistent and compliant."
      features={[]}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      imageSrc="/Group.png"
      backgroundImageSrc="/rental-lease.png"
      showImageShadow={false}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[35rem]"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default RentalLeaseSection;
