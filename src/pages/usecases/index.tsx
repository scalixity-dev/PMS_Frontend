import React from 'react';
import AIFeaturesSection from "../../components/AIFeaturesSection";
import HeroSection from './sections/hero';
import SplitHeroFeature from '../../components/SplitHeroFeature';
import KeepPropertySection from './sections/keepproperty';
import ManageFeeSection from './sections/managefee';
import AllInOneUseCaseSection from './sections/allinone';
import { DollarSign, TrendingUp, Handshake } from 'lucide-react';

const usecaseFeatures = [
  {
    icon: <DollarSign size={28} />,
    title: "Collect Rent On Time",
    description:
      "Still chasing after rent? Landlords who enable auto pay on PMS Cloud experience 90% fewer late payments.",
  },
  {
    icon: <TrendingUp size={28} />,
    title: "Grow Your Portfolio",
    description:
      "From one property to 500. With 21+ built-in features and 10+ integrations, PMS Cloud grows with you no matter how big your portfolio gets.",
  },
  {
    icon: <Handshake size={28} />,
    title: "Get Help When You Need It",
    description:
      "From setup to support, our dedicated team is here to make sure your rental business runs smoothly at every step.",
  },
];

const UseCasesPage: React.FC = () => {
  return (
    <section className="w-full">
      <HeroSection />
      <AIFeaturesSection
        features={usecaseFeatures}
        color="#B3F5C9"
        textColor="#07351E"
        buttonText="Read More"
      />
      <SplitHeroFeature
        title="Find the right PMS, faster"
        description="Save up to 20 hours a week with online applications, background checks, and credit reports, helping you choose pms  with confidence."
        imageSrc="/lease-invoice.png"
        backgroundClassName="bg-[#88AF95]"
        secondaryImageBackgroundClassName="bg-[#88AF95]"
      />
      <AllInOneUseCaseSection />
      <KeepPropertySection />
      <ManageFeeSection />
     
    </section>
  );
};

export default UseCasesPage;


