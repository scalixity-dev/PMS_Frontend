import React from "react";

interface KeyPointCardProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const KeyPointCard: React.FC<KeyPointCardProps> = ({
  icon,
  text,
  active = false,
}) => {
  return (
    <div
      className={`w-full rounded-md p-10 text-center transition-all duration-300 
      flex flex-col items-center gap-6
      ${active 
        ? "bg-white shadow-lg" 
        : "bg-[#E8E3E1]/70 hover:shadow"
      }`}
    >
      <div className="text-[#21655A] text-4xl">{icon}</div>

      <p className="text-[#2F3A3A] font-bold text-base leading-relaxed max-w-[260px]">
        {text}
      </p>
    </div>
  );
};

export default KeyPointCard;
