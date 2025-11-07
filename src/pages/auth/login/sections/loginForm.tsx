import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../../assets/images/logo.png';
import { AppleIcon, FacebookIcon, GoogleIcon } from '../../../../components/AuthIcons';

const LoginForm: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { fullName, email, password });
        // Handle login logic here
    };

    return (
        <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-6 flex flex-col justify-center">
            <div className="text-center lg:text-left mb-8">
                <img src={logo} alt="PMS Logo" className="h-8 w-8 mx-auto lg:mx-0 mb-2 brightness-0" />
                <h1 className="text-md font-body text-gray-800 font-bold mb-2">PMS</h1>
                <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">Sign in</h2>
                <p className="text-gray-600 text-sm">Sign in to your rental management software.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label htmlFor="full-name" className="block text-xs font-medium text-gray-700">
                    Full name
                </label>
                <div className="mt-1">
                    <input
                    id="full-name"
                    name="full-name"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                </div>

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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                </div>

                <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                </div>

                <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-(--color-primary) hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-primary)"
                >
                    Continue
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
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <GoogleIcon /> Create with Google
                </button>
                <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <AppleIcon /> Create with Apple
                </button>
                <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <FacebookIcon /> Create with Facebook
                </button>
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-(--color-primary) hover:text-green-600 hover:underline">
                Sign up
                </Link>
            </div>
            </div>
    );
};

export default LoginForm;

