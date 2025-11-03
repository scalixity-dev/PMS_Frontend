import React from 'react'

export type GetStartedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Button label */
  text?: string
  /** size variant */
  size?: 'sm' | 'md' | 'lg'
  /** override width class, defaults to w-40 */
  widthClass?: string
}

const sizeClasses: Record<NonNullable<GetStartedButtonProps['size']>, string> = {
  sm: 'h-10 px-4 py-2 text-sm',
  md: 'h-14 px-5 py-4 text-lg',
  lg: 'h-16 px-6 py-5 text-xl'
}

const GetStartedButton = React.forwardRef<HTMLButtonElement, GetStartedButtonProps>(
  ({ text = 'Get Started', size = 'md', widthClass = 'w-40', className = '', ...rest }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 rounded-lg border border-white bg-[#3D7475] opacity-100 rotate-0 font-heading font-light leading-none whitespace-nowrap tracking-[0] text-white shadow-md'
    const hover = rest.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
    const classes = [base, sizeClasses[size], widthClass, hover, className].filter(Boolean).join(' ')

    return (
      <button ref={ref} className={classes} aria-label={text} {...rest}>
        {text}
      </button>
    )
  }
)

GetStartedButton.displayName = 'GetStartedButton'

export default GetStartedButton

