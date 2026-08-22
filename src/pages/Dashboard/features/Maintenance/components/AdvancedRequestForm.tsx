import React, { useState, useEffect, useRef } from 'react';
import CustomDropdown from '../../../components/CustomDropdown';
import { Upload, Video, X } from 'lucide-react';
import { useMaintenanceRequestFormStore, type MaintenanceExistingMedia } from '../store/maintenanceRequestStore';

export interface AdvancedRequestFormFields {
    category: string;
    subCategory: string;
    issue: string;
    subIssue: string;
    title: string;
    details: string;
    amount: string;
}

export interface AdvancedRequestFormData extends AdvancedRequestFormFields {
    files: File[];
}

interface AdvancedRequestFormProps {
    onNext: (data: AdvancedRequestFormData) => void;
    onDiscard: () => void;
    initialData?: Partial<AdvancedRequestFormFields> & { files?: File[]; existingMedia?: MaintenanceExistingMedia[] };
    aiPrefillData?: Partial<AdvancedRequestFormFields>;
}

interface MediaFile {
    id: string;
    file: File;
    previewUrl: string;
}

/**
 * Ids only have to be unique within this one list. crypto.randomUUID() is
 * undefined outside a secure context - testing the dev server over plain http
 * on a LAN address threw here, and the picked file never reached state, so no
 * preview ever appeared.
 */
const createMediaId = () => `media-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Matches the "Add images and videos (15 sec) of the problem" prompt on the
// upload card — without this check, nothing stopped a landlord from
// attaching an arbitrarily long recording (seen in practice: 6+ minutes).
const MAX_VIDEO_DURATION_SECONDS = 15;

const getVideoDurationSeconds = (file: File): Promise<number> =>
    new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.onerror = () => {
            URL.revokeObjectURL(video.src);
            reject(new Error('Could not read video metadata'));
        };
        video.src = URL.createObjectURL(file);
    });

/** Only images and videos open in the viewer; documents have nothing to show. */
const isPreviewable = (file: File) => file.type.startsWith('image/') || file.type.startsWith('video/');

const AdvancedRequestForm: React.FC<AdvancedRequestFormProps> = ({ onNext, onDiscard, initialData, aiPrefillData }) => {
    const [errors, setErrors] = useState<Partial<Record<keyof AdvancedRequestFormFields, string>>>({});
    const [videoError, setVideoError] = useState('');

    const [formData, setFormData] = useState<AdvancedRequestFormFields>({
        category: initialData?.category || '',
        subCategory: initialData?.subCategory || '',
        issue: initialData?.issue || '',
        subIssue: initialData?.subIssue || '',
        title: initialData?.title || '',
        details: initialData?.details || '',
        amount: initialData?.amount || '',
    });

    // Initialize mediaFiles from store-persisted files (so they survive step navigation)
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(() => {
        if (initialData?.files && Array.isArray((initialData as any).files)) {
            return ((initialData as any).files as File[]).map((file, idx) => ({
                id: `restored-${idx}-${Date.now()}`,
                file,
                previewUrl: URL.createObjectURL(file),
            }));
        }
        return [];
    });
    // Tile clicked open in the full-screen viewer below
    const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
    // const [showAIChat, setShowAIChat] = useState(false); // Removed local state

    const setAdvanced = useMaintenanceRequestFormStore((state) => state.setAdvanced);

    // Track if user has edited the form to avoid clobbering their changes
    const formTouchedRef = useRef(false);

    // Update form when initialData arrives or changes, but only if user hasn't edited yet
    useEffect(() => {
        if (initialData && !formTouchedRef.current) {
            setFormData({
                category: initialData.category || '',
                subCategory: initialData.subCategory || '',
                issue: initialData.issue || '',
                subIssue: initialData.subIssue || '',
                title: initialData.title || '',
                details: initialData.details || '',
                amount: initialData.amount || '',
            });
        }
    }, [initialData]);

    /**
     * Object URLs are revoked when their file is removed (see handleRemoveFile),
     * never on unmount.
     *
     * An unmount cleanup used to revoke them, which broke every preview: the
     * files outlive this component in the form store, and StrictMode simulates
     * an unmount right after mount in dev. Stepping to "Property & Tenants" and
     * back re-created the previews from the store, then the simulated unmount
     * revoked those brand-new URLs, leaving blank tiles.
     */

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        if (file.type.startsWith('video/')) {
            setVideoError('');
            try {
                const duration = await getVideoDurationSeconds(file);
                if (duration > MAX_VIDEO_DURATION_SECONDS) {
                    setVideoError(
                        `Video must be ${MAX_VIDEO_DURATION_SECONDS} seconds or shorter (this one is ${Math.round(duration)}s). Please trim it and try again.`,
                    );
                    return;
                }
            } catch {
                // Can't read metadata (unsupported format, browser quirk) — let it
                // through rather than blocking a valid upload over that.
            }
        }

        const newMediaFile: MediaFile = {
            id: createMediaId(),
            file,
            previewUrl: URL.createObjectURL(file)
        };
        setMediaFiles(prev => [...prev, newMediaFile]);
    };

    const handleRemoveFile = (id: string) => {
        // Close the viewer first if it is showing the file being deleted - its
        // object URL is about to be revoked.
        setSelectedMedia(prev => (prev?.id === id ? null : prev));
        setMediaFiles(prev => {
            const fileToRemove = prev.find(f => f.id === id);
            if (fileToRemove) {
                URL.revokeObjectURL(fileToRemove.previewUrl);
            }
            return prev.filter(f => f.id !== id);
        });
    };

    // Category to SubCategories mapping
    const categorySubCategories: Record<string, Array<{ value: string; label: string }>> = {
        appliances: [
            { value: 'refrigerator', label: 'Refrigerator' },
            { value: 'dishwasher', label: 'Dishwasher' },
            { value: 'oven', label: 'Oven' },
            { value: 'washer', label: 'Washer' },
            { value: 'dryer', label: 'Dryer' }
        ],
        electrical: [
            { value: 'outlet', label: 'Outlet' },
            { value: 'lighting', label: 'Lighting' },
            { value: 'circuit_breaker', label: 'Circuit Breaker' },
            { value: 'wiring', label: 'Wiring' }
        ],
        plumbing: [
            { value: 'sink', label: 'Sink' },
            { value: 'toilet', label: 'Toilet' },
            { value: 'shower', label: 'Shower' },
            { value: 'pipes', label: 'Pipes' }
        ],
        other: [
            { value: 'general', label: 'General' }
        ]
    };

    // SubCategory to Issues mapping
    const subCategoryIssues: Record<string, Array<{ value: string; label: string }>> = {
        refrigerator: [
            { value: 'not_cooling', label: 'Not Cooling' },
            { value: 'leaking', label: 'Leaking' },
            { value: 'noise', label: 'Strange Noise' },
            { value: 'ice_maker', label: 'Ice Maker Issue' }
        ],
        dishwasher: [
            { value: 'not_cleaning', label: 'Not Cleaning' },
            { value: 'leaking', label: 'Leaking' },
            { value: 'not_draining', label: 'Not Draining' }
        ],
        washer: [
            { value: 'not_spinning', label: 'Not Spinning' },
            { value: 'leaking', label: 'Leaking' },
            { value: 'not_draining', label: 'Not Draining' },
            { value: 'not_filling', label: 'Not Filling with Water' },
            { value: 'noise', label: 'Strange Noise' },
            { value: 'wont_start', label: 'Won\'t Start' }
        ],
        dryer: [
            { value: 'not_heating', label: 'Not Heating' },
            { value: 'not_spinning', label: 'Not Spinning' },
            { value: 'noise', label: 'Strange Noise' },
            { value: 'wont_start', label: 'Won\'t Start' },
            { value: 'overheating', label: 'Overheating' },
            { value: 'door_issue', label: 'Door Won\'t Stay Closed' }
        ],
        oven: [
            { value: 'not_heating', label: 'Not Heating' },
            { value: 'temperature', label: 'Temperature Issue' },
            { value: 'door', label: 'Door Problem' }
        ],
        outlet: [
            { value: 'not_working', label: 'Not Working' },
            { value: 'sparking', label: 'Sparking' },
            { value: 'loose', label: 'Loose Connection' }
        ],
        lighting: [
            { value: 'flickering', label: 'Flickering' },
            { value: 'not_working', label: 'Not Working' },
            { value: 'dimming', label: 'Dimming' }
        ],
        circuit_breaker: [
            { value: 'tripping', label: 'Keeps Tripping' },
            { value: 'wont_reset', label: "Won't Reset" },
            { value: 'burning_smell', label: 'Burning Smell' }
        ],
        wiring: [
            { value: 'exposed_wires', label: 'Exposed Wires' },
            { value: 'sparking', label: 'Sparking' },
            { value: 'burning_smell', label: 'Burning Smell' },
            { value: 'static_noise', label: 'Static Noise' }
        ],
        sink: [
            { value: 'clogged', label: 'Clogged' },
            { value: 'leaking', label: 'Leaking' },
            { value: 'low_pressure', label: 'Low Pressure' }
        ],
        toilet: [
            { value: 'clogged', label: 'Clogged' },
            { value: 'running', label: 'Running Continuously' },
            { value: 'leaking', label: 'Leaking' }
        ],
        shower: [
            { value: 'low_pressure', label: 'Low Pressure' },
            { value: 'leaking', label: 'Leaking' },
            { value: 'no_hot_water', label: 'No Hot Water' },
            { value: 'clogged', label: 'Clogged Drain' }
        ],
        pipes: [
            { value: 'leaking', label: 'Leaking' },
            { value: 'burst', label: 'Burst Pipe' },
            { value: 'frozen', label: 'Frozen Pipe' },
            { value: 'noise', label: 'Banging/Noise' }
        ],
        general: [
            { value: 'other_issue', label: 'Other Issue' }
        ]
    };

    // Issue to SubIssues mapping
    const issueSubIssues: Record<string, Array<{ value: string; label: string }>> = {
        not_cooling: [
            { value: 'completely_warm', label: 'Completely Warm' },
            { value: 'partially_cooling', label: 'Partially Cooling' },
            { value: 'freezer_only', label: 'Freezer Only Issue' }
        ],
        leaking: [
            { value: 'minor_leak', label: 'Minor Leak' },
            { value: 'major_leak', label: 'Major Leak' },
            { value: 'continuous', label: 'Continuous Dripping' }
        ],
        noise: [
            { value: 'loud_humming', label: 'Loud Humming' },
            { value: 'clicking', label: 'Clicking Sound' },
            { value: 'rattling', label: 'Rattling' }
        ],
        not_working: [
            { value: 'no_power', label: 'No Power' },
            { value: 'intermittent', label: 'Intermittent' },
            { value: 'tripped', label: 'Circuit Tripped' }
        ],
        clogged: [
            { value: 'partial', label: 'Partial Blockage' },
            { value: 'complete', label: 'Complete Blockage' },
            { value: 'slow_drain', label: 'Slow Drain' }
        ]
    };

    // Helper function to get label from value
    const getLabelForValue = (value: string, optionsMap: Record<string, Array<{ value: string; label: string }>>, key: string): string => {
        const options = optionsMap[key];
        if (!options) return value;
        const option = options.find(opt => opt.value === value);
        return option ? option.label : value;
    };

    // Generate title from selected fields
    const generateTitle = (data: typeof formData): string => {
        const parts: string[] = [];

        if (data.category) {
            const categoryLabels: Record<string, string> = {
                'appliances': 'Appliances',
                'electrical': 'Electrical',
                'plumbing': 'Plumbing',
                'other': 'Other'
            };
            parts.push(categoryLabels[data.category] || data.category);
        }

        if (data.subCategory) {
            parts.push(getLabelForValue(data.subCategory, categorySubCategories, data.category));
        }

        if (data.issue) {
            parts.push(getLabelForValue(data.issue, subCategoryIssues, data.subCategory));
        }

        if (data.subIssue) {
            parts.push(getLabelForValue(data.subIssue, issueSubIssues, data.issue));
        }

        return parts.join(' / ');
    };

    const handleChange = (field: keyof AdvancedRequestFormFields, value: string) => {
        // Mark form as touched when user makes any change
        formTouchedRef.current = true;

        setFormData(prev => {
            const updated = { ...prev, [field]: value };

            if (field === 'category') {
                updated.subCategory = '';
                updated.issue = '';
                updated.subIssue = '';
            } else if (field === 'subCategory') {
                updated.issue = '';
                updated.subIssue = '';
            } else if (field === 'issue') {
                updated.subIssue = '';
            }

            // Auto-generate title if it's a category-related field
            if (['category', 'subCategory', 'issue', 'subIssue'].includes(field)) {
                updated.title = generateTitle(updated);
            }

            return updated;
        });
    };

    // Handle AI Data Injection
    useEffect(() => {
        if (aiPrefillData) {
            formTouchedRef.current = true;

            setFormData(prev => {
                const updates: any = {};
                Object.entries(aiPrefillData).forEach(([key, value]) => {
                    if (value !== null && value !== '' && value !== undefined) {
                        updates[key] = value;
                    }
                });

                const updated = { ...prev, ...updates };

                // Clear dependent fields if parent fields changed
                if (updates.category && prev.category !== updates.category) {
                    updated.subCategory = '';
                    updated.issue = '';
                    updated.subIssue = '';
                } else if (updates.subCategory && prev.subCategory !== updates.subCategory) {
                    updated.issue = '';
                    updated.subIssue = '';
                } else if (updates.issue && prev.issue !== updates.issue) {
                    updated.subIssue = '';
                }

                return updated;
            });
        }
    }, [aiPrefillData]);

    // Get available options based on selections
    const getSubCategoryOptions = () => {
        if (!formData.category) return [];
        return categorySubCategories[formData.category] || [];
    };

    const getIssueOptions = () => {
        if (!formData.subCategory) return [];
        return subCategoryIssues[formData.subCategory] || [];
    };

    const getSubIssueOptions = () => {
        if (!formData.issue) return [];
        return issueSubIssues[formData.issue] || [];
    };

    return (
        <div className="w-full max-w-5xl mx-auto pb-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Category</h2>
                    <p className="text-gray-500 text-sm">
                        Search or select the issue category. Only the main category is required, but you can select a sub-category, issue and sub-issue to narrow down the request.
                        Select 'other' option if the category you are looking for isn't here.
                    </p>
                </div>
                {/* AI Chat Removed - Handled by parent */}
            </div>

            {/* Category & Sub-category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <CustomDropdown
                        label="Category"
                        value={formData.category}
                        onChange={(val) => { handleChange('category', val); setErrors(e => ({ ...e, category: '' })); }}
                        options={[
                            { value: 'appliances', label: 'Appliances' },
                            { value: 'electrical', label: 'Electrical' },
                            { value: 'plumbing', label: 'Plumbing' },
                            { value: 'other', label: 'Other' }
                        ]}
                        placeholder="Select Category"
                        required
                        buttonClassName={`!bg-white !border-none !rounded-md !py-3 ${errors.category ? '!ring-2 !ring-red-400' : ''}`}
                    />
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
                <div>
                    <CustomDropdown
                        label="Subcategory"
                        value={formData.subCategory}
                        onChange={(val) => { handleChange('subCategory', val); setErrors(e => ({ ...e, subCategory: '' })); }}
                        options={getSubCategoryOptions()}
                        placeholder={formData.category ? "Select Subcategory" : "Select Category First"}
                        required
                        buttonClassName={`!bg-white !border-none !rounded-md !py-3 ${errors.subCategory ? '!ring-2 !ring-red-400' : ''}`}
                        disabled={!formData.category}
                    />
                    {errors.subCategory && <p className="text-red-500 text-xs mt-1">{errors.subCategory}</p>}
                </div>
            </div>

            {/* Issue & Sub-issue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div>
                    <CustomDropdown
                        label="Issue"
                        value={formData.issue}
                        onChange={(val) => { handleChange('issue', val); setErrors(e => ({ ...e, issue: '' })); }}
                        options={getIssueOptions()}
                        placeholder={formData.subCategory ? "Select Issue" : "Select Subcategory First"}
                        required
                        buttonClassName={`!bg-white !border-none !rounded-md !py-3 ${errors.issue ? '!ring-2 !ring-red-400' : ''}`}
                        disabled={!formData.subCategory}
                    />
                    {errors.issue && <p className="text-red-500 text-xs mt-1">{errors.issue}</p>}
                </div>
                <CustomDropdown
                    label="Sub-Issue"
                    value={formData.subIssue}
                    onChange={(val) => handleChange('subIssue', val)}
                    options={getSubIssueOptions()}
                    placeholder={formData.issue ? "Select Sub-issue" : "Select Issue First"}
                    buttonClassName="!bg-white !border-none !rounded-md !py-3"
                    disabled={!formData.issue}
                />
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Issue details</h2>
                <p className="text-gray-500 text-sm">
                    Add any additional request details as a title or description to narrow down the issue.
                </p>
            </div>

            {/* Title */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Title*</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => { handleChange('title', e.target.value); setErrors(err => ({ ...err, title: '' })); }}
                    placeholder="Title type here.."
                    className={`w-full px-4 py-3 bg-white rounded-md border-none outline-none placeholder-gray-400 ${errors.title ? 'ring-2 ring-red-400' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Details */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Details</h2>
                <textarea
                    value={formData.details}
                    onChange={(e) => handleChange('details', e.target.value)}
                    placeholder="Type Details here.."
                    className="w-full h-40 px-4 py-4 bg-[#F0F2F5] rounded-xl border-none outline-none placeholder-gray-500 resize-none"
                />
            </div>

            {/* Amount */}
            <div className="mb-12">
                <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Amount</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="Enter estimated cost for this request"
                    className="w-full px-4 py-3 bg-white rounded-md border-none outline-none placeholder-gray-400"
                />
            </div>

            {/* Media & Attachments */}
            <div className="flex flex-col md:flex-row gap-12 items-center mb-8">
                {/* Media Card (formerly Video) */}
                <div className="relative w-full md:w-80 max-w-[20rem] md:max-w-none">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#7BD747] text-white px-10 py-3 rounded-full flex items-center gap-2 font-bold shadow-sm z-10 whitespace-nowrap">
                        <Video size={20} strokeWidth={2.5} />
                        <span>Media</span>
                    </div>
                    <div className="bg-[#F0F0F6] border-2 border-[#7BD747] rounded-[2.5rem] p-8 pt-10 flex flex-col items-center justify-center h-48 w-full">
                        <p className="text-[#5C6B7F] text-center font-medium mb-4">Add images and videos (15 sec) of the problem</p>
                        <label className="cursor-pointer text-[#2E6819] font-bold text-sm hover:opacity-80 transition-opacity">
                            Choose File
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                            />
                        </label>
                    </div>
                    {videoError && <p className="text-red-500 text-xs mt-1 text-center">{videoError}</p>}
                </div>

                {/* Attachments Card */}
                <div className="relative w-full md:w-80 max-w-[20rem] md:max-w-none">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#7BD747] text-white px-10 py-3 rounded-full flex items-center gap-2 font-bold shadow-sm z-10 whitespace-nowrap">
                        <Upload size={20} strokeWidth={2.5} />
                        <span>Attachments</span>
                    </div>
                    <div className="bg-[#F0F0F6] border-2 border-[#7BD747] rounded-[2.5rem] p-8 pt-10 flex flex-col items-center justify-center h-48 w-full">
                        <p className="text-[#5C6B7F] text-center font-medium mb-4">Add Relevant Attachment</p>
                        <label className="cursor-pointer text-[#2E6819] font-bold text-sm hover:opacity-80 transition-opacity">
                            Choose File
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                onChange={handleFileSelect}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Previously uploaded media (from the request being edited) */}
            {initialData?.existingMedia && initialData.existingMedia.length > 0 && (
                <div className="mb-12">
                    <p className="text-sm font-bold text-gray-700 mb-3">Previously uploaded</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {initialData.existingMedia.map((media) => (
                            <div key={media.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                {media.kind === 'video' ? (
                                    <video src={media.url} className="w-full h-full object-cover" controls />
                                ) : (
                                    <img src={media.url} alt="Previously uploaded" className="w-full h-full object-cover" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* File Previews */}
            {mediaFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {mediaFiles.map((media) => (
                        <div
                            key={media.id}
                            onClick={() => isPreviewable(media.file) && setSelectedMedia(media)}
                            className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group ${isPreviewable(media.file) ? 'cursor-pointer' : ''}`}
                        >
                            {media.file.type.startsWith('video/') ? (
                                <video
                                    src={media.previewUrl}
                                    className="w-full h-full object-cover pointer-events-none"
                                    muted
                                    playsInline
                                    // Without this the tile is a black box until played - browsers
                                    // fetch no frame to show as a poster.
                                    preload="metadata"
                                />
                            ) : media.file.type.startsWith('image/') ? (
                                <img
                                    src={media.previewUrl}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center px-2 text-center text-xs text-gray-600">
                                    <span className="font-semibold truncate w-full">
                                        {media.file.name}
                                    </span>
                                    <span className="mt-1 text-[10px] text-gray-400">
                                        {media.file.type || 'Document'}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveFile(media.id); }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Media Preview Modal - same full-screen viewer as the request detail page */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4 md:p-10 lg:p-20"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setSelectedMedia(null)}
                            className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 md:-top-8 md:-right-12 bg-white rounded-full p-2 md:p-3 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl z-[110]"
                            aria-label="Close"
                        >
                            <X size={24} className="text-gray-700" strokeWidth={2.5} />
                        </button>
                        {selectedMedia.file.type.startsWith('video/') ? (
                            <video
                                src={selectedMedia.previewUrl}
                                controls
                                autoPlay
                                className="max-w-full max-h-full rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <img
                                src={selectedMedia.previewUrl}
                                alt={selectedMedia.file.name}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Footer Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={onDiscard}
                    className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-white border border-gray-200 text-black font-bold hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Discard
                </button>
                <button
                    onClick={() => {
                        const newErrors: Partial<Record<keyof AdvancedRequestFormFields, string>> = {};
                        if (!formData.category) newErrors.category = 'Category is required.';
                        if (!formData.subCategory) newErrors.subCategory = 'Subcategory is required.';
                        if (!formData.issue) newErrors.issue = 'Issue is required.';
                        if (!formData.title.trim()) newErrors.title = 'Title is required.';
                        if (Object.keys(newErrors).length > 0) {
                            setErrors(newErrors);
                            return;
                        }
                        setErrors({});
                        const files = mediaFiles.map((media) => media.file);
                        setAdvanced({
                            category: formData.category,
                            subCategory: formData.subCategory,
                            issue: formData.issue,
                            subIssue: formData.subIssue,
                            title: formData.title,
                            details: formData.details,
                            amount: formData.amount,
                            files,
                        });
                        onNext({ ...formData, files });
                    }}
                    className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-[#3D7475] text-white font-bold hover:opacity-90 transition-opacity shadow-md"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default AdvancedRequestForm;
