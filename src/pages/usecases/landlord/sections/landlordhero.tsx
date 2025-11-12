import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';
import { Users } from 'lucide-react';

const UseCasesHeroSection: React.FC = () => {
  const features = [
    'Free 14 day trial',
    'No credit card required',
    'Cancel anytime',
  ] as const;

  return (
    <div className="w-full">
      <HeroCard
        badge="Landlord"
        badgeClassName="inline-flex items-center gap-3 px-4 py-2 rounded-xl font-heading text-2xl text-[#0B696B] font-medium leading-[150%] tracking-normal bg-white [border-width:1.65px] border-[#0B696B]"
        badgeCentered
        badgeLogoPosition="left"
        rightSideLogo={<Users className="h-5 w-5 text-[#0B696B]" strokeWidth={2.2} />}
        title="The all-in-one platform that helps you manage your portfolio with ease"
        description="Handle your rentals without the stress. PMSCloud brings listings, leases, payments, and maintenance in one place—saving you up to 20 hours a week."
        features={features}
        learnMoreLabel=""
        isCentered
        hideImage
        showStamp={false}
        showBackgroundCard={false}
        sectionPaddingClassName="px-6 sm:px-10 lg:px-16 py-10"
        sectionClassName="bg-transparent"
        contentPaddingClassName="px-0"
        titleMarginBottom="mb-6"
        descriptionMarginBottom="mb-0"
        sideContentLeft={
          <div className="hidden lg:block lg:-translate-x-6 xl:-translate-x-10 lg:transform">
            <img
              src="/uc-hero1.png"
              alt="Desktop dashboard preview"
              className="w-[276.1435546875px]  "
              loading="lazy"
            />
          </div>
        }
        sideContentRight={
          <div className="hidden lg:block lg:translate-x-6 xl:translate-x-10 lg:transform">
            <img
              src="/uc-hero2.png"
              alt="Mobile dashboard preview"
              className="w-[276.1435546875px]"
              loading="lazy"
            />
          </div>
        }
      />

      <div className="px-0 -mx-4 transform -translate-y-6 sm:-translate-y-10 lg:-translate-y-32">
        <img
          src="/usecase-hero.png"
          alt="Property manager reviewing portfolio insights"
          className="w-full "
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default UseCasesHeroSection;
