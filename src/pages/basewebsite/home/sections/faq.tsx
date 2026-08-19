import React from 'react';
import FAQ from '../../../../components/common/FAQ';
import { HOME_FAQ_ITEMS } from '../../faq/faqItems';

const FAQSection: React.FC = () => {
  return (
    <FAQ
      subtitle="If there are questions you want to ask.
We will answer all your questions."
      items={HOME_FAQ_ITEMS}
    />
  );
};

export default FAQSection;
