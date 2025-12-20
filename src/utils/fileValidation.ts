/**
 * Shared file validation utilities for transaction modals
 */

// Maximum file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed MIME types for file uploads (documents and images)
export const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validates a file against size and type constraints
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export const validateFile = (file: File): FileValidationResult => {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: 'File size must be less than 10MB'
        };
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
        return {
            isValid: false,
            error: 'Please upload a PDF, image, or Word document'
        };
    }

    return { isValid: true };
};

/**
 * Check if a file is valid (convenience wrapper)
 * @param file - The file to check
 * @returns true if file is valid
 */
export const isValidFile = (file: File): boolean => {
    return validateFile(file).isValid;
};
