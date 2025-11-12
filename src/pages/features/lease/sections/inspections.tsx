import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const InspectionsSection: React.FC = () => {
  const features = ['Free 14 day trial', 'Credit card required', 'Cancel anytime'] as const;
  return (
    <HeroCard
      badge="Inspections"
      title="Simplify your next property inspection"
      description="Got a PMS moving in (or out)? Jot down every last detail of your rental’s condition with our digital Move-In Move-Out Inspection Tool—assisted by AI to detect, record, and organize property details effortlessly."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      reverseLayout={true}
      imageSrc="/Group.png"
      showImageShadow={false}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[35rem]"
      imageHeight={460}
      backgroundImageSrc="/vector2.png"
      backgroundImageTranslate="translate(-80px, -20px) scale(1.2)"
      imageTranslate="-translate-x-6 sm:-translate-x-20 translate-y-6 sm:translate-y-10"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default InspectionsSection;


