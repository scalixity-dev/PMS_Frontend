import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, MessageCircle, Phone, Mail, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import { tenantService } from '../../../../../services/tenant.service';

interface TenantCardProps {
    id: string | number;
    image: string;
    name: string;
    phone: string;
    email: string;
    propertyName?: string;
    onDeleteSuccess?: () => void;
}

const TenantCard: React.FC<TenantCardProps> = ({
    id,
    image,
    name,
    phone,
    email,
    propertyName,
    onDeleteSuccess
}) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Initial generation logic if image is missing
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const initials = getInitials(name);
    // Use a default color similar to ServiceProCard if needed, or stick to one.
    const bgColor = 'bg-[#4ad1a6]';

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

    const handleDelete = async () => {
        try {
            await tenantService.delete(String(id));
            setIsDeleteModalOpen(false);
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
        } catch (error) {
            console.error('Error deleting tenant:', error);
            alert('Failed to delete tenant');
        }
    };

    const menuItems = [
        { label: 'Edit', action: () => navigate(`/dashboard/contacts/tenants/edit/${id}`) },
        { label: 'Send connection', action: () => { } },
        { label: 'Move in', action: () => navigate(`/dashboard/movein?tenantId=${id}`) },
        { label: 'Add invoice', action: () => navigate(`/dashboard/accounting/transactions/income/add?tenantId=${id}`) },
        { label: 'Add insurance', action: () => { } },
        { label: 'Archive', action: () => { } },
        {
            label: 'Delete',
            action: () => setIsDeleteModalOpen(true),
            isDestructive: true
        },
    ];

    const handleMessage = () => {
        // TODO: Implement message functionality
    };

    return (
        <>
            <div className="bg-[#F6F6F8] rounded-[2rem] p-4 flex gap-4 relative hover:shadow-lg transition-all duration-200 group">
                {/* Action Buttons - Top Right */}
                <div className="absolute top-4 right-4 z-10">
                    {/* More Options Menu */}
                    <div ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-10 h-6 flex items-center justify-center bg-white/30 backdrop-blur-md border border-white/40 shadow-sm rounded-full hover:bg-white/40 transition-all cursor-pointer"
                            title="More Options"
                        >
                            <MoreHorizontal className="w-6 h-6 text-gray-700" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden">
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
                </div>

                {/* Image/Initials Section */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover rounded-[1.5rem] shadow-md"
                        />
                    ) : (
                        <div className={`w-full h-full ${bgColor} rounded-[1.5rem] flex items-center justify-center shadow-md`}>
                            <span className="text-white text-3xl sm:text-4xl font-medium">{initials}</span>
                        </div>
                    )}
                    {/* Status indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between min-h-[128px]">
                    {/* Info Section */}
                    <div className="bg-[#3A6D6C] rounded-xl p-3 text-white mb-3 shadow-sm">
                        <h3 className="font-bold text-sm mb-2 truncate" title={name}>{name}</h3>
                        <div className="space-y-1">
                            {propertyName && (
                                <div className="flex items-center gap-1.5 text-[10px] opacity-100 font-medium text-yellow-50">
                                    <Home size={12} className="flex-shrink-0" />
                                    <span className="truncate" title={propertyName}>{propertyName}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-[10px] opacity-90">
                                <Phone size={12} className="flex-shrink-0" />
                                <span className="truncate">{phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] opacity-90">
                                <Mail size={12} className="flex-shrink-0" />
                                <span className="truncate" title={email}>{email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/dashboard/contacts/tenants/${id}`)}
                            className="flex-1 bg-[#C8C8C8] text-gray-700 py-2 rounded-full text-xs font-medium hover:bg-[#b8b8b8] transition-colors shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]"
                        >
                            View Profile
                        </button>
                        <button
                            onClick={handleMessage}
                            className="px-3 py-2 bg-[#3A6D6C] text-white rounded-full hover:bg-[#2c5251] transition-colors shadow-md flex items-center justify-center"
                            title="Quick Message"
                        >
                            <MessageCircle size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Tenant"
                itemName={name}
                message={`Are you sure you want to delete tenant "${name}"? This action cannot be undone.`}
            />
        </>
    );
};

export default TenantCard;
