import React from 'react';
import { FeatureCell } from './FeatureCell'; // Assuming FeatureCell is in the same folder

interface Feature {
  name: string;
  starter: string;
  growth: string;
  pro: string;
  business: string;
}

interface FeatureTableProps {
  title: string;
  features: Feature[];
}

const TrialButton = () => (
    <button
        className={`py-2 text-[9px] rounded-md font-semibold transition-colors duration-200 bg-[#20CC95] text-white hover:bg-[#20CC95]/80 border border-white flex items-center justify-center space-x-1 px-3`}
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

export const FeatureTable: React.FC<FeatureTableProps> = ({ title, features }) => {
  return (
    <div className="w-full max-w-7xl mx-auto overflow-hidden border-r border-b border-gray-200 mt-6 mb-20">
      <table className="w-full table-fixed">
        <thead className="text-white">
          <tr className="bg-[linear-gradient(269.33deg,#92EF71_0%,#019D6B_53.53%)]">
            <th className="w-2/6 p-4 border-r border-gray-200 text-center text-lg font-bold align-middle bg-[#019D6B]">
              {title}
            </th>
            <th className="w-1/6 border-r border-gray-200 p-4 text-center bg-transparent">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-lg font-bold">Starter</span>
                <TrialButton />
              </div>
            </th>
            <th className="w-1/6 border-r border-gray-200 p-4 text-center bg-transparent">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-lg font-bold">Growth</span>
                <TrialButton />
              </div>
            </th>
            <th className="w-1/6 border-r border-gray-200 p-4 text-center bg-transparent">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-lg font-bold">Pro</span>
                <TrialButton />
              </div>
            </th>
            <th className="w-1/6 p-4 text-center bg-transparent">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-lg font-bold">Business</span>
                <TrialButton />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {features.map((feature) => (
            <tr key={feature.name} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
              <td><div className="p-4 flex items-center justify-center border-r border-gray-200"><FeatureCell value={feature.name} /></div></td>
              <td><div className="p-4 flex items-center justify-center border-r border-gray-200"><FeatureCell value={feature.starter} /></div></td>
              <td><div className="p-4 flex items-center justify-center border-r border-gray-200"><FeatureCell value={feature.growth} /></div></td>
              <td><div className="p-4 flex items-center justify-center border-r border-gray-200"><FeatureCell value={feature.pro} /></div></td>
              <td><div className="p-4 flex items-center justify-center"><FeatureCell value={feature.business} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};