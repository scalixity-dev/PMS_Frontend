import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PrimaryActionButton from '../../../../components/common/buttons/PrimaryActionButton';
import { saveLead } from './utils/leadsStorage';

const AddLead = () => {
    const navigate = useNavigate();
    const [leadType, setLeadType] = useState<'Hot' | 'Cold'>('Hot');
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';

        // Enhanced phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone Number is required';
        } else {
            // Remove all non-digit characters to count actual digits
            const digitsOnly = formData.phone.replace(/\D/g, '');
            // Check if phone contains only valid characters (digits, spaces, dashes, parentheses, plus)
            const phoneRegex = /^[\d\s\-()+]+$/;

            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = 'Phone number can only contain digits, spaces, dashes, parentheses, and plus sign';
            } else if (digitsOnly.length < 10) {
                newErrors.phone = 'Phone number must contain at least 10 digits';
            } else if (digitsOnly.length > 15) {
                newErrors.phone = 'Phone number cannot exceed 15 digits';
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = () => {
        if (validateForm()) {
            try {
                // Use the utility function to save the lead
                const newLead = saveLead({
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    leadType
                });

                console.log('Lead created successfully:', newLead);

                // Navigate to the newly created lead's detail page
                navigate(`/dashboard/leasing/leads/${newLead.id}`);
            } catch (error) {
                console.error('Failed to create lead:', error);
                // TODO: Show error message to user
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] ml-2 border border-white/20">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/leasing/leads')}>Leads</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Add Leads</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-[500px] rounded-[2rem] shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6 ml-2">
                    <button onClick={() => navigate(-1)} className="p-1 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-800" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">Add a new lead</h1>
                </div>

                {/* Main Form Container */}
                <div className="bg-[#F0F0F6] rounded-[1.5rem] overflow-hidden border border-gray-200 shadow-sm">
                    {/* Form Sub-header */}
                    <div className="bg-[#3A6D6C] px-6 py-4">
                        <h2 className="text-white text-base font-medium font-outfit">Please, complete the form below</h2>
                    </div>

                    {/* Form Fields */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-800 ml-1">Full Name*</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Full Name"
                                    className={`w-full bg-white border ${errors.fullName ? 'border-red-500' : 'border-gray-100'} rounded-lg py-3 px-4 text-sm focus:outline-none shadow-sm placeholder:text-gray-400 font-medium`}
                                />
                                {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.fullName}</p>}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-800 ml-1">Phone Number*</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Phone Number"
                                    className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-100'} rounded-lg py-3 px-4 text-sm focus:outline-none shadow-sm placeholder:text-gray-400 font-medium`}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.phone}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-800 ml-1">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter Email"
                                    className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-100'} rounded-lg py-3 px-4 text-sm focus:outline-none shadow-sm placeholder:text-gray-400 font-medium`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
                            </div>

                            {/* Lead Type Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-800 ml-1">Lead type *</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setLeadType('Hot')}
                                        className="w-28 flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-white text-sm transition-all shadow-sm bg-[#82D95B]"
                                    >
                                        <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                                            {leadType === 'Hot' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        Hot
                                    </button>
                                    <button
                                        onClick={() => setLeadType('Cold')}
                                        className="w-28 flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-white text-sm transition-all shadow-sm bg-[#82D95B]"
                                    >
                                        <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                                            {leadType === 'Cold' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        Cold
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <PrimaryActionButton
                                onClick={handleCreate}
                                text="Create"
                                className="px-8 py-2.5 rounded-lg font-bold text-base shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLead;
