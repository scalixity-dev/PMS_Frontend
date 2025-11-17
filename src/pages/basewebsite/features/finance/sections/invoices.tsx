import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const InvoicesSection: React.FC = () => {
  return (
    <HeroCard
      badge=""
      title={
        <>
          AI Handles Your
          <br />
          Invoices in Seconds.
        </>
      }
      description="Automate your entire invoicing process with AI that creates, customizes, and sends payment receipts instantly—no manual effort required."
      features={[]}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      showImageShadow={false}
      reverseLayoutDesktop={true}
      imageSrc="/lease-invoice.png"
      imageAlt="Invoices preview"
      hideBackgroundOnMobile
      imageContain={true}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[30rem]"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default InvoicesSection;

