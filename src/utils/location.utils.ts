/**
 * Location utilities for GPS-based currency detection
 */

export interface LocationInfo {
  country: string;
  countryCode: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Get user's location using browser Geolocation API
 * @returns Promise with location information
 */
export const getUserLocation = (): Promise<LocationInfo> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get country from coordinates
          // Using a free service - OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'PropertyManagementSystem/1.0', // Required by Nominatim
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to reverse geocode location');
          }

          const data = await response.json();
          const address = data.address || {};

          resolve({
            country: address.country || 'Unknown',
            countryCode: address.country_code?.toUpperCase() || 'US',
            city: address.city || address.town || address.village,
            state: address.state || address.region,
            latitude,
            longitude,
          });
        } catch (error) {
          // If reverse geocoding fails, return coordinates only
          // The backend can handle currency detection based on coordinates if needed
          reject(error);
        }
      },
      (error) => {
        reject(error);
      },
      {
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
        enableHighAccuracy: false, // Faster, less accurate
      }
    );
  });
};

/**
 * Get user's country from browser timezone (fallback method)
 * This is less accurate but doesn't require user permission
 * @returns Country code based on timezone
 */
export const getCountryFromTimezone = (): string => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Map common timezones to country codes
  const timezoneToCountry: Record<string, string> = {
    'Asia/Kolkata': 'IN',
    'Asia/Calcutta': 'IN',
    'America/New_York': 'US',
    'America/Chicago': 'US',
    'America/Denver': 'US',
    'America/Los_Angeles': 'US',
    'America/Phoenix': 'US',
    'America/Anchorage': 'US',
    'America/Toronto': 'CA',
    'America/Vancouver': 'CA',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Europe/Rome': 'IT',
    'Europe/Madrid': 'ES',
    'Europe/Amsterdam': 'NL',
    'Europe/Brussels': 'BE',
    'Europe/Vienna': 'AT',
    'Europe/Lisbon': 'PT',
    'Europe/Dublin': 'IE',
    'Europe/Helsinki': 'FI',
    'Europe/Athens': 'GR',
    'Asia/Tokyo': 'JP',
    'Asia/Shanghai': 'CN',
    'Asia/Seoul': 'KR',
    'Asia/Singapore': 'SG',
    'Asia/Hong_Kong': 'HK',
    'Asia/Kuala_Lumpur': 'MY',
    'Asia/Bangkok': 'TH',
    'Asia/Jakarta': 'ID',
    'Asia/Manila': 'PH',
    'Asia/Ho_Chi_Minh': 'VN',
    'Asia/Dhaka': 'BD',
    'Asia/Karachi': 'PK',
    'Asia/Colombo': 'LK',
    'Asia/Dubai': 'AE',
    'Asia/Riyadh': 'SA',
    'Africa/Cairo': 'EG',
    'Africa/Johannesburg': 'ZA',
    'Africa/Lagos': 'NG',
    'Africa/Nairobi': 'KE',
    'America/Sao_Paulo': 'BR',
    'America/Mexico_City': 'MX',
    'America/Buenos_Aires': 'AR',
    'Europe/Zurich': 'CH',
    'Europe/Stockholm': 'SE',
    'Europe/Oslo': 'NO',
    'Europe/Copenhagen': 'DK',
    'Europe/Warsaw': 'PL',
    'Europe/Moscow': 'RU',
    'Europe/Istanbul': 'TR',
    'Asia/Jerusalem': 'IL',
    'Pacific/Auckland': 'NZ',
    'Australia/Sydney': 'AU',
    'Australia/Melbourne': 'AU',
  };

  return timezoneToCountry[timezone] || 'US'; // Default to US
};

/**
 * Get user's country using multiple fallback methods
 * 1. Try GPS location (requires permission)
 * 2. Fallback to timezone-based detection
 * 3. Default to US
 */
export const getUserCountry = async (): Promise<string> => {
  try {
    const location = await getUserLocation();
    return location.countryCode;
  } catch (error) {
    // If GPS fails, try timezone-based detection
    console.log('GPS location not available, using timezone fallback');
    return getCountryFromTimezone();
  }
};
