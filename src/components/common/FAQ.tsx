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
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconMinus: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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
    <section className="w-full bg-white px-6 py-14 lg:py-4 xl:py-8  2xl:py-10 ">
      <div className="mx-auto grid max-w-7xl px-8 gap-10 lg:grid-cols-2 lg:gap-1">
        {/* Left: Heading */}
        <div>
          <h2 className="mb-2 font-heading text-3xl font-semibold leading-tight tracking-[0] text-(--color-heading)">
            {title}
          </h2>
          <p className="font-heading font-light text-sm xl:text-base leading-7 tracking-[0] text-[#61656E] whitespace-pre-line">
            {subtitle}
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
                    className="flex w-full items-center justify-between gap-6 p-5 min-h-16 xl:min-h-20 text-left"
                  >
                    <span className="font-heading text-lg font-medium leading-6 xl:leading-8 tracking-[0] text-(--color-heading)">
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
                    className={`grid overflow-hidden px-6 transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="min-h-0">
                      <p className="pb-7 font-heading font-normal text-sm xl:text-base leading-7 tracking-[0] text-(--color-subheading)">
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
