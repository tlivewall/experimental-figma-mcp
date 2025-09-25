'use client';

import { storyblokInit, apiPlugin } from '@storyblok/react';
import { ReactNode } from 'react';

// Import Storyblok components
import { StoryblokQuickActions, StoryblokQuickActionItem, StoryblokCTAButton } from './QuickActions';

const components = {
  'quick_actions': StoryblokQuickActions,
  'quick_action_item': StoryblokQuickActionItem,
  'cta_button': StoryblokCTAButton,
  // Add more components here
};

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components,
  apiOptions: {
    region: 'eu',
  },
});

interface StoryblokProviderProps {
  children: ReactNode;
}

/**
 * Storyblok Provider Component
 * Wraps the app to enable Storyblok functionality
 */
export function StoryblokProvider({ children }: StoryblokProviderProps) {
  return <>{children}</>;
}
