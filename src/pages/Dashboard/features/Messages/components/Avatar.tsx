import React, { memo } from 'react';

interface AvatarProps {
    name: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const AVATAR_COLORS = [
    '#3D7068', // Primary Green
    '#41C1A6', // Teal
    '#8AD241', // Lime
    '#3498DB', // Blue
    '#9B59B6', // Purple
    '#E67E22', // Orange
    '#E74C3C', // Red
    '#2C3E50', // Dark Blue
];

const Avatar: React.FC<AvatarProps> = ({ name, className = '', size = 'md' }) => {
    const getInitials = (name: string) => {
        if (!name) return '';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getColor = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % AVATAR_COLORS.length;
        return AVATAR_COLORS[index];
    };

    const sizeClasses = {
        sm: 'w-7 h-7 text-[10px]',
        md: 'w-9 h-9 text-xs',
        lg: 'w-11 h-11 text-sm',
    };

    return (
        <div
            className={`flex items-center justify-center rounded-full text-white font-bold uppercase ${sizeClasses[size]} ${className}`}
            style={{ backgroundColor: getColor(name) }}
        >
            {getInitials(name)}
        </div>
    );
};

export default memo(Avatar);
