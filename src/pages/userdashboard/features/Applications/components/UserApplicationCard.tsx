import React, { useState, useEffect, useMemo } from "react";
import { Trash2 } from "lucide-react";

export interface ApplicationItem {
    id: number | string;
    name: string;
    phone?: string;
    status: "Approved" | "Rejected" | "Submitted" | "Draft";
    appliedDate: string;
    address: string;
    propertyId?: string;
    imageUrl?: string | null;
}

interface ApplicationCardProps {
    app: ApplicationItem;
    onDelete: (id: number | string) => void;
    onNavigate: () => void;
}

// Helper function to generate initials from name
const getInitials = (name: string): string => {
    if (!name || name.trim() === '') return 'U';

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    const firstInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
    if (!dateString) return '-';

    let date: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(year, month - 1, day);
    } else {
        date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return '-';

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

export const UserApplicationCard: React.FC<ApplicationCardProps> = ({ app, onDelete, onNavigate }) => {
    const initials = useMemo(() => getInitials(app.name), [app.name]);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [app.imageUrl]);

    return (
        <div className="bg-[#F7F7F7] rounded-2xl border-[0.5px] border-[#201F23]/40 shadow-[0px_4px_4px_0px_#00000040] w-full flex flex-col relative">
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === "Approved"
                        ? "bg-[#E8F5E9] text-[#2E7D32]"
                        : app.status === "Submitted"
                            ? "bg-[#FFF3E0] text-[#F57C00]"
                            : app.status === "Draft"
                                ? "bg-[#F3F4F6] text-[#71717A]"
                                : "bg-[#FFEBEE] text-[#C62828]"
                        }`}
                >
                    {app.status}
                </span>
            </div>

            {/* Delete Application Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(app.id);
                }}
                className="absolute top-4 right-4 z-10 p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 transition-all shadow-sm"
            >
                <Trash2 size={16} />
            </button>

            {/* Main Content */}
            <div className="flex flex-col items-center pt-10 sm:pt-12 px-4 sm:px-6">
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E0F2FE] mb-3 overflow-hidden flex items-center justify-center shrink-0">
                    {app.imageUrl && !imageError ? (
                        <img
                            src={app.imageUrl}
                            alt={app.name}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <span className="text-xl sm:text-2xl font-semibold text-[#1565C0]">
                            {initials}
                        </span>
                    )}
                </div>

                {/* Name */}
                <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1 text-center truncate w-full">
                    {app.name}
                </h3>

                {/* Applied Date */}
                <p className="text-sm text-[#71717A] mb-4">
                    Applied on {formatDate(app.appliedDate)}
                </p>

                {/* Address */}
                <div className="w-full bg-[#E3F2FD] rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs text-[#1565C0] font-medium text-center">
                        {app.address}
                    </p>
                </div>
            </div>

            {/* Separator */}
            <div className="border-t border-[#E5E7EB]"></div>

            {/* View Application Link */}
            <div className="py-4 flex justify-center">
                <button
                    onClick={onNavigate}
                    className="text-[#7ED957] text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                    {app.status === "Draft" ? "Continue application" : "View application"}
                </button>
            </div>
        </div>
    );
};

export const UserApplicationCardSkeleton: React.FC = () => {
    return (
        <div className="bg-[#F7F7F7] rounded-2xl border-[0.5px] border-[#201F23]/40 shadow-[0px_4px_4px_0px_#00000040] w-full flex flex-col relative h-[320px] animate-pulse">
            {/* Status Badge Skeleton */}
            <div className="absolute top-4 left-4 z-10 w-20 h-6 bg-gray-200 rounded-full"></div>

            {/* Delete Button Skeleton */}
            <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-200 rounded-full"></div>

            {/* Main Content */}
            <div className="flex flex-col items-center pt-10 sm:pt-12 px-4 sm:px-6 w-full">
                {/* Avatar Skeleton */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 mb-3 shrink-0"></div>

                {/* Name Skeleton */}
                <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>

                {/* Applied Date Skeleton */}
                <div className="w-1/2 h-4 bg-gray-200 rounded mb-4"></div>

                {/* Address Skeleton */}
                <div className="w-full h-12 bg-gray-200 rounded-lg mb-4"></div>
            </div>

            {/* Separator */}
            <div className="border-t border-[#E5E7EB] mt-auto"></div>

            {/* View Application Link Skeleton */}
            <div className="py-4 flex justify-center">
                <div className="w-1/3 h-5 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};
