import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`w-full rounded-lg border border-[var(--color-active)] bg-white px-3 py-2 text-[var(--color-heading)] outline-none placeholder:text-[var(--color-subheading)] ${className ?? ''}`.trim()}
      {...props}
    />
  );
};

export default Input;
