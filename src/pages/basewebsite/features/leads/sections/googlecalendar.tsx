import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const GoogleCalendarSection: React.FC = () => {
  return (
    <HeroCard
      title="Sync with Google Calendar"
      betweenTitleAndDescription={
        <p className="font-heading font-light lg:text-sm xl:text-base leading-[150%] tracking-normal text-subheading mb-3">
          Your calendar at SmartTenantAI Cloud will keep you up to date on all of your rentals events such as warranties, recurring maintenance, insurance, lease expiration information, etc.
        </p>
      }
      description="Plus, you can synchronize your calendar with Google and never miss a thing!"
      features={[]}
      learnMoreLabel=""
      getStartedLabel="Login"
      showStamp={false}
      showBackgroundCard={false}
      showImageShadow={false}
      reverseLayout={false}
      reverseLayoutDesktop={true}
      contentClassName="gap-10 xl:gap-16"
      imageSrc="/calendar2.png"
      imageAlt="Google Calendar integration"
      backgroundImageSrc="/calendar1.png"
      backgroundImageTranslate="translate(20px, 20px) sm:translate(-150px, 100px)"
      imageContain
      imageMaxHeight="max-h-[35rem]"
      imageHeightMobile={220}
      imageHeightDesktop={460}
      imageTranslate="-translate-x-0 sm:-translate-x-6 lg:-translate-x-10 translate-y-2 sm:translate-y-6 lg:translate-y-6"
      imageNoTranslate
      sectionPaddingClassName="max-w-7xl p-0"
      contentPaddingClassName="px-6 py-10 sm:px-8 sm:py-14 lg:px-40 lg:py-16"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default GoogleCalendarSection;

