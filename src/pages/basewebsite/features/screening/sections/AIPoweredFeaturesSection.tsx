// src/components/AIPoweredFeaturesSection.tsx
import React from "react";
import AIFeaturesSection from "../../../../../components/AIFeaturesSection";

const AIPoweredFeaturesSection: React.FC = () => {
  const features = [
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png", // replace with your actual image path
      title: "Attract more applicants with AI-powered listing tools.",
      description:
        "Reach top platforms automatically and gain 50% more visibility via AI-driven optimization to schedule tours, analyze leads, and fill vacancies faster.",
    },
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "Never miss a qualified lead",
      description:
        "With our built-in Leads Tracking Tool, you can view everyone who's contacted you, respond faster, and invite interested prospects to apply before they lose interest.",
    },
    {
      image: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762162431/one_wmo5aa.png",
      title: "AI-powered screening for smarter, faster leasing.",
      description:
        "Run AI-powered background and identity verifications directly from the application—no extra steps required.",
    },
  ];

  return <AIFeaturesSection features={features} />;
};

export default AIPoweredFeaturesSection;
