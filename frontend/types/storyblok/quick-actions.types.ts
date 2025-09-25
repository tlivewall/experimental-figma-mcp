import { StoryblokComponent, StoryblokAsset, StoryblokLink } from './base.types';

/**
 * Quick Actions component for Storyblok
 */

export interface StoryblokQuickActionItem extends StoryblokComponent {
  component: 'quick_action_item';
  title?: string;
  description?: string;
  icon?: StoryblokAsset;
  link?: StoryblokLink;
}

export interface StoryblokQuickActions extends StoryblokComponent {
  component: 'quick_actions';
  title?: string;
  description?: string;
  actions?: StoryblokQuickActionItem[];
}
