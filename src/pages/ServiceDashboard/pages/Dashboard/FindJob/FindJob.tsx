import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ServiceFilters from '../../../components/ServiceFilters';
import JobCard from './components/JobCard';
import ServiceBreadCrumb from '@/pages/ServiceDashboard/components/ServiceBreadCrumb';

import { MOCK_JOBS } from './data/jobData';

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const FindJob = () => {
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [radiusFilter, setRadiusFilter] = useState('All');
    const [categoryFilter] = useState('All');

    // Filter Logic
    const filteredJobs = MOCK_JOBS.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = priorityFilter === 'All' || job.priority === priorityFilter;
        const matchesCategory = categoryFilter === 'All' || job.category === categoryFilter;
        // Radius logic would go here in a real app

        return matchesSearch && matchesPriority && matchesCategory;
    });

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
                    {filteredJobs.length} Jobs Available
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

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredJobs.map(job => (
                    <JobCard
                        key={job.id}
                        {...job}
                    />
                ))}
            </div>

            {filteredJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                        🔍
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </div>
            )}
        </div>
    );
};

export default FindJob;
