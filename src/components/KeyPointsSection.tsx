import KeyPointCard from "./common/cards/KeyPointCard";
// import PaginationButtons from "./common/buttons/PaginationButtons";
import { Wallet, Landmark, FileCheck } from "lucide-react";

const KeyPointsSection = () => {
  const items = [
    {
      icon: <Wallet size={40} />,
      text: "Reduce late payments more than 90% with auto pay",
    },
    {
      icon: <Landmark size={40} />,
      text: "Multiple bank accounts for easy accounting",
    },
    {
      icon: <FileCheck size={40} />,
      text: "Tax reports including 1099s and Schedule E",
    },
  ];

  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-20 px-6 bg-[#F8ECEA]">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 px-28 ">
        <h2 className="w-full text-center text-2xl md:text-3xl font-semibold text-[#222]">
          Every Feature You’ll Ever Need, And More
        </h2>

        {/* Pagination Controls */}
        {/* <PaginationButtons containerClassName="flex gap-2" /> */}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {items.map((item, idx) => (
          <KeyPointCard key={idx} icon={item.icon} text={item.text} />
        ))}
      </div>
    </section>
  );
};

export default KeyPointsSection;
