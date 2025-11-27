import React from 'react';
import { Upload, Video } from 'lucide-react';

interface MediaUploadProps {
    onFileSelect: (file: File) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onFileSelect }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileSelect(event.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Take a picture of the issue</h2>
                <p className="text-lg font-medium text-gray-500">Add details of the problem to visualise the issue.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
                {/* Attachments Card */}
                <div className="relative w-80">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#7BD747] text-white px-10 py-3 rounded-full flex items-center gap-2 font-bold shadow-sm z-10 whitespace-nowrap">
                        <Upload size={20} strokeWidth={2.5} />
                        <span>Attachments</span>
                    </div>
                    <div className="bg-[#F0F0F6] border-2 border-[#7BD747] rounded-[2.5rem] p-8 pt-10 flex flex-col items-center justify-center h-auto w-full">
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
                <div className="relative w-80">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#7BD747] text-white px-10 py-3 rounded-full flex items-center gap-2 font-bold shadow-sm z-10 whitespace-nowrap">
                        <Video size={20} strokeWidth={2.5} />
                        <span>Video</span>
                    </div>
                    <div className="bg-[#F0F0F6] border-2 border-[#7BD747] rounded-[2.5rem] p-8 pt-10 flex flex-col items-center justify-center h-auto w-full">
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
        </div>
    );
};

export default MediaUpload;
