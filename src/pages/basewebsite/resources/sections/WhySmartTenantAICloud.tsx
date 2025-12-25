import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const WhySmartTenantAICloud: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'Credit card required',
    'Cancel anytime',
  ] as const;

  return (
    <>
      <HeroCard
        badge="Why SmartTenantAI"
        title="The All-in-One Property Management Solution."
        description="Trusted by thousands of landlords and property managers, SmartTenantAI simplifies rental management with powerful, easy-to-use tools designed to save you time, reduce stress, and maximize your rental income."
        features={features}
        learnMoreLabel=""
        showStamp={false}
        showBackgroundCard={false}
        imageSrc="/whySmartTenantAICloudDashboard.png"
        imageWidth={450}
        imageHeight={500}
        backgroundImageSrc="/bg_vector.png"
        backgroundImageTranslate="translate(100px, 0px)"
        showImageShadow={false}
        imageNoTranslate={true}
        imageContain={true}
        imageMaxHeight="max-h-[40rem]"
        titleMarginBottom="mb-4"
        descriptionMarginBottom="mb-6"
      />
    </>
  );
};

export default WhySmartTenantAICloud;


