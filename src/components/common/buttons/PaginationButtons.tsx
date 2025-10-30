import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  containerClassName?: string; // allow parent to control placement
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  onPrev,
  onNext,
  containerClassName,
}) => (
  <div className={containerClassName ?? "flex justify-center gap-2 mt-8"}>
    <button
      onClick={onPrev}
      aria-label="Previous"
      className={
        "p-3 rounded-full flex items-center justify-center bg-[#EEF0EF] text-[var(--color-heading)] shadow-sm hover:opacity-90"
      }
    >
      <ArrowLeft size={20} />
    </button>
    <button
      onClick={onNext}
      aria-label="Next"
      className={
        "p-3 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white shadow-sm hover:opacity-90"
      }
    >
      <ArrowRight size={20} />
    </button>
  </div>
);

export default PaginationButtons;
