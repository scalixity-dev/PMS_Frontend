import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { PiChatDotsBold } from "react-icons/pi";

interface ContactCardProps {
    name: string;
    phone: string;
    viewMode?: 'grid' | 'list';
}

const ContactCard: React.FC<ContactCardProps> = ({ name, phone, viewMode = 'grid' }) => {
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
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <button className="p-1.5 sm:p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                        <PiChatDotsBold className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F6F6F6] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-col items-center relative border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            {/* Top Icons */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2">
                <button className="p-1.5 sm:p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <PiChatDotsBold className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                    <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </button>
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

