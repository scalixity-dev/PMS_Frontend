import React from "react";

interface SkillFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

const SkillFeatureCard: React.FC<SkillFeatureCardProps> = ({
  icon,
  title,
  description,
  link = "#",
}) => {
  return (
    <div
      className="group bg-[#DDF6F5] hover:bg-[#46AA8A] transition-all duration-300 
                 rounded-2xl shadow-sm hover:shadow-md text-left p-8 
                 flex flex-col h-full cursor-pointer"
    >
      {/* Icon, Title, and Description - Top aligned */}
      <div className="flex-grow">
        {/* Icon */}
        <div className="bg-white/90 rounded-md w-13 h-13 flex items-center justify-center mb-6 shadow-sm group-hover:bg-white/80 transition">
          <div className="text-[#3D7475] group-hover:text-[#0D1B2A] transition">
            {icon}
          </div>
        </div>

        <h3
          className="text-2xl font-semibold mb-3 text-[#0D1B2A] 
                     group-hover:text-white transition"
        >
          {title}
        </h3>
        <p
          className="text-sm text-[#4B5563] leading-relaxed 
                     group-hover:text-white/90 transition"
        >
          {description}
        </p>
      </div>

      {/* Read More Button - Bottom aligned */}
      <div className="mt-6">
        <a
          href={link}
          className="text-[#0D1B2A] group-hover:text-white font-medium text-lg flex items-center gap-2 transition"
        >
          Read More <span className="text-lg leading-none">→</span>
        </a>
      </div>
    </div>
  );
};

export default SkillFeatureCard;
