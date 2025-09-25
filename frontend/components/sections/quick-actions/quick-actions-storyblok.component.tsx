import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Typography from 'components/ui/typography/typography.component';
import Container from 'components/ui/container/container.component';
import { StoryblokQuickActions, StoryblokQuickActionItem } from 'types/storyblok';

type Props = StoryblokQuickActions;

/**
 * Storyblok Quick Actions Component
 * Renders quick action items from Storyblok CMS
 */
const QuickActionsStoryblok: React.FC<Props> = (props) => {
  const { title, description, actions = [] } = props;

  // Early return for validation
  if (!actions || actions.length === 0) {
    return null;
  }

  // Auto-detect optimal variant based on item count
  const variant = actions.length <= 3 ? 'horizontal' : 'grid';

  /**
   * Individual Quick Action Item Component
   */
  const QuickActionItem: React.FC<{ item: StoryblokQuickActionItem }> = ({ item }) => {
    const { title: itemTitle, description: itemDescription, icon, link } = item;
    
    // Early return if no link
    if (!link?.cached_url && !link?.url) {
      return null;
    }

    const href = link.cached_url || link.url || '#';
    const target = link.target || '_self';

    return (
      <Link 
        href={href}
        target={target}
        className="bg-[#fafaf0] border border-[#edede1] rounded-lg p-2 flex items-center gap-2 hover:bg-[#f5f5e6] transition-colors"
      >
        {/* Icon container */}
        <div className="flex-shrink-0 w-4 h-4 md:w-9 md:h-9 bg-white rounded-lg flex items-center justify-center p-1 md:p-1">
          {icon?.filename ? (
            <Image
              src={icon.filename}
              alt={icon.alt || itemTitle || 'Icon'}
              width={32}
              height={32}
              className="w-3 h-3 md:w-7 md:h-7 object-contain"
            />
          ) : (
            // Fallback icon grid
            <div className="w-3 h-3 md:w-7 md:h-7 grid grid-cols-3 gap-0.5">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={`fallback-icon-${item._uid}-${i}`} className="bg-[#666674] rounded-sm" />
              ))}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {itemTitle && (
            <Typography 
              type="h3" 
              size="body16" 
              weight="semibold" 
              color="black"
              className="line-clamp-1 mb-1"
            >
              {itemTitle}
            </Typography>
          )}
          {itemDescription && (
            <Typography 
              type="p" 
              size="body14"
              color="gray"
              className="line-clamp-2 md:line-clamp-1"
            >
              {itemDescription}
            </Typography>
          )}
        </div>
        
        {/* Chevron icon */}
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

  return (
    <section className="bg-white w-full py-12">
      <Container>
        <div className="space-y-2 md:space-y-3">
          {/* Section Title */}
          {title && (
            <Typography 
              type="h2" 
              size="body16" 
              weight="bold" 
              color="gray"
              className="mb-2 md:mb-3"
            >
              {title}
            </Typography>
          )}

          {/* Section Description */}
          {description && (
            <Typography 
              type="p" 
              size="body14" 
              color="gray"
              className="mb-2 md:mb-3"
            >
              {description}
            </Typography>
          )}
          
          {/* Dynamic Grid Layout based on variant */}
          <div className={`
            ${variant === 'horizontal'
              ? 'flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-2'
              : variant === 'grid'
              ? 'grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-2'
              : 'flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-2'
            }
          `}>
            {actions.map((item) => (
              <div 
                key={`quick-action-storyblok-${item._uid}`}
                className={variant === 'horizontal' ? 'md:flex-1' : ''}
              >
                <QuickActionItem item={item} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default QuickActionsStoryblok;
