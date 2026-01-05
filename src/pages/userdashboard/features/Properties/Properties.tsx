import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Filter, Heart } from "lucide-react";
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

        // Use filters if available, otherwise fall back to preferences
        // Location: Use preferences if no explicit location filter is set
        const location = userPreferences?.location;
        if (location) {
          if (location.country) params.append('country', location.country);
          if (location.state) params.append('state', location.state);
          if (location.city) params.append('city', location.city);
        }

        // Price filters: Use filters if set, otherwise use preferences
        const minPrice = filters?.minPrice ?? userPreferences?.criteria?.minPrice;
        const maxPrice = filters?.maxPrice ?? userPreferences?.criteria?.maxPrice;
        if (minPrice !== undefined && minPrice !== null) {
          params.append('minPrice', minPrice.toString());
        }
        if (maxPrice !== undefined && maxPrice !== null) {
          params.append('maxPrice', maxPrice.toString());
        }

        // Beds filter: Use filters if set, otherwise use preferences
        const bedsFilter = filters?.bedrooms && filters.bedrooms !== 'All' && filters.bedrooms !== 'Any'
          ? filters.bedrooms === '4+' ? '4' : filters.bedrooms
          : userPreferences?.criteria?.beds;
        if (bedsFilter) {
          params.append('beds', bedsFilter);
        }

        // Baths filter: Use preferences if available
        if (userPreferences?.criteria?.baths) {
          params.append('baths', userPreferences.criteria.baths);
        }

        // Pets allowed filter: Use preferences if available
        if (userPreferences?.criteria?.petsAllowed !== undefined) {
          params.append('petsAllowed', userPreferences.criteria.petsAllowed.toString());
        }

        // Property type filter (from filters only, not preferences)
        if (filters?.propertyType && filters.propertyType !== 'All') {
          params.append('propertyType', filters.propertyType);
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
        const mappedProperties: Property[] = data.map((item: any) => {
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

          return {
            id: item.id,
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

        setProperties(mappedProperties);
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
          <div className="flex justify-between items-center">
            {userPreferences && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Showing properties based on your preferences</span>
                {userPreferences.location && (
                  <span className="ml-2">
                    • {userPreferences.location.city || userPreferences.location.state || userPreferences.location.country || 'Location'}
                  </span>
                )}
                {userPreferences.criteria && (
                  <>
                    {userPreferences.criteria.minPrice && userPreferences.criteria.maxPrice && (
                      <span className="ml-2">
                        • ${userPreferences.criteria.minPrice.toLocaleString()} - ${userPreferences.criteria.maxPrice.toLocaleString()}
                      </span>
                    )}
                    {userPreferences.criteria.beds && (
                      <span className="ml-2">• {userPreferences.criteria.beds} beds</span>
                    )}
                    {userPreferences.criteria.petsAllowed && (
                      <span className="ml-2">• Pets allowed</span>
                    )}
                  </>
                )}
              </div>
            )}
            <button
              onClick={() => setIsPropertyFiltersOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-[#F7F7F7] border-[0.97px] border-white shadow-[0px_3.9px_3.9px_0px_#00000040]"
            >
              <Filter size={18} />
              <span>Filter</span>
            </button>
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
                <PropertyCard key={property.id} property={property} />
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
