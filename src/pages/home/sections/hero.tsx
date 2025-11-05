import React from 'react';
import HeroCard from '../../../components/common/cards/HeroCard';

const HeroSection: React.FC = () => {
  const features = ["Free 14 day trial", "Credit card required", "Cancel anytime"] as const;
  
  return (
    <HeroCard
      badge="Property Management Software"
      title="The all-in-one platform that scales with your portfolio"
      description="PMS helps you simplify and grow your property management business. Find everything you need to list properties, collect rent, and screen pms — in one, easy place."
      features={features}
      imageSrc="/hero1.png"
      learnMoreTo="/features/screening"
      getStartedTo="/features/screening"
    />
  );
};

export default HeroSection;


