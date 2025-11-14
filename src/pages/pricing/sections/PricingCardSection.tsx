import React, { useState, useEffect } from 'react';
import { pricingPlans } from './PricingAndTableData';
import { PricingCard } from './PricingCard';

// --- Arrow Icons (inline SVG) ---
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <svg
    {...props}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <svg
    {...props}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// --- Type Definitions ---
interface PricingPlanProps {
  plan: string;
  description: string;
  priceText: string;
  annualBillingText: string;
  includesTitle: string;
  features: string[];
  isPopular: boolean;
  isPro?: boolean;
}

// --- Custom Hook for Window Size ---
const useWindowSize = (): [number, number] => {
  const [size, setSize] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Exit if window is not defined
    }

    const handleResize = (): void => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

// --- Pricing Slider Component ---
interface PricingSliderProps {
  plans: PricingPlanProps[];
}

const PricingSlider = ({ plans }: PricingSliderProps): React.ReactElement => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    setTouchEndX(null); // Reset
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (): void => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;

    if (distance > minSwipeDistance) {
      nextPlan(); // Swipe Left (Next)
    } else if (distance < -minSwipeDistance) {
      prevPlan(); // Swipe Right (Prev)
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const nextPlan = (): void => {
    setCurrentIndex((prev) => (prev === plans.length - 1 ? 0 : prev + 1));
  };

  const prevPlan = (): void => {
    setCurrentIndex((prev) => (prev === 0 ? plans.length - 1 : prev - 1));
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {plans.map((plan, index) => (
            <div key={index} className="w-full flex-shrink-0 p-2">
              <PricingCard
                plan={plan.plan}
                description={plan.description}
                priceText={plan.priceText}
                annualBillingText={plan.annualBillingText}
                includesTitle={plan.includesTitle}
                features={plan.features}
                isPopular={plan.isPopular}
                isPro={plan.isPro}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={prevPlan}
          className="p-3 rounded-full bg-[#20CC95] text-white hover:bg-[#17a673] transition-colors"
          aria-label="Previous plan"
        >
          <ArrowLeftIcon />
        </button>

        <div className="flex space-x-2">
          {plans.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-[#20CC95]' : 'bg-gray-600'
              } transition-colors`}
              aria-label={`Go to plan ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextPlan}
          className="p-3 rounded-full bg-[#20CC95] text-white hover:bg-[#17a673] transition-colors"
          aria-label="Next plan"
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function PricingCardSection(): React.ReactElement | null {
  const [width] = useWindowSize();
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true); // Set client-side flag after mount
  }, []);

  const isDesktop = width >= 1285;

  if (!isClient) {
    return null;
  }

  return (
    <div className=" md:py-20">
      <div className="container mx-auto">
        {isDesktop ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
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
        ) : (
          <PricingSlider plans={pricingPlans} />
        )}
      </div>
    </div>
  );
}