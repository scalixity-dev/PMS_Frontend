import React, { useState } from 'react';
import { FeatureCell } from './FeatureCell'; // Assuming FeatureCell is in the same folder
import { useNavigate } from 'react-router-dom';

// --- Original Interfaces & Components (Slightly Modified) ---

interface Feature {
  name: string;
  starter: string;
  growth: string;
  pro: string;
  business: string;
}

// Helper types for plan selection
type Plan = 'starter' | 'growth' | 'pro' | 'business';

const plans: Plan[] = ['starter', 'growth', 'pro', 'business'];

const planNames: Record<Plan, string> = { 
    starter: 'Starter', 
    growth: 'Growth', 
    pro: 'Pro', 
    business: 'Business' 
};

const TrialButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="py-2 px-3 sm:px-4 text-[10px] sm:text-xs rounded-md font-semibold transition-colors duration-200 bg-[#20CC95] text-white hover:bg-[#20CC95]/80 border border-white flex items-center justify-center space-x-1"
      onClick={() => navigate("/signup")}
    >
      <span>Start 14-days trial</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>
  );
};

interface Category {
  title: string;
  features: Feature[];
}

interface AppfolioPricingTableProps {
  categories: Category[];
  isOpen?: boolean;
  onToggle?: () => void;
}

// --- New Component Logic ---

export const AppfolioPricingTable: React.FC<AppfolioPricingTableProps> = ({ categories, isOpen = false, onToggle }) => {
  // State for mobile tab selection
  const [selectedPlan, setSelectedPlan] = useState<Plan>('growth');

  return (
    <div id="features-table" className="w-full max-w-7xl mx-auto mt-6 mb-16">
      {/* Toggle Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={onToggle}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#20CC95] text-white font-semibold rounded-lg hover:bg-[#17a673] transition-colors duration-200 shadow-md"
        >
          <span>{isOpen ? 'Hide' : 'View'} Feature Comparison</span>
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Table Content - Conditionally Rendered */}
      {isOpen && (
        <>
          {/* =====================================================
            DESKTOP VIEW (lg:block)
            - One single table for all categories.
            - Plan names are in the main header.
            - Category titles are full-width rows in the body.
            =====================================================
          */}
          <div className="hidden lg:block border-r border-b border-gray-200 overflow-hidden">
        <table className="w-full table-fixed">
          {/* Plan Headers */}
          <thead className="text-white">
            <tr className="bg-[linear-gradient(269.33deg,#92EF71_0%,#019D6B_53.53%)]">
              {/* Top-left cell for "Features" */}
              <th className="w-2/6 p-4 border-r border-gray-200 text-left text-base sm:text-lg font-bold align-middle bg-[#019D6B]">
                Features
              </th>
              
              {/* Plan name headers */}
              {plans.map((plan) => (
                <th key={plan} className="w-1/6 border-r border-gray-200 p-4 text-center bg-transparent">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-sm sm:text-base font-bold">{planNames[plan]}</span>
                    <TrialButton />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body with Categories */}
          <tbody className="bg-white">
            {categories.map((category) => (
              <React.Fragment key={category.title}>
                {/* Category Title Row */}
                <tr className="border-b border-gray-200">
                  <td colSpan={5} className="p-4 font-bold text-lg bg-[#019D6B] text-white">
                    {category.title}
                  </td>
                </tr>
                
                {/* Feature Rows for this Category */}
                {category.features.map((feature) => (
                  <tr key={feature.name} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                    {/* Feature Name Cell */}
                    <td>
                      <div className="p-4 flex items-center justify-start border-r border-gray-200">
                        <FeatureCell value={feature.name} />
                      </div>
                    </td>
                    
                    {/* Plan Value Cells */}
                    {plans.map((plan) => (
                        <td key={plan}>
                            <div className="p-4 flex items-center justify-center border-r border-gray-200">
                                <FeatureCell value={feature[plan as keyof Feature]} />
                            </div>
                        </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
        MOBILE VIEW (block lg:hidden)
        - Tabbed interface to select a plan.
        - Shows only the selected plan's features.
        - Categories are section headers.
        =====================================================
      */}
      <div className="block lg:hidden">
        {/* Plan Selector Tabs */}
        <div className="flex justify-between bg-gray-100 p-2 sticky top-0 z-10 border border-gray-200 rounded-t-md">
          {plans.map((plan) => (
            <button
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors
                ${selectedPlan === plan 
                    ? 'bg-[#20CC95] text-white shadow' 
                    : 'text-gray-700 hover:bg-gray-200'}`
              }
            >
              {planNames[plan]}
            </button>
          ))}
        </div>

        {/* Trial Button for selected plan */}
        <div className="p-4 border-b border-x border-gray-200">
            <TrialButton />
        </div>

        {/* Feature List by Category */}
        <div className="border border-t-0 border-gray-200 rounded-b-md overflow-hidden">
          {categories.map((category) => (
            <section key={category.title} className="last:border-b-0">
              {/* Category Title Header */}
              <h3 className="p-4 font-bold text-lg bg-[#019D6B] text-white">
                {category.title}
              </h3>
              
              {/* Feature List for this category */}
              <ul className="space-y-3 p-4">
                {category.features.map((feature) => (
                  <li key={feature.name} className="flex justify-evenly items-center border-b border-gray-100 pb-3 last:border-b-0">
                    <span className="text-sm text-gray-800 w-3/5 pr-2">{feature.name}</span>
                    <div className="w-2/5 flex items-center text-center justify-center">
                      <FeatureCell value={feature[selectedPlan as keyof Feature]} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
};