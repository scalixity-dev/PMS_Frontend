import React from 'react';
import { Upload, Plus, X } from 'lucide-react';

interface PropertyPhotosProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

const PropertyPhotos: React.FC<PropertyPhotosProps> = ({ data, updateData }) => {
    const coverInputRef = React.useRef<HTMLInputElement>(null);
    const galleryInputRef = React.useRef<HTMLInputElement>(null);

    const handleCoverClick = () => {
        coverInputRef.current?.click();
    };

    const handleGalleryClick = () => {
        galleryInputRef.current?.click();
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file);
            // Update data with file object and preview URL
            updateData('coverPhoto', { file, previewUrl });
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newPhotos = files.map(file => ({
                file,
                previewUrl: URL.createObjectURL(file)
            }));
            updateData('galleryPhotos', [...(data.galleryPhotos || []), ...newPhotos]);
        }
    };

    const removeCoverPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateData('coverPhoto', null);
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
                    accept="image/*"
                    className="hidden"
                />
                <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleGalleryChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                />

                {/* Cover Photo Upload */}
                <div
                    onClick={handleCoverClick}
                    className={`w-full h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${data.coverPhoto
                        ? 'border-transparent'
                        : 'bg-[#F3F4F6] border-gray-300 hover:bg-gray-100'
                        }`}
                >
                    {data.coverPhoto ? (
                        <>
                            <img
                                src={data.coverPhoto.previewUrl}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={removeCoverPhoto}
                                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 mb-4 text-black">
                                <Upload size={48} strokeWidth={2.5} />
                            </div>
                            <span className="text-gray-600 font-medium">Upload Cover Photos</span>
                        </>
                    )}
                </div>

                {/* Gallery Photos */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Uploaded Images */}
                    {data.galleryPhotos?.map((photo: any, index: number) => (
                        <div key={index} className="relative w-32 h-32 rounded-2xl overflow-hidden border border-gray-200 group">
                            <img
                                src={photo.previewUrl}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => removeGalleryPhoto(index)}
                                className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            >
                                <X size={16} className="text-gray-600" />
                            </button>
                        </div>
                    ))}

                    {/* Add Gallery Button */}
                    <button
                        onClick={handleGalleryClick}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#86D24A] text-gray-700 font-medium hover:bg-[#86D24A]/10 transition-colors"
                    >
                        Add gallery photos
                        <Plus size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* YouTube URL */}
                <div className="w-full">
                    <div className="relative">
                        <input
                            type="text"
                            value={data.youtubeUrl || ''}
                            onChange={(e) => updateData('youtubeUrl', e.target.value)}
                            placeholder="YouTube video URL"
                            className="w-full px-6 py-3 rounded-full border-2 border-[#86D24A] focus:outline-none focus:ring-2 focus:ring-[#86D24A]/20 text-gray-700 placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyPhotos;
