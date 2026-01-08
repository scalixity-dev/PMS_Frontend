import { create } from 'zustand';
import type { RequestFilters, ServiceRequest } from '../../../utils/types';
import { mockRequests } from "../../../utils/mockData";

interface RequestState {
    requests: ServiceRequest[];
    requestFilters: RequestFilters;
    setRequestFilters: (filters: Partial<RequestFilters>) => void;
    resetRequestFilters: () => void;
    addRequest: (request: ServiceRequest) => void;
    updateRequestStatus: (id: number, status: ServiceRequest["status"]) => void;
}

const STORAGE_KEY = 'pms_user_requests';

// Load requests from localStorage or use mock data
const loadRequests = (): ServiceRequest[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Ensure we have valid data
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Convert serialized requests back to ServiceRequest format
                // Data URLs are stored as strings in attachments/video fields
                return parsed.map((req: SerializedServiceRequest) => ({
                    ...req,
                    // Keep data URLs as strings - RequestDetails will handle display
                    attachments: (req.attachmentDataUrls || req.attachments || []) as (File | string)[],
                    video: (req.videoDataUrl || req.video || null) as File | string | null,
                })) as unknown as ServiceRequest[];
            }
        }
    } catch (error) {
        console.error('Error loading requests from localStorage:', error);
    }
    // Return mockRequests as fallback
    return mockRequests as ServiceRequest[];
};

// Extended type for serialized requests (with data URLs instead of Files)
interface SerializedServiceRequest extends Omit<ServiceRequest, 'attachments' | 'video'> {
    attachments?: string[]; // Data URLs
    video?: string | null; // Data URL
    attachmentDataUrls?: string[]; // Data URLs from form submission
    videoDataUrl?: string | null; // Data URL from form submission
}

// Save requests to localStorage
const saveRequests = (requests: ServiceRequest[]): boolean => {
    try {
        // Convert File objects to data URLs for persistence
        const serializableRequests: SerializedServiceRequest[] = requests.map((req) => {
            const attachmentUrls: string[] = [];

            // Check if we have pre-converted data URLs (from form submission)
            const requestWithDataUrls = req as ServiceRequest & { attachmentDataUrls?: string[]; videoDataUrl?: string | null };

            if (requestWithDataUrls.attachmentDataUrls && requestWithDataUrls.attachmentDataUrls.length > 0) {
                // Use pre-converted data URLs
                attachmentUrls.push(...requestWithDataUrls.attachmentDataUrls);
            } else if (req.attachments && req.attachments.length > 0) {
                // Handle existing attachments (strings/data URLs from loaded requests)
                req.attachments.forEach((file) => {
                    if (typeof file === 'string') {
                        // Already a data URL or filename from previous storage
                        attachmentUrls.push(file);
                    } else if (file instanceof File) {
                        // File objects should have been converted before reaching the store
                        // This is a fallback that should not normally execute
                        console.warn('File object reached store without conversion. This may result in data loss:', file.name);
                        // Store filename as placeholder to avoid complete data loss
                        attachmentUrls.push(`[Unsaved File] ${file.name}`);
                    }
                });
            }

            let videoUrl: string | null = null;
            if (requestWithDataUrls.videoDataUrl) {
                videoUrl = requestWithDataUrls.videoDataUrl;
            } else if (req.video instanceof File) {
                // File objects should have been converted before reaching the store
                console.warn('Video File object reached store without conversion. This may result in data loss:', req.video.name);
                videoUrl = `[Unsaved Video] ${req.video.name}`;
            } else if (typeof req.video === 'string') {
                videoUrl = req.video;
            }

            return {
                ...req,
                attachments: attachmentUrls,
                video: videoUrl,
                attachmentDataUrls: requestWithDataUrls.attachmentDataUrls,
                videoDataUrl: requestWithDataUrls.videoDataUrl,
            };
        });

        const serializedData = JSON.stringify(serializableRequests);
        localStorage.setItem(STORAGE_KEY, serializedData);
        return true;
    } catch (error) {
        // Handle QuotaExceededError specifically
        if (error instanceof DOMException && (
            error.name === 'QuotaExceededError' ||
            error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        )) {
            console.error('localStorage quota exceeded. Unable to save requests with attachments.');

            // Attempt to save without attachments/videos as fallback
            try {
                const requestsWithoutMedia: SerializedServiceRequest[] = requests.map((req) => ({
                    ...req,
                    attachments: [],
                    video: null,
                    attachmentDataUrls: undefined,
                    videoDataUrl: null,
                }));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(requestsWithoutMedia));
                console.warn('Saved requests without media files due to storage quota limits.');

                // Notify user through a custom event that can be caught by components
                window.dispatchEvent(new CustomEvent('storage-quota-exceeded', {
                    detail: {
                        message: 'Storage quota exceeded. Your request was saved but attachments and videos could not be stored locally. Please reduce file sizes or clear browser storage.'
                    }
                }));
                return false;
            } catch (fallbackError) {
                console.error('Failed to save even without media:', fallbackError);
                return false;
            }
        }

        console.error('Error saving requests to localStorage:', error);
        return false;
    }
};

export const useRequestStore = create<RequestState>((set) => ({
    requestFilters: {
        search: "",
        status: null,
        priority: null,
        category: null,
    },
    requests: loadRequests(),
    setRequestFilters: (filters) =>
        set((state) => ({
            requestFilters: { ...state.requestFilters, ...filters }
        })),
    resetRequestFilters: () =>
        set({
            requestFilters: {
                search: "",
                status: null,
                priority: null,
                category: null,
            }
        }),
    addRequest: (request) =>
        set((state) => {
            const updatedRequests = [request, ...state.requests];
            const saved = saveRequests(updatedRequests);

            if (!saved) {
                console.warn('Request added to state but failed to persist to localStorage');
            }

            return { requests: updatedRequests };
        }),
    updateRequestStatus: (id, status) =>
        set((state) => {
            const updatedRequests = state.requests.map((req) =>
                req.id === id ? { ...req, status } : req
            );
            const saved = saveRequests(updatedRequests);

            if (!saved) {
                console.warn('Request status updated in state but failed to persist to localStorage');
            }

            return { requests: updatedRequests };
        }),
}));
