import React, { useState, useEffect, useRef } from 'react';
import CustomDropdown from '../../../components/CustomDropdown';
import { Upload, Video, X } from 'lucide-react';
import { useMaintenanceRequestFormStore } from '../store/maintenanceRequestStore';

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
    initialData?: Partial<AdvancedRequestFormFields>;
    aiPrefillData?: Partial<AdvancedRequestFormFields>;
}

interface MediaFile {
    id: string;
    file: File;
    previewUrl: string;
}

const AdvancedRequestForm: React.FC<AdvancedRequestFormProps> = ({ onNext, onDiscard, initialData, aiPrefillData }) => {
    const [formData, setFormData] = useState<AdvancedRequestFormFields>({
        category: initialData?.category || '',
        subCategory: initialData?.subCategory || '',
        issue: initialData?.issue || '',
        subIssue: initialData?.subIssue || '',
        title: initialData?.title || '',
        details: initialData?.details || '',
        amount: initialData?.amount || '',
    });

    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
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

    // Keep track of media files in a ref for unmount cleanup
    const mediaFilesRef = useRef(mediaFiles);
    useEffect(() => {
        mediaFilesRef.current = mediaFiles;
    }, [mediaFiles]);

    // Cleanup object URLs ONLY on unmount
    useEffect(() => {
        return () => {
            mediaFilesRef.current.forEach(media => URL.revokeObjectURL(media.previewUrl));
        };
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newMediaFile: MediaFile = {
                id: crypto.randomUUID(),
                file,
                previewUrl: URL.createObjectURL(file)
            };
            setMediaFiles(prev => [...prev, newMediaFile]);
            e.target.value = '';
        }
    };

    const handleRemoveFile = (id: string) => {
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
        sink: [
            { value: 'clogged', label: 'Clogged' },
            { value: 'leaking', label: 'Leaking' },
            { value: 'low_pressure', label: 'Low Pressure' }
        ],
        toilet: [
            { value: 'clogged', label: 'Clogged' },
            { value: 'running', label: 'Running Continuously' },
            { value: 'leaking', label: 'Leaking' }
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
                <CustomDropdown
                    label="Category"
                    value={formData.category}
                    onChange={(val) => handleChange('category', val)}
                    options={[
                        { value: 'appliances', label: 'Appliances' },
                        { value: 'electrical', label: 'Electrical' },
                        { value: 'plumbing', label: 'Plumbing' },
                        { value: 'other', label: 'Other' }
                    ]}
                    placeholder="Select Category"
                    required
                    buttonClassName="!bg-white !border-none !rounded-md !py-3"
                />
                <CustomDropdown
                    label="Subcategory"
                    value={formData.subCategory}
                    onChange={(val) => handleChange('subCategory', val)}
                    options={getSubCategoryOptions()}
                    placeholder={formData.category ? "Select Subcategory" : "Select Category First"}
                    required
                    buttonClassName="!bg-white !border-none !rounded-md !py-3"
                    disabled={!formData.category}
                />
            </div>

            {/* Issue & Sub-issue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <CustomDropdown
                    label="Issue"
                    value={formData.issue}
                    onChange={(val) => handleChange('issue', val)}
                    options={getIssueOptions()}
                    placeholder={formData.subCategory ? "Select Issue" : "Select Subcategory First"}
                    required
                    buttonClassName="!bg-white !border-none !rounded-md !py-3"
                    disabled={!formData.subCategory}
                />
                <CustomDropdown
                    label="Sub-Issue"
                    value={formData.subIssue}
                    onChange={(val) => handleChange('subIssue', val)}
                    options={getSubIssueOptions()}
                    placeholder={formData.issue ? "Select Sub-issue" : "Select Issue First"}
                    required
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
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Title type here.."
                    className="w-full px-4 py-3 bg-white rounded-md border-none outline-none placeholder-gray-400"
                />
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

            {/* File Previews */}
            {mediaFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {mediaFiles.map((media) => (
                        <div key={media.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                            {media.file.type.startsWith('video/') ? (
                                <video
                                    src={media.previewUrl}
                                    className="w-full h-full object-cover"
                                    controls
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
                                onClick={() => handleRemoveFile(media.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
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
