import React from "react";
import FeatureHighlightSection from "../../components/FeatureHighlightSection";
import RentalFeaturesSection from "./sections/RentalFeaturesSection";

const PmsPage: React.FC = () => {
  return (
    <section className="w-full">
        <div className="mt-5">
            <FeatureHighlightSection
        title="Feel right at home in your rental"
        subtitle=""
        description="Let’s make renting easy. With PmsCloud, you can find a new home, build your rental history, submit maintenance requests, and pay rent, all online."   
        />
        </div>

        <RentalFeaturesSection />
    </section>
  );
};

export default PmsPage;