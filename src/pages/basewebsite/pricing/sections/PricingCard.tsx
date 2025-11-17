import { useNavigate } from "react-router-dom";

interface PricingCardProps {
  plan: string;
  description: string;
  priceText: string;
  annualBillingText: string;
  includesTitle: string;
  features: string[];
  isPopular?: boolean;
  isPro?: boolean;
  isYearly?: boolean;
  onLearnMoreClick?: () => void;
}

interface FeatureItemProps {
  text: string;
  isDark?: boolean;
}
const FeatureItem: React.FC<FeatureItemProps> = ({ text, isDark = false }) => (
  <div className="flex items-center space-x-1">
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.10077" cy="8.10077" r="8.10077" fill={isDark ? 'white' : '#20CC95'}/>
      <path d="M12.1878 5.05403C12.1273 4.99297 12.0552 4.9445 11.9758 4.91143C11.8964 4.87836 11.8113 4.86133 11.7253 4.86133C11.6393 4.86133 11.5541 4.87836 11.4748 4.91143C11.3954 4.9445 11.3233 4.99297 11.2628 5.05403L6.40948 9.91383L4.37044 7.86828C4.30757 7.80754 4.23334 7.75978 4.152 7.72773C4.07067 7.69567 3.98381 7.67995 3.8964 7.68146C3.80899 7.68298 3.72273 7.70169 3.64255 7.73654C3.56237 7.77139 3.48984 7.82169 3.4291 7.88457C3.36836 7.94745 3.3206 8.02167 3.28855 8.10301C3.25649 8.18435 3.24077 8.2712 3.24229 8.35861C3.2438 8.44602 3.26251 8.53228 3.29736 8.61246C3.33221 8.69264 3.38251 8.76517 3.44539 8.82591L5.94695 11.3275C6.00751 11.3885 6.07956 11.437 6.15894 11.4701C6.23833 11.5031 6.32348 11.5202 6.40948 11.5202C6.49548 11.5202 6.58062 11.5031 6.66001 11.4701C6.73939 11.437 6.81144 11.3885 6.872 11.3275L12.1878 6.01165C12.2539 5.95065 12.3067 5.87661 12.3428 5.7942C12.3789 5.7118 12.3975 5.62281 12.3975 5.53284C12.3975 5.44287 12.3789 5.35388 12.3428 5.27147C12.3067 5.18907 12.2539 5.11503 12.1878 5.05403Z" fill={!isDark ? 'white' : '#20CC95'}/>
    </svg>
    <span className={isDark ? "text-white text-sm md:text-base" : "text-gray-600 text-sm md:text-base"}>
      {text}
    </span>
  </div>
);

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  description,
  priceText,
  annualBillingText,
  includesTitle,
  features,
  isPopular = false,
  isPro = false,
  isYearly = false,
  onLearnMoreClick,
}) => {
  const navigate = useNavigate();
  const isDark = isPro;
  
  const cardBgClass = isDark ? "bg-[#20CC95] text-white border-3 border-white shadow-md shadow-[#20CC95] hover:bg-[#006B49]" : "bg-[#D7FFF2] hover:shadow-md hover:shadow-[#20CC95]";
  const textColorClass = isDark ? "text-white" : "text-gray-800";
  const descColorClass = isDark ? "text-white opacity-80" : "text-gray-600";
  const priceColorClass = isDark ? "text-white" : "text-gray-900";
  const subPriceColorClass = isDark ? "text-white opacity-80" : "text-gray-500";
  const buttonClasses = isDark 
    ? "bg-white text-black hover:bg-gray-100" 
    : "bg-[#20CC95] text-white hover:bg-[#20CC95]/80 border-2 border-white";
  const includesColorClass = isDark ? "text-white" : "text-gray-900";
  const learnMoreColorClass = isDark ? "text-white" : "text-[#20CC95]";

  // Helper function to extract price from annualBillingText
  const extractAnnualPrice = (text: string): string => {
    // Extract price like "$198.00" or "$100.00 / mo" from text
    const match = text.match(/\$[\d,]+\.?\d*/);
    if (match) {
      return match[0];
    }
    return text;
  };

  // Calculate monthly equivalent from annual price
  const getMonthlyEquivalent = (annualText: string): string => {
    const match = annualText.match(/\$[\d,]+\.?\d*/);
    if (match) {
      const annualPrice = parseFloat(match[0].replace('$', '').replace(',', ''));
      const monthlyPrice = (annualPrice / 12).toFixed(2);
      return `$${monthlyPrice} /m`;
    }
    return priceText; // Fallback to original monthly price
  };

  // Handle "Custom" pricing case
  const isCustomPricing = priceText.toLowerCase() === "custom";

  // Determine what to display based on isYearly
  const displayPrice = isYearly 
    ? (isCustomPricing 
        ? annualBillingText.replace(" / mo", " /year") 
        : extractAnnualPrice(annualBillingText) + " /year")
    : priceText;
  
  const displaySubPrice = isYearly
    ? (isCustomPricing 
        ? "Contact us for annual pricing" 
        : getMonthlyEquivalent(annualBillingText) + " billed monthly")
    : annualBillingText;
 
  return (
    <div
      className={`relative flex flex-col p-6 md:p-8 rounded-2xl transition-all duration-300 ${cardBgClass} h-full hover:cursor-pointer`}
    >
      <div className="min-h-28"> 
        <div className={`flex items-start ${isPopular && 'justify-between'}`}>
          <h3 className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 ${textColorClass}`}>{plan}</h3>
          {isPopular && (
            <span className="bg-[#FEC74E] text-white text-md px-3 py-1 font-semibold whitespace-nowrap shadow-md shadow-white top-2">
              Most Popular
            </span>
          )} 
        </div>
        
        <p className={`text-sm ${descColorClass}`}>
          {description}
        </p>
      </div>

      <div className="min-h-20 mb-4">
        <p className={`text-3xl md:text-4xl font-bold ${priceColorClass} mb-1`}>
          {displayPrice}
        </p>
        <p className={`text-xs ${subPriceColorClass}`}>
          {displaySubPrice}
        </p>
      </div>

      <div className="mb-6">
        <button
          className={`w-full md:w-[80%] max-w-xs px-1 py-3 rounded-md font-semibold transition-colors duration-200 ${buttonClasses} flex items-center justify-center space-x-2 mx-auto md:mx-0`}
          onClick={() => navigate("/signup")}
        >
          <span>Start 14-days trial</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      <div className="min-h-10">
        <p className={`text-base font-semibold ${includesColorClass}`}>
          {includesTitle}
        </p>
      </div>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <FeatureItem key={index} text={feature} isDark={isDark} />
        ))}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          if (onLearnMoreClick) {
            onLearnMoreClick();
          }
        }}
        className={`mt-auto pt-4 text-md font-semibold ${learnMoreColorClass} hover:underline text-left`}
      >
        Learn More
      </button>
    </div>
  );
};