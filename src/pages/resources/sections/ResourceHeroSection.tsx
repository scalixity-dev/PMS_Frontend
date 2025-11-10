import { LandlordCards } from "./RenderCards";
import { Search } from "./resourceIcons";

const FilterButton = ({ label, active }: { label: string; active?: boolean }) => (
  <button
    className={`w-[120px] h-[50px] border-2 shadow-xl border-white px-4 py-2 rounded-full text-md font-medium ${
      active
        ? 'bg-[#20CC95] text-white'
        : 'bg-[#355C7D] text-white'
    }`}
  >
    {label}
  </button>
);


export default function App() {
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
            <button className="absolute right-2 rounded-full">
              <Search />
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-25">
          <div className="flex items-center gap-3 justify-evenly w-[740px] h-[72px] rounded-full bg-[#F4FFFC] p-2 shadow-inner border border-[#DADADA]">
            <FilterButton label="Landlord" active />
            <FilterButton label="Pms" />
            <FilterButton label="Service Pro" />
            <FilterButton label="Owner" />
          </div>
        </div>

        <LandlordCards />
      </div>
    </div>
  );
}