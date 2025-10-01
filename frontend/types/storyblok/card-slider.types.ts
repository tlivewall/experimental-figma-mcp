import { StoryblokComponent } from './base.types';

export interface StoryblokContentCardUsp extends StoryblokComponent {
  component: 'content_card_usp';
  title: string;
  image: { filename: string; alt?: string };
  usps: string; // Textarea field: USP items separated by newlines or semicolons
  primary_button_text: string;
  primary_button_href?: string;
  secondary_button_text: string;
  secondary_button_href?: string;
}

export interface StoryblokCardSlider extends StoryblokComponent {
  component: 'card_slider';
  title: string;
  cards?: StoryblokContentCardUsp[];
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  paddingMobile?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
}


