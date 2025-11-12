import React from "react";
import { ArrowRight } from "lucide-react";
import GetStartedButton from "../../../components/common/buttons/GetStartedButton";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PillButton {
  label: string;
  onClick?: () => void;
}

interface ContentShowcaseSectionProps {
  reverse?: boolean; // swap image and text side
  tag?: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  imageSrc: string;
  features: Feature[];
  pillButtons?: PillButton[]; // Pill buttons above image
  featuresInSingleRow?: boolean; // Display features in a single row
}

const ContentShowcaseSection: React.FC<ContentShowcaseSectionProps> = ({
  reverse = false,
  tag,
  heading,
  description,
  buttonText,
  buttonLink = "#",
  imageSrc,
  features,
  pillButtons,
  featuresInSingleRow = false,
}) => {
  return (
    <section className="w-full py-16 px-6 md:px-20 overflow-visible">
      <div
        className={`max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-28 ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Left / Image Section */}
      <div className="relative w-full md:flex-[0_0_35%] flex flex-col justify-center">
        {/* Pill Buttons above image */}
        {pillButtons && pillButtons.length > 0 && (
          <div className="flex gap-3 mb-4 w-full max-w-[500px]">
            {pillButtons.map((pill, idx) => (
              <button
                key={idx}
                onClick={pill.onClick}
                className="flex items-center gap-2 bg-white border border-gray-500 border-2 rounded-full px-4 py-2 hover:opacity-90 transition-opacity flex-1"
              >
                <div className="w-3 h-3 rounded-full bg-[#819A78] flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <span className="text-[#1F2937] text-sm font-medium">
                  {pill.label}
                </span>
              </button>
            ))}
          </div>
        )}
        <div className={`bg-[#D8EFE7] rounded-3xl p-6 w-full max-w-[500px] shadow-md relative flex flex-col justify-center ${pillButtons && pillButtons.length > 0 ? 'min-h-[450px]' : 'min-h-[500px]'}`}>
          {/* Top right arrow */}
          <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm z-10">
            <ArrowRight size={18} color="#3D7475" />
          </div>

          {/* Placeholder image */}
          <img
            src={imageSrc}
            alt="Feature preview"
            className="w-full rounded-lg object-cover shadow-lg self-center"
            style={{ maxHeight: '450px', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Right / Content Section */}
      <div className="max-w-xl mx-auto md:flex-[0_0_65%]">
        {tag && (
          <p className="text-[#6B8E68] font-medium text-xl mb-3">{tag}</p>
        )}

        <h2 className="text-3xl md:text-5xl font-medium text-[#1F2937] leading-snug mb-4">
          {heading}
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <p className="text-[#4B5563] text-base leading-relaxed flex-1">
            {description}
          </p>

          {/* CTA Button */}
          <GetStartedButton
            text={buttonText}
            size="sm"
            widthClass="w-45"
            to={buttonLink !== "#" ? buttonLink : undefined}
            className="flex-shrink-0"
          />
        </div>

        {/* Features Grid / Single Row */}
        <div className={`mt-10 ${featuresInSingleRow ? 'flex flex-col gap-6' : 'grid grid-cols-1 sm:grid-cols-2 gap-6'}`}>
          {features.map((feature, idx) => (
            <div key={idx} className={`flex items-start gap-4 ${featuresInSingleRow ? 'flex-row' : ''}`}>
              <div className="bg-[#CDEBC3] rounded-2xl p-4 w-16 h-16 flex items-center justify-center shadow-sm flex-shrink-0">
                <div className="text-[#081029]">
                  {feature.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1F2937] mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#4B5563] leading-snug mb-2">
                  {feature.description}
                </p>
                <a
                  href="#"
                  className="text-[#4B7D48] text-sm font-medium hover:underline"
                >
                  Learn more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default ContentShowcaseSection;
