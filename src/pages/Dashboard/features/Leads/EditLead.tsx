import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const EditLead = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [leadType, setLeadType] = useState<'Hot' | 'Cold'>('Hot');

    // Pre-filled data (loaded from storage when available)
    const [formData, setFormData] = useState({
        fullName: 'Sam',
        phone: '+91 7049770293',
        email: 'abc@gmail.com'
    });

    useEffect(() => {
        const stored = localStorage.getItem(`lead_${id || 1}`);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as {
                    fullName?: string;
                    phone?: string;
                    email?: string;
                    leadType?: 'Hot' | 'Cold';
                };

                setFormData({
                    fullName: parsed.fullName ?? 'Sam',
                    phone: parsed.phone ?? '+91 7049770293',
                    email: parsed.email ?? 'abc@gmail.com'
                });

                if (parsed.leadType === 'Hot' || parsed.leadType === 'Cold') {
                    setLeadType(parsed.leadType);
                }
            } catch {
                // Ignore parse errors and keep defaults
            }
        }
    }, [id]);

    const handleSave = () => {
        // For demo purposes, save to localStorage
        const leadData = {
            ...formData,
            leadType
        };
        localStorage.setItem(`lead_${id || 1}`, JSON.stringify(leadData));

        // Return to detail page
        navigate(`/dashboard/leasing/leads/${id || 1}`);
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] ml-2 border border-white/20">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/leasing/leads')}>Leads</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Edit Lead</span>
            </div>

            <div className="p-8 bg-[#E0E8E7] min-h-[600px] rounded-[2.5rem] shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-2 mb-8 ml-2">
                    <button onClick={() => navigate(-1)} className="p-1 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Edit lead details</h1>
                </div>

                {/* Main Form Container */}
                <div className="bg-[#F0F0F6] rounded-[2rem] overflow-hidden border border-gray-200 shadow-sm">
                    {/* Form Sub-header */}
                    <div className="bg-[#3A6D6C] px-8 py-5">
                        <h2 className="text-white text-lg font-medium font-outfit">Please, update the form below</h2>
                    </div>

                    {/* Form Fields */}
                    <div className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {/* Full Name */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-800 ml-1">Full Name*</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Full Name"
                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none shadow-sm placeholder:text-gray-400 font-medium"
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-800 ml-1">Phone Number*</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Phone Number"
                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none shadow-sm placeholder:text-gray-400 font-medium"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-800 ml-1">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter Email"
                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none shadow-sm placeholder:text-gray-400 font-medium"
                                />
                            </div>

                            {/* Lead Type Selection */}
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-800 ml-1">Lead type *</label>
                                <div className="flex gap-6">
                                    <button
                                        onClick={() => setLeadType('Hot')}
                                        className={`w-32 flex items-center justify-center gap-3 py-3 rounded-full font-bold text-white transition-all shadow-sm ${leadType === 'Hot' ? 'bg-[#82D95B]' : 'bg-gray-400'}`}
                                    >
                                        <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                                            {leadType === 'Hot' && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                        Hot
                                    </button>
                                    <button
                                        onClick={() => setLeadType('Cold')}
                                        className={`w-32 flex items-center justify-center gap-3 py-3 rounded-full font-bold text-white transition-all shadow-sm ${leadType === 'Cold' ? 'bg-[#82D95B]' : 'bg-gray-400'}`}
                                    >
                                        <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                                            {leadType === 'Cold' && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                        Cold
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <button
                                onClick={handleSave}
                                className="bg-[#457B7A] text-white px-12 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-[#386463] transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLead;
