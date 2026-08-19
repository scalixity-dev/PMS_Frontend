import React from 'react';
import { Link } from 'react-router-dom';
import FAQ from '../../../components/common/FAQ';
import { FAQ_ITEMS } from './faqItems';

/**
 * Public FAQ, reachable from the top nav before signing in.
 *
 * Reuses the shared FAQ accordion and the same question list the home page
 * teases, so an answer is only ever written once.
 */
const FaqPage: React.FC = () => {
  return (
    <main className="w-full bg-white pt-24 md:pt-28">
      <FAQ
        title="Frequently Asked Questions"
        subtitle="Everything people usually ask before getting started.
Still stuck? We are one email away."
        items={FAQ_ITEMS}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-16 md:pb-24">
        <div className="rounded-2xl bg-[#F4F6F6] px-6 py-8 md:px-10 md:py-10 text-center">
          <h2 className="font-heading text-xl md:text-2xl font-semibold text-(--color-heading)">
            Still have a question?
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Tell us what you are trying to do and we will point you at the right
            place.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:support@smarttenantai.com"
              className="inline-flex items-center justify-center rounded-xl bg-[#3D7475] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              Email support
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#3D7475] px-6 py-3 text-sm font-semibold text-[#3D7475] transition-colors hover:bg-[#3D7475] hover:text-white"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FaqPage;
