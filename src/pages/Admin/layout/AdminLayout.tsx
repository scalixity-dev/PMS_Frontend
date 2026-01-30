import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

    // Routes that should not have padding (e.g., full-screen layouts)
    const noPaddingRoutes: string[] = [];
    const shouldHavePadding = !noPaddingRoutes.includes(location.pathname);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <AdminNavbar setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 pt-16">
                <AdminSidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />

                <main className={`flex-1 transition-all duration-300 overflow-x-hidden bg-gray-50 max-w-full ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ${shouldHavePadding ? 'p-4 lg:p-6' : ''}`}>
                    <Outlet context={{ sidebarCollapsed }} />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
