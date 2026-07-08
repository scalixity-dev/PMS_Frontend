// src/components/dashboard/DashboardNavbar.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Bell,
  MessageSquare,
  User,
  LogOut,
  UserCog,
  FileText,
  Download,
  Calendar,
  X,
  MoreHorizontal,
  Building2,
  Users,
  FileText as LeaseIcon,
  Star,
  Loader2,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api.config";
import logo from "../../assets/images/logo.png";
import { authService } from "../../services/auth.service";
import { useGetCurrentUser } from "../../hooks/useAuthQueries";
import { useGetUnreadCount } from "../../hooks/useNotificationQueries";
import { propertyQueryKeys } from "../../hooks/usePropertyQueries";
import AccountSwitcherModal from "../common/AccountSwitcherModal";
import DownloadsModal from "../common/DownloadsModal";
import { useTeamPermissions } from "../../context/TeamPermissionContext";

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

const BADGE_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  MULTI: 'bg-blue-100 text-blue-700',
  NEW: 'bg-purple-100 text-purple-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  EXPIRED: 'bg-red-100 text-red-700',
  TERMINATED: 'bg-red-100 text-red-700',
  'Multi-unit': 'bg-blue-100 text-blue-700',
  Single: 'bg-gray-100 text-gray-600',
};

const SearchGroup: React.FC<{
  icon: React.ReactNode;
  label: string;
  items: Array<{ id: string; label: string; sublabel?: string; badge?: string; route: string }>;
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

interface SearchResult {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  type: 'property' | 'tenant' | 'lease' | 'lead';
  route: string;
}

interface SearchResults {
  properties: SearchResult[];
  tenants: SearchResult[];
  leases: SearchResult[];
  leads: SearchResult[];
}

export default function DashboardNavbar({ setSidebarOpen }: NavbarProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isTeamMember, canView } = useTeamPermissions();
  const { data: currentUser, isLoading } = useGetCurrentUser();
  const { data: unreadData } = useGetUnreadCount();
  const unreadCount = unreadData?.unreadCount ?? 0;
  const userName = currentUser?.fullName || "User";
  const userEmail = currentUser?.email || "";
  const userRole = currentUser?.role || "";
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

  const runSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults(null);
      setIsSearchOpen(false);
      return;
    }

    if (searchAbortRef.current) searchAbortRef.current.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;

    setIsSearchLoading(true);
    setIsSearchOpen(true);

    try {
      const opts = { credentials: 'include' as const, signal: controller.signal };
      const q = encodeURIComponent(query);

      const [propRes, tenantRes, leaseRes, leadRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/property?search=${q}&_limit=5`, opts),
        fetch(`${API_BASE_URL}/tenant?search=${q}&_limit=5`, opts),
        fetch(`${API_BASE_URL}/leasing?search=${q}&_limit=5`, opts),
        fetch(`${API_BASE_URL}/leads?search=${q}&_limit=5`, opts),
      ]);

      const parseJson = async (res: PromiseSettledResult<Response>) => {
        if (res.status !== 'fulfilled' || !res.value.ok) return [];
        try { return await res.value.json(); } catch { return []; }
      };

      const [propData, tenantData, leaseData, leadData] = await Promise.all([
        parseJson(propRes),
        parseJson(tenantRes),
        parseJson(leaseRes),
        parseJson(leadRes),
      ]);

      const propList = Array.isArray(propData) ? propData : (propData?.data ?? []);
      const tenantList = Array.isArray(tenantData) ? tenantData : (tenantData?.data ?? []);
      const leaseList = Array.isArray(leaseData) ? leaseData : (leaseData?.data ?? []);
      const leadList = Array.isArray(leadData) ? leadData : (leadData?.data ?? []);

      setSearchResults({
        properties: propList.slice(0, 5).map((p: any) => ({
          id: p.propertyId || p.id,
          label: p.propertyName || p.name || 'Unnamed Property',
          badge: p.propertyType === 'MULTI' ? 'Multi-unit' : 'Single',
          type: 'property',
          route: `/dashboard/property-detail/${p.propertyId || p.id}`,
        })),
        tenants: tenantList.slice(0, 5).map((t: any) => ({
          id: t.id,
          label: t.user?.fullName || `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.email || 'Unknown Tenant',
          sublabel: t.contactBookEntry?.email || t.user?.email,
          type: 'tenant',
          route: `/dashboard/contacts/tenants/${t.id}`,
        })),
        leases: leaseList.slice(0, 5).map((l: any) => ({
          id: l.id,
          label: l.property?.propertyName || 'Unknown Property',
          sublabel: l.tenant?.user?.fullName || (l.tenant ? `${l.tenant.firstName || ''} ${l.tenant.lastName || ''}`.trim() : undefined),
          badge: l.status,
          type: 'lease',
          route: `/dashboard/leasing/leases/${l.id}`,
        })),
        leads: leadList.slice(0, 5).map((l: any) => ({
          id: l.id,
          label: l.name || l.fullName || 'Unknown Lead',
          badge: l.status,
          type: 'lead',
          route: `/dashboard/leasing/leads/${l.id}`,
        })),
      });
    } catch (err: any) {
      if (err?.name !== 'AbortError') setSearchResults(null);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => runSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, runSearch]);

  const handleSearchResultClick = (route: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults(null);
    navigate(route);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const totalResults = searchResults
    ? searchResults.properties.length + searchResults.tenants.length + searchResults.leases.length + searchResults.leads.length
    : 0;

  // Focus mobile search input when opened
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [isMobileSearchOpen]);

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

  // Account switcher: list remembered accounts; switching signs current user
  // out and redirects to /login with email prefilled.
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);

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
    sessionStorage.removeItem('service_pro_authenticated');
    const encoded = encodeURIComponent(email);
    navigate(`/login?add_account=1&email=${encoded}`, { replace: true });
  };

  const openFreshLogin = async () => {
    setIsAccountSwitcherOpen(false);
    try {
      await authService.logout();
    } catch { /* ignore */ }
    queryClient.clear();
    sessionStorage.removeItem('service_pro_authenticated');
    navigate('/login?add_account=1', { replace: true });
  };

  const handleManageProfile = () => {
    setIsProfileDropdownOpen(false);
    navigate(isTeamMember && !canView('settings') ? "/dashboard/settings/profile" : "/dashboard/settings");
  };

  return (
    <header className="relative h-16 bg-[var(--color-navbar-bg)] flex items-center px-4 lg:px-6 gap-4 shadow-sm z-50">

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen ? (
        <div className="absolute inset-0 bg-[var(--color-navbar-bg)] flex items-center px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex-1 relative">
            <input
              ref={mobileSearchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search properties, tenants..."
              className="w-full h-10 pl-4 pr-10 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {isSearchLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={18} />}
            </div>

            {/* Mobile Search Dropdown */}
            {isSearchOpen && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden max-h-[60vh] overflow-y-auto">
                {isSearchLoading ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-gray-400 text-sm">
                    <Loader2 size={16} className="animate-spin" /> Searching…
                  </div>
                ) : totalResults === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-400">
                    No results for <span className="font-medium text-gray-600">"{searchQuery}"</span>
                  </div>
                ) : (
                  <div className="py-2">
                    {searchResults!.properties.length > 0 && <SearchGroup icon={<Building2 size={13} />} label="Properties" items={searchResults!.properties} onSelect={(r) => { setIsMobileSearchOpen(false); handleSearchResultClick(r); }} />}
                    {searchResults!.tenants.length > 0 && <SearchGroup icon={<Users size={13} />} label="Tenants" items={searchResults!.tenants} onSelect={(r) => { setIsMobileSearchOpen(false); handleSearchResultClick(r); }} />}
                    {searchResults!.leases.length > 0 && <SearchGroup icon={<LeaseIcon size={13} />} label="Leases" items={searchResults!.leases} onSelect={(r) => { setIsMobileSearchOpen(false); handleSearchResultClick(r); }} />}
                    {searchResults!.leads.length > 0 && <SearchGroup icon={<Star size={13} />} label="Leads" items={searchResults!.leads} onSelect={(r) => { setIsMobileSearchOpen(false); handleSearchResultClick(r); }} />}
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(''); setSearchResults(null); setIsSearchOpen(false); }}
            className="ml-3 text-white p-2 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <>
          {/* Logo container */}
          <div className="flex items-center gap-3 lg:gap-4 lg:w-64 min-w-fit">
            {/* Hamburger (Mobile/Tablet) - Animated Toggle */}
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

            {/* Desktop Logo */}
            <div className="flex items-center gap-2 text-white">
              <img src={logo} alt="SmartTenantAI" className="w-7 h-7" style={{ filter: "invert(1) brightness(2)" }} />
              <span className="text-lg font-bold hidden sm:inline-block tracking-tight">SmartTenantAI</span>
            </div>
          </div>

          {/* Middle Section: Search Bar */}
          <div className="flex-1 flex justify-center lg:justify-start max-w-xl mx-auto lg:mx-0 lg:pl-4">
            {/* Desktop/Tablet Search */}
            <div className="hidden sm:block w-full max-w-md relative group" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.length >= 2) setIsSearchOpen(true); }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search properties, tenants..."
                className="w-full h-9 pl-4 pr-10 rounded-full bg-white/90 hover:bg-white text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all shadow-sm"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center">
                {isSearchLoading
                  ? <Loader2 size={13} className="text-white animate-spin" />
                  : <Search size={14} className="text-white" />
                }
              </div>

              {/* Search Dropdown */}
              {isSearchOpen && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden max-h-[420px] overflow-y-auto">
                  {isSearchLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-gray-400 text-sm">
                      <Loader2 size={16} className="animate-spin" />
                      Searching…
                    </div>
                  ) : totalResults === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-400">
                      No results for <span className="font-medium text-gray-600">"{searchQuery}"</span>
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults!.properties.length > 0 && (
                        <SearchGroup
                          icon={<Building2 size={13} />}
                          label="Properties"
                          items={searchResults!.properties}
                          onSelect={handleSearchResultClick}
                        />
                      )}
                      {searchResults!.tenants.length > 0 && (
                        <SearchGroup
                          icon={<Users size={13} />}
                          label="Tenants"
                          items={searchResults!.tenants}
                          onSelect={handleSearchResultClick}
                        />
                      )}
                      {searchResults!.leases.length > 0 && (
                        <SearchGroup
                          icon={<LeaseIcon size={13} />}
                          label="Leases"
                          items={searchResults!.leases}
                          onSelect={handleSearchResultClick}
                        />
                      )}
                      {searchResults!.leads.length > 0 && (
                        <SearchGroup
                          icon={<Star size={13} />}
                          label="Leads"
                          items={searchResults!.leads}
                          onSelect={handleSearchResultClick}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
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
                    {(!isTeamMember || canView('reports')) && (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/dashboard/reports');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <FileText size={16} className="text-gray-700" />
                        </div>
                        <span className="font-medium">Reports</span>
                      </button>
                    )}
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); setIsDownloadsOpen(true); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Download size={16} className="text-gray-700" />
                      </div>
                      <span className="font-medium">Downloads</span>
                    </button>
                    {(!isTeamMember || canView('calendar')) && (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/dashboard/calendar');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Calendar size={16} className="text-gray-700" />
                        </div>
                        <span className="font-medium">Calendar</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/dashboard/messages');
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
                        navigate('/dashboard/notifications');
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
              {(!isTeamMember || canView('reports')) && (
                <button
                  aria-label="Reports"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                  onClick={() => navigate('/dashboard/reports')}
                >
                  <FileText size={18} className="text-gray-800" />
                </button>
              )}
              <button
                aria-label="Downloads"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                onClick={() => setIsDownloadsOpen(true)}
              >
                <Download size={18} className="text-gray-800" />
              </button>
              {(!isTeamMember || canView('calendar')) && (
                <button
                  aria-label="Calendar"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                  onClick={() => navigate('/dashboard/calendar')}
                >
                  <Calendar size={18} className="text-gray-800" />
                </button>
              )}
              {/* Messages Icon */}
              <button
                aria-label="Messages"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                onClick={() => navigate('/dashboard/messages')}
              >
                <MessageSquare size={18} className="text-gray-800" />
              </button>

              {/* Notification (Bell) Icon */}
              <button
                aria-label="Notifications"
                className="relative w-8 h-8 md:mr-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 shadow-[0_3px_0_rgba(93,111,108)]"
                onClick={() => navigate('/dashboard/notifications')}
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
                        <p className="text-xs text-gray-500">{userRole || "Landlord"}</p>
                        <p className="text-xl font-semibold text-gray-900">{isLoading ? "Loading..." : userName}</p>
                        <p className="text-sm text-gray-600 truncate">{userEmail || "No email available"}</p>
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

      <DownloadsModal isOpen={isDownloadsOpen} onClose={() => setIsDownloadsOpen(false)} />
      <AccountSwitcherModal
        isOpen={isAccountSwitcherOpen}
        onClose={() => setIsAccountSwitcherOpen(false)}
        onSwitch={switchToAccount}
        onAddNew={openFreshLogin}
      />
    </header>
  );
}