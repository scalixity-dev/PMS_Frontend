import React from "react";
import { Mail, Send, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import logo from '../../assets/images/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="w-full  bg-white text-sm">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-12 py-16 flex flex-col lg:flex-row gap-12 lg:gap-6">
        {/* Logo + Email - Takes 25% width */}
        <div className="space-y-6 lg:w-1/4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="PMS logo" className="w-10 h-10 object-cover" />
            <h1 className="text-[var(--color-primary)] font-semibold text-lg">
              PMS
            </h1>
          </div>

          {/* Email Input */}
          <div className="flex items-center bg-[var(--color-primary)] rounded-md overflow-hidden w-full max-w-xs">
            <div className="flex items-center px-3">
              <Mail size={16} className="text-white" />
            </div>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="flex-1 bg-transparent text-white placeholder:text-white/80 focus:outline-none py-2 text-sm"
            />
            <button type="button" className="px-3 cursor-pointer hover:opacity-80 transition-opacity relative z-10">
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Navigation Columns - Takes remaining 75% width */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 lg:gap-8 lg:pl-6">
          {/* Column 1 */}
          <div>
          <h3 className="font-medium mb-4 text-[var(--color-primary)]">
            Home
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#hero" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Hero Section
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Features
              </a>
            </li>
            <li>
              <a href="#properties" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Properties
              </a>
            </li>
            <li>
              <a href="#testimonials" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#faqs" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                FAQ's
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-medium mb-4 text-[var(--color-primary)]">
            About Us
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#our-story" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Our Story
              </a>
            </li>
            <li>
              <a href="#our-works" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Our Works
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                How It Works
              </a>
            </li>
            <li>
              <a href="#our-team" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Our Team
              </a>
            </li>
            <li>
              <a href="#our-clients" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Our Clients
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-medium mb-4 text-[var(--color-primary)]">
            Properties
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#portfolio" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Portfolio
              </a>
            </li>
            <li>
              <a href="#categories" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Categories
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-medium mb-4 text-[var(--color-primary)]">
            Services
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#valuation" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Valuation Mastery
              </a>
            </li>
            <li>
              <a href="#marketing" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Strategic Marketing
              </a>
            </li>
            <li>
              <a href="#negotiation" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Negotiation Wizardry
              </a>
            </li>
            <li>
              <a href="#closing" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Closing Success
              </a>
            </li>
            <li>
              <a href="#property-management" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Property Management
              </a>
            </li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="font-medium mb-4 text-[var(--color-primary)]">
            Contact Us
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#contact-form" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Contact Form
              </a>
            </li>
            <li>
              <a href="#our-offices" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer relative z-10">
                Our Offices
              </a>
            </li>
          </ul>
        </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[var(--color-navbar-bg)] w-full text-white py-4">
        <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-center md:text-left space-x-2">
            <span>@2025 Pms. All Rights Reserved.</span>
            <span>Terms & Conditions</span>
          </div>

          <div className="flex space-x-4">
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer relative z-10"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer relative z-10"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer relative z-10"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer relative z-10"
              aria-label="YouTube"
            >
              <Youtube size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
