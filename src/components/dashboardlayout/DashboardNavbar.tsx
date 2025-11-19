// src/components/dashboard/DashboardNavbar.tsx
import { useState, useRef, useEffect } from "react";
import { Search, Bell, MessageSquare, Info, User, LogOut, UserCog } from "lucide-react";
import logo from "../../assets/images/logo.png";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function DashboardNavbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    setIsProfileDropdownOpen(false);
  };

  const handleManageProfile = () => {
    // Add manage profile logic here
    console.log("Managing profile...");
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="relative h-20 bg-[var(--color-navbar-bg)] flex items-center px-4 lg:px-0 gap-4">

      {/* Logo container */}
      <div className="flex items-center">
        {/* Desktop Logo */}
        <div className="hidden lg:flex items-center justify-center w-64 gap-2 text-white">
          <img
            src={logo}
            alt="PMS"
            className="w-8 h-8"
            style={{ filter: 'invert(1) brightness(2)' }}
          />
          <span className="text-xl font-bold">PMS</span>
        </div>

        {/* Mobile/Tablet Logo */}
        <div className="flex lg:hidden items-center gap-2 text-white">
          <img
            src={logo}
            alt="PMS"
            className="w-8 h-8"
            style={{ filter: 'invert(1) brightness(2)' }}
          />
          <span className="text-xl font-bold">PMS</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex items-center flex-1 justify-between lg:justify-start gap-4">
        
        {/* Hamburger (Mobile/Tablet) - Animated Toggle */}
        <button
          className="lg:hidden text-white p-1 relative w-8 h-8 flex items-center justify-center"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <div className="relative w-6 h-6">
            <span 
              className={`absolute left-0 top-1/2 block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'rotate-45' : '-translate-y-2'
              }`} 
            />
            <span 
              className={`absolute left-0 top-1/2 block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'opacity-0' : 'opacity-100'
              }`} 
            />
            <span 
              className={`absolute left-0 top-1/2 block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
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
            className="w-full h-10 pl-4 pr-12 rounded-full bg-white text-gray-800 placeholder-gray-500 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-white/30 shadow-[0_4px_0_rgba(93,111,108)]"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
            <Search size={18} className="text-white" />
          </button>
        </div>

        {/* Mobile Search Icon (visible only when full search is hidden) */}
        <button className="sm:hidden text-white p-2">
           <Search size={24} />
        </button>

        {/* Right side icons */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">

          {/* Messages Icon */}
          <button aria-label="Messages" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_4px_0_rgba(93,111,108)]">
            <MessageSquare size={18} className="text-gray-800 md:w-[22px] md:h-[22px]" />
          </button>

          {/* Info Icon - Hidden on mobile to save space if needed, or keep small */}
          <button aria-label="Info" className="hidden xs:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-white items-center justify-center hover:bg-gray-100 shadow-[0_4px_0_rgba(93,111,108)]">
            <Info size={18} className="text-gray-800 md:w-[22px] md:h-[22px]" />
          </button>

          {/* Notification (Bell) Icon */}
          <button aria-label="Notifications" className="w-8 h-8 md:w-10 md:h-10 md:mr-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_4px_0_rgba(93,111,108)]">
            <Bell size={18} className="text-gray-800 md:w-[22px] md:h-[22px]" />
          </button>

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center gap-2 bg-white rounded-full pl-1 pr-1 py-1 md:pl-4 md:pr-2 md:py-2 hover:bg-gray-100 cursor-pointer shadow-[0_4px_0_rgba(93,111,108)]"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <span className="font-medium text-gray-800 text-base hidden lg:block">Shawn James</span>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                <User size={20} className="text-white" />
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
