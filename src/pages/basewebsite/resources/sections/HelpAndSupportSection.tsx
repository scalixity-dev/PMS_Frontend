import React from 'react';
import { SupportCard } from './ResourceCards';
import { ChatIcon, SupportIcon } from './resourceIcons';

const HelpAndSupportSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 justify-items-center">
        
        {/* Card 1: Help Center */}
        <SupportCard
          icon={<SupportIcon />}
          title="Help Center"
          description="Search our knowledge base, read articles, and quick start guides to help your business grow."
          ctaText="Visit Help Center"
          ctaHref="#contact-section"
        />

        {/* Card 2: Priority Support */}
        <SupportCard
          icon={<ChatIcon />}
          title="Priority Support"
          description="PmsCloud business clients have access to immediate telephone support from 9 AM to 5 PM CST and are first in line for ticket responses."
          ctaText="Upgrade"
          ctaHref="#contact-section"
        />

      </div>
    </section>
  );
};

export default HelpAndSupportSection;