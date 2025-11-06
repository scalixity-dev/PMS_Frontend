import React from 'react';

interface FeatureHighlight {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureHighlightsGridProps {
  features: FeatureHighlight[];
  layout?: 'horizontal' | 'vertical'; // horizontal: icon and title in same row, vertical: icon above title
  align?: 'left' | 'center'; // only used when layout is vertical
  descriptionClassName?: string;
}

const FeatureHighlightsGrid: React.FC<FeatureHighlightsGridProps> = ({ features, layout = 'horizontal', align = 'center', descriptionClassName }) => {
  // Ensure passed icon elements inherit the desired size and currentColor so
  // they pick up the `text-[var(--color-primary)]` color on the wrapper.
  const renderIcon = (icon: React.ReactNode) => {
    if (React.isValidElement(icon)) {
      // preserve existing className if present; ensure sizing and stroke use currentColor
      const element = icon as React.ReactElement<{ className?: string }>;
      const existingClassName = element.props.className || '';
      return React.cloneElement(element, {
        className: `${existingClassName} w-8 h-8 stroke-current`,
      });
    }

    return icon;
  };

  return (
    <div className="w-full border border-gray-300 rounded-3xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col p-8 space-y-4 relative ${
              layout === 'vertical'
                ? align === 'left'
                  ? 'items-start text-left'
                  : 'items-center text-center'
                : 'items-start'
            } ${
              // Add shorter right border for left column items (index 0, 2, 4...)
              index % 2 === 0 ? 'md:after:content-[""] md:after:absolute md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:w-px md:after:h-24 md:after:bg-gray-300' : ''
            } ${
              // Add horizontal line connecting top row items with spacing from container edges
              index === 0 ? 'md:before:content-[""] md:before:absolute md:before:bottom-0 md:before:left-8 md:before:h-px md:before:bg-gray-300 md:before:w-[calc(200%-4rem)]' : ''
            }`}
          >
            {layout === 'vertical' ? (
              // Vertical Layout: Icon above Title (centered)
              <>
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-full bg-[#CFFBBF] flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] shadow-[0_4px_0_0_#00000040]">
                  {renderIcon(feature.icon)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-[var(--color-primary)]">
                  {feature.title}
                </h3>
              </>
            ) : (
              // Horizontal Layout: Icon and Title in same row
              <div className="flex items-center space-x-4">
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-full bg-[#CFFBBF] flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] shadow-[0_4px_0_0_#00000040]">
                  {renderIcon(feature.icon)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-[var(--color-primary)]">
                  {feature.title}
                </h3>
              </div>
            )}

            {/* Description */}
            {feature.description && (
              <p className={`${descriptionClassName ? descriptionClassName : 'text-sm text-gray-600'} leading-relaxed`}>
                {feature.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureHighlightsGrid;
