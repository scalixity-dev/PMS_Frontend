// src/components/dashboard/DashboardNavbar.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Bell,
  MessageSquare,
  Info,
  User,
  LogOut,
  UserCog,
  FileText,
  Download,
} from "lucide-react";
import logo from "../../assets/images/logo.png";
import { authService } from "../../services/auth.service";
import { propertyQueryKeys } from "../../hooks/usePropertyQueries";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function DashboardNavbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>("User");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <header className="relative h-16 bg-[var(--color-navbar-bg)] flex items-center px-4 lg:px-0 gap-4">
      {/* Logo container */}
      <div className="flex items-center">
        {/* Desktop Logo */}
        <div className="hidden lg:flex items-center justify-center w-64 gap-2 text-white">
          <img src={logo} alt="PMS" className="w-6 h-6" style={{ filter: "invert(1) brightness(2)" }} />
          <span className="text-lg font-bold">PMS</span>
        </div>

        {/* Mobile/Tablet Logo */}
        <div className="flex lg:hidden items-center gap-2 text-white">
          <img src={logo} alt="PMS" className="w-6 h-6" style={{ filter: "invert(1) brightness(2)" }} />
          <span className="text-lg font-bold">PMS</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex items-center flex-1 justify-between lg:justify-start gap-4">
        {/* Hamburger (Mobile/Tablet) - Animated Toggle */}
        <button
          className="lg:hidden text-white p-1 relative w-7 h-7 flex items-center justify-center"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <div className="relative w-5 h-5">
            <span
              className={`absolute left-0 top-1/2 block w-5 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                sidebarOpen ? "rotate-45" : "-translate-y-2"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block w-5 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                sidebarOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block w-5 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                sidebarOpen ? "-rotate-45" : "translate-y-2"
              }`}
            />
          </div>
        </button>

        {/* Search Bar - Hidden on very small screens, visible on sm+ */}
        <div className="hidden sm:block flex-1 max-w-xs relative">
          <input
            type="text"
            placeholder="Search Anything..."
            className="w-full h-8 pl-4 pr-10 rounded-full bg-white text-gray-800 placeholder-gray-500 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-white/30 shadow-[0_3px_0_rgba(93,111,108)]"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
            <Search size={14} className="text-white" />
          </button>
        </div>

        {/* Mobile Search Icon (visible only when full search is hidden) */}
        <button className="sm:hidden text-white p-1">
          <Search size={20} />
        </button>

        {/* Right side icons */}
        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          {/* File Icon */}
          <button
            aria-label="Files"
            className="hidden md:flex w-8 h-8 rounded-full bg-white items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
          >
            <FileText size={18} className="text-gray-800" />
          </button>

          {/* Download Icon */}
          <button
            aria-label="Downloads"
            className="hidden md:flex w-8 h-8 mr-6 rounded-full bg-white items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
          >
            <Download size={18} className="text-gray-800" />
          </button>

          {/* Messages Icon */}
          <button
            aria-label="Messages"
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
          >
            <MessageSquare size={18} className="text-gray-800" />
          </button>

          {/* Info Icon */}
          <button
            aria-label="Info"
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
          >
            <Info size={18} className="text-gray-800" />
          </button>

          {/* Notification (Bell) Icon */}
          <button
            aria-label="Notifications"
            className="w-8 h-8 md:mr-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
          >
            <Bell size={18} className="text-gray-800" />
          </button>

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-1 bg-white rounded-full pl-2 pr-1 py-1 mr-4 md:pl-3 md:pr-1 md:py-1 hover:bg-gray-100 cursor-pointer shadow-[0_3px_0_rgba(93,111,108)]"
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
                      <p className="text-sm text-gray-600 truncate">{userEmail || "shawnjames@gmail.com"}</p>
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
                    className="w-full flex items-center gap-3 px-5 py-4 text-lg text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <UserCog size={22} className="text-gray-700" />
                    <span className="font-semibold">Add another account</span>
                  </button>
                  <div className="w-full border-t border-[0.5px] border-[#201F23]/50" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-4 text-lg text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut size={22} className="text-gray-700" />
                    <span className="font-semibold">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}