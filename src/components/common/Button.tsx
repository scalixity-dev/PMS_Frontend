import React from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors';
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:opacity-90',
  outline: 'border border-[var(--color-active)] text-[var(--color-heading)] hover:bg-[var(--color-header-bg)]',
  ghost: 'text-[var(--color-heading)] hover:bg-[var(--color-header-bg)]',
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => {
  const classes = `${base} ${variants[variant]} ${className ?? ''}`.trim();
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
