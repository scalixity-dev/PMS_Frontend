import React from 'react';
import { cn } from '@/lib/utils';
import type { IconType } from 'react-icons';

interface DashboardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    bgColor?: string;
    textColor?: string;
    width?: string;
    icon?: IconType;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
    className,
    bgColor = '#8BDC5E', // Default typical green if not specified
    textColor = 'text-white', // Default text color class
    width,
    children,
    style,
    icon: Icon,
    ...props
}) => {
    return (
        <button
            className={cn(
                "px-4 py-2 rounded-[0.75rem] font-medium transition-all shadow-md shadow-black/20 flex items-center gap-2 justify-center border border-white hover:opacity-90 active:scale-95",
                textColor,
                className
            )}
            style={{
                backgroundColor: bgColor,
                width: width,
                ...style // Allow overriding style
            }}
            {...props}
        >
            {Icon && <Icon size={16} />}
            {children}
        </button>
    );
};

export default DashboardButton;
