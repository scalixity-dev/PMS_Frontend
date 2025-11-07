import React from 'react';
import KeepApplicationTrack from './sections/KeepApplicationTrack';
import SplitHeroFeatureReverse from '../../../components/SplitHeroFeatureReverse';
import LeadFeaturesGrid from './sections/LeadFeaturesGrid';
import IconFeaturesRow from '../../../components/IconFeaturesRow';
import ExplorePropertiesBanner from '../../../components/ExplorePropertiesBanner';
import { MousePointerClick, Home, ShieldCheck, Star } from 'lucide-react';

const LeadsPage: React.FC = () => {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-0 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Leads</h1>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Under Working...
        </p>
      </div>

      <LeadFeaturesGrid/>
      <KeepApplicationTrack />

      <SplitHeroFeatureReverse
        title="Get leads from your website"
        description="A moving PMS  has enough on their mind. With PMSCloud, you can document everything in minutes, store photos and notes, and keep things stress-free for everyone."
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762494948/dee565d69987479109ffe7012bccf951b7f2a1d5_dtl9ch.png"
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
            text: "Receive rental applications right on PMSCloud"
          },
          {
            icon: <Star size={24} />,
            text: "Advertise on Rent.com, Redfin, Apartment Guide, and more"
          }
        ]}
      />

      <ExplorePropertiesBanner/>
      
    </section>
  );
};

export default LeadsPage;


