import { Outlet, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, type ReactNode } from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  children?: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const location = useLocation();
  const isMessagesPage = location.pathname === '/dashboard/messages';
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`flex min-h-screen ${isMessagesPage ? 'bg-white' : 'bg-gray-100'} flex-col`}>
      <div className="fixed top-0 left-0 right-0 z-50 print:hidden">
        <DashboardNavbar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`flex flex-1 ${isMessagesPage ? 'pt-16' : 'pt-20'}`}>
        <div className={`fixed left-0 top-16 bottom-0 z-40 h-[calc(100vh-64px)] transition-transform duration-300 print:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <DashboardSidebar
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
        </div>

        <main ref={mainRef} className={`${isMessagesPage ? 'p-0' : 'p-4 md:p-6'} flex-1 ml-0 transition-all duration-300 print:m-0 print:p-0 print:ml-0 print:overflow-visible ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ${isMessagesPage ? 'h-[calc(100vh-64px)] overflow-hidden' : 'overflow-y-auto'}`}>
          {children || <Outlet context={{ sidebarCollapsed }} />}
        </main>
      </div>
    </div>
  );
}
