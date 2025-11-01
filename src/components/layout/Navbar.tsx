import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const baseLink = 'px-3 py-2 rounded-md font-heading text-[16px] font-light leading-[130%] tracking-normal text-white transition-colors active:bg-(--color-primary)';
const pillActive = 'rounded-2xl  bg-[var(--color-primary)] text-white px-5 py-3';
const mutedLink = 'text-white';

const ChevronDown: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 inline-block">
    <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  return (
    <header className="bg-(--color-navbar-bg) sticky top-0 z-50 text-white">
      <nav className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 xl:px-10 py-[16px] md:py-[18px] lg:py-[20px] h-[72px] md:h-[88px] lg:h-[97px] opacity-100 relative">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="PMS Logo" className="h-10 w-10 brightness-0 invert" />
          <span className="font-body text-[20px] md:text-[24px] font-bold leading-[150%] tracking-normal">PMS</span>
        </Link>

        {/* Center menu (desktop) */}
        <div className="hidden lg:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <NavLink to="/" end className={({ isActive }) => `${baseLink} ${isActive ? pillActive : mutedLink}`}>
            Home
          </NavLink>
          <NavLink to="/features" className={({ isActive }) => `${baseLink} ${isActive ? pillActive : mutedLink}`}>
            Features <ChevronDown />
          </NavLink>
          <button className={`${baseLink} ${mutedLink}`} disabled>
            Use Cases
          </button>
          <button className={`${baseLink} ${mutedLink}`} disabled>
            Resources
          </button>
          <button className={`${baseLink} ${mutedLink}`} disabled>
            Pricing
          </button>
        </div>

        {/* Right actions (desktop) */}
        <div className="hidden sm:flex items-center gap-4 md:gap-6">
          <button className="inline-flex items-center font-heading text-[15px] md:text-[16.95px] leading-[28px] md:leading-[32.21px] font-semibold capitalize text-white" disabled aria-disabled="true" type="button">
            <UserIcon /> Login
          </button>
          <button className="hidden md:inline-flex items-center justify-center w-[150px] md:w-[173px] h-[48px] md:h-[57px] rounded-[54.49px] border-[1.21px] border-[#E2E2E2] font-heading text-[15px] md:text-[16.95px] leading-[28px] md:leading-[32.21px] font-semibold text-center align-middle text-white bg-(--color-primary)" disabled aria-disabled="true" type="button">
            Sign up <ArrowNE />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-(--color-navbar-bg)"
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

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`${isMobileOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'} lg:hidden overflow-hidden transition-all duration-300 ease-out bg-(--color-navbar-bg)`}
      >
        <div className="px-4 sm:px-6 md:px-10 pb-4 pt-1">
          <div className="flex flex-col gap-1">
            <NavLink onClick={() => setIsMobileOpen(false)} to="/" end className={({ isActive }) => `${baseLink} ${isActive ? pillActive : mutedLink}`}>
              Home
            </NavLink>
            <NavLink onClick={() => setIsMobileOpen(false)} to="/features" className={({ isActive }) => `${baseLink} ${isActive ? pillActive : mutedLink}`}>
              Features <ChevronDown />
            </NavLink>
            <button className={`${baseLink} ${mutedLink}`} disabled>
              Use Cases
            </button>
            <button className={`${baseLink} ${mutedLink}`} disabled>
              Resources
            </button>
            <button className={`${baseLink} ${mutedLink}`} disabled>
              Pricing
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-3">
            <button className="inline-flex items-center font-heading text-[12px] leading-[28px] font-semibold capitalize text-white" disabled aria-disabled="true" type="button">
              <UserIcon /> Login
            </button>
            <button className="inline-flex items-center justify-center w-full h-[52px] rounded-[54.49px] border-[1.21px] border-[#E2E2E2] font-heading text-[12px] leading-[28px] font-semibold text-center align-middle text-white bg-(--color-primary)" disabled aria-disabled="true" type="button">
              Sign up <ArrowNE />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
