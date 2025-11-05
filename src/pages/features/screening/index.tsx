import React from 'react';
import EveryFeatureSection from './sections/EveryFeatureSection';
import EveryFeatureCenteredSection from './sections/EveryFeatureCenteredSection';
import FeaturesHeroSection from './sections/hero';
import RentalApplicationSection from './sections/Rentalapplication';
import RentReportingSection from './sections/Rentreporting';
import FeatureHighlightSection from './sections/FeatureHighlightSection';
import AIPoweredFeaturesSection from './sections/AIPoweredFeaturesSection';
import FeatureSectionFlat from './sections/FeatureSectionFlat';

const FeaturesPage: React.FC = () => {
  return (
    <section className="w-full p-2">
      <FeaturesHeroSection />
      <EveryFeatureSection />

      <FeatureHighlightSection
        subtitle="PMS Screening"
        title="Screen PMS and get them onboarded, in one place"
        description="Background Check, just verification, identity, education, employment history, and past evictions with 99.9% accuracy."
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762162417/Property_Management_Dashboard_budkfv.png"
      />

      <RentalApplicationSection />
      <EveryFeatureCenteredSection />
      <FeatureHighlightSection
        subtitle=""
        title="Take control of the leasing process"
        description="Customize application questions, set your fees, and track every applicant from first inquiry to signed lease—all on PMS"
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762162417/leasingProcess_nfnnqm.png"
      />

      <AIPoweredFeaturesSection />
      <RentReportingSection />
      <FeatureSectionFlat/>
      <FeatureHighlightSection
        subtitle=""
        title="Faster payments, better future"
        description="Rent reporting leads to more on-time payments for you—and real credit-building opportunities for PMS."
        imageSrc="https://res.cloudinary.com/dxwspucxw/image/upload/v1762162417/Dashboard_Overview_i12j7r.png"
      />

    </section>
  );
};
	

export default FeaturesPage;


