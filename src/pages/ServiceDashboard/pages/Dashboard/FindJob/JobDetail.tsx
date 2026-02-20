import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, CheckCircle2, Check } from 'lucide-react';
import ServiceBreadCrumb from '@/pages/ServiceDashboard/components/ServiceBreadCrumb';
import DashboardButton from '@/pages/ServiceDashboard/components/DashboardButton';
import { useGetAvailableJobById, useApplyToJob } from '@/hooks/useAvailableJobs';

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const JobDetail: React.FC = () => {
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    // Fetch job from API
    const { data: job, isLoading, error } = useGetAvailableJobById(id);
    const applyToJobMutation = useApplyToJob();

    const isInterestSubmitted = job?.hasApplied || false;

    const handleInterestClick = async () => {
        if (!id) return;

        try {
            await applyToJobMutation.mutateAsync({
                requestId: id,
                data: {
                    // Could add quotedAmount input later
                },
            });
            setShowToast(true);
        } catch (error) {
            console.error('Failed to apply to job:', error);
            // Error handling could be improved with toast notifications
        }
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    if (isLoading) {
        return (
            <div className={`mx-auto min-h-screen pb-20 transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
                <div className="p-6 text-center text-gray-500">
                    Loading job details...
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className={`mx-auto min-h-screen pb-20 transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
                <div className="p-6 text-center text-gray-500">
                    {error instanceof Error ? error.message : 'Job not found'}
                </div>
            </div>
        );
    }

    // Get primary photo or first photo
    const primaryPhoto = job.photos?.find(p => p.isPrimary)?.photoUrl || job.photos?.[0]?.photoUrl || '';
    const allPhotos = job.photos?.map(p => p.photoUrl) || [];

    const getPriorityColor = (p: string) => {
        switch (p.toLowerCase()) {
            case 'critical': return 'bg-[#FF4D4D] text-white';
            case 'normal': return 'bg-[#7CD947] text-white';
            case 'low': return 'bg-[#FFA500] text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className={`mx-auto min-h-screen pb-20 relative transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
                    <div className="bg-[#7CD947] text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <span className="font-medium text-sm">Thank you! Your interest has been recorded.</span>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Find a Job', to: '/service-dashboard/find-job' },
                    { label: job.title, active: true },
                ]}
            />

            {/* Header Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100">
                <div>
                    <Link to="/service-dashboard/find-job" className="inline-flex items-center text-gray-500 hover:text-gray-900 text-sm font-medium mb-3 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Jobs
                    </Link>
                    <div className="flex items-center flex-wrap gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getPriorityColor(job.priority)}`}>
                            {job.priority}
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1">{job.category}</p>
                </div>

                {/* Payout section - could be hidden or show "Contact for quote" if not available */}
                {job.materials && job.materials.length > 0 && (
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 font-medium uppercase mb-0.5">Materials Required</span>
                        <div className="px-4 py-2 bg-[#7CD947] text-white rounded-lg font-bold text-sm shadow-sm">
                            {job.materials.length} item{job.materials.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Photos Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Photos</h2>
                        </div>

                        {primaryPhoto ? (
                            <>
                                <div className="aspect-video w-full overflow-hidden rounded-xl mb-4 bg-gray-100 relative">
                                    <img
                                        src={primaryPhoto}
                                        alt={job.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {allPhotos.length > 1 && (
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {allPhotos.map((img, index) => (
                                            <div key={index} className={`w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${index === 0 ? 'border-[#7CD947]' : 'border-transparent hover:border-gray-300'}`}>
                                                <img src={img} alt={`Job detail ${index}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="aspect-video w-full overflow-hidden rounded-xl mb-4 bg-gray-100 relative flex items-center justify-center">
                                <p className="text-gray-400">No photos available</p>
                            </div>
                        )}
                    </div>

                    {/* Issue Description */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Issue Description</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {job.subcategory || "No description provided."}
                        </p>
                    </div>

                    {/* Job Details */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Job Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                                <p className="text-gray-900 font-medium">{job.category}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Priority Level</label>
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getPriorityColor(job.priority)}`}>
                                    {job.priority}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Property Details Card */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Property Details</h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Home className="w-4 h-4 text-[#7CD947]" />
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Property Name</span>
                                </div>
                                <p className="text-gray-900 font-medium pl-6">{job.location}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4 text-[#7CD947]" />
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Address</span>
                                </div>
                                <p className="text-gray-900 font-medium pl-6 opacity-80">{job.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Job Info Section */}
                    <div className={`bg-gradient-to-b from-[#7CD947] to-[#5BB82F] rounded-2xl shadow-lg shadow-[#7CD947]/20 relative overflow-hidden transition-all duration-300 ${isInterestSubmitted ? 'pb-0' : 'p-6'}`}>
                        <div className={`relative z-10 ${isInterestSubmitted ? 'p-6 pb-20' : ''}`}>
                            <p className="text-sm font-medium text-white/90 mb-1">Job Details</p>
                            <h3 className="text-2xl text-white/90 font-bold mb-4">{job.category}</h3>
                            {job.subcategory && (
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-xs font-medium text-white/90 mb-2">
                                    {job.subcategory}
                                </div>
                            )}
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-xs font-medium text-white/90 mb-0">
                                Requested: {new Date(job.requestedAt).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Interest Submitted Footer */}
                        {isInterestSubmitted && (
                            <div className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-md p-4 flex items-center justify-center gap-2 mt-4 animate-slideUp">
                                <Check className="w-5 h-5 text-white" />
                                <span className="font-bold text-white">Interest Submitted</span>
                            </div>
                        )}

                        {/* Decorative background circle */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>

                    {/* Action Button / Success Message */}


                    {!isInterestSubmitted ? (
                        <DashboardButton
                            onClick={handleInterestClick}
                            bgColor="#7CD947"
                            className="w-full py-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={applyToJobMutation.isPending}
                        >
                            {applyToJobMutation.isPending ? 'Submitting...' : "I'm Interested in This Job"}
                        </DashboardButton>
                    ) : (
                        <div className="bg-[#f0fdf4] border border-green-100 rounded-2xl p-4 text-center animate-fadeIn">
                            <p className="text-sm text-green-700 leading-relaxed font-medium">
                                <CheckCircle2 className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                                You've expressed interest in this job. The property manager will contact you soon.
                            </p>
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Questions about this job? Contact the property manager after expressing interest.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
