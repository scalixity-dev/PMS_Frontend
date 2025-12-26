import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const ConvertLeadsSection: React.FC = () => {
  return (
    <HeroCard
      title="Convert leads into tenants"
      description="Once you have leads, just click 'Invite to apply' and select the listing from your vacancies. We'll send your leads a link to apply online and make the process easier for everyone. All rental applications will go straight to your SmartTenantAI account for you to review."
      features={[]}
      learnMoreLabel=""
      getStartedLabel="Learn more"
      showStamp={false}
      hideImage
      isCentered
      showImageShadow={false}
      sectionPaddingClassName="bg-[#F4F7FF] p-4 sm:p-6 lg:p-10"
      contentPaddingClassName="px-6 py-14 sm:px-10 sm:py-16 lg:px-20"
      descriptionMarginBottom="mb-6"
      showBackgroundCard
      backgroundCardClassName="bg-[#B9E4C8]"
    />
  );
};

export default ConvertLeadsSection;
