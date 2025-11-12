import React from "react";

interface RentalFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const RentalFeatureCard: React.FC<RentalFeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col justify-between border border-[#20CC95] rounded-2xl p-8 text-left bg-white shadow-sm hover:shadow-md transition">
      <div>
        <h3 className="text-2xl font-semibold text-[#0D1B2A] mb-5">
          {title}
        </h3>
        <p className="text-sm text-[#4B5563] leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-8 text-[#486E55] flex justify-start">
        {icon}
      </div>
    </div>
  );
};

export default RentalFeatureCard;
