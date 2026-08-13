import type { Libraries } from '@react-google-maps/api';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// @react-google-maps/api's loader is a page-wide singleton keyed by script id.
// Every useJsApiLoader call across the app must pass this same libraries array,
// otherwise it throws "Loader must not be called again with different options".
export const GOOGLE_MAPS_LIBRARIES: Libraries = ['places'];
