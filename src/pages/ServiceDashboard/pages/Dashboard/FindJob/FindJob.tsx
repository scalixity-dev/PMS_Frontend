import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PiBriefcaseLight } from 'react-icons/pi';
import ServiceFilters from '../../../components/ServiceFilters';
import JobCard from './components/JobCard';
import ServiceBreadCrumb from '@/pages/ServiceDashboard/components/ServiceBreadCrumb';
import { useGetAvailableJobs } from '@/hooks/useAvailableJobs';

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const FindJob = () => {
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string | string[]>('All');
    const [radiusFilter, setRadiusFilter] = useState('All');
    const [categoryFilter] = useState('All');

    // Build filters for API call
    const apiFilters = useMemo(() => {
        const filters: { radius?: string; category?: string; priority?: string; search?: string } = {};
        if (radiusFilter !== 'All') {
            filters.radius = radiusFilter;
        }
        if (categoryFilter !== 'All') {
            filters.category = categoryFilter;
        }
        if (priorityFilter !== 'All' && !Array.isArray(priorityFilter)) {
            filters.priority = priorityFilter;
        }
        if (searchTerm.trim()) {
            filters.search = searchTerm.trim();
        }
        return filters;
    }, [radiusFilter, categoryFilter, priorityFilter, searchTerm]);

    // Fetch available jobs from API
    const { data: jobs = [], isLoading, error } = useGetAvailableJobs(apiFilters);

    // Map API response to JobCard props format
    const mappedJobs = useMemo(() => {
        return jobs.map(job => ({
            id: job.id,
            title: job.title,
            location: job.location,
            address: job.address,
            payout: 0, // Payout not available in API response yet
            priority: job.priority,
            image: job.photos && job.photos.length > 0 
                ? job.photos.find(p => p.isPrimary)?.photoUrl || job.photos[0].photoUrl 
                : '',
        }));
    }, [jobs]);

    return (
        <div className={`mx-auto min-h-screen pb-20 transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Find a Job', to: '/service-dashboard/find-job' }
                ]}
            />

            {/* Header Banner */}
            <div className="mt-6 mb-8 bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Find a Job</h1>
                    <p className="text-gray-500 max-w-xl">
                        Browse available maintenance jobs and apply for opportunities that match your expertise
                    </p>
                </div>
                <div className="bg-[#7CD947] text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                    {isLoading ? 'Loading...' : `${mappedJobs.length} Jobs Available`}
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8">
                <ServiceFilters
                    onSearch={setSearchTerm}
                    priorityLabel="Priority"
                    priorityOptions={['All', 'Critical', 'Normal', 'Low']}
                    currentPriority={priorityFilter}
                    onPriorityChange={setPriorityFilter}

                    radiusLabel="Radius"
                    radiusOptions={['All', '50 miles', '100 miles', '25 miles']}
                    currentRadius={radiusFilter}
                    onRadiusChange={setRadiusFilter}

                // Reusing status/category for demo if needed, but keeping it cleaner
                // statusLabel="Category"
                // statusOptions={['All', 'Electrical', 'Plumbing', 'HVAC', 'General', 'Appliances']}
                // currentStatus={categoryFilter}
                // onStatusChange={setCategoryFilter}
                />
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mt-8">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <PiBriefcaseLight size={40} className="text-gray-400 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Loading jobs...</h3>
                    <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed">
                        Please wait while we fetch available jobs for you.
                    </p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-red-200 shadow-sm mt-8">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <PiBriefcaseLight size={40} className="text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {error instanceof Error && error.message.includes('Complete your business profile')
                            ? 'Business Profile Required'
                            : 'Error loading jobs'}
                    </h3>
                    <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed mb-6">
                        {error instanceof Error ? error.message : 'Failed to load available jobs. Please try again later.'}
                    </p>
                    {error instanceof Error && error.message.includes('Complete your business profile') && (
                        <a
                            href="/service-dashboard/settings/business-profile"
                            className="px-6 py-3 bg-[#3A6D6C] text-white rounded-lg font-medium shadow-sm hover:bg-[#2c5251] transition-colors"
                        >
                            Complete Business Profile
                        </a>
                    )}
                </div>
            )}

            {/* Job Grid */}
            {!isLoading && !error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mappedJobs.map(job => (
                            <JobCard
                                key={job.id}
                                {...job}
                            />
                        ))}
                    </div>

                    {mappedJobs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mt-8">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <PiBriefcaseLight size={40} className="text-gray-400" />
                            </div>
                            {jobs.length === 0 ? (
                                <>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs available</h3>
                                    <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed">
                                        There are currently no maintenance jobs available for application. Check back later for new opportunities.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                                    <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed">
                                        We couldn't find any jobs matching your current filters. Try adjusting your search or radius to see more opportunities.
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FindJob;
