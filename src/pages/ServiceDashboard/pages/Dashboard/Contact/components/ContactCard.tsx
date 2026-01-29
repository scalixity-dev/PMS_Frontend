import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { PiChatDotsBold } from "react-icons/pi";

interface ContactCardProps {
    name: string;
    phone: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ name, phone }) => {
    return (
        <div className="bg-[#F6F6F6] rounded-3xl p-8 flex flex-col items-center relative transition-shadow hover:shadow-sm">
            {/* Top Icons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <PiChatDotsBold className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            {/* Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 bg-coral-100 border-4 border-white shadow-sm">
                <div className="w-full h-full bg-coral-100 flex items-center justify-center text-4xl font-bold text-gray-700">
                    {name.split(' ').map(n => n[0]).join('')}
                </div>
            </div>

            {/* Name and Phone */}
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{name}</h3>
            <p className="text-gray-500 font-medium">{phone}</p>
        </div>
    );
};

export default ContactCard;
