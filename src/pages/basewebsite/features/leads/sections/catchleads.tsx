import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const CatchLeadsSection: React.FC = () => {
  return (
    <HeroCard
      title="Catch all your leads"
      description="All leads will automatically appear in your CRM tool when potential PMS reach out with questions and tour requests from your listing website, submit rental applications, or when you add leads manually."
      betweenTitleAndDescription={
        <p className="font-heading font-light lg:text-sm xl:text-base leading-[150%] tracking-normal text-subheading mb-3">
          With our Leads Tracking Tool you can view all prospective PMS and Premium Leads when you log into your PMSCloud account.
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
      imageWidth={400}
      imageTranslate="-translate-x-6 sm:translate-x-28 translate-y-6 sm:translate-y-0"
      backgroundImageSrc="/vector3.png"
      backgroundImageTranslate="translate(120px, 20px) scale(1.2)"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
      maxWidthClassName="max-w-7xl"
      sectionPaddingClassName="py-12 px-0"
      contentPaddingClassName="py-10"
    />
  );
};

export default CatchLeadsSection;

