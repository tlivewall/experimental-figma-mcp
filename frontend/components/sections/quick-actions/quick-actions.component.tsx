import React from 'react';
import Link from 'next/link';
import Typography from 'components/ui/typography/typography.component';
import Container from 'components/ui/container/container.component';
import { QuickActionsProps, QuickActionItem } from 'types/figma/quick-actions.types';

/**
 * 🥥 "Je kunt de kokosnoot schilderen, maar je kunt de melk erin niet veranderen." - Tito
 * 
 * Quick Actions Section Component
 * Displays actionable items with adaptive layouts based on Figma designs
 * 
 * Features:
 * - Vertical card layout (icon above text) for desktop showcase
 * - Horizontal layout (icon beside text) for compact grid display  
 * - Auto-detection of optimal layout based on item count
 * - Responsive design with custom Tailwind spacing scale
 * - Multiple grid configurations (flex-wrap vs CSS grid)
 */
const QuickActions: React.FC<QuickActionsProps> = ({
  title,
  items,
  ctaText,
  ctaHref,
  variant = 'auto',
  layout = 'horizontal',
  view = 'auto'
}) => {
  // Auto-detect optimal variant based on item count
  const resolvedVariant = variant === 'auto' 
    ? (items.length <= 3 ? 'horizontal' : 'grid')
    : variant;

  // Auto-detect optimal layout for mobile vs desktop
  const resolvedLayout = view === 'mobile' ? 'horizontal' : layout;

  // Early return for empty items
  if (!items || items.length === 0) {
    return null;
  }

  /**
   * Individual Quick Action Item Component
   * Supports both vertical (card-style) and horizontal (compact) layouts
   */
  const QuickActionItem: React.FC<{ item: QuickActionItem }> = ({ item }) => {
    if (resolvedLayout === 'vertical') {
      // Vertical Layout: Icon above text (desktop showcase style)
      return (
        <Link 
          href={item.href}
          className="bg-[#fafaf0] border border-[#edede1] rounded-lg p-2 flex flex-col gap-2 hover:bg-[#f5f5e6] transition-colors"
        >
          {/* Icon container - centered at top */}
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center mx-auto p-1">
            <div className="w-7 h-7 grid grid-cols-3 gap-0.5">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={`icon-grid-${item.title}-${i}`} className="bg-[#666674] rounded-sm" />
              ))}
            </div>
          </div>
          
          {/* Content and Chevron Row */}
          <div className="flex items-end gap-2">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <Typography 
                type="h3" 
                size="body16" 
                weight="semibold" 
                color="black"
                className="line-clamp-1 mb-1"
              >
                {item.title}
              </Typography>
              <Typography 
                type="p" 
                size="body16" 
                color="gray"
                className="line-clamp-2"
              >
                {item.description}
              </Typography>
            </div>
            
            {/* Chevron icon - 24px = w-3 h-3 in custom scale */}
            <div className="flex-shrink-0 w-3 h-3 flex items-center justify-center">
              <svg 
                width="8" 
                height="12" 
                viewBox="0 0 8 12" 
                fill="none" 
                className="text-[#666674]"
              >
                <path 
                  d="M1.5 1L6.5 6L1.5 11" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </Link>
      );
    }

    // Horizontal Layout: Icon beside text (compact grid style)
    return (
      <Link 
        href={item.href}
        className="bg-[#fafaf0] border border-[#edede1] rounded-lg p-2 flex items-center gap-2 hover:bg-[#f5f5e6] transition-colors"
      >
        {/* Icon container - responsive sizing */}
        <div className="flex-shrink-0 w-4 h-4 md:w-9 md:h-9 bg-white rounded-lg flex items-center justify-center p-1 md:p-1">
          <div className="w-3 h-3 md:w-7 md:h-7 grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={`icon-grid-${item.title}-${i}`} className="bg-[#666674] rounded-sm" />
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <Typography 
            type="h3" 
            size="body16" 
            weight="semibold" 
            color="black"
            className="line-clamp-1 mb-1"
          >
            {item.title}
          </Typography>
          <Typography 
            type="p" 
            size="body14"
            color="gray"
            className="line-clamp-2 md:line-clamp-1"
          >
            {item.description}
          </Typography>
        </div>
        
        {/* Chevron icon - 24px = w-3 h-3 in custom scale */}
        <div className="flex-shrink-0 w-3 h-3 flex items-center justify-center">
          <svg 
            width="8" 
            height="12" 
            viewBox="0 0 8 12" 
            fill="none" 
            className="text-[#666674]"
          >
            <path 
              d="M1.5 1L6.5 6L1.5 11" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>
    );
  };

  /**
   * Call-to-Action Button Component
   * Matches Figma design with National 2 Compressed font styling
   */
  const CallToActionButton: React.FC = () => {
    if (!ctaText || !ctaHref) return null;

    return (
      <div className="pt-3 md:pt-6 flex justify-center">
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <Typography
            type="span"
            size="default"
            weight="bold"
            color="black"
            className="text-lg uppercase tracking-wider"
          >
            {ctaText}
          </Typography>
          {/* CTA Arrow icon - 20px = w-2.5 h-2.5 in custom scale */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="rotate-90 w-2.5 h-2.5"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    );
  };

  return (
    <section className="bg-white w-full py-12">
      <Container>
        <div className="space-y-2 md:space-y-3">
          {/* Section Title */}
          <Typography 
            type="h2" 
            size="body16" 
            weight="bold" 
            color="gray"
            className="mb-2 md:mb-3"
          >
            {title}
          </Typography>
          
          {/* Dynamic Grid Layout based on variant */}
          <div className={`
            ${resolvedVariant === 'horizontal'
              ? 'flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-2'
              : resolvedVariant === 'grid'
              ? 'grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-2'
              : 'flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-2'
            }
          `}>
            {items.map((item) => (
              <div 
                key={`quick-action-${item.title.replace(/\s+/g, '-').toLowerCase()}-${item.href}`}
                className={resolvedVariant === 'horizontal' ? 'md:flex-1' : ''}
              >
                <QuickActionItem item={item} />
              </div>
            ))}
          </div>

          {/* Optional Call-to-Action */}
          <CallToActionButton />
        </div>
      </Container>
    </section>
  );
};

export default QuickActions;
