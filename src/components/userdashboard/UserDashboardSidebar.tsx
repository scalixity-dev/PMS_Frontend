// src/components/userdashboard/UserDashboardSidebar.tsx

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SquarePen, ChevronLeft, ChevronRight, ListPlus } from "lucide-react";
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import {
    PiChartLineUpFill,
    PiCurrencyDollarFill,
    PiWrenchFill,
    PiPlugsConnectedFill,
    PiHouseLineFill,
    PiFolderSimpleFill,
    PiCloudArrowDownFill,
    PiClipboardTextFill
} from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import artworkImage from "../../assets/images/Artwork.png";

const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false });

interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

interface SidebarLinkProps {
    label: string;
    to?: string;
    icon: React.ReactNode;
    isCurrentPath?: (path: string) => boolean;
    onClick?: () => void;
    linkRef?: React.RefObject<any>;
}

function SidebarLink({ label, to, icon, isCurrentPath, onClick, linkRef }: SidebarLinkProps) {
    const isActive = to && isCurrentPath ? isCurrentPath(to) : false;
    const { collapsed } = React.useContext(SidebarContext);

    const commonClasses = `flex items-center px-3 py-2.5 rounded-md transition-colors cursor-pointer
            ${isActive ? "bg-gray-100 font-semibold text-black" : "text-gray-700 hover:bg-gray-100 group"}
            ${collapsed ? "justify-center" : "justify-start"}`;

    if (onClick) {
        return (
            <button
                ref={linkRef}
                onClick={onClick}
                className={`${commonClasses} w-full`}
            >
                <span className={`${isActive ? "text-green-600" : "text-black group-hover:text-black"} ${collapsed ? "" : "mr-3"}`}>
                    {icon}
                </span>
                {!collapsed && (
                    <span className={`${isActive ? "text-green-600" : "text-black group-hover:text-black"} text-sm font-medium`}>
                        {label}
                    </span>
                )}
            </button>
        );
    }

    return (
        <Link
            to={to!}
            className={commonClasses}
        >
            <span className={`${isActive ? "text-green-600" : "text-black group-hover:text-black"} ${collapsed ? "" : "mr-3"}`}>
                {icon}
            </span>
            {!collapsed && (
                <span className={`${isActive ? "text-green-600" : "text-black group-hover:text-black"} text-sm font-medium`}>
                    {label}
                </span>
            )}
        </Link>
    );
}

interface DownloadPopupProps {
    isOpen: boolean;
    onClose: () => void;
    position: { top: number; left: number } | null;
    popupRef: React.RefObject<HTMLDivElement | null>;
}

const DownloadPopup: React.FC<DownloadPopupProps> = ({ isOpen, onClose, position, popupRef }) => {
    if (!isOpen || !position) return null;

    return createPortal(
        <div
            ref={popupRef}
            className="fixed z-[9999] bg-white rounded-lg shadow-[0px_4px_24px_rgba(0,0,0,0.12)] border border-gray-100 w-[450px] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{
                top: position.top,
                left: position.left,
            }}
        >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-base font-bold text-[#111827]">Downloads</h3>

            </div>
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[250px]">
                <div className="mb-2 p-4 bg-gray-50 rounded-full">
                    <ListPlus size={40} className="text-[#566573]" />
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-[#111827] mb-2">No files downloaded yet</h4>
                    <p className="text-sm text-[#7F8C8D] leading-relaxed max-w-[280px] mx-auto">
                        There are no downloaded files. Once you export some files, they will appear here.
                    </p>
                </div>
            </div>
            <div className="p-3 border-t border-gray-100 flex justify-end">
                <PrimaryActionButton
                    onClick={onClose}
                    text="Close"
                    className="text-xs"
                />
            </div>
        </div>,
        document.body
    );
};

export default function UserDashboardSidebar({ open, setOpen, collapsed, setCollapsed }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
    const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [downloadPopupPosition, setDownloadPopupPosition] = useState({ top: 0, left: 0 });

    const createNewRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const downloadButtonRef = useRef<HTMLButtonElement>(null);
    const downloadPopupRef = useRef<HTMLDivElement>(null);

    const toggleCreateNew = () => {
        if (!isCreateNewOpen && createNewRef.current) {
            const rect = createNewRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.top + 14,
                left: rect.right + 10
            });
            setIsDownloadPopupOpen(false);
        }
        setIsCreateNewOpen(!isCreateNewOpen);
    };

    const toggleDownloads = () => {
        if (!isDownloadPopupOpen && downloadButtonRef.current) {
            const rect = downloadButtonRef.current.getBoundingClientRect();
            setDownloadPopupPosition({
                top: rect.top - 150,
                left: rect.right + 15
            });
            setIsCreateNewOpen(false);
        }
        setIsDownloadPopupOpen(!isDownloadPopupOpen);
    }


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                createNewRef.current &&
                !createNewRef.current.contains(target) &&
                menuRef.current &&
                !menuRef.current.contains(target)
            ) {
                setIsCreateNewOpen(false);
            }

            if (
                downloadButtonRef.current &&
                !downloadButtonRef.current.contains(target) &&
                downloadPopupRef.current &&
                !downloadPopupRef.current.contains(target)
            ) {
                setIsDownloadPopupOpen(false);
            }
        };

        const handleScroll = () => {
            if (isCreateNewOpen && createNewRef.current) {
                const rect = createNewRef.current.getBoundingClientRect();
                setMenuPosition({
                    top: rect.top + 20,
                    left: rect.right + 10
                });
            }
            if (isDownloadPopupOpen && downloadButtonRef.current) {
                const rect = downloadButtonRef.current.getBoundingClientRect();
                setDownloadPopupPosition({
                    top: rect.top - 150,
                    left: rect.right + 15
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
    }, [isCreateNewOpen, isDownloadPopupOpen]);

    const isCurrentPath = (path: string) => location.pathname === path;

    return (
        <SidebarContext.Provider value={{ collapsed }}>
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}
            <aside
                className={`fixed lg:static z-50 top-16 left-0 h-[calc(100vh-32px)] 
        bg-white shadow-md transform lg:translate-x-0 transition-all duration-300 overflow-y-auto scrollbar-hide
        ${open ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "w-20" : "w-55"}`}
            >
                <div className="relative h-full flex flex-col justify-between">
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

                            {isCreateNewOpen && createPortal(
                                <div
                                    ref={menuRef}
                                    className="fixed w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                    style={{ top: menuPosition.top, left: menuPosition.left }}
                                >
                                    <div className="flex flex-col py-1">
                                        <button
                                            onClick={() => {
                                                navigate("/userdashboard/new-request");
                                                setIsCreateNewOpen(false);
                                            }}
                                            className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 border-b border-gray-100 transition-colors text-left"
                                        >
                                            New Request
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

                        <nav className="px-1 py-2 space-y-1">
                            <SidebarLink
                                label="Dashboard"
                                to="/userdashboard"
                                icon={<PiChartLineUpFill size={22} />}
                                isCurrentPath={isCurrentPath}
                            />
                            <SidebarLink
                                label="Rent"
                                to="/userdashboard/rent"
                                icon={<PiCurrencyDollarFill size={22} />}
                                isCurrentPath={isCurrentPath}
                            />
                            <SidebarLink
                                label="Requests"
                                to="/userdashboard/requests"
                                icon={<PiWrenchFill size={22} />}
                                isCurrentPath={isCurrentPath}
                            />
                            <SidebarLink
                                label="Utility Providers"
                                to="/userdashboard/utility-providers"
                                icon={<PiPlugsConnectedFill size={22} />}
                                isCurrentPath={isCurrentPath}
                            />
                            <SidebarLink
                                label="Properties"
                                to="/userdashboard/properties"
                                icon={<PiHouseLineFill size={22} />}
                                isCurrentPath={isCurrentPath}
                            />
                            <SidebarLink
                                label="Applications"
                                to="/userdashboard/applications"
                                icon={<PiClipboardTextFill size={22} />}
                                isCurrentPath={isCurrentPath}
                            />
                            <SidebarLink
                                label="File Manager"
                                to="/userdashboard/file-manager"
                                icon={<PiFolderSimpleFill size={22} />}
                                isCurrentPath={isCurrentPath}
                            />

                            {/* Separator line */}
                            <div className={`my-2 border-t border-gray-200 ${collapsed ? 'mx-2' : 'mx-3'}`} />

                            <SidebarLink
                                linkRef={downloadButtonRef}
                                label="Downloads"
                                onClick={toggleDownloads}
                                icon={<PiCloudArrowDownFill size={22} />}
                            />
                        </nav>
                    </div>

                    <div className={`p-4 mt-auto transition-all duration-300 ${collapsed ? 'opacity-0 scale-0 h-0 p-0 overflow-hidden' : 'opacity-100'}`}>
                        <img
                            src={artworkImage}
                            alt="Decorative artwork"
                            className="mx-auto object-fill opacity-90 blur-[3px]"
                        />
                    </div>
                </div>
            </aside >
            <DownloadPopup
                isOpen={isDownloadPopupOpen}
                onClose={() => setIsDownloadPopupOpen(false)}
                position={downloadPopupPosition}
                popupRef={downloadPopupRef}
            />
        </SidebarContext.Provider>
    );
}
