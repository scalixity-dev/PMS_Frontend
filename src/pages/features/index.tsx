import React from 'react';
import EveryFeatureSection from './sections/EveryFeatureSection';
import EveryFeatureCenteredSection from './sections/EveryFeatureCenteredSection';

const FeaturesPage: React.FC = () => {
  return (
    <section className="w-full">
      <h1 className="mb-2 text-2xl font-semibold text-[var(--color-heading)]">Features</h1>
      <p className="text-[var(--color-subheading)]">Feature list placeholder.</p>
        
      <EveryFeatureSection />
      <EveryFeatureCenteredSection />
    </section>
  );
};

export default FeaturesPage;


