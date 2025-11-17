import React from "react";
import { Wrench } from "lucide-react";
import SplitHeroFeature from "../../../../../components/SplitHeroFeature";

const ServiceProsHero: React.FC = () => {
  return (
    <SplitHeroFeature
      badgeText="For Service Pros"
      icon={<Wrench className="text-[#0C6A58]" strokeWidth={1.6} />}
      badgeVariant="elevated"
      innerSpacingClassName="py-28 px-6 md:px-12 lg:px-20"
      title="Get hired by landlords near you"
      description="Contractor, plumber, or HVAC? PMS Cloud connects service professionals with property owners who need reliable help. Build your profile, showcase your skills, and start getting new jobs without the hassle of chasing leads."
      imageSrc="/servicepro-hero.png"
      imageWrapperClassName="md:translate-x-6 lg:translate-x-32 translate-y-6 lg:-translate-y-4"
      allowContentOverflow
      imageBackgroundSrc="/vector2.png"
      imageBackgroundClassName="-top-10 -right-28 w-[460px] -z-10 opacity-90 pointer-events-none"
      outerMaxWidthClassName="max-w-6xl"
      backgroundClassName="bg-[#20CC95]"
    />
  );
};

export default ServiceProsHero;

