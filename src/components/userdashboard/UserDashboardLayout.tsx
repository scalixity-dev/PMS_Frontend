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
            <div className="fixed top-0 left-0 right-0 z-50 print:hidden">
                <UserDashboardNavbar setSidebarOpen={setSidebarOpen} />
            </div>

            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex flex-1 pt-16">
                <div className={`fixed left-0 top-16 bottom-0 z-40 h-[calc(100vh-64px)] transition-transform duration-300 print:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
                    <UserDashboardSidebar
                        open={sidebarOpen}
                        setOpen={setSidebarOpen}
                        collapsed={sidebarCollapsed}
                        setCollapsed={setSidebarCollapsed}
                    />
                </div>

                <main className={` flex-1 ml-0 transition-all duration-300 print:m-0 print:p-0 print:ml-0 print:overflow-visible ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} overflow-y-auto`}>
                    {children || <Outlet context={{ sidebarCollapsed }} />}
                </main>
            </div>
        </div>
    );
}
