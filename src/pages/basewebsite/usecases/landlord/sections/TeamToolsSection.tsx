import React from "react";
import TeamToolCard from "../../../../../components/common/cards/TeamToolCard";

const TeamToolsSection: React.FC = () => {
  const tools = [
    {
      icon: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762862447/Group_1000009068_dizl48.png",
      title: "Built-in workflow tracking",
      description:
        "Assign specific tasks to team members, create custom permissions, and track every actionable item, in real-time.",
    },
    {
      icon: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762862465/037-writing_hisdhh.png",
      title: "Documentation and reporting",
      description:
        "Generate comprehensive reports, maintain detailed property records, and create professional documentation for all your rental operations.",
    },
    {
      icon: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762862468/018-seo_zpycpk.png",
      title: "Marketing and visibility",
      description:
        "Boost your property listings with SEO optimization, reach more tenants through multiple channels, and maximize your rental property exposure.",
    },
  ];

  return (
    <section className="max-w-4xl px-2 mx-auto pt-16 flex flex-col items-center text-center bg-white">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-semibold text-[#0D1B2A] mb-20">
        Rental management tools for the whole team
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
        {tools.map((tool, idx) => (
          <TeamToolCard
            key={idx}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
          />
        ))}
      </div>
    </section>
  );
};

export default TeamToolsSection;
