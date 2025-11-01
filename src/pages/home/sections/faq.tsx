import React, { useState } from 'react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const items: FaqItem[] = [
  {
    id: 1,
    question: 'What is rental property management software?',
    answer:
      'Property management software allows landlords and property managers to monitor, screen, and provide online rent collection to their renters. The rental industry is always looking for ways to optimize, simplify, and enhance back-office operations and finances; property management software is the way to do it.',
  },
  {
    id: 2,
    question: 'Why do you need property management software?',
    answer:
      'It centralizes your listings, applicants, screening, leases, rent, and maintenance so you can work faster with fewer errors and better visibility into performance.',
  },
  {
    id: 3,
    question: 'Who can use rental property management software?',
    answer:
      'Independent landlords, property managers, and institutional operators can all use PMS to run portfolios of any size—from a few units to thousands.',
  },
  {
    id: 4,
    question:
      'What features should you look for in rental property management software?',
    answer:
      'Look for online rent collection, maintenance workflows, tenant screening, document e-signing, powerful reporting, and integrations with accounting and banking.',
  },
];

const IconPlus: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconMinus: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);

  const toggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-white px-6 py-14 sm:px-10 lg:px-20 2xl:py-24 3xl:px-24 4xl:px-28">
      <div className="mx-auto grid max-w-7xl px-20 gap-10 lg:grid-cols-2 lg:gap-16 3xl:gap-20 4xl:gap-24">
        {/* Left: Heading */}
        <div>
          <h2 className="mb-4 font-heading text-4xl font-semibold leading-tight tracking-[0] text-(--color-heading)">
            Frequently Asked Questions
          </h2>
          <p className="font-heading font-light text-lg leading-7 tracking-[0] text-[#61656E]">
            If there are questions you want to ask.
            <br />
            We will answer all your questions.
          </p>
        </div>

        {/* Right: Accordion */}
        <div className="flex flex-col w-full max-w-3xl">
          <div className="space-y-4">
            {items.map(item => {
              const expanded = openId === item.id;
              return (
                <div key={item.id} className={`rounded-lg border border-[#E5E5E6] bg-white transition-shadow ${expanded ? 'shadow-md' : 'shadow-sm'}`}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center justify-between gap-6 p-7 min-h-24 text-left"
                  >
                    <span className="font-heading text-2xl font-medium leading-9 tracking-[0] text-(--color-heading)">
                      {item.question}
                    </span>
                    {expanded ? (
                      <IconMinus className="text-(--color-heading)" />
                    ) : (
                      <IconPlus className="text-(--color-heading)" />
                    )}
                  </button>

                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    className={`grid overflow-hidden px-7 transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="min-h-0">
                      <p className="pb-7 font-heading font-normal text-lg leading-7 tracking-[0] text-(--color-subheading)">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;


