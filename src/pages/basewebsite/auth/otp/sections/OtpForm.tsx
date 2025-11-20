import React, { useState, useRef } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
interface OtpFormProps {
    email?: string;
    onSubmit?: (otp: string) => void | Promise<void>;
    onResend?: () => void | Promise<void>;
}

const OtpForm: React.FC<OtpFormProps> = ({ 
    email = 'nickjames@gmail.com', 
    onSubmit, 
    onResend 
}) => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        const otpCode = otp.join('');
        
        if (otpCode.length !== 6) {
            return; // Don't submit if OTP is incomplete
        }

        setIsSubmitting(true);
        try {
            if (onSubmit) {
                await onSubmit(otpCode);
            } else {
                console.log('OTP Submitted:', otpCode);
                // Default behavior: Handle OTP verification logic here
            }
        } catch (error) {
            console.error('OTP submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        try {
            if (onResend) {
                await onResend();
            } else {
                console.log('Resending OTP...');
                // Default behavior: Handle resend logic here
            }
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            console.error('OTP resend error:', error);
        }
    };

    return (
        <div className="w-full p-2 sm:p-10 lg:p-6 flex flex-col justify-center">
            <div className="text-left mb-8">
                <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">Enter your code</h2>
                <p className="text-gray-600 text-sm">
                    An email has been sent to<br />
                    <span className="font-medium">{email}</span> with a<br />
                    confirmation code. The code is valid for 5 minutes.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="text-right">
                    <button
                        type="button"
                        onClick={handleResend}
                        className="text-sm font-medium text-teal-500 hover:text-teal-600 hover:underline transition-colors"
                    >
                        Resend Code
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OtpForm;
