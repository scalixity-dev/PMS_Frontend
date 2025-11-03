import React from 'react';
import EveryFeatureSection from './sections/EveryFeatureSection';
import EveryFeatureCenteredSection from './sections/EveryFeatureCenteredSection';
import FeaturesHeroSection from './sections/hero';

const FeaturesPage: React.FC = () => {
  return (
    <section className="w-full">
      <FeaturesHeroSection />
        
      <EveryFeatureSection />
      <EveryFeatureCenteredSection />
    </section>
  );
};

export default FeaturesPage;


