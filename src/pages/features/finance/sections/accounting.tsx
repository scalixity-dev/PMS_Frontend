import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';
import { Calculator } from 'lucide-react';

const AccountingSection: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'Credit card required',
    'Cancel anytime',
  ] as const;

  return (
    <HeroCard
      badge="Accounting"
      rightSideLogo={<Calculator className="w-4 h-4 stroke-current" />}
      title={<>Track every dollar, save hours</>}
      description="Ditch third-party tools. Landlords report saving up to 20 hours a week on admin work with PMSCloud’s built-in accounting software."
      features={features}
      learnMoreLabel=""
      showBackgroundCard={false}
      showStamp={false}
      imageSrc="/accounting.png"
      showImageShadow={false}
      imageTranslate="translate-y-8"
      imageMaxHeight="max-h-[20rem]"
      imageContain={true}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default AccountingSection;

