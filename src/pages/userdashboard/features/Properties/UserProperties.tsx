import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Filter, Heart, X } from "lucide-react";
import { Link } from "react-router-dom";
import PropertyFilters from "./components/PropertyFilters";
import type { Property, FilterState } from "../../utils/types";
import { API_ENDPOINTS } from "../../../../config/api.config";
import { authService } from "../../../../services/auth.service";

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
              {property.price || `${property.currency}${property.rent}`}
            </span>
            <span className="text-gray-500 text-[10px]">month</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

import { usePropertyStore } from "./store/propertyStore";

const Properties: React.FC = () => {
  const {
    propertyFilters: filters,
    setPropertyFilters: setFilters,
    isPropertyFiltersOpen,
    setIsPropertyFiltersOpen
  } = usePropertyStore();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usePreferences, setUsePreferences] = useState(true); // Toggle for preferences
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

  // Fetch user preferences on mount (only for authenticated tenants)
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        // First check if user is authenticated and is a tenant
        const user = await authService.getCurrentUser();

        // Only fetch preferences if user is a tenant
        if (user.role !== 'TENANT') {
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
      }
    };

    fetchPreferences();
  }, []);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query params from filters and user preferences
        const params = new URLSearchParams();

        
        const mapPropertyType = (type: string): string | null => {
          if (!type || type === 'All') return null;
         
          if (type === 'SINGLE' || type === 'MULTI') {
            return type;
          }
          return null; // Don't send invalid property types
        };

        // Use preferences only if enabled and no explicit filters are set
        const shouldUsePreferences = usePreferences && userPreferences;

        // Location: Always apply preferences if enabled (location is a hard filter)
        if (shouldUsePreferences && userPreferences?.location) {
          const location = userPreferences.location;
          // Always apply location filters from preferences when enabled
          if (location.country) {
            params.append('country', location.country);
          }
          if (location.state) {
            params.append('state', location.state);
          }
          if (location.city) {
            params.append('city', location.city);
          }
        }

        // Price filters: Use filters if set, otherwise use preferences if enabled
        const minPrice = filters?.minPrice !== undefined && filters.minPrice !== null
          ? filters.minPrice
          : (shouldUsePreferences ? userPreferences?.criteria?.minPrice : undefined);
        const maxPrice = filters?.maxPrice !== undefined && filters.maxPrice !== null
          ? filters.maxPrice
          : (shouldUsePreferences ? userPreferences?.criteria?.maxPrice : undefined);
        
        if (minPrice !== undefined && minPrice !== null) {
          params.append('minPrice', minPrice.toString());
        }
        if (maxPrice !== undefined && maxPrice !== null) {
          params.append('maxPrice', maxPrice.toString());
        }

        // Beds filter: Use filters if set, otherwise use preferences if enabled
        let bedsFilter: string | undefined;
        if (filters?.bedrooms && filters.bedrooms !== 'All' && filters.bedrooms !== 'Any') {
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

        // Pets allowed filter: Use preferences if enabled
        if (shouldUsePreferences && userPreferences?.criteria?.petsAllowed !== undefined) {
          params.append('petsAllowed', userPreferences.criteria.petsAllowed.toString());
        }

        // Property type filter (from filters only, not preferences)
        const propertyType = mapPropertyType(filters?.propertyType || '');
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

          return {
            id: item.id, // Use actual property ID for navigation
            uniqueId: uniqueId, // Use composite ID for React keys
            title: title,
            address: addressString,
            type: item.propertyType === 'SINGLE' ? 'Single Unit' : 'Multi Unit',
            price: `$${price.toLocaleString()}`,
            rent: price,
            currency: '$',
            tag: item.listing?.petsAllowed ? 'Pets Allowed' : null,
            image: item.coverPhotoUrl || (item.photos?.[0]?.photoUrl ?? null),
            images: item.photos?.map((p: any) => p.photoUrl) || [],
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
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err instanceof Error ? err.message : 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [
    filters?.minPrice,
    filters?.maxPrice,
    filters?.propertyType,
    filters?.bedrooms,
    userPreferences,
    usePreferences,
  ]);

  const filteredProperties = useMemo(() => {
    if (!filters) return properties;

    return properties.filter(property => {
      const { search, propertyType, minPrice, maxPrice, bedrooms } = filters;

      // Search filter
      if (search &&
        !property.title.toLowerCase().includes(search.toLowerCase()) &&
        !property.address.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Property Type filter
      if (propertyType && propertyType !== "All" && property.type !== propertyType) {
        return false;
      }

      // Price filter
      const price = property.rent || parseInt((property.price || "").replace(/[$,]/g, ""));
      if (!isNaN(price)) {
        if (minPrice && price < minPrice) return false;
        if (maxPrice && price > maxPrice) return false;
      }

      // Bedrooms filter
      if (bedrooms && bedrooms !== "All" && bedrooms !== "Any") {
        const match = property.title.match(/(\d+)\s*Bedroom/i);
        const propertyBedrooms = match ? parseInt(match[1]) : 0;

        if (bedrooms === "4+") {
          if (propertyBedrooms < 4) return false;
        } else {
          if (propertyBedrooms !== parseInt(bedrooms)) return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

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
        userPreferences={userPreferences}
        initialFilters={filters}
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
            {/* Preferences Toggle and Info */}
            {userPreferences && (
              <div className="flex items-center justify-between p-3 bg-[#F0F9FF] border border-[#8CD74B] rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usePreferences}
                      onChange={(e) => setUsePreferences(e.target.checked)}
                      className="w-4 h-4 text-[#8CD74B] border-gray-300 rounded focus:ring-[#8CD74B]"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Use my preferences
                    </span>
                  </label>
                  {usePreferences && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 ml-4">
                      <span className="font-medium">Active filters:</span>
                      {userPreferences.location?.city && (
                        <span className="px-2 py-1 bg-white rounded">📍 {userPreferences.location.city}</span>
                      )}
                      {userPreferences.criteria?.minPrice && userPreferences.criteria?.maxPrice && (
                        <span className="px-2 py-1 bg-white rounded">
                          💰 ${userPreferences.criteria.minPrice.toLocaleString()} - ${userPreferences.criteria.maxPrice.toLocaleString()}
                        </span>
                      )}
                      {userPreferences.criteria?.beds && userPreferences.criteria.beds !== 'Any' && (
                        <span className="px-2 py-1 bg-white rounded">🛏️ {userPreferences.criteria.beds} beds</span>
                      )}
                      {userPreferences.criteria?.petsAllowed && (
                        <span className="px-2 py-1 bg-white rounded">🐾 Pets allowed</span>
                      )}
                    </div>
                  )}
                </div>
                {usePreferences && (
                  <button
                    onClick={() => setUsePreferences(false)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Disable preferences"
                  >
                    <X size={16} />
                  </button>
                )}
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
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 text-lg">Loading properties...</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropertyCard key={(property as any).uniqueId || property.id} property={property} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                <button
                  onClick={() => setFilters(null)}
                  className="mt-4 text-[var(--dashboard-accent)] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
};

export default Properties;
