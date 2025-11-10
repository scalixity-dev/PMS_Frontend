import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const QualityLeadsSection: React.FC = () => {
  return (
    <HeroCard
      title="Find Quality Leads in Less Time"
      betweenTitleAndDescription={
        <p className="font-heading font-light lg:text-sm xl:text-base leading-[150%] tracking-normal text-subheading mb-4">
          Save time by only working with eligible applicants. Pms Turner makes it easy to pre-qualify Pms before they can schedule a tour. (And with an approval rate of 68%, that’s a lot of time saved.)
        </p>
      }
      description="“Our no-show percentage was about 90% and I spent most of my day going and waiting on somebody to show up. Pms Turner changed my day completely- it cut my time spent on leasing in half.” —"
      features={[]}
      learnMoreLabel=""
      
      showStamp={false}
      showBackgroundCard={false}
      showImageShadow={false}
      imageSrc="/quality-leads.png"
      imageAlt="Dashboard showing qualified leads"
      imageContain
      imageMaxHeight="max-h-[40rem]"
      imageNoTranslate
      imageTranslate="translate-x-6 sm:translate-x-10 lg:translate-x-32"
      sectionPaddingClassName="py-12 px-0"
      contentPaddingClassName="py-10"
      maxWidthClassName="max-w-7xl"
      contentClassName="gap-10 xl:gap-16"
      titleMarginBottom="mb-6"
      descriptionMarginBottom="mb-10"
    />
  );
};

export default QualityLeadsSection;

