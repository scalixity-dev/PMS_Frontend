import React from 'react';
import { Upload, Video } from 'lucide-react';

interface MediaUploadProps {
    onFileSelect: (file: File) => void;
    files: File[];
    onRemove: (index: number) => void;
    onNext: () => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onFileSelect, files, onRemove, onNext }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileSelect(event.target.files[0]);
            // Reset input value to allow selecting the same file again if deleted
            event.target.value = '';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto pb-8">
            <div className="text-center mb-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Take a picture of the issue</h2>
                <p className="text-lg font-medium text-gray-500">Add details of the problem to visualise the issue.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-12">
                {/* Attachments Card */}
                <div className="relative w-full md:w-80 max-w-[20rem] md:max-w-none">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#7BD747] text-white px-10 py-3 rounded-full flex items-center gap-2 font-bold shadow-sm z-10 whitespace-nowrap">
                        <Upload size={20} strokeWidth={2.5} />
                        <span>Attachments</span>
                    </div>
                    <div className="bg-[#F0F0F6] border-2 border-[#7BD747] rounded-[2.5rem] p-8 pt-10 flex flex-col items-center justify-center h-48 w-full">
                        <p className="text-[#5C6B7F] text-center font-medium mb-4">Add photos or upload a file</p>
                        <label className="cursor-pointer text-[#2E6819] font-bold text-sm hover:opacity-80 transition-opacity">
                            Choose File
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>

                {/* Video Card */}
                <div className="relative w-full md:w-80 max-w-[20rem] md:max-w-none">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#7BD747] text-white px-10 py-3 rounded-full flex items-center gap-2 font-bold shadow-sm z-10 whitespace-nowrap">
                        <Video size={20} strokeWidth={2.5} />
                        <span>Video</span>
                    </div>
                    <div className="bg-[#F0F0F6] border-2 border-[#7BD747] rounded-[2.5rem] p-8 pt-10 flex flex-col items-center justify-center h-48 w-full">
                        <p className="text-[#5C6B7F] text-center font-medium mb-4">Take 15 sec. video of the problem</p>
                        <label className="cursor-pointer text-[#2E6819] font-bold text-sm hover:opacity-80 transition-opacity">
                            Choose File
                            <input
                                type="file"
                                className="hidden"
                                accept="video/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* File Previews */}
            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {files.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                            {file.type.startsWith('video/') ? (
                                <video
                                    src={URL.createObjectURL(file)}
                                    className="w-full h-full object-cover"
                                    controls
                                />
                            ) : (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`preview-${index}`}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <button
                                onClick={() => onRemove(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Next Button */}
            <div className="flex justify-center">
                <button
                    onClick={onNext}
                    className="bg-[#3D7475] text-white px-12 py-3 rounded-lg font-bold transition-all shadow-md hover:bg-[#2c5251] hover:shadow-lg"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MediaUpload;
