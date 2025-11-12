import React from 'react';
import AIFeaturesSection from "../../../components/AIFeaturesSection";
import ExplorePropertiesBanner from '../../../components/ExplorePropertiesBanner';
import TeamToolsSection from './sections/TeamToolsSection'; 
import ContentShowcaseSection from './sections/ContentShowcaseSection';
import DualImageFeatureSection from './sections/DualImageFeatureSection';
import HeroSection from './sections/landlordhero';
import SplitHeroFeature from '../../../components/SplitHeroFeature';
import KeepPropertySection from './sections/keepproperty';
import ManageFeeSection from './sections/managefee';
import AllInOneUseCaseSection from './sections/allinone';
import { DollarSign, TrendingUp, Handshake, Award, ArrowLeft, CheckCircle2, Users, Edit, Monitor, Eye, AlignHorizontalJustifyCenter, SlidersHorizontal, FileCheck, FilePlus, FileText } from 'lucide-react';

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

      <h2 className='max-w-4xl mx-auto text-4xl font-medium text-[#1F2937]'>Every feature your rental business needs, and more.</h2>
      <AIFeaturesSection
        features={usecaseFeatures}
        color="#B3F5C9"
        textColor="#07351E"
        buttonText="Read More"
      />
        <ContentShowcaseSection
          reverse={false}
          tag="Get paid easily and effortlessly"
          heading="Secure instant payments"
          description="Make rent collection an easy job with automatic billing, online pay, and instant invoices. Set up is easy—according to 84% of our users—and only takes a few minutes."
          buttonText="Get Started"
          buttonLink="#"
          imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762587822/9a212322aec3cb78c17930176bcb8e7673408294_dhlqwr.png"
          pillButtons={[{ label: "Auto Pay" }, { label: "Rent Collection" }]}
          features={[
            {
              icon: <Award size={32} />,
              title: "Online Rent Collection",
              description:
                "Receive debit, credit, and ACH payments directly to your bank account, safely and securely.",
            },
            {
              icon: <ArrowLeft size={32} />,
              title: "Auto Pay",
              description:
                "Reduce late payments by 90% with auto pay, ensuring every rent payment is made right on time.",
            },
            {
              icon: <CheckCircle2 size={32} />,
              title: "Customizable Reports",
              description:
                "Build financial and rental reports in seconds and track your portfolio growth over time.",
            },
          ]}
        />

        <ContentShowcaseSection
        reverse={true}
        tag="Find the right PMS, faster"
        heading="Save hours of research"
        description="Save up to 20 hours a week with online applications, background checks, and credit reports, helping you choose PMS with confidence."
        buttonText="Get Started"
        buttonLink="#"
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762589128/Screenshot_2025-11-08_133508_alspra.png"
        features={[
          {
            icon: <Users size={32} />,
            title: "Improve Occupancy",
            description:
              "Fill vacancies up to 15% sooner with custom applications, allowing you to pre-screen and find applicants faster.",
          },
          {
            icon: <Edit size={32} />,
            title: "Assign Fees",
            description:
              "Set up application fees automatically so the screening costs are always covered, no sweat.",
          },
          {
            icon: <Monitor size={32} />,
            title: "Screen PMS",
            description:
              "Make informed decisions with a 99.9% accurate background check, ran right from their application.",
          },
        ]}
      />
      <SplitHeroFeature
        title="Find the right PMS, faster"
        description="Save up to 20 hours a week with online applications, background checks, and credit reports, helping you choose pms  with confidence."
        imageSrc="/lease-invoice.png"
        backgroundClassName="bg-[#88AF95]"
        secondaryImageBackgroundClassName="bg-[#88AF95]"
        features={[
          {
            icon: <Users size={28} />,
            title: "Improve Occupancy",
            description:
              "Fill vacancies up to 15% sooner with custom applications, allowing you to pre-screen and find applicants faster.",
          },
          {
            icon: <CheckCircle2 size={28} />,
            title: "Assign Fees",
            description:
              "Set up application fees automatically so the screening costs are always covered, no sweat. ",
          },
        ]}
      />
      <ContentShowcaseSection
        reverse={false}
        tag="Handle every lease"
        heading="legal form, confidently"
        description="We've got you covered—everything from move-in day paperwork to legal forms and tenant notices, at your fingertips."
        buttonText="Get Started"
        buttonLink="#"
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762587822/9a212322aec3cb78c17930176bcb8e7673408294_dhlqwr.png"
        featuresInSingleRow={true}
        features={[
          {
            icon: <FileCheck size={32} />,
            title: "Online Rent Collection",
            description:
              "Receive debit, credit, and ACH payments directly to your bank account, safely and securely.",
          },
          {
            icon: <FilePlus size={32} />,
            title: "Legal-approved Forms",
            description:
              "Access a library of legally compliant forms and documents for all your rental needs.",
          },
          {
            icon: <FileText size={32} />,
            title: "Notices to PMS",
            description:
              "Send and track important notices and communications with tenants directly through the platform.",
          },
        ]}
      />
      <ContentShowcaseSection
        reverse={true}
        heading="Track all your maintenance needs, online"
        description="Create your own request or receive one from a Pms. Conveniently attach pictures, videos, descriptions, and other files."
        buttonText="Get Started"
        buttonLink="#"
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762589453/Screenshot_2025-11-08_134030_sny2dm.png"
        features={[
          {
            icon: <Eye size={32} />,
            title: "Easy Tracking",
            description:
              "Track the entire process, from labor time and supplies to final expenses and repairs.",
          },
          {
            icon: <AlignHorizontalJustifyCenter size={32} />,
            title: "Connect with Pros",
            description:
              "Find service professionals in your area and assign it to them through our platform.",
          },
          {
            icon: <SlidersHorizontal size={32} />,
            title: "Regular Maintenance",
            description:
              "Keep track of equipment at each rental and schedule service reminders to never miss a warranty check or repair.",
          },
        ]}
      />
      <DualImageFeatureSection />
      
      <AllInOneUseCaseSection />
      <TeamToolsSection/>
      <KeepPropertySection />
      
      <ManageFeeSection />
      <ExplorePropertiesBanner />
    </section>
  );
};

export default UseCasesPage;


