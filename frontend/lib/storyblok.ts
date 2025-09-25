import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';

/**
 * Storyblok Configuration
 * Initializes Storyblok with React components and plugins
 */

// Import Storyblok components
import { StoryblokQuickActions, StoryblokQuickActionItem, StoryblokCTAButton } from '@/components/storyblok/QuickActions';

const components = {
  'quick_actions': StoryblokQuickActions,
  'quick_action_item': StoryblokQuickActionItem,
  'cta_button': StoryblokCTAButton,
  // Add more components here as we build them
};

storyblokInit({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components,
  apiOptions: {
    region: 'eu', // Pas aan als je een andere regio gebruikt
  },
});

export { components };
