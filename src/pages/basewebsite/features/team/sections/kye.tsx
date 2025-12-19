import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';
import { Settings } from 'lucide-react';

const KyeSection: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'Credit card required',
    'Cancel anytime',
  ] as const;

  return (
    <HeroCard
      badge="Kye"
      title="Meet kye.ai: Your AI-Powered Listing Assistant"
      description="Say hello to kye, your smart, snappy, and helpful new AI assistant in PMSCloud. Whether you’ve got one listing or ten, Kye helps you write polished, professional property descriptions in seconds."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      sectionPaddingClassName="py-0 px-4 sm:px-6 lg:px-0"
      contentPaddingClassName="py-10 px-4 sm:px-8 lg:px-10"
      contentClassName="gap-8 lg:gap-10 xl:gap-16"
      reverseLayoutDesktop
      imageSrc="/Group.png"
      imageAlt="AI drafted property description preview"
      imageContain
      imageMaxHeight="max-h-[18rem] sm:max-h-[26rem] lg:max-h-[32rem] xl:max-h-[38rem]"
      imageHeightMobile={260}
      imageHeightDesktop={440}
      imageNoTranslate
      backgroundImageSrc="/vector1.png"
      backgroundImageTranslate="translate(-10px, -10px)"
      imageTranslate="-translate-x-4 sm:-translate-x-10 translate-y-6 sm:translate-y-10 lg:translate-y-6"
      showImageShadow={false}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
      rightSideLogo={<Settings size={18} />}
    />
  );
};

export default KyeSection;
