import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    bgColor?: string;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
    className,
    bgColor,
    children,
    style,
    ...props
}) => {
    return (
        <button
            className={cn(
                "px-6 py-2 rounded-2xl border-2 border-white shadow-lg text-white font-medium transition-all hover:opacity-90 active:scale-95 flex items-center justify-center",
                className
            )}
            style={{
                backgroundColor: bgColor,
                ...style
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default DashboardButton;
