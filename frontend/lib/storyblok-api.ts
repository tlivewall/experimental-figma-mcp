import { StoryblokApi, ISbStoryData, ISbStoriesParams } from '@storyblok/react/rsc';

/**
 * Storyblok API Utilities
 * Helper functions for fetching content from Storyblok
 */

// Initialize Storyblok API client
const storyblokApi = new StoryblokApi({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN || '',
  cache: {
    clear: 'auto',
    type: 'memory',
  },
});

/**
 * Fetch a single story by slug
 */
export async function getStoryBySlug(slug: string): Promise<ISbStoryData | null> {
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: process.env.NODE_ENV === 'development' ? 'draft' : 'published',
      resolve_links: 'url',
      resolve_relations: 'page.author',
    });

    return data.story;
  } catch (error) {
    console.error(`Error fetching story with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch multiple stories
 */
export async function getStories(params?: ISbStoriesParams): Promise<ISbStoryData[]> {
  try {
    const { data } = await storyblokApi.get('cdn/stories', {
      version: process.env.NODE_ENV === 'development' ? 'draft' : 'published',
      ...params,
    });

    return data.stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

/**
 * Get all story slugs for static generation
 */
export async function getAllStorySlugs(): Promise<string[]> {
  try {
    const stories = await getStories();
    return stories.map(story => story.full_slug).filter(slug => slug !== 'home');
  } catch (error) {
    console.error('Error fetching story slugs:', error);
    return [];
  }
}

/**
 * Check if we're in Storyblok visual editor
 */
export function isStoryblokPreview(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.search.includes('_storyblok');
}

/**
 * Get preview token from URL
 */
export function getPreviewToken(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('_storyblok');
}

export { storyblokApi };
