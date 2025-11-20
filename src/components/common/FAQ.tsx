import React, { useState } from 'react';

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
  defaultOpenId?: number | null;
}

const IconPlus: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconMinus: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FAQ: React.FC<FAQProps> = ({ 
  title = 'Frequently Asked Questions',
  subtitle = 'If there are questions you want to ask.\nWe will answer all your questions.',
  items,
  defaultOpenId
}) => {
  const [openId, setOpenId] = useState<number | null>(defaultOpenId ?? items[0]?.id ?? null);

  const toggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-white px-0 py-8 sm:px-6 sm:py-10 md:px-6 md:py-12 lg:px-6 lg:py-4 xl:py-8 2xl:py-10">
      <div className="mx-auto grid max-w-7xl px-4 sm:px-6 md:px-8 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-1">
        {/* Left: Heading */}
        <div>
          <h2 className="mb-2 sm:mb-3 md:mb-4 font-heading text-2xl sm:text-3xl md:text-3xl font-semibold leading-tight tracking-[0] text-(--color-heading)">
            {title}
          </h2>
          <p className="font-heading font-light text-xs sm:text-sm md:text-sm xl:text-base leading-6 sm:leading-7 tracking-[0] text-[#61656E] whitespace-pre-line">
            {subtitle}
          </p>
        </div>

        {/* Right: Accordion */}
        <div className="flex flex-col w-full max-w-3xl">
          <div className="space-y-3 sm:space-y-4">
            {items.map(item => {
              const expanded = openId === item.id;
              return (
                <div key={item.id} className={`rounded-lg border border-[#E5E5E6] bg-white transition-shadow ${expanded ? 'shadow-md' : 'shadow-sm'}`}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 min-h-14 sm:min-h-16 md:min-h-16 xl:min-h-20 text-left"
                  >
                    <span className="font-heading text-base sm:text-lg md:text-lg font-medium leading-5 sm:leading-6 md:leading-6 xl:leading-8 tracking-[0] text-(--color-heading)">
                      {item.question}
                    </span>
                    {expanded ? (
                      <IconMinus className="text-(--color-heading) shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <IconPlus className="text-(--color-heading) shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>

                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    className={`grid overflow-hidden px-4 sm:px-5 md:px-6 transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="min-h-0">
                      <p className="pb-5 sm:pb-6 md:pb-7 font-heading font-normal text-xs sm:text-sm md:text-sm xl:text-base leading-6 sm:leading-7 tracking-[0] text-(--color-subheading)">
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

export default FAQ;
