import React from 'react';
import { ChatIcon, SupportIcon } from './resourceIcons';
import { SupportCard } from './ResourceCards';

const SupportSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      {/* Grid container to lay out the cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">

        {/* Card 1: Technical Support */}
        <SupportCard
          icon={<SupportIcon />}
          title="Technical Support"
          description="Already using our product and experiencing technical issues?"
          ctaText="Raise A Ticket"
          ctaHref="#contact-section"
        />

        {/* Card 2: Request a call */}
        <SupportCard
          icon={<SupportIcon />}
          title="Request a call"
          description="Contact Sales to get pricing information & product recommendation."
          ctaText="Schedule Call"
          ctaHref="#contact-section"
        />

        {/* Card 3: General Inquiries */}
        <SupportCard
          icon={<ChatIcon />}
          title="General Inquiries"
          description={
            <>
              Have a question or want to send feedback? Email us at{' '}
              <a href="mailto:support@SmartTenantAIcloud.com" className="text-emerald-600 font-medium hover:underline">
                support@SmartTenantAIcloud.com
              </a>
            </>
          }
          ctaText="Send Email"
          ctaHref="mailto:support@SmartTenantAIcloud.com"
        />

        {/* Card 4: Sales Inquiries */}
        <SupportCard
          icon={<SupportIcon />}
          title="Sales Inquiries"
          description={
            <>
              Have a question to our sales team? Email us at{' '}
              <a href="mailto:sales@SmartTenantAIcloud.com" className="text-emerald-600 font-medium hover:underline">
                sales@SmartTenantAIcloud.com
              </a>
            </>
          }
          ctaText="Send Email"
          ctaHref="mailto:sales@SmartTenantAIcloud.com"
        />

      </div>
    </section>
  );
};

export default SupportSection;