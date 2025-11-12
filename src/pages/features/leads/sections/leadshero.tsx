import React from 'react';
import HeroCard from '../../../../components/common/cards/HeroCard';

const LeadsHeroSection: React.FC = () => {
  return (
    <div className="relative px-4 sm:px-6 lg:px-10 py-12">
      {/* Bottom-left polygon */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute w-[358.28771711408075px] h-[346.93926704512165px] top-[291px] left-[-282px] rotate-[30.86deg] opacity-[0.21] bg-[#20CC59] [box-shadow:0px_1.25px_2.12px_0px_#00000002,0px_5.5px_4.4px_0px_#00000003,0px_13.49px_8.77px_0px_#00000004,0px_25.98px_17.19px_0px_#00000005,0px_43.71px_31.6px_0px_#00000006,0px_67.44px_53.95px_0px_#00000008] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
      />
      {/* Top-right polygon */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute w-[358.28771711408075px] h-[346.93926704512165px] top-[10px] right-[-240px] rotate-[26.43deg] opacity-[0.21] bg-[#20CC59] [box-shadow:0px_1.25px_2.12px_0px_#00000002,0px_5.5px_4.4px_0px_#00000003,0px_13.49px_8.77px_0px_#00000004,0px_25.98px_17.19px_0px_#00000005,0px_43.71px_31.6px_0px_#00000006,0px_67.44px_53.95px_0px_#00000008] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
      />
      <HeroCard
        badge="Leads Tracking"
        badgeClassName="inline-flex items-center justify-center w-[132px] h-[40px] px-[10px] rounded-[12px] bg-[#B4FFD3] opacity-100 font-heading text-base text-[#0B696B] font-medium leading-none tracking-normal whitespace-nowrap"
        title="Lead Tracking Tool"
        description="Receive and manage leads right in your PMSCloud account."
        features={[]}
        learnMoreLabel=""
        showStamp={false}
        showBackgroundCard={false}
        imageSrc="/leads-hero.png"
        showImageShadow={false}
        imageNoTranslate={true}
        imageContain={true}
        imageMaxHeight="max-h-[27rem]"
        imageHeight={460}
        titleMarginBottom="mb-4"
        descriptionMarginBottom="mb-6"
      />
    </div>
  );
};

export default LeadsHeroSection;



