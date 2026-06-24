import { Outlet, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, type ReactNode } from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { useTeamPermissions } from "../../context/TeamPermissionContext";

interface DashboardLayoutProps {
  children?: ReactNode;
}

function SidebarSkeleton({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={`h-full bg-white flex flex-col py-5 px-3 gap-3 animate-pulse ${collapsed ? 'items-center' : ''}`}>
      {/* Create New button skeleton */}
      <div className={`h-10 rounded-xl bg-gray-200 mb-2 ${collapsed ? 'w-10' : 'w-full'}`} />

      {/* Nav items */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`flex items-center gap-3 px-2 py-1 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-5 h-5 rounded bg-gray-200 shrink-0" />
          {!collapsed && <div className={`h-4 rounded bg-gray-200`} style={{ width: `${55 + (i % 3) * 20}%` }} />}
        </div>
      ))}

      {/* Bottom artwork placeholder */}
      <div className="mt-auto">
        {!collapsed && <div className="h-24 rounded-2xl bg-gray-100 w-full" />}
      </div>
    </div>
  );
}

function MainContentSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-4 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-200" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-56 rounded-2xl bg-gray-200" />
        <div className="h-56 rounded-2xl bg-gray-200" />
      </div>
      <div className="h-40 rounded-2xl bg-gray-200" />
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const location = useLocation();
  const isMessagesPage = location.pathname === '/dashboard/messages';
  const mainRef = useRef<HTMLElement>(null);

  const { isLoading: sidebarLoading } = useTeamPermissions();

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
        {/* Sidebar slot */}
        <div className={`fixed left-0 top-16 bottom-0 z-40 h-[calc(100vh-64px)] transition-transform duration-300 print:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          {sidebarLoading ? (
            <SidebarSkeleton collapsed={sidebarCollapsed} />
          ) : (
            <DashboardSidebar
              open={sidebarOpen}
              setOpen={setSidebarOpen}
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
            />
          )}
        </div>

        {/* Main content — blocked until sidebar is ready */}
        <main
          ref={mainRef}
          className={`${isMessagesPage ? 'p-0' : 'p-4 md:p-6'} flex-1 ml-0 transition-all duration-300 print:m-0 print:p-0 print:ml-0 print:overflow-visible ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ${isMessagesPage ? 'h-[calc(100vh-64px)] overflow-hidden' : 'overflow-y-auto'}`}
        >
          {sidebarLoading ? (
            <MainContentSkeleton />
          ) : (
            children || <Outlet context={{ sidebarCollapsed }} />
          )}
        </main>
      </div>
    </div>
  );
}
