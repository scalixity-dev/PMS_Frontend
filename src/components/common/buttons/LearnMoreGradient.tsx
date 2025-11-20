// components/LearnMoreGradient.tsx
import React from "react";
import { Link } from "react-router-dom";

interface LearnMoreGradientProps {
  onClick?: () => void;
  text?: string;
  to?: string;
}

const LearnMoreGradient: React.FC<LearnMoreGradientProps> = ({ onClick, text, to = "/signup" }) => {
  const buttonClass = "w-[250px] h-[40px] text-white font-medium rounded-md bg-gradient-to-r from-[#3B5534] to-[#85AF77] hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center";
  
  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={buttonClass}
      >
        {text ?? 'Learn More'}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={buttonClass}
    >
      {text ?? 'Learn More'}
    </button>
  );
};

export default LearnMoreGradient;
