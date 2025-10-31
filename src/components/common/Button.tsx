import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors';
const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:opacity-90',
  secondary: 'bg-[var(--color-secondary)] text-white hover:opacity-90',
  outline: 'border border-[var(--color-active)] text-[var(--color-heading)] hover:bg-[var(--color-header-bg)]',
  ghost: 'text-[var(--color-heading)] hover:bg-[var(--color-header-bg)]',
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className, children, ...props }) => {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className ?? ''}`.trim();
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
