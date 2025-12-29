import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PrimaryActionButton from '../../../../components/common/buttons/PrimaryActionButton';
import { useGetLead, useUpdateLead, useCreateActivity } from '../../../../hooks/useLeadQueries';
import type { LeadType, LeadStatus } from '../../../../services/lead.service';

const EditLead = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: lead, isLoading, error } = useGetLead(id || null, !!id);
    const updateLeadMutation = useUpdateLead();
    const createActivityMutation = useCreateActivity();
    const [leadType, setLeadType] = useState<LeadType>('HOT');
    const [originalLead, setOriginalLead] = useState<{ type?: LeadType | null; status?: string } | null>(null);

    // Pre-filled data (loaded from API)
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (lead) {
            setFormData({
                fullName: lead.name || '',
                phone: lead.phoneNumber || '',
                email: lead.email || ''
            });
            setLeadType(lead.type || 'HOT');
            // Store original values to detect changes
            setOriginalLead({
                type: lead.type || null,
                status: lead.status
            });
        }
    }, [lead]);

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

    const handleSave = async () => {
        if (validateForm() && !isSubmitting && id) {
            setIsSubmitting(true);
            try {
                const updateData: { name: string; phoneNumber: string; email: string; type?: LeadType; status?: LeadStatus } = {
                    name: formData.fullName,
                    phoneNumber: formData.phone,
                    email: formData.email,
                    type: leadType
                };

                await updateLeadMutation.mutateAsync({
                    id,
                    data: updateData
                });

                // Create activities for changes
                try {
                    const typeChanged = originalLead && originalLead.type !== leadType;
                    const statusChanged = updateData.status && originalLead && originalLead.status !== updateData.status;
                    const hasOtherChanges = !typeChanged && !statusChanged;

                    // Create activity for type change (HOT/COLD) - keep separate
                    if (typeChanged) {
                        try {
                            console.log('Creating activity for type change:', id);
                            const createdActivity = await createActivityMutation.mutateAsync({
                                leadId: id,
                                activityData: {
                                    activityType: 'OTHER',
                                    description: `Lead type changed from ${originalLead.type || 'N/A'} to ${leadType}`,
                                    metadata: {
                                        action: 'TYPE_CHANGED',
                                        oldType: originalLead.type,
                                        newType: leadType
                                    }
                                }
                            });
                            console.log('Activity created successfully for type change:', createdActivity);
                        } catch (err) {
                            console.error('Failed to create activity for type change:', err);
                        }
                    }

                    // Create activity for status change - keep separate
                    if (statusChanged) {
                        try {
                            console.log('Creating activity for status change:', id);
                            const createdActivity = await createActivityMutation.mutateAsync({
                                leadId: id,
                                activityData: {
                                    activityType: 'STATUS_CHANGE',
                                    description: `Lead status changed from ${originalLead.status || 'N/A'} to ${updateData.status}`,
                                    metadata: {
                                        action: 'STATUS_CHANGED',
                                        oldStatus: originalLead.status,
                                        newStatus: updateData.status
                                    }
                                }
                            });
                            console.log('Activity created successfully for status change:', createdActivity);
                        } catch (err) {
                            console.error('Failed to create activity for status change:', err);
                        }
                    }

                    // If lead was edited (other changes, not type or status), create one general edit activity
                    if (hasOtherChanges) {
                        try {
                            console.log('Creating activity for lead edit:', id);
                            const createdActivity = await createActivityMutation.mutateAsync({
                                leadId: id,
                                activityData: {
                                    activityType: 'OTHER',
                                    description: `Lead was edited`,
                                    metadata: {
                                        action: 'LEAD_EDITED'
                                    }
                                }
                            });
                            console.log('Activity created successfully for lead edit:', createdActivity);
                        } catch (err) {
                            console.error('Failed to create activity for lead edit:', err);
                        }
                    }
                } catch (activityError) {
                    console.error('Failed to create activity for lead update:', activityError);
                    alert(`Warning: Lead updated but failed to log activity: ${activityError instanceof Error ? activityError.message : 'Unknown error'}`);
                    // Don't block navigation if activity creation fails
                }

                // Return to detail page
                navigate(`/dashboard/leasing/leads/${id}`);
            } catch (error) {
                console.error('Failed to update lead:', error);
                setErrors({ 
                    submit: error instanceof Error ? error.message : 'Failed to update lead. Please try again.' 
                });
            } finally {
                setIsSubmitting(false);
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
                <span className="text-gray-600 text-sm font-semibold">Edit Lead</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-[500px] rounded-[2rem] shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6 ml-2">
                    <button onClick={() => navigate(-1)} className="p-1 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Edit lead details</h1>
                </div>

                {isLoading ? (
                    <div className="bg-[#F0F0F6] rounded-[1.5rem] p-8 text-center">
                        <p className="text-gray-500">Loading lead details...</p>
                    </div>
                ) : error ? (
                    <div className="bg-[#F0F0F6] rounded-[1.5rem] p-8 text-center">
                        <p className="text-red-500">Error loading lead</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {error instanceof Error ? error.message : 'An unexpected error occurred'}
                        </p>
                    </div>
                ) : (
                /* Main Form Container */
                <div className="bg-[#F0F0F6] rounded-[1.5rem] overflow-hidden border border-gray-200 shadow-sm">
                    {/* Form Sub-header */}
                    <div className="bg-[#3A6D6C] px-6 py-4">
                        <h2 className="text-white text-base font-medium font-outfit">Please, update the form below</h2>
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
                                    className={`w-full bg-white border ${errors.fullName ? 'border-red-500' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none shadow-sm placeholder:text-gray-400 font-medium`}
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
                                    className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none shadow-sm placeholder:text-gray-400 font-medium`}
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
                                    className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-100'} rounded-xl py-3 px-4 text-sm focus:outline-none shadow-sm placeholder:text-gray-400 font-medium`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
                            </div>

                            {/* Lead Type Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-800 ml-1">Lead type *</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setLeadType('HOT')}
                                        className="w-28 flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-white text-sm transition-all shadow-sm bg-[#82D95B]"
                                    >
                                        <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                                            {leadType === 'HOT' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        Hot
                                    </button>
                                    <button
                                        onClick={() => setLeadType('COLD')}
                                        className="w-28 flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-white text-sm transition-all shadow-sm bg-[#82D95B]"
                                    >
                                        <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                                            {leadType === 'COLD' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        Cold
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            {errors.submit && (
                                <p className="text-red-500 text-sm mb-4 ml-1">{errors.submit}</p>
                            )}
                            <PrimaryActionButton
                                onClick={handleSave}
                                text={isSubmitting ? 'Updating...' : 'Update'}
                                className="px-8 py-2.5 rounded-lg font-bold text-base shadow-lg"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default EditLead;
