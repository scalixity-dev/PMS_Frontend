import React from "react";
import { BarChart3, Clock, Landmark, Link } from "lucide-react";

const ITEMS = [
  {
    icon: <BarChart3 size={20} />,
    text: "Get real-time visibility into your cash flow and expenses",
  },
  {
    icon: <Clock size={20} />,
    text: "Savings of $400-$1000 a year reported by our users",
  },
  {
    icon: <Landmark size={20} />,
    text: "Stay organized 24/7 with multiple bank accounts",
  },
  {
    icon: <Link size={20} />,
    text: "Integrate with QuickBooks Online in a few clicks",
  },
];

const GradientFeatureList: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto my-25 bg-white rounded-md border border-gray-300 py-10 px-6 md:px-12 shadow-sm">
      {/* Title */}
      <h2 className="text-left text-2xl font-semibold text-[#1F2937] mb-10">
        Every feature you’ll ever need, and more
      </h2>

      {/* Gradient Rows */}
      <div className="flex flex-col gap-4">
        {ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="relative flex items-center gap-3 text-white pr-6 pl-4 py-3
                       bg-gradient-to-r from-[#11966B] to-white/0 
                       hover:opacity-90 transition"
          >
            {/* small dark bar on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#053a36] rounded-l-md" />

            <div className="text-white text-xl">{item.icon}</div>
            <p className="text-white font-medium text-sm md:text-base">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GradientFeatureList;
