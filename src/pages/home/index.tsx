import React from 'react';

import FeaturesSection from './sections/FeaturesSection';
import EverythingElseSection from './sections/EverythingElseSection';
import HeroSection from './sections/hero';
import TestimonialsSection from './sections/testimonials';
import FAQSection from './sections/faq';

const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Everything Else Section replaces the CTA */}
      <EverythingElseSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default HomePage;

