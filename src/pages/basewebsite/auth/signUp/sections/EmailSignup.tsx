import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon, AppleIcon, FacebookIcon } from '../../../../../components/AuthIcons'
import type { EmailSignupProps } from './signUpProps';
import { Link } from 'react-router-dom';
import { authService } from '../../../../../services/auth.service';
import { useSignUpStore } from '../store/signUpStore';
import { useCheckEmailExists } from '../../../../../hooks/useAuthQueries';


export const EmailSignup: React.FC<EmailSignupProps> = ({ onNext }) => {
  const { formData, updateFormData, nextStep } = useSignUpStore();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Use store's nextStep if onNext is not provided
  const handleNext = onNext || nextStep;

  // Use React Query to check email existence
  const {
    isLoading,
    refetch: checkEmail,
  } = useCheckEmailExists(formData.email || '', false); // Disabled by default, will be triggered manually

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Check if email already exists using React Query
      const result = await checkEmail();
      
      if (result.data === true) {
        // Email exists - redirect to login page
        navigate('/login', { 
          state: { email: formData.email },
          replace: true 
        });
      } else {
        // Email doesn't exist - proceed to registration form
        handleNext();
      }
    } catch (err) {
      console.error('Error checking email:', err);
      // On error, proceed to registration (fail open)
      // The registration endpoint will catch duplicate emails
      handleNext();
    }
  };

  // Get account type specific heading
  const getHeading = () => {
    switch (formData.accountType) {
      case 'manage':
        return 'Start your free 14-day trial';
      case 'renting':
      case 'fix':
      default:
        return null; // No heading for renting and fix account types
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md p-6 sm:p-8 md:p-10 space-y-5 sm:space-y-6 md:space-y-7 bg-white rounded-xl sm:rounded-2xl border border-gray-100 text-gray-900">
        <div className="text-center space-y-2 sm:space-y-3">
          {getHeading() && (
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold font-heading text-gray-900">
              {getHeading()}
            </h2>
          )}
          <p className="text-sm sm:text-base text-gray-600">Continue with email or another provider.</p>
        </div>
      
      <form
        className="space-y-4 sm:space-y-5"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email-address" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Email address
          </label>
          <div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email || ''}
              onChange={(e) => {
                updateFormData('email', e.target.value);
                setError(''); // Clear error when user types
              }}
              placeholder="Enter your email"
              className={`appearance-none block w-full px-4 py-3 sm:py-3.5 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base transition-all ${
                error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
              }`}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!formData.email || isLoading}
          className="w-full flex justify-center py-3 sm:py-3.5 px-4 border border-transparent rounded-lg text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
        >
          {isLoading ? 'Checking...' : 'Continue'}
        </button>
      </form>

      <div className="relative my-5 sm:my-6 md:my-7">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500 font-medium">OR</span>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-3.5">
        <button 
          type="button" 
          onClick={() => authService.initiateOAuth('google')}
          className="w-full inline-flex justify-center items-center py-3 sm:py-3.5 px-4 border-2 border-gray-200 rounded-lg bg-white text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <GoogleIcon />
          Create with Google
        </button>
        <button 
          type="button" 
          onClick={() => authService.initiateOAuth('apple')}
          className="w-full inline-flex justify-center items-center py-3 sm:py-3.5 px-4 border-2 border-gray-200 rounded-lg bg-white text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <AppleIcon />
          Create with Apple
        </button>
        <button 
          type="button" 
          onClick={() => authService.initiateOAuth('facebook')}
          className="w-full inline-flex justify-center items-center py-3 sm:py-3.5 px-4 border-2 border-gray-200 rounded-lg bg-white text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <FacebookIcon />
          Create with Facebook
        </button>
      </div>
      
      <div className="text-center text-sm sm:text-base text-gray-600 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors">
            Sign In
          </Link>
      </div>

      <p className="mt-5 sm:mt-6 md:mt-7 text-xs sm:text-sm text-center text-gray-500 leading-relaxed">
        By creating an account you are agreeing to our  
        <a href="#" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"> Terms and Conditions</a> & 
        <a href="#" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"> Privacy Policy</a>.
      </p>
      </div>
    </div>
  );
};