import React from 'react';

import FeaturesSection from './sections/FeaturesSection';
import EverythingElseSection from './sections/EverythingElseSection';
import HeroSection from './sections/hero';
import TestimonialsSection from './sections/testimonials';
import FAQSection from './sections/faq';
import ScalableSolutionSection from './sections/ScalableSolutionSection';
import ExplorePropertiesBanner from './sections/ExplorePropertiesBanner';

const HomePage: React.FC = () => {
  return (
    <div className="w-full p-2">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Everything Else Section*/}
      <EverythingElseSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* ScalableSolution Section*/}
      <ScalableSolutionSection />

      <ExplorePropertiesBanner/>

      
    </div>
  );
};

export default HomePage;

