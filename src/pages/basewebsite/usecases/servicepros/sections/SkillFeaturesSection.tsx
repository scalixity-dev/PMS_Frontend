import React from "react";
import SkillFeatureCard from "../../../../../components/common/cards/SkillFeatureCard";

const SkillFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <img src="https://res.cloudinary.com/dxwspucxw/image/upload/v1762944352/044-returning_visitor_k8zxes.png" alt="Visitor" className="w-10 h-10 object-contain" />,
      title: "Showcase services on a custom website",
      description:
        "Build your own business website in minutes to feature your services, highlight your specialties, and make it easier for potential clients to find you.",
    },
    {
      icon: <img src="https://res.cloudinary.com/dxwspucxw/image/upload/v1762944368/042-viral_marketing_s6lwys.png" alt="Marketing icon" className="w-10 h-10 object-contain" />,
      title: "Get paid quickly and securely",
      description:
        "Accept online payments directly through PMScloud via debit, credit, or ACH—no matter how many jobs.",
    },
    {
      icon: <img src="https://res.cloudinary.com/dxwspucxw/image/upload/v1762862465/037-writing_hisdhh.png" alt="Monitor icon" className="w-10 h-10 object-contain" />,
      title: "Schedule jobs, digitally",
      description:
        "Which projects are coming up? Always know what’s ahead with a built-in calendar—plus sync your Google Calendar so you never miss an appointment.",
    },
  ];

  return (
    <section className="w-full max-w-8xl mx-auto py-16 flex flex-col items-center text-center bg-white px-6 md:px-12">
      <h2 className="text-3xl md:text-5xl font-semibold text-[#0D1B2A] mb-14">
        Turn your skills into steady work with PMS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {features.map((feature, idx) => (
          <SkillFeatureCard
            key={idx}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default SkillFeaturesSection;
