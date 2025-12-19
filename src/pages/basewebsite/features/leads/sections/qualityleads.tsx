import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const QualityLeadsSection: React.FC = () => {
  return (
    <>
      <style>{`
        .quality-leads-section img[alt="Background"] {
          transform: translate(10px, 60px) scale(1.2) !important;
          display: none !important;
        }
        @media (min-width: 1024px) {
          .quality-leads-section img[alt="Background"] {
            transform: translate(400px, 60px) scale(1.7) !important;
            display: block !important;
          }
        }
      `}</style>
      <div className="quality-leads-section">
        <HeroCard
          title="Find Quality Leads in Less Time"
          betweenTitleAndDescription={
            <p className="font-heading font-light lg:text-sm xl:text-base leading-[150%] tracking-normal text-subheading mb-4">
              Save time by only working with eligible applicants. Pms Turner makes it easy to pre-qualify Pms before they can schedule a tour. (And with an approval rate of 68%, that's a lot of time saved.)
            </p>
          }
          description='"Our no-show percentage was about 90% and I spent most of my day going and waiting on somebody to show up. Pms Turner changed my day completely- it cut my time spent on leasing in half." —'
          features={[]}
          learnMoreLabel=""
          
          showStamp={false}
          showBackgroundCard={false}
          showImageShadow={false}
          imageSrc="/Group.png"
          imageAlt="Dashboard showing qualified leads"
          imageContain
          imageMaxHeight="max-h-[26rem] sm:max-h-[30rem] md:max-h-[34rem]"
          imageNoTranslate
          hideBackgroundOnMobile
          imageTranslate="-translate-x-2 sm:-translate-x-6 translate-y-4 sm:translate-y-8 lg:translate-y-2"
          backgroundImageSrc="/vector5.png"
          backgroundImageTranslate="translate(10px, 60px) scale(1.2)"
          sectionPaddingClassName="py-0 sm:py-10 px-6"
          contentPaddingClassName="py-0"
          maxWidthClassName="max-w-7xl"
          contentClassName="gap-0 xl:gap-16"
          titleMarginBottom="mb-4"
          descriptionMarginBottom="mb-6"
        />
      </div>
    </>
  );
};

export default QualityLeadsSection;

