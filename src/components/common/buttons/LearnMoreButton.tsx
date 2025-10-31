import React from "react";

interface LearnMoreButtonProps {
  onClick?: () => void;
  bgClass?: string; // Tailwind background class, e.g. 'bg-[#3A4E33]'
  textClass?: string; // Tailwind text color class, e.g. 'text-white'
}

const LearnMoreButton: React.FC<LearnMoreButtonProps> = ({ onClick, bgClass, textClass }) => (
  <button
    onClick={onClick}
    // prefer Tailwind classes; fall back to bg-[#3A4E33] and text-white
    className={`w-full border-0 py-3 rounded-md  ${bgClass ?? 'bg-[#3A4E33]'} ${textClass ?? 'text-white'}`}
    style={{ border: 'none' }}
    aria-label="Learn more"
  >
    Learn More
  </button>
);

export default LearnMoreButton;
