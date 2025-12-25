import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';

const ListYourRentalSection: React.FC = () => {
  return (
    <HeroCard
      title="List your rental on top partner sites—free"
      description="With SmartTenantAI, you can market your property in minutes. Just fill out your listing details, upload your best photos, and highlight your amenities. Once you're ready, you can publish and syndicate your listing to top rental sites at no extra cost."
      features={[]}
      learnMoreLabel=""

      showStamp={false}
      showBackgroundCard={false}
      showImageShadow={false}
      imageSrc="/Group.png"
      imageAlt="Advertise your rental property"
      imageContain
      imageMaxHeight="max-h-[26rem] sm:max-h-[30rem] md:max-h-[34rem]"
      imageNoTranslate
      hideBackgroundOnMobile
      backgroundImageSrc="/vector2.png"
      backgroundImageTranslate="translate(10px, -10px) lg:translate(10px, -10px) scale(1.2)"
      imageTranslate="-translate-x-2 sm:-translate-x-6 translate-y-4 sm:translate-y-8 lg:translate-y-12"
      sectionPaddingClassName="py-12 px-0"

      maxWidthClassName="max-w-7xl"
      contentClassName="gap-0 xl:gap-16"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
    />
  );
};

export default ListYourRentalSection;
