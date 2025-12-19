// src/components/userdashboard/UserDashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { useState, type ReactNode } from "react";
import UserDashboardNavbar from "./UserDashboardNavbar";
import UserDashboardSidebar from "./UserDashboardSidebar";

interface UserDashboardLayoutProps {
    children?: ReactNode;
}

export default function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

    return (
        <div className="flex min-h-screen bg-gray-100 flex-col">
            <div className="fixed top-0 left-0 right-0 z-50">
                <UserDashboardNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>

            <div className="flex flex-1 pt-20">
                <div className={`fixed left-0 top-16 bottom-0 z-40 h-[calc(100vh-32px)] transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-55'}`}>
                    <UserDashboardSidebar
                        open={sidebarOpen}
                        setOpen={setSidebarOpen}
                        collapsed={sidebarCollapsed}
                        setCollapsed={setSidebarCollapsed}
                    />
                </div>

                <main className={`p-4 md:p-6 flex-1 ml-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-55'} overflow-y-auto`}>
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
}
