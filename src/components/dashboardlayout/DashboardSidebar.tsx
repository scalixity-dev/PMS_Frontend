// src/components/dashboard/DashboardSidebar.tsx

import React, { useState, useRef, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { SquarePen, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  PiChartLineUpFill, PiChartPieSliceFill, PiBuildingsFill, PiUsersFill,
  PiCurrencyDollarFill, PiWrenchFill, PiFileTextFill
} from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react';
import artworkImage from "../../assets/images/Artwork.png";
import InviteToApplyModal from '../../pages/Dashboard/features/Application/components/InviteToApplyModal';

const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false });

// --- Type Definitions ---
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

// --- Component Implementations ---

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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActiveRoute = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child)) {
      const props = child.props as { to?: string };
      if (props.to) {
        const path = props.to;
        if (path === '/dashboard') {
          return location.pathname === path;
        }
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
      }
    }
    return false;
  });

  const isOpen = activeDropdown === label;

  const handleClick = () => {
    if (collapsed) return;
    if (isOpen) {
      setActiveDropdown(null);
    }
    else {
      setActiveDropdown(label);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (collapsed && linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.top, left: rect.right + 10 });
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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

      {collapsed && isHovered && createPortal(
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] py-2 w-48 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: menuPosition.top, left: menuPosition.left }}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            timeoutRef.current = setTimeout(() => {
              setIsHovered(false);
            }, 200);
          }}
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

// --- Content Component (Reusable for Sidebar & Drawer) ---
function SidebarContent({ collapsed, setCollapsed, isMobile = false, closeMobileDrawer }: {
  collapsed: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  isMobile?: boolean;
  closeMobileDrawer?: () => void;
}) {
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

      if (isMobile) {
        setMenuPosition({
          top: rect.bottom + 5,
          left: rect.left + 16
        });
      } else {
        setMenuPosition({
          top: rect.top + 14,
          left: rect.right + 10
        });
      }
    }
    setIsCreateNewOpen(!isCreateNewOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Logic handled by Portal/Blur generally, but good for safety
      if (
        createNewRef.current &&
        !createNewRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsCreateNewOpen(false);
      }
    };

    const handleScroll = () => {
      if (isCreateNewOpen && createNewRef.current) {
        const rect = createNewRef.current.getBoundingClientRect();
        if (isMobile) {
          setMenuPosition({
            top: rect.bottom + 5,
            left: rect.left + 16
          });
        } else {
          setMenuPosition({
            top: rect.top + 20,
            left: rect.right + 10
          });
        }
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

  // Navigate helper that also closes mobile drawer
  const onNavigate = (path: string) => {
    navigate(path);
    if (isMobile && closeMobileDrawer) closeMobileDrawer();
  }

  const isCurrentPath = (path: string) => location.pathname === path;

  // Enhance SidebarSubLink to close drawer on mobile click
  const MobileSidebarSubLink = ({ label, to }: { label: string, to: string }) => {
    const isActive = isCurrentPath(to);
    return (
      <a // Use 'a' or button to avoid React Router Link interfering with onClick easily without wrapping?
        // Actually Link with onClick is fine.
        href={to}
        onClick={(e) => {
          e.preventDefault();
          onNavigate(to);
        }}
        className={`block py-2 px-3 rounded-md text-sm transition-colors 
                  ${isActive
            ? "text-green-600 font-semibold"
            : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
          }`}
      >
        {label}
      </a>
    )
  }

  // Wrapper to inject closing behavior into standard SubLink if mobile
  const SubLink = isMobile ? MobileSidebarSubLink : SidebarSubLink;


  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <div className="relative h-full flex flex-col justify-between">
        {/* Collapse Toggle Button (Desktop Only) */}
        {!isMobile && setCollapsed && (
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
        )}

        {/* Mobile Close Button */}
        {isMobile && closeMobileDrawer && (
          <div className="flex justify-between items-center px-4 pt-4 pb-2">
            <span className="font-bold text-lg text-gray-800">Menu</span>
            <button
              onClick={closeMobileDrawer}
              className="p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        )}

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

            {/* Flyout Menu */}
            {isCreateNewOpen && createPortal(
              <div
                ref={menuRef}
                className="fixed w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                style={{ top: menuPosition.top, left: menuPosition.left }}
              >
                <div className="flex flex-col py-1">
                  {[
                    { label: 'List a unit', path: '/dashboard/list-unit' },
                    { label: 'Create New Property', path: '/dashboard/property/add' },
                    { label: 'Create New Lease', path: '/dashboard/leasing/leases' },
                    { label: 'Record an Income', path: '/dashboard/accounting/transactions/income/add' },
                    { label: 'Record a Request', path: '/dashboard/maintenance/request' }
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        setIsCreateNewOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left last:border-0"
                    >
                      {item.label}
                    </button>
                  ))}
                  {/* Invite to Apply Special Case */}
                  <button
                    onClick={() => {
                      setIsInviteModalOpen(true);
                      setIsCreateNewOpen(false);
                    }}
                    className="px-4 py-2.5 text-sm font-medium text-[#1BCB40] hover:bg-green-50 border-b border-gray-100 transition-colors text-left"
                  >
                    Invite to Apply
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
          <nav className="px-1 py-2 space-y-1">
            <SidebarDropdownLink
              label="Dashboard"
              icon={<PiChartLineUpFill size={24} />}
              isCurrentPath={isCurrentPath}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              <SubLink label="Overview" to="/dashboard" isCurrentPath={isCurrentPath} />
              <SubLink label="Tasks" to="/dashboard/tasks" isCurrentPath={isCurrentPath} />
            </SidebarDropdownLink>

            <SidebarDropdownLink
              label="Portfolio"
              icon={<PiChartPieSliceFill size={24} />}
              isCurrentPath={isCurrentPath}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              <SubLink label="Properties" to="/dashboard/properties" isCurrentPath={isCurrentPath} />
              <SubLink label="Units" to="/dashboard/portfolio/units" isCurrentPath={isCurrentPath} />
              <SubLink label="Listing" to="/dashboard/portfolio/listing" isCurrentPath={isCurrentPath} />
              <SubLink label="Keys & Locks" to="/dashboard/portfolio/keys-locks" isCurrentPath={isCurrentPath} />
              <SubLink label="Equipment" to="/dashboard/equipments" isCurrentPath={isCurrentPath} />
            </SidebarDropdownLink>

            <SidebarDropdownLink
              label="Leasing"
              icon={<PiBuildingsFill size={24} />}
              isCurrentPath={isCurrentPath}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              <SubLink label="Applications" to="/dashboard/leasing/applications" isCurrentPath={isCurrentPath} />
              <SubLink label="Leases" to="/dashboard/leasing/leases" isCurrentPath={isCurrentPath} />
              <SubLink label="Leads" to="/dashboard/leasing/leads" isCurrentPath={isCurrentPath} />
            </SidebarDropdownLink>

            <SidebarDropdownLink
              label="Contacts"
              icon={<PiUsersFill size={24} />}
              isCurrentPath={isCurrentPath}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              <SubLink label="Tenants" to="/dashboard/contacts/tenants" isCurrentPath={isCurrentPath} />
              <SubLink label="Service Pros" to="/dashboard/contacts/service-pros" isCurrentPath={isCurrentPath} />
            </SidebarDropdownLink>

            <SidebarDropdownLink
              label="Accounting"
              icon={<PiCurrencyDollarFill size={24} />}
              isCurrentPath={isCurrentPath}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              <SubLink label="Transactions" to="/dashboard/accounting/transactions" isCurrentPath={isCurrentPath} />
              <SubLink label="Payments" to="/dashboard/accounting/payments" isCurrentPath={isCurrentPath} />
              <SubLink label="Recurring" to="/dashboard/accounting/recurring" isCurrentPath={isCurrentPath} />
            </SidebarDropdownLink>

            <SidebarDropdownLink
              label="Maintenance"
              icon={<PiWrenchFill size={24} />}
              isCurrentPath={isCurrentPath}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              <SubLink label="Requests" to="/dashboard/maintenance/requests" isCurrentPath={isCurrentPath} />
              <SubLink label="Recurring" to="/dashboard/maintenance/recurring" isCurrentPath={isCurrentPath} />
            </SidebarDropdownLink>

            <SidebarDropdownLink
              label="Documents"
              icon={<PiFileTextFill size={24} />}
              isCurrentPath={isCurrentPath}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              <SubLink label="Landlord forms" to="/dashboard/documents/landlord-forms" isCurrentPath={isCurrentPath} />
              <SubLink label="My templates" to="/dashboard/documents/my-templates" isCurrentPath={isCurrentPath} />
              <SubLink label="File manager" to="/dashboard/documents/file-manager" isCurrentPath={isCurrentPath} />
            </SidebarDropdownLink>
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
      <InviteToApplyModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSend={(email, propertyId) => {
          console.log('Sending invitation:', { email, propertyId });
        }}
      />
    </SidebarContext.Provider>
  );
}


/**
 * Main Sidebar Component
 */
export default function DashboardSidebar({ open, setOpen, collapsed, setCollapsed }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed z-50 top-16 left-0 h-[calc(100vh-64px)] 
        bg-white shadow-md transition-all duration-300 overflow-y-auto scrollbar-hide
        ${collapsed ? "w-20" : "w-55"}`}
      >
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* Mobile Drawer (Headless UI) */}
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[60] lg:hidden" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full h-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative w-full max-w-xs bg-white shadow-xl h-full flex flex-col overflow-y-auto">
                  <SidebarContent
                    collapsed={false}
                    isMobile={true}
                    closeMobileDrawer={() => setOpen(false)}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}