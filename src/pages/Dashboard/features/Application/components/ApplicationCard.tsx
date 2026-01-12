import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../../../../components/common/modals/DeleteConfirmationModal';

interface ApplicationCardProps {
    id: string | number;
    image: string;
    name: string;
    appliedDate: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    backendStatus: string;
    propertyId?: string;
    applicantEmail?: string;
    onView?: () => void;
    onStatusChange?: (id: string | number, newStatus: 'APPROVED' | 'REVIEWING' | 'REJECTED') => Promise<void>;
    onMoveIn?: (propertyId: string, applicantEmail?: string) => void;
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
    backendStatus,
    propertyId,
    applicantEmail,
    onView,
    onStatusChange,
    onMoveIn
}) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        type: 'approve' | 'review' | 'decline' | null;
        isOpen: boolean;
    }>({ type: null, isOpen: false });
    const [isUpdating, setIsUpdating] = useState(false);
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

    const handleStatusChange = async (newStatus: 'APPROVED' | 'REVIEWING' | 'REJECTED') => {
        if (!onStatusChange || isUpdating) return;
        
        setIsUpdating(true);
        try {
            await onStatusChange(id, newStatus);
            setConfirmModal({ type: null, isOpen: false });
        } catch (error) {
            console.error('Failed to update application status:', error);
            alert('Failed to update application status. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMoveIn = () => {
        if (propertyId && onMoveIn) {
            onMoveIn(propertyId, applicantEmail);
        } else if (propertyId) {
            navigate('/dashboard/movein', { 
                state: { 
                    preSelectedPropertyId: propertyId,
                    preSelectedTenantEmail: applicantEmail 
                } 
            });
        }
        setIsMenuOpen(false);
    };

    const menuItems = [
        ...(backendStatus !== 'APPROVED' ? [{ 
            label: 'Approve', 
            action: () => setConfirmModal({ type: 'approve', isOpen: true }),
            color: 'text-green-600'
        }] : []),
        ...(backendStatus !== 'REVIEWING' ? [{ 
            label: 'In Review', 
            action: () => setConfirmModal({ type: 'review', isOpen: true }),
            color: 'text-blue-600'
        }] : []),
        ...(backendStatus !== 'REJECTED' ? [{ 
            label: 'Decline', 
            action: () => setConfirmModal({ type: 'decline', isOpen: true }),
            isDestructive: true
        }] : []),
        ...(backendStatus === 'APPROVED' && propertyId ? [{ 
            label: 'Move in', 
            action: handleMoveIn,
            color: 'text-[#3A6D6C]'
        }] : []),
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
                                        : (item as any).color || 'text-gray-700 hover:bg-gray-50'
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

            {/* Confirmation Modals */}
            {confirmModal.type === 'approve' && (
                <DeleteConfirmationModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => !isUpdating && setConfirmModal({ type: null, isOpen: false })}
                    onConfirm={() => handleStatusChange('APPROVED')}
                    title="Approve Application"
                    message={
                        <>
                            Are you sure you want to approve the application for <span className="font-bold text-gray-800">{name}</span>?
                            <br />
                            This action will mark the application as approved.
                        </>
                    }
                    confirmText={isUpdating ? 'Approving...' : 'Approve'}
                    confirmButtonClass={`bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    headerClassName="bg-green-600"
                />
            )}

            {confirmModal.type === 'review' && (
                <DeleteConfirmationModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => !isUpdating && setConfirmModal({ type: null, isOpen: false })}
                    onConfirm={() => handleStatusChange('REVIEWING')}
                    title="Mark as In Review"
                    message={
                        <>
                            Are you sure you want to mark the application for <span className="font-bold text-gray-800">{name}</span> as "In Review"?
                            <br />
                            This action will change the application status to under review.
                        </>
                    }
                    confirmText={isUpdating ? 'Updating...' : 'Mark as In Review'}
                    confirmButtonClass={`bg-blue-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    headerClassName="bg-blue-600"
                />
            )}

            {confirmModal.type === 'decline' && (
                <DeleteConfirmationModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => !isUpdating && setConfirmModal({ type: null, isOpen: false })}
                    onConfirm={() => handleStatusChange('REJECTED')}
                    title="Decline Application"
                    message={
                        <>
                            Are you sure you want to decline the application for <span className="font-bold text-gray-800">{name}</span>?
                            <br />
                            This action cannot be undone.
                        </>
                    }
                    confirmText={isUpdating ? 'Declining...' : 'Decline'}
                    confirmButtonClass={`bg-red-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    headerClassName="bg-red-600"
                />
            )}
        </div>
    );
};

export default ApplicationCard;
