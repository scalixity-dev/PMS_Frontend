import React from 'react';
import AIFeaturesSection from "../../components/AIFeaturesSection";
import { DollarSign, TrendingUp, Handshake } from 'lucide-react';

const usecaseFeatures = [
  {
    icon: <DollarSign size={28} />,
    title: "Collect Rent On Time",
    description:
      "Still chasing after rent? Landlords who enable auto pay on PMS Cloud experience 90% fewer late payments.",
  },
  {
    icon: <TrendingUp size={28} />,
    title: "Grow Your Portfolio",
    description:
      "From one property to 500. With 21+ built-in features and 10+ integrations, PMS Cloud grows with you no matter how big your portfolio gets.",
  },
  {
    icon: <Handshake size={28} />,
    title: "Get Help When You Need It",
    description:
      "From setup to support, our dedicated team is here to make sure your rental business runs smoothly at every step.",
  },
];

const UseCasesPage: React.FC = () => {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-0 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Use Cases</h1>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Under Working...
        </p>
      </div>

  <AIFeaturesSection features={usecaseFeatures} color="#B3F5C9" textColor="#07351E" buttonText='Read More' />
    </section>
  );
};

export default UseCasesPage;


