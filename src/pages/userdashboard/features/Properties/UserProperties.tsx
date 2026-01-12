import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Filter, Heart, MapPin, DollarSign, BedDouble, PawPrint, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import PropertyFilters from "./components/PropertyFilters";
import type { Property, FilterState } from "../../utils/types";
import { API_ENDPOINTS } from "../../../../config/api.config";
import { authService } from "../../../../services/auth.service";
import { formatMoney } from "../../../../utils/currency.utils";
import { formatAmenityLabel } from "../../../../utils/string.utils";


// --- Internal Components ---

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <Link
      to={`/userdashboard/properties/${property.id}`}
      className="block transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="relative w-full aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden group shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-300">
        {/* Background Image */}
        <img
          src={property.image || (property.images && property.images[0])}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Tag */}
        {(property.tag || property.discount) && (
          <div className="absolute top-3 left-3 bg-[var(--dashboard-accent)] text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-[var(--shadow-sm)]">
            {property.tag || property.discount}
          </div>
        )}

        {/* Info Overlay */}
        <div className="absolute bottom-5 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5 pr-8">
              <h3 className="text-[var(--dashboard-text-main)] text-base font-semibold leading-tight">
                {property.title}
              </h3>
              <p className="text-gray-600 text-[12px] leading-snug">
                {property.address}
              </p>
              <p className="text-gray-500 text-[12px] mt-0.5">
                {property.type}
              </p>
            </div>
            <button
              className="text-gray-600 hover:text-red-500 transition-colors mt-0.5"
              onClick={(e) => {
                e.preventDefault();
                // handle favorite 
              }}
            >
              <Heart size={18} />
            </button>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[var(--dashboard-text-main)] text-base font-semibold">
              {property.price || (property.rent ? formatMoney(property.rent, property.currencyCode || 'USD') : 'N/A')}
            </span>
            <span className="text-gray-500 text-[10px]">month</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

import { usePropertyStore } from "./store/propertyStore";

// Skeleton component for loading state
const PropertySkeleton: React.FC = () => (
  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 animate-pulse">
    <div className="absolute inset-0 bg-gray-300"></div>
    <div className="absolute bottom-5 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-md p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

const ITEMS_PER_PAGE = 12;

const Properties: React.FC = () => {
  const {
    propertyFilters: filters,
    setPropertyFilters: setFilters,
    isPropertyFiltersOpen,
    setIsPropertyFiltersOpen,
    resetPropertyFilters
  } = usePropertyStore();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);

  // Initialize usePreferences from localStorage, defaulting to true only if no stored value exists
  const [usePreferences, setUsePreferences] = useState<boolean>(() => {
    const stored = localStorage.getItem('propertyPreferencesEnabled');
    return stored !== null ? stored === 'true' : true; // Default to true only if no stored value
  });

  const [prefsLoaded, setPrefsLoaded] = useState(false); // Track if preferences have been loaded
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [userPreferences, setUserPreferences] = useState<{
    location?: { country: string; state: string; city: string };
    rentalTypes?: string[];
    criteria?: {
      beds?: string | null;
      baths?: string | null;
      minPrice?: number;
      maxPrice?: number;
      petsAllowed?: boolean;
    };
  } | null>(null);

  // Reset user preferences on unmount to ensure fresh state on return
  useEffect(() => {
    return () => {
      resetPropertyFilters();
    };
  }, [resetPropertyFilters]);

  // Fetch user preferences on mount (only for authenticated tenants)
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        // First check if user is authenticated and is a tenant
        const user = await authService.getCurrentUser();

        // Only fetch preferences if user is a tenant
        if (user.role !== 'TENANT') {
          setPrefsLoaded(true);
          return; // Not a tenant, skip preferences
        }

        const response = await fetch(API_ENDPOINTS.TENANT.GET_PREFERENCES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const preferences = await response.json();
          setUserPreferences(preferences);
        } else if (response.status === 401) {
          // User not authenticated or not a tenant - continue without preferences
          console.log('User not authenticated or not a tenant, skipping preferences');
        } else if (response.status === 404) {
          // Preferences don't exist yet - continue without preferences
          console.log('No preferences found for user');
        }
      } catch (err) {
        // If getCurrentUser fails or preferences fetch fails, continue without preferences
        console.log('Error fetching preferences (continuing without):', err);
        // Continue without preferences - this is expected for non-authenticated users
      } finally {
        setPrefsLoaded(true);
      }
    };

    fetchPreferences();
  }, []);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      if (!prefsLoaded) return;

      setLoading(true);
      setError(null);
      try {
        // Build query params from filters and user preferences
        const params = new URLSearchParams();


        const mapPropertyType = (type: string): string | null => {
          if (!type || type === 'All') return null;

          // Map UI labels to backend values
          if (type === 'Single Unit') return 'SINGLE';
          if (type === 'Multi Unit') return 'MULTI';
          if (type === 'SINGLE' || type === 'MULTI') {
            return type;
          }
          return null; // Don't send invalid property types
        };

        // Use preferences only if enabled and no explicit filters are set
        const shouldUsePreferences = usePreferences && userPreferences;

        // Location: Use filters if user has modified them, otherwise use preferences if enabled
        let country: string | undefined;
        let state: string | undefined;
        let city: string | undefined;

        // Check if locationFilter has any actual values (even if locationModified is false)
        const hasLocationFilterValues = filters.locationFilter &&
          (filters.locationFilter.country || filters.locationFilter.state || filters.locationFilter.city);

        if (filters.locationModified && filters.locationFilter) {
          country = filters.locationFilter.country;
          state = filters.locationFilter.state;
          city = filters.locationFilter.city;
        } else if (hasLocationFilterValues) {
          // Use locationFilter if it has values, even if locationModified is false
          // This prevents silently ignoring location filters that were set
          country = filters.locationFilter?.country;
          state = filters.locationFilter?.state;
          city = filters.locationFilter?.city;
        } else if (shouldUsePreferences && userPreferences?.location) {
          country = userPreferences.location.country;
          state = userPreferences.location.state;
          city = userPreferences.location.city;
        }

        if (country) params.append('country', country);
        if (state) params.append('state', state);
        if (city) params.append('city', city);

        // Price filters: Use filters if user has modified them, otherwise use preferences if enabled
        let minPrice: number | undefined;
        let maxPrice: number | undefined;

        if (filters.priceModified && filters.minPrice !== undefined && filters.minPrice !== null) {
          minPrice = filters.minPrice;
        } else if (shouldUsePreferences && userPreferences?.criteria?.minPrice !== undefined) {
          minPrice = userPreferences.criteria.minPrice;
        }

        if (filters.priceModified && filters.maxPrice !== undefined && filters.maxPrice !== null) {
          maxPrice = filters.maxPrice;
        } else if (shouldUsePreferences && userPreferences?.criteria?.maxPrice !== undefined) {
          maxPrice = userPreferences.criteria.maxPrice;
        }

        if (minPrice !== undefined && minPrice !== null) {
          params.append('minPrice', minPrice.toString());
        }
        if (maxPrice !== undefined && maxPrice !== null) {
          params.append('maxPrice', maxPrice.toString());
        }

        // Beds filter: Use filters if set, otherwise use preferences if enabled
        let bedsFilter: string | undefined;
        if (filters.bedrooms && filters.bedrooms !== 'All' && filters.bedrooms !== 'Any') {
          bedsFilter = filters.bedrooms === '4+' ? '4' : filters.bedrooms;
        } else if (shouldUsePreferences && userPreferences?.criteria?.beds && userPreferences.criteria.beds !== 'Any') {
          bedsFilter = userPreferences.criteria.beds;
        }

        if (bedsFilter) {
          params.append('beds', bedsFilter);
        }

        // Baths filter: Use preferences if enabled
        if (shouldUsePreferences && userPreferences?.criteria?.baths) {
          params.append('baths', userPreferences.criteria.baths);
        }

        // Pets allowed filter: Use filters if set, otherwise use preferences if enabled
        if (filters.petsAllowed !== 'All') {
          params.append('petsAllowed', filters.petsAllowed === 'Yes' ? 'true' : 'false');
        } else if (shouldUsePreferences && userPreferences?.criteria?.petsAllowed !== undefined) {
          params.append('petsAllowed', userPreferences.criteria.petsAllowed.toString());
        }

        // Amenities filter
        if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
          // Map back to potential backend values (Upper Snake Case)
          const backendAmenities = filters.selectedAmenities.map(a => a.toUpperCase().replace(/ /g, '_'));
          params.append('amenities', backendAmenities.join(','));
        }


        // Property type filter (from filters only, not preferences)
        const propertyType = mapPropertyType(filters.propertyType || '');
        if (propertyType) {
          params.append('propertyType', propertyType);
        }

        const url = `${API_ENDPOINTS.PROPERTY.GET_PUBLIC_LISTINGS}${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();

        // Map backend response to Property type
        const mappedProperties: Property[] = data.map((item: any, index: number) => {
          const address = item.address;
          const addressString = address
            ? `${address.streetAddress || ''}, ${address.city || ''}, ${address.stateRegion || ''}, ${address.zipCode || ''}, ${address.country || ''}`
            : '';

          const price = item.listing?.monthlyRent
            ? parseFloat(item.listing.monthlyRent)
            : item.listing?.listingPrice
              ? parseFloat(item.listing.listingPrice)
              : item.marketRent
                ? parseFloat(item.marketRent)
                : 0;

          const beds = item.singleUnitDetail?.beds ?? null;
          const title = item.listing?.title ||
            (beds !== null ? `${beds} Bedroom ${item.propertyType === 'SINGLE' ? 'Property' : 'Unit'}` : item.propertyName);

          // Use listing.id if available, otherwise use property.id with index to ensure uniqueness
          const uniqueId = item.listing?.id ? `${item.id}-${item.listing.id}` : `${item.id}-${index}`;

          // Get currency from backend response, fallback to property country or default
          const currencyInfo = item.currency || (address?.country ? {
            code: address.country === 'India' || address.country === 'IN' ? 'INR' : 'USD',
            symbol: address.country === 'India' || address.country === 'IN' ? '₹' : '$',
            name: address.country === 'India' || address.country === 'IN' ? 'Indian Rupee' : 'US Dollar'
          } : { code: 'USD', symbol: '$', name: 'US Dollar' });

          // Format price with currency
          const formattedPrice = formatMoney(price, currencyInfo.code);

          return {
            id: item.id, // Use actual property ID for navigation
            uniqueId: uniqueId, // Use composite ID for React keys
            title: title,
            address: addressString,
            type: item.propertyType === 'SINGLE' ? 'Single Unit' : 'Multi Unit',
            price: formattedPrice, // Use formatted price with currency
            rent: price,
            currency: currencyInfo.symbol, // Currency symbol
            currencyCode: currencyInfo.code, // Currency code for reference
            tag: item.listing?.petsAllowed ? 'Pets Allowed' : null,
            image: item.coverPhotoUrl || (item.photos?.[0]?.photoUrl ?? null),
            images: item.photos?.map((p: any) => p.photoUrl) || [],
            amenities: [
              ...(item.amenities?.parking && item.amenities.parking !== 'NONE' ? [formatAmenityLabel(item.amenities.parking)] : []),
              ...(item.amenities?.laundry && item.amenities.laundry !== 'NONE' ? [formatAmenityLabel(item.amenities.laundry)] : []),
              ...(item.amenities?.airConditioning && item.amenities.airConditioning !== 'NONE' ? [formatAmenityLabel(item.amenities.airConditioning)] : []),
              ...(item.amenities?.propertyAmenities || []).map((a: string) => formatAmenityLabel(a)),
              ...(item.amenities?.propertyFeatures || []).map((f: string) => formatAmenityLabel(f)),
            ],
          };

        });

        // Deduplicate properties by property ID (keep first occurrence)
        const seen = new Set<string>();
        const deduplicatedProperties = mappedProperties.filter((property) => {
          // Use the actual property ID for deduplication
          const baseId = String(property.id);
          if (seen.has(baseId)) {
            return false; // Skip duplicate
          }
          seen.add(baseId);
          return true;
        });

        setProperties(deduplicatedProperties);

        // Extract unique amenities from all properties
        const amenitiesSet = new Set<string>();
        data.forEach((item: any) => {
          // Add basic amenities if they exist and are not 'NONE'
          if (item.amenities?.parking && item.amenities.parking !== 'NONE') {
            amenitiesSet.add(formatAmenityLabel(item.amenities.parking));
          }
          if (item.amenities?.laundry && item.amenities.laundry !== 'NONE') {
            amenitiesSet.add(formatAmenityLabel(item.amenities.laundry));
          }
          if (item.amenities?.airConditioning && item.amenities.airConditioning !== 'NONE') {
            amenitiesSet.add(formatAmenityLabel(item.amenities.airConditioning));
          }
          // Add property amenities
          if (item.amenities?.propertyAmenities && Array.isArray(item.amenities.propertyAmenities)) {
            item.amenities.propertyAmenities.forEach((amenity: string) => amenitiesSet.add(formatAmenityLabel(amenity)));
          }
          // Add property features
          if (item.amenities?.propertyFeatures && Array.isArray(item.amenities.propertyFeatures)) {
            item.amenities.propertyFeatures.forEach((feature: string) => amenitiesSet.add(formatAmenityLabel(feature)));
          }
        });

        setAvailableAmenities(Array.from(amenitiesSet).sort());

      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err instanceof Error ? err.message : 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [
    filters.minPrice,
    filters.maxPrice,
    filters.priceModified,
    filters.propertyType,
    filters.bedrooms,
    filters.region,
    filters.locationModified, // Add locationModified to dependency array
    filters.locationFilter,
    filters.petsAllowed,
    filters.selectedAmenities,
    userPreferences,
    usePreferences,
    prefsLoaded,
  ]);


  // Client-side filtering - only for search since backend handles other filters
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const { search } = filters;

      // Search filter (client-side only - backend doesn't support text search)
      if (search &&
        !property.title.toLowerCase().includes(search.toLowerCase()) &&
        !property.address.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // All other filters (propertyType, price, bedrooms) are handled by the backend API

      // Amenities filter (client-side)
      if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
        // Property must have ALL selected amenities
        const hasAllAmenities = filters.selectedAmenities.every(amenity =>
          property.amenities?.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });

  }, [properties, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, endIndex);
  }, [filteredProperties, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.propertyType, filters.minPrice, filters.maxPrice, filters.bedrooms, filters.petsAllowed, filters.locationFilter, usePreferences]);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Memoize the onApply callback to prevent unnecessary re-renders
  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, [setFilters]);

  return (
    <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden flex flex-col">
      <PropertyFilters
        isOpen={isPropertyFiltersOpen}
        onClose={() => setIsPropertyFiltersOpen(false)}
        onApply={handleApplyFilters}
        onReset={resetPropertyFilters}
        userPreferences={usePreferences ? userPreferences : null}
        initialFilters={filters}
        availableAmenities={availableAmenities}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-base font-medium">
              <li>
                <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
              </li>
              <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
              <li className="text-[#1A1A1A]  font-medium" aria-current="page">Properties</li>
            </ol>
          </nav>
          <div className="flex flex-col gap-3">
            {/* My Preferences Section */}
            {userPreferences && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Left Side - Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer group flex-shrink-0">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={usePreferences}
                          onChange={(e) => {
                            const newValue = e.target.checked;
                            setUsePreferences(newValue);
                            // Persist user's choice to localStorage
                            localStorage.setItem('propertyPreferencesEnabled', String(newValue));
                            resetPropertyFilters();
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#8CD74B] transition-colors duration-300"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-gray-900">
                          My Preferences
                        </span>
                        <span className="text-xs text-gray-500">
                          {usePreferences ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </label>

                    {/* Right Side - Active Filters */}
                    {usePreferences && (
                      <div className="flex items-center gap-4 flex-1 min-w-0 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs font-medium text-gray-500 flex-shrink-0">
                            Active:
                          </span>
                          {/* Show Preference City if active and not modified, OR Show Modified City if modified */}
                          {(!filters.locationModified ? userPreferences.location?.city : filters.locationFilter?.city) && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#8CD74B]/10 to-[#8CD74B]/5 border border-[#8CD74B]/20 rounded-md text-sm text-gray-700 font-medium shadow-sm">
                              <MapPin size={14} className="text-[#8CD74B]" strokeWidth={2.5} />
                              <span>
                                {!filters.locationModified ? userPreferences.location?.city : filters.locationFilter?.city}
                              </span>
                            </div>
                          )}
                          {userPreferences.criteria?.minPrice !== undefined && userPreferences.criteria?.maxPrice !== undefined && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#8CD74B]/10 to-[#8CD74B]/5 border border-[#8CD74B]/20 rounded-md text-sm text-gray-700 font-medium shadow-sm">
                              <DollarSign size={14} className="text-[#8CD74B]" strokeWidth={2.5} />
                              <span>
                                {userPreferences.criteria.minPrice.toLocaleString()}-{userPreferences.criteria.maxPrice.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {userPreferences.criteria?.beds && userPreferences.criteria.beds !== 'Any' && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#8CD74B]/10 to-[#8CD74B]/5 border border-[#8CD74B]/20 rounded-md text-sm text-gray-700 font-medium shadow-sm">
                              <BedDouble size={14} className="text-[#8CD74B]" strokeWidth={2.5} />
                              <span>{userPreferences.criteria.beds} beds</span>
                            </div>
                          )}
                          {userPreferences.criteria?.petsAllowed && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#8CD74B]/10 to-[#8CD74B]/5 border border-[#8CD74B]/20 rounded-md text-sm text-gray-700 font-medium shadow-sm">
                              <PawPrint size={14} className="text-[#8CD74B]" strokeWidth={2.5} />
                              <span>Pets OK</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Filter Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsPropertyFiltersOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-[#F7F7F7] border-[0.97px] border-white shadow-[0px_3.9px_3.9px_0px_#00000040]"
              >
                <Filter size={18} />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-[var(--dashboard-accent)] font-medium hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProperties.length > 0 ? (
                paginatedProperties.map((property) => (
                  <PropertyCard key={(property as any).uniqueId || property.id} property={property} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                  <button
                    onClick={resetPropertyFilters}
                    className="mt-4 text-[var(--dashboard-accent)] font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredProperties.length > ITEMS_PER_PAGE && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full transition-colors ${currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-all ${currentPage === page
                      ? 'bg-[#3A7D76] text-white shadow-lg'
                      : 'bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full transition-colors ${currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div >
  );
};

export default Properties;
