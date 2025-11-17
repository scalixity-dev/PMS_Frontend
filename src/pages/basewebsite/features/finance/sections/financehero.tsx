import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';
import { DollarSign } from 'lucide-react';

const FinanceHeroSection: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'Credit card required',
    'Cancel anytime',
  ] as const;

  return (
    <HeroCard
      badge="Rent collection"
      badgeCentered
      title={<>Collect rent on time,<br/>every time</>}
      description="See 90% fewer late payments with automated rent reminders, late fees, and auto pay—all in one place. Plus, real-time reporting helps you keep track of every penny no matter how many properties you manage."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      showImageShadow={false}
      imageNoTranslate={true}
      leftImageTranslate="-translate-y-8 -translate-x-4 sm:-translate-y-10 sm:-translate-x-6 lg:-translate-y-6 lg:-translate-x-10"
       rightImageTranslate="translate-y-6 sm:translate-y-10 lg:translate-y-32"
      imageContain={true}
      imageMaxHeight="max-h-[20rem]"
      sectionPaddingClassName="p-0"
      contentPaddingClassName="px-0 py-10 sm:px-0 sm:py-14 lg:px-0 lg:py-32 2xl:px-0 2xl:py-32 3xl:px-0 4xl:px-0"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
      leftImageSrc="/finance-hero1.png"
      leftImageAlt="Finance left preview"
      rightImageSrc="/finance-hero2.png"
      rightImageAlt="Finance right preview"
      leftImageBottomLeftPattern={true}
      rightImageTopRightPattern={true}
      rightSideLogo={<DollarSign className="w-4 h-4 stroke-current" />}
    />
  );
};

export default FinanceHeroSection;


