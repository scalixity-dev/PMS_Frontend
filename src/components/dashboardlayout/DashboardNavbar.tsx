// src/components/dashboard/DashboardNavbar.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Bell, MessageSquare, Info, User, LogOut, UserCog, FileText, Download } from "lucide-react";
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

  const handleManageProfile = () => {
    // Navigate to profile management page (you can create this route later)
    // For now, just close the dropdown
    setIsProfileDropdownOpen(false);
    // TODO: Navigate to profile page when created
    // navigate("/dashboard/profile");
  };

  return (
    <header className="relative h-16 bg-[var(--color-navbar-bg)] flex items-center px-4 lg:px-0 gap-4">

      {/* Logo container */}
      <div className="flex items-center">
        {/* Desktop Logo */}
        <div className="hidden lg:flex items-center justify-center w-64 gap-2 text-white">
          <img
            src={logo}
            alt="PMS"
            className="w-6 h-6"
            style={{ filter: 'invert(1) brightness(2)' }}
          />
          <span className="text-lg font-bold">PMS</span>
        </div>

        {/* Mobile/Tablet Logo */}
        <div className="flex lg:hidden items-center gap-2 text-white">
          <img
            src={logo}
            alt="PMS"
            className="w-6 h-6"
            style={{ filter: 'invert(1) brightness(2)' }}
          />
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
                sidebarOpen ? 'rotate-45' : '-translate-y-2'
              }`} 
            />
            <span 
              className={`absolute left-0 top-1/2 block w-5 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'opacity-0' : 'opacity-100'
              }`} 
            />
            <span 
              className={`absolute left-0 top-1/2 block w-5 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                sidebarOpen ? '-rotate-45' : 'translate-y-2'
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
          <button aria-label="Files" className="hidden md:flex w-8 h-8 rounded-full bg-white items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]">
            <FileText size={18} className="text-gray-800" /> 
          </button>

          {/* Download Icon */}
          <button aria-label="Downloads" className="hidden md:flex w-8 h-8 mr-6 rounded-full bg-white items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]">
            <Download size={18} className="text-gray-800" />
          </button>

          {/* Messages Icon */}
          <button aria-label="Messages" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]">
            <MessageSquare size={18} className="text-gray-800" />
          </button>

          {/* Info Icon */}
          <button aria-label="Info" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]">
            <Info size={18} className="text-gray-800" />
          </button>

          {/* Notification (Bell) Icon */}
          <button aria-label="Notifications" className="w-8 h-8 md:mr-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]">
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={handleManageProfile}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <UserCog size={18} />
                  <span className="font-medium">Manage Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}