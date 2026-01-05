import React, { useState, useRef } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
interface OtpFormProps {
    email?: string;
    onSubmit?: (otp: string) => void | Promise<void>;
    onResend?: () => void | Promise<void>;
    otpType?: 'email' | 'device';
}

const OtpForm: React.FC<OtpFormProps> = ({ 
    email = 'nickjames@gmail.com', 
    onSubmit, 
    onResend,
    otpType = 'email'
}) => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        // Only allow single digit
        if (value.length > 1) {
            value = value.slice(-1);
        }

        // Only allow numbers
        if (value && !/^\d$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        
        if (!/^\d+$/.test(pastedData)) {
            return;
        }

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length && i < 6; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        // Focus last filled input or next empty
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('').trim();
        
        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return; // Don't submit if OTP is incomplete
        }

        // Validate that all characters are digits
        if (!/^\d{6}$/.test(otpCode)) {
            setError('OTP code must contain only numbers');
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            if (onSubmit) {
                await onSubmit(otpCode);
            } else {
                console.log('OTP Submitted:', otpCode);
                // Default behavior: Handle OTP verification logic here
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'OTP verification failed. Please try again.';
            setError(errorMessage);
            console.error('OTP submission error:', error);
            // Clear OTP on error
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setResendSuccess(false);
        try {
            if (onResend) {
                await onResend();
                setResendSuccess(true);
                // Clear success message after 3 seconds
                setTimeout(() => setResendSuccess(false), 3000);
            } else {
                console.log('Resending OTP...');
                // Default behavior: Handle resend logic here
            }
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP. Please try again.';
            setError(errorMessage);
            console.error('OTP resend error:', error);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="w-full sm:p-10 lg:p-6 flex flex-col justify-center">
            <div className="text-left mb-8">
                <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                    {otpType === 'device' ? 'Verify New Device' : 'Enter your code'}
                </h2>
                <p className="text-gray-600 text-sm">
                    {otpType === 'device' ? (
                        <>
                            We detected a login from a new device.<br />
                            An email has been sent to <span className="font-medium">{email}</span><br />
                            with a verification code. The code is valid for 10 minutes.
                        </>
                    ) : (
                        <>
                            An email has been sent to<br />
                            <span className="font-medium">{email}</span> with a<br />
                            confirmation code. The code is valid for 10 minutes.
                        </>
                    )}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}
                {resendSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                        OTP has been resent to your email. Please check your inbox.
                    </div>
                )}
                <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            placeholder="-"
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            disabled={isSubmitting}
                            className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 ${
                                digit ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-gray-800 border-gray-300 focus:border-teal-500'
                            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || otp.join('').length !== 6}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isSubmitting ? 'Verifying...' : 'Verify Code'}
                    </button>
                    
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-sm font-medium text-teal-500 hover:text-teal-600 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResending ? 'Sending...' : 'Resend Code'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OtpForm;
