import { useState } from "react";
import { Heading, SubHeading } from "./Headings"
import PricingCardSection from "./PricingCardSection";

export const PricingHeroSection = () => {
    const [isYearly, setIsYearly] = useState(false);
    return (
        <div className="relative z-10 mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Heading />
            <div className="flex flex-col md:flex-row md:items-end md:justify-evenly gap-6 md:gap-8 lg:gap-12 mb-10 md:mb-12">
                <div className="md:max-w-xl lg:max-w-2xl">
                    <SubHeading />
                </div>
                <div className="w-full md:w-auto flex justify-center">
                    <div className="relative p-1 bg-gray-100 rounded-full flex items-center gap-2 shadow-sm">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`w-full md:w-auto py-2 px-6 rounded-full text-sm font-semibold transition-colors duration-300 ${
                                !isYearly ? 'bg-[#20CC95] text-white shadow-md border border-white' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`w-full md:w-auto py-2 px-6 rounded-full text-sm font-semibold transition-colors duration-300 ${
                                isYearly ? 'bg-[#20CC95] text-white shadow-md border border-white' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>
            </div>

            <PricingCardSection />
      </div>
    )
}