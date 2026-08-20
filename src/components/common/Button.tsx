import React from 'react';
import { buttonClasses } from './buttonClasses';
import type { ButtonSize, ButtonVariant } from './buttonClasses';

export type { ButtonSize, ButtonVariant };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => (
  <button className={buttonClasses(variant, size, className)} {...props}>
    {children}
  </button>
);

export default Button;
