import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfessionDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { professionId, professionLabel } = location.state || { professionId: 'cleaning', professionLabel: 'Cleaning' };

    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    // Mock services data structure
    const servicesMap: Record<string, string[]> = {
        cleaning: ['Carpet Clean', 'House Cleaning', 'Debris', 'Carpet', 'Exterior', 'Window', 'Commercial Cleaning Service'],
        general: ['Inspection', 'Consultation', 'Maintenance'],
        handyman: ['Assembly', 'Repairs', 'Installation', 'Drywall'],
        home_services: ['Painting', 'Moving', 'Gardening'],
        landlord: ['Tenant Screening', 'Rent Collection', 'Eviction Services'],
        plumbing: ['Leak Repair', 'Pipe Installation', 'Drain Cleaning', 'Water Heater'],
    };

    const currentServices = servicesMap[professionId as string] || servicesMap['cleaning'];

    const toggleService = (service: string) => {
        if (selectedServices.includes(service)) {
            setSelectedServices(selectedServices.filter(s => s !== service));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleFinish = () => {
        // Here you would typically save the user's profession and services to the backend
        navigate('/service-dashboard', { state: { selectedServices } }); // Or wherever the main dashboard is
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 overflow-hidden">
            {/* Background Abstract Shapes */}
            <motion.div
                initial={{ x: 100, y: -100 }}
                animate={{ x: 200, y: -200 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#4CAF50] md:h-[600px] md:w-[600px]"
            ></motion.div>
            <motion.div
                initial={{ x: -100, y: 100 }}
                animate={{ x: -200, y: 200 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#4CAF50] md:h-[500px] md:w-[500px]"
            ></motion.div>

            <div className="z-10 flex w-full max-w-4xl flex-col items-center">
                <h1 className="mb-2 text-3xl font-bold text-[#2c3e50]">{professionLabel || 'Profession'}</h1>
                <p className="mb-12 text-gray-500">Select Services you can provide</p>

                <div className="flex flex-wrap justify-center gap-4">
                    {currentServices.map((service) => (
                        <button
                            key={service}
                            onClick={() => toggleService(service)}
                            className={`rounded-lg border px-6 py-2 transition-colors ${selectedServices.includes(service) ? 'border-[#7BD747] bg-[#7BD747] text-white shadow-md' : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'}`}
                        >
                            {service}
                        </button>
                    ))}
                </div>

                <div className="mt-16 w-full max-w-40">
                    <button
                        onClick={handleFinish}
                        className="w-full rounded-lg bg-[#7CD947] border border-white border-2 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#7CB342] focus:outline-none"
                    >
                        Finish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfessionDetails;
