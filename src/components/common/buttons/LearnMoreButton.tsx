import React from "react";
import { Link } from "react-router-dom";

interface LearnMoreButtonProps {
  onClick?: () => void;
  to?: string; // Route path for navigation
  bgClass?: string; // Tailwind background class, e.g. 'bg-[#3A4E33]'
  textClass?: string; // Tailwind text color class, e.g. 'text-white'
  text?: string;
  variant?: 'hero' | 'default'; // 'hero' for HeroCard style, 'default' for original style
  className?: string;
}

const LearnMoreButton: React.FC<LearnMoreButtonProps> = ({ 
  onClick, 
  to,
  bgClass, 
  textClass,
  text = 'Learn More',
  variant = 'default',
  className = ''
}) => {
  const baseClassName = variant === 'hero'
    ? `inline-flex items-center justify-center w-36 h-14 gap-2 rounded-lg px-5 py-4 border-2 border-[#4B5563] bg-transparent opacity-100 rotate-0 font-heading font-medium text-lg leading-none whitespace-nowrap tracking-[0] text-black transition-colors duration-200 hover:bg-[#1F2937] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1F2937]/40 ${className}`
    : `inline-flex items-center justify-center w-full border-0 py-3 rounded-md ${bgClass ?? 'bg-[#3A4E33]'} ${textClass ?? 'text-white'} transition-colors transition-transform transition-shadow duration-200 hover:brightness-90 hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/10 ${className}`;

  // If 'to' prop is provided, render as Link, otherwise as button
  if (to) {
    return (
      <Link
        to={to}
        className={baseClassName}
        aria-label="Learn more"
      >
        {text}
      </Link>
    );
  }

  // HeroCard variant styling
  if (variant === 'hero') {
    return (
      <button
        onClick={onClick}
        className={baseClassName}
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
      className={baseClassName}
      aria-label="Learn more"
    >
      {text}
    </button>
  );
};

export default LearnMoreButton;
