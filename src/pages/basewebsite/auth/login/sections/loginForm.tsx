import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../../../../assets/images/logo.png';
import { AppleIcon, FacebookIcon, GoogleIcon } from '../../../../../components/AuthIcons';
import { authService } from '../../../../../services/auth.service';

const LoginForm: React.FC = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const navigate = useNavigate();

    // Pre-fill email if redirected from signup
    useEffect(() => {
        if (location.state && typeof location.state === 'object' && 'email' in location.state) {
            setEmail(location.state.email as string);
        }
    }, [location.state]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = (password: string): boolean => {
        if (!password) {
            setPasswordError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Validate inputs
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.login(email, password);
            
            console.log('Login response:', {
                hasUser: !!response.user,
                requiresDeviceVerification: response.requiresDeviceVerification,
                hasToken: !!response.token,
                user: response.user
            });
            
            // Check if device verification is required
            if (response.requiresDeviceVerification) {
                // Redirect to OTP page for device verification
                console.log('Device verification required, redirecting to OTP');
                navigate(`/otp?userId=${response.user.id}&email=${response.user.email}&type=device`, { replace: true });
            } else {
                // Wait a moment to ensure cookie is set before navigation
                console.log('Login successful, waiting for cookie to be set...');
                await new Promise(resolve => setTimeout(resolve, 200));
                console.log('Navigating to dashboard');
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
            setError(errorMessage);
            
            // If it's a 401, provide more specific error
            if (err instanceof Error && errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
                setError('Invalid email or password. Please check your credentials and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full lg:w-1/2 p-2 sm:p-10 lg:p-6 flex flex-col justify-center">
            <div className="text-center lg:text-left mb-8">
                <img src={logo} alt="PMS Logo" className="h-8 w-8 mx-auto lg:mx-0 mb-2 brightness-0" />
                <h1 className="text-md font-body text-gray-800 font-bold mb-2">PMS</h1>
                <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">Sign in</h2>
                <p className="text-gray-600 text-sm">Sign in to your rental management software.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div>
                <label htmlFor="email-address" className="block text-xs font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all ${
                        emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
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
                {emailError && (
                    <p className="mt-1 text-xs text-red-600">{emailError}</p>
                )}
                </div>

                <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1 relative">
                    <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all ${
                        passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="********"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) validatePassword(e.target.value);
                    }}
                    onBlur={() => validatePassword(password)}
                    disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        disabled={isLoading}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {passwordError && (
                    <p className="mt-1 text-xs text-red-600">{passwordError}</p>
                )}
                </div>

                <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? 'Signing in...' : 'Continue'}
                </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                    OR
                    </span>
                </div>
                </div>

                <div className="mt-6 space-y-3">
                <button
                    type="button"
                    onClick={() => authService.initiateOAuth('google')}
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] gap-3"
                >
                    <GoogleIcon /> Sign in with Google
                </button>
                <button
                    type="button"
                    onClick={() => authService.initiateOAuth('apple')}
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] gap-3"
                >
                    <AppleIcon /> Sign in with Apple
                </button>
                <button
                    type="button"
                    onClick={() => authService.initiateOAuth('facebook')}
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] gap-3"
                >
                    <FacebookIcon /> Sign in with Facebook
                </button>
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-(--color-primary) hover:text-green-600 hover:underline transition-colors">
                Sign up
                </Link>
            </div>
            </div>
    );
};

export default LoginForm;

