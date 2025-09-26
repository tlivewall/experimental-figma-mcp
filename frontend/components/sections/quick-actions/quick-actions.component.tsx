import React from 'react';
import Link from 'next/link';
import { QuickActionsFields } from 'types/figma/quick-actions.types';
import Typography from 'components/ui/typography/typography.component';
import Container from 'components/ui/container/container.component';
import { QuickActionItem } from './components';

type Props = QuickActionsFields;

/**
 * QuickActions component for displaying quick action cards
 * Supports vertical and horizontal layouts with responsive mobile design
 */
const QuickActions: React.FC<Props> = ({
  title,
  items,
  layout = 'vertical',
  showMoreButton = false,
  moreButtonText = 'Bekijk meer',
  moreButtonHref
}) => {
  // Early return for validation
  if (!title || !items || items.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-12">
      <Container>
        <div className="flex flex-col gap-3 md:gap-2">
          {/* Section Title */}
          <Typography 
            type="h2" 
            size="body16" 
            weight="bold" 
            color="gray"
            className="mb-1"
          >
            {title}
          </Typography>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            {layout === 'vertical' ? (
              // Desktop Vertical: 3-column card layout
              <div className="grid grid-cols-3 gap-2 w-full">
                {items.slice(0, 3).map((item, index) => (
                  <QuickActionItem
                    key={`${item.title}-${index}`}
                    {...item}
                    layout="vertical"
                  />
                ))}
              </div>
            ) : (
              // Desktop Horizontal: 3x2 grid layout
              <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[231px] w-full">
                {items.slice(0, 6).map((item, index) => (
                  <QuickActionItem
                    key={`${item.title}-${index}`}
                    {...item}
                    layout="horizontal"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              {items.slice(0, 4).map((item, index) => (
                <QuickActionItem
                  key={`${item.title}-mobile-${index}`}
                  {...item}
                  layout="horizontal"
                  isMobile={true}
                />
              ))}
            </div>

            {/* Mobile CTA Button */}
            {showMoreButton && moreButtonHref && (
              <div className="flex justify-center pt-3">
                <Link 
                  href={moreButtonHref}
                  className="flex items-center gap-0.5 rounded-[4px] transition-opacity duration-200 hover:opacity-80"
                >
                  <Typography 
                    type="span" 
                    size="cta20" 
                    weight="bold" 
                    color="black"
                    className="uppercase tracking-[0.8px]"
                    style={{ fontFamily: 'National 2 Compressed, sans-serif' }}
                  >
                    {moreButtonText}
                  </Typography>
                  <div className="w-2.5 h-2.5 flex items-center justify-center">
                    <span className="text-[#000017] transform rotate-90">↓</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default QuickActions;
