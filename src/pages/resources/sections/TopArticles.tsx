import React from 'react';

const leftColumnArticles = [
  'What can I do using the software',
  'What online payment methods does the software support?',
  'What browsers does the software support?',
  'Can the same e-mail address be used for different accounts?',
  'How is your data protected within the system?',
];

const rightColumnArticles = [
  'Do we provide a free trial?',
  'Where are your data centers hosted?',
  'What browsers does the software support?',
  'Does the software work offline?',
  'Who can use the software?',
];

const ArticleLink: React.FC<{ text: string }> = ({ text }) => (
  <a
    href="#"
    className="flex items-center gap-3 text-[#7B7B7B] font-semibold hover:text-emerald-600 transition-colors"
  >
    {/* fixed-size icon container to ensure equal icon sizes */}
    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M0 8C0 3.59375 3.5625 0 8 0C12.4062 0 16 3.59375 16 8C16 12.4375 12.4062 16 8 16C3.5625 16 0 12.4375 0 8ZM11.5938 6.625C11.9375 6.28125 11.9375 5.75 11.5938 5.40625C11.25 5.0625 10.7188 5.0625 10.375 5.40625L7 8.78125L5.59375 7.40625C5.25 7.0625 4.71875 7.0625 4.375 7.40625C4.03125 7.75 4.03125 8.28125 4.375 8.625L6.375 10.625C6.71875 10.9688 7.25 10.9688 7.59375 10.625L11.5938 6.625Z" fill="#20CC95"/>
      </svg>
    </div>

    <span className="text-base">{text}</span>
  </a>
);

// The main TopArticles component
const TopArticles: React.FC = () => {
  return (
    <section className="max-w-7xl flex flex-col items-center mx-auto py-16 px-3">
      
      {/* Title */}
      <h2 className="text-center text-4xl font-bold text-slate-900 mb-12">
        Top Articles
      </h2>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5 ">
        
        {/* Left Column */}
        <div className="flex flex-col gap-y-5">
          {leftColumnArticles.map((article, index) => (
            <ArticleLink key={index} text={article} />
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-y-5">
          {rightColumnArticles.map((article, index) => (
            <ArticleLink key={index} text={article} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TopArticles;