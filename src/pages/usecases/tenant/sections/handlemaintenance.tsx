import React from "react";
import { ClipboardList, MessageSquare, CheckCircle2 } from "lucide-react";
import HeroCard from "../../../../components/common/cards/HeroCard";
import UsecaseCard from "../../../../components/common/cards/usecasecard";

const HandleMaintenanceSection: React.FC = () => {
  const usecaseFeatures = [
    {
      icon: <ClipboardList size={24} />,
      title: "Report Issues Fast",
      description: "Log maintenance requests in seconds so nothing slips through the cracks.",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Stay in the Loop",
      description: "Chat with your landlord about updates and approvals without leaving the app.",
    },
    {
      icon: <CheckCircle2 size={24} />,
      title: "Track Progress",
      description: "See the status of every request, from scheduling to completion, all in one timeline.",
    },
  ];

  return (
    <HeroCard
      badge=""
      title="Handle maintenance without the hassle"
      description="Submit issues, follow updates, and keep your space comfortable. PMS makes maintenance simple for every tenant."
      features={[]}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      imageSrc="/Group.png"
      backgroundImageSrc="/rental-lease.png"
      backgroundImageTranslate="translate(180px, 120px)"
      showImageShadow={false}
      imageNoTranslate
      imageTranslate="translate-x-4 translate-y-6 lg:translate-x-10 lg:translate-y-12"
      imageMaxHeight="max-h-[35rem]"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
      sectionClassName="bg-transparent"
      sectionPaddingClassName="px-6 sm:px-10 lg:px-0 py-2"
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

export default HandleMaintenanceSection;


