import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Check, Plus, Trash2 } from 'lucide-react';
import { useGetAllProperties } from '@/hooks/usePropertyQueries';
import { authService } from '@/services/auth.service';
import { applicationService } from '@/services/application.service';

interface InviteToApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend?: (emails: string[], propertyId: string) => Promise<void>; // Optional for backward compatibility
}

interface EmailInput {
    id: string;
    value: string;
    error: string;
    checking: boolean;
    exists: boolean | null;
}

const InviteToApplyModal: React.FC<InviteToApplyModalProps> = ({ isOpen, onClose, onSend }) => {
    const [selectedPropertyId, setSelectedPropertyId] = useState('');
    const [emails, setEmails] = useState<EmailInput[]>([
        { id: '1', value: '', error: '', checking: false, exists: null }
    ]);
    const [generalError, setGeneralError] = useState('');
    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Fetch properties
    const { data: properties = [], isLoading } = useGetAllProperties(true, false);

    // Filter out properties that can be selected (e.g., must have units or be single family)
    // For now, listing all active properties
    const activeProperties = properties;

    const selectedProperty = activeProperties.find(p => p.id === selectedPropertyId);

    // Email validation regex (RFC 5322 simplified)
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Check if tenant email exists in database
    const checkEmailExists = async (emailId: string, email: string) => {
        if (!email.trim() || !validateEmail(email.trim())) {
            return;
        }

        const emailIndex = emails.findIndex(e => e.id === emailId);
        if (emailIndex === -1) return;

        setEmails(prev => prev.map((e, idx) => 
            idx === emailIndex 
                ? { ...e, checking: true, error: '', exists: null }
                : e
        ));

        try {
            const exists = await authService.checkTenantEmailExists(email.trim());
            setEmails(prev => prev.map((e, idx) => 
                idx === emailIndex 
                    ? { ...e, checking: false, exists, error: exists ? '' : 'This user is not registered as a tenant in the system' }
                    : e
            ));
        } catch (error) {
            setEmails(prev => prev.map((e, idx) => 
                idx === emailIndex 
                    ? { ...e, checking: false, error: 'Failed to check email. Please try again.' }
                    : e
            ));
        }
    };

    // Add new email input
    const addEmailInput = () => {
        if (emails.length >= 5) {
            setGeneralError('Maximum 5 emails allowed');
            return;
        }
        setEmails(prev => [...prev, { 
            id: Date.now().toString(), 
            value: '', 
            error: '', 
            checking: false,
            exists: null 
        }]);
        setGeneralError('');
    };

    // Remove email input
    const removeEmailInput = (id: string) => {
        if (emails.length === 1) {
            setGeneralError('At least one email is required');
            return;
        }
        setEmails(prev => prev.filter(e => e.id !== id));
        setGeneralError('');
    };

    // Update email value
    const updateEmail = (id: string, value: string) => {
        setEmails(prev => prev.map(e => 
            e.id === id 
                ? { ...e, value, error: '', exists: null }
                : e
        ));
        setGeneralError('');

        // Debounce email existence check
        if (value.trim() && validateEmail(value.trim())) {
            const timeoutId = setTimeout(() => {
                checkEmailExists(id, value);
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    };

    const handleSend = async () => {
        // Clear previous errors
        setGeneralError('');

        // Validate required fields
        if (!selectedPropertyId) {
            setGeneralError('Please select a property');
            return;
        }

        // Get valid emails
        const validEmails = emails
            .map(e => e.value.trim())
            .filter(email => {
                if (!email) return false;
                if (!validateEmail(email)) return false;
                return true;
            });

        if (validEmails.length === 0) {
            setGeneralError('Please enter at least one valid email address');
            return;
        }

        // Check if any emails don't exist as tenants
        const nonExistingEmails = emails.filter(e => 
            e.value.trim() && 
            validateEmail(e.value.trim()) && 
            e.exists === false
        );

        if (nonExistingEmails.length > 0) {
            const nonExistingList = nonExistingEmails.map(e => e.value).join(', ');
            setGeneralError(`The following emails are not registered as tenants: ${nonExistingList}. Please ensure users are registered as tenants.`);
            return;
        }

        // Check if we're still checking any emails
        const stillChecking = emails.some(e => e.checking);
        if (stillChecking) {
            setGeneralError('Please wait while we verify the emails');
            return;
        }

        // All validation passed, send invitation
        setIsSending(true);
        try {
            // Call the backend API to save and send invitations
            // This will save the invitation data to the database so only invited users see the invitations
            const result = await applicationService.inviteToApply(validEmails, selectedPropertyId);
            
            // Show success message with details
            if (result.nonExistingEmails.length > 0) {
                setGeneralError(`Warning: Some emails (${result.nonExistingEmails.join(', ')}) are not registered as tenants. Invitations were only sent to registered tenants.`);
                // Don't close modal if there were non-existing emails, so user can see the warning
            } else {
                // Success - reset form and close modal
                setEmails([{ id: '1', value: '', error: '', checking: false, exists: null }]);
                setSelectedPropertyId('');
                setGeneralError('');
                onClose();
            }
            
            // If parent component provided onSend callback, call it for backward compatibility
            // This allows parent components to handle additional logic (like showing toasts, refreshing data, etc.)
            if (onSend) {
                try {
                    await onSend(validEmails, selectedPropertyId);
                } catch (callbackError) {
                    // Don't fail the whole operation if callback fails
                    console.warn('onSend callback failed:', callbackError);
                }
            }
        } catch (error) {
            // Error handling - show error message to user
            const errorMessage = error instanceof Error ? error.message : 'Failed to send invitation. Please try again.';
            setGeneralError(errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-lg font-medium">Invite applicants to apply online</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                    {/* Select Property */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Select property*</label>
                        <div className="relative">
                            <button
                                onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-[#7BD747] text-white rounded-lg hover:bg-[#6bc13d] transition-colors focus:outline-none"
                            >
                                <span className="font-medium truncate">
                                    {selectedProperty ? selectedProperty.propertyName : 'Listed Property'}
                                </span>
                                <ChevronDown size={20} className={`transition-transform ${isPropertyDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isPropertyDropdownOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">Loading properties...</div>
                                    ) : activeProperties.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">No properties found</div>
                                    ) : (
                                        activeProperties.map(property => (
                                            <button
                                                key={property.id}
                                                onClick={() => {
                                                    setSelectedPropertyId(property.id);
                                                    setIsPropertyDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                                            >
                                                <span className="text-gray-700 text-sm font-medium truncate">{property.propertyName}</span>
                                                {selectedPropertyId === property.id && (
                                                    <Check size={16} className="text-[#7BD747]" />
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Applicants */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">Add applicants* (Max 5)</label>
                            {emails.length < 5 && (
                                <button
                                    onClick={addEmailInput}
                                    className="flex items-center gap-1 text-sm text-[#3A6D6C] hover:text-[#2c5251] font-medium"
                                >
                                    <Plus size={16} />
                                    Add Email
                                </button>
                            )}
                        </div>
                        
                        <div className="space-y-3">
                            {emails.map((emailInput, index) => (
                                <div key={emailInput.id} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="email"
                                            value={emailInput.value}
                                            onChange={(e) => updateEmail(emailInput.id, e.target.value)}
                                            placeholder={`Enter applicant email ${index + 1}`}
                                            className={`flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all font-medium ${
                                                emailInput.error || (emailInput.exists === false)
                                                    ? 'bg-red-50 text-red-900 placeholder:text-red-400 border-2 border-red-500 focus:ring-red-500/50'
                                                    : emailInput.exists === true
                                                    ? 'bg-green-50 text-green-900 border-2 border-green-500 focus:ring-green-500/50'
                                                    : 'bg-[#7BD747] text-white placeholder:text-white/80 focus:ring-[#7BD747]/50'
                                            }`}
                                            disabled={isSending}
                                        />
                                        {emails.length > 1 && (
                                            <button
                                                onClick={() => removeEmailInput(emailInput.id)}
                                                className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                disabled={isSending}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    {emailInput.checking && (
                                        <p className="text-xs text-gray-500 italic">Checking if user exists...</p>
                                    )}
                                    {emailInput.exists === true && !emailInput.error && (
                                        <p className="text-xs text-green-600 font-medium">✓ Tenant user exists</p>
                                    )}
                                    {emailInput.error && (
                                        <p className="text-xs text-red-600 font-medium">{emailInput.error}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {generalError && (
                            <p className="text-sm text-red-600 font-medium mt-2">{generalError}</p>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#4A5568] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2d3748] transition-colors shadow-sm disabled:opacity-50"
                        disabled={isSending}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        className="flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        disabled={isSending}
                    >
                        {isSending ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Sending...
                            </>
                        ) : (
                            'Send invitation'
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default InviteToApplyModal;
