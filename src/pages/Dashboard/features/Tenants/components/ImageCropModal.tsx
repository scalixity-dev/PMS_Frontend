import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import type { Area, Point } from 'react-easy-crop';

interface ImageCropModalProps {
  image: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string, croppedFile: File) => void;
  aspectRatio?: number;
  circularCrop?: boolean;
  containerSize?: number; // Size of the container (for inline cropping)
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  image,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  circularCrop = true,
  containerSize = 256, // Default 256px (128px * 2 for better visibility)
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((crop: Point) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<{ croppedImageUrl: string; croppedFile: File }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Set canvas size to match cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    // If circular crop, create a circular mask
    if (circularCrop) {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(
        pixelCrop.width / 2,
        pixelCrop.height / 2,
        Math.min(pixelCrop.width, pixelCrop.height) / 2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }

          const croppedImageUrl = URL.createObjectURL(blob);
          const croppedFile = new File([blob], 'profile-photo.png', {
            type: 'image/png',
          });

          resolve({ croppedImageUrl, croppedFile });
        },
        'image/png',
        0.95, // Quality
      );
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      return;
    }

    setIsProcessing(true);
    try {
      const { croppedImageUrl, croppedFile } = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImageUrl, croppedFile);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">Crop Profile Photo</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Cropper Container - Compact Size */}
        <div className="relative bg-gray-900" style={{ width: containerSize, height: containerSize, margin: '0 auto' }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
            cropShape={circularCrop ? 'round' : 'rect'}
            showGrid={false}
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: '#111827',
              },
              cropAreaStyle: {
                border: '2px solid #3A6D6C',
              },
            }}
          />
        </div>

        {/* Controls - Compact */}
        <div className="p-3 border-t border-gray-200">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-700">
                Zoom: {Math.round(zoom * 100)}%
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  disabled={zoom <= 1}
                >
                  <ZoomOut size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  disabled={zoom >= 3}
                >
                  <ZoomIn size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3A6D6C]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing || !croppedAreaPixels}
              className="px-3 py-1.5 text-sm bg-[#3A6D6C] text-white rounded-lg hover:bg-[#2c5251] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin text-xs">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;

