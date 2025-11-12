import React from "react";
import TeamToolCard from "../../../../components/common/cards/TeamToolCard";

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
      title: "Built-in workflow tracking",
      description:
        "Assign specific tasks to team members, create custom permissions, and track every actionable item, in real-time.",
    },
    {
      icon: "https://res.cloudinary.com/dxwspucxw/image/upload/v1762862468/018-seo_zpycpk.png",
      title: "Built-in workflow tracking",
      description:
        "Assign specific tasks to team members, create custom permissions, and track every actionable item, in real-time.",
    },
  ];

  return (
    <section className="max-w-4xl mx-auto py-16 flex flex-col items-center text-center bg-white">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-semibold text-[#0D1B2A] mb-20">
        Rental management tools for the whole team
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
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
