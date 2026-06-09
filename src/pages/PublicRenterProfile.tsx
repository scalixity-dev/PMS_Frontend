import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, DollarSign, Maximize2, PawPrint, User } from "lucide-react";
import { API_ENDPOINTS } from "../config/api.config";

interface PublicProfile {
    profileSlug: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl: string | null;
    preferences: {
        location?: { country: string; state: string; city: string };
        rentalTypes?: string[];
        lookingForPlace?: boolean;
        criteria?: {
            beds?: string | null;
            baths?: string | null;
            minPrice?: number;
            maxPrice?: number;
            petsAllowed?: boolean;
            size?: string | null;
        };
    } | null;
}

const PublicRenterProfile: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        fetch(API_ENDPOINTS.TENANT.GET_PUBLIC_PROFILE(slug))
            .then(async (res) => {
                if (res.status === 404) { setNotFound(true); return; }
                if (!res.ok) throw new Error('Failed to load profile');
                setProfile(await res.json());
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#7BD747] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (notFound || !profile) {
        return (
            <div className="min-h-screen bg-[#F4F4F4] flex flex-col items-center justify-center gap-4 p-6 text-center">
                <h1 className="text-2xl font-bold text-[#1A1A1A]">Profile Not Found</h1>
                <p className="text-[#6B7280]">This renter profile does not exist or has been removed.</p>
                <Link to="/" className="text-[#7BD747] font-semibold hover:underline">Go Home</Link>
            </div>
        );
    }

    const prefs = profile.preferences;
    const criteria = prefs?.criteria;
    const location = prefs?.location
        ? [prefs.location.city, prefs.location.state, prefs.location.country].filter(Boolean).join(', ')
        : null;

    return (
        <div className="min-h-screen bg-[#F4F4F4]">
            {/* Header */}
            <div className="bg-[#1A1A1A] py-4 px-6">
                <Link to="/" className="text-white font-semibold text-lg tracking-tight">SmartTenantAI</Link>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 flex items-center gap-5">
                    {profile.profilePhotoUrl ? (
                        <img
                            src={profile.profilePhotoUrl}
                            alt={profile.firstName}
                            className="w-20 h-20 rounded-full object-cover border-2 border-[#7BD747]"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-[#F4F4F4] border-2 border-[#E5E7EB] flex items-center justify-center">
                            <User size={36} className="text-[#9CA3AF]" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-[#1A1A1A]">{profile.firstName} {profile.lastName}</h1>
                        {prefs?.rentalTypes && prefs.rentalTypes.length > 0 && (
                            <span className="inline-block mt-1 px-3 py-0.5 bg-[#EAF7E3] text-[#3A7D3A] text-sm font-medium rounded-full">
                                {prefs.rentalTypes[0]}
                            </span>
                        )}
                        {typeof prefs?.lookingForPlace === 'boolean' && (
                            <p className={`mt-2 text-sm font-medium ${prefs.lookingForPlace ? 'text-[#7BD747]' : 'text-[#9CA3AF]'}`}>
                                {prefs.lookingForPlace ? '✓ Currently looking for a place' : 'Not currently looking'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Preferences Card */}
                {prefs && (
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 space-y-5">
                        <h2 className="text-lg font-semibold text-[#1A1A1A]">Search Preferences</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {location && (
                                <div className="flex items-start gap-3 p-4 bg-[#F4F4F4] rounded-xl">
                                    <MapPin size={18} className="text-[#7BD747] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-[#6B7280] font-medium">Location</p>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">{location}</p>
                                    </div>
                                </div>
                            )}

                            {criteria?.beds && (
                                <div className="flex items-start gap-3 p-4 bg-[#F4F4F4] rounded-xl">
                                    <BedDouble size={18} className="text-[#7BD747] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-[#6B7280] font-medium">Bedrooms</p>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">{criteria.beds}</p>
                                    </div>
                                </div>
                            )}

                            {criteria?.baths && (
                                <div className="flex items-start gap-3 p-4 bg-[#F4F4F4] rounded-xl">
                                    <Bath size={18} className="text-[#7BD747] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-[#6B7280] font-medium">Bathrooms</p>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">{criteria.baths}</p>
                                    </div>
                                </div>
                            )}

                            {(criteria?.minPrice !== undefined || criteria?.maxPrice !== undefined) && (
                                <div className="flex items-start gap-3 p-4 bg-[#F4F4F4] rounded-xl">
                                    <DollarSign size={18} className="text-[#7BD747] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-[#6B7280] font-medium">Budget</p>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">
                                            ${criteria?.minPrice ?? 0} – ${criteria?.maxPrice ?? '∞'}/mo
                                        </p>
                                    </div>
                                </div>
                            )}

                            {criteria?.size && (
                                <div className="flex items-start gap-3 p-4 bg-[#F4F4F4] rounded-xl">
                                    <Maximize2 size={18} className="text-[#7BD747] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-[#6B7280] font-medium">Size</p>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">{criteria.size} sqft</p>
                                    </div>
                                </div>
                            )}

                            {typeof criteria?.petsAllowed === 'boolean' && (
                                <div className="flex items-start gap-3 p-4 bg-[#F4F4F4] rounded-xl">
                                    <PawPrint size={18} className="text-[#7BD747] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-[#6B7280] font-medium">Pets</p>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">{criteria.petsAllowed ? 'Pets allowed' : 'No pets'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <p className="text-center text-xs text-[#9CA3AF]">Powered by SmartTenantAI</p>
            </div>
        </div>
    );
};

export default PublicRenterProfile;
