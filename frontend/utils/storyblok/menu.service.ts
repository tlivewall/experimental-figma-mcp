import { storyblokApi } from './storyblok.client';
import { StoryblokMenu, StoryblokMenuContent, StoryblokMenuItem } from '../../types/storyblok';

/**
 * Storyblok Menu Service
 * Handles fetching navigation and menu data
 */

/**
 * Get main navigation menu data
 */
export async function getMenuData(): Promise<StoryblokMenuContent> {
  try {
    const response = await storyblokApi.getStory('global/navigation');
    
    if (response?.data?.story?.content) {
      return response.data.story.content as StoryblokMenuContent;
    }

    // Fallback: try to get from global config
    const globalResponse = await storyblokApi.getStory('global/config');
    if (globalResponse?.data?.story?.content?.navigation) {
      return globalResponse.data.story.content.navigation as StoryblokMenuContent;
    }

    return {
      header_menu: [],
      footer_menu: [],
    };
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return {
      header_menu: [],
      footer_menu: [],
    };
  }
}

/**
 * Get header menu data
 */
export async function getHeaderMenu(): Promise<StoryblokMenuItem[]> {
  try {
    const menuData = await getMenuData();
    return menuData.header_menu || [];
  } catch (error) {
    console.error('Error fetching header menu:', error);
    return [];
  }
}

/**
 * Get footer menu data
 */
export async function getFooterMenu(): Promise<StoryblokMenuItem[]> {
  try {
    const menuData = await getMenuData();
    return menuData.footer_menu || [];
  } catch (error) {
    console.error('Error fetching footer menu:', error);
    return [];
  }
}

/**
 * Get footer data (complete footer configuration)
 */
export async function getFooterData(): Promise<StoryblokMenu | null> {
  try {
    const response = await storyblokApi.getStory('global/footer');
    return response?.data?.story?.content || null;
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return null;
  }
}

/**
 * Get specific menu by slug
 */
export async function getMenuBySlug(slug: string): Promise<StoryblokMenu | null> {
  try {
    const response = await storyblokApi.getStory(`menus/${slug}`);
    return response?.data?.story?.content || null;
  } catch (error) {
    console.error('Error fetching menu by slug:', error);
    return null;
  }
}

/**
 * Build breadcrumb navigation from story path
 */
export function buildBreadcrumbs(story: any): Array<{ label: string; url: string }> {
  try {
    const breadcrumbs: Array<{ label: string; url: string }> = [];
    
    // Add home
    breadcrumbs.push({
      label: 'Home',
      url: '/',
    });

    // Parse path segments
    const pathSegments = story.full_slug.split('/').filter(Boolean);
    
    // Build breadcrumb chain
    let currentPath = '';
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;
      
      // Don't add the current page as it's not clickable
      if (i < pathSegments.length - 1) {
        breadcrumbs.push({
          label: segment.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          url: currentPath,
        });
      }
    }

    return breadcrumbs;
  } catch (error) {
    console.error('Error building breadcrumbs:', error);
    return [{ label: 'Home', url: '/' }];
  }
}

/**
 * Get site configuration (global settings)
 */
export async function getSiteConfig(): Promise<any> {
  try {
    const response = await storyblokApi.getStory('global/config');
    return response?.data?.story?.content || {};
  } catch (error) {
    console.error('Error fetching site config:', error);
    return {};
  }
}
