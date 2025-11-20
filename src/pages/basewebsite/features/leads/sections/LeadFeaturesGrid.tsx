import React from "react";
import { ArrowUpRight, Repeat, FileText, CreditCard, Target } from "lucide-react";

const LeadFeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: <Repeat size={18} />,
      title: "Automatic lead capture tools",
    },
    {
      icon: <FileText size={18} />,
      title: "Lead status and tracking",
    },
    {
      icon: <CreditCard size={18} />,
      title: "Log calls and add notes",
    },
    {
      icon: <Target size={18} />,
      title: "Track the activity in a timeline",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-12 flex flex-col items-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full max-w-7xl">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="relative flex flex-col items-center justify-center bg-[#9EAE97] text-white border border-white border-2 rounded-lg shadow-md p-8 transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Top right arrow */}
            <div className="absolute top-3 right-3 opacity-70">
              <ArrowUpRight size={30} />
            </div>

            {/* Center icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white mb-4">
              {feature.icon}
            </div>

            {/* Text */}
            <p className="text-sm font-medium text-center">{feature.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LeadFeaturesGrid;
