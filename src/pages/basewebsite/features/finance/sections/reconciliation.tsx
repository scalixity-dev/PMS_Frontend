import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';
import { ClipboardCheck } from 'lucide-react';

const ReconciliationSection: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'Credit card required',
    'Cancel anytime',
  ] as const;

  return (
    <HeroCard
      badge="Reconciliation"
      rightSideLogo={<ClipboardCheck className="w-4 h-4 stroke-current" />}
      title="Make payments easier with bank reconciliation"
      description="Organize every transaction, get more time back. Landlords report saving 10+ hours a month with Bank Reconciliation compared to manual methods."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      imageSrc="/Employe.png"
      showImageShadow={false}
      imageNoTranslate={true}
      imageContain={true}
      imageMaxHeight="max-h-[35rem]"
      imageHeightMobile={220}
      imageHeightDesktop={460}
      backgroundImageSrc="/vector3.png"
      backgroundImageTranslate="translate(20px, 20px) sm:translate(40px, 40px)"
      imageTranslate="-translate-x-0 sm:translate-x-0 lg:translate-x-0 translate-y-2 sm:translate-y-6 lg:translate-y-6"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default ReconciliationSection;

