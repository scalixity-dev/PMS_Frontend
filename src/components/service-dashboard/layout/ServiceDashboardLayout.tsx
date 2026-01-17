import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ServiceDashboardNavbar from './ServiceDashboardNavbar';
import ServiceDashboardSidebar from './ServiceDashboardSidebar';

const ServiceDashboardLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

                <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ServiceDashboardLayout;
