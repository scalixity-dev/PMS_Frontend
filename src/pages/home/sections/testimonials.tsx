import React from 'react';
import TestimonialCard from '../../../components/common/TestimonialCard';

const testimonials = [
  {
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
    brand: 'generic' as const,
    title: 'Excellent Property Management',
    content:
      'This has been a lifesaver! I took over property management and was able to get up to speed with everything quickly and have information available to my team.',
    rating: 4,
    authorName: 'Delores',
    authorRole: 'owner',
  },
  {
    brand: 'capterra' as const,
    title: 'Long Time User',
    content:
      'What I find the most useful is having everything in one spot and being able to communicate with the PMS about any issues they are having.',
    rating: 5,
    authorName: 'Marie K.',
    authorRole: 'broker',
  },
  {
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
  return (
    <section className="w-full bg-white px-6 py-14 sm:px-10 lg:px-20 lg:py-20">
      <div className="mx-auto max-w-[1670px] 3xl:px-4 4xl:px-6">
        <div className="mb-10">
          <h2 className="mb-2 font-heading text-[28px] font-semibold leading-[120%] text-(--color-heading) sm:text-[34px] lg:text-[40px]">
            Trusted by Property Professionals
          </h2>
          <p className="text-sm text-(--color-subheading)">
            Empowering investors and companies to manage properties with confidence
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 3xl:gap-8 4xl:gap-10">
          {testimonials.map((t, idx) => (
            <TestimonialCard key={idx} {...t} />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[rgba(2,7,62,0.8)]" />
          <span className="h-2 w-2 rounded-full bg-[rgba(2,7,62,0.3)]" />
          <span className="h-2 w-2 rounded-full bg-[rgba(2,7,62,0.3)]" />
          <span className="h-2 w-2 rounded-full bg-[rgba(2,7,62,0.3)]" />
          <span className="h-2 w-2 rounded-full bg-[rgba(2,7,62,0.3)]" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


