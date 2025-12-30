import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TenantCardProps {
    id: string | number;
    image: string;
    name: string;
    phone: string;
    email: string;
    propertyName?: string;
    onDelete?: () => void;
}

const TenantCard: React.FC<TenantCardProps> = ({
    id,
    image,
    name,
    phone,
    email,
    propertyName,
    onDelete
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
        { label: 'Edit', action: () => navigate(`/dashboard/contacts/tenants/edit/${id}`) },
        { label: 'Send connection', action: () => { } },
        { label: 'Move in', action: () => navigate(`/dashboard/movein?tenantId=${id}`) },
        { label: 'Add invoice', action: () => navigate(`/dashboard/accounting/transactions/income/add?tenantId=${id}`) },
        { label: 'Add insurance', action: () => { } },
        { label: 'Archive', action: () => { } },
        {
            label: 'Delete',
            action: () => {
                if (onDelete) {
                    onDelete();
                } else if (window.confirm('Are you sure you want to delete this tenant?')) {
                    console.log('Deleting tenant:', id);
                }
            },
            isDestructive: true
        },
    ];

    return (
        <div className="bg-[#F6F6F8] rounded-[2.5rem] p-4 flex gap-5 relative items-center">
            {/* Context Menu */}
            <div className="absolute top-5 right-5 z-10" ref={menuRef}>
                <div
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-white/30 backdrop-blur-md border border-white/40 shadow-sm w-12 h-8 rounded-full hover:bg-white/40 transition-all cursor-pointer flex items-center justify-center"
                >
                    <MoreHorizontal className="w-6 h-6 text-gray-700" />
                </div>

                {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
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
            <div className="w-50 h-50 flex-shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover rounded-[2rem]"
                />
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-center gap-3 pr-2">

                {/* Info Pill */}
                <div className="bg-[#3A6D6C] rounded-[2rem] p-4 text-white text-center w-full shadow-sm mt-3">
                    <h3 className="font-bold text-base mb-1">{name}</h3>
                    <div className="flex flex-col gap-0.5">
                        <p className="text-[11px] opacity-90">{phone}</p>
                        <p className="text-[11px] opacity-90">{email}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 w-full pl-2">
                    <button
                        onClick={() => navigate(`/dashboard/contacts/tenants/${id}`)}
                        className="bg-[#C8C8C8] text-gray-700 px-6 py-2 rounded-full text-xs font-bold hover:bg-[#b8b8b8] transition-colors shadow-sm"
                    >
                        View Profile
                    </button>

                    <button
                        className="text-[#2c3e50] hover:text-[#3A6D6C] transition-colors"
                        title="Chat"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                        </svg>
                    </button>
                </div>

                {propertyName && (
                    <div className="text-center mt-1">
                        <p className="text-[#888888] text-sm font-medium">
                            Rented: <span className="text-gray-600">{propertyName}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenantCard;
