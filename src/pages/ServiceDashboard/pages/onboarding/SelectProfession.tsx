import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Microwave, Lightbulb, Grid, Brush, Trees, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const SelectProfession: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Preserve user data
    const userData = location.state || {};

    const [selectedProfession, setSelectedProfession] = useState<string | null>(null);

    const professions = [
        { id: 'cleaning', label: 'Cleaning', icon: Microwave },
        { id: 'general', label: 'General Provider', icon: Lightbulb },
        { id: 'handyman', label: 'Handyman & Repair', icon: Grid }, // Using Grid as a placeholder for Window/Pane
        { id: 'home_services', label: 'Home Services', icon: Brush }, // Using Brush for Broom-like
        { id: 'landlord', label: 'Landlord Services', icon: Trees },
        { id: 'plumbing', label: 'Plumbing', icon: Wrench }, // Using Wrench (Faucet not standard)
    ];

    interface ProfessionOption {
        id: string;
        label: string;
        icon: any;
    }

    const handleSelect = (option: ProfessionOption) => {
        setSelectedProfession(option.id);
        // data persistence logic here if needed
        setTimeout(() => {
            navigate('/service-dashboard/profession-details', { state: { ...userData, profession: option } });
        }, 300); // 300ms delay for visual feedback
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 overflow-hidden">
            {/* Background Abstract Shapes */}
            <motion.div
                initial={{ x: 0, y: 0 }}
                animate={{ x: 100, y: -100 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#4CAF50] md:h-[600px] md:w-[600px]"
            ></motion.div>
            <motion.div
                initial={{ x: 0, y: 0 }}
                animate={{ x: -100, y: 100 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#4CAF50] md:h-[500px] md:w-[500px]"
            ></motion.div>

            <div className="z-10 flex w-full max-w-4xl flex-col items-center">
                <h1 className="mb-2 text-3xl font-bold text-[#2c3e50]">Your Profession</h1>
                <p className="mb-12 text-gray-500">Start Selecting the category to define the issue</p>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8">
                    {professions.map((prof) => (
                        <div
                            key={prof.id}
                            onClick={() => {
                                handleSelect(prof);
                            }}
                            className={`relative flex h-28 w-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 shadow-sm transition-all hover:shadow-md md:h-36 md:w-48 bg-white ${selectedProfession === prof.id ? 'border-[#4CAF50]' : 'border-gray-200'}`}
                        >
                            <prof.icon
                                size={48}
                                className={`mb-3 ${selectedProfession === prof.id ? 'text-[#4CAF50]' : 'text-black'}`}
                                strokeWidth={1.5}
                            />
                            <span className="text-center text-base font-medium text-black">{prof.label}</span>

                            {/* Selection Indicator Circle */}
                            <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border border-gray-200 ${selectedProfession === prof.id ? 'bg-[#8BC34A]' : 'bg-white'}`}></div>
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <button className="text-[#8BC34A] hover:underline">Other</button>
                </div>
            </div>
        </div>
    );
};

export default SelectProfession;
