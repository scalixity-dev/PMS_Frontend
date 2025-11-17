import React, { useRef } from 'react';
import TestimonialCard from '../../../../components/common/cards/TestimonialCard';
import PaginationButtons from '../../../../components/common/buttons/PaginationButtons';

const testimonials = [
  {
    id: 'patrick-g-capterra',
    brand: 'capterra' as const,
    title: 'Manage Properties, Simplify Life',
    content:
      'PMS makes property management simple — screen, market, collect rent, and manage maintenance all in one place.',
    rating: 5,
    authorName: 'Patrick G.',
    authorRole: 'broker',
    avatarUrl: undefined,
  },
  {
    id: 'delores-generic',
    brand: 'generic' as const,
    title: 'Excellent Property Management',
    content:
      'This has been a lifesaver! I took over property management and was able to get up to speed with everything quickly and have information available to my team.',
    rating: 4,
    authorName: 'Delores',
    authorRole: 'owner',
  },
  {
    id: 'marie-k-capterra',
    brand: 'capterra' as const,
    title: 'Long Time User',
    content:
      'What I find the most useful is having everything in one spot and being able to communicate with the PMS about any issues they are having.',
    rating: 5,
    authorName: 'Marie K.',
    authorRole: 'broker',
  },
  {
    id: 'philly-r-generic',
    brand: 'generic' as const,
    title: 'All in one',
    content:
      'All in one platform – payment, messaging, maintenance requests, posting listing. Incredible value for a small landlord.',
    rating: 4,
    authorName: 'Philly R.,',
    authorRole: 'property manager',
  },
];

const TestimonialsSection: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const handlePrev = () => {
    if (window.innerWidth < 640) {
      // Mobile: scroll by card width + gap (396px + 16px = ~412px)
      scrollerRef.current?.scrollBy({ left: -412, behavior: 'smooth' });
    } else if (window.innerWidth < 1024) {
      // Tablet: scroll by smaller amount
      scrollerRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
    } else {
      // Desktop: scroll by card width + gap
      scrollerRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (window.innerWidth < 640) {
      // Mobile: scroll by card width + gap (396px + 16px = ~412px)
      scrollerRef.current?.scrollBy({ left: 412, behavior: 'smooth' });
    } else if (window.innerWidth < 1024) {
      // Tablet: scroll by smaller amount
      scrollerRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
    } else {
      // Desktop: scroll by card width + gap
      scrollerRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-6 lg:px-6">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h2 className="mb-2 sm:mb-3 font-body text-2xl sm:text-[28px] md:text-[30px] lg:text-[32px] font-semibold leading-tight sm:leading-[34px] md:leading-[36px] lg:leading-[38.54px] text-(--color-heading)">
            Trusted by Property Professionals
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <p className="font-body text-xs sm:text-sm md:text-[14.99px] font-normal leading-6 sm:leading-7 md:leading-[28.48px] text-(--color-subheading)">
              Empowering investors and companies to manage properties with confidence
            </p>
            <div className="flex shrink-0 self-end sm:self-auto">
              <PaginationButtons
                onPrev={handlePrev}
                onNext={handleNext}
                containerClassName="flex items-center gap-2"
              />
            </div>
          </div>
        </div>

        <div ref={scrollerRef} className="overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0">
          <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-6 xl:gap-8 2xl:gap-8">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} {...t} className="shrink-0" />
            ))}
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default TestimonialsSection;


