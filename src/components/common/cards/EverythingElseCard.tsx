// components/EverythingElseCard.tsx
import React from "react";

interface EverythingElseCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function EverythingElseCard({
  number,
  title,
  description,
  icon,
}: EverythingElseCardProps) {
  // enlarge the icon if an element is provided
  const iconNode = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, { size: 28 } as any)
    : icon;

  return (
    <div className="flex flex-col border rounded-lg p-6 w-full max-w-[320px] shadow-sm hover:shadow-md transition-shadow duration-200 border-[var(--color-primary)]/20">
      <div className="flex justify-between items-start mb-3">
        <span className="text-3xl font-semibold text-[var(--color-primary)]">{number}</span>
        <div className="text-[var(--color-primary)]">{iconNode}</div>
      </div>
      <h3 className="text-[var(--color-heading)] font-semibold mb-1 text-sm">{title}</h3>
      <p className="text-[var(--color-subheading)] text-xs leading-snug">{description}</p>
    </div>
  );
}
