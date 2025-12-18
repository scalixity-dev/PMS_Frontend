import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceProCardProps {
    id: string | number;
    initials: string;
    name: string;
    phone: string;
    category: string;
    bgColor?: string;
    image?: string; // Added optional image prop if available later
}

const ServiceProCard: React.FC<ServiceProCardProps> = ({
    id,
    initials,
    name,
    phone,
    category,
    bgColor = 'bg-[#4ad1a6]',
    image
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
        { label: 'Edit', action: () => navigate(`/dashboard/contacts/service-pros/edit/${id}`) },
        { label: 'Send connection', action: () => { } },
        { label: 'Delete', action: () => { }, isDestructive: true },
    ];

    return (
        <div className="bg-[#F6F6F8] rounded-[2rem] p-4 flex gap-4 relative">
            <div className="absolute top-4 right-4" ref={menuRef}>
                <div
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-[#A3A3A3] px-[6px] rounded-md bg-opacity-50 hover:bg-opacity-70 transition-all cursor-pointer"
                >
                    <MoreHorizontal className="w-5 h-5 text-gray-700" />
                </div>

                {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden">
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

            {/* Image/Initials Section */}
            <div className="w-32 h-32 flex-shrink-0">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover rounded-[1.5rem]"
                    />
                ) : (
                    <div className={`w-full h-full ${bgColor} rounded-[1.5rem] flex items-center justify-center`}>
                        <span className="text-white text-4xl font-medium">{initials}</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-center mr-8">
                <div className="bg-[#3A6D6C] rounded-xl p-3 text-white mb-3 text-center">
                    <h3 className="font-bold text-sm mb-1">{name}</h3>
                    <p className="text-[10px] opacity-90">{phone}</p>
                    {/* Displaying Category instead of email as per Service Pro requirements */}
                    <p className="text-[10px] opacity-90">{category}</p>
                </div>

                <button
                    onClick={() => navigate(`/dashboard/contacts/service-pros/${id}`)}
                    className="w-full bg-[#C8C8C8] text-gray-700 py-1.5 rounded-full text-xs font-medium hover:bg-[#b8b8b8] transition-colors shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]"
                >
                    View Profile
                </button>
            </div>
        </div>
    );
};

export default ServiceProCard;
