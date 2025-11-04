import React from "react";
import { Link } from "react-router-dom";

interface ViewAllButtonProps {
  onClick?: () => void;
  to?: string;
  className?: string;
}

const baseClasses = "inline-flex items-center justify-center text-base px-8 py-3 border-0 rounded-md bg-[#3D7475] text-white shadow-[0px_4px_0px_0px_#00000040]";

const ViewAllButton: React.FC<ViewAllButtonProps> = ({ onClick, to, className = "" }) => {
  const classes = `${baseClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} aria-label="View all">
        View All
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} aria-label="View all">
      View All
    </button>
  );
};

export default ViewAllButton;
