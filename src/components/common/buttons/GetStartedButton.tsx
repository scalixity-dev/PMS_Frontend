import React from 'react';

interface GetStartedButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

const GetStartedButton: React.FC<GetStartedButtonProps> = ({ 
  text = 'Get Started', 
  onClick,
  className = '' 
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center w-40 h-14 gap-2 rounded-lg px-5 py-4 border border-white bg-[#3D7475] opacity-100 rotate-0 font-heading font-light text-lg leading-none whitespace-nowrap tracking-[0] text-white hover:opacity-90 shadow-md ${className}`}
    aria-label="Get started"
  >
    {text}
  </button>
);

export default GetStartedButton;

