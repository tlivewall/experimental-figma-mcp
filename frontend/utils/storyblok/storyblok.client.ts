import { storyblokInit, apiPlugin, getStoryblokApi } from '@storyblok/react';
import StoryblokClient from 'storyblok-js-client';

// Environment variables
const STORYBLOK_ACCESS_TOKEN = process.env.STORYBLOK_ACCESS_TOKEN || '';
const STORYBLOK_PREVIEW_TOKEN = process.env.STORYBLOK_PREVIEW_TOKEN || '';
const STORYBLOK_VERSION = (process.env.STORYBLOK_VERSION as 'published' | 'draft') || 'published';
const STORYBLOK_REGION = (process.env.STORYBLOK_REGION as 'eu' | 'us' | 'cn') || 'eu';

/**
 * Initialize Storyblok client
 */
export const initStoryblok = () => {
  // Import component mapping dynamically to avoid circular dependencies
  import('../../lib/storyblok-components').then(({ storyblokComponents }) => {
    storyblokInit({
      accessToken: STORYBLOK_ACCESS_TOKEN,
      use: [apiPlugin],
      components: storyblokComponents,
      apiOptions: {
        region: 'eu',
        https: true,
      },
    });
  });
};

/**
 * Custom Storyblok API client for server-side requests
 */
class StoryblokApiClient {
  private api: StoryblokClient;

  constructor() {
    this.api = new StoryblokClient({
      accessToken: STORYBLOK_ACCESS_TOKEN,
      region: 'eu',
      https: true,
    });
  }

  /**
   * Get story by slug or ID
   */
  async get(
    path: string, 
    params: Record<string, any> = {}
  ): Promise<any> {
    try {
      const defaultParams = {
        version: STORYBLOK_VERSION,
        resolve_links: 'url' as const,
        resolve_relations: [],
        ...params,
      };

      const response = await this.api.get(path, defaultParams);
      return response;
    } catch (error) {
      console.error('Storyblok API Error:', error);
      return null;
    }
  }

  /**
   * Get story by full slug
   */
  async getStory(
    slug: string,
    params: Record<string, any> = {}
  ): Promise<any> {
    return this.get(`cdn/stories/${slug}`, params);
  }

  /**
   * Get multiple stories
   */
  async getStories(
    params: Record<string, any> = {}
  ): Promise<any> {
    return this.get('cdn/stories', params);
  }

  /**
   * Get stories by content type
   */
  async getStoriesByType(
    contentType: string,
    params: Record<string, any> = {}
  ): Promise<any> {
    return this.getStories({
      filter_query: {
        component: {
          in: contentType,
        },
      },
      ...params,
    });
  }

  /**
   * Search stories
   */
  async searchStories(
    searchTerm: string,
    params: Record<string, any> = {}
  ): Promise<any> {
    return this.getStories({
      search_term: searchTerm,
      ...params,
    });
  }

  /**
   * Get space info
   */
  async getSpace(): Promise<any> {
    return this.get('cdn/spaces/me');
  }

  /**
   * Get datasource entries
   */
  async getDatasource(
    slug: string,
    params: Record<string, any> = {}
  ): Promise<any> {
    return this.get(`cdn/datasource_entries`, {
      datasource: slug,
      ...params,
    });
  }
}

// Export singleton instance
export const storyblokApi = new StoryblokApiClient();

// Export configuration values for use in other modules
export const storyblokConfig = {
  accessToken: STORYBLOK_ACCESS_TOKEN,
  previewToken: STORYBLOK_PREVIEW_TOKEN,
  version: STORYBLOK_VERSION,
  region: 'eu',
  isPreview: STORYBLOK_VERSION === 'draft',
};
