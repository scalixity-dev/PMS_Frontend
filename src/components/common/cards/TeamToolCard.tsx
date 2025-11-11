import React from "react";
import { ArrowRight } from "lucide-react";

interface TeamToolCardProps {
  icon: React.ReactNode | string;
  title: string;
  description: string;
  link?: string;
}

const TeamToolCard: React.FC<TeamToolCardProps> = ({
  icon,
  title,
  description,
  link = "#",
}) => {
  return (
    <div className="relative bg-[#EBEBEB] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-left p-8 flex flex-col justify-between">
      {/* Floating Icon */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#20CC95] rounded-2xl p-3 w-16 h-16 flex items-center justify-center shadow-md">
          <div className="text-[#0B2E13] flex items-center justify-center">
            {typeof icon === "string" ? (
              <img
                src={icon}
                alt={`${title} icon`}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <div className="text-[#0B2E13]">{icon}</div>
            )}
          </div>
      </div>

      {/* Card Content */}
      <div className="mt-12">
        <h3 className="text-lg font-medium text-[#0D1B2A] mb-3">
          {title}
        </h3>
        <p className="text-xs text-[#4B5563] leading-relaxed mb-10">
          {description}
        </p>

        <a
          href={link}
          className="text-[#0D1B2A] font-medium text-sm hover:underline flex items-center gap-2"
        >
          Learn More
          <ArrowRight size={16} className="text-[#20CC95]" />
        </a>
      </div>
    </div>
  );
};

export default TeamToolCard;
