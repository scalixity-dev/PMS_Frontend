import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { ClipboardCheck, FileText, DollarSign, Users, UserCog, User, Wrench } from 'lucide-react';

const baseLink = 'px-3 py-2 rounded-md font-heading text-[14px] font-light leading-[130%] tracking-normal text-white transition-colors active:bg-[var(--color-primary)]';
const pillActive = 'rounded-2xl bg-[var(--color-primary)] text-white px-5 py-3';
const mutedLink = 'text-white';

const ChevronDown: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 inline-block">
    <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block ${className || ''}`}>
    <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ArrowNE: React.FC = () => (
  <svg width="16.9516658782959" height="16.9516658782959" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
    <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Navbar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  const [isMobileFeaturesDropdownOpen, setIsMobileFeaturesDropdownOpen] = useState(false);
  const [isUseCasesDropdownOpen, setIsUseCasesDropdownOpen] = useState(false);
  const [isMobileUseCasesDropdownOpen, setIsMobileUseCasesDropdownOpen] = useState(false);
  const featuresDropdownRef = useRef<HTMLDivElement>(null);
  const useCasesDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // Check if we're on any features page
  const isFeaturesActive = pathname.startsWith('/features');
  const isUseCasesActive = pathname.startsWith('/usecases');
  // Check if we're on any pricing page
  const isPricingActive = pathname.startsWith('/pricing')
  // Check if we're on any resource page
  const isResourceActive = pathname.startsWith('/resources')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (featuresDropdownRef.current && !featuresDropdownRef.current.contains(event.target as Node)) {
        setIsFeaturesDropdownOpen(false);
      }
      if (useCasesDropdownRef.current && !useCasesDropdownRef.current.contains(event.target as Node)) {
        setIsUseCasesDropdownOpen(false);
      }
    };

    const shouldListen = isFeaturesDropdownOpen || isUseCasesDropdownOpen;

    if (shouldListen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFeaturesDropdownOpen, isUseCasesDropdownOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  return (
    <>
    <header className="bg-[var(--color-navbar-bg)] fixed top-0 left-0 right-0 z-50 text-white w-full">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-16 xl:px-0 py-2.5 md:py-3 lg:py-3.5 h-[60px] md:h-[72px] lg:h-20 opacity-100 relative">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="PMS Logo" className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 brightness-0 invert" />
          <span className="font-body text-md md:text-lg lg:text-xl font-bold leading-[150%] tracking-normal">PMS</span>
        </Link>

        {/* Center menu (desktop) */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4 absolute left-1/2 -translate-x-1/2">
          <NavLink to="/" end className={({ isActive }) => `${baseLink} ${isActive ? pillActive : mutedLink}`}>
            Home
          </NavLink>
          
          {/* Features Dropdown */}
          <div className="relative" ref={featuresDropdownRef}>
            <button 
              onClick={() => {
                setIsFeaturesDropdownOpen((prev) => !prev);
                setIsUseCasesDropdownOpen(false);
              }}
              className={`${baseLink} ${isFeaturesActive ? pillActive : mutedLink}`}
            >
              Features <ChevronDown />
            </button>
            
            {isFeaturesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 overflow-hidden">
                <Link 
                  to="/features/screening" 
                  onClick={() => setIsFeaturesDropdownOpen(false)}
                  className="group flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-md mx-2"
                >
                  <div className="flex items-center gap-2">
                    <ClipboardCheck size={18} className="text-gray-700" />
                    Screening
                  </div>
                  <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                </Link>
                <Link 
                  to="/features/lease" 
                  onClick={() => setIsFeaturesDropdownOpen(false)}
                  className="group flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-md mx-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-gray-700" />
                    Lease
                  </div>
                  <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                </Link>
                <Link 
                  to="/features/finance" 
                  onClick={() => setIsFeaturesDropdownOpen(false)}
                  className="group flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-md mx-2"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-gray-700" />
                    Finance
                  </div>
                  <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                </Link>
                <Link 
                  to="/features/leads" 
                  onClick={() => setIsFeaturesDropdownOpen(false)}
                  className="group flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-md mx-2"
                >
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-gray-700" />
                    Leads
                  </div>
                  <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                </Link>
                <Link 
                  to="/features/team" 
                  onClick={() => setIsFeaturesDropdownOpen(false)}
                  className="group flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-md mx-2"
                >
                  <div className="flex items-center gap-2">
                    <UserCog size={18} className="text-gray-700" />
                    Team
                  </div>
                  <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                </Link>
              </div>
            )}
          </div>

          <div className="relative" ref={useCasesDropdownRef}>
            <button
              onClick={() => {
                setIsUseCasesDropdownOpen((prev) => !prev);
                setIsFeaturesDropdownOpen(false);
              }}
              className={`${baseLink} ${isUseCasesActive ? pillActive : mutedLink}`}
            >
              Use Cases <ChevronDown />
            </button>

            {isUseCasesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 overflow-hidden">
                <Link
                  to="/usecases/landlord"
                  onClick={() => setIsUseCasesDropdownOpen(false)}
                  className="group flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-md mx-2"
                >
                  <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Landlord
                  </div>
                  <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                </Link>
                <Link
                  to="/usecases/tenant"
                  onClick={() => setIsUseCasesDropdownOpen(false)}
                  className="group flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-md mx-2"
                >
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-gray-700" />
                    Tenant
                  </div>
                  <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                </Link>
                <Link
                  to="/usecases/servicepros"
                  onClick={() => setIsUseCasesDropdownOpen(false)}
                  className="group flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-md mx-2"
                >
                  <div className="flex items-center gap-2">
                    <Wrench size={18} className="text-gray-700" />
                    Service Pros
                  </div>
                  <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                </Link>
              </div>
            )}
          </div>
          <button
            className={`${baseLink} ${isResourceActive ? pillActive : mutedLink}`}
            onClick={() => navigate("/resources")}
          >
            Resources
          </button>
          <button
            onClick={() => navigate("/pricing")}  
            className={`${baseLink} ${isPricingActive ? pillActive : mutedLink}`}
          >
            Pricing
          </button>
        </div>

        {/* Right actions (desktop) */}
        <div className="hidden lg:flex items-center gap-2 lg:gap-6">
          {!(pathname === '/login') && <button
            className="inline-flex items-center font-heading text-[14px] md:text-[16px] leading-7 md:leading-[32.21px] font-semibold capitalize text-white"
            aria-disabled="true"
            type="button"
            onClick={() => navigate("/login")}
          >
            <UserIcon /> Login
          </button>}
          {!(pathname === '/signup') && <button
            className="hidden md:inline-flex items-center justify-center w-[100px] md:w-[120px] xl:w-[140px] h-10 md:h-12 rounded-[54.49px] border-[1.21px] border-[#E2E2E2] font-heading text-[12px] md:text-[14px] leading-7 md:leading-[32.21px] font-semibold text-center align-middle text-white bg-[var(--color-primary)]"
            aria-disabled="true"
            type="button"
            onClick={() => navigate("/signup")}
          >
            Sign up <ArrowNE />
          </button>}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--color-navbar-bg)]"
          >
            {isMobileOpen ? (
              // Close icon
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              // Hamburger icon
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel (Slides from right) */}
      <div
        id="mobile-menu"
        className={`
          lg:hidden 
          absolute top-full right-0 
          h-[calc(100svh-60px)] md:h-[calc(100svh-72px)] 
          w-80 md:w-96 
          bg-[var(--color-navbar-bg)] 
          overflow-y-auto 
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <div className="px-4 sm:px-6 md:px-10 pb-4 pt-1">
          <div className="flex flex-col gap-1">
            <NavLink onClick={() => setIsMobileOpen(false)} to="/" end className={({ isActive }) => `${baseLink} ${isActive ? pillActive : mutedLink} flex`}>
              Home
            </NavLink>
            
            {/* Features Dropdown (Mobile) */}
            <div>
              <button 
                onClick={() => {
                  setIsMobileFeaturesDropdownOpen((prev) => !prev);
                  setIsMobileUseCasesDropdownOpen(false);
                }}
                className={`${baseLink} ${isFeaturesActive ? pillActive : mutedLink} w-full flex items-center justify-between`}
              >
                Features <ChevronDown />
              </button>
              
              <div className={`${isMobileFeaturesDropdownOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-in-out`}>
                <div className="ml-4 mt-1 flex flex-col gap-1">
                  <Link 
                    onClick={() => setIsMobileOpen(false)}
                    to="/features/screening" 
                    className={`${baseLink} ${mutedLink} group flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardCheck size={18} />
                      Screening
                    </div>
                    <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                  </Link>
                  <Link 
                    onClick={() => setIsMobileOpen(false)}
                    to="/features/lease" 
                    className={`${baseLink} ${mutedLink} group flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={18} />
                      Lease
                    </div>
                    <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                  </Link>
                  <Link 
                    onClick={() => setIsMobileOpen(false)}
                    to="/features/finance" 
                    className={`${baseLink} ${mutedLink} group flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign size={18} />
                      Finance
                    </div>
                    <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                  </Link>
                  <Link 
                    onClick={() => setIsMobileOpen(false)}
                    to="/features/leads" 
                    className={`${baseLink} ${mutedLink} group flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-2">
                      <Users size={18} />
                      Leads
                    </div>
                    <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                  </Link>
                  <Link 
                    onClick={() => setIsMobileOpen(false)}
                    to="/features/team" 
                    className={`${baseLink} ${mutedLink} group flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCog size={18} />
                      Team
                    </div>
                    <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Use Cases Dropdown (Mobile) */}
            <div>
              <button
                onClick={() => {
                  setIsMobileUseCasesDropdownOpen((prev) => !prev);
                  setIsMobileFeaturesDropdownOpen(false);
                }}
                className={`${baseLink} ${isUseCasesActive ? pillActive : mutedLink} w-full flex items-center justify-between`}
              >
                Use Cases <ChevronDown />
              </button>

              <div className={`${isMobileUseCasesDropdownOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-in-out`}>
                <div className="ml-4 mt-1 flex flex-col gap-1">
                  <Link
                    onClick={() => setIsMobileOpen(false)}
                    to="/usecases/landlord"
                    className={`${baseLink} ${mutedLink} group flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Landlord
                    </div>
                    <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                  </Link>
                  <Link
                    onClick={() => setIsMobileOpen(false)}
                    to="/usecases/tenant"
                    className={`${baseLink} ${mutedLink} group flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-2">
                      <User size={18} />
                      Tenant
                    </div>
                    <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                  </Link>
                  <Link
                    onClick={() => setIsMobileOpen(false)}
                    to="/usecases/servicepros"
                    className={`${baseLink} ${mutedLink} group flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-2">
                      <Wrench size={18} />
                      Service Pros
                    </div>
                    <ChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out" />
                  </Link>
                </div>
              </div>
            </div>
            <button className={`${baseLink} ${isResourceActive ? pillActive : mutedLink} flex`} onClick={() => navigate("/resources")}>
              Resources
            </button>
            <button className={`${baseLink} ${isPricingActive ? pillActive : mutedLink} flex`} onClick={() => navigate("/pricing")}>
              Pricing
            </button>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="mt-4 flex flex-col gap-3 pt-3 border-t border-gray-700">
            {!(pathname === '/login') && <button
              className="inline-flex items-center justify-center font-heading text-md leading-7 font-semibold capitalize text-white"
              type="button"
              onClick={() => navigate("/login")}
            >
              <UserIcon /> Login
            </button>}
            {!(pathname === '/signup') && <button
              className="inline-flex items-center justify-center w-full h-12 rounded-full border border-[#E2E2E2] font-heading text-md leading-7 font-semibold text-center align-middle text-white bg-[var(--color-primary)]"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Sign up <ArrowNE />
            </button>}
          </div>
        </div>
      </div>
    </header>

    {/* Backdrop for mobile menu */}
    <div
      onClick={() => setIsMobileOpen(false)}
      className={`
        lg:hidden
        fixed inset-0 top-[60px] md:top-[72px] 
        bg-black/50 
        transition-opacity duration-300 ease-in-out
        ${isMobileOpen ? 'opacity-100 visible z-40' : 'opacity-0 invisible z-[-1]'}
      `}
      aria-hidden="true"
    />

    <div className="h-[60px] md:h-[72px] lg:h-20" /> {/* Spacer div */}
    </>
  );
};

export default Navbar;