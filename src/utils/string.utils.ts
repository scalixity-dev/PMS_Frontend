/**
 * Converts a string to Title Case (capitalizes the first letter of each word).
 * Example: "AIR_CONDITIONING" -> "Air Conditioning"
 * Example: "washer/dryer" -> "Washer/Dryer"
 */
export const formatAmenityLabel = (amenity: string | null | undefined): string => {
    if (!amenity) return '';

    return amenity
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map(word => {
            if (!word) return '';
            // Handle words like "washer/dryer"
            if (word.includes('/')) {
                return word.split('/').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('/');
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};
