import React from "react";
import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";

type BaseProps = {
  /** Optional label text; ignored when children are provided */
  text?: string;
  /** Extra Tailwind classes to append */
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps = BaseProps & 
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: never;
  };

type LinkButtonProps = BaseProps &
  Omit<LinkProps, 'className' | 'children'> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'> & {
    to: string;
  };

export type PrimaryActionButtonProps = ButtonProps | LinkButtonProps;

const baseClasses =
  "inline-flex items-center justify-center bg-[#3A6D65] hover:bg-[#2d5650] text-white font-medium px-8 py-2.5 rounded-lg text-sm transition-colors border-[0.92px] border-white shadow-[0px_3.68px_3.68px_0px_#00000040]";

// Helper to filter out button-specific props that aren't valid for Link
const filterButtonOnlyProps = (props: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, disabled, form, formAction, formEncType, formMethod, formNoValidate, formTarget, ...rest } = props;
  return rest;
};

function PrimaryActionButton(props: ButtonProps): React.ReactElement;
function PrimaryActionButton(props: LinkButtonProps): React.ReactElement;
function PrimaryActionButton(props: PrimaryActionButtonProps): React.ReactElement {
  const {
    text = "Set up",
    to,
    className = "",
    children,
    ...rest
  } = props;
  
  const content = children ?? text;
  const classes = `${baseClasses} ${className}`.trim();
  
  // Extract aria-label/ariaLabel from rest to handle it explicitly
  const restWithAriaLabel = rest as Record<string, unknown>;
  const userAriaLabel = restWithAriaLabel['aria-label'] || restWithAriaLabel['ariaLabel'];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { 'aria-label': _, ariaLabel: __, ...restWithoutAriaLabel } = restWithAriaLabel;
  const finalAriaLabel = userAriaLabel || (typeof content === "string" ? content : text);

  if (to) {
    // When to is provided, filter out button-specific props
    const linkProps = filterButtonOnlyProps(restWithoutAriaLabel);
    
    return (
      <Link 
        to={to} 
        className={classes} 
        aria-label={finalAriaLabel as string}
        {...(linkProps as Omit<LinkButtonProps, 'to' | 'text' | 'className' | 'children'>)}
      >
        {content}
      </Link>
    );
  }

  // When to is not provided, use all props for button
  return (
    <button 
      className={classes} 
      aria-label={finalAriaLabel as string} 
      {...(restWithoutAriaLabel as ButtonProps)}
    >
      {content}
    </button>
  );
}

export default PrimaryActionButton;


