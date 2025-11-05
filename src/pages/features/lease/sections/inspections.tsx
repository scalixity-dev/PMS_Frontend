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
      imageSrc="/inspections.png"
      showImageShadow={false}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[35rem]"
      imageHeight={460}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default InspectionsSection;


