import React, { useRef, useEffect } from "react";
import FeatureCard from "../../../components/common/cards/FeatureCard";
import PaginationButtons from "../../../components/common/buttons/PaginationButtons";
import ViewAllButton from "../../../components/common/buttons/ViewAllButton";
import { DollarSign, Building, FileText, Bot } from "lucide-react";
import { useHorizontalInfiniteScroll } from "../../../hooks/useHorizontalInfiniteScroll";

const FeaturesSection: React.FC = () => {
  const { scrollContainerRef, handlePrevClick, handleNextClick } =
    useHorizontalInfiniteScroll({
      scrollAmount: 430, // Card width: 389px + gap: 32px = 421px, rounded to 430
    });

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const tabletScrollRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolledMobile = useRef(false);
  const hasAutoScrolledTablet = useRef(false);

  // Mobile scroll handlers
  const handleMobilePrevClick = () => {
    if (mobileScrollRef.current) {
      const cardWidth = mobileScrollRef.current.scrollWidth / features.length;
      mobileScrollRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleMobileNextClick = () => {
    if (mobileScrollRef.current) {
      const cardWidth = mobileScrollRef.current.scrollWidth / features.length;
      mobileScrollRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Tablet scroll handlers
  const handleTabletPrevClick = () => {
    if (tabletScrollRef.current) {
      const scrollAmount = tabletScrollRef.current.clientWidth;
      tabletScrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleTabletNextClick = () => {
    if (tabletScrollRef.current) {
      const scrollAmount = tabletScrollRef.current.clientWidth;
      tabletScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const features = [
    {
      icon: <DollarSign className="text-[var(--color-primary)]" />,
      title: "Accounting",
      subtitle: "Collect payments, effortlessly",
      description:
        "No more chasing down payments. With PmsCloud, tenants have a flexible, convenient way to pay rent online, and you get peace of mind.",
      points: [
        "Accept credit, debit, ACH, cash, or checks",
        "Reduce late payments by 90% with auto pay",
        "Automatically track paid and overdue invoices",
      ],
  color: "--color-card-1",
    },
    {
      icon: <Building className="text-[var(--color-primary)]" />,
      title: "Property Management",
      subtitle: "Handle all your properties effortlessly",
      description:
        "Manage multiple properties from one dashboard — track tenants, leases, and maintenance in one place.",
      points: [
        "Add, edit, and organize properties in seconds",
        "Real-time occupancy and performance insights",
        "Streamline landlord–tenant communication",
      ],
  color: "--color-card-2",
    },
    {
      icon: <FileText className="text-[var(--color-primary)]" />,
      title: "Rent Collection",
      subtitle: "Take full control of your accounting",
      description:
        "With our suite of accounting features, you can set automatic invoices, run custom reports, track your cash flow.",
      points: [
        "Real-time reporting",
        "Landlords report 20 hours/week saved",
        "Connect to QuickBooks and add multiple banks",
      ],
  color: "--color-card-3",
    },
    {
      icon: <Bot className="text-[var(--color-primary)]" />,
      title: "AI-Powered Assistance",
      subtitle: "Smarter management through automation",
      description:
        "Leverage AI to simplify daily tasks — auto-fill property details, assist with payment queries, and predict late payments.",
      points: [
        "AI-driven chat support for tenants and landlords",
        "Smart rent prediction and reminder system",
        "Auto-generate leases, notices, and reports",
      ],
  color: "--color-card-2",
    },
  ];

  useEffect(() => {
    const mobileObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoScrolledMobile.current) {
            hasAutoScrolledMobile.current = true;
            setTimeout(() => {
              if (mobileScrollRef.current) {
                const cardWidth = mobileScrollRef.current.scrollWidth / features.length;
                mobileScrollRef.current.scrollTo({
                  left: cardWidth * 0.3,
                  behavior: 'smooth'
                });
                setTimeout(() => {
                  mobileScrollRef.current?.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                  });
                }, 800);
              }
            }, 100);
          }
        });
      },
      { threshold: 0.3 }
    );

    const tabletObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoScrolledTablet.current) {
            hasAutoScrolledTablet.current = true;
            setTimeout(() => {
              if (tabletScrollRef.current) {
                const cardWidth = tabletScrollRef.current.scrollWidth / features.length;
                tabletScrollRef.current.scrollTo({
                  left: cardWidth * 0.3,
                  behavior: 'smooth'
                });
                setTimeout(() => {
                  tabletScrollRef.current?.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                  });
                }, 300);
              }
            }, 100);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (mobileScrollRef.current) {
      mobileObserver.observe(mobileScrollRef.current);
    }
    if (tabletScrollRef.current) {
      tabletObserver.observe(tabletScrollRef.current);
    }

    return () => {
      mobileObserver.disconnect();
      tabletObserver.disconnect();
    };
  }, [features.length]);

  // Duplicate features for infinite scroll
  const duplicatedFeatures = [...features, ...features, ...features];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="flex flex-col mb-6 sm:mb-8 lg:mb-10">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-[var(--font-heading)] text-[var(--color-heading)] flex items-center gap-2">
            ✨Our Features
          </h2>
          <div className="mt-3 sm:mt-4 flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
            <p className="text-[var(--color-subheading)] text-xs sm:text-sm lg:text-base max-w-4xl">
              Powerful tools built to simplify property management — from rent
              collection to tenant screening and beyond. Save time, stay organized,
              and manage your entire portfolio from one intuitive dashboard.
            </p>
            <div className="flex-shrink-0 w-full sm:w-auto lg:ml-auto">
              <ViewAllButton to="/features/screening" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Scrollable - 1 card at a time */}
      <div className="block sm:hidden mb-8 -mx-4">
        <div 
          ref={mobileScrollRef}
          className="overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-4 px-4">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="w-[calc(100vw-2rem)] flex-shrink-0 snap-center snap-always"
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Pagination - Centered */}
        <div className="flex justify-center px-4">
          <PaginationButtons 
            containerClassName="flex gap-2 mt-4" 
            onPrev={handleMobilePrevClick}
            onNext={handleMobileNextClick}
          />
        </div>
      </div>

      {/* Tablet: Scrollable - 2 cards at a time */}
      <div className="hidden sm:block lg:hidden mb-8 -mx-2">
        <div 
          ref={tabletScrollRef}
          className="overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-6 px-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="w-[calc((100vw-4.5rem)/2)] flex-shrink-0 snap-start"
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Tablet Pagination - Centered */}
        <div className="flex justify-center px-6">
          <PaginationButtons 
            containerClassName="flex gap-2 mt-4" 
            onPrev={handleTabletPrevClick}
            onNext={handleTabletNextClick}
          />
        </div>
      </div>

      {/* Desktop: Horizontal Scroll with Pagination */}
      <div className="hidden lg:block mb-8">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-8 pr-8">
            {duplicatedFeatures.map((feature, idx) => (
              <div key={idx} className="w-[389px] flex-shrink-0">
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination aligned bottom-right - Desktop only */}
        <div className="flex justify-end">
          <PaginationButtons 
            containerClassName="flex gap-2 mt-6" 
            onPrev={handlePrevClick}
            onNext={handleNextClick}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
