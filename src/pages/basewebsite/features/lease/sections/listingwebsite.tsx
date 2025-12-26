import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const ListingWebsiteSection: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'Credit card required',
    'Cancel anytime',
  ] as const;
  return (
    <HeroCard
      badge="Listing Website"
      title="Showcase Rentals on a Dedicated Listing Website"
      description="Give your SmartTenantAI an opportunity to boost their credit history by paying rent on time—we’ll even waive the ACH fees as long as they’re enrolled."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      imageSrc="/Employe.png"
      imageWidth={420}
      imageTranslate=" -translate-x-6 sm:translate-x-28 translate-y-6 sm:translate-y-2"
      showImageShadow={false}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[40rem]"
      backgroundImageSrc="/vector3.png"
      backgroundImageTranslate="translate(100px, 40px) scale(1.3)"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default ListingWebsiteSection;


