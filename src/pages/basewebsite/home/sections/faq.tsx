import React from 'react';
import FAQ from '../../../../components/common/FAQ';
import type { FaqItem } from '../../../../components/common/FAQ';

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
      'Independent landlords, property managers, and institutional operators can all use SmartTenantAI to run portfolios of any size—from a few units to thousands.',
  },
  {
    id: 4,
    question:
      'What features should you look for in rental property management software?',
    answer:
      'Look for online rent collection, maintenance workflows, tenant screening, document e-signing, powerful reporting, and integrations with accounting and banking.',
  },
];

const FAQSection: React.FC = () => {
  return (
    <FAQ
      subtitle="If there are questions you want to ask.
We will answer all your questions."
      items={items}
    />
  );
};

export default FAQSection;


