import React, { forwardRef } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border border-[var(--color-active)] bg-white px-3 py-2 text-[var(--color-heading)] outline-none placeholder:text-gray-400 ${className ?? ''}`.trim()}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
