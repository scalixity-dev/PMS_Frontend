import React from 'react';
import HeroCard from '../../../components/common/cards/HeroCard';

const WhyPmsCloud: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'Credit card required',
    'Cancel anytime',
  ] as const;

  return (
    <>
      <HeroCard
        badge="Why PMSCloud"
        title="The All-in-One Property Management Solution."
        description="Trusted by thousands of landlords and property managers, PmsCloud simplifies rental management with powerful, easy-to-use tools designed to save you time, reduce stress, and maximize your rental income."
        features={features}
        learnMoreLabel=""
        showStamp={false}
        showBackgroundCard={false}
        imageSrc="/WhyPmsCloud.png"
        showImageShadow={false}
        imageNoTranslate={true}
        imageContain={true}
        imageMaxHeight="max-h-[40rem]"
        imageHeight={460}
        titleMarginBottom="mb-4"
        descriptionMarginBottom="mb-6"
      />
    </>
  );
};

export default WhyPmsCloud;


