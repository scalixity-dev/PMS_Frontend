import React, { useState, useRef, useMemo, useEffect } from 'react';
import { formatPhoneNumber } from '@/utils/phone.utils';

import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    SquarePen,
    Check,
    PlayCircle,
    X,
    Plus,
    List,
    ChevronDown,
    Loader2,
    Copy,
    Facebook,
    Twitter,
    Mail,
} from 'lucide-react';
import { parse, format } from 'date-fns';
import SelectionModal from './components/SelectionModal';
import CustomDropdown from '../../components/CustomDropdown';
import DatePicker from '../../../../components/ui/DatePicker';
import OnlineApplicationModal from './components/OnlineApplicationModal';
import InviteToApplyModal from './components/InviteToApplyModal';
import DetailTabs from '../../components/DetailTabs';
import { useGetListing, useUpdateListing, useGetListingStatistics, listingQueryKeys } from '../../../../hooks/useListingQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateProperty } from '../../../../hooks/usePropertyQueries';
import { leasingService } from '../../../../services/leasing.service';
import { getCurrencySymbol } from '../../../../utils/currency.utils';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';

const ListingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('listing');
    const [isOnlineApplicationModalOpen, setIsOnlineApplicationModalOpen] = useState(false);
    const [isInviteToApplyModalOpen, setIsInviteToApplyModalOpen] = useState(false);

    // All hooks must be declared before any conditional returns
    const [isUnlistConfirmationOpen, setIsUnlistConfirmationOpen] = useState(false);
    const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
    const [isGalleryEditing, setIsGalleryEditing] = useState(false);
    const [isVideoEditing, setIsVideoEditing] = useState(false);
    const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
    const [isRibbonEditing, setIsRibbonEditing] = useState(false);
    const [isLeaseTermsEditing, setIsLeaseTermsEditing] = useState(false);
    const [isPetPolicyEditing, setIsPetPolicyEditing] = useState(false);
    const [petPolicyEdit, setPetPolicyEdit] = useState<{ petsAllowed: boolean; petCategory: string[]; petFee: number; petDeposit: number; petDescription: string } | null>(null);
    const [isSavingPetPolicy, setIsSavingPetPolicy] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [activeModal, setActiveModal] = useState<'features' | 'amenities' | null>(null);
    const [isContactEditing, setIsContactEditing] = useState(false);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [videoItems, setVideoItems] = useState<string[]>([]);
    const [promotionDescription, setPromotionDescription] = useState('');
    const [promotionRibbon, setPromotionRibbon] = useState('');
    const [leaseTerms, setLeaseTerms] = useState<any>(null);
    const [features, setFeatures] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [contactDetails, setContactDetails] = useState<any>(null);
    const [onlineApplicationStatus, setOnlineApplicationStatus] = useState('Disabled');
    const [applicationFee, setApplicationFee] = useState<string>('');

    const galleryInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    // Track object URLs for cleanup
    const objectURLsRef = useRef<Set<string>>(new Set());

    const availableFeatures = ['Renovated', 'Furnished', 'Hardwood Floor', 'Fire place', 'Internet', 'Carpet', 'Storage', 'Balcony', 'Garden'];
    const availableAmenities = ['Basketball court', 'Business Court', 'Swimming Pool', 'Gym', 'Tennis Court', 'Clubhouse', 'Playground'];

    const queryClient = useQueryClient();

    // Fetch listing data from backend
    const { data: backendListing, isLoading, error } = useGetListing(id || null, !!id);
    const updateListing = useUpdateListing();
    const updateProperty = useUpdateProperty();
    const { data: stats, isLoading: isLoadingStats } = useGetListingStatistics(id || null, activeTab === 'statistics');

    const handleToggleListing = () => {
        if (!backendListing?.id) return;

        const isListed = listing?.status === 'Listed';

        if (isListed) {
            setIsUnlistConfirmationOpen(true);
        } else {
            // List immediately
            updateListing.mutate(
                { id: backendListing.id, data: { listingStatus: 'ACTIVE', isActive: true } },
                {
                    onSuccess: () => {
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                }
            );
        }
    };

    const handleSaveLeaseTerms = async () => {
        if (!backendListing?.id || !leaseTerms) return;

        let availableFromISO: string | undefined;
        if (leaseTerms.dateAvailable) {
            try {
                const parsed = parse(leaseTerms.dateAvailable, 'dd MMM, yyyy', new Date());
                if (!isNaN(parsed.getTime())) {
                    availableFromISO = parsed.toISOString();
                }
            } catch (e) {
                console.warn('Failed to parse dateAvailable:', leaseTerms.dateAvailable);
            }
        }

        const monthsToEnum: Record<string, string> = {
            '1': 'ONE_MONTH', '2': 'TWO_MONTHS', '3': 'THREE_MONTHS', '4': 'FOUR_MONTHS',
            '5': 'FIVE_MONTHS', '6': 'SIX_MONTHS', '7': 'SEVEN_MONTHS', '8': 'EIGHT_MONTHS',
            '9': 'NINE_MONTHS', '10': 'TEN_MONTHS', '11': 'ELEVEN_MONTHS', '12': 'TWELVE_MONTHS',
            '18': 'EIGHTEEN_MONTHS', '24': 'TWENTY_FOUR_MONTHS', '36': 'THIRTY_SIX_PLUS_MONTHS',
        };

        let minEnum = leaseTerms.minLeaseDuration ? monthsToEnum[String(leaseTerms.minLeaseDuration)] : undefined;
        let maxEnum = leaseTerms.maxLeaseDuration ? monthsToEnum[String(leaseTerms.maxLeaseDuration)] : undefined;
        if (leaseTerms.monthToMonth === 'Yes') {
            minEnum = 'ONE_MONTH';
            maxEnum = 'ONE_MONTH';
        }

        const leasingId = (backendListing as any)?.property?.leasing?.id as string | undefined;
        try {
            await updateListing.mutateAsync({
                id: backendListing.id,
                data: {
                    monthlyRent: leaseTerms.monthlyRent,
                    securityDeposit: leaseTerms.securityDeposit,
                    amountRefundable: leaseTerms.amountRefundable,
                    availableFrom: availableFromISO,
                    description: leaseTerms.details ?? undefined,
                    ...(minEnum && { minLeaseDuration: minEnum }),
                    ...(maxEnum && { maxLeaseDuration: maxEnum }),
                },
            });
            if (leasingId) {
                await leasingService.update(leasingId, {
                    monthlyRent: leaseTerms.monthlyRent,
                    securityDeposit: leaseTerms.securityDeposit,
                    amountRefundable: leaseTerms.amountRefundable,
                    ...(availableFromISO && { dateAvailable: availableFromISO }),
                    ...(minEnum && { minLeaseDuration: minEnum as any }),
                    ...(maxEnum && { maxLeaseDuration: maxEnum as any }),
                    description: leaseTerms.details ?? undefined,
                });
            }
            queryClient.invalidateQueries({ queryKey: listingQueryKeys.detail(backendListing.id) });
        } catch (err: any) {
            alert(err?.message || 'Failed to update lease terms');
        }
    };

    const handleSaveVideo = () => {
        const propertyId = backendListing?.property?.id;
        if (!propertyId) return;
        // The backend stores a single video URL in property.youtubeUrl. We persist the first
        // remaining item (or null when the user removed everything) so deletes also stick.
        const url = videoItems.length > 0 ? videoItems[0] : '';
        updateProperty.mutate({
            propertyId,
            updateData: { youtubeUrl: url },
        });
    };

    const handleSaveDescription = () => {
        if (!backendListing?.id) return;

        updateListing.mutate({
            id: backendListing.id,
            data: {
                title: promotionRibbon || listing?.name,
                description: promotionDescription,
            },
        });
    };

    const handleSaveFeatures = (selected: string[]) => {
        // Optimistic local state; modal stays open — user closes with "Done".
        setFeatures(selected);
        const propertyId = backendListing?.property?.id;
        if (!propertyId) return;
        const existingAmenities = backendListing?.property?.amenities;
        updateProperty.mutate(
            {
                propertyId,
                updateData: {
                    amenities: {
                        parking: existingAmenities?.parking || 'NONE',
                        laundry: existingAmenities?.laundry || 'NONE',
                        airConditioning: existingAmenities?.airConditioning || 'NONE',
                        propertyFeatures: selected,
                        propertyAmenities: amenities,
                    },
                },
            },
            {
                onSuccess: () => {
                    // Listing detail query holds nested property.amenities — invalidate
                    // it so the card under the modal refreshes with new chips.
                    if (backendListing?.id) {
                        queryClient.invalidateQueries({ queryKey: listingQueryKeys.detail(backendListing.id) });
                    }
                },
            },
        );
    };

    const handleSaveAmenities = (selected: string[]) => {
        setAmenities(selected);
        const propertyId = backendListing?.property?.id;
        if (!propertyId) return;
        const existingAmenities = backendListing?.property?.amenities;
        updateProperty.mutate(
            {
                propertyId,
                updateData: {
                    amenities: {
                        parking: existingAmenities?.parking || 'NONE',
                        laundry: existingAmenities?.laundry || 'NONE',
                        airConditioning: existingAmenities?.airConditioning || 'NONE',
                        propertyFeatures: features,
                        propertyAmenities: selected,
                    },
                },
            },
            {
                onSuccess: () => {
                    if (backendListing?.id) {
                        queryClient.invalidateQueries({ queryKey: listingQueryKeys.detail(backendListing.id) });
                    }
                },
            },
        );
    };

    const handleSaveContact = () => {
        setIsContactEditing(false);
        const propertyId = backendListing?.property?.id;
        if (!propertyId || !contactDetails) return;
        // contactDetails.phone may include country code prefix — split on first space
        const phoneParts = (contactDetails.phone || '').trim().split(' ');
        const phoneCountryCode = phoneParts.length > 1 ? phoneParts[0] : '';
        const phoneNumber = phoneParts.length > 1 ? phoneParts.slice(1).join(' ') : phoneParts[0];
        updateProperty.mutate({
            propertyId,
            updateData: {
                listingContactName: contactDetails.name || '',
                listingPhoneCountryCode: phoneCountryCode,
                listingPhoneNumber: phoneNumber,
                listingEmail: contactDetails.email || '',
            },
        });
    };

    const handleSavePetPolicy = async () => {
        if (!backendListing?.id || !petPolicyEdit) return;
        const leasingId = (backendListing as any)?.property?.leasing?.id as string | undefined;
        try {
            setIsSavingPetPolicy(true);
            await updateListing.mutateAsync({
                id: backendListing.id,
                data: {
                    petsAllowed: petPolicyEdit.petsAllowed,
                    petCategory: petPolicyEdit.petCategory,
                },
            });
            if (leasingId) {
                await leasingService.update(leasingId, {
                    petsAllowed: petPolicyEdit.petsAllowed,
                    petCategory: petPolicyEdit.petCategory,
                    petFee: petPolicyEdit.petFee,
                    petDeposit: petPolicyEdit.petDeposit,
                    petDescription: petPolicyEdit.petDescription,
                });
            }
            queryClient.invalidateQueries({ queryKey: listingQueryKeys.detail(backendListing.id) });
            setIsPetPolicyEditing(false);
        } catch (err: any) {
            alert(err?.message || 'Failed to update pet policy');
        } finally {
            setIsSavingPetPolicy(false);
        }
    };

    const handleSaveGallery = () => {
        setIsGalleryEditing(false);
        const propertyId = backendListing?.property?.id;
        if (!propertyId) return;
        // Persist gallery images as non-primary photos; filter out blob URLs (pending uploads)
        const serverUrls = galleryImages.filter(u => !u.startsWith('blob:'));
        if (serverUrls.length === 0 && galleryImages.length === 0) return;
        updateProperty.mutate({
            propertyId,
            updateData: {
                photos: serverUrls.map(url => ({ photoUrl: url, isPrimary: false })),
            },
        });
    };

    const handleConfirmUnlist = () => {
        if (!backendListing?.id) return;

        updateListing.mutate(
            { id: backendListing.id, data: { listingStatus: 'DRAFT', isActive: false } },
            {
                onSuccess: () => {
                    setIsUnlistConfirmationOpen(false);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            }
        );
    };

    // Transform backend listing to component format
    const listing = useMemo(() => {
        if (!backendListing || !backendListing.property) return null;

        const property = backendListing.property;
        const address = property.address;
        const amenities = property.amenities;
        const photos = property.photos || [];
        const singleUnitDetails = property.singleUnitDetails;

        // Format address
        let addressStr = 'Address not available';
        if (address && (address.streetAddress || address.city)) {
            const addressParts = [
                address.streetAddress,
                address.city,
                address.stateRegion,
                address.zipCode,
                address.country,
            ].filter(part => part && part.trim() !== '');
            if (addressParts.length > 0) {
                addressStr = addressParts.join(', ');
            }
        }

        // Get image - prioritize coverPhotoUrl, then primary photo, then first photo
        const image = property.coverPhotoUrl
            || photos.find((p: any) => p.isPrimary)?.photoUrl
            || photos[0]?.photoUrl
            || null;

        // Get gallery images (non-primary photos)
        const gallery = photos
            .filter((p: any) => !p.isPrimary)
            .map((p: any) => p.photoUrl) || [];

        // Get video URL if available
        const video = property.youtubeUrl ? [property.youtubeUrl] : [];

        // Map status
        const statusMap: Record<string, string> = {
            'ACTIVE': 'Listed',
            'DRAFT': 'Draft',
            'PAUSED': 'Paused',
            'EXPIRED': 'Expired',
            'ARCHIVED': 'Archived',
            'REMOVED': 'Removed',
        };
        const status = statusMap[backendListing.listingStatus] || 'Draft';

        // Get price (monthly rent)
        const price = backendListing.monthlyRent
            ? typeof backendListing.monthlyRent === 'string'
                ? parseFloat(backendListing.monthlyRent) || 0
                : Number(backendListing.monthlyRent) || 0
            : 0;

        // Format expiry date
        const expiryDate = backendListing.expiresAt
            ? format(new Date(backendListing.expiresAt), 'dd MMM, yyyy')
            : 'No expiry';

        // Get unit details
        const bedrooms = singleUnitDetails?.beds || 0;
        const bathrooms = singleUnitDetails?.baths
            ? typeof singleUnitDetails.baths === 'string'
                ? parseFloat(singleUnitDetails.baths) || 0
                : Number(singleUnitDetails.baths) || 0
            : 0;
        const sizeSqFt = property.sizeSqft
            ? typeof property.sizeSqft === 'string'
                ? parseFloat(property.sizeSqft) || 0
                : Number(property.sizeSqft) || 0
            : 0;

        // Map property type
        const propertyTypeMap: Record<string, string> = {
            'SINGLE': 'Single-Family',
            'MULTI': 'Multi-Family',
        };
        const unitType = propertyTypeMap[property.propertyType] || 'Property';

        // Get basic amenities
        const basicAmenities: string[] = [];
        if (amenities?.parking && amenities.parking !== 'NONE') {
            basicAmenities.push(amenities.parking.replace(/_/g, ' '));
        }
        if (amenities?.laundry && amenities.laundry !== 'NONE') {
            basicAmenities.push(amenities.laundry.replace(/_/g, ' '));
        }
        if (amenities?.airConditioning && amenities.airConditioning !== 'NONE') {
            basicAmenities.push(amenities.airConditioning.replace(/_/g, ' '));
        }

        // Format available date
        const dateAvailable = backendListing.availableFrom
            ? format(new Date(backendListing.availableFrom), 'dd MMM, yyyy')
            : '';

        const ENUM_TO_MONTHS: Record<string, string> = {
            'ONE_MONTH': '1', 'TWO_MONTHS': '2', 'THREE_MONTHS': '3', 'FOUR_MONTHS': '4',
            'FIVE_MONTHS': '5', 'SIX_MONTHS': '6', 'SEVEN_MONTHS': '7', 'EIGHT_MONTHS': '8',
            'NINE_MONTHS': '9', 'TEN_MONTHS': '10', 'ELEVEN_MONTHS': '11', 'TWELVE_MONTHS': '12',
            'EIGHTEEN_MONTHS': '18', 'TWENTY_FOUR_MONTHS': '24', 'THIRTY_SIX_PLUS_MONTHS': '36',
        };
        const minLeaseDuration = backendListing.minLeaseDuration ? (ENUM_TO_MONTHS[backendListing.minLeaseDuration] || '') : '';
        const maxLeaseDuration = backendListing.maxLeaseDuration ? (ENUM_TO_MONTHS[backendListing.maxLeaseDuration] || '') : '';

        const monthToMonth = backendListing.minLeaseDuration === 'ONE_MONTH' && backendListing.maxLeaseDuration === 'ONE_MONTH' ? 'Yes' : 'No';

        return {
            id: backendListing.id,
            name: backendListing.title || property.propertyName || 'Property',
            address: addressStr,
            price,
            expiryDate,
            status,
            image,
            country: address?.country,
            unitDetails: {
                type: unitType,
                bedrooms,
                size: sizeSqFt > 0 ? `${sizeSqFt} sq ft` : 'N/A',
                bathrooms,
                yearBuilt: property.yearBuilt || 'N/A'
            },
            basicAmenities,
            onlineApplications: backendListing.onlineApplicationAvailable,
            postingEnabled: backendListing.isActive,
            leaseTerms: {
                dateAvailable,
                securityDeposit: backendListing.securityDeposit
                    ? typeof backendListing.securityDeposit === 'string'
                        ? parseFloat(backendListing.securityDeposit) || 0
                        : Number(backendListing.securityDeposit) || 0
                    : 0,
                monthlyRent: price,
                amountRefundable: backendListing.amountRefundable
                    ? typeof backendListing.amountRefundable === 'string'
                        ? parseFloat(backendListing.amountRefundable) || 0
                        : Number(backendListing.amountRefundable) || 0
                    : 0,
                minLeaseDuration,
                maxLeaseDuration,
                monthToMonth,
                details: backendListing.description || property.description || property.leasing?.description || '-'
            },
            petPolicy: (() => {
                const leasing = (property.leasing as any) || {};
                const catsFromListing = Array.isArray(backendListing.petCategory) ? backendListing.petCategory : [];
                const catsFromLeasing = Array.isArray(leasing.petCategory) ? leasing.petCategory : [];
                const cats = catsFromListing.length > 0 ? catsFromListing : catsFromLeasing;
                const toNum = (v: any) =>
                    v == null ? 0 : typeof v === 'string' ? parseFloat(v) || 0 : Number(v) || 0;
                return {
                    petsAllowed: !!backendListing.petsAllowed,
                    petCategory: cats as string[],
                    petFee: toNum(leasing.petFee),
                    petDeposit: toNum(leasing.petDeposit),
                    petDescription: leasing.petDescription || '',
                };
            })(),
            media: {
                gallery,
                video
            },
            promotions: {
                description: backendListing.description || property.description || ''
            },
            // Handle propertyFeatures and propertyAmenities - ensure they're arrays
            features: (() => {
                const pf = amenities?.propertyFeatures;
                if (!pf) return [];
                if (Array.isArray(pf)) return pf;
                // Type assertion for string handling
                const pfStr = pf as unknown as string;
                if (typeof pfStr === 'string') {
                    const trimmed = pfStr.trim();
                    if (!trimmed) return [];
                    try {
                        const parsed = JSON.parse(trimmed);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch {
                        return trimmed.split(',').map((f: string) => f.trim()).filter(Boolean);
                    }
                }
                return [];
            })(),
            amenities: (() => {
                const pa = amenities?.propertyAmenities;
                if (!pa) return [];
                if (Array.isArray(pa)) return pa;
                // Type assertion for string handling
                const paStr = pa as unknown as string;
                if (typeof paStr === 'string') {
                    const trimmed = paStr.trim();
                    if (!trimmed) return [];
                    try {
                        const parsed = JSON.parse(trimmed);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch {
                        return trimmed.split(',').map((a: string) => a.trim()).filter(Boolean);
                    }
                }
                return [];
            })(),
            contact: {
                name: property.listingContactName || 'N/A',
                phone: property.listingPhoneNumber
                    ? `${property.listingPhoneCountryCode || ''} ${formatPhoneNumber(property.listingPhoneNumber)}`.trim()
                    : 'N/A',

                email: property.listingEmail || 'N/A',
                avatar: '' // No avatar in backend
            },
            applicationFee: backendListing.applicationFee
                ? typeof backendListing.applicationFee === 'string'
                    ? parseFloat(backendListing.applicationFee).toString()
                    : backendListing.applicationFee.toString()
                : '',
            onlineApplicationStatus: backendListing.onlineApplicationAvailable ? 'Enabled' : 'Disabled',
        };
    }, [backendListing]);

    // Update state when listing data loads
    useEffect(() => {
        if (listing) {
            setGalleryImages(listing.media.gallery);
            setVideoItems(listing.media.video);
            setPromotionDescription(listing.promotions.description);
            setPromotionRibbon(listing.name);
            setLeaseTerms(listing.leaseTerms);
            setFeatures(listing.features);
            setAmenities(listing.amenities);
            setContactDetails(listing.contact);
            setOnlineApplicationStatus(listing.onlineApplicationStatus);
            setApplicationFee(listing.applicationFee);
            setPetPolicyEdit({
                petsAllowed: listing.petPolicy.petsAllowed,
                petCategory: [...listing.petPolicy.petCategory],
                petFee: listing.petPolicy.petFee,
                petDeposit: listing.petPolicy.petDeposit,
                petDescription: listing.petPolicy.petDescription || '',
            });
        }
    }, [listing]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            objectURLsRef.current.forEach(url => {
                URL.revokeObjectURL(url);
            });
            objectURLsRef.current.clear();
        };
    }, []);

    // Redirect to listings page if id is undefined
    useEffect(() => {
        if (!id) {
            navigate('/dashboard/portfolio/listing', { replace: true });
        }
    }, [id, navigate]);

    // Early return if id is missing
    if (!id) {
        return null;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen pb-10 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C] mx-auto mb-4" />
                    <p className="text-gray-600">Loading listing details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !listing) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen pb-10 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-4">
                        {error instanceof Error ? error.message : 'Failed to load listing details'}
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/portfolio/listing')}
                        className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5554] transition-colors"
                    >
                        Back to Listings
                    </button>
                </div>
            </div>
        );
    }


    const handleDeleteGalleryImage = (index: number) => {
        const urlToRemove = galleryImages[index];
        // Revoke object URL if it's one we created
        if (objectURLsRef.current.has(urlToRemove)) {
            URL.revokeObjectURL(urlToRemove);
            objectURLsRef.current.delete(urlToRemove);
        }
        const remaining = galleryImages.filter((_, i) => i !== index);
        setGalleryImages(remaining);

        // Persist immediately so deletes stick even if the user navigates away
        // before clicking "Done". Skip if it was a blob URL (still uploading).
        const propertyId = backendListing?.property?.id;
        if (!propertyId || urlToRemove.startsWith('blob:')) return;
        const serverUrls = remaining.filter((u) => !u.startsWith('blob:'));
        updateProperty.mutate({
            propertyId,
            updateData: {
                photos: serverUrls.map((url) => ({ photoUrl: url, isPrimary: false })),
            },
        });
    };

    const handleDeleteVideoItem = (index: number) => {
        const urlToRemove = videoItems[index];
        // Revoke object URL if it's one we created
        if (objectURLsRef.current.has(urlToRemove)) {
            URL.revokeObjectURL(urlToRemove);
            objectURLsRef.current.delete(urlToRemove);
        }
        const remaining = videoItems.filter((_, i) => i !== index);
        setVideoItems(remaining);

        // Persist immediately. Backend stores a single video on property.youtubeUrl;
        // when the user clears the last video we send '' which the backend coerces to null.
        const propertyId = backendListing?.property?.id;
        if (!propertyId || urlToRemove.startsWith('blob:')) return;
        updateProperty.mutate({
            propertyId,
            updateData: { youtubeUrl: remaining.length > 0 ? remaining[0] : '' },
        });
    };

    const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        // Optimistic preview while uploading
        const objectURL = URL.createObjectURL(file);
        objectURLsRef.current.add(objectURL);
        setGalleryImages(prev => [objectURL, ...prev]);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/upload/image`, {
                method: 'POST',
                credentials: 'include',
                body: fd,
            });
            if (!res.ok) throw new Error('Upload failed');
            const { url } = await res.json();
            // Replace optimistic objectURL with server URL
            URL.revokeObjectURL(objectURL);
            objectURLsRef.current.delete(objectURL);
            const updatedList = (() => {
                const next = galleryImages.map(u => u === objectURL ? url : u);
                if (!next.includes(url)) {
                    return [url, ...next.filter(u => u !== objectURL)];
                }
                return next;
            })();
            setGalleryImages(updatedList);

            // Persist new photo immediately to property.photos
            const propertyId = backendListing?.property?.id;
            if (propertyId) {
                const serverUrls = updatedList.filter((u) => !u.startsWith('blob:'));
                updateProperty.mutate({
                    propertyId,
                    updateData: {
                        photos: serverUrls.map((u) => ({ photoUrl: u, isPrimary: false })),
                    },
                });
            }
        } catch {
            // Revert on failure
            URL.revokeObjectURL(objectURL);
            objectURLsRef.current.delete(objectURL);
            setGalleryImages(prev => prev.filter(u => u !== objectURL));
        }
    };

    const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const objectURL = URL.createObjectURL(file);
        objectURLsRef.current.add(objectURL);
        setVideoItems(prev => [objectURL, ...prev]);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/upload/file`, {
                method: 'POST',
                credentials: 'include',
                body: fd,
            });
            if (!res.ok) throw new Error('Upload failed');
            const { url } = await res.json();
            URL.revokeObjectURL(objectURL);
            objectURLsRef.current.delete(objectURL);
            setVideoItems(prev => prev.map(u => u === objectURL ? url : u));

            // Persist new video URL immediately to property.youtubeUrl
            const propertyId = backendListing?.property?.id;
            if (propertyId) {
                updateProperty.mutate({
                    propertyId,
                    updateData: { youtubeUrl: url },
                });
            }
        } catch {
            URL.revokeObjectURL(objectURL);
            objectURLsRef.current.delete(objectURL);
            setVideoItems(prev => prev.filter(u => u !== objectURL));
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-10">
            {/* Breadcrumb */}
            {/* Breadcrumb */}
            <div className="mb-6">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Listings', path: '/dashboard/portfolio/listing' }, { label: listing?.name || `#${id}` }]} />
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-6 min-h-screen">
                {/* Header */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">{listing?.name || `#${id}`}</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleToggleListing}
                            disabled={updateListing.isPending}
                            className={`bg-[#467676] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#3A6D6C] transition-colors ${updateListing.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {updateListing.isPending ? (listing?.status === 'Listed' ? 'Unlisting...' : 'Listing...') : (listing?.status === 'Listed' ? 'Unlist' : 'List')}
                        </button>
                        <button
                            onClick={() => setIsInviteToApplyModalOpen(true)}
                            className="bg-[#467676] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#3A6D6C] transition-colors"
                        >
                            Invite to apply
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                                className="bg-[#467676] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#3A6D6C] transition-colors flex items-center gap-2"
                            >
                                Share <ChevronDown className={`w-4 h-4 transition-transform ${isShareDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isShareDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsShareDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-1">
                                            <button
                                                onClick={() => {
                                                    const previewUrl = `${window.location.origin}/preview/${backendListing?.id || id}`;
                                                    navigator.clipboard.writeText(previewUrl);
                                                    setIsCopied(true);
                                                    setTimeout(() => {
                                                        setIsCopied(false);
                                                        setIsShareDropdownOpen(false);
                                                    }, 1000);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                            >
                                                <div className={`w-8 h-8 rounded-full ${isCopied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'} flex items-center justify-center transition-colors`}>
                                                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </div>
                                                {isCopied ? 'Copied!' : 'Copy link address'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const previewUrl = `${window.location.origin}/preview/${backendListing?.id || id}`;
                                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(previewUrl)}`, '_blank');
                                                    setIsShareDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <Facebook className="w-4 h-4" />
                                                </div>
                                                Share to Facebook
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const previewUrl = `${window.location.origin}/preview/${backendListing?.id || id}`;
                                                    const text = `Check out ${listing?.name || 'this property'}!`;
                                                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(previewUrl)}&text=${encodeURIComponent(text)}`, '_blank');
                                                    setIsShareDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-800">
                                                    <Twitter className="w-4 h-4" />
                                                </div>
                                                Share to X
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const subject = `Check out ${listing?.name || 'this property'}`;
                                                    const previewUrl = `${window.location.origin}/preview/${backendListing?.id || id}`;
                                                    const body = `Hi,\n\nI found this property and thought you might be interested:\n${previewUrl}`;
                                                    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                                                    setIsShareDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                Share via email
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[2rem] p-6 mb-6 shadow-sm relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{listing.name}</h2>
                            <div
                                className="bg-[#E3EBDE] font-medium px-4 py-1 rounded-full inline-block mt-2"
                                style={{ boxShadow: 'inset 2.49px 2.49px 0px 0px rgba(83, 83, 83, 0.25)' }}
                            >
                                <span className="text-gray-600 text-sm">{listing.address}</span>
                            </div>
                        </div>
                        <span className="bg-[#82D64D] text-white px-4 py-1 rounded-full text-sm font-bold">
                            {listing.status}
                        </span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Image & Price */}
                        <div className="flex gap-4">
                            {listing.image ? (
                                <img
                                    src={listing.image}
                                    alt={listing.name}
                                    className="w-44 h-44 rounded-2xl object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const placeholder = target.nextElementSibling as HTMLElement;
                                        if (placeholder) {
                                            placeholder.style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}
                            <div
                                className={`w-44 h-44 ${listing.image ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl`}
                            >
                                <div className="text-center">
                                    <div className="text-gray-400 text-4xl mb-1">🏠</div>
                                    <p className="text-gray-500 text-xs font-medium">No Image</p>
                                </div>
                            </div>
                            <div className="bg-[#3A6D6C] text-white p-4 rounded-2xl flex flex-col self-center h-fit min-w-[180px]">
                                <span className="text-xl font-bold">{getCurrencySymbol(listing.country)}{listing.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                <span className="text-xs opacity-80">Monthly rent</span>
                                <span className="text-[10px] opacity-60 mt-1">Listing expires on {listing.expiryDate}</span>
                            </div>
                        </div>

                        {/* Unit Details */}
                        <div className="bg-[#82D64D] p-4 rounded-2xl flex-1 text-white">
                            <h3 className="text-sm font-bold mb-3">Unit details</h3>
                            <div className="flex flex-wrap gap-2">
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="text-xs">Unit type</span>
                                    <span className="bg-white text-[#82D64D] px-2 py-0.5 rounded-full text-xs font-bold">{listing.unitDetails.type}</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="text-xs">Bedrooms</span>
                                    <span className="bg-white text-[#82D64D] px-2 py-0.5 rounded-full text-xs font-bold">{listing.unitDetails.bedrooms}</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="text-xs">Size</span>
                                    <span className="bg-white text-[#82D64D] px-2 py-0.5 rounded-full text-xs font-bold">{listing.unitDetails.size}</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="text-xs">Bathrooms</span>
                                    <span className="bg-white text-[#82D64D] px-2 py-0.5 rounded-full text-xs font-bold">{listing.unitDetails.bathrooms}</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="text-xs">Year built</span>
                                    <span className="bg-white text-[#82D64D] px-2 py-0.5 rounded-full text-xs font-bold">{listing.unitDetails.yearBuilt}</span>
                                </div>
                            </div>
                        </div>

                        {/* Basic Amenities */}
                        <div className="bg-[#82D64D] p-4 rounded-2xl flex-1 text-white">
                            <h3 className="text-sm font-bold mb-3">Basic amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {listing.basicAmenities.map((amenity, index) => (
                                    <span key={index} className="bg-white text-[#82D64D] px-3 py-1 rounded-full text-xs font-bold">
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full lg:w-2/3">
                    <div className="bg-[#82D64D] rounded-full p-6 flex items-center justify-between text-white relative overflow-hidden">
                        <div className="z-10 grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 items-center">
                            <h3 className="font-bold">Accept online applications</h3>
                            <div className="flex items-center gap-3">
                                <span className="bg-[#3A6D6C] px-3 py-1 border border-white rounded-full text-xs">{onlineApplicationStatus}</span>
                                <button onClick={() => setIsOnlineApplicationModalOpen(true)}>
                                    <SquarePen className="w-4 h-4" />
                                </button>
                            </div>

                            {applicationFee && (
                                <div className="bg-gradient-to-r from-[#3A4E33] to-[#85B474] text-white px-4 py-1.5 border border-white text-xs font-medium w-fit">
                                    Application fee: {getCurrencySymbol(listing.country)}{applicationFee}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Tabs */}
                <DetailTabs
                    tabs={['Listing', 'Statistics']}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {activeTab === 'listing' && (
                    <>

                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-800">Lease terms</h3>
                                    <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                                </div>
                                <button
                                    onClick={() => {
                                        if (isLeaseTermsEditing) {
                                            handleSaveLeaseTerms();
                                        }
                                        setIsLeaseTermsEditing(!isLeaseTermsEditing);
                                    }}
                                    disabled={updateListing.isPending}
                                    className={`${isLeaseTermsEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50`}
                                >
                                    {isLeaseTermsEditing ? (updateListing.isPending ? 'Saving...' : 'Done') : 'Edit'} <SquarePen className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Date available</span>
                                            {isLeaseTermsEditing ? (
                                                <div className="w-1/2">
                                                    <DatePicker
                                                        value={leaseTerms?.dateAvailable ? parse(leaseTerms.dateAvailable, 'dd MMM, yyyy', new Date()) : undefined}
                                                        onChange={(date: Date | undefined) => setLeaseTerms({ ...leaseTerms, dateAvailable: date ? format(date, 'dd MMM, yyyy') : '' })}
                                                        placeholder="Select date"
                                                        className="text-xs font-bold text-gray-800 bg-transparent text-right focus:outline-none border-b border-gray-400 w-full rounded-none shadow-none px-0 py-1 justify-end focus:ring-0"
                                                        popoverClassName="w-[280px] right-0"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{leaseTerms?.dateAvailable || 'N/A'}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Monthly rent</span>
                                            {isLeaseTermsEditing ? (
                                                <input
                                                    type="number"
                                                    value={leaseTerms?.monthlyRent || 0}
                                                    onChange={(e) => setLeaseTerms({ ...leaseTerms, monthlyRent: parseFloat(e.target.value) || 0 })}
                                                    className="text-xs font-bold text-gray-800 mr-2 bg-transparent text-right focus:outline-none border-b border-gray-400 w-1/2"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{getCurrencySymbol(listing.country)}{(leaseTerms?.monthlyRent || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Min lease duration</span>
                                            {isLeaseTermsEditing ? (
                                                <div className="w-1/2">
                                                    <CustomDropdown
                                                        value={leaseTerms?.minLeaseDuration || ''}
                                                        onChange={(value) => setLeaseTerms({ ...leaseTerms, minLeaseDuration: value })}
                                                        options={[
                                                            { value: '6', label: '6 Months' },
                                                            { value: '12', label: '12 Months' },
                                                            { value: '18', label: '18 Months' },
                                                            { value: '24', label: '24 Months' },
                                                        ]}
                                                        placeholder="Select"
                                                        buttonClassName="!py-1 !px-2 !border-0 !bg-transparent !text-right justify-end"
                                                        textClassName="!text-xs !font-bold !text-gray-800"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{leaseTerms?.minLeaseDuration ? `${leaseTerms.minLeaseDuration} Months` : 'N/A'}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Max lease duration</span>
                                            {isLeaseTermsEditing ? (
                                                <div className="w-1/2">
                                                    <CustomDropdown
                                                        value={leaseTerms?.maxLeaseDuration || ''}
                                                        onChange={(value) => setLeaseTerms({ ...leaseTerms, maxLeaseDuration: value })}
                                                        options={[
                                                            { value: '12', label: '12 Months' },
                                                            { value: '24', label: '24 Months' },
                                                            { value: '36', label: '36 Months' },
                                                        ]}
                                                        placeholder="Select"
                                                        buttonClassName="!py-1 !px-2 !border-0 !bg-transparent !text-right justify-end"
                                                        textClassName="!text-xs !font-bold !text-gray-800"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{leaseTerms?.maxLeaseDuration ? `${leaseTerms.maxLeaseDuration} Months` : 'N/A'}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Security deposit</span>
                                            {isLeaseTermsEditing ? (
                                                <input
                                                    type="number"
                                                    value={leaseTerms?.securityDeposit || 0}
                                                    onChange={(e) => setLeaseTerms({ ...leaseTerms, securityDeposit: parseFloat(e.target.value) || 0 })}
                                                    className="text-xs font-bold text-gray-800 mr-2 bg-transparent text-right focus:outline-none border-b border-gray-400 w-1/2"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{getCurrencySymbol(listing.country)}{(leaseTerms?.securityDeposit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Amount refundable</span>
                                            {isLeaseTermsEditing ? (
                                                <input
                                                    type="number"
                                                    value={leaseTerms?.amountRefundable || 0}
                                                    onChange={(e) => setLeaseTerms({ ...leaseTerms, amountRefundable: parseFloat(e.target.value) || 0 })}
                                                    className="text-xs font-bold text-gray-800 mr-2 bg-transparent text-right focus:outline-none border-b border-gray-400 w-1/2"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{getCurrencySymbol(listing.country)}{(leaseTerms?.amountRefundable || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center bg-[#E3EBDE] p-3 rounded-full shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                            <span className="text-xs font-medium text-gray-600 ml-2">Month-to-month</span>
                                            {isLeaseTermsEditing ? (
                                                <div className="w-1/2">
                                                    <CustomDropdown
                                                        value={leaseTerms?.monthToMonth || 'No'}
                                                        onChange={(value) => setLeaseTerms({ ...leaseTerms, monthToMonth: value })}
                                                        options={[
                                                            { value: 'Yes', label: 'Yes' },
                                                            { value: 'No', label: 'No' }
                                                        ]}
                                                        placeholder="Select"
                                                        buttonClassName="!py-1 !px-2 !border-0 !bg-transparent !text-right justify-end"
                                                        textClassName="!text-xs !font-bold !text-gray-800"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-800 mr-2">{leaseTerms?.monthToMonth || 'N/A'}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-[#E3EBDE] mr-8 rounded-2xl p-4 shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                        <span className="text-xs font-medium text-gray-600 block mb-2">Details</span>
                                        {isLeaseTermsEditing ? (
                                            <textarea
                                                value={leaseTerms?.details || ''}
                                                onChange={(e) => setLeaseTerms({ ...leaseTerms, details: e.target.value })}
                                                className="text-sm text-gray-800 w-full bg-transparent focus:outline-none border-b border-gray-400 min-h-[60px]"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-800">{leaseTerms?.details || '-'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pet Policy */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-800">Pet Policy</h3>
                                    <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                                </div>
                                <button
                                    onClick={() => {
                                        if (isPetPolicyEditing) {
                                            handleSavePetPolicy();
                                        } else {
                                            setIsPetPolicyEditing(true);
                                        }
                                    }}
                                    disabled={isSavingPetPolicy}
                                    className={`${isPetPolicyEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50`}
                                >
                                    {isPetPolicyEditing ? (isSavingPetPolicy ? 'Saving...' : 'Done') : 'Edit'} <SquarePen className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                                {isPetPolicyEditing && petPolicyEdit ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-gray-800">Pets allowed</span>
                                            <button
                                                type="button"
                                                onClick={() => setPetPolicyEdit({ ...petPolicyEdit, petsAllowed: !petPolicyEdit.petsAllowed })}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${petPolicyEdit.petsAllowed ? 'bg-[#82D64D]' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${petPolicyEdit.petsAllowed ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>

                                        {petPolicyEdit.petsAllowed && (
                                            <>
                                                <div>
                                                    <span className="text-xs font-bold text-gray-700 block mb-2">Pet categories</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Cat', 'Dog', 'Horse', 'Rabbit', 'Other'].map((cat) => {
                                                            const isSel = petPolicyEdit.petCategory.includes(cat);
                                                            return (
                                                                <button
                                                                    key={cat}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const next = isSel
                                                                            ? petPolicyEdit.petCategory.filter((c) => c !== cat)
                                                                            : [...petPolicyEdit.petCategory, cat];
                                                                        setPetPolicyEdit({ ...petPolicyEdit, petCategory: next });
                                                                    }}
                                                                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${isSel ? 'bg-[#82D64D] text-white border-[#82D64D]' : 'bg-white text-gray-700 border-gray-300'}`}
                                                                >
                                                                    {cat}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="bg-[#E5EAE0] rounded-xl px-4 py-3 flex items-center justify-between">
                                                    <span className="text-sm font-bold text-gray-800">Pet Fees</span>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm text-gray-700">{getCurrencySymbol(listing.country)}</span>
                                                        <input
                                                            type="number"
                                                            value={petPolicyEdit.petFee}
                                                            onChange={(e) => setPetPolicyEdit({ ...petPolicyEdit, petFee: parseFloat(e.target.value) || 0 })}
                                                            className="text-sm font-medium text-gray-800 bg-transparent text-right focus:outline-none border-b border-gray-400 w-28"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="bg-[#E5EAE0] rounded-xl px-4 py-3 flex items-center justify-between">
                                                    <span className="text-sm font-bold text-gray-800">Pet Deposit</span>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm text-gray-700">{getCurrencySymbol(listing.country)}</span>
                                                        <input
                                                            type="number"
                                                            value={petPolicyEdit.petDeposit}
                                                            onChange={(e) => setPetPolicyEdit({ ...petPolicyEdit, petDeposit: parseFloat(e.target.value) || 0 })}
                                                            className="text-sm font-medium text-gray-800 bg-transparent text-right focus:outline-none border-b border-gray-400 w-28"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="bg-[#E5EAE0] rounded-xl px-4 py-3">
                                                    <span className="text-sm font-bold text-gray-800 block mb-2">Details</span>
                                                    <textarea
                                                        value={petPolicyEdit.petDescription}
                                                        onChange={(e) => setPetPolicyEdit({ ...petPolicyEdit, petDescription: e.target.value })}
                                                        className="w-full text-sm text-gray-800 bg-transparent focus:outline-none border-b border-gray-400 min-h-[60px] resize-y"
                                                        placeholder="Pet policy details"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : !listing.petPolicy.petsAllowed ? (
                                    <p className="text-sm font-medium text-gray-600">Pets not allowed</p>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Pet categories chips */}
                                        {listing.petPolicy.petCategory.length > 0 && (
                                            <div className="bg-[#DFF3C6] rounded-full px-4 py-2 flex flex-wrap gap-2 items-center">
                                                {listing.petPolicy.petCategory.map((cat: string) => (
                                                    <span
                                                        key={cat}
                                                        className="bg-white border border-[#82D64D] text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                                                    >
                                                        {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="bg-[#E5EAE0] rounded-xl px-4 py-3 flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-800">Pet Fees</span>
                                            <span className="text-sm font-medium text-gray-700">
                                                {getCurrencySymbol(listing.country)}{listing.petPolicy.petFee.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="bg-[#E5EAE0] rounded-xl px-4 py-3 flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-800">Pet Deposit</span>
                                            <span className="text-sm font-medium text-gray-700">
                                                {getCurrencySymbol(listing.country)}{listing.petPolicy.petDeposit.toLocaleString()}
                                            </span>
                                        </div>

                                        {listing.petPolicy.petDescription && (
                                            <div className="bg-[#E5EAE0] rounded-xl px-4 py-3 flex items-start justify-between gap-4">
                                                <span className="text-sm font-bold text-gray-800 flex-shrink-0">Details</span>
                                                <span className="text-sm font-medium text-gray-700 text-right">
                                                    {listing.petPolicy.petDescription}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Media */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Media</h3>
                                <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                            </div>

                            {/* Gallery */}
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6 mb-4">
                                <div className="flex gap-4 mb-4">
                                    <span className="bg-[#82D64D] text-white px-6 py-1.5 rounded-full text-xs font-bold">Gallery</span>
                                    <button
                                        onClick={() => {
                                            if (isGalleryEditing) {
                                                handleSaveGallery();
                                            } else {
                                                setIsGalleryEditing(true);
                                            }
                                        }}
                                        disabled={updateProperty.isPending}
                                        className={`${isGalleryEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50`}
                                    >
                                        {isGalleryEditing ? (updateProperty.isPending ? 'Saving...' : 'Done') : 'Edit'} <SquarePen className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className={`${isGalleryEditing ? 'flex overflow-x-auto gap-4 pb-2' : 'grid grid-cols-4 gap-4'}`}>
                                    <input
                                        type="file"
                                        ref={galleryInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleGalleryUpload}
                                    />
                                    {isGalleryEditing && (
                                        <div
                                            onClick={() => galleryInputRef.current?.click()}
                                            className="min-w-[150px] w-[150px] aspect-square rounded-2xl bg-[#E8E8EA] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#82D64D] flex items-center justify-center mb-2">
                                                <Plus className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">Add Image</span>
                                        </div>
                                    )}
                                    {galleryImages.map((img, idx) => (
                                        <div key={idx} className={`${isGalleryEditing ? 'min-w-[150px] w-[150px]' : ''} aspect-square rounded-2xl overflow-hidden relative group flex-shrink-0`}>
                                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                            {isGalleryEditing && (
                                                <button
                                                    onClick={() => handleDeleteGalleryImage(idx)}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-sm"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Video */}
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                                <div className="flex gap-4 mb-4">
                                    <span className="bg-[#82D64D] text-white px-6 py-1.5 rounded-full text-xs font-bold">Video</span>
                                    <button
                                        onClick={() => {
                                            // Persist on Done click (toggle-off). Same UX as Gallery.
                                            if (isVideoEditing) {
                                                handleSaveVideo();
                                            }
                                            setIsVideoEditing(!isVideoEditing);
                                        }}
                                        className={`${isVideoEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors`}
                                    >
                                        {isVideoEditing ? 'Done' : 'Edit'} <SquarePen className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className={`${isVideoEditing ? 'flex overflow-x-auto gap-4 pb-2' : 'grid grid-cols-4 gap-4'}`}>
                                    <input
                                        type="file"
                                        ref={videoInputRef}
                                        className="hidden"
                                        accept="video/*"
                                        onChange={handleVideoUpload}
                                    />
                                    {isVideoEditing && (
                                        <div
                                            onClick={() => videoInputRef.current?.click()}
                                            className="min-w-[150px] w-[150px] aspect-square rounded-2xl bg-[#E8E8EA] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#82D64D] flex items-center justify-center mb-2">
                                                <Plus className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">Add Video</span>
                                        </div>
                                    )}
                                    {videoItems.map((vid, idx) => (
                                        <div key={idx} className={`${isVideoEditing ? 'min-w-[150px] w-[150px]' : ''} aspect-square rounded-2xl overflow-hidden relative group cursor-pointer flex-shrink-0`}>
                                            <video src={vid} className="w-full h-full object-cover" muted playsInline />
                                            <div className={`absolute inset-0 bg-black/20 flex items-center justify-center ${isVideoEditing ? '' : 'group-hover:bg-black/30'} transition-colors`}>
                                                {!isVideoEditing && <PlayCircle className="w-10 h-10 text-white opacity-80 group-hover:opacity-100" />}
                                            </div>
                                            {isVideoEditing && (
                                                <button
                                                    onClick={() => handleDeleteVideoItem(idx)}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-sm z-10"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Promotions */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Promotions</h3>
                                <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => {
                                            if (isDescriptionEditing) {
                                                handleSaveDescription();
                                            }
                                            setIsDescriptionEditing(!isDescriptionEditing);
                                        }}
                                        disabled={updateListing.isPending}
                                        className={`${isDescriptionEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50`}
                                    >
                                        {isDescriptionEditing ? (updateListing.isPending ? 'Saving...' : 'Done') : 'Edit description'} <SquarePen className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (isRibbonEditing) {
                                                handleSaveDescription();
                                            }
                                            setIsRibbonEditing(!isRibbonEditing);
                                        }}
                                        disabled={updateListing.isPending}
                                        className={`${isRibbonEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50`}
                                    >
                                        {isRibbonEditing ? (updateListing.isPending ? 'Saving...' : 'Done') : 'Edit ribbon'} <SquarePen className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6 flex gap-6">
                                {listing.image ? (
                                    <img src={listing.image} alt="Promotion" className="w-32 h-32 rounded-2xl object-cover" />
                                ) : (
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                        <div className="text-gray-400 text-2xl">🏠</div>
                                    </div>
                                )}
                                <div className="flex-1">
                                    {isRibbonEditing ? (
                                        <input
                                            type="text"
                                            value={promotionRibbon}
                                            onChange={(e) => setPromotionRibbon(e.target.value)}
                                            className="font-bold text-gray-800 mb-2 w-full bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#82D64D]"
                                        />
                                    ) : (
                                        <h4 className="font-bold text-gray-800 mb-2">{promotionRibbon || listing.name}</h4>
                                    )}

                                    {isDescriptionEditing ? (
                                        <textarea
                                            value={promotionDescription}
                                            onChange={(e) => setPromotionDescription(e.target.value)}
                                            className="text-sm text-gray-600 leading-relaxed w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#82D64D] min-h-[100px]"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600 leading-relaxed">{promotionDescription || 'No description available'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Property Features */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Property features</h3>
                                <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                            </div>

                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6 mb-4">
                                <div className="flex gap-4 mb-4">
                                    <span className="bg-[#82D64D] text-white px-6 py-1.5 rounded-full text-xs font-bold">Features</span>
                                    <button
                                        onClick={() => setActiveModal('features')}
                                        className="bg-[#888888] text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2"
                                    >
                                        Edit <SquarePen className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {features.map((feature, idx) => (
                                        <span key={idx} className="bg-[#E8E8EA] text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                                <div className="flex gap-4 mb-4">
                                    <span className="bg-[#82D64D] text-white px-6 py-1.5 rounded-full text-xs font-bold">Amenities</span>
                                    <button
                                        onClick={() => setActiveModal('amenities')}
                                        className="bg-[#888888] text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2"
                                    >
                                        Edit <SquarePen className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {amenities.map((amenity, idx) => (
                                        <span key={idx} className="bg-[#E8E8EA] text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <SelectionModal
                            isOpen={activeModal === 'features'}
                            onClose={() => setActiveModal(null)}
                            onSave={handleSaveFeatures}
                            title="Property features"
                            subtitle="Select the property features below."
                            options={availableFeatures}
                            initialSelected={features}
                        />

                        <SelectionModal
                            isOpen={activeModal === 'amenities'}
                            onClose={() => setActiveModal(null)}
                            onSave={handleSaveAmenities}
                            title="Amenities"
                            subtitle="Select the amenities below."
                            options={availableAmenities}
                            initialSelected={amenities}
                        />

                        {/* Listing Contact */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-800">Listing contact</h3>
                                    <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-800" />
                                </div>
                                <button
                                    onClick={() => {
                                        if (isContactEditing) {
                                            handleSaveContact();
                                        } else {
                                            setIsContactEditing(true);
                                        }
                                    }}
                                    disabled={updateProperty.isPending}
                                    className={`${isContactEditing ? 'bg-[#3A6D6C]' : 'bg-[#888888]'} text-white px-6 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50`}
                                >
                                    {isContactEditing ? (updateProperty.isPending ? 'Saving...' : 'Done') : 'Edit'} <SquarePen className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                                <div className="flex items-center gap-4">
                                    {contactDetails?.avatar ? (
                                        <img src={contactDetails.avatar} alt={contactDetails?.name || 'Contact'} className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold">
                                            {contactDetails?.name ? contactDetails.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#E8E8EA] px-4 py-2 rounded-full flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-500">Name</span>
                                            {isContactEditing ? (
                                                <input
                                                    type="text"
                                                    value={contactDetails?.name || ''}
                                                    onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                                                    className="text-sm font-bold text-gray-800 bg-transparent focus:outline-none border-b border-gray-400 w-full"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-gray-800">{contactDetails?.name || 'N/A'}</span>
                                            )}
                                        </div>
                                        <div className="bg-[#E8E8EA] px-4 py-2 rounded-full flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-500">Phone</span>
                                            {isContactEditing ? (
                                                <input
                                                    type="text"
                                                    value={contactDetails?.phone || ''}
                                                    onChange={(e) => setContactDetails({ ...contactDetails, phone: formatPhoneNumber(e.target.value) })}
                                                    className="text-sm font-bold text-gray-800 bg-transparent focus:outline-none border-b border-gray-400 w-full"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-gray-800">{contactDetails?.phone ? formatPhoneNumber(contactDetails.phone) : 'N/A'}</span>
                                            )}
                                        </div>
                                        <div className="bg-[#E8E8EA] px-4 py-2 rounded-full flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-500">Email</span>
                                            {isContactEditing ? (
                                                <input
                                                    type="text"
                                                    value={contactDetails?.email || ''}
                                                    onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                                                    className="text-sm font-bold text-gray-800 bg-transparent focus:outline-none border-b border-gray-400 w-full"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-gray-800">{contactDetails?.email || 'N/A'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'statistics' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                            {isLoadingStats ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Days listed */}
                                <div className="bg-[#82D64D] rounded-[2rem] p-6 text-white h-32 flex flex-col justify-between">
                                    <h3 className="font-bold">Days listed</h3>
                                    <div className="flex gap-2">
                                        <span className="bg-white text-[#82D64D] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <span className="font-extrabold">{stats?.daysListed ?? 0}</span> Days
                                        </span>
                                    </div>
                                </div>

                                {/* Enquiries */}
                                <div className="bg-[#82D64D] rounded-[2rem] p-6 text-white h-32 flex flex-col justify-between">
                                    <h3 className="font-bold">Enquiries</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="bg-white text-[#82D64D] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <span className="font-extrabold">{stats?.messagesSent ?? 0}</span> Messages sent
                                        </span>
                                        <span className="bg-white text-[#82D64D] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <span className="font-extrabold">{stats?.toursRequested ?? 0}</span> Tours requested
                                        </span>
                                    </div>
                                </div>

                                {/* Activity */}
                                <div className="bg-[#82D64D] rounded-[2rem] p-6 text-white h-32 flex flex-col justify-between">
                                    <h3 className="font-bold">Activity</h3>
                                    <div className="flex gap-2">
                                        <span className="bg-white text-[#82D64D] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <span className="font-extrabold">{stats?.addedToFavorite ?? 0}</span> Added to favorite
                                        </span>
                                    </div>
                                </div>

                                {/* Applications */}
                                <div className="bg-[#82D64D] rounded-[2rem] p-6 text-white h-32 flex flex-col justify-between">
                                    <h3 className="font-bold">Applications</h3>
                                    <div className="flex gap-2">
                                        <span className="bg-white text-[#82D64D] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <span className="font-extrabold">{stats?.applicationsNew ?? 0}</span> New
                                        </span>
                                    </div>
                                </div>

                                {/* Leads */}
                                <div className="bg-[#82D64D] rounded-[2rem] p-6 text-white h-32 flex flex-col justify-between">
                                    <h3 className="font-bold">Leads</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="bg-white text-[#82D64D] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <span className="font-extrabold">{stats?.leads ?? 0}</span> Leads
                                        </span>
                                        <span className="bg-white text-[#82D64D] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <span className="font-extrabold">{stats?.premiumLeads ?? 0}</span> Premium leads
                                        </span>
                                    </div>
                                </div>

                                {/* Listing views */}
                                <div className="bg-[#82D64D] rounded-[2rem] p-6 text-white h-32 flex flex-col justify-between">
                                    <h3 className="font-bold">Listing views</h3>
                                    <div className="flex gap-2">
                                        <span className="bg-white text-[#82D64D] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <span className="font-extrabold">{stats?.listingViews ?? 0}</span> Views
                                        </span>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Listing views sources — last 30 days, grouped per day */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Listing views sources</h3>
                                <ChevronDown className="w-5 h-5 text-gray-800" />
                            </div>
                            {(() => {
                                const rows = stats?.viewsByDay ?? [];
                                if (rows.length === 0) {
                                    return (
                                        <div className="bg-[#F0F0F6] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                                            <div className="bg-[#E3EBDE] p-3 rounded-xl mb-3 shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                                <List className="w-6 h-6 text-[#3A6D6C]" />
                                            </div>
                                            <h4 className="text-[#3A6D6C] font-bold mb-1">No listing views</h4>
                                            <p className="text-gray-500 text-xs">There are no listing views.</p>
                                        </div>
                                    );
                                }
                                const max = Math.max(...rows.map((r) => r.count), 1);
                                return (
                                    <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                                        <div className="space-y-3">
                                            {rows.map((r) => {
                                                const pct = Math.round((r.count / max) * 100);
                                                const dateLabel = (() => {
                                                    try {
                                                        return new Date(r.date).toLocaleDateString(undefined, {
                                                            year: 'numeric', month: 'short', day: '2-digit'
                                                        });
                                                    } catch { return r.date; }
                                                })();
                                                return (
                                                    <div key={r.date} className="grid grid-cols-[140px_1fr_60px] items-center gap-3">
                                                        <span className="text-sm font-medium text-gray-700">{dateLabel}</span>
                                                        <div className="bg-white rounded-full h-3 overflow-hidden shadow-inner">
                                                            <div
                                                                className="bg-[#82D64D] h-full rounded-full transition-all"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-800 text-right">{r.count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Leads sources — grouped by source enum */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Leads sources</h3>
                            {(() => {
                                const rows = stats?.leadsBySource ?? [];
                                if (rows.length === 0) {
                                    return (
                                        <div className="bg-[#F0F0F6] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                                            <div className="bg-[#E3EBDE] p-3 rounded-xl mb-3 shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)]">
                                                <List className="w-6 h-6 text-[#3A6D6C]" />
                                            </div>
                                            <h4 className="text-[#3A6D6C] font-bold mb-1">No leads</h4>
                                            <p className="text-gray-500 text-xs">There are no leads for this listing.</p>
                                        </div>
                                    );
                                }
                                const total = rows.reduce((s, r) => s + r.count, 0) || 1;
                                return (
                                    <div className="bg-[#F0F0F6] rounded-[2rem] p-6">
                                        <div className="space-y-3">
                                            {rows.map((r) => {
                                                const pct = Math.round((r.count / total) * 100);
                                                return (
                                                    <div key={r.source} className="grid grid-cols-[180px_1fr_70px] items-center gap-3">
                                                        <span className="text-sm font-medium text-gray-700">{r.label}</span>
                                                        <div className="bg-white rounded-full h-3 overflow-hidden shadow-inner">
                                                            <div
                                                                className="bg-[#3A6D6C] h-full rounded-full transition-all"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-800 text-right">
                                                            {r.count} <span className="text-gray-500 font-normal">({pct}%)</span>
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}

                <OnlineApplicationModal
                    isOpen={isOnlineApplicationModalOpen}
                    onClose={() => setIsOnlineApplicationModalOpen(false)}
                    onSave={(status, fee) => {
                        setOnlineApplicationStatus(status);
                        setApplicationFee(fee);
                        if (backendListing?.id) {
                            updateListing.mutate(
                                {
                                    id: backendListing.id,
                                    data: {
                                        onlineApplicationAvailable: status === 'Enabled',
                                        applicationFee: fee ? parseFloat(fee) : undefined
                                    }
                                },
                                {
                                    onSuccess: () => {
                                        setIsOnlineApplicationModalOpen(false);
                                    }
                                }
                            );
                        } else {
                            setIsOnlineApplicationModalOpen(false);
                        }
                    }}
                    initialStatus={onlineApplicationStatus}
                    initialFee={applicationFee}
                />

                <InviteToApplyModal
                    isOpen={isInviteToApplyModalOpen}
                    onClose={() => setIsInviteToApplyModalOpen(false)}
                    onSend={() => {
                        setIsInviteToApplyModalOpen(false);
                    }}
                />
                <DeleteConfirmationModal
                    isOpen={isUnlistConfirmationOpen}
                    onClose={() => setIsUnlistConfirmationOpen(false)}
                    onConfirm={handleConfirmUnlist}
                    title="Unlist Property?"
                    message="Are you sure you want to unlist this property? It will be moved back to draft status and won't be visible to applicants."
                    confirmText="Unlist"
                    confirmButtonClass="!bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg font-bold hover:!bg-[#346364] transition-colors shadow-sm"
                    headerClassName="!bg-[var(--color-primary)]"
                />
            </div>
        </div>
    );
};

export default ListingDetail;
