import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Loader2 } from 'lucide-react';
import ImportStepper from './components/ImportStepper';
import TemplateStep from './steps/TemplateStep';
import UploadStep from './steps/UploadStep';
import ValidationStep from './steps/ValidationStep';
import MappingStep from './steps/MappingStep';
import ImportSuccessModal from './components/ImportSuccessModal';
import { propertyService } from '../../../../../services/property.service';

interface ValidationError {
    row: number;
    error: string;
}

interface ImportResult {
    total: number;
    successful: number;
    failed: number;
    errors: ValidationError[];
    jobId: string | null;
    message: string;
}

const ImportProperties: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [fileHeaders, setFileHeaders] = useState<string[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
    const [importFirstRow, setImportFirstRow] = useState(true);

    const handleNext = async () => {
        if (currentStep === 2 && file) {
            // After file upload, validate only (don't import yet)
            await handleValidate();
        } else if (currentStep === 3) {
            // After validation, go to mapping step
            setCurrentStep(4);
        } else if (currentStep === 4) {
            // After mapping, actually import the properties
            await handleImport();
        } else if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
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

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/dashboard/properties');
    };

    const handleValidate = async () => {
        if (!file) return;

        setIsValidating(true);
        setError(null);
        setValidationErrors([]);

        try {
            // Validate the file using the backend (validate-only endpoint)
            const result = await propertyService.validateExcel(file);
            
            // Store validation results and headers
            setImportResult({
                total: result.total,
                successful: result.successful,
                failed: result.failed,
                errors: result.errors,
                jobId: null, // No job ID for validation
                message: result.message,
            });
            setValidationErrors(result.errors);
            setFileHeaders(result.headers);
            
            // Go to validation step
            setCurrentStep(3);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to validate file';
            setError(errorMessage);
            console.error('Validation error:', err);
        } finally {
            setIsValidating(false);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setIsImporting(true);
        setError(null);

        try {
            // Now actually import the properties (this will validate and queue)
            // Pass field mappings and importFirstRow option
            const result = await propertyService.importFromExcel(file, fieldMappings, importFirstRow);
            setImportResult(result);
            
            // Update validation errors with any new errors from import
            setValidationErrors(result.errors);
            
            // Check if import was successful (jobId indicates properties were queued)
            // The backend returns successful: 0 because properties are queued, not immediately created
            const hasQueuedProperties = result.jobId !== null;
            const hasErrors = result.errors.length > 0;
            const totalRows = result.total || 0;
            
            if (hasQueuedProperties) {
                // Some or all properties were queued successfully
                // Show success modal even if there are some errors (partial success)
                setShowSuccessModal(true);
            } else if (hasErrors && totalRows > 0) {
                // All failed - go back to validation step to show errors
                setError('All properties failed to import. Please check the validation errors below.');
                setCurrentStep(3); // Go back to validation step to show errors
            } else if (totalRows === 0) {
                // No valid rows found
                setError('No valid properties found in the file. Please check your Excel file format.');
                setCurrentStep(3);
            } else {
                // No errors but also no jobId - this shouldn't happen, but handle it
                setError('Import completed but no properties were processed. Please try again.');
                setCurrentStep(3);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to import properties';
            setError(errorMessage);
            console.error('Import error:', err);
            // If there are validation errors from a previous validation, show them
            if (validationErrors.length > 0) {
                setCurrentStep(3); // Go back to validation step
            }
        } finally {
            setIsImporting(false);
        }
    };

    const getActionButtonText = () => {
        if (isImporting) {
            return 'Importing...';
        }
        if (isValidating) {
            return 'Validating...';
        }
        switch (currentStep) {
            case 1: return "I'm ready to import";
            case 2: return file ? "Validate File" : "Next";
            case 3: return "Continue to Mapping";
            case 4: return "Import Properties";
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
                return <ValidationStep errors={validationErrors} importResult={importResult} />;
            case 4:
                return (
                    <MappingStep 
                        fileHeaders={fileHeaders} 
                        onMappingChange={setFieldMappings}
                        importFirstRow={importFirstRow}
                        onImportFirstRowChange={setImportFirstRow}
                    />
                );
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
                    {error && (
                        <div className="text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={(currentStep === 2 && !file) || isImporting || isValidating}
                        className={`
                            px-8 py-2.5 rounded-md font-medium text-white shadow-md transition-all flex items-center gap-2
                            ${(currentStep === 2 && !file) || isImporting || isValidating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#3A6D6C] hover:bg-[#2c5251]'
                            }
                        `}
                    >
                        {(isImporting || isValidating) && <Loader2 className="w-4 h-4 animate-spin" />}
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
                successCount={importResult?.successful || 0}
                failureCount={importResult?.failed || 0}
                total={importResult?.total || 0}
                jobId={importResult?.jobId || null}
            />
        </div>
    );
};

export default ImportProperties;
