import React from 'react';
import Link from 'next/link';
import { QuickActionItemFields } from 'types/figma/quick-actions.types';
import Typography from 'components/ui/typography/typography.component';

type Props = QuickActionItemFields & {
  layout?: 'vertical' | 'horizontal';
  isMobile?: boolean;
};

/**
 * QuickActionItem component for individual quick action cards
 * Supports both vertical and horizontal layouts with responsive design
 */
const QuickActionItem: React.FC<Props> = ({
  title,
  description,
  icon,
  href,
  layout = 'vertical',
  isMobile = false
}) => {
  // Early return for validation
  if (!title) {
    return null;
  }

  const content = (
    <div 
      className={`
        relative border border-[#666674] rounded-[4px] bg-white transition-colors duration-200 hover:bg-gray-50
        ${layout === 'vertical' && !isMobile 
          ? 'flex flex-col gap-2 p-3 w-full' 
          : 'flex items-center gap-3 p-2 pr-2 pl-2.5 min-h-[88px]'
        }
        ${isMobile ? 'gap-3 p-2 pr-2 pl-2.5' : ''}
      `}
    >
      {/* Icon Section */}
      {icon && (
        <div className={`flex-shrink-0 ${isMobile ? 'w-6 h-6' : layout === 'vertical' ? 'w-7 h-7' : 'w-7 h-7'}`}>
          {/* Placeholder for icon - in real implementation, this would be an actual icon */}
          <div className="w-full h-full bg-[#666674] rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">📧</span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className={`flex-1 ${layout === 'vertical' && !isMobile ? 'space-y-0.5' : 'space-y-0.5'}`}>
        <Typography 
          type="h3" 
          size="body16" 
          weight="semibold" 
          color="black"
          className="line-clamp-1"
        >
          {title}
        </Typography>
        
        <Typography 
          type="p" 
          size={isMobile ? "body14" : "body16"} 
          color="gray"
          className="line-clamp-2"
        >
          {description}
        </Typography>
      </div>

      {/* Arrow Icon */}
      <div className="flex-shrink-0 w-3 h-3 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-[#666674] text-sm">→</span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full">
        {content}
      </Link>
    );
  }

  return content;
};

export default QuickActionItem;
