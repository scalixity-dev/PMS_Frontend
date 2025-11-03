import React from 'react'

export type GetStartedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Custom width class (default: w-40) */
  widthClass?: string
}

const sizeClasses = {
  sm: 'h-10 px-4 py-2 text-sm',
  md: 'h-14 px-5 py-4 text-lg',
  lg: 'h-16 px-6 py-5 text-xl'
}

/**
 * GetStartedButton
 * 
 * Reusable button component with teal/green background matching the hero section design.
 * - Accepts all standard button props (onClick, disabled, type, aria-*, etc.)
 * - ForwardRef-friendly for advanced use cases
 */
const GetStartedButton = React.forwardRef<HTMLButtonElement, GetStartedButtonProps>(
  ({ size = 'md', widthClass = 'w-40', className = '', children = 'Get Started', ...rest }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg border border-white bg-[#3D7475] font-heading font-light leading-none whitespace-nowrap tracking-[0] text-white shadow-md transition-opacity duration-150'
    const hoverClasses = rest.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
    
    const classes = [baseClasses, sizeClasses[size], widthClass, hoverClasses, className]
      .filter(Boolean)
      .join(' ')

    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    )
  }
)

GetStartedButton.displayName = 'GetStartedButton'

export default GetStartedButton
