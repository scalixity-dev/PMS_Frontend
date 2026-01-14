
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';

import logo from '../../../../assets/images/logo.png';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'fullName') {
            if (!value.trim()) {
                error = 'Full Name is required';
            } else if (value.length < 3) {
                error = 'Full Name must be at least 3 characters';
            }
        }
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
            } else if (value.length < 6) {
                error = 'Password must be at least 6 characters';
            }
        }
        if (name === 'confirmPassword') {
            if (value !== formData.password) {
                error = 'Passwords do not match';
            }
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;

        if (name === 'fullName') {
            value = value.replace(/\d/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof typeof errors]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateField(e.target.name, e.target.value);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { fullName: '', email: '', password: '', confirmPassword: '' };

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
            isValid = false;
        } else if (formData.fullName.length < 3) {
            newErrors.fullName = 'Full Name must be at least 3 characters';
            isValid = false;
        }

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
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // TODO: Implement registration logic
            console.log('Register data:', formData);
            navigate('/service-dashboard/login');
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
                    <h1 className="mb-2 text-3xl font-bold text-black">Register</h1>
                    <p className="text-gray-500">Please enter your Full Name, Login and your Password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                className={`w-full rounded-lg border py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#4CAF50] focus:ring-[#4CAF50]'}`}
                                value={formData.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>
                        {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                    </div>

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

                    <div>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Re-enter Password"
                                className={`w-full rounded-lg border py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#4CAF50] focus:ring-[#4CAF50]'}`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>
                    <div className="mt-1 flex justify-end">
                        <span className="text-xs text-transparent select-none">Forgot password?</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[#4CAF50] py-3 font-semibold text-white shadow-[0_10px_20px_-10px_rgba(76,175,80,1)] transition-transform hover:scale-[1.02] hover:bg-[#388E3C] outline-none"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <span className="text-black font-bold">Already have an Account? </span>
                    <Link to="/service-dashboard/login" className="font-semibold text-[#4CAF50] hover:underline">
                        Login!
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
