import React, { useEffect, useRef, useState, useCallback } from 'react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onAddressSelect?: (addressData: {
    streetAddress: string;
    city: string;
    stateRegion: string;
    zipCode: string;
    country: string;
  }) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

// Geoapify API response types
interface GeoapifyFeature {
  properties: {
    formatted: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    municipality?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    state_code?: string;
    region?: string;
    province?: string;
    postcode?: string;
    postal_code?: string;
    country_code?: string;
    country?: string;
    housenumber?: string;
    street?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface GeoapifyResponse {
  features: GeoapifyFeature[];
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onAddressSelect,
  placeholder = 'Enter address',
  className = '',
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Geoapify API key - can be moved to env variable
  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  if (!API_KEY) {
    console.error('VITE_GEOAPIFY_API_KEY is not configured');
  }

  // Fetch autocomplete suggestions from Geoapify
  const fetchSuggestions = useCallback(async (text: string) => {
    if (!text || text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${API_KEY}&limit=5&lang=en`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address suggestions');
      }

      const data: GeoapifyResponse = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, [API_KEY]);

  // Debounced input handler
  const handleInputChange = useCallback((text: string) => {
    onChange(text);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debouncing
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 300); // 300ms debounce
  }, [onChange, fetchSuggestions]);

  // Fetch detailed address information using reverse geocoding
  const fetchAddressDetails = useCallback(async (lon: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}&format=geojson&limit=1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address details');
      }

      const data: GeoapifyResponse = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching address details:', error);
      return null;
    }
  }, [API_KEY]);

  // Handle address selection
  const handleSelectAddress = useCallback(async (feature: GeoapifyFeature) => {
    const props = feature.properties;
    const formattedAddress = props.formatted || '';
    
    // Update input value immediately
    onChange(formattedAddress);

    // Hide suggestions
    setShowSuggestions(false);
    setSuggestions([]);

    // Try to get detailed address information using coordinates
    let detailedFeature = feature;
    if (feature.geometry?.coordinates) {
      const [lon, lat] = feature.geometry.coordinates;
      const detailed = await fetchAddressDetails(lon, lat);
      if (detailed) {
        detailedFeature = detailed;
      }
    }

    // Parse address components from detailed feature
    const detailedProps = detailedFeature.properties;
    
    // Extract street address
    const streetAddress = [
      detailedProps.housenumber,
      detailedProps.street,
      detailedProps.address_line1
    ]
      .filter(Boolean)
      .join(' ')
      .trim() || detailedProps.address_line1 || formattedAddress;
    
    // Extract city - try multiple possible fields
    const city = detailedProps.city || 
                 detailedProps.municipality || 
                 detailedProps.town || 
                 detailedProps.village || 
                 detailedProps.county || 
                 '';
    
    // Extract state/region - try multiple possible fields
    const stateRegion = detailedProps.state || 
                       detailedProps.state_code || 
                       detailedProps.region || 
                       detailedProps.province || 
                       '';
    
    // Extract postal code
    const zipCode = detailedProps.postcode || 
                   detailedProps.postal_code || 
                   '';
    
    // Extract country
    const country = detailedProps.country_code?.toUpperCase() || 
                   detailedProps.country || 
                   '';

    // Log for debugging
    console.log('Address details:', {
      streetAddress,
      city,
      stateRegion,
      zipCode,
      country,
      rawProps: detailedProps
    });

    // Call callback with parsed address data
    if (onAddressSelect) {
      onAddressSelect({
        streetAddress,
        city,
        stateRegion,
        zipCode,
        country,
      });
    }
  }, [onChange, onAddressSelect, fetchAddressDetails]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        className={className}
        required={required}
        autoComplete="off"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((feature, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectAddress(feature)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 focus:outline-none focus:bg-gray-50"
            >
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {feature.properties.formatted}
                  </p>
                  {feature.properties.address_line2 && (
                    <p className="text-xs text-gray-500 truncate">
                      {feature.properties.address_line2}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && suggestions.length === 0 && value.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">No addresses found</p>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
