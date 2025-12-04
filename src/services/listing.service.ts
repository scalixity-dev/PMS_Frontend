import { API_ENDPOINTS } from '../config/api.config';

export interface BackendListing {
  id: string;
  propertyId: string;
  unitId?: string | null;
  listingType: 'ENTIRE_PROPERTY' | 'UNIT';
  listingStatus: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'ARCHIVED' | 'REMOVED';
  occupancyStatus: 'VACANT' | 'OCCUPIED' | 'PARTIALLY_OCCUPIED';
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  listingPrice?: number | null;
  monthlyRent?: number | null;
  securityDeposit?: number | null;
  amountRefundable?: number | null;
  minLeaseDuration?: string | null;
  maxLeaseDuration?: string | null;
  availableFrom?: string | null;
  expiresAt?: string | null;
  listedAt: string;
  archivedAt?: string | null;
  updatedAt: string;
  createdAt: string;
  isActive: boolean;
  petsAllowed: boolean;
  petCategory: string[];
  applicationFee?: number | null;
  onlineApplicationAvailable: boolean;
  externalListingUrl?: string | null;
  source?: string | null;
  title?: string | null;
  description?: string | null;
  property?: {
    id: string;
    propertyName: string;
    propertyType: 'SINGLE' | 'MULTI';
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | null;
    marketRent?: string | number | null;
    sizeSqft?: string | number | null;
    yearBuilt?: number | null;
    description?: string | null;
    coverPhotoUrl?: string | null;
    youtubeUrl?: string | null;
    listingContactName?: string | null;
    listingPhoneCountryCode?: string | null;
    listingPhoneNumber?: string | null;
    listingEmail?: string | null;
    address?: {
      streetAddress: string;
      city: string;
      stateRegion: string;
      zipCode: string;
      country: string;
    } | null;
    amenities?: {
      parking: 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED';
      laundry: 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS';
      airConditioning: 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER';
      propertyFeatures?: string[];
      propertyAmenities?: string[];
    } | null;
    photos?: Array<{
      id: string;
      photoUrl: string;
      isPrimary: boolean;
    }>;
    singleUnitDetails?: {
      beds: number;
      baths?: string | number | null;
    } | null;
    leasing?: {
      description?: string | null;
    } | null;
  };
  unit?: any;
}

export interface CreateListingDto {
  propertyId: string;
  unitId?: string;
  listingType?: 'ENTIRE_PROPERTY' | 'UNIT';
  listingStatus?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'ARCHIVED' | 'REMOVED';
  occupancyStatus?: 'VACANT' | 'OCCUPIED' | 'PARTIALLY_OCCUPIED';
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  listingPrice?: number;
  monthlyRent?: number;
  securityDeposit?: number;
  amountRefundable?: number;
  minLeaseDuration?: string;
  maxLeaseDuration?: string;
  availableFrom?: string;
  expiresAt?: string;
  isActive?: boolean;
  petsAllowed?: boolean;
  petCategory?: string[];
  applicationFee?: number;
  onlineApplicationAvailable?: boolean;
  externalListingUrl?: string;
  source?: string;
  title?: string;
  description?: string;
}

class ListingService {
  /**
   * Create a new listing
   */
  async create(listingData: CreateListingDto): Promise<BackendListing> {
    const response = await fetch(API_ENDPOINTS.LISTING.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create listing';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to create listing: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get all listings
   */
  async getAll(): Promise<BackendListing[]> {
    const response = await fetch(API_ENDPOINTS.LISTING.GET_ALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch listings';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch listings: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get a single listing by ID
   */
  async getOne(id: string): Promise<BackendListing> {
    const response = await fetch(API_ENDPOINTS.LISTING.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch listing';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch listing: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get listings by property ID
   */
  async getByPropertyId(propertyId: string): Promise<BackendListing[]> {
    const response = await fetch(API_ENDPOINTS.LISTING.GET_BY_PROPERTY(propertyId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch listings for property';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch listings: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const listingService = new ListingService();

