import React from "react";
import { Link } from "react-router-dom";

export type PrimaryActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Optional label text; ignored when children are provided */
  text?: string;
  /** Optional route path; when provided renders as Link */
  to?: string;
  /** Extra Tailwind classes to append */
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center bg-[#3A6D65] hover:bg-[#2d5650] text-white font-medium px-8 py-2.5 rounded-lg text-sm transition-colors border-[0.92px] border-white shadow-[0px_3.68px_3.68px_0px_#00000040]";

const PrimaryActionButton: React.FC<PrimaryActionButtonProps> = ({
  text = "Set up",
  to,
  className = "",
  children,
  ...rest
}) => {
  const content = children ?? text;
  const classes = `${baseClasses} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={typeof content === "string" ? content : text}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} aria-label={typeof content === "string" ? content : text} {...rest}>
      {content}
    </button>
  );
};

export default PrimaryActionButton;


