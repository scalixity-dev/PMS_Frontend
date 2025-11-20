import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ViewMoreButtonProps {
  onClick?: () => void;
  to?: string;
  className?: string;
}

const baseClasses = "w-fit mt-4 inline-flex items-center gap-2 rounded-md bg-[#3D7475] px-4 py-2 text-white border border-white/20 shadow-sm hover:opacity-95 transition";

const ViewMoreButton: React.FC<ViewMoreButtonProps> = ({ onClick, to, className = "" }) => {
  const classes = `${baseClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} aria-label="View more" style={{ border: 'none' }}>
        <span className="text-sm font-medium">View More</span>
        <ArrowRight size={16} />
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={classes}
      style={{ border: 'none' }}
    >
      <span className="text-sm font-medium">View More</span>
      <ArrowRight size={16} />
    </button>
  );
};

export default ViewMoreButton;
