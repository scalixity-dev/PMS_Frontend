import React from 'react';
import IconFeaturesRow from '../../../../components/IconFeaturesRow';
import FeatureHighlightSection from '../../../../components/FeatureHighlightSection';
import AIFeaturesSection from '../../../../components/AIFeaturesSection';
import SplitHeroFeaturefull from '../../../../components/SplitHeroFeaturefull';
import ExplorePropertiesBanner from '../../../../components/ExplorePropertiesBanner';
import { Users, ListChecks, ShieldCheck, Clock } from 'lucide-react';
import TeamManagementSection from './sections/teamhero';
import KyeSection from './sections/kye';
import Card from './sections/card';

const TeamPage: React.FC = () => {
  const teamFeatures = [
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Customize your permissions",
      description:
        "Built-in collaboration tools make it easy to assign team members to specific properties, ensuring each workflow is efficient and secure.",
    },
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Assign tasks with confidence",
      description:
        "With seamless task tracking, you can assign tasks to specific team members, set deadlines, and track progress in real-time. Auto-reminders and notifications keep your team accountable.",
    },
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Collaborate in your own hub",
      description:
        "No need for scattered texts and email chains. SmartTenantAI's instant messaging keeps conversation history in one place so it's easy to stay organized and respond quickly.",
    },
  ];
  return (
    <section className="w-full">

      <TeamManagementSection />
      <IconFeaturesRow
        title="Every feature you'll ever need, and more"
        items={[
          {
            icon: <Users size={24} />,
            text: "Enhance team collaboration by assigning members and roles"
          },
          {
            icon: <ListChecks size={24} />,
            text: "Total task management with reminders and a shared calendar"
          },
          {
            icon: <ShieldCheck size={24} />,
            text: "Maintain control with customizable permissions"
          },
          {
            icon: <Clock size={24} />,
            text: "Free up time—over 85% of users spend 4 hours or less per week on team management"
          }
        ]}
      />

      <FeatureHighlightSection
        subtitle=""
        title="Collaborate with clarity — from assignments to automation"
        description="Assign roles, set permissions, and keep work on track with shared calendars, reminders, and automated workflows."
        buttonText="Get started"
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762511048/Dashboard_Overview_1_niuilu.png"
        transparent
      />

      <AIFeaturesSection
        features={teamFeatures}
        color="#9AD4AD"
      />

      <KyeSection />
      <IconFeaturesRow
        title="Every feature you'll ever need, and more"
        items={[
          {
            icon: <Users size={24} />,
            text: "Enhance team collaboration by assigning members and roles"
          },
          {
            icon: <ListChecks size={24} />,
            text: "Total task management with reminders and a shared calendar"
          },
          {
            icon: <ShieldCheck size={24} />,
            text: "Maintain control with customizable permissions"
          },
          {
            icon: <Clock size={24} />,
            text: "Free up time—over 85% of users spend 4 hours or less per week on team management"
          }
        ]}
      />


      <SplitHeroFeaturefull
        title="Make Property Descriptions Effortless"
        description={
          "Writing standout property descriptions is now easier than ever with  kye ai. Forget starting from scratch—just provide your listing details, and  kye ai will do the heavy lifting to create a unique description tailored to your property."
        }
        imageSrc={"https://res.cloudinary.com/dxwspucxw/image/upload/v1762263547/0fb6c58f-daa2-4303-80e3-58743edd561e.png"}
      />
      <Card />
      <ExplorePropertiesBanner />

    </section>
  );
};

export default TeamPage;


