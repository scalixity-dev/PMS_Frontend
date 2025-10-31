import React from 'react';
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
  return (
    <header className="bg-[var(--color-navbar-bg)] sticky top-0 z-50 text-white">
      <nav className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-[162px] py-[20px] h-[97px] opacity-100 relative">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="PMS Logo" className="h-10 w-10 brightness-0 invert" />
          <span className="font-body text-[24px] font-bold leading-[150%] tracking-normal">PMS</span>
        </Link>

        <div className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
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

        <div className="flex items-center gap-6">
          <button className="inline-flex items-center font-heading text-[16.95px] leading-[32.21px] font-semibold capitalize text-white" disabled aria-disabled="true" type="button">
            <UserIcon /> Login
          </button>
          <button className="inline-flex items-center justify-center w-[173px] h-[57px] rounded-[54.49px] border-[1.21px] border-[#E2E2E2] font-heading text-[16.95px] leading-[32.21px] font-semibold text-center align-middle text-white bg-(--color-primary)" disabled aria-disabled="true" type="button">
            Sign up <ArrowNE />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
