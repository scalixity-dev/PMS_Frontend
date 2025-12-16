import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import ImportStepper from './components/ImportStepper';
import TemplateStep from './steps/TemplateStep';
import UploadStep from './steps/UploadStep';
import MappingStep from './steps/MappingStep';
import ValidationStep from './steps/ValidationStep';

import ImportSuccessModal from './components/ImportSuccessModal';

const ImportProperties: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Final step - Import
            handleImport();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate('/dashboard/properties');
        }
    };

    const handleClose = () => {
        navigate('/dashboard/properties');
    };

    // New handler for modal close
    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/dashboard/properties');
    };

    const handleImport = () => {
        // Logic to process import would go here
        console.log('Handling import - Modal should open');
        // Simulating API call
        setTimeout(() => {
            setShowSuccessModal(true);
        }, 1000);
    };

    const getActionButtonText = () => {
        switch (currentStep) {
            case 1: return "I'm ready to import";
            case 4: return "Import";
            default: return "Next";
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <TemplateStep />;
            case 2:
                return <UploadStep file={file} onFileSelect={setFile} />;
            case 3:
                return <MappingStep />;
            case 4:
                return <ValidationStep />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-[#DFE5E3] rounded-xl p-6 flex flex-col items-center">
            {/* Header Navigation */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-8">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-[#3A6D6C] font-bold text-sm tracking-wide hover:opacity-80 transition-opacity"
                >
                    <ChevronLeft size={20} strokeWidth={3} />
                    BACK
                </button>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleNext}
                        disabled={currentStep === 2 && !file}
                        className={`
                            px-8 py-2.5 rounded-md font-medium text-white shadow-md transition-all
                            ${currentStep === 2 && !file
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#3A6D6C] hover:bg-[#2c5251]'
                            }
                        `}
                    >
                        {getActionButtonText()}
                    </button>

                    <button
                        onClick={handleClose}
                        className="bg-black text-white rounded-full p-1 hover:bg-gray-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Stepper */}
            <ImportStepper currentStep={currentStep} />

            {/* Content Card */}
            <div className="w-full flex-1 flex flex-col items-center justify-center mt-4">
                {renderStepContent()}
            </div>

            <ImportSuccessModal
                isOpen={showSuccessModal}
                onClose={handleModalClose}
                successCount={5}
                failureCount={3}
            />
        </div>
    );
};

export default ImportProperties;
