// src/components/dashboard/DashboardNavbar.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Bell,
  MessageSquare,
  User,
  LogOut,
  UserCog,
  FileText,
  Download,
  Calendar,
  X,
  MoreHorizontal,
} from "lucide-react";
import logo from "../../assets/images/logo.png";
import { authService } from "../../services/auth.service";
import { propertyQueryKeys } from "../../hooks/usePropertyQueries";

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function DashboardNavbar({ setSidebarOpen }: NavbarProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [userName, setUserName] = useState<string>("User");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setUserName(user.fullName || "User");
        setUserEmail(user.email || "");
        setUserRole(user.role || "");
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUserName("User");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus mobile search input when opened
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      // Clear all property-related queries on logout to prevent cross-user data leakage
      queryClient.removeQueries({ queryKey: propertyQueryKeys.all });
      // Clear all queries to ensure fresh data for next user
      queryClient.clear();
      // Redirect to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Clear cache even if logout API call fails
      queryClient.removeQueries({ queryKey: propertyQueryKeys.all });
      queryClient.clear();
      // Still redirect even if logout API call fails
      navigate("/login", { replace: true });
    } finally {
      setIsProfileDropdownOpen(false);
    }
  };

  const handleAddAnotherAccount = () => {
    setIsProfileDropdownOpen(false);
    navigate("/dashboard/settings/profile");
  };

  const handleManageProfile = () => {
    setIsProfileDropdownOpen(false);
    navigate("/dashboard/settings");
  };

  return (
    <header className="relative h-16 bg-[var(--color-navbar-bg)] flex items-center px-4 lg:px-6 gap-4 shadow-sm z-50">

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen ? (
        <div className="absolute inset-0 bg-[var(--color-navbar-bg)] flex items-center px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex-1 relative">
            <input
              ref={mobileSearchRef}
              type="text"
              placeholder="Search anything..."
              className="w-full h-10 pl-4 pr-10 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              onBlur={() => setIsMobileSearchOpen(false)} // Optional: close on blur
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={18} />
            </button>
          </div>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="ml-3 text-white p-2 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <>
          {/* Logo container */}
          <div className="flex items-center gap-3 lg:gap-4 lg:w-64 min-w-fit">
            {/* Hamburger (Mobile/Tablet) - Animated Toggle */}
            <button
              className="lg:hidden text-white p-1 relative w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <div className="flex flex-col gap-1.5">
                <span className="block w-5 h-0.5 bg-white rounded-full" />
                <span className="block w-5 h-0.5 bg-white rounded-full" />
                <span className="block w-5 h-0.5 bg-white rounded-full" />
              </div>
            </button>

            {/* Desktop Logo */}
            <div className="flex items-center gap-2 text-white">
              <img src={logo} alt="SmartTenantAI" className="w-7 h-7" style={{ filter: "invert(1) brightness(2)" }} />
              <span className="text-lg font-bold hidden sm:inline-block tracking-tight">SmartTenantAI</span>
            </div>
          </div>

          {/* Middle Section: Search Bar */}
          <div className="flex-1 flex justify-center lg:justify-start max-w-xl mx-auto lg:mx-0 lg:pl-4">
            {/* Desktop/Tablet Search */}
            <div className="hidden sm:block w-full max-w-md relative group">
              <input
                type="text"
                placeholder="Search properties, tenants..."
                className="w-full h-9 pl-4 pr-10 rounded-full bg-white/90 hover:bg-white text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all shadow-sm"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Search size={14} className="text-white" />
              </button>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            {/* Mobile Search Trigger */}
            <button
              className="sm:hidden text-white p-1"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search size={20} />
            </button>

            {/* Mobile Actions Dropdown Trigger */}
            <div className="relative md:hidden" ref={mobileMenuRef}>
              <button
                className="p-2 text-white rounded-full hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <MoreHorizontal size={24} />
              </button>

              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                  <div className="p-2 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/dashboard/reports');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <FileText size={16} className="text-gray-700" />
                      </div>
                      <span className="font-medium">Reports</span>
                    </button>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Download size={16} className="text-gray-700" />
                      </div>
                      <span className="font-medium">Downloads</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/dashboard/calendar');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Calendar size={16} className="text-gray-700" />
                      </div>
                      <span className="font-medium">Calendar</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/dashboard/messages');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <MessageSquare size={16} className="text-gray-700" />
                      </div>
                      <span className="font-medium">Messages</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/dashboard/notifications');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Bell size={16} className="text-gray-700" />
                      </div>
                      <span className="font-medium">Notifications</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Actions (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-1 md:gap-2">
              <button
                aria-label="Reports"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                onClick={() => navigate('/dashboard/reports')}
              >
                <FileText size={18} className="text-gray-800" />
              </button>
              <button
                aria-label="Downloads"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
              >
                <Download size={18} className="text-gray-800" />
              </button>
              <button
                aria-label="Calendar"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                onClick={() => navigate('/dashboard/calendar')}
              >
                <Calendar size={18} className="text-gray-800" />
              </button>
              {/* Messages Icon */}
              <button
                aria-label="Messages"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                onClick={() => navigate('/dashboard/messages')}
              >
                <MessageSquare size={18} className="text-gray-800" />
              </button>

              {/* Notification (Bell) Icon */}
              <button
                aria-label="Notifications"
                className="w-8 h-8 md:mr-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                onClick={() => navigate('/dashboard/notifications')}
              >
                <Bell size={18} className="text-gray-800" />
              </button>
            </div>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-1 bg-white rounded-full pl-1 pr-1 py-1 mr-4 lg:pl-3 lg:pr-1 hover:bg-gray-100 cursor-pointer shadow-[0_3px_0_rgba(93,111,108)]"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <span className="font-medium text-gray-800 text-sm hidden lg:block">
                  {isLoading ? "Loading..." : userName}
                </span>
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  <User size={16} className="text-white" />
                </div>
              </div>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-b-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-gray-200 overflow-hidden z-50">
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white self-start">
                        <User size={28} />
                      </div>
                      <div className="flex flex-col items-start space-y-0.5">
                        <p className="text-xs text-gray-500">{userRole || "Landlord"}</p>
                        <p className="text-xl font-semibold text-gray-900">{isLoading ? "Loading..." : userName}</p>
                        <p className="text-sm text-gray-600 truncate">{userEmail || "No email available"}</p>
                        <button
                          onClick={handleManageProfile}
                          className="mt-3 inline-flex items-center justify-center px-5 py-2 rounded-lg bg-teal-700 text-white font-semibold shadow-[0_6px_12px_rgba(13,148,136,0.35)] hover:bg-teal-800 transition-colors"
                        >
                          Settings
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-full border-t border-[0.5px] border-[#201F23]/50" />

                  <div className="flex flex-col">
                    <button
                      onClick={handleAddAnotherAccount}
                      className="w-full flex items-center gap-3 px-5 py-3 text-lg text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <UserCog size={22} className="text-gray-700" />
                      <span className="font-medium">Add another account</span>
                    </button>
                    <div className="w-full border-t border-[0.5px] border-[#201F23]/50" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-lg text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut size={22} className="text-gray-700" />
                      <span className="font-medium">Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}