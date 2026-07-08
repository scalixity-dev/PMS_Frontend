import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, type ReactNode } from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { useTeamPermissions } from "../../context/TeamPermissionContext";
import { useSubscription } from "../../context/SubscriptionContext";

interface DashboardLayoutProps {
  children?: ReactNode;
}

function SidebarSkeleton({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={`h-full bg-white flex flex-col py-5 px-3 gap-3 animate-pulse ${collapsed ? 'items-center' : ''}`}>
      <div className={`h-10 rounded-xl bg-gray-200 mb-2 ${collapsed ? 'w-10' : 'w-full'}`} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`flex items-center gap-3 px-2 py-1 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-5 h-5 rounded bg-gray-200 shrink-0" />
          {!collapsed && <div className={`h-4 rounded bg-gray-200`} style={{ width: `${55 + (i % 3) * 20}%` }} />}
        </div>
      ))}
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

function TrialBanner({ daysLeft, trialEndsAt }: { daysLeft: number; trialEndsAt: string }) {
  const navigate = useNavigate();
  const endDate = new Date(trialEndsAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-4 text-sm">
      <p className="text-amber-800">
        <span className="font-semibold">
          {daysLeft === 0 ? 'Your trial ends today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your free trial`}
        </span>
        {' '}· Trial ends {endDate}
      </p>
      <button
        onClick={() => navigate('/dashboard/settings/subscription/my-plan')}
        className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
      >
        Upgrade now
      </button>
    </div>
  );
}

function TrialExpiredGate() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your trial has ended</h2>
      <p className="text-gray-500 max-w-sm mb-8">
        Subscribe to a plan to continue using SmartTenantAI. Your data is safe and will be waiting for you.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/dashboard/settings/subscription/my-card')}
          className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Add payment method
        </button>
        <button
          onClick={() => navigate('/dashboard/settings/subscription/my-plan')}
          className="px-5 py-2.5 bg-[#486370] hover:bg-[#3a505b] text-white rounded-xl text-sm font-semibold transition-colors"
        >
          View plans
        </button>
      </div>
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
  const { isTrialing, isExpired, daysLeftInTrial, trialEndsAt, isLoading: subLoading, refetch: refetchSubscription } = useSubscription();

  // Redirect expired users to plan settings; allow subscription settings through
  const isSubscriptionSettingsRoute = location.pathname.startsWith('/dashboard/settings/subscription');
  const showExpiredGate = isExpired && !subLoading && !isSubscriptionSettingsRoute;

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // SubscriptionProvider lives above the router and never remounts on
  // logout/login, so its cached data can belong to the previous account.
  // DashboardLayout itself mounts fresh every time a session enters the
  // dashboard, so force a refetch here to pick up the current user's plan.
  useEffect(() => {
    refetchSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`flex min-h-screen ${isMessagesPage ? 'bg-white' : 'bg-gray-100'} flex-col`}>
      <div className="fixed top-0 left-0 right-0 z-50 print:hidden">
        <DashboardNavbar setSidebarOpen={setSidebarOpen} />
        {/* Trial banner sits just below the navbar */}
        {isTrialing && trialEndsAt && (
          <TrialBanner daysLeft={daysLeftInTrial} trialEndsAt={trialEndsAt} />
        )}
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Account for navbar + optional trial banner height */}
      <div className={`flex flex-1 ${isMessagesPage ? 'pt-16' : isTrialing ? 'pt-28' : 'pt-20'}`}>
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

        {/* Main content */}
        <main
          ref={mainRef}
          className={`${isMessagesPage ? 'p-0' : 'p-4 md:p-6'} flex-1 ml-0 transition-all duration-300 print:m-0 print:p-0 print:ml-0 print:overflow-visible ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ${isMessagesPage ? 'h-[calc(100vh-64px)] overflow-hidden' : 'overflow-y-auto'}`}
        >
          {sidebarLoading ? (
            <MainContentSkeleton />
          ) : showExpiredGate ? (
            <TrialExpiredGate />
          ) : (
            children || <Outlet context={{ sidebarCollapsed }} />
          )}
        </main>
      </div>
    </div>
  );
}
