import React from 'react';
import { LearnMoreCard } from './ResourceCards';
// import { Diamond } from './resourceIcons';

export const SmartTenantAIStandOut: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-center text-4xl font-bold text-slate-900 mb-16">
          What Makes SmartTenantAI Stand Out?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 place-items-center">

          {/* Card 1: Rent Collection */}
          <LearnMoreCard
            title="Rent Collection and Accounting"
            description="Get paid on time every time with online rent collection and automatic invoices, all in one place."
            imageUrl="/SmartTenantAIStandOut1.png"
            imageAlt="Rent collection dashboard screenshot"
            backgroundColorClass="bg-[#48FF06]/20"
          />

          {/* Card 2: Listings & Lead Management */}
          <LearnMoreCard
            title="Listings & Lead Management"
            description="Showcase your rentals on a custom website or share your listings on several popular sites in one click."
            imageUrl="/SmartTenantAIStandOut2.png"
            imageAlt="Listings and lead management dashboard screenshot"
            backgroundColorClass="bg-[#819A78]/20"
          />

          {/* Card 3: SmartTenantAI Screenings & Applications */}
          <LearnMoreCard
            title="Tenant Screenings & Applications"
            description="Find reliable tenants even faster with our comprehensive criminal, identification, and finance screenings."
            imageUrl="/SmartTenantAIStandOut1.png"
            imageAlt="SmartTenantAI screenings dashboard screenshot"
            backgroundColorClass="bg-[#48FF06]/20"
          />

        </div>
      </div>
    </section>
  );
};

export default SmartTenantAIStandOut;