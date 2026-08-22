// src/components/userdashboard/UserDashboardNavbar.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
    Search,
    Bell,
    MessageSquare,
    // Info, // used by the commented-out Info button below
    User,
    LogOut,
    UserCog,
    X,
    MoreHorizontal,
    Building2,
    Wrench,
    FileText,
    Loader2,
} from "lucide-react";
import { tenantIcon as logo, formatRole } from "../../utils/roleIcon";
import { API_ENDPOINTS } from "../../config/api.config";
import { authService } from "../../services/auth.service";
import { useGetCurrentUser } from "../../hooks/useAuthQueries";
import { useGetUnreadCount } from "../../hooks/useNotificationQueries";
import { useGetAllMaintenanceRequests } from "../../hooks/useMaintenanceRequestQueries";
import { useGetAllApplications } from "../../hooks/useApplicationQueries";
import AccountSwitcherModal from "../common/AccountSwitcherModal";

interface NavbarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const MIN_SEARCH_LENGTH = 2;
const MAX_RESULTS_PER_GROUP = 5;

const BADGE_COLORS: Record<string, string> = {
    New: 'bg-purple-100 text-purple-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Submitted: 'bg-blue-100 text-blue-700',
    Draft: 'bg-gray-100 text-gray-600',
};

// Mirrors the status mapping used on the tenant Requests page
const REQUEST_STATUS_LABELS: Record<string, string> = {
    NEW: 'New',
    IN_REVIEW: 'In Progress',
    ASSIGNED: 'In Progress',
    VENDOR_NOTIFIED: 'In Progress',
    IN_PROGRESS: 'In Progress',
    ON_HOLD: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
};

interface SearchItem {
    id: string;
    label: string;
    sublabel?: string;
    badge?: string;
    route: string;
}

interface SearchResults {
    properties: SearchItem[];
    requests: SearchItem[];
    applications: SearchItem[];
}

const SearchGroup: React.FC<{
    icon: React.ReactNode;
    label: string;
    items: SearchItem[];
    onSelect: (route: string) => void;
}> = ({ icon, label, items, onSelect }) => (
    <div>
        <div className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            {icon}
            {label}
        </div>
        {items.map((item) => (
            <button
                key={item.id}
                onClick={() => onSelect(item.route)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left gap-3"
            >
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.label}</p>
                    {item.sublabel && <p className="text-xs text-gray-400 truncate">{item.sublabel}</p>}
                </div>
                {item.badge && (
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGE_COLORS[item.badge] ?? 'bg-gray-100 text-gray-600'}`}>
                        {item.badge}
                    </span>
                )}
            </button>
        ))}
        <div className="mx-4 border-b border-gray-100 last:hidden" />
    </div>
);

const matches = (query: string, ...fields: Array<string | undefined | null>) =>
    fields.some((f) => !!f && f.toLowerCase().includes(query));

/** Endpoints return either a bare array or a paginated `{ data: [...] }` envelope. */
const toList = <T,>(data: unknown): T[] =>
    Array.isArray(data) ? (data as T[]) : ((data as { data?: T[] } | undefined)?.data ?? []);

type RawAddress = { streetAddress?: string; city?: string; stateRegion?: string; zipCode?: string };

type RawListing = {
    id: string;
    propertyName?: string;
    listing?: { title?: string };
    address?: RawAddress;
};

type RawRequest = {
    id: string;
    title?: string;
    issue?: string;
    subissue?: string;
    category?: string;
    problemDetails?: string;
    status?: string;
    property?: { propertyName?: string };
};

type RawApplication = {
    id: string;
    status?: string;
    applicants?: Array<{ isPrimary?: boolean; firstName?: string; lastName?: string }>;
    leasing?: { property?: { propertyName?: string; address?: RawAddress } };
};

export default function UserDashboardNavbar({ sidebarOpen: _, setSidebarOpen }: NavbarProps) {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLInputElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: unreadData } = useGetUnreadCount();
    const unreadCount = unreadData?.unreadCount ?? 0;

    const { data: currentUser, isLoading } = useGetCurrentUser();
    const userName = currentUser?.fullName || "User";
    const userEmail = currentUser?.email || "";
    const userRole = formatRole(currentUser?.role) || "";
    const profilePhotoUrl = currentUser?.profilePhotoUrl || "";

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
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

    // Debounce what the user types before hitting the network / filtering
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const isSearching = debouncedQuery.length >= MIN_SEARCH_LENGTH;

    // Tenant-scoped sources. All three only load once the user actually searches.
    const { data: listingsData, isFetching: listingsFetching } = useQuery({
        queryKey: ["userdashboard", "global-search", "listings"],
        queryFn: async () => {
            const res = await fetch(API_ENDPOINTS.PROPERTY.GET_PUBLIC_LISTINGS, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to load properties");
            return res.json();
        },
        enabled: isSearching,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
    const { data: requestsData, isFetching: requestsFetching } = useGetAllMaintenanceRequests(isSearching);
    const { data: applicationsData, isFetching: applicationsFetching } = useGetAllApplications(undefined, isSearching);

    const isSearchLoading = listingsFetching || requestsFetching || applicationsFetching;

    const searchResults = useMemo<SearchResults>(() => {
        const empty: SearchResults = { properties: [], requests: [], applications: [] };
        if (!isSearching) return empty;

        const q = debouncedQuery.toLowerCase();

        const properties: SearchItem[] = toList<RawListing>(listingsData)
            .filter((p) => matches(
                q,
                p.listing?.title,
                p.propertyName,
                p.address?.streetAddress,
                p.address?.city,
                p.address?.stateRegion,
                p.address?.zipCode,
            ))
            .slice(0, MAX_RESULTS_PER_GROUP)
            .map((p) => ({
                id: String(p.id),
                label: p.listing?.title || p.propertyName || "Unnamed Property",
                sublabel: [p.address?.streetAddress, p.address?.city, p.address?.stateRegion]
                    .filter(Boolean)
                    .join(", ") || undefined,
                route: `/userdashboard/properties/${p.id}`,
            }));

        const requests: SearchItem[] = toList<RawRequest>(requestsData)
            .filter((r) => matches(q, r.title, r.issue, r.subissue, r.category, r.problemDetails, r.property?.propertyName))
            .slice(0, MAX_RESULTS_PER_GROUP)
            .map((r) => ({
                id: String(r.id),
                label: r.title || r.issue || r.category || "Maintenance request",
                sublabel: r.property?.propertyName || undefined,
                badge: REQUEST_STATUS_LABELS[r.status ?? ""],
                route: `/userdashboard/requests/${r.id}`,
            }));

        const applications: SearchItem[] = toList<RawApplication>(applicationsData)
            .filter((a) => {
                const applicant = a.applicants?.find((x) => x.isPrimary) || a.applicants?.[0];
                const address = a.leasing?.property?.address;
                return matches(
                    q,
                    applicant ? `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`.trim() : undefined,
                    a.leasing?.property?.propertyName,
                    address?.streetAddress,
                    address?.city,
                    a.status,
                );
            })
            .slice(0, MAX_RESULTS_PER_GROUP)
            .map((a) => {
                const applicant = a.applicants?.find((x) => x.isPrimary) || a.applicants?.[0];
                const address = a.leasing?.property?.address;
                const status = a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1).toLowerCase() : undefined;
                return {
                    id: String(a.id),
                    label: applicant
                        ? `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`.trim() || "Application"
                        : a.leasing?.property?.propertyName || "Application",
                    sublabel: [address?.streetAddress, address?.city].filter(Boolean).join(", ") || undefined,
                    badge: status,
                    route: `/userdashboard/applications/${a.id}`,
                };
            });

        return { properties, requests, applications };
    }, [isSearching, debouncedQuery, listingsData, requestsData, applicationsData]);

    const totalResults =
        searchResults.properties.length + searchResults.requests.length + searchResults.applications.length;

    const handleSearchResultClick = (route: string) => {
        setIsSearchOpen(false);
        setIsMobileSearchOpen(false);
        setSearchQuery("");
        setDebouncedQuery("");
        navigate(route);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    const renderSearchGroups = () => (
        <div className="py-2">
            {searchResults.properties.length > 0 && (
                <SearchGroup icon={<Building2 size={13} />} label="Properties" items={searchResults.properties} onSelect={handleSearchResultClick} />
            )}
            {searchResults.requests.length > 0 && (
                <SearchGroup icon={<Wrench size={13} />} label="Requests" items={searchResults.requests} onSelect={handleSearchResultClick} />
            )}
            {searchResults.applications.length > 0 && (
                <SearchGroup icon={<FileText size={13} />} label="Applications" items={searchResults.applications} onSelect={handleSearchResultClick} />
            )}
        </div>
    );

    const renderSearchDropdown = (maxHeightClass: string) => (
        <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden overflow-y-auto ${maxHeightClass}`}>
            {isSearchLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-gray-400 text-sm">
                    <Loader2 size={16} className="animate-spin" /> Searching…
                </div>
            ) : totalResults === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">
                    No results for <span className="font-medium text-gray-600">"{debouncedQuery}"</span>
                </div>
            ) : (
                renderSearchGroups()
            )}
        </div>
    );

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            queryClient.clear();
            navigate("/login", { replace: true });
            setIsProfileDropdownOpen(false);
        }
    };

    const handleAddAnotherAccount = () => {
        setIsProfileDropdownOpen(false);
        setIsAccountSwitcherOpen(true);
    };

    const switchToAccount = async (email: string) => {
        setIsAccountSwitcherOpen(false);
        try {
            await authService.logout();
        } catch { /* continue */ }
        queryClient.clear();
        const encoded = encodeURIComponent(email);
        navigate(`/login?add_account=1&email=${encoded}`, { replace: true });
    };

    const openFreshLogin = async () => {
        setIsAccountSwitcherOpen(false);
        try {
            await authService.logout();
        } catch { /* ignore */ }
        queryClient.clear();
        navigate("/login?add_account=1", { replace: true });
    };

    const handleManageProfile = () => {
        setIsProfileDropdownOpen(false);
        navigate("/userdashboard/settings");
    };

    return (
        <header className="relative h-16 bg-[var(--color-navbar-bg)] flex items-center px-4 lg:px-6 gap-4 shadow-sm z-50">
            {/* Mobile Search Overlay */}
            {isMobileSearchOpen ? (
                <div className="absolute inset-0 bg-[var(--color-navbar-bg)] flex items-center px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex-1 relative" ref={searchRef}>
                        <input
                            ref={mobileSearchRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                            onFocus={() => { if (searchQuery.trim().length >= MIN_SEARCH_LENGTH) setIsSearchOpen(true); }}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search anything..."
                            className="w-full h-10 pl-4 pr-10 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {isSearchLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={18} />}
                        </div>

                        {isSearchOpen && isSearching && renderSearchDropdown("max-h-[60vh]")}
                    </div>
                    <button
                        onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(""); setIsSearchOpen(false); }}
                        className="ml-3 text-white p-2 rounded-full hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <>
                    {/* Logo container */}
                    <div className="flex items-center gap-3 lg:gap-4 lg:w-64 min-w-fit">
                        {/* Hamburger (Mobile/Tablet) */}
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

                        {/* Logo - links back to the tenant dashboard home */}
                        <Link
                            to="/userdashboard"
                            aria-label="Go to dashboard"
                            className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
                        >
                            <img src={logo} alt="SmartTenantAI" className="w-7 h-7 rounded-md object-cover" />
                            <span className="text-lg font-bold hidden sm:inline-block tracking-tight">SmartTenantAI</span>
                        </Link>
                    </div>

                    {/* Middle Section: Search Bar */}
                    <div className="flex-1 flex justify-center lg:justify-start max-w-xl mx-auto lg:mx-0 lg:pl-4">
                        <div className="hidden sm:block w-full max-w-md relative group" ref={searchRef}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                                onFocus={() => { if (searchQuery.trim().length >= MIN_SEARCH_LENGTH) setIsSearchOpen(true); }}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Search properties, requests, applications..."
                                className="w-full h-9 pl-4 pr-10 rounded-full bg-white/90 hover:bg-white text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all shadow-sm"
                            />
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center">
                                {isSearchLoading
                                    ? <Loader2 size={13} className="text-white animate-spin" />
                                    : <Search size={14} className="text-white" />
                                }
                            </div>

                            {isSearchOpen && isSearching && renderSearchDropdown("max-h-[420px]")}
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
                                                navigate('/userdashboard/properties');
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Building2 size={16} className="text-gray-700" />
                                            </div>
                                            <span className="font-medium">Properties</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                navigate('/userdashboard/messages');
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
                                                navigate('/userdashboard/notifications');
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="relative w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Bell size={16} className="text-gray-700" />
                                                {unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-[#3A6D6C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center min-w-[16px]">
                                                        {unreadCount > 9 ? '9+' : unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-medium">Notifications</span>
                                            {unreadCount > 0 && (
                                                <span className="ml-auto text-xs font-bold text-[#3A6D6C]">{unreadCount}</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Desktop Actions (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center gap-1 md:gap-2">
                            <button
                                aria-label="Property"
                                onClick={() => navigate('/userdashboard/properties')}
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                            >
                                <Building2 size={18} className="text-gray-800" />
                            </button>

                            <button
                                aria-label="Messages"
                                onClick={() => navigate('/userdashboard/messages')}
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)] relative transition-transform"
                            >
                                <MessageSquare size={18} className="text-gray-800" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
                            </button>

                            {/* Info button temporarily hidden - uncomment to restore
                            <button
                                aria-label="Info"
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                            >
                                <Info size={18} className="text-gray-800" />
                            </button>
                            */}

                            <button
                                aria-label="Notifications"
                                onClick={() => navigate('/userdashboard/notifications')}
                                className="relative w-8 h-8 md:mr-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                            >
                                <Bell size={18} className="text-gray-800" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#3A6D6C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center min-w-[16px]">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
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
                                    {profilePhotoUrl ? (
                                        <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={16} className="text-white" />
                                    )}
                                </div>
                            </div>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-4 w-80 bg-white rounded-b-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-gray-200 overflow-hidden z-50">
                                    <div className="px-5 pt-5 pb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white self-start overflow-hidden">
                                                {profilePhotoUrl ? (
                                                    <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={28} />
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start space-y-0.5">
                                                <p className="text-xs text-gray-500">{userRole || "User"}</p>
                                                <p className="text-xl font-semibold text-gray-900">{isLoading ? "Loading..." : userName}</p>
                                                <p className="text-sm text-gray-600 truncate">{userEmail || ""}</p>
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

            <AccountSwitcherModal
                isOpen={isAccountSwitcherOpen}
                onClose={() => setIsAccountSwitcherOpen(false)}
                onSwitch={switchToAccount}
                onAddNew={openFreshLogin}
            />
        </header>
    );
}
