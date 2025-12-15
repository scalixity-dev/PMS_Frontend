import React from 'react';
import { ClipboardList, BarChart3, Send } from 'lucide-react';
import HeroCard from '../../../../../components/common/cards/HeroCard';
import UsecaseCard from '../../../../../components/common/cards/usecasecard';

const KeepPropertySection: React.FC = () => {
  const usecaseFeatures = [
    {
      icon: <ClipboardList size={24} />,
      title: 'Assign Properties',
      description: 'Connect owners to their properties for easy organization.',
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Share Reports',
      description: 'Compile a variety of property reports and share them directly.',
    },
    {
      icon: <Send size={24} />,
      title: 'Get Approvals',
      description: 'Send maintenance requests and get repair costs approved in record time.',
    },
  ];

  return (
    <HeroCard
      badge=""
      title="Keep property owners in the loop"
      description="Create rental reports and get them sent, seen, and approved in seconds."
      features={[]}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      imageSrc="/Group.png"
      backgroundImageSrc="/rental-lease.png"
      backgroundImageTranslate="translate(-20px, 30px)"
      backgroundImageClassName="translate-x-10 sm:translate-x-20 lg:translate-x-20 2xl:translate-x-32"
      showImageShadow={false}
      imageNoTranslate
      imageTranslate="translate-x-4 translate-y-6 lg:translate-x-10 lg:translate-y-12"
      imageMaxHeight="max-h-[35rem]"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
      sectionClassName="bg-transparent"
      sectionPaddingClassName="px-6 sm:px-10 2xl:px-0 py-2 "
      contentPaddingClassName="px-0"
      maxWidthClassName="max-w-7xl"
      embeddedContent={
        <UsecaseCard
          features={usecaseFeatures}
        />
      }
    />
  );
};

export default KeepPropertySection;
