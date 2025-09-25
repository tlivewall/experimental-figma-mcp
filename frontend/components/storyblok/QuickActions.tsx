'use client';

import { storyblokEditable } from '@storyblok/react';
import { QuickActions as BaseQuickActions } from '@components/sections';
import { QuickActionItem } from 'types/figma/quick-actions.types';

/**
 * Storyblok Types for Quick Actions Component
 */
interface StoryblokLink {
  url: string;
  linktype?: string;
  target?: string;
  cached_url?: string;
}

interface StoryblokAsset {
  filename: string;
  alt?: string;
  title?: string;
}

interface StoryblokQuickActionItem {
  _uid: string;
  component: 'quick_action_item';
  title: string;
  description: string;
  link: StoryblokLink;
  icon?: StoryblokAsset;
}

interface StoryblokCTAButton {
  _uid: string;
  component: 'cta_button';
  text: string;
  link: StoryblokLink;
}

interface StoryblokQuickActionsBlok {
  _uid: string;
  component: 'quick_actions';
  title: string;
  variant: 'auto' | 'horizontal' | 'grid';
  layout: 'horizontal' | 'vertical';
  quick_action_items: StoryblokQuickActionItem[];
  cta_section?: StoryblokCTAButton[];
}

interface StoryblokQuickActionsProps {
  blok: StoryblokQuickActionsBlok;
}

/**
 * Storyblok Quick Actions Component
 * Adapter between Storyblok CMS and our React component
 */
export function StoryblokQuickActions({ blok }: StoryblokQuickActionsProps) {
  // Transform Storyblok data to our component props
  const items: QuickActionItem[] = blok.quick_action_items?.map(item => ({
    title: item.title || '',
    description: item.description || '',
    href: item.link?.url || '#',
    icon: item.icon?.filename,
  })) || [];

  // Get CTA data if present
  const cta = blok.cta_section?.[0];

  return (
    <div {...storyblokEditable(blok)}>
      <BaseQuickActions
        title={blok.title || 'Quick Actions'}
        items={items}
        variant={blok.variant || 'auto'}
        layout={blok.layout || 'horizontal'}
        ctaText={cta?.text}
        ctaHref={cta?.link?.url}
      />
    </div>
  );
}

/**
 * Sub-component: Quick Action Item
 * This is used within the main component
 */
export function StoryblokQuickActionItem({ blok }: { blok: StoryblokQuickActionItem }) {
  // This component is used internally by the main component
  // We don't need to render anything here as it's handled by the parent
  return null;
}

/**
 * Sub-component: CTA Button  
 * This is used within the main component
 */
export function StoryblokCTAButton({ blok }: { blok: StoryblokCTAButton }) {
  // This component is used internally by the main component
  // We don't need to render anything here as it's handled by the parent
  return null;
}
