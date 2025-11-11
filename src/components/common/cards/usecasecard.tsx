import React from 'react';

interface UsecaseFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface UsecaseCardProps {
  eyebrow?: string;
  eyebrowClassName?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  features: UsecaseFeature[];
  className?: string;
  featuresGridClassName?: string;
}

const UsecaseCard: React.FC<UsecaseCardProps> = ({
  eyebrow,
  eyebrowClassName,
  title,
  description,
  features,
  className = '',
  featuresGridClassName = 'grid grid-cols-1 gap-6 sm:grid-cols-3',
}) => {
  const eyebrowClasses = eyebrowClassName ?? 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#E8F5E9] text-[#1F2937]';

  return (
    <section className={`${className}`}>
      {eyebrow ? (
        <span className={eyebrowClasses}>{eyebrow}</span>
      ) : null}

      {title || description ? (
        <div className="mt-6 max-w-3xl">
          {title ? (
            <h2 className="text-3xl font-semibold leading-snug text-[#111827]">{title}</h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-[#4B5563]">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className={featuresGridClassName}>
        {features.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-start gap-3">
            <div className="bg-[#CDEBC3] rounded-2xl p-4 w-14 h-14 flex items-center justify-center shadow-sm">
              <div className="text-[#081029]">
                {feature.icon}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-[#1F2937]">
                {feature.title}
              </h3>
              <p className="text-sm text-[#4B5563] leading-snug">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UsecaseCard;

