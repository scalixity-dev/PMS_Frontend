import React from "react";
import LearnMoreButton from "../buttons/LearnMoreButton";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  subtitle,
  description,
  points,
  color,
}) => {
  // Map CSS variable names to button background classes
  const colorToButtonClass: Record<string, string> = {
    "--color-card-1": "bg-[#3A4E33]",
    "--color-card-2": "bg-[#005355]",
    "--color-card-3": "bg-[#3A4E33]", // Add mapping for card-3
  };
  
  const buttonClass = colorToButtonClass[color] ?? "bg-[#3A4E33]";

  return (
    <div
      className="rounded-3xl p-6 flex flex-col justify-between shadow-md"
      style={{ backgroundColor: `var(${color})` }}
    >
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="bg-white rounded-2xl p-3 border border-gray-200 flex items-center justify-center w-16 h-16"
            style={{
              // slightly reduced left-side shadow: milder opacity and blur for a softer look
              boxShadow: '-8px 8px 0 rgba(0,0,0,0.16), -6px 14px 32px rgba(0,0,0,0.22)'
            }}
          >
            {icon}
          </div>
          <h3 className="text-[var(--color-heading)] font-semibold text-lg">
            {title}
          </h3>
        </div>

        <h4 className="text-[var(--color-heading)] font-medium mb-2">
          {subtitle}
        </h4>
        <p className="text-[var(--color-heading)] font-normal text-sm mb-4">
          {description}{" "}
          <span className="text-[var(--color-primary)] font-medium cursor-pointer">
            Read More
          </span>
        </p>

        <ul className="space-y-5 mb-6">
          {points.map((point, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 border border-white rounded-full py-2 px-3 text-sm text-[var(--color-heading)]"
            >
              <span className="w-2 h-2 bg-white rounded-full"></span>
              {point}
            </li>
          ))}
        </ul>
      </div>

  <LearnMoreButton bgClass={buttonClass} textClass="text-white" to="/features" />
    </div>
  );
};

export default FeatureCard;
