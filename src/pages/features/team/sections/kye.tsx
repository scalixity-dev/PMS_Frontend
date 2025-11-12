import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';
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
      reverseLayout
      imageSrc="/Group.png"
      imageAlt="AI drafted property description preview"
      imageContain
      imageMaxHeight="max-h-[35rem]"
      imageNoTranslate
      backgroundImageSrc="/vector1.png"
      backgroundImageTranslate="translate(0px, -40px)"
      imageTranslate="-translate-x-6 sm:-translate-x-20 translate-y-6 sm:translate-y-10"
      showImageShadow={false}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
      rightSideLogo={<Settings size={18} />}
    />
  );
};

export default KyeSection;
