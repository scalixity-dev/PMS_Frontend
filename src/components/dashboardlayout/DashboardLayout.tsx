// src/components/dashboard/DashboardLayout.tsx
import type { ReactNode } from "react";
import { useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <div className="flex flex-1 pt-20">
        <div className="fixed left-0 top-20 bottom-0 z-40 h-[calc(100vh-5rem)]">
          <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>

        <main className="p-4 md:p-6 flex-1 ml-0 lg:ml-64 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
