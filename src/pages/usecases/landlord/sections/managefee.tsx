import React from 'react';
import { Receipt, Wallet2, PieChart } from 'lucide-react';
import HeroCard from '../../../../components/common/cards/HeroCard';
import UsecaseCard from '../../../../components/common/cards/usecasecard';

const ManageFeeSection: React.FC = () => {
  const usecaseFeatures = [
    {
      icon: <Receipt size={24} />,
      title: 'Owner Distributions',
      description: 'Set owner fees automatically for easy business financing.',
    },
    {
      icon: <Wallet2 size={24} />,
      title: 'Management Fees',
      description: 'Generate auto invoices for property managers on rent day. ',
    },
    {
      icon: <PieChart size={24} />,
      title: 'Renewal Fees',
      description: 'Send renewal fee invoices to owners when a lease is renewed, saving time and paperwork ',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto">
      <HeroCard
        badge=""
        title="Manage every fee with confidence"
        description="Automate fee schedules, reconcile payments, and keep owners informed without spreadsheets."
        features={[]}
        learnMoreLabel=""
        getStartedLabel=""
        showStamp={false}
        showBackgroundCard={false}
        imageSrc="/managefee.png"
        showImageShadow={false}
        imageNoTranslate
        imageMaxHeight="max-h-[27rem]"
        titleMarginBottom="mb-4"
        descriptionMarginBottom="mb-6"
        sectionClassName="bg-transparent"
        imageTranslate=" translate-y-6  lg:translate-y-20"
        sectionPaddingClassName="px-6 sm:px-10 lg:px-0 py-20 "
        contentPaddingClassName="px-0"
        maxWidthClassName="max-w-full"
        reverseLayout
        embeddedContent={
          <UsecaseCard
            features={usecaseFeatures}
            featuresGridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2"
          />
        }
      />
    </section>
  );
};

export default ManageFeeSection;

