import { useState } from 'react';
import { AppfolioPricingTable } from './sections/FeaturesTable';
import { allFeatureTables } from './sections/PricingAndTableData';
import RequestDemoCard from './sections/RequestDemo';
import FAQSection from '../home/sections/faq';
import ExplorePropertiesBanner from '../../components/ExplorePropertiesBanner';
import { LeftCircle, LeftIcon, RightCircle } from './sections/pricingBackgroundIcons';
import { PricingHeroSection } from './sections/PricingHeroSection';

const PricingPage: React.FC = () => {
  const [isTableOpen, setIsTableOpen] = useState(false);

  const openTable = () => {
    setIsTableOpen(true);
    // Scroll to table after opening
    setTimeout(() => {
      const tableElement = document.getElementById('features-table');
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900 overflow-hidden py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* background icons */}
      <LeftIcon />
      <LeftCircle />
      <RightCircle />

      <PricingHeroSection onLearnMoreClick={openTable} />

      {/* for tables */}
      {/* <div className="min-h-screen bg-white py-10 sm:py-12 px-0">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-8 px-4 sm:px-6 lg:px-8">
          <TableTitle />
          <div className="w-full space-y-12">
            {allFeatureTables.map((tableData) => (
              <FeatureTable
                key={tableData.title} 
                title={tableData.title} 
                features={tableData.features} 
              />
            ))}
          </div>
        </div>
      </div> */}
      <AppfolioPricingTable 
        categories={allFeatureTables} 
        isOpen={isTableOpen}
        onToggle={() => setIsTableOpen(!isTableOpen)}
      />

      <RequestDemoCard />
      <FAQSection />
      <ExplorePropertiesBanner />

    </div>
    
  );
};

export default PricingPage;