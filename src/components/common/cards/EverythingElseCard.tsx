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
    <div className="flex flex-col border rounded-lg p-8 w-full max-w-[320px] shadow-sm hover:shadow-md transition-all duration-200 border-[var(--color-primary)]/20 hover:bg-[#0CA474] group cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <span className="text-3xl font-semibold text-[var(--color-primary)] group-hover:text-white transition-colors duration-200">{number}</span>
        <div className="text-[var(--color-primary)] group-hover:text-white transition-colors duration-200">{iconNode}</div>
      </div>
      <h3 className="text-[var(--color-heading)] group-hover:text-white font-semibold mb-1 text-sm transition-colors duration-200">{title}</h3>
      <p className="text-[var(--color-subheading)] group-hover:text-white text-xs leading-snug transition-colors duration-200">{description}</p>
    </div>
  );
}
