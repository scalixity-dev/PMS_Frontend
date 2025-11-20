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
      leftImageTranslate="translate-y-0 -translate-x-6 sm:translate-y-0 sm:-translate-x-7 lg:-translate-y-6 lg:-translate-x-10"
       rightImageTranslate="translate-y-6 sm:translate-y-10 lg:translate-y-32"
      imageContain={true}
      imageMaxHeight="max-h-[18rem] sm:max-h-[22rem] lg:max-h-[24rem]"
      sectionPaddingClassName="px-4 sm:px-6 lg:px-8"
      contentPaddingClassName="px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-28 2xl:px-16 2xl:py-32"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
      leftImageSrc="/finance-hero1.png"
      leftImageAlt="Finance left preview"
      rightImageSrc="/finance-hero2.png"
      rightImageAlt="Finance right preview"
      hideRightImageOnMobile
      mobileImageBetweenContent
      leftImageBottomLeftPattern={false}
      rightImageTopRightPattern={false}
      rightSideLogo={<DollarSign className="w-4 h-4 stroke-current" />}
    />
  );
};

export default FinanceHeroSection;


