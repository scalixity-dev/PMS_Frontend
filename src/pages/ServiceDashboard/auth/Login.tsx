
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Chrome } from 'lucide-react';
import Button from '../../../components/common/Button';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement login logic
        console.log('Login data:', formData);
        navigate('/dashboard');
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
                    <h1 className="mb-2 text-3xl font-bold text-black">Login</h1>
                    <p className="text-gray-500">Please enter your Login and your Password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <User size={20} />
                        </div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username or Email"
                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                            value={formData.username}
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
                        <div className="mt-1 flex justify-end">
                            <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-gray-700">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-lg bg-[#4CAF50] py-3 font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-[#43A047]"
                    >
                        Login
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        {/* <div className="w-full border-t border-gray-300"></div> */}
                    </div>
                    {/* <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div> */}
                </div>

                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                >
                    <Chrome size={18} className="text-orange-500" /> {/* Simulate Google Icon color vaguely */}
                    Or, sign-in with Google
                </button>

                <div className="mt-8 text-center text-sm">
                    <span className="text-black font-semibold">Not a member yet? </span>
                    <Link to="/service-dashboard/signup" className="font-semibold text-[#4CAF50] hover:underline">
                        Register!
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
