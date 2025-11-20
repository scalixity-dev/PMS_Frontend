import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';
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
      sectionPaddingClassName="px-4 sm:px-6 lg:px-8"
      contentPaddingClassName="px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20 2xl:px-16 2xl:py-24"
      imageSrc="/accounting.png"
      showImageShadow={false}
      imageHeightMobile={260}
      imageHeightDesktop={460}
      imageTranslate="translate-y-2 sm:translate-y-6 md:translate-y-8 lg:translate-y-12"
      imageMaxHeight="max-h-[30rem]"
      imageContain={true}
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default AccountingSection;

