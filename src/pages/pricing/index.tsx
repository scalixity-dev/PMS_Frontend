import React, { useState } from 'react';
import { PricingCard } from './sections/PricingCard';
import { FeatureTable } from './sections/FeaturesTable';
import { Heading, SubHeading, TableTitle } from './sections/Headings';
import { allFeatureTables, pricingPlans } from './sections/PricingAndTableData';
import RequestDemoCard from './sections/RequestDemo';
import FAQSection from '../home/sections/faq';
import ExplorePropertiesBanner from '../../components/ExplorePropertiesBanner';
import { LeftCircle, LeftIcon, RightCircle } from './sections/pricingBackgroundIcons';

const PricingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="relative min-h-screen bg-white text-gray-900 overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* background icons */}
      <LeftIcon />
      <LeftCircle />
      <RightCircle />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Heading />
        <div className='flex items-center justify-evenly gap-auto'>
            <SubHeading />
            <div className="flex justify-center mb-10 md:mb-12">
                <div className="relative p-1 bg-gray-100 rounded-md flex items-center space-x-2">
                    <button
                        onClick={() => setIsYearly(false)}
                        className={`py-2 px-6 rounded-md text-sm font-semibold transition-colors duration-300 ${
                            !isYearly ? 'bg-[#20CC95] text-white shadow-md border-2 border-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setIsYearly(true)}
                      className={`py-2 px-6 rounded-md text-sm font-semibold transition-colors duration-300 ${
                          isYearly ? 'bg-[#20CC95] text-white shadow-md border-2 border-white' : 'text-gray-600 hover:bg-gray-200'
                      }`}
                      >
                      Yearly
                    </button>

                </div>
            </div>
        </div>

      {/* for pament cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingPlans.map((plan, index) => (
          <PricingCard
            key={index}
            plan={plan.plan}
            description={plan.description}
            priceText={plan.priceText}
            annualBillingText={plan.annualBillingText}
            includesTitle={plan.includesTitle}
            features={plan.features}
            isPopular={plan.isPopular}
            isPro={plan.isPro}
          />
        ))}
      </div>
      </div>

      {/* for tables */}
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-8">
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
      </div>

      <RequestDemoCard />
      <FAQSection />
      <ExplorePropertiesBanner />

    </div>
    
  );
};

export default PricingPage;