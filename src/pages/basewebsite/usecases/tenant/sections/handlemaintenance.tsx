import React from "react";
import { ClipboardList, MessageSquare, CheckCircle2 } from "lucide-react";
import HeroCard from "../../../../../components/common/cards/HeroCard";
import UsecaseCard from "../../../../../components/common/cards/usecasecard";

const HandleMaintenanceSection: React.FC = () => {
  const usecaseFeatures = [
    {
      icon: <ClipboardList size={24} />,
      title: "Photo and Video Requests",
      description: " Easily describe the issue and attach photos or videos so nothing gets lost in translation.",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Scheduling",
      description: "Approve entry times and coordinate details right inside the app, no more back and forth or missed appointments.",
    },
    {
      icon: <CheckCircle2 size={24} />,
      title: "Local Service Pros",
      description: "Your landlord can quickly connect with trusted local pros to handle repairs, so you can get back to living comfortably.",
    },
  ];

  return (
    <HeroCard
      badge=""
      title="Handle maintenance requests, hassle-free"
      description="Submit maintenance requests in seconds, track progress in real time, and get things fixed without the hassle."
      features={[]}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      imageSrc="/Group.png"
      backgroundImageSrc="/rental-lease.png"
      backgroundImageTranslate="translate(180px, 120px)"
      showImageShadow={true}
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


