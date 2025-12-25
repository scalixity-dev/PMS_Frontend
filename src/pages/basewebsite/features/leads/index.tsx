import React from 'react';
import KeepApplicationTrack from './sections/KeepApplicationTrack';
import SplitHeroFeatureReverse from '../../../../components/SplitHeroFeatureReverse';
import LeadFeaturesGrid from './sections/LeadFeaturesGrid';
import IconFeaturesRow from '../../../../components/IconFeaturesRow';
import ExplorePropertiesBanner from '../../../../components/ExplorePropertiesBanner';
import { MousePointerClick, Home, ShieldCheck, Star, MailCheck } from 'lucide-react';
import LeadsHeroSection from './sections/leadshero';
import CatchLeadsSection from './sections/catchleads';
// import PremiumLeadsSection from './sections/premiumleads';
import ConvertLeadsSection from './sections/convertleads';
import GoogleCalendarSection from './sections/googlecalendar';
import SplitHeroFeature from '../../../../components/SplitHeroFeature';
import ListYourRentalSection from './sections/listyourrental';
import LeasingSection from './sections/leasingsection';
import QualityLeadsSection from './sections/qualityleads';


const LeadsPage: React.FC = () => {
  return (
    <section className="w-full ">
      <LeadsHeroSection />
      <LeadFeaturesGrid />
      <CatchLeadsSection />
      <KeepApplicationTrack />
      <SplitHeroFeatureReverse
        title="Get leads from your website"
        description="A moving tenant has enough on their mind. With SmartTenantAI, you can document everything in minutes, store photos and notes, and keep things stress-free for everyone."
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762494948/dee565d69987479109ffe7012bccf951b7f2a1d5_dtl9ch.png"
      />
      {/* <PremiumLeadsSection /> */}
      <ConvertLeadsSection />
      <GoogleCalendarSection />
      <SplitHeroFeature
        badgeText="Automatic Listing Syndication"

        title="Advertise Your Rental Property Faster"
        description={
          "List a rental and showcase it on multiple sites at once, gaining more exposure in less time. Landlords who list on SmartTenantAI receive nearly 4 applications per listing."
        }
        imageSrc={"/advertise-rental.png"}
        icon={<MailCheck className="w-10 h-10 text-white" />}
      />

      <IconFeaturesRow
        title="Every feature you'll ever need, and more"
        items={[
          {
            icon: <MousePointerClick size={24} />,
            text: "List once, syndicate to multiple rental sites for free"
          },
          {
            icon: <Home size={24} />,
            text: "Advanced listings for even faster exposure"
          },
          {
            icon: <ShieldCheck size={24} />,
            text: "Receive rental applications right on SmartTenantAI"
          },
          {
            icon: <Star size={24} />,
            text: "Advertise on Rent.com, Redfin, Apartment Guide, and more"
          }
        ]}
      />
      <ListYourRentalSection />
      <LeasingSection />
      <QualityLeadsSection />
      <ExplorePropertiesBanner />

    </section>
  );
};

export default LeadsPage;


