import React from 'react';
import HeroCard from '../../../../../components/common/cards/HeroCard';
import { Users } from 'lucide-react';


const UseCasesHeroSection: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'No credit card required',
    'Cancel anytime',
  ] as const;

  return (
    <div className="w-full relative">
      {/* background circles */}
      
      
      {/* small decorative circles */}
      <div 
        className="hidden md:block absolute rounded-full w-[24px] h-[24px] md:w-[28px] md:h-[28px] lg:w-[34px] lg:h-[34px] top-[45px] md:top-[50px] lg:top-[55px] right-[20%] md:right-[28%] lg:right-[34%] xl:right-[30%] 2xl:right-[20%] bg-[#4ADDAE] border-2 border-[#FFFEFE] shadow-[0px_3.09px_3.09px_0px_rgba(0,0,0,0.25)]"
      />
      <div 
        className="hidden md:block absolute rounded-full w-[16px] h-[16px] md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px] top-[100px] md:top-[115px] lg:top-[127px] right-[10%] md:right-[11%] lg:right-[13%] xl:right-[10%] 2xl:right-[8%] bg-[#FFE232] border-2 border-[#FFFEFE] shadow-[0px_3.09px_3.09px_0px_rgba(0,0,0,0.25)]"
      />
      <div 
        className="hidden md:block absolute rounded-full w-[24px] h-[24px] md:w-[28px] md:h-[28px] lg:w-[34px] lg:h-[34px] top-[200px] md:top-[240px] lg:top-[275px] left-[20px] md:left-[50px] lg:left-[80px] xl:left-[103px] bg-[#819A78] border-2 border-[#FFFEFE] shadow-[0px_3.09px_3.09px_0px_rgba(0,0,0,0.25)]"
      />
      
      <HeroCard
        badge="Landlord"
        badgeClassName="inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 md:py-2 rounded-lg sm:rounded-xl font-heading text-base sm:text-lg md:text-xl lg:text-2xl text-[#0B696B] font-medium leading-[150%] tracking-normal bg-white [border-width:1.65px] border-[#0B696B]"
        badgeCentered
        badgeLogoPosition="left"
        badgeLogoWrapperClassName="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full shrink-0 text-primary"
        rightSideLogo={<Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 text-[#0B696B]" strokeWidth={2.2} />}
        title="The all-in-one platform that helps you manage your portfolio with ease"
        description="Handle your rentals without the stress. PMSCloud brings listings, leases, payments, and maintenance in one place—saving you up to 20 hours a week."
        features={features}
        learnMoreLabel=""
        isCentered
        hideImage
        showStamp={false}
        showBackgroundCard={false}
        sectionPaddingClassName="px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-10 md:py-12 lg:py-10"
        sectionClassName="bg-transparent"
        contentPaddingClassName="px-0"
        titleMarginBottom="mb-4 sm:mb-5 md:mb-6"
        descriptionMarginBottom="mb-0"
        betweenDescriptionAndActions={
          <div className="flex justify-center md:hidden my-6 sm:my-8">
            <img
              src="/uc-hero1.png"
              alt="Desktop dashboard preview"
              className="w-[180px] sm:w-[200px]"
              loading="lazy"
            />
          </div>
        }
        sideContentLeft={
          <div className="hidden md:block md:-translate-x-2 lg:-translate-x-6 xl:-translate-x-10 md:transform">
            <img
              src="/uc-hero1.png"
              alt="Desktop dashboard preview"
              className="w-[180px] md:w-[220px] lg:w-[276.1435546875px]"
              loading="lazy"
            />
          </div>
        }
        sideContentRight={
          <div className="hidden lg:block lg:translate-x-6 xl:translate-x-10 lg:transform">
            <img
              src="/uc-hero2.png"
              alt="Mobile dashboard preview"
              className="w-[220px] lg:w-[276.1435546875px]"
              loading="lazy"
            />
          </div>
        }
      />

      <div className="px-0 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-8 transform -translate-y-4 sm:-translate-y-6 md:-translate-y-8 lg:-translate-y-20 xl:-translate-y-32">
        <img
          src="/usecase-hero.png"
          alt="Property manager reviewing portfolio insights"
          className="w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default UseCasesHeroSection;
