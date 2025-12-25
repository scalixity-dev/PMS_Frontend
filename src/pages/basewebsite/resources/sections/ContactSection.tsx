import React from 'react';
import { Address, Email, Phone } from './resourceIcons';

const ContactInfoItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  text: string;
}> = ({ icon, title, text }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full">
        <div>{icon}</div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="text-base text-slate-600">{text}</p>
      </div>
    </div>
  );
};

// Main Contact Section Component
const ContactSection: React.FC = () => {
  return (
    <section id="contact-section" className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        <div className="lg:mt-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Contact With Us Today
          </h2>
          <p className="text-lg text-slate-600 mb-12 font-semibold">
            Please contact our sales consultants if you have questions or would
            like a demo of any of SmartTenantAICloud features.
          </p>

          <div className="flex flex-col gap-8">
            <ContactInfoItem
              icon={<Phone />}
              title="Phone"
              text="0123456789"
            />
            <ContactInfoItem
              icon={<Email />}
              title="Email"
              text="jack.graham@example.com"
            />
            <ContactInfoItem
              icon={<Address />}
              title="Address"
              text="1901 Thornridge Cir. Shiloh"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-5xl font-bold text-slate-900 mb-8">
            Request a Demo
          </h2>

          <form className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="First Name"
                className="w-full bg-slate-100 rounded-lg px-4 py-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full bg-slate-100 rounded-lg px-4 py-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-slate-100 rounded-lg px-4 py-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full bg-slate-100 rounded-lg px-4 py-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <textarea
              placeholder="Message here.."
              rows={5}
              className="w-full bg-slate-100 rounded-lg px-4 py-4 border border-transparent resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <button
              type="submit"
              className="bg-[#3D7475] hover:bg-[#3a5553] text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 flex items-center justify-center w-fit gap-2"
            >
              Send Now
              <svg width="65" height="30" viewBox="0 0 83 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M65.0472 24.1792C65.5032 23.7232 65.5032 22.9838 65.0472 22.5278L57.6162 15.0969C57.1602 14.6409 56.4209 14.6409 55.9649 15.0969C55.5089 15.5529 55.5089 16.2922 55.9649 16.7482L62.5702 23.3535L55.9649 29.9588C55.5089 30.4148 55.5089 31.1541 55.9649 31.6101C56.4209 32.0661 57.1602 32.0661 57.6162 31.6101L65.0472 24.1792ZM0 23.3535L1.0208e-07 24.5212L64.2216 24.5212L64.2216 23.3535L64.2216 22.1858L-1.0208e-07 22.1859L0 23.3535Z" fill="#FFFFFF" />
                <circle cx="59.5486" cy="23.3533" r="22.7695" stroke="#FFFFFF" stroke-width="1.16766" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;