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

export interface ListingDashboardCard {
  id: string;
  propertyId: string;
  name: string;
  address: string;
  country: string | null;
  price: number | null;
  status: 'listed' | 'unlisted';
  daysListed: number | null;
  isSyndicated: boolean;
  bedrooms: number;
  bathrooms: number;
  image: string;
  listingId: string | null;
}

export interface ListingDashboardQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  maxBaths?: number;
}

export interface ListingDashboardResponse {
  data: ListingDashboardCard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export interface ListingStatistics {
  daysListed: number;
  messagesSent: number;
  toursRequested: number;
  addedToFavorite: number;
  applicationsNew: number;
  leads: number;
  premiumLeads: number;
  listingViews: number;
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
   * Get the listing dashboard view (paginated cards for the Listings page)
   */
  async getDashboardView(query: ListingDashboardQuery = {}): Promise<ListingDashboardResponse> {
    const params = new URLSearchParams();
    if (query.page != null) params.set('page', String(query.page));
    if (query.limit != null) params.set('limit', String(query.limit));
    if (query.search) params.set('search', query.search);
    if (query.status) params.set('status', query.status);
    if (query.minBeds != null) params.set('minBeds', String(query.minBeds));
    if (query.maxBeds != null) params.set('maxBeds', String(query.maxBeds));
    if (query.minBaths != null) params.set('minBaths', String(query.minBaths));
    if (query.maxBaths != null) params.set('maxBaths', String(query.maxBaths));

    const qs = params.toString();
    const url = `${API_ENDPOINTS.LISTING.DASHBOARD_VIEW}${qs ? `?${qs}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch listing dashboard';
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
        errorMessage = `Failed to fetch listing dashboard: ${response.statusText}`;
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

    const data = await response.json();

    // Handle both array response and pagination response
    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return data.data;
    }

    // Fallback: return empty array if response is unexpected
    console.warn('Unexpected listing response format:', data);
    return [];
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
   * Update a listing
   */
  async update(id: string, data: Partial<CreateListingDto>): Promise<BackendListing> {
    const response = await fetch(API_ENDPOINTS.LISTING.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update listing';
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
        errorMessage = `Failed to update listing: ${response.statusText}`;
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
  /**
   * Get statistics for a listing
   */
  async getStatistics(id: string): Promise<ListingStatistics> {
    const response = await fetch(API_ENDPOINTS.LISTING.GET_STATISTICS(id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch listing statistics';
      try {
        const errorData = await response.json();
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join('. ')
          : errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `Failed to fetch listing statistics: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Toggle favorite on a listing. Returns { favorited: boolean }
   */
  async toggleFavorite(listingId: string): Promise<{ favorited: boolean }> {
    const response = await fetch(API_ENDPOINTS.LISTING.TOGGLE_FAVORITE(listingId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(`Failed to toggle favorite: ${response.statusText}`);
    return response.json();
  }

  /**
   * Check if current user has favorited this listing
   */
  async isFavorited(listingId: string): Promise<{ favorited: boolean }> {
    const response = await fetch(API_ENDPOINTS.LISTING.IS_FAVORITED(listingId), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(`Failed to check favorite: ${response.statusText}`);
    return response.json();
  }

  /**
   * Get all listings favorited by current user
   */
  async getMyFavorites(): Promise<any[]> {
    const response = await fetch(API_ENDPOINTS.LISTING.MY_FAVORITES, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(`Failed to fetch favorites: ${response.statusText}`);
    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
    return [];
  }
}

export const listingService = new ListingService();

