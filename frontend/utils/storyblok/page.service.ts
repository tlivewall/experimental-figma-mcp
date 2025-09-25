import { storyblokApi } from './storyblok.client';
import { StoryblokStory } from '../../types/storyblok';

/**
 * Storyblok Page Service
 * Handles fetching page content and stories
 */

/**
 * Get story by slug with folder fallback
 */
export async function getStoryBySlug(
  slug: string, 
  folder?: string
): Promise<StoryblokStory | null> {
  try {
    // Try direct slug first
    let fullSlug = slug;
    
    // If folder is provided, construct full path
    if (folder) {
      fullSlug = `${folder}/${slug}`;
    }

    const response = await storyblokApi.getStory(fullSlug);
    
    if (response?.data?.story) {
      return response.data.story;
    }

    // If not found and no folder was provided, try common folders
    if (!folder) {
      const commonFolders = ['pages', 'blog', 'articles'];
      
      for (const commonFolder of commonFolders) {
        const folderResponse = await storyblokApi.getStory(`${commonFolder}/${slug}`);
        if (folderResponse?.data?.story) {
          return folderResponse.data.story;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching story by slug:', error);
    return null;
  }
}

/**
 * Get home page story
 */
export async function getHomeStory(): Promise<StoryblokStory | null> {
  try {
    const response = await storyblokApi.getStory('home');
    return response?.data?.story || null;
  } catch (error) {
    console.error('Error fetching home story:', error);
    return null;
  }
}

/**
 * Get multiple stories by content type
 */
export async function getStoriesByType(
  contentType?: string, 
  folder?: string,
  limit?: number
): Promise<StoryblokStory[]> {
  try {
    const params: Record<string, any> = {};
    
    if (contentType) {
      params.filter_query = {
        component: {
          in: contentType,
        },
      };
    }
    
    if (folder) {
      params.starts_with = folder;
    }
    
    if (limit) {
      params.per_page = limit;
    }

    const response = await storyblokApi.getStories(params);
    return response?.data?.stories || [];
  } catch (error) {
    console.error('Error fetching stories by type:', error);
    return [];
  }
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(
  category: string, 
  maxItems?: number
): Promise<StoryblokStory[]> {
  try {
    const params: Record<string, any> = {
      starts_with: 'articles/',
      filter_query: {
        category: {
          in: category,
        },
      },
    };
    
    if (maxItems) {
      params.per_page = maxItems;
    }

    const response = await storyblokApi.getStories(params);
    return response?.data?.stories || [];
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}

/**
 * Get all published articles
 */
export async function getAllArticles(limit?: number): Promise<StoryblokStory[]> {
  try {
    const params: Record<string, any> = {
      starts_with: 'articles/',
      is_startpage: false,
      sort_by: 'first_published_at:desc',
    };
    
    if (limit) {
      params.per_page = limit;
    }

    const response = await storyblokApi.getStories(params);
    return response?.data?.stories || [];
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
}

/**
 * Search stories by term
 */
export async function searchStories(
  searchTerm: string,
  folder?: string,
  limit?: number
): Promise<StoryblokStory[]> {
  try {
    const params: Record<string, any> = {
      search_term: searchTerm,
    };
    
    if (folder) {
      params.starts_with = folder;
    }
    
    if (limit) {
      params.per_page = limit;
    }

    const response = await storyblokApi.getStories(params);
    return response?.data?.stories || [];
  } catch (error) {
    console.error('Error searching stories:', error);
    return [];
  }
}

/**
 * Get story siblings (stories in same folder)
 */
export async function getStorySiblings(
  story: StoryblokStory,
  limit?: number
): Promise<StoryblokStory[]> {
  try {
    // Extract folder path from full_slug
    const pathParts = story.full_slug.split('/');
    const folder = pathParts.slice(0, -1).join('/');
    
    if (!folder) {
      return [];
    }

    const params: Record<string, any> = {
      starts_with: folder,
      excluding_ids: story.id.toString(),
    };
    
    if (limit) {
      params.per_page = limit;
    }

    const response = await storyblokApi.getStories(params);
    return response?.data?.stories || [];
  } catch (error) {
    console.error('Error fetching story siblings:', error);
    return [];
  }
}

/**
 * Get story by ID
 */
export async function getStoryById(id: number): Promise<StoryblokStory | null> {
  try {
    const response = await storyblokApi.getStory(id.toString());
    return response?.data?.story || null;
  } catch (error) {
    console.error('Error fetching story by ID:', error);
    return null;
  }
}
