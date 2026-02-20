import React, { useState, useRef } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../../../assets/images/logo.png';
import { authService } from '../../../../../services/auth.service';

type Step = 'email' | 'otp' | 'done';

const OTP_LENGTH = 6;

const ForgotPasswordForm: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const validateEmail = (value: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            setEmailError('Email is required');
            return false;
        }
        if (!emailRegex.test(value)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = (value: string): boolean => {
        if (!value) {
            setPasswordError('New password is required');
            return false;
        }
        if (value.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const validateConfirmPassword = (value: string): boolean => {
        if (!value) {
            setConfirmPasswordError('Please confirm your password');
            return false;
        }
        if (value !== newPassword) {
            setConfirmPasswordError('Passwords do not match');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validateEmail(email)) return;
        setIsLoading(true);
        try {
            await authService.requestPasswordReset(email);
            setStep('otp');
            setOtp(Array(OTP_LENGTH).fill(''));
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
            setConfirmPasswordError('');
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (value && !/^\d$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').slice(0, OTP_LENGTH);
        if (!/^\d+$/.test(pasted)) return;
        const newOtp = [...otp];
        for (let i = 0; i < pasted.length && i < OTP_LENGTH; i++) newOtp[i] = pasted[i];
        setOtp(newOtp);
        const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        setError('');
        try {
            await authService.requestPasswordReset(email);
            setOtp(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend OTP.');
        } finally {
            setIsResending(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const otpCode = otp.join('').trim();
        if (otpCode.length !== OTP_LENGTH || !/^\d{6}$/.test(otpCode)) {
            setError('Please enter the complete 6-digit code from your email.');
            return;
        }
        if (!validatePassword(newPassword) || !validateConfirmPassword(confirmPassword)) return;
        setIsLoading(true);
        try {
            await authService.resetPassword(email, otpCode, newPassword);
            setStep('done');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
            setOtp(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'done') {
        return (
            <div className="w-full lg:w-1/2 p-2 sm:p-10 lg:p-6 flex flex-col justify-center">
                <div className="text-center lg:text-left mb-8">
                    <img src={logo} alt="SmartTenantAI Logo" className="h-8 w-8 mx-auto lg:mx-0 mb-2 brightness-0" />
                    <h1 className="text-md font-body text-gray-800 font-bold mb-2">SmartTenantAI</h1>
                    <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">Password reset</h2>
                    <p className="text-gray-600 text-sm">Your password has been reset successfully. You can now sign in with your new password.</p>
                </div>
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm mb-6">
                    You can now sign in with your new password.
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    Back to sign in
                </button>
                <div className="mt-8 text-center text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link to="/login" className="font-medium text-[var(--color-primary)] hover:text-green-600 hover:underline transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 'otp') {
        return (
            <div className="w-full lg:w-1/2 p-2 sm:p-10 lg:p-6 flex flex-col justify-center">
                <div className="text-center lg:text-left mb-8">
                    <img src={logo} alt="SmartTenantAI Logo" className="h-8 w-8 mx-auto lg:mx-0 mb-2 brightness-0" />
                    <h1 className="text-md font-body text-gray-800 font-bold mb-2">SmartTenantAI</h1>
                    <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">Enter OTP & new password</h2>
                    <p className="text-gray-600 text-sm">
                        We've sent a 6-digit OTP to <span className="font-medium text-gray-800">{email}</span>. Enter it below and choose a new password.
                    </p>
                </div>

                <form onSubmit={handleResetSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">OTP code</label>
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    placeholder="-"
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={index === 0 ? handleOtpPaste : undefined}
                                    disabled={isLoading}
                                    className={`w-10 h-12 sm:w-12 sm:h-12 text-center text-lg font-semibold border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 ${
                                        digit ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-gray-800 border-gray-300 focus:border-teal-500'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="new-password" className="block text-xs font-medium text-gray-700">
                            New password
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value); if (passwordError) validatePassword(e.target.value); }}
                            onBlur={() => validatePassword(newPassword)}
                            disabled={isLoading}
                            placeholder="At least 6 characters"
                            className={`appearance-none block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all mt-1 ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-xs font-medium text-gray-700">
                            Confirm password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); if (confirmPasswordError) validateConfirmPassword(e.target.value); }}
                            onBlur={() => validateConfirmPassword(confirmPassword)}
                            disabled={isLoading}
                            placeholder="Re-enter new password"
                            className={`appearance-none block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all mt-1 ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {confirmPasswordError && <p className="mt-1 text-xs text-red-600">{confirmPasswordError}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || otp.join('').length !== OTP_LENGTH || !newPassword || !confirmPassword}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? 'Resetting password...' : 'Reset password'}
                    </button>

                    <div className="text-center flex flex-col gap-1">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isResending || isLoading}
                            className="text-sm font-medium text-[var(--color-primary)] hover:text-green-600 hover:underline transition-colors disabled:opacity-50"
                        >
                            {isResending ? 'Sending...' : 'Resend OTP'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStep('email'); setError(''); }}
                            disabled={isLoading}
                            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                            Use a different email
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link to="/login" className="font-medium text-[var(--color-primary)] hover:text-green-600 hover:underline transition-colors">
                        Back to sign in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-1/2 p-2 sm:p-10 lg:p-6 flex flex-col justify-center">
            <div className="text-center lg:text-left mb-8">
                <img src={logo} alt="SmartTenantAI Logo" className="h-8 w-8 mx-auto lg:mx-0 mb-2 brightness-0" />
                <h1 className="text-md font-body text-gray-800 font-bold mb-2">SmartTenantAI</h1>
                <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">Forgot password?</h2>
                <p className="text-gray-600 text-sm">Enter your email and we'll send you an OTP code to reset your password.</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="forgot-email" className="block text-xs font-medium text-gray-700">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="forgot-email"
                            name="email"
                            type="email"
                            required
                            className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) validateEmail(e.target.value);
                            }}
                            onBlur={() => validateEmail(email)}
                            disabled={isLoading}
                        />
                    </div>
                    {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-[var(--color-primary)] hover:text-green-600 hover:underline transition-colors">
                    Back to sign in
                </Link>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
