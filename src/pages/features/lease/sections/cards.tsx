import React from "react";
import { Link } from 'react-router-dom';

interface NumberCardProps {
  number: string;
}

const NumberCard: React.FC<NumberCardProps> = ({ number }) => {
  return (
    <div className="flex flex-col relative bg-transparent font-body">
      {/* Border with glow effect - thicker on left */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none border border-[rgba(167,243,208,0.6)] border-l-2 border-t-0 border-r-0 border-b" />
      <div className="relative z-10 py-3 px-4 sm:py-4 sm:px-6 flex items-center justify-start">
        <span className="text-[#A7F3D0] text-lg sm:text-xl font-semibold">{number}</span>
      </div>
    </div>
  );
};

interface LeaseCardProps {
  title: string;
  description: string;
  learnMoreTo?: string;
}

const LeaseCard: React.FC<LeaseCardProps> = ({ title, description, learnMoreTo }) => {
  return (
  <div className="lease-card flex flex-col rounded-b-lg relative bg-transparent font-body shadow-sm overflow-hidden transition duration-200 hover:shadow-lg hover:ring-2 hover:ring-[rgba(167,243,208,0.12)] hover:bg-white/5 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus:outline-none">
      {/* Border with glow effect - thicker on left and top */}
      <div className="absolute top-0 left-0 w-full h-full rounded-b-lg pointer-events-none border border-[rgba(167,243,208,0.6)] border-l-2 border-t border-r border-b" />
      {/* Gradient shadow at top left - curvy elliptical shape */}
      <div 
        className="absolute top-0 left-0 w-1/3 sm:w-1/2 h-1/3 sm:h-1/2 pointer-events-none z-0 overflow-hidden rounded-b-lg opacity-25"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at top left, #20CC95 0%, #3BF75100 50%)',
        }}
      />
  <div className="relative z-10 p-6 sm:p-8">
        <h3 className="text-white font-bold text-lg sm:text-[22px] mb-3 sm:mb-4 leading-tight">{title}</h3>
        <p className="text-[#C0C0C0] text-sm sm:text-[18px] mb-4 sm:mb-6 leading-relaxed">{description}</p>
        {learnMoreTo ? (
          <Link 
            to={learnMoreTo}
            className="text-white text-sm sm:text-base hover:opacity-80 transition-opacity"
          >
            Learn More
          </Link>
        ) : (
          <span className="text-white underline text-sm sm:text-base cursor-pointer hover:opacity-80 transition-opacity">
            Learn More
          </span>
        )}
      </div>
    </div>
  );
};

const LeaseCardsSection: React.FC = () => {
  const cards = [
    {
      number: "01",
      title: "View Occupancies at a Glance",
      description: "Access the Occupancy Tracker, a visual lease timeline that makes it easy to see who's living where, for how long, and what's coming up next.",
      learnMoreTo: "#"
    },
    {
      number: "02",
      title: "Send, Sign, and Store Leases Digitally",
      description: "Speed up the signing process with secure eSignatures. Simply create and send your lease form, then PmsCloud will walk Pms through the final steps. Don't need an e-signature? No worries— just upload the lease, and you're good to go.",
      learnMoreTo: "#"
    },
    {
      number: "03",
      title: "Stay Compliant with Attorney-Approved Forms",
      description: "Our state-specific lease forms are reviewed by real estate attorneys—designed to help you stay compliant and protected while giving you complete flexibility.",
      learnMoreTo: "#"
    }
  ];

  return (
    <section className="relative w-screen bg-[#0F5132] py-12 sm:py-20 overflow-hidden left-1/2 -translate-x-1/2">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 font-body gap-6 sm:gap-8 lg:gap-8 pb-12 items-start">
          {cards.map((card, index) => (
            <div key={index} className="flex flex-col gap-0">
              <NumberCard number={card.number} />
              <LeaseCard
                title={card.title}
                description={card.description}
                learnMoreTo={card.learnMoreTo}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Curved white wave at the bottom - semi-oval */}
      <div className="absolute bottom-0 left-0 w-full h-28 sm:h-32 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,120 Q720,0 1440,120 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default LeaseCardsSection;
