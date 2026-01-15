
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

import logo from '../../../../assets/images/logo.png';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({ email: '', password: '' });

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value.trim()) {
                error = 'Email is required';
            } else if (!emailRegex.test(value)) {
                error = 'Invalid email format';
            }
        }
        if (name === 'password') {
            if (!value) {
                error = 'Password is required';
            }
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name as keyof typeof errors]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateField(e.target.name, e.target.value);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // TODO: Implement login logic
            console.log('Login data:', formData);
            // Navigate to Welcome page with user data
            // Mocking name since we don't have it on login without backend
            navigate('/service-dashboard/welcome', {
                state: {
                    fullName: 'Nihal Puse', // Using dummy name for now as requested/mock
                    email: formData.email,
                    invited: false
                }
            });
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
            {/* Background Abstract Shapes */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#4CAF50] md:h-96 md:w-96"></div>
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#4CAF50] md:h-[500px] md:w-[500px]"></div>
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#4CAF50] md:h-64 md:w-64"></div>

            <div className="z-10 w-full max-w-md px-6">
                <div className="mb-8 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <img src={logo} alt="PMS Logo" className="h-10 w-10" />
                        <span className="text-2xl font-bold text-black">PMS</span>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-black">Login</h1>
                    <p className="text-gray-500">Please enter your Email and your Password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className={`w-full rounded-lg border py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#4CAF50] focus:ring-[#4CAF50]'}`}
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                className={`w-full rounded-lg border py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#4CAF50] focus:ring-[#4CAF50]'}`}
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>
                    <div className="mt-1 flex justify-end">
                        <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-gray-700">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[#4CAF50] py-3 font-semibold text-white shadow-[0_10px_20px_-10px_rgba(76,175,80,1)] transition-transform hover:scale-[1.02] hover:bg-[#388E3C] outline-none"
                    >
                        Login
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">OR</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign in with Google
                </button>

                <div className="mt-8 text-center text-sm">
                    <span className="text-black font-semibold">Not a member yet? </span>
                    <Link to="/service-dashboard/signup" className="font-semibold text-[#4CAF50] hover:underline">
                        Register!
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default Login;
