import type { FaqItem } from '../../../components/common/FAQ';

/**
 * One source of truth for the public FAQ.
 *
 * The home page shows a short teaser and /faq shows the lot, so keeping the
 * questions in two files would let the same answer drift into two versions.
 */
export const FAQ_ITEMS: FaqItem[] = [
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
  {
    id: 5,
    question: 'Is there a free trial?',
    answer:
      'Yes. Every plan starts with a free 14-day trial so you can set up your properties and try the workflows before you commit, and you can cancel at any time.',
  },
  {
    id: 6,
    question: 'Who is SmartTenantAI built for?',
    answer:
      'Three groups, each with their own workspace. Landlords and property managers run properties, listings, leases and finances. Tenants apply for a rental, pay rent and raise maintenance requests. Service professionals pick up job requests and manage their work and invoices.',
  },
  {
    id: 7,
    question: 'Is there a mobile app?',
    answer:
      'Yes. Tenants and service professionals can use the SmartTenantAI mobile app to stay on top of requests, messages and payments while away from a desk.',
  },
  {
    id: 8,
    question: 'How do I get help?',
    answer:
      'Email support@smarttenantai.com and our team will get back to you. If you already have an account you can also start a conversation from the messages area of your dashboard.',
  },
];

/**
 * The subset the home page teases before pointing at the full page. Kept to the
 * four broadest questions so the section stays short.
 */
export const HOME_FAQ_ITEMS: FaqItem[] = FAQ_ITEMS.slice(0, 4);
