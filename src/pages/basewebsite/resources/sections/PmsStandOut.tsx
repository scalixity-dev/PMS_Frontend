import React from 'react';
import { LearnMoreCard } from './ResourceCards';
// import { Diamond } from './resourceIcons';

export const PMSStandOut: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-center text-4xl font-bold text-slate-900 mb-16">
          What Makes PmsCloud Stand Out?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 place-items-center">
          
          {/* Card 1: Rent Collection */}
          <LearnMoreCard
            title="Rent Collection and Accounting"
            description="Get paid on time every time with online rent collection and automatic invoices, all in one place."
            imageUrl="/pmsStandOut1.png"
            imageAlt="Rent collection dashboard screenshot"
            backgroundColorClass="bg-[#48FF06]/20"
          />

          {/* Card 2: Listings & Lead Management */}
          <LearnMoreCard
            title="Listings & Lead Management"
            description="Showcase your rentals on a custom website or share your listings on several popular sites in one click."
            imageUrl="/pmsStandOut2.png"
            imageAlt="Listings and lead management dashboard screenshot"
            backgroundColorClass="bg-[#819A78]/20"
          />

          {/* Card 3: Pms Screenings & Applications */}
          <LearnMoreCard
            title="Pms Screenings & Applications"
            description="Find reliable Pms even faster with our comprehensive criminal, identification, and finance screenings."
            imageUrl="/pmsStandOut1.png"
            imageAlt="PMS screenings dashboard screenshot"
            backgroundColorClass="bg-[#48FF06]/20"
          />

        </div>
      </div>
    </section>
  );
};

export default PMSStandOut;