import React from 'react';

interface CtaSectionProps {
  title?: string;
  titleSize?: string
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

const defaultProps: Required<CtaSectionProps> = {
  title: 'Landlord Forms',
  titleSize: 'lg',
  description: 'Protect your business with state-specific, legally compliant landlord forms—comprehensive, customizable, and lawyer-approved.',
  buttonText: 'Start Trial',
  buttonHref: '#',
};

const CtaSection: React.FC<CtaSectionProps> = (props) => {
  const { title, description, buttonText, buttonHref, titleSize } = { ...defaultProps, ...props };

  return (
    <section className="bg-white pt-10 pb-8 md:pt-15 md:pb-10">
      <div className="max-w-3xl mx-auto text-center px-4">

        {/* Title */}
        <h2 className={`text-${titleSize} font-bold text-slate-900 mb-6`}>
          {title}
        </h2>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-8 font-semibold">
          {description}
        </p>

        {/* Button */}
        <a
          href={buttonHref}
          className="inline-block border-2 border-white shadow-lg bg-[#5A7F7D] text-white font-semibold py-2 px-10 rounded-lg  hover:bg-[#4a6a67] transition-colors"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
};

export default CtaSection;