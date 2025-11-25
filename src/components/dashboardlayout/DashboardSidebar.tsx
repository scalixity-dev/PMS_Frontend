// src/components/dashboard/DashboardSidebar.tsx

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SquarePen } from "lucide-react";
import {
  PiChartLineUpFill, PiChartPieSliceFill, PiBuildingsFill, PiUsersFill,
  PiCurrencyDollarFill, PiWrenchFill, PiFileTextFill, PiFileFill, PiDownloadFill
} from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import artworkImage from "../../assets/images/Artwork.png";

// --- Type Definitions (Remain the same) ---
interface SidebarProps { open: boolean; setOpen: (open: boolean) => void; }
interface SidebarLinkProps { label: string; to: string; icon: React.ReactNode; }
interface SidebarSubLinkProps { label: string; to: string; isCurrentPath: (path: string) => boolean; }
interface SidebarDropdownLinkProps {
  label: string;
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isCurrentPath: (path: string) => boolean;
  activeDropdown: string | null;
  setActiveDropdown: (label: string | null) => void;
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

function SidebarDropdownLink({ label, to, icon, children, activeDropdown, setActiveDropdown }: SidebarDropdownLinkProps) {
  const location = useLocation();

  const isActiveRoute = location.pathname.startsWith(to) && to !== "/";
  const isOpen = activeDropdown === label;

  const handleClick = () => {
    if (isOpen) {
      setActiveDropdown(null);
    }
    else {
      setActiveDropdown(label);
    }
  };


  return (
    <>
      {/* Main Dropdown Link */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer 
                  ${isActiveRoute ? "bg-gray-100 font-semibold text-black" : "text-gray-700 hover:bg-gray-100 group"}`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          <span className={`${isActiveRoute ? "text-green-600" : "text-black group-hover:text-black"}`}>{icon}</span>
          <span className={`${isActiveRoute ? "text-green-600" : "text-black group-hover:text-black"} text-sm font-medium`}>{label}</span>
        </div>
        {/* Dropdown Arrow/Indicator */}
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>

      {/* Sub-links Container with Transition */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out 
                ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="ml-8 mt-1 space-y-0.5">
          {children}
        </div>
      </div>
    </>
  );
}

function SidebarLink({ label, to, icon }: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group
              ${isActive
          ? "bg-gray-100 font-semibold text-black"
          : "text-gray-700 hover:bg-gray-100"}`
      }
    >
      <span className={`${isActive ? "text-green-600" : "text-black group-hover:text-black"}`}>{icon}</span>
      <span className={`${isActive ? "text-green-600" : "text-black group-hover:text-black"}  text-sm font-medium`}>{label}</span>
    </Link>
  );
}

/**
 * Main Sidebar Component (SCROLLBAR HIDDEN)
 */
export default function DashboardSidebar({ open, setOpen }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
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
    <>
      {/* Dark overlay for mobile/tablet */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar - HIDING SCROLLBAR HERE */}
      <aside
        className={`fixed lg:static z-50 top-16 left-0 w-55 h-[calc(100vh-32px)] 
        bg-white shadow-md transform lg:translate-x-0 transition-transform duration-300 overflow-y-auto scrollbar-hide
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="relative h-full flex flex-col justify-between">
          <div className="flex-grow">
            {/* Create New Button */}
            <div className="relative px-4 pt-4 pb-2" ref={createNewRef}>
              <button
                onClick={toggleCreateNew}
                className="w-full bg-gradient-to-r from-[#1BCB40] to-[#7CD947] hover:opacity-95 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#1BCB40]/40 shadow-[0_20px_60px_rgba(27,203,64,0.32)] hover:shadow-[0_28px_90px_rgba(27,203,64,0.44)]"
              >
                Create New
                <SquarePen size={20} className="text-white" />
              </button>

              {/* Flyout Menu - Using Portal to escape sidebar overflow/transform context */}
              {isCreateNewOpen && createPortal(
                <div
                  ref={menuRef}
                  className="fixed w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                  style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                  <div className="flex flex-col py-1">
                    <button
                      onClick={() => {
                        navigate("/dashboard/list-unit");
                        setIsCreateNewOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left"
                    >
                      List a unit
                    </button>
                    {/* <button className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left">
                      Invite to apply
                    </button>
                    <button className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left">
                      Screen a tenant
                    </button>
                    <button className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left">
                      Create new property
                    </button>
                    <button className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left">
                      Record an income
                    </button>
                    <button className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left">
                      Record an expense
                    </button>
                    <button className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors text-left">
                      Record a request
                    </button> */}
                  </div>
                </div>,
                document.body
              )}

              <div className="pointer-events-none absolute left-4 right-4 top-[64px] h-28">
                <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#1BCB40]/40 to-transparent filter blur-[20px] opacity-40" />
              </div>
            </div>

            {/* Navigation */}
            < nav className="px-1 py-2 space-y-1" >

              {/* 1. Dashboard Dropdown */}
              < SidebarDropdownLink
                label="Dashboard"
                to="/dashboard"
                icon={< PiChartLineUpFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Overview" to="/dashboard/" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Calendar" to="/dashboard/calendar" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Tasks" to="/dashboard/tasks" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 2. Portfolio Dropdown */}
              <SidebarDropdownLink
                label="Portfolio"
                to="/portfolio"
                icon={<PiChartPieSliceFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Properties" to="/portfolio/properties" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Units" to="/portfolio/units" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Leases" to="/portfolio/leases" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Occupancy Board" to="/portfolio/board" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Keys & Locks" to="/portfolio/keys" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Equipment" to="/portfolio/equipment" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Inspections" to="/portfolio/inspections" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 3. Leasing Dropdown */}
              <SidebarDropdownLink
                label="Leasing"
                to="/leasing"
                icon={<PiBuildingsFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Applications" to="/leasing/applications" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Screenings" to="/leasing/screenings" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Listings" to="/leasing/listings" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Leads" to="/leasing/leads" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Premium leads" to="/leasing/premium-leads" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 4. Contacts Dropdown */}
              <SidebarDropdownLink
                label="Contacts"
                to="/contacts"
                icon={<PiUsersFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Tenants" to="/contacts/tenants" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Service Pros" to="/contacts/service-pros" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 5. Accounting Dropdown */}
              <SidebarDropdownLink
                label="Accounting"
                to="/accounting"
                icon={<PiCurrencyDollarFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Transactions" to="/accounting/transactions" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Payments" to="/accounting/payments" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Balances" to="/accounting/balances" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Recurring" to="/accounting/recurring" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 6. Maintenance Dropdown */}
              <SidebarDropdownLink
                label="Maintenance"
                to="/maintenance"
                icon={<PiWrenchFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Requests" to="/maintenance/requests" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Requests Board" to="/maintenance/board" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="Recurring" to="/maintenance/recurring" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* 7. Documents Dropdown */}
              <SidebarDropdownLink
                label="Documents"
                to="/documents"
                icon={<PiFileTextFill size={24} />}
                isCurrentPath={isCurrentPath}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SidebarSubLink label="Landlord forms" to="/documents/landlord-forms" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="My templates" to="/documents/my-templates" isCurrentPath={isCurrentPath} />
                <SidebarSubLink label="File manager" to="/documents/file-manager" isCurrentPath={isCurrentPath} />
              </SidebarDropdownLink>

              {/* Other main links */}
              <SidebarLink label="Reports" to="/reports" icon={<PiFileFill size={24} />} />
              <hr className='border-gray-300 mx-3' />
              <SidebarLink label="Downloads" to="/downloads" icon={<PiDownloadFill size={24} />} />
            </nav>
          </div>

          {/* Artwork at Bottom */}
          <div className="p-4 mt-auto">
            <img
              src={artworkImage}
              alt="Decorative artwork"
              className="mx-auto object-fill opacity-90 blur-[3px]"
            />
          </div>
        </div>
      </aside >
    </>
  );
}