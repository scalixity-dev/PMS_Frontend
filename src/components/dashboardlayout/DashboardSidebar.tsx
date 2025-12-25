// src/components/dashboard/DashboardSidebar.tsx

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SquarePen, ChevronLeft, ChevronRight } from "lucide-react";
import {
  PiChartLineUpFill, PiChartPieSliceFill, PiBuildingsFill, PiUsersFill,
  PiCurrencyDollarFill, PiWrenchFill, PiFileTextFill, PiChartBarFill
} from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import artworkImage from "../../assets/images/Artwork.png";
import InviteToApplyModal from '../../pages/Dashboard/features/Application/components/InviteToApplyModal';

const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false });

// --- Type Definitions (Remain the same) ---
interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}
interface SidebarSubLinkProps { label: string; to: string; isCurrentPath: (path: string) => boolean; }
interface SidebarDropdownLinkProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isCurrentPath: (path: string) => boolean;
  activeDropdown: string | null;
  setActiveDropdown: (label: string | null) => void;
}

interface SidebarLinkProps {
  label: string;
  to: string;
  icon: React.ReactNode;
  isCurrentPath: (path: string) => boolean;
}

// --- Component Implementations (Sub-links and Link components) ---

function SidebarSubLink({ label, to, isCurrentPath }: SidebarSubLinkProps) {
  const isActive = isCurrentPath(to);

  return (
    <Link
      to={to}
      className={`block py-2 px-3 rounded-md text-sm transition-colors 
              ${isActive
          ? "text-green-600 font-semibold"
          : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
        }`
      }
    >
      {label}
    </Link>
  );
}

function SidebarDropdownLink({ label, icon, children, activeDropdown, setActiveDropdown }: SidebarDropdownLinkProps) {
  const location = useLocation();
  const { collapsed } = React.useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false);
  const linkRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const isActiveRoute = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child) && (child.props as any).to) {
      const path = (child.props as any).to;
      // Handle root dashboard path specifically to prevent it from matching everything
      if (path === '/dashboard') {
        return location.pathname === path;
      }
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    }
    return false;
  });

  const isOpen = activeDropdown === label;

  const handleClick = () => {
    if (collapsed) return; // Don't toggle dropdown in collapsed mode
    if (isOpen) {
      setActiveDropdown(null);
    }
    else {
      setActiveDropdown(label);
    }
  };

  const handleMouseEnter = () => {
    if (collapsed && linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.top, left: rect.right + 10 });
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <div
        ref={linkRef}
        className={`flex items-center px-3 py-2.5 rounded-md transition-colors cursor-pointer 
                  ${isActiveRoute ? "bg-gray-100 font-semibold text-black" : "text-gray-700 hover:bg-gray-100 group"}
                  ${collapsed ? "justify-center" : "justify-between"}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
          <span className={`${isActiveRoute ? "text-green-600" : "text-black group-hover:text-black"}`}>
            {icon}
          </span>
          {!collapsed && (
            <span className={`${isActiveRoute ? "text-green-600" : "text-black group-hover:text-black"} text-sm font-medium`}>
              {label}
            </span>
          )}
        </div>
        {/* Dropdown Arrow/Indicator */}
        {!collapsed && (
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        )}
      </div>

      {/* Sub-links Container (Normal Mode) */}
      {!collapsed && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out 
                  ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="ml-8 mt-1 space-y-0.5">
            {children}
          </div>
        </div>
      )}

      {/* Floating Menu (Collapsed Mode) */}
      {collapsed && isHovered && createPortal(
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] py-2 w-48 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: menuPosition.top, left: menuPosition.left }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="px-3 py-2 font-semibold text-gray-900 border-b border-gray-100 mb-1 text-sm bg-gray-50/50">
            {label}
          </div>
          <div className="p-1 space-y-0.5">
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function SidebarLink({ label, to, icon, isCurrentPath }: SidebarLinkProps) {
  const { collapsed } = React.useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const isActive = isCurrentPath(to);

  const handleMouseEnter = () => {
    if (collapsed && linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.top, left: rect.right + 10 });
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <Link
        to={to}
        ref={linkRef}
        className={`flex items-center px-3 py-2.5 rounded-md transition-colors cursor-pointer 
                  ${isActive ? "bg-gray-100 font-semibold text-black" : "text-gray-700 hover:bg-gray-100 group"}
                  ${collapsed ? "justify-center" : "justify-between"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
          <span className={`${isActive ? "text-green-600" : "text-black group-hover:text-black"}`}>
            {icon}
          </span>
          {!collapsed && (
            <span className={`${isActive ? "text-green-600" : "text-black group-hover:text-black"} text-sm font-medium`}>
              {label}
            </span>
          )}
        </div>
      </Link>

      {collapsed && isHovered && createPortal(
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] py-2 px-3 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <span className="font-semibold text-gray-900 text-sm">
            {label}
          </span>
        </div>,
        document.body
      )}
    </>
  );
}

/**
 * Main Sidebar Component (SCROLLBAR HIDDEN)
 */
export default function DashboardSidebar({ open, setOpen, collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const createNewRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleCreateNew = () => {
    if (!isCreateNewOpen && createNewRef.current) {
      const rect = createNewRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top + 14,
        left: rect.right + 10 // 10px gap
      });
    }
    setIsCreateNewOpen(!isCreateNewOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        createNewRef.current &&
        !createNewRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsCreateNewOpen(false);
      }
    };

    // Update position on scroll or resize to keep it attached (optional but good for UX)
    const handleScroll = () => {
      if (isCreateNewOpen && createNewRef.current) {
        const rect = createNewRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.top + 20,
          left: rect.right + 10
        });
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isCreateNewOpen]);
  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      {/* Dark overlay for mobile/tablet */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar - HIDING SCROLLBAR HERE */}
      <aside
        className={`fixed lg:static z-50 top-16 left-0 h-[calc(100vh-32px)] 
        bg-white shadow-md transform lg:translate-x-0 transition-all duration-300 overflow-y-auto scrollbar-hide
        ${open ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "w-20" : "w-55"}`}
      >
        <div className="relative h-full flex flex-col justify-between">
          {/* Collapse Toggle Button */}
          <div className="flex justify-end px-3 pt-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`p-1.5 rounded-lg text-gray-400 hover:text-[#1BCB40] hover:bg-green-50 transition-all duration-200 ${collapsed ? 'mx-auto' : ''}`}
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>
          <div className="flex-grow">
            {/* Create New Button */}
            <div className={`relative pt-4 pb-2 transition-all ${collapsed ? 'px-2' : 'px-4'}`} ref={createNewRef}>
              <button
                onClick={toggleCreateNew}
                className={`bg-gradient-to-r from-[#1BCB40] to-[#7CD947] hover:opacity-95 text-white font-semibold flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1BCB40]/40 shadow-[0_20px_60px_rgba(27,203,64,0.32)] hover:shadow-[0_28px_90px_rgba(27,203,64,0.44)] overflow-hidden
                  ${collapsed ? 'w-12 h-12 rounded-xl mx-auto' : 'w-full py-3 px-4 rounded-lg'}`}
              >
                <div className={`flex items-center justify-center transition-all duration-300 ${collapsed ? '' : 'gap-2'}`}>
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'max-w-0 opacity-0 w-0' : 'max-w-[150px] opacity-100 w-auto'
                      }`}
                  >
                    Create New
                  </span>
                  <SquarePen className={`text-white transition-all duration-300 ${collapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                </div>
              </button>

              {/* Flyout Menu - Using Portal to escape sidebar overflow/transform context */}
              {isCreateNewOpen && createPortal(
                <div
                  ref={menuRef}
                  className="fixed w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                  style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                  <div className="flex flex-col py-1">
                    {/* List a unit */}
                    <button
                      onClick={() => {
                        navigate("/dashboard/list-unit");
                        setIsCreateNewOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left"
                    >
                      List a unit
                    </button>

                    {/* Invite to Apply */}
                    <button
                      onClick={() => {
                        setIsInviteModalOpen(true);
                        setIsCreateNewOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm font-medium text-[#1BCB40] hover:bg-green-50 border-b border-gray-100 transition-colors text-left"
                    >
                      Invite to Apply
                    </button>

                    {/* Create New Property */}
                    <button
                      onClick={() => {
                        navigate("/dashboard/property/add");
                        setIsCreateNewOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left"
                    >
                      Create New Property
                    </button>

                    {/* Create New Lease */}
                    <button
                      onClick={() => {
                        navigate("/dashboard/leasing/leases");
                        setIsCreateNewOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left"
                    >
                      Create New Lease
                    </button>

                    {/* Record an Income */}
                    <button
                      onClick={() => {
                        navigate("/dashboard/accounting/transactions/income/add");
                        setIsCreateNewOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left"
                    >
                      Record an Income
                    </button>



                    {/* Record a Request */}
                    <button
                      onClick={() => {
                        navigate("/dashboard/maintenance/request");
                        setIsCreateNewOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors text-left"
                    >
                      Record a Request
                    </button>
                  </div>
                </div>,
                document.body
              )}

              {!collapsed && (
                <div className="pointer-events-none absolute left-4 right-4 top-[64px] h-28">
                  <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#1BCB40]/40 to-transparent filter blur-[20px] opacity-40" />
                </div>
              )}
            </div>

            {/* Navigation */}
            < nav className="px-1 py-2 space-y-1" >

              {/* 1. Dashboard Dropdown */}
              < SidebarDropdownLink
                label="Dashboard"
                icon={< PiChartLineUpFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Overview" to="/dashboard" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Calendar" to="/dashboard/calendar" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Tasks" to="/dashboard/tasks" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 2. Portfolio Dropdown */}
              <SidebarDropdownLink
                label="Portfolio"
                icon={<PiChartPieSliceFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Properties" to="/dashboard/properties" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Units" to="/dashboard/portfolio/units" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Listing" to="/dashboard/portfolio/listing" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Keys & Locks" to="/dashboard/portfolio/keys-locks" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Equipment" to="/dashboard/equipments" isCurrentPath={isCurrentPath} />

              </SidebarDropdownLink>

              {/* 3. Leasing Dropdown */}
              <SidebarDropdownLink
                label="Leasing"
                icon={<PiBuildingsFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Applications" to="/dashboard/leasing/applications" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Leases" to="/dashboard/leasing/leases" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Leads" to="/dashboard/leasing/leads" isCurrentPath={isCurrentPath} />

              </SidebarDropdownLink>

              {/* 4. Contacts Dropdown */}
              <SidebarDropdownLink
                label="Contacts"
                icon={<PiUsersFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Tenants" to="/dashboard/contacts/tenants" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Service Pros" to="/dashboard/contacts/service-pros" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 5. Accounting Dropdown */}
              <SidebarDropdownLink
                label="Accounting"
                icon={<PiCurrencyDollarFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Transactions" to="/dashboard/accounting/transactions" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Payments" to="/dashboard/accounting/payments" isCurrentPath={isCurrentPath} />
                {/* <SidebarSubLink label="Balances" to="/accounting/balances" isCurrentPath={isCurrentPath} /> */}
                <SidebarSubLink label="Recurring" to="/dashboard/accounting/recurring" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 6. Maintenance Dropdown */}
              <SidebarDropdownLink
                label="Maintenance"
                icon={<PiWrenchFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Requests" to="/dashboard/maintenance/requests" isCurrentPath={isCurrentPath} />
                {/* <SidebarSubLink label="Requests Board" to="/maintenance/board" isCurrentPath={isCurrentPath} /> */}
                <SidebarSubLink label="Recurring" to="/dashboard/maintenance/recurring" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 7. Documents Dropdown */}
              <SidebarDropdownLink
                label="Documents"
                icon={<PiFileTextFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Landlord forms" to="/documents/landlord-forms" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="My templates" to="/documents/my-templates" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="File manager" to="/documents/file-manager" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 8. Reports Link */}
              <SidebarLink
                label="Reports"
                icon={<PiChartBarFill size={24} />}
                to="/dashboard/reports"
                isCurrentPath={isCurrentPath}
              />


            </nav>
          </div>

          {/* Artwork at Bottom */}
          <div className={`p-4 mt-auto transition-all duration-300 ${collapsed ? 'opacity-0 scale-0 h-0 p-0 overflow-hidden' : 'opacity-100'}`}>
            <img
              src={artworkImage}
              alt="Decorative artwork"
              className="mx-auto object-fill opacity-90 blur-[3px]"
            />
          </div>



        </div>
      </aside >
      <InviteToApplyModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSend={(email, propertyId) => {
          console.log('Sending invitation:', { email, propertyId });
          // TODO: Implement actual invite logic
          // alert(`Invitation sent to ${email}`);
        }}
      />
    </SidebarContext.Provider >
  );
}