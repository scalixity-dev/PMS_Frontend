import { useState } from "react";
import { ResourceCards } from "./RenderCards";
import { Search } from "./resourceIcons";

type FilterType = "Landlord" | "Tenant" | "Service Pro" | "Property Manager";

const FilterButton = ({ 
  label, 
  active, 
  onClick 
}: { 
  label: string; 
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`min-w-28 h-14 border-2 shadow-xl border-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center justify-center transition-all duration-200 ${
      active
        ? 'bg-[#20CC95] text-white'
        : 'bg-[#355C7D] text-white hover:bg-[#2a4a63]'
    }`}
  >
    {label}
  </button>
);


export default function App() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Landlord");

  const filters: FilterType[] = ["Landlord", "Tenant", "Service Pro", "Property Manager"];

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-center text-center items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Help Center
            </h1>
            <p className="text-xl text-slate-600">
              Search hundreds of articles on our Help Center
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-14 pl-5 pr-12 py-3 rounded-lg shadow-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-md"
            />
            <button className="absolute right-2 rounded-full" aria-label="Search resources">
              <Search />
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 justify-evenly w-full max-w-3xl h-18 rounded-full bg-[#F4FFFC] p-2 shadow-inner border border-[#DADADA]">
            {filters.map((filter) => (
              <FilterButton 
                key={filter}
                label={filter} 
                active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              />
            ))}
          </div>
        </div>

        <ResourceCards filter={activeFilter} />
      </div>
    </div>
  );
}