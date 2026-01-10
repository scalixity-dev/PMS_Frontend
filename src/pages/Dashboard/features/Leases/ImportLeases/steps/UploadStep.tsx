import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadStepProps {
    file: File | null;
    onFileSelect: (file: File) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ file, onFileSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (uploadedFile: File) => {
        // Validate file extension - only Excel files are supported
        const allowedExtensions = ['.xls', '.xlsx'];
        const fileName = uploadedFile.name.toLowerCase();
        const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

        if (!isValidExtension) {
            alert(`Invalid file type. Please upload an Excel file (.xls or .xlsx)`);
            return;
        }

        // Validate file size (10MB max)
        const maxSizeBytes = 10 * 1024 * 1024;
        if (uploadedFile.size > maxSizeBytes) {
            alert('File size must not exceed 10MB');
            return;
        }

        onFileSelect(uploadedFile);
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Upload a File</h2>
            <p className="text-center text-gray-600 mb-8">
                Please upload your file here. You can upload up to 500 rows per import.{' '}
                <a href="#" className="text-[#3A6D6C] font-semibold hover:underline">Learn more</a>
            </p>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#3A6D6C] px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">Your import file</h3>
                </div>

                <div
                    className={`p-8 bg-[#F3F4F6] min-h-[200px] flex flex-col items-center justify-center transition-colors
                        ${dragActive ? 'bg-gray-200' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleChange}
                    />

                    {file ? (
                        <div className="text-center">
                            <p className="text-lg font-medium text-gray-800 mb-2">Selected File:</p>
                            <p className="text-[#3A6D6C] font-bold text-xl mb-4">{file.name}</p>
                            <button
                                onClick={onButtonClick}
                                className="text-sm text-gray-500 underline hover:text-gray-700"
                            >
                                Change File
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">No attachment yet</p>
                            <button
                                onClick={onButtonClick}
                                className="flex flex-col items-center justify-center w-40 h-16 bg-[#447D7C] text-white rounded-md hover:bg-[#325c5b] transition-colors shadow-sm mx-auto"
                            >
                                <Upload className="w-5 h-5 mb-1" />
                                <span className="text-sm font-medium">Upload File</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadStep;
