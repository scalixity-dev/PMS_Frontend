// src/components/service-dashboard/layout/ServiceDashboardSidebar.tsx

import React, { useState, useRef, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
    PiChartLineUpFill,
    PiCheckSquareFill,
    PiUsersFill,
    PiCurrencyDollarFill,
    PiCalendarFill,
    PiDownloadFill,
    PiFolderFill
} from "react-icons/pi";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react';
import artworkImage from "../../../assets/images/Artwork.png";

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

// --- Download Popup Component ---
interface DownloadPopupProps {
    isOpen: boolean;
    onClose: () => void;
    position: { top: number; left: number } | null;
    popupRef: React.RefObject<HTMLDivElement | null>;
}

interface DownloadedFile {
    id: number;
    name: string;
    size: string;
    date: string;
    type: 'pdf' | 'image' | 'document' | 'video';
}

const mockDownloadedFiles: DownloadedFile[] = [
    { id: 1, name: "Invoice_Jan2024.pdf", size: "1.2 MB", date: "2024-01-28", type: "pdf" },
    { id: 2, name: "Work_Order_Report.pdf", size: "856 KB", date: "2024-01-27", type: "pdf" },
    { id: 3, name: "Property_Photos.zip", size: "15.4 MB", date: "2024-01-26", type: "image" },
    { id: 4, name: "Service_Contract.docx", size: "245 KB", date: "2024-01-25", type: "document" },
    { id: 5, name: "Maintenance_Guide.pdf", size: "3.4 MB", date: "2024-01-24", type: "pdf" },
    { id: 6, name: "Kitchen_Renovation_Specs.docx", size: "1.1 MB", date: "2024-01-23", type: "document" },
    { id: 7, name: "Roof_Inspection.mp4", size: "45.2 MB", date: "2024-01-22", type: "video" },
    { id: 8, name: "Floor_Plan_v2.pdf", size: "2.8 MB", date: "2024-01-21", type: "pdf" },
];

const DownloadPopup: React.FC<DownloadPopupProps> = ({ isOpen, onClose, position, popupRef }) => {
    const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (isOpen && position && popupRef.current) {
            const popupHeight = popupRef.current.offsetHeight;
            const popupWidth = popupRef.current.offsetWidth;
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            let top = position.top;
            let left = position.left;

            // Prevent overflow from bottom
            if (top + popupHeight > viewportHeight - 20) {
                top = viewportHeight - popupHeight - 20;
            }

            // Prevent overflow from top
            if (top < 10) {
                top = 10;
            }

            // For mobile, handle width differently
            if (viewportWidth < 640) {
                left = (viewportWidth - popupWidth) / 2;
            } else {
                // Prevent overflow from right
                if (left + popupWidth > viewportWidth - 20) {
                    left = viewportWidth - popupWidth - 20;
                }
            }

            setPopupStyle({
                top: `${top}px`,
                left: `${left}px`,
            });
        }
    }, [isOpen, position]);

    if (!isOpen || !position) return null;

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-[10px] font-bold">PDF</div>;
            case 'image':
                return <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-[10px] font-bold">IMG</div>;
            case 'document':
                return <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-[10px] font-bold">DOC</div>;
            case 'video':
                return <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-[10px] font-bold">VID</div>;
            default:
                return <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-[10px] font-bold">FILE</div>;
        }
    };

    return createPortal(
        <div
            ref={popupRef}
            className="fixed z-[9999] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 w-[calc(100vw-32px)] sm:w-[450px] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={popupStyle}
        >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div>
                    <h3 className="text-base font-bold text-gray-900">Downloads</h3>
                    <p className="text-[11px] text-gray-500 font-medium">Manage your recently downloaded files</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close downloads"
                    title="Close downloads"
                >
                    <X size={18} />
                </button>
            </div>
            <div className="max-h-[min(400px,60vh)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {mockDownloadedFiles.length > 0 ? (
                    mockDownloadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-3.5 hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-b-0">
                            {getFileIcon(file.type)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate tracking-tight">{file.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] text-gray-500 font-medium">{file.size}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="text-[11px] text-gray-500 font-medium">
                                        {(() => {
                                            const [y, m, d] = file.date.split('-').map(Number);
                                            return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                        })()}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="p-2.5 text-gray-400 hover:text-[#3A6D6C] hover:bg-[#3A6D6C]/10 rounded-xl transition-all active:scale-90"
                                aria-label={`Download ${file.name}`}
                                title={`Download ${file.name}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">No recent downloads found.</div>
                )}
            </div>
            <div className="p-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                <span className="text-xs font-semibold text-gray-500 ml-1">{mockDownloadedFiles.length} files total</span>
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[#3A6D6C] text-white rounded-lg text-sm font-bold hover:bg-[#2c5251] transition-all active:scale-95 shadow-lg shadow-[#3A6D6C]/20"
                >
                    Done
                </button>
            </div>
        </div>,
        document.body
    );
};

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
    const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
    const [downloadPopupPosition, setDownloadPopupPosition] = useState({ top: 0, left: 0 });
    const downloadButtonRef = useRef<HTMLDivElement>(null);
    const downloadPopupRef = useRef<HTMLDivElement>(null);

    // Close dropdown on route change
    useEffect(() => {
        setActiveDropdown(null);
        setIsDownloadPopupOpen(false);
    }, [location.pathname]);

    // Navigate helper that also closes mobile drawer
    const onNavigate = (path: string) => {
        navigate(path);
        if (isMobile && closeMobileDrawer) closeMobileDrawer();
    }

    const toggleDownloads = () => {
        if (!isDownloadPopupOpen && downloadButtonRef.current) {
            const rect = downloadButtonRef.current.getBoundingClientRect();
            setDownloadPopupPosition({
                top: rect.top,
                left: isMobile ? 16 : rect.right + 15
            });
        }
        setIsDownloadPopupOpen(!isDownloadPopupOpen);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (downloadButtonRef.current && !downloadButtonRef.current.contains(target) && downloadPopupRef.current && !downloadPopupRef.current.contains(target)) {
                setIsDownloadPopupOpen(false);
            }
        };

        const handleScroll = () => {
            if (isDownloadPopupOpen && downloadButtonRef.current) {
                const rect = downloadButtonRef.current.getBoundingClientRect();
                setDownloadPopupPosition({
                    top: rect.top,
                    left: isMobile ? 16 : rect.right + 15
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
    }, [isDownloadPopupOpen, isMobile]);

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
    const SubLink = isMobile ? MobileSidebarSubLink : SidebarSubLink;


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
                    {/* Navigation - Service Dashboard Items */}
                    <nav className="px-1 py-2 space-y-1">
                        <SidebarLink
                            label="Dashboard"
                            icon={<PiChartLineUpFill size={24} />}
                            to="/service-dashboard"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                            exact={true}
                        />

                        <SidebarLink
                            label="Task"
                            icon={<PiCheckSquareFill size={24} />}
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        >
                            <SubLink label="Find a Job" to="/service-dashboard/find-job" />
                            <SubLink label="Requests" to="/service-dashboard/requests" />
                            <SubLink label="Request Board" to="/service-dashboard/requests-board" />
                        </SidebarLink>



                        <SidebarLink
                            label="Accounting"
                            icon={<PiCurrencyDollarFill size={24} />}
                            to="/service-dashboard/accounting"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />

                        <SidebarLink
                            label="Contact"
                            icon={<PiUsersFill size={24} />}
                            to="/service-dashboard/contacts"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />

                        <SidebarLink
                            label="Calendar"
                            icon={<PiCalendarFill size={24} />}
                            to="/service-dashboard/calendar"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />

                        <SidebarLink
                            label="File Manager"
                            icon={<PiFolderFill size={24} />}
                            to="/service-dashboard/file-manager"
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />

                        <div ref={downloadButtonRef}>
                            <div
                                className={`flex items-center px-3 py-2.5 rounded-md transition-colors cursor-pointer text-gray-700 hover:bg-gray-100 group ${collapsed ? "justify-center" : "justify-between"}`}
                                onClick={toggleDownloads}
                            >
                                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
                                    <span className="text-black group-hover:text-black">
                                        <PiDownloadFill size={24} />
                                    </span>
                                    {!collapsed && (
                                        <span className="text-black group-hover:text-black text-sm font-medium">
                                            Downloads
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

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
            <DownloadPopup isOpen={isDownloadPopupOpen} onClose={() => setIsDownloadPopupOpen(false)} position={downloadPopupPosition} popupRef={downloadPopupRef} />
        </SidebarContext.Provider>
    );
}


/**
 * Main Sidebar Component
 */
export default function ServiceDashboardSidebar({ open, setOpen, collapsed, setCollapsed }: SidebarProps) {
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
