/**
 * Unwrap API response that can be either:
 * - Plain array: [{...}, {...}]
 * - Pagination object: { data: [...], pagination: {...} }
 *
 * Returns the array in both cases. Prevents "TypeError: x.map is not a function"
 * when backend returns paginated response but frontend expects array.
 */
export function unwrapArrayResponse<T = any>(data: any, contextLabel?: string): T[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object' && Array.isArray(data.data)) {
    return data.data;
  }

  if (contextLabel) {
    console.warn(`Unexpected ${contextLabel} response format:`, data);
  }

  return [];
}

/**
 * Pass-through for non-array responses. Returns the response as-is,
 * but safely handles null/undefined.
 */
export function unwrapObjectResponse<T = any>(data: any): T | null {
  if (data === null || data === undefined) return null;
  return data as T;
}
