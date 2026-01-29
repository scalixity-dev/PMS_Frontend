import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ServiceDashboardNavbar from './ServiceDashboardNavbar';
import ServiceDashboardSidebar from './ServiceDashboardSidebar';

const ServiceDashboardLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

    // Routes that should not have padding (e.g., full-screen layouts like Messages)
    const noPaddingRoutes = ['/service-dashboard/messages'];
    const shouldHavePadding = !noPaddingRoutes.includes(location.pathname);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <ServiceDashboardNavbar setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 pt-16">
                <ServiceDashboardSidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />

                <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ${shouldHavePadding ? 'p-4 lg:p-6' : ''}`}>
                    <Outlet context={{ sidebarCollapsed }} />
                </main>
            </div>
        </div>
    );
};

export default ServiceDashboardLayout;
