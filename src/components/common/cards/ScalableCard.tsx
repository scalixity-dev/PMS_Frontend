import type { ReactNode } from "react";
import ChooseButton from "../buttons/ChooseButton";

interface ScalableCardProps {
  image: string;
  title: string;
  description: ReactNode;
}

export default function ScalableCard({ image, title, description }: ScalableCardProps) {
  return (
    <div
      className="flex flex-col items-center bg-white rounded-2xl overflow-hidden transition-shadow duration-200 w-full p-4 border border-[#E5E5E5]"
      style={{ boxShadow: "1px 4px 8px 0px #00000040" }}
    >
      <div className="w-full h-52 overflow-hidden rounded-md mb-4">
        <img
          src={image}
          alt={title}
          width={300}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-[var(--color-heading)] font-semibold mb-1 text-center font-heading">{title}</h3>
      <p className="text-[var(--color-subheading)] text-sm text-center mb-4 font-body">{description}</p>
      <ChooseButton to="/features/screening" />
    </div>
  );
}
