import React from "react";
import { FileSignature, Stars, UserRound } from "lucide-react";
import HeroCard from "../../../../components/common/cards/HeroCard";

const NextHomeSection: React.FC = () => {
  const features = [] as const;
  const cards = [
    {
      icon: <UserRound className="h-6 w-6 text-white" />,
      title: "Renters Profile",
      description:
        "Stand out from the crowd. Create a renter profile with your rental history, agreements, and payment receipts to share instantly with landlords.",
    },
    {
      icon: <FileSignature className="h-6 w-6 text-white" />,
      title: "Easy-Click Application",
      description:
        "Apply faster. Use the same application for multiple listings and cut out the repetitive paperwork.",
    },
    {
      icon: <Stars className="h-6 w-6 text-white" />,
      title: "Smart Matches",
      description:
        "Get invited by landlords to view listings that match your preferences, so the right place can find you.",
    },
  ] as const;

  return (
    <HeroCard
      title="Find your next home"
      description="Spare the endless scrolling. Search rentals that match your exact needs and connect directly with landlords ready to rent."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      reverseLayout
      imageSrc="/Employe.png"
      imageWidth={480}
      imageTranslate="translate-y-6 sm:translate-y-28"
      showImageShadow={false}
      imageNoTranslate={true}
      imageMaxHeight="max-h-[24rem]"
      backgroundImageSrc="/vector3.png"
      backgroundImageTranslate="translate(50px, 120px) scale(1.2)"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-2"
      contentClassName="gap-12 xl:gap-16"
      embeddedContent={
        <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-2 border-l-4 border-[#034243] bg-gradient-to-r from-[#0E7A67] to-[#B8C6C4] p-4 text-white shadow-lg sm:flex-row sm:items-center sm:gap-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full">
                {card.icon}
              </span>
              <p className="text-sm leading-[150%] text-white/90 sm:text-base">
                <span className="mr-2 text-base font-semibold text-white sm:text-lg">
                  {card.title}:
                </span>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      }
    />
  );
};

export default NextHomeSection;

