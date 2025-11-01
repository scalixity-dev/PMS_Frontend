import React from 'react';

interface FeatureHighlight {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureHighlightsGridProps {
  features: FeatureHighlight[];
  layout?: 'horizontal' | 'vertical'; // horizontal: icon and title in same row, vertical: icon above title
}

const FeatureHighlightsGrid: React.FC<FeatureHighlightsGridProps> = ({ features, layout = 'horizontal' }) => {
  // Ensure passed icon elements inherit the desired size and currentColor so
  // they pick up the `text-[var(--color-primary)]` color on the wrapper.
  const renderIcon = (icon: React.ReactNode) => {
    if (React.isValidElement(icon)) {
      // clone and merge existing props, ensure sizing and stroke use currentColor
      const existingProps = (icon as any).props || {};
      return React.cloneElement(icon as React.ReactElement<any>, {
        ...existingProps,
        className: `${existingProps.className || ''} w-8 h-8 stroke-current`,
      } as any);
    }

    return icon;
  };

  return (
    <div className="w-full border border-gray-300 rounded-3xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col p-8 space-y-4 ${
              layout === 'vertical' ? 'items-center text-center' : 'items-start'
            } ${
              // Add right border for left column items (index 0, 2, 4...)
              index % 2 === 0 ? 'md:border-r border-gray-300' : ''
            } ${
              // Add bottom border for top row items (index 0, 1)
              index < 2 ? 'border-b border-gray-300' : ''
            }`}
          >
            {layout === 'vertical' ? (
              // Vertical Layout: Icon above Title (centered)
              <>
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-full bg-[#CFFBBF] flex items-center justify-center flex-shrink-0 text-[var(--color-primary)]">
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
                <div className="w-16 h-16 rounded-full bg-[#CFFBBF] flex items-center justify-center flex-shrink-0 text-[var(--color-primary)]">
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
              <p className="text-sm text-gray-600 leading-relaxed">
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
