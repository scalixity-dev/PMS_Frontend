import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    initialIndex?: number;
}

const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
    isOpen,
    onClose,
    images,
    initialIndex = 0,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialIndex]);

    if (!isOpen) return null;

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 md:p-10 animate-in fade-in duration-200">
            <style>{`
                .modern-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .modern-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .modern-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                .modern-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
            `}</style>

            <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                aria-label="Close gallery"
            >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="w-full max-w-7xl h-full max-h-[90vh] sm:max-h-[85vh] bg-white rounded-xl sm:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
                {/* Main Image Area */}
                <div className="relative flex-1 bg-gray-50 flex items-center justify-center p-2 sm:p-4 min-h-0">
                    <img
                        src={images[currentIndex]}
                        alt={`View ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain drop-shadow-sm"
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/80 hover:bg-white text-gray-800 rounded-full transition-all hover:scale-110 active:scale-95 shadow-md border border-gray-100"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/80 hover:bg-white text-gray-800 rounded-full transition-all hover:scale-110 active:scale-95 shadow-md border border-gray-100"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-gray-700 text-[10px] sm:text-xs font-semibold backdrop-blur-md border border-gray-200 shadow-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnail List - Horizontal on mobile/small, Vertical sidebar on tablet+ */}
                <div className="h-20 sm:h-24 md:h-full md:w-48 lg:w-64 bg-white border-t md:border-t-0 md:border-l border-gray-100 flex flex-col">
                    <div className="hidden md:block p-3 lg:p-4 border-b border-gray-100">
                        <h3 className="text-gray-900 font-bold text-sm">Gallery</h3>
                        <p className="text-gray-500 text-xs mt-1">{images.length} photos</p>
                    </div>

                    <div className="flex-1 overflow-x-auto md:overflow-x-hidden overflow-y-hidden md:overflow-y-auto p-2 md:p-3 lg:p-4 flex md:flex-col gap-2 md:gap-3 modern-scrollbar">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`flex-shrink-0 w-14 h-10 sm:w-16 sm:h-12 md:w-full md:h-auto relative group md:aspect-video rounded-md md:rounded-lg overflow-hidden transition-all duration-200 ${currentIndex === idx
                                    ? 'ring-2 ring-[#4ad1a6] ring-offset-1 md:ring-offset-2 ring-offset-white opacity-100 scale-[1.02] shadow-md'
                                    : 'opacity-70 hover:opacity-100 hover:scale-[1.02] hover:shadow-sm'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {currentIndex === idx && (
                                    <div className="absolute inset-0 bg-[#4ad1a6]/10 mix-blend-multiply" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overlay click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
};

export default PhotoGalleryModal;
