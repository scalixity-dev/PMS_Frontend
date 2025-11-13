import React from 'react';
import AIFeaturesSection from '../../../components/AIFeaturesSection';
import IconFeaturesRow from '../../../components/IconFeaturesRow';
import GreenFeaturesSliderSection from '../../../components/GreenFeaturesSliderSection';
import SplitHeroFeaturefull from '../../../components/SplitHeroFeaturefull';
import SplitHeroFeatureReverse from '../../../components/SplitHeroFeatureReverse';
import LeaseHeroSection from './sections/leasehero';
import RentalLeaseSection from './sections/rentallease';
import LeaseCardsSection from './sections/cards';
// import ListingWebsiteSection from './sections/listingwebsite';
import RentalPropertySection from './sections/rentalproperty';
import MaintenanceSection from './sections/Maintenance';
import InspectionsSection from './sections/inspections';
import EveryFeatureSection from './sections/leasefeaturesection';
import EveryFeatureCenteredSection from './sections/leasefeaturecenteredsection';

import { Grid, Home, Users, Monitor, FileText, Repeat, FileCheck, MessageSquare } from 'lucide-react';

const LeasePage: React.FC = () => {
  const features = [
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Attract more applicants, faster",
      description:
        "Cast a wider net with a custom website designed to delight potential PMs and keep them engaged.",
    },
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Save time listing and leasing",
      description:
        "Every application from your rental listing website goes straight to your PMS account, making it easier to track leads, screen PMs , and start onboarding.",
    },
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Let the right PMS find you",
      description:
        "Publish listings directly with our partner, Rentler, and receive recommended leads back—no extra work required.",
    },
  ];

  const maintenanceFeatures = [
    {
      image: "",
      title: "Full Visibility, Complete Control",
      description:
        "With a centralized dashboard, you can view progress, track maintenance costs, and resolve issues quickly—without missing a beat.",
    },
    {
      image: "",
      title: "Keep Up with PMS Requests, 24/7",
      description:
        "Built-in messaging, automatic status updates, and shared access mean everyone stays informed about maintenance needs, while you stay on top of your day.",
    },
    {
      image: "",
      title: "Work Orders, Simplified",
      description:
        "Track all your maintenance-related invoices, payments, and receipts in one place. Then, generate custom expense and tax reports in seconds.",
    },
  ];

  const inspectionFeatures = [
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Track Property Condition with Ease",
      description:
        "Ditch the clipboards and messy paperwork. Simply follow the digital inspection form in PmsCloud, share the results, and have them signed online.",
    },
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Turn Inspections into Repair Requests",
      description:
        "Save time by letting inspection reports do the work for you. If damage is noted, a maintenance request is automatically created and added to your to-do list.",
    },
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Faster, Smarter Move-Ins and Move-Outs",
      description:
        "Document property condition in minutes and compare move-in and move-out reports side by side. Digital records make it easy to spot changes.",
      },
    ];

  return (
    <section className="w-full">
      <LeaseHeroSection />
      {/* Split hero feature from screenshot */}
      <GreenFeaturesSliderSection
        data={[
          { icon: <FileText />, text: 'Build, send, and sign rental leases, all in one place' },
          { icon: <Repeat />, text: 'Customize templates once, reuse forever' },
          { icon: <FileCheck />, text: 'Access lawyer-approved state forms' },
        ]}
      />
      <RentalLeaseSection />
      <LeaseCardsSection />
      {/* <ListingWebsiteSection /> */}
      <EveryFeatureSection />
      <RentalPropertySection />
      <AIFeaturesSection features={features} color={"var(--color-card-1)"} />
      <MaintenanceSection />
      <EveryFeatureCenteredSection />
      <SplitHeroFeaturefull
        title="Coordinate Repairs from Anywhere"
        description={
          "Whether you're tackling the repair yourself or assigning it out, PmsCloud makes it easy. Communicate directly with vendors, landlords, and Pms, reducing response time (and stress)."
        }
        imageSrc={"https://res.cloudinary.com/dxwspucxw/image/upload/v1762263547/0fb6c58f-daa2-4303-80e3-58743edd561e.png"}
      />

      {/* Green features slider */}
      
     

      <AIFeaturesSection features={maintenanceFeatures} color='#B3F5C9' />
      <InspectionsSection />
        
      {/* Move-In Move-Out Tool ensures you never miss a detail */}
      <IconFeaturesRow 
        title="Move-In Move-Out Tool ensures you never miss a detail" 
        items={[
          { icon: <Grid />, text: "Faster than paper – complete and file an inspection in minutes" },
          { icon: <Home />, text: "Cut maintenance delays with built-in repair requests" },
          { icon: <Users />, text: "Increase transparency – upload photos, videos, and notes" },
          { icon: <Monitor />, text: "100% digital – request, fill out, sign, and store inspections online" },
        ]} 
      />
      

      <SplitHeroFeatureReverse
        title="Let inspections be the easy part"
        description={
          "A moving Pms has enough on their mind. With PMSCloud, you can document everything in minutes, store photos and notes, and keep things stress-free for everyone."
        }
        imageSrc={"https://res.cloudinary.com/dxwspucxw/image/upload/v1762321793/f394c061668ec3c89218b382b798b38545a06f7c_mix1wo.png"}
        icon={<MessageSquare />}
      />

      <AIFeaturesSection features={inspectionFeatures} />
      


    </section>
  );
};

export default LeasePage;