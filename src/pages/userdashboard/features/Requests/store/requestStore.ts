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
const saveRequests = (requests: ServiceRequest[]) => {
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
                // Convert File objects to data URLs (synchronous fallback - stores file names)
                req.attachments.forEach((file) => {
                    if (file instanceof File) {
                        // Store file metadata - actual conversion happens in useNewRequestForm
                        attachmentUrls.push(file.name);
                    } else if (typeof file === 'string') {
                        attachmentUrls.push(file);
                    }
                });
            }

            let videoUrl: string | null = null;
            if (requestWithDataUrls.videoDataUrl) {
                videoUrl = requestWithDataUrls.videoDataUrl;
            } else if (req.video instanceof File) {
                videoUrl = req.video.name;
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableRequests));
    } catch (error) {
        console.error('Error saving requests to localStorage:', error);
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
            saveRequests(updatedRequests);
            return { requests: updatedRequests };
        }),
    updateRequestStatus: (id, status) =>
        set((state) => {
            const updatedRequests = state.requests.map((req) =>
                req.id === id ? { ...req, status } : req
            );
            saveRequests(updatedRequests);
            return { requests: updatedRequests };
        }),
}));
