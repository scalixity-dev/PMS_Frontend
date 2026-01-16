import React, { type RefObject } from "react";
import { Upload, Video, X, FileText } from "lucide-react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";

interface Step5Props {
    attachments: File[];
    video: File | null;
    attachmentsInputRef: RefObject<HTMLInputElement | null>;
    videoInputRef: RefObject<HTMLInputElement | null>;
    onAttachmentsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveAttachment: (index: number) => void;
    onRemoveVideo: () => void;
    onNext: () => void;
    onSkip: () => void;
}

const Step5Media: React.FC<Step5Props> = ({
    attachments,
    video,
    attachmentsInputRef,
    videoInputRef,
    onAttachmentsChange,
    onVideoChange,
    onRemoveAttachment,
    onRemoveVideo,
    onNext,
    onSkip
}) => {
    return (
        <>
            {/* Header Section - Responsive text sizing and spacing */}
            <div className="text-center mb-6 md:mb-8 px-4">
                <h1 className="text-lg md:text-xl font-medium text-[#1A1A1A] mb-1">
                    Take a picture or video
                </h1>
                <p className="text-gray-400 text-xs md:text-sm font-normal">
                    Start Selecting the category to define the issue
                </p>
            </div>

            <div className="flex flex-col gap-4 md:gap-6 max-w-xl mx-auto px-4 mb-4">
                {/* Upload Grid - Responsive columns and spacing */}
                <div className="grid grid-cols-2 gap-3 md:gap-12">
                    <div
                        onClick={() => attachmentsInputRef.current?.click()}
                        className={`group cursor-pointer flex flex-col items-center justify-center gap-2 md:gap-3 bg-white px-3 md:px-4 py-4 md:py-6 rounded-lg border-2 transition-all duration-200 ${attachments.length > 0 ? "border-[#7ED957] shadow-sm" : "border-gray-100 hover:border-gray-300 shadow-sm"}`}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            className="hidden"
                            ref={attachmentsInputRef}
                            onChange={onAttachmentsChange}
                        />
                        {/* Icon - Responsive sizing */}
                        <Upload size={window.innerWidth < 768 ? 36 : 48} strokeWidth={1.5} className="text-gray-800" />
                        <span className="font-normal text-base md:text-lg text-gray-900">Attachments</span>
                    </div>

                    <div
                        onClick={() => videoInputRef.current?.click()}
                        className={`group cursor-pointer flex flex-col items-center justify-center gap-2 md:gap-3 bg-white px-3 md:px-4 py-4 md:py-6 rounded-lg border-2 transition-all duration-200 ${video ? "border-[#7ED957] shadow-sm" : "border-gray-100 hover:border-gray-300 shadow-sm"}`}
                    >
                        <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            ref={videoInputRef}
                            onChange={onVideoChange}
                        />
                        {/* Icon - Responsive sizing */}
                        <Video size={window.innerWidth < 768 ? 36 : 48} strokeWidth={1.5} className={`${video ? "text-[#1A1A1A]" : "text-gray-800"}`} />
                        <span className={`font-normal text-base md:text-lg ${video ? "text-[#1A1A1A]" : "text-gray-900"}`}>Video</span>
                    </div>
                </div>

                {/* File Previews - Responsive sizing */}
                {(attachments.length > 0 || video) && (
                    <div className="flex flex-col gap-3 md:gap-4">
                        {attachments.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-xs md:text-sm font-medium text-gray-700">Selected files ({attachments.length})</h3>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {attachments.map((file, index) => (
                                        <div key={`${file.name}-${index}`} className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center group/item overflow-hidden">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRemoveAttachment(index);
                                                }}
                                                className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full text-gray-500 hover:text-red-500 flex items-center justify-center shadow-sm z-10"
                                            >
                                                <X size={10} className="md:w-3 md:h-3" />
                                            </button>

                                            {file.type.startsWith("image/") ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index}`}
                                                    className="w-full h-full object-cover"
                                                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-0.5 md:gap-1 p-1">
                                                    <FileText size={16} className="md:w-5 md:h-5 text-gray-500" />
                                                    <span className="text-[8px] md:text-[9px] text-gray-600 text-center truncate w-full px-1">{file.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {video && (
                            <div className="space-y-2">
                                <h3 className="text-xs md:text-sm font-medium text-gray-700">Selected video</h3>
                                <div className="relative inline-flex items-center gap-2 md:gap-3 bg-white p-2 md:p-3 rounded-lg border border-gray-200 w-full">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Video size={16} className="md:w-5 md:h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{video.name}</p>
                                        <p className="text-[10px] md:text-xs text-gray-500">{(video.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveVideo();
                                        }}
                                        className="p-1 md:p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <X size={14} className="md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Skip Option - Responsive text sizing */}
            <div className="text-center mb-6 md:mb-8 px-4">
                <span className="text-gray-500 text-xs md:text-sm">Don't have media? </span>
                <button className="text-[#004D40] text-xs md:text-sm font-medium hover:underline" onClick={onSkip}>Skip</button>
            </div>

            {/* Next Button - Responsive sizing and spacing */}
            <div className="mt-6 mb-2 flex justify-center px-4">
                <PrimaryActionButton
                    disabled={attachments.length === 0 && !video}
                    onClick={onNext}
                    className={attachments.length === 0 && !video
                        ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-8 md:px-12 w-full md:w-auto"
                        : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-8 md:px-12 w-full md:w-auto"}
                    text="Next"
                />
            </div>
        </>
    );
};

export default Step5Media;
