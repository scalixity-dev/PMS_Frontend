import { Send } from "lucide-react";
import { Link } from "react-router-dom";

interface ChooseButtonProps {
  text?: string;
  onClick?: () => void;
  to?: string;
  className?: string;
}

const baseClasses = "w-full flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-full bg-[var(--color-card-1)] text-black text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200";
const iconClasses = "inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--color-primary)] text-white";

export default function ChooseButton({ text = "Choose", onClick, to, className = "" }: ChooseButtonProps) {
  const classes = `${baseClasses} ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        onClick={onClick}
      >
        {text}
        <span className={iconClasses}>
          <Send size={14} className="sm:hidden" />
          <Send size={16} className="hidden sm:inline" />
        </span>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={classes}
    >
      {text}
      <span className={iconClasses}>
        <Send size={14} className="sm:hidden" />
        <Send size={16} className="hidden sm:inline" />
      </span>
    </button>
  );
}
