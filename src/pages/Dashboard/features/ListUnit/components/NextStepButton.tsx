import React from 'react';

interface NextStepButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const NextStepButton: React.FC<NextStepButtonProps> = ({ onClick, children = 'Next Step', className = '', disabled = false }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`bg-[var(--color-primary)] text-white font-semibold py-3 px-6 rounded-lg w-full md:w-auto md:px-12 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default NextStepButton;
