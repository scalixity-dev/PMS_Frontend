import React, { useState, useEffect } from 'react';
import { Upload, Plus, X, AlertCircle } from 'lucide-react';

interface PropertyPhotosProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

const PropertyPhotos: React.FC<PropertyPhotosProps> = ({ data, updateData }) => {
    const coverInputRef = React.useRef<HTMLInputElement>(null);
    const galleryInputRef = React.useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<{
        coverPhoto?: string;
        galleryPhotos?: string;
        youtubeUrl?: string;
    }>({});

    // Helper function to check if cover photo exists (either URL string or file object)
    const hasCoverPhoto = () => {
        if (!data.coverPhoto) return false;
        // If it's a string (URL), it exists
        if (typeof data.coverPhoto === 'string') return true;
        // If it's an object with file or previewUrl, it exists
        if (typeof data.coverPhoto === 'object' && (data.coverPhoto.file || data.coverPhoto.previewUrl)) return true;
        return false;
    };

    // Helper function to get cover photo URL (either from string or previewUrl)
    const getCoverPhotoUrl = () => {
        if (!data.coverPhoto) return null;
        if (typeof data.coverPhoto === 'string') return data.coverPhoto;
        if (typeof data.coverPhoto === 'object' && data.coverPhoto.previewUrl) return data.coverPhoto.previewUrl;
        return null;
    };

    // Helper function to check if gallery photos exist
    const hasGalleryPhotos = () => {
        if (!data.galleryPhotos || data.galleryPhotos.length === 0) return false;
        return data.galleryPhotos.some((photo: any) => {
            // If it's a string (URL), it exists
            if (typeof photo === 'string') return true;
            // If it's an object with file or previewUrl, it exists
            if (typeof photo === 'object' && (photo.file || photo.previewUrl)) return true;
            return false;
        });
    };

    // Helper function to get gallery photo URL
    const getGalleryPhotoUrl = (photo: any) => {
        if (typeof photo === 'string') return photo;
        if (typeof photo === 'object' && photo.previewUrl) return photo.previewUrl;
        return null;
    };

    // Validate form whenever data changes
    useEffect(() => {
        const newErrors: typeof errors = {};
        
        // Validate cover photo (required)
        if (!hasCoverPhoto()) {
            newErrors.coverPhoto = 'Cover photo is required';
        }
        
        // Validate gallery photos (required - at least one)
        if (!hasGalleryPhotos()) {
            newErrors.galleryPhotos = 'At least one gallery photo is required';
        }
        
        // Validate YouTube URL format if provided (optional)
        if (data.youtubeUrl && data.youtubeUrl.trim()) {
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
            if (!youtubeRegex.test(data.youtubeUrl.trim())) {
                newErrors.youtubeUrl = 'Please enter a valid YouTube URL';
            }
        }
        
        setErrors(newErrors);
    }, [data.coverPhoto, data.galleryPhotos, data.youtubeUrl]);

    const handleCoverClick = () => {
        coverInputRef.current?.click();
    };

    const handleGalleryClick = () => {
        galleryInputRef.current?.click();
    };

    // Allowed image MIME types
    const allowedImageTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
        'image/tiff',
        'image/x-icon',
    ];

    // Validate if file is an image
    const isValidImageFile = (file: File): boolean => {
        return allowedImageTypes.includes(file.type);
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!isValidImageFile(file)) {
                setErrors(prev => ({
                    ...prev,
                    coverPhoto: 'Please upload a valid image file (PNG, JPEG, WebP, SVG, GIF, BMP, TIFF, or ICO)'
                }));
                // Reset input
                if (coverInputRef.current) {
                    coverInputRef.current.value = '';
                }
                return;
            }

            // Clear any previous errors
            setErrors(prev => ({ ...prev, coverPhoto: undefined }));
            
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file);
            // Update data with file object and preview URL
            updateData('coverPhoto', { file, previewUrl });
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const validFiles: Array<{ file: File; previewUrl: string }> = [];
            const invalidFiles: string[] = [];

            files.forEach(file => {
                if (isValidImageFile(file)) {
                    validFiles.push({
                        file,
                        previewUrl: URL.createObjectURL(file)
                    });
                } else {
                    invalidFiles.push(file.name);
                }
            });

            // Show error if any invalid files were selected
            if (invalidFiles.length > 0) {
                setErrors(prev => ({
                    ...prev,
                    galleryPhotos: `Invalid file types: ${invalidFiles.join(', ')}. Please upload only image files (PNG, JPEG, WebP, SVG, GIF, BMP, TIFF, or ICO)`
                }));
            } else {
                // Clear any previous errors
                setErrors(prev => ({ ...prev, galleryPhotos: undefined }));
            }

            // Add valid files to gallery
            if (validFiles.length > 0) {
                updateData('galleryPhotos', [...(data.galleryPhotos || []), ...validFiles]);
            }

            // Reset input
            if (galleryInputRef.current) {
                galleryInputRef.current.value = '';
            }
        }
    };

    const removeCoverPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateData('coverPhoto', null);
        // Reset input
        if (coverInputRef.current) {
            coverInputRef.current.value = '';
        }
    };

    const removeGalleryPhoto = (index: number) => {
        const updatedPhotos = [...(data.galleryPhotos || [])];
        updatedPhotos.splice(index, 1);
        updateData('galleryPhotos', updatedPhotos);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Property photos</h2>
                <p className="text-[var(--color-subheading)]">Add a cover photo of your property and a gallery that tell a story about your listing.</p>
            </div>

            <div className="w-full max-w-3xl space-y-6">
                {/* Hidden Inputs */}
                <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverChange}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/x-icon"
                    className="hidden"
                />
                <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleGalleryChange}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/x-icon"
                    multiple
                    className="hidden"
                />

                {/* Cover Photo Upload */}
                <div className="w-full">
                    <div
                        onClick={handleCoverClick}
                        className={`w-full h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                            hasCoverPhoto()
                                ? 'border-transparent'
                                : errors.coverPhoto
                                ? 'bg-red-50 border-red-300 hover:bg-red-100'
                                : 'bg-[#F3F4F6] border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {hasCoverPhoto() ? (
                            <>
                                <img
                                    src={getCoverPhotoUrl() || ''}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                                <button
                                    onClick={removeCoverPhoto}
                                    className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
                                >
                                    <X size={20} className="text-gray-600" />
                                </button>
                                {/* Overlay text for replacing photo */}
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                    <span className="text-white font-medium">Click to replace photo</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 mb-4 text-black">
                                    <Upload size={48} strokeWidth={2.5} />
                                </div>
                                <span className="text-gray-600 font-medium">Upload Cover Photo *</span>
                            </>
                        )}
                    </div>
                    {errors.coverPhoto && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle size={16} />
                            <span>{errors.coverPhoto}</span>
                        </div>
                    )}
                </div>

                {/* Gallery Photos */}
                <div className="w-full">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Uploaded Images - Show both existing (URLs) and new uploads */}
                        {data.galleryPhotos?.map((photo: any, index: number) => {
                            const photoUrl = getGalleryPhotoUrl(photo);
                            if (!photoUrl) return null;
                            
                            return (
                                <div key={index} className="relative w-32 h-32 rounded-2xl overflow-hidden border border-gray-200 group">
                                    <img
                                        src={photoUrl}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                    <button
                                        onClick={() => removeGalleryPhoto(index)}
                                        className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                                    >
                                        <X size={16} className="text-gray-600" />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Add Gallery Button */}
                        <button
                            onClick={handleGalleryClick}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium transition-colors ${
                                errors.galleryPhotos
                                    ? 'border-red-300 text-red-700 hover:bg-red-50'
                                    : 'border-[#86D24A] text-gray-700 hover:bg-[#86D24A]/10'
                            }`}
                        >
                            Add gallery photos *
                            <Plus size={20} />
                        </button>
                    </div>
                    {errors.galleryPhotos && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle size={16} />
                            <span>{errors.galleryPhotos}</span>
                        </div>
                    )}
                </div>

                {/* YouTube URL */}
                <div className="w-full">
                    <div className="relative">
                        <input
                            type="text"
                            value={data.youtubeUrl || ''}
                            onChange={(e) => updateData('youtubeUrl', e.target.value)}
                            placeholder="YouTube video URL (optional)"
                            className={`w-full px-6 py-3 rounded-full border-2 focus:outline-none focus:ring-2 text-gray-700 placeholder-gray-500 ${
                                errors.youtubeUrl
                                    ? 'border-red-300 focus:ring-red-300/20'
                                    : 'border-[#86D24A] focus:ring-[#86D24A]/20'
                            }`}
                        />
                    </div>
                    {errors.youtubeUrl && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle size={16} />
                            <span>{errors.youtubeUrl}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyPhotos;
