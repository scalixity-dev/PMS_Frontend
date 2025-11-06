import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const InvoicesSection: React.FC = () => {
  return (
    <HeroCard
      title={<>AI Handles Your<br/>Invoices in Seconds.</>}
      description="Automate your entire invoicing process with AI that creates, customizes, and sends payment receipts instantly—no manual effort required."
      features={[]}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      showImageShadow={false}
      reverseLayout={true}
      imageSrc="/lease-invoice.png"
      imageAlt="Invoices preview"
      imageContain={true}
      imageMaxHeight="max-h-[30rem]"
      imageTranslate="-translate-x-4 sm:-translate-x-6 lg:-translate-x-8"
      imageNoTranslate={true}
      sectionPaddingClassName="p-0"
      titleMarginBottom="mb-6"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default InvoicesSection;

