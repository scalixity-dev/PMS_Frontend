import React from 'react';

interface NextStepButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

const NextStepButton: React.FC<NextStepButtonProps> = ({ onClick, children = 'Next Step', className = '' }) => {
  return (
    <button 
      onClick={onClick} 
      className={`bg-[var(--color-primary)] text-white font-semibold py-3 px-6 rounded-lg w-full md:w-auto md:px-12 hover:opacity-90 transition-opacity ${className}`}
    >
      {children}
    </button>
  );
};

export default NextStepButton;
