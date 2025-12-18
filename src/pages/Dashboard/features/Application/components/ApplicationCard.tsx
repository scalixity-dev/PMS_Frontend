import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApplicationCardProps {
    id: string | number;
    image: string;
    name: string;
    appliedDate: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    onView?: () => void;
}

// Helper to generate a consistent color from a string
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const ApplicationCard: React.FC<ApplicationCardProps> = ({
    id,
    image,
    name,
    appliedDate,
    status,
    onView
}) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const menuItems = [
        { label: 'Edit', action: () => { } },
        { label: 'Delete', action: () => { }, isDestructive: true },
    ];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-[#7BD747] text-white';
            case 'rejected':
                return 'bg-red-500 text-white';
            default:
                return 'bg-yellow-500 text-white';
        }
    };

    return (
        <div className="bg-[#F6F6F8] rounded-[2rem] p-3 flex gap-4 relative items-center shadow-sm h-full">
            {/* Context Menu */}
            <div className="absolute top-3 right-3 z-10" ref={menuRef}>
                <div
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-white/30 backdrop-blur-md border border-white/40 shadow-sm w-10 h-6 rounded-full hover:bg-white/40 transition-all cursor-pointer flex items-center justify-center"
                >
                    <MoreHorizontal className="w-6 h-6 text-gray-700" />
                </div>

                {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-20">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.action();
                                    setIsMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-b border-gray-50 last:border-none
                                    ${item.isDestructive
                                        ? 'text-red-600 hover:bg-red-50'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Image Section */}
            <div className="relative w-32 h-32 flex-shrink-0">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover rounded-[1.5rem]"
                    />
                ) : (
                    <div
                        className="w-full h-full rounded-[1.5rem] flex items-center justify-center text-6xl font-semibold text-white shadow-inner"
                        style={{
                            backgroundColor: stringToColor(name),
                        }}
                    >
                        {getInitials(name)}
                    </div>
                )}
                {/* Status Badge */}
                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(status)}`}>
                    {status}
                </div>
            </div>

            {/* Content Section - Stack of Pills */}
            <div className="flex-1 flex flex-col justify-center gap-2 pr-1 min-w-0">

                {/* Name Pill */}
                <div className="bg-[#3A6D6C] rounded-[1.5rem] py-2 px-4 text-white text-center w-full shadow-sm">
                    <h3 className="font-bold text-sm truncate">{name}</h3>
                </div>

                {/* Date Pill */}
                <div className="bg-[#3A6D6C] rounded-[1.5rem] py-2 px-4 text-white text-center w-full shadow-sm">
                    <p className="text-xs font-medium truncate">{appliedDate}</p>
                </div>

                {/* View Button Pill */}
                <button
                    onClick={onView || (() => navigate(`/dashboard/application/${id}`))}
                    className="bg-[#C8C8C8] text-[#2c3e50] py-2 px-4 rounded-full text-xs font-bold hover:bg-[#b8b8b8] transition-colors shadow-sm w-20 self-center truncate"
                >
                    View
                </button>
            </div>
        </div>
    );
};

export default ApplicationCard;
