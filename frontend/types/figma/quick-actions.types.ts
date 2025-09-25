/**
 * Quick Actions Component Types
 * Based on Figma AI workflow acceleration designs
 */

/** Individual Quick Action Item */
export interface QuickActionItem {
  /** Display title for the action */
  title: string;
  /** Description text for the action */
  description: string;
  /** URL link for the action */
  href: string;
  /** Optional icon identifier or URL */
  icon?: string;
}

/** Main Quick Actions Component Props */
export interface QuickActionsProps {
  /** Section title */
  title: string;
  /** Array of action items to display */
  items: QuickActionItem[];
  /** Optional CTA button text */
  ctaText?: string;
  /** Optional CTA button URL */
  ctaHref?: string;
  
  /** Layout variant - controls overall grid structure */
  variant?: 'horizontal' | 'grid' | 'auto';
  /** Item layout style - controls individual card appearance */
  layout?: 'horizontal' | 'vertical';
  /** View mode for responsive control */
  view?: 'desktop' | 'mobile' | 'auto';
}

/** Supported layout combinations */
export type QuickActionsLayoutCombination = 
  | { variant: 'horizontal'; layout: 'vertical' }    // Desktop flex-wrap with vertical cards
  | { variant: 'grid'; layout: 'horizontal' }       // Desktop grid with horizontal cards
  | { variant: 'auto'; layout: 'horizontal' }       // Mobile vertical stack
  | { variant: 'auto'; layout: 'vertical' };        // Auto-detect best layout
