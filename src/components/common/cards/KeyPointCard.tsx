import React from "react";

interface KeyPointCardProps {
  icon: React.ReactNode;
  text: string;
}

const KeyPointCard: React.FC<KeyPointCardProps> = ({ icon, text }) => {
  return (
    <div
      className="w-full rounded-md p-10 text-center transition-all duration-300 
      flex flex-col items-center gap-6 bg-[#E8E3E1]/70 hover:bg-white hover:shadow-lg"
    >
      <div className="text-[#21655A] text-4xl">{icon}</div>

      <p className="text-[#2F3A3A] font-bold text-base leading-relaxed max-w-[260px]">
        {text}
      </p>
    </div>
  );
};

export default KeyPointCard;
