import { Diamond, LeftIcon, MidCircle, RightIcon } from "./sections/resourceIcons";
import ResourceHeroSection from "./sections/ResourceHeroSection";
import VideoTutorialsCard from "./sections/VideoTutorial";
import TopArticles from "./sections/TopArticles";
import SupportSection from "./sections/SupportSection";
import WhyPmsCloud from "./sections/WhyPmsCloud";
import PMSStandOut from "./sections/PmsStandOut";
import CtaSection from "./sections/CtaSection";
import { ProfessionalRentalsSection } from "./sections/ProfessionalRentalsSection";
import UniversalLandlordForms from "./sections/UniversalLandlordSection";
import FormFeaturesSection from "./sections/FormFeaturesSection";
import ContactSection from "./sections/ContactSection";
import HelpAndSupportSection from "./sections/HelpAndSupportSection";

const ResourcePage: React.FC = () => {
  return (
    <>
        {/* background images */}
        <div>
          <LeftIcon />
          <RightIcon />
        </div>

        <ResourceHeroSection />
        <VideoTutorialsCard />
        <TopArticles />
        <SupportSection />
        <WhyPmsCloud />
        <Diamond />
        <PMSStandOut />
        <MidCircle />
        <CtaSection
          title="Landlord Forms"
          titleSize="5xl"
          description="Protect your business with state-specific, legally compliant landlord forms—comprehensive, customizable, and lawyer- approved."
          buttonText="Start Trial"
        />

        <ProfessionalRentalsSection />
        <UniversalLandlordForms />
        <FormFeaturesSection />

        <CtaSection
          title="All the landlord forms you need, in one place"
          titleSize="3xl"
          description="Sign in to access over a dozen state-specific, lawyer-approved rental forms or start a free PmsCloud trial."
          buttonText="Get Started"
        />

        <ContactSection />
        <HelpAndSupportSection />
    </>
  );
};

export default ResourcePage;