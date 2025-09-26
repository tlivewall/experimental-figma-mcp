import { StoryblokComponent, StoryblokAsset, StoryblokLink } from './base.types';

export interface StoryblokQuickActionItem extends StoryblokComponent {
  component: 'quick_action_item';
  title: string;
  description: string;
  icon?: StoryblokAsset;
  link?: StoryblokLink;
}

export interface StoryblokQuickActions extends StoryblokComponent {
  component: 'quick_actions';
  title: string;
  items: StoryblokQuickActionItem[];
  layout?: 'vertical' | 'horizontal';
  show_more_button?: boolean;
  more_button_text?: string;
  more_button_link?: StoryblokLink;
}
