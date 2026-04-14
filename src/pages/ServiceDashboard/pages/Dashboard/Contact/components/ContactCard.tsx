import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Phone, Trash2, Pencil } from 'lucide-react';
import { PiChatDotsBold } from "react-icons/pi";

interface ContactCardProps {
    name: string;
    phone: string;
    viewMode?: 'grid' | 'list';
    onMessage?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ name, phone, viewMode = 'grid', onMessage, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    const handleMessage = () => {
        if (onMessage) return onMessage();
        // Default: open phone dialer or SMS
        window.location.href = `sms:${phone.replace(/\D/g, '')}`;
    };

    const renderMenu = () => (
        <div ref={menuRef} className="absolute right-0 top-full mt-2 z-30 bg-white rounded-xl shadow-xl border border-gray-100 w-40 py-1">
            <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); window.location.href = `tel:${phone.replace(/\D/g, '')}`; }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
                <Phone className="w-4 h-4" /> Call
            </button>
            {onEdit && (
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <Pencil className="w-4 h-4" /> Edit
                </button>
            )}
            {onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" /> Delete
                </button>
            )}
        </div>
    );

    if (viewMode === 'list') {
        return (
            <div className="bg-[#F6F6F6] rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                {/* Avatar */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-coral-100 border-2 border-white shadow-sm flex-shrink-0">
                    <div className="w-full h-full bg-coral-100 flex items-center justify-center text-lg sm:text-xl font-bold text-gray-700">
                        {name.split(' ').map(n => n[0]).join('')}
                    </div>
                </div>

                {/* Name and Phone */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{phone}</p>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 relative">
                    <button
                        onClick={handleMessage}
                        aria-label="Message contact"
                        className="p-1.5 sm:p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <PiChatDotsBold className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Contact menu"
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                    {menuOpen && renderMenu()}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F6F6F6] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-col items-center relative border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            {/* Top Icons */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2">
                <button
                    onClick={handleMessage}
                    aria-label="Message contact"
                    className="p-1.5 sm:p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <PiChatDotsBold className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </button>
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Contact menu"
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                    {menuOpen && renderMenu()}
                </div>
            </div>

            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden mb-4 sm:mb-5 lg:mb-6 bg-coral-100 border-3 sm:border-4 border-white shadow-sm">
                <div className="w-full h-full bg-coral-100 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700">
                    {name.split(' ').map(n => n[0]).join('')}
                </div>
            </div>

            {/* Name and Phone */}
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1 text-center">{name}</h3>
            <p className="text-sm sm:text-base text-gray-500 font-medium">{phone}</p>
        </div>
    );
};

export default ContactCard;

