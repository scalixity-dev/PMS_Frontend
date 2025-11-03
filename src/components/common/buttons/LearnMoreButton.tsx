import React from "react";

interface LearnMoreButtonProps {
  onClick?: () => void;
  bgClass?: string; // Tailwind background class, e.g. 'bg-[#3A4E33]'
  textClass?: string; // Tailwind text color class, e.g. 'text-white'
  text?: string;
  variant?: 'hero' | 'default'; // 'hero' for HeroCard style, 'default' for original style
  className?: string;
}

const LearnMoreButton: React.FC<LearnMoreButtonProps> = ({ 
  onClick, 
  bgClass, 
  textClass,
  text = 'Learn More',
  variant = 'default',
  className = ''
}) => {
  // HeroCard variant styling
  if (variant === 'hero') {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center justify-center w-36 h-14 gap-2 rounded-lg px-5 py-4 border-2 border-[#4B5563] bg-transparent hover:bg-[#1F2937] opacity-100 rotate-0 font-heading font-medium text-lg leading-none whitespace-nowrap tracking-[0] text-black hover:text-white ${className}`}
        aria-label="Learn more"
      >
        {text}
      </button>
    );
  }

  // Default variant styling (backward compatible)
  return (
    <button
      onClick={onClick}
      // prefer Tailwind classes; fall back to bg-[#3A4E33] and text-white
      className={`w-full border-0 py-3 rounded-md  ${bgClass ?? 'bg-[#3A4E33]'} ${textClass ?? 'text-white'} ${className}`}
      aria-label="Learn more"
    >
      {text}
    </button>
  );
};

export default LearnMoreButton;
