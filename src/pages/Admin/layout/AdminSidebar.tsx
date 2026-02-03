import React, { useState, useRef, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
    PiChartLineUpFill,
    PiUsersFill,
    PiBuildingsFill,
    PiFileTextFill,
    PiCreditCardFill,
    PiGearFill
} from "react-icons/pi";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react';
// import artworkImage from "../../../assets/images/Artwork.png"; // Assuming same asset location

interface SidebarContextType {
    collapsed: boolean;
    onNavigate?: (path: string) => void;
}

const SidebarContext = React.createContext<SidebarContextType>({ collapsed: false });

// --- Type Definitions ---
interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

interface SidebarDropdownLinkProps {
    label: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
    to?: string;
    activeDropdown: string | null;
    setActiveDropdown: (label: string | null) => void;
    exact?: boolean;
    onClick?: () => void;
    linkRef?: React.RefObject<HTMLDivElement>;
}

// --- Component Implementations ---

interface SidebarSubLinkProps { label: string; to: string; }

function SidebarSubLink({ label, to }: SidebarSubLinkProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `block w-full text-left py-2 px-3 rounded-md text-sm transition-colors ${isActive
                    ? "text-green-600 font-semibold"
                    : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                }`
            }
            end
        >
            {label}
        </NavLink>
    );
}


function SidebarLink({ label, icon, children, to, activeDropdown, setActiveDropdown, exact }: SidebarDropdownLinkProps) {
    const location = useLocation();
    const { collapsed, onNavigate } = React.useContext(SidebarContext);
    const [isHovered, setIsHovered] = useState(false);
    const linkRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Check if active (handle both direct and dropdown children)
    const isActiveRoute = to
        ? (exact ? location.pathname === to : (location.pathname === to || location.pathname.startsWith(`${to}/`)))
        : React.Children.toArray(children).some((child) => {
            if (React.isValidElement(child)) {
                const props = child.props as { to?: string };
                if (props.to) {
                    const path = props.to;
                    return location.pathname === path || location.pathname.startsWith(`${path}/`);
                }
            }
            return false;
        });

    const isOpen = activeDropdown === label;
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            if (onNavigate) {
                onNavigate(to);
            } else {
                navigate(to);
            }
            return;
        }

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
                {!collapsed && children && (
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

            {!collapsed && children && (
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
                    {children && (
                        <div className="p-1 space-y-0.5">
                            {children}
                        </div>
                    )}
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

    // Close dropdown on route change
    useEffect(() => {
        setActiveDropdown(null);
    }, [location.pathname]);

    // Navigate helper that also closes mobile drawer
    const onNavigate = (path: string) => {
        navigate(path);
        if (isMobile && closeMobileDrawer) closeMobileDrawer();
    }


    // Enhance SidebarSubLink to close drawer on mobile click
    const MobileSidebarSubLink = ({ label, to }: { label: string, to: string }) => {
        return (
            <NavLink
                to={to}
                onClick={() => {
                    if (isMobile && closeMobileDrawer) closeMobileDrawer();
                }}
                className={({ isActive }) =>
                    `block py-2 px-3 rounded-md text-sm transition-colors ${isActive
                        ? "text-green-600 font-semibold"
                        : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                    }`
                }
                end
            >
                {label}
            </NavLink>
        )
    }

    // Wrapper to inject closing behavior into standard SubLink if mobile
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const SubLink = isMobile ? MobileSidebarSubLink : SidebarSubLink;


    return (
        <SidebarContext.Provider value={{ collapsed, onNavigate }}>
            <div className="relative h-full flex flex-col justify-between">
                {/* Collapse Toggle Button (Desktop Only) */}
                {!isMobile && setCollapsed && (
                    <div className="flex justify-end px-3 pt-1">
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
                    {/* Navigation - Admin Dashboard Items */}
                    <nav className="px-1 py-2 space-y-1">
                        <SidebarLink
                            label="Dashboard"
                            icon={<PiChartLineUpFill size={24} />}
                            to="/admin/dashboard"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                            exact={true}
                        />

                        <SidebarLink
                            label="Users"
                            icon={<PiUsersFill size={24} />}
                            to="/admin/users"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />

                        <SidebarLink
                            label="Properties"
                            icon={<PiBuildingsFill size={24} />}
                            to="/admin/properties"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />

                        <SidebarLink
                            label="Leases"
                            icon={<PiFileTextFill size={24} />}
                            to="/admin/leases"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />

                        <SidebarLink
                            label="Payments"
                            icon={<PiCreditCardFill size={24} />}
                            to="/admin/payments"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />

                        <SidebarLink
                            label="Settings"
                            icon={<PiGearFill size={24} />}
                            to="/admin/settings"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />

                    </nav>
                </div>
            </div>
        </SidebarContext.Provider>
    );
}


/**
 * Main Sidebar Component
 */
export default function AdminSidebar({ open, setOpen, collapsed, setCollapsed }: SidebarProps) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:block fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-gray-100 transition-all duration-300 overflow-y-auto scrollbar-hide
        ${collapsed ? "w-20" : "w-64"}`}
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
