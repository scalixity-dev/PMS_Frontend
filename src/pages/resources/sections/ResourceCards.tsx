import type { ReactNode } from 'react';

// Define the props for the component
interface InfoCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  variant?: 'light' | 'primary'| 'light2' | 'primary2';
  iconBgColorClass?: string;
  iconColorClass?: string;
}

interface LearnMoreCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  backgroundColorClass: string;
  href?: string;
}

interface SupportCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode; // Use ReactNode to allow text with links
  ctaText: string;
  ctaHref: string;
}

interface SimpleIconCardProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  bgColorClass?: string;
  borderColorClass?: string;
  iconBgColorClass?: string;
  iconColorClass?: string;
}

export const InfoCard = ({
  title,
  subtitle,
  icon,
  variant = 'light',
  iconColorClass = 'text-current',
}: InfoCardProps) => {

  const cardBaseClasses = 'p-9 rounded-2xl shadow-md flex flex-col h-[254.29388427734375px] w-[319.759765625px]';


  const cardVariantClasses = {
    light: 'bg-[#E1E9EB]',
    primary: 'bg-[#11DE9B] shadow-lg',
    light2: 'bg-[#F5F5F5]',
    primary2: 'bg-[#819A78]/33 shadow-lg',
  };
  const titleVariantClasses = {
    light: 'text-[#090F32]',
    primary: 'text-white',
    light2: 'text-[#090F32]',
    primary2: 'text-[#423F3F]',
  };
  const subtitleVariantClasses = {
    light: 'text-[#2C2C2C]',
    primary: 'text-white',
    light2: 'text-[#2C2C2C]',
    primary2: 'text-black',
  };

  return (
    <div className={`${cardBaseClasses} ${cardVariantClasses[variant]}`}>
      
      <div className="flex items-center space-x-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl`}
        >
          {icon && <div className={`${iconColorClass}`}>{icon}</div>}
        </div>
        <h3 className={`text-lg font-semibold ${titleVariantClasses[variant]}`}>
          {title}
        </h3>
      </div>

      <div>
        <p className={`text-md mt-6 ${subtitleVariantClasses[variant]}`}>
          {subtitle}
        </p>
      </div>
      
    </div>
  );
};

export const LearnMoreCard: React.FC<LearnMoreCardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  backgroundColorClass,
  href = '#',
}) => {
  return (
    <div className="flex flex-col h-full ">
      
      {/* Image Container */}
      <div className={`rounded-2xl p-6 md:p-8 ${backgroundColorClass} mb-6`}>
        <img
          src={imageUrl}
          alt={imageAlt}
          className="rounded-lg shadow-xl h-50"
          width={500}
        //   height={512}
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
          {title}
        </h3>
        
        <p className="text-lg text-slate-600 mb-6 flex-1">
          {description}
        </p>

        <a href={href} className="flex items-center gap-4 group w-fit mt-auto">
          <span className="text-lg font-semibold text-slate-900">
            Learn More
          </span>
          <svg width="75" height="40" viewBox="0 0 83 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M65.0472 24.1792C65.5032 23.7232 65.5032 22.9838 65.0472 22.5278L57.6162 15.0969C57.1602 14.6409 56.4209 14.6409 55.9649 15.0969C55.5089 15.5529 55.5089 16.2922 55.9649 16.7482L62.5702 23.3535L55.9649 29.9588C55.5089 30.4148 55.5089 31.1541 55.9649 31.6101C56.4209 32.0661 57.1602 32.0661 57.6162 31.6101L65.0472 24.1792ZM0 23.3535L1.0208e-07 24.5212L64.2216 24.5212L64.2216 23.3535L64.2216 22.1858L-1.0208e-07 22.1859L0 23.3535Z" fill="#232323"/>
            <circle cx="59.5486" cy="23.3533" r="22.7695" stroke="#20CC95" stroke-width="1.16766"/>
          </svg>
        </a>
      </div>

    </div>
  );
};

export const SupportCard: React.FC<SupportCardProps> = ({
  icon,
  title,
  description,
  ctaText,
  ctaHref,
}) => {
  return (
    <div className="relative p-8 max-w-xs w-full h-full flex flex-col">
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-emerald-500 rounded-tl-2xl" aria-hidden="true"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-emerald-500 rounded-br-2xl" aria-hidden="true"></div>
      <div className="flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-6">
        <div className="text-white">{icon}</div>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        {title}
      </h3>

      <div className="text-md text-[#7B7B7B] font-semibold mb-6 flex-1">
        {description}
      </div>

      <a href={ctaHref} className="flex items-center gap-4 group w-fit mt-auto">
        <span className="text-md font-semibold text-slate-900">
          {ctaText}
        </span>

        <svg width="75" height="40" viewBox="0 0 83 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M65.0472 24.1792C65.5032 23.7232 65.5032 22.9838 65.0472 22.5278L57.6162 15.0969C57.1602 14.6409 56.4209 14.6409 55.9649 15.0969C55.5089 15.5529 55.5089 16.2922 55.9649 16.7482L62.5702 23.3535L55.9649 29.9588C55.5089 30.4148 55.5089 31.1541 55.9649 31.6101C56.4209 32.0661 57.1602 32.0661 57.6162 31.6101L65.0472 24.1792ZM0 23.3535L1.0208e-07 24.5212L64.2216 24.5212L64.2216 23.3535L64.2216 22.1858L-1.0208e-07 22.1859L0 23.3535Z" fill="#232323"/>
            <circle cx="59.5486" cy="23.3533" r="22.7695" stroke="#20CC95" stroke-width="1.16766"/>
        </svg>
      </a>
    </div>
  );
};


const defaultProps: Partial<SimpleIconCardProps> = {
  bgColorClass: 'bg-[#DCFDD0]/33',
  borderColorClass: 'border-[#91EF6F]',
  iconBgColorClass: 'bg-[#CDEBC3]',
  iconColorClass: 'text-green-800',
};

export const SimpleIconCard: React.FC<SimpleIconCardProps> = (props) => {
  const {
    icon,
    title,
    bgColorClass,
    borderColorClass,
    iconBgColorClass,
    iconColorClass,
  } = { ...defaultProps, ...props };

  return (
    <div
      className={`p-6 rounded-2xl border-2 ${borderColorClass} ${bgColorClass} flex flex-col items-center justify-center text-center shadow-sm`}
    >
      {/* Icon */}
      <div
        className={`flex h-15 w-15 items-center shadow-md justify-center rounded-2xl ${iconBgColorClass} mb-6`}
      >
        <div className={iconColorClass}>{icon}</div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900">
        {title}
      </h3>

    </div>
  );
};