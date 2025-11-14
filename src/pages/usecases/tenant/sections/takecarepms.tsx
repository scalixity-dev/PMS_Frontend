import React from "react";
import { MessageCircle, Receipt, ShieldCheck } from "lucide-react";
import HeroCard from "../../../../components/common/cards/HeroCard";

const TakeCarePmsSection: React.FC = () => {
  const features = [] as const;
  const cards = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      title: "Renters Insurance",
      description:
        "Get peace of mind by protecting yourself and your belongings with affordable renters insurance.",
    },
    {
      icon: <Receipt className="h-6 w-6 text-white" />,
      title: "Rental History",
      description:
        "Keep a clear rental record to boost your credibility. Access current and past leases stored securely in one spot.",
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-white" />,
      title: "TC Messenger",
      description:
        "Skip the phone tag. Chat with your landlord instantly through the app and keep all conversations organized.",
    },
  ] as const;

  return (
    <HeroCard
      title="Take care of PMS to-do’s"
      description="Everything you need to stay on top of your rental is right in your pocket. Handle day-to-day tasks, protect your home, and stay connected with your landlord, all on PMS."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      reverseLayout
      imageSrc="/Group.png"
      showImageShadow={true}
      imageNoTranslate
      imageMaxHeight="max-h-[30rem]"
      backgroundImageSrc="/vector4.png"
      backgroundImageTranslate="translate(-60px, 20px) scale(1.2)"
      imageTranslate="-translate-x-6 sm:-translate-x-2 translate-y-6 sm:translate-y-20"
      titleMarginBottom="mb-4"
      descriptionMarginBottom="mb-6"
      contentClassName="gap-12 xl:gap-16"
      embeddedContent={
        <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-2 border-l-4 border-[#034243] bg-gradient-to-r from-[#0E7A67] to-[#B8C6C4] p-4 text-white shadow-lg sm:flex-row sm:items-center sm:gap-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full ">
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

export default TakeCarePmsSection;

