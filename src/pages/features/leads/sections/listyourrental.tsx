import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const ListYourRentalSection: React.FC = () => {
  return (
    <HeroCard
      title="List your rental on top partner sites—free"
      description="With PMSCloud, you can market your property in minutes. Just fill out your listing details, upload your best photos, and highlight your amenities. Once you’re ready, you can publish and syndicate your listing to top rental sites at no extra cost."
      features={[]}
      learnMoreLabel=""
      
      showStamp={false}
      showBackgroundCard={false}
      showImageShadow={false}
      imageSrc="/list-rental.png"
      imageAlt="Advertise your rental property"
      imageContain
      imageMaxHeight="max-h-[40rem]"
      imageNoTranslate
      sectionPaddingClassName="py-12 px-0"
      contentPaddingClassName="py-10"
      maxWidthClassName="max-w-7xl"
      contentClassName="gap-10 xl:gap-16"
      titleMarginBottom="mb-6"
      descriptionMarginBottom="mb-10"
    />
  );
};

export default ListYourRentalSection;
