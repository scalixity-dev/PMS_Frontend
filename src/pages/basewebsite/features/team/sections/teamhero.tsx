import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';
import { Users } from 'lucide-react';

const TeamManagementSection: React.FC = () => {
  const features = [
    "Free 14 day trial",
    "Credit card required",
    "Cancel anytime"
  ] as const;

  return (
    <HeroCard
      badge="Team Management"
      title="Work smarter with built-in team management"
      description="Make it a team effort with PmsCloud’s cutting-edge workflow tools. Landlords who use Team Management save up to 9 hours per week on tasks."
      features={features}
      learnMoreLabel=""
      showStamp={false}
      showBackgroundCard={false}
      sectionPaddingClassName="py-12 px-0"
      contentPaddingClassName="py-10"
      maxWidthClassName="max-w-7xl"
      contentClassName="gap-10 xl:gap-16"
      titleMarginBottom="mb-6"
      descriptionMarginBottom="mb-10"
      imageSrc="/hero-team.png"
      imageAlt="Collaborative team workspace"
      imageContain
      imageMaxHeight="max-h-[40rem]"
      imageNoTranslate
      showImageShadow={false}
      rightSideLogo={<Users size={18} />}
    />
  );
};

export default TeamManagementSection;

