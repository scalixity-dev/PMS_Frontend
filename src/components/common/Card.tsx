import React from 'react';

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, className, children }) => {
  return (
    <div className={`rounded-xl border border-[var(--color-active)] bg-white p-6 shadow-md ${className ?? ''}`.trim()}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-[var(--color-heading)]">{title}</h3>}
          {subtitle && <p className="text-sm text-[var(--color-subheading)]">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
