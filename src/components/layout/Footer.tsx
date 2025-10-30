import React from "react";
import { Mail, Send, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import logo from '../../assets/images/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white text-sm">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12 lg:gap-6">
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
            <button className="px-3">
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
            <li>Hero Section</li>
            <li>Features</li>
            <li>Properties</li>
            <li>Testimonials</li>
            <li>FAQ’s</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-medium mb-4 text-[var(--color-primary)]">
            About Us
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>Our Story</li>
            <li>Our Works</li>
            <li>How It Works</li>
            <li>Our Team</li>
            <li>Our Clients</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-medium mb-4 text-[var(--color-primary)]">
            Properties
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>Portfolio</li>
            <li>Categories</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-medium mb-4 text-[var(--color-primary)]">
            Services
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>Valuation Mastery</li>
            <li>Strategic Marketing</li>
            <li>Negotiation Wizardry</li>
            <li>Closing Success</li>
            <li>Property Management</li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="font-medium mb-4 text-[var(--color-primary)]">
            Contact Us
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>Contact Form</li>
            <li>Our Offices</li>
          </ul>
        </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[var(--color-navbar-bg)] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-center md:text-left space-x-2">
            <span>@2025 Pms. All Rights Reserved.</span>
            <span>Terms & Conditions</span>
          </div>

          <div className="flex space-x-4">
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <Twitter size={16} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
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
