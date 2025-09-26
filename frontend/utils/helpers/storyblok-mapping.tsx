/**
 * Storyblok Component Mapping for Dynamic Rendering
 * Used in pages to dynamically render Storyblok components
 */

import React from 'react';

export const storyblokComponentMap: Record<string, React.ComponentType<any>> = {
  // Add components here as they are created
  
  // Example mappings from handoff:
  // faq: Faq,
  // call_to_action_banner: CallToActionBanner,
  // image: Image,
  // intro: Intro,
  // testimonials: Testimonials,
  // stories: Stories,
  // header_default: HeaderDefaultStoryblok,
  // header_home: HeaderHomeStoryblok,
  // usp_card: UspCard,
  // article_card: ArticleCard,
};

/**
 * Get Storyblok component by name
 * Returns the component if found, null otherwise
 */
export function getStoryblokComponent(componentName: string): React.ComponentType<any> | null {
  return storyblokComponentMap[componentName] || null;
}

/**
 * Check if a Storyblok component exists
 */
export function hasStoryblokComponent(componentName: string): boolean {
  return componentName in storyblokComponentMap;
}

/**
 * Get all available Storyblok component names
 */
export function getAvailableStoryblokComponents(): string[] {
  return Object.keys(storyblokComponentMap);
}
