import React from 'react';
import { Home } from 'lucide-react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const PremiumLeadsSection: React.FC = () => {
  return (
    <HeroCard
      title={
        <>
          <span className="mb-6 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#CFFBBF] text-primary shadow-[0_4px_0_0_#00000040]">
              <Home className="h-6 w-6" aria-hidden="true" />
            </span>
          </span>
          Premium Leads
        </>
      }
      betweenTitleAndDescription={
        <p className="font-heading font-light lg:text-sm xl:text-base leading-[150%] tracking-normal text-subheading mb-4">
          Find new renters easily by inviting PMS to apply to your vacant rentals.
        </p>
      }
      description={
        <>
         With Premium Leads, the system analyzes your vacancies and 
          <br />
          recommends the best applicants that match your listing.
        </>
      }
      features={[]}
      learnMoreLabel=""
      getStartedLabel="Learn more"
      showStamp={false}
      hideImage
      isCentered
      showImageShadow={false}
      sectionPaddingClassName="bg-[#F4F7FF] p-4 sm:p-6 lg:p-10"
      contentPaddingClassName="px-6  sm:px-10 lg:px-20"
      descriptionMarginBottom="mb-8"
      showBackgroundCard={false}
    />
  );
};

export default PremiumLeadsSection;

