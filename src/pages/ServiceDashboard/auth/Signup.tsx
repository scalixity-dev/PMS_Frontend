
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail } from 'lucide-react';
import Button from '../../../components/common/Button';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        // TODO: Implement registration logic
        console.log('Register data:', formData);
        navigate('/service-dashboard/login');
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
            {/* Background Abstract Shapes */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#4CAF50] opacity-90 blur-sm md:h-96 md:w-96"></div>
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#4CAF50] opacity-90 blur-sm md:h-[500px] md:w-[500px]"></div>

            <div className="z-10 w-full max-w-md px-6">
                <div className="mb-8 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        {/* Abstract Logo */}
                        <div className="h-10 w-10 overflow-hidden rounded-bl-xl rounded-tr-xl bg-black">
                            <div className="h-full w-full bg-black"></div>
                        </div>
                        <span className="text-2xl font-bold text-black">PMS</span>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-black">Register</h1>
                    <p className="text-gray-500">Please enter your Name, Login and your Password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <User size={20} />
                        </div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Mail size={20} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Lock size={20} />
                        </div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Lock size={20} />
                        </div>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter Password"
                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <div className="mt-1 flex justify-end">
                            <span className="text-xs text-transparent select-none">Forgot password?</span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-lg bg-[#4CAF50] py-3 font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-[#43A047]"
                    >
                        Register
                    </Button>
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
