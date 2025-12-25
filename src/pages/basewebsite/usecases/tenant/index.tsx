import React from "react";
import FeatureHighlightSection from "../../../../components/FeatureHighlightSection";
import RentalFeaturesSection from "./sections/RentalFeaturesSection";
import TakeCareSmartTenantAISection from "./sections/takecareSmartTenantAI";
import HandleMaintenanceSection from "./sections/handlemaintenance";
import NextHomeSection from "./sections/nexthome";
import { Users } from 'lucide-react';

const TenantPage: React.FC = () => {
  return (
    <section className="w-full">
      <div className="mt-5">
        <FeatureHighlightSection
          badge="SmartTenantAI"
          badgeLogo={<Users className="h-5 w-5 text-[#0B696B]" strokeWidth={2.2} />}
          badgeLogoPosition="left"
          badgeClassName="inline-flex items-center gap-3 px-4 py-2 rounded-md font-heading text-2xl text-[#0B696B] font-medium leading-[150%] tracking-normal bg-white [border-width:1.65px] border-[#0B696B]"
          title="Feel right at home in your rental"
          subtitle=""
          description="Let's make renting easy. With SmartTenantAI, you can find a new home, build your rental history, submit maintenance requests, and pay rent, all online."
        />
      </div>

      <RentalFeaturesSection />
      <TakeCareSmartTenantAISection />
      <HandleMaintenanceSection />
      <NextHomeSection />
    </section>
  );
};

export default TenantPage;