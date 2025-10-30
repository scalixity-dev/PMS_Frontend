import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const baseLink = 'px-3 py-2 rounded-md text-sm font-medium text-white transition-colors';
const pillActive = 'rounded-2xl bg-[var(--color-primary)]/45 text-white px-4 py-2';
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
    <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Navbar: React.FC = () => {
  return (
    <header className="bg-[var(--color-navbar-bg)] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/vite.svg" alt="Logo" className="h-7 w-7" />
          <span className="text-base font-semibold tracking-wide">PMS</span>
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/" end className={({ isActive }) => `${baseLink} ${isActive ? pillActive : mutedLink}`}>
            Home
          </NavLink>
          <NavLink to="/features" className={({ isActive }) => `${baseLink} ${isActive ? pillActive : mutedLink}`}>
            Features <ChevronDown />
          </NavLink>
          <button className={`${baseLink} ${mutedLink}`}>
            Use Cases <ChevronDown />
          </button>
          <button className={`${baseLink} ${mutedLink}`}>
            Resources <ChevronDown />
          </button>
          <NavLink to="/pricing" className={({ isActive }) => `${baseLink} ${isActive ? pillActive : mutedLink}`}>
            Pricing
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-white">
            <UserIcon /> Login
          </Link>
          <Link to="/signup" className="inline-flex items-center rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">
            Sign up <ArrowNE />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
