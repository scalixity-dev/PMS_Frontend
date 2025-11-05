import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

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
      description="Give your Pms an opportunity to boost their credit history by paying rent on time—we’ll even waive the ACH fees as long as they’re enrolled."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      imageSrc="/listing.png"
      imageWidth={420}
      imageTranslate="ml-auto"
      showImageShadow={false}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[27rem]"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default ListingWebsiteSection;


