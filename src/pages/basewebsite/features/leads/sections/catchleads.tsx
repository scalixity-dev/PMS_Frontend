import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const CatchLeadsSection: React.FC = () => {
  return (
    <HeroCard
      title="Catch all your leads"
      description="All leads will automatically appear in your CRM tool when potential tenants reach out with questions and tour requests from your listing website, submit rental applications, or when you add leads manually."
      betweenTitleAndDescription={
        <p className="font-heading font-light lg:text-sm xl:text-base leading-[150%] tracking-normal text-subheading mb-3">
          With our Leads Tracking Tool you can view all prospective tenants and Premium Leads when you log into your SmartTenantAI account.
        </p>
      }
      features={[]}
      learnMoreLabel=""
      getStartedLabel="Login"
      showBackgroundCard={false}
      showStamp={false}
      showImageShadow={false}
      imageSrc="/Employe.png"
      imageAlt="Reconciliation"
      imageNoTranslate={true}
      imageContain={true}
      imageMaxHeight="max-h-[35rem]"
      imageHeightMobile={220}
      imageHeightDesktop={460}
      imageTranslate="-translate-x-0 sm:translate-x-0 lg:translate-x-0 translate-y-2 sm:translate-y-6 lg:translate-y-6"
      backgroundImageSrc="/vector3.png"
      backgroundImageTranslate="translate(20px, 20px) sm:translate(40px, 40px)"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
      maxWidthClassName="max-w-7xl"
      sectionPaddingClassName=" px-0 sm:px-6 lg:px-0"
    />
  );
};

export default CatchLeadsSection;

