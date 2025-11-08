import React from 'react';
import { GoogleIcon, AppleIcon, FacebookIcon } from '../../../../components/AuthIcons'
import type { EmailSignupProps } from './signUpProps';

export const EmailSignup: React.FC<EmailSignupProps> = ({ onNext, formData, setFormData }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg text-gray-900 m-auto">
      <div className="text-center">
        <h2 className="text-2xl font-semibold font-heading">Start your free 14-day trial</h2>
        <p className="mt-2 text-sm text-gray-600">Continue with email or another provider.</p>
      </div>
      
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!formData.email}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-(--color-primary) hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      <div className="space-y-3">
        <button type="button" className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          <GoogleIcon /> Create with Google
        </button>
        <button type="button" className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          <AppleIcon /> Create with Apple
        </button>
        <button type="button" className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          <FacebookIcon /> Create with Facebook
        </button>
      </div>
      
      <p className="mt-6 text-xs text-center text-gray-500">
        By creating an account you are agreeing to our  
        <a href="#" className="font-medium text-green-600 hover:text-green-500"> Terms and Conditions</a> & 
        <a href="#" className="font-medium text-green-600 hover:text-green-500"> Privacy Policy</a>.
      </p>
    </div>
  );
};