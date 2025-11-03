// components/LearnMoreGradient.tsx
import React from "react";

interface LearnMoreGradientProps {
  onClick?: () => void;
}

const LearnMoreGradient: React.FC<LearnMoreGradientProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-[250px] h-[40px] text-white font-medium rounded-md 
                 bg-gradient-to-r from-[#3B5534] to-[#85AF77] 
                 hover:opacity-90 transition-opacity shadow-sm"
    >
      Learn More
    </button>
  );
};

export default LearnMoreGradient;
