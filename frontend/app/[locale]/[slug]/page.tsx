import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStoryBySlug, getStoriesByType } from '@utils/storyblok';
import { storyblokApi } from '@utils/storyblok/storyblok.client';
import { storyblokComponentMap } from '@utils/helpers/storyblok-mapping';
import { StoryblokStory } from 'types/storyblok';

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface StoryblokComponent {
  component: string;
  _uid?: string;
  [key: string]: unknown;
}

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generate metadata for pages with enhanced SEO support
 * ALWAYS fetches fresh data for metadata
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  
  try {
    let storyData;

    // Special handling for 'landing' slug - direct API call with fresh data
    if (slug === 'landing') {
      const response = await storyblokApi.getStory('landing', {
        version: 'draft', // Always get latest version
        cv: Date.now(), // Cache busting parameter
      });
      storyData = response?.data?.story;
    } else {
      storyData = await getStoryBySlug(slug);
    }
    
    if (storyData?.content.SEO) {
      const seoData = storyData.content.SEO;
      
      return {
        title: seoData.title || storyData.name || formatSlugTitle(slug),
        description: seoData.description || `Page for ${slug}`,
        keywords: seoData.keywords,
        openGraph: {
          title: seoData.og_title || seoData.title || storyData.name || formatSlugTitle(slug),
          description: seoData.og_description || seoData.description || `Page for ${slug}`,
          images: seoData.og_image ? [{ url: seoData.og_image.filename }] : undefined,
          locale: locale,
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: seoData.twitter_title || seoData.og_title || seoData.title || formatSlugTitle(slug),
          description: seoData.twitter_description || seoData.og_description || seoData.description,
          images: seoData.twitter_image ? [seoData.twitter_image.filename] : seoData.og_image ? [seoData.og_image.filename] : undefined,
        },
        robots: seoData.robots || 'index, follow',
      };
    }

    // Fallback metadata if no SEO data
    return {
      title: formatSlugTitle(slug),
      description: `Page for ${slug}`,
      openGraph: {
        title: formatSlugTitle(slug),
        description: `Page for ${slug}`,
        locale: locale,
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Error generating metadata for slug:', slug, error);
    
    return {
      title: formatSlugTitle(slug),
      description: `Page for ${slug}`,
    };
  }
}

/**
 * Helper function to format slug as title
 */
function formatSlugTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Clean Dynamic Page Component  
 * Renders Storyblok content with minimal logic
 * ALWAYS fetches fresh data from Storyblok
 */
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    let storyData;

    // Special handling for 'landing' slug - direct API call with fresh data
    if (slug === 'landing') {
      const response = await storyblokApi.getStory('landing', {
        version: 'draft', // Always get latest version (includes published changes)
        cv: Date.now(), // Cache busting parameter
      });
      storyData = response?.data?.story;
      console.log('storyData', storyData);
    } else {
      // For other pages, we'll also force fresh data
      storyData = await getStoryBySlug(slug);
    }
    
    if (!storyData) {
      notFound();
    }

    // Render Storyblok content
    const pageContent = Array.isArray(storyData.content.body) 
      ? storyData.content.body 
      : [];

    return (
      <>
        {pageContent.map((contentItem: StoryblokComponent, index: number) => {
          const Component = storyblokComponentMap[contentItem.component];
          
          if (!Component) {
            console.warn(`Storyblok component "${contentItem.component}" not found in mapping`);
            return null;
          }
          
          return (
            <Component 
              key={contentItem._uid || `component-${index}`} 
              {...contentItem} 
            />
          );
        })}
      </>
    );
    
  } catch (error) {
    console.error('Error loading Storyblok page:', error);
    notFound();
  }
}

/**
 * Generate static params for build time
 * Pre-generates known pages from Storyblok for better performance
 */
export async function generateStaticParams() {
  try {
    const locales = ['nl', 'en'];
    const params = [];

    // Get all published stories that could be top-level pages
    const stories = await getStoriesByType();
    
    // Filter for root-level stories (not in folders)
    const rootStories = stories.filter((story: StoryblokStory) => {
      const pathSegments = story.full_slug.split('/').filter(Boolean);
      return pathSegments.length === 1 && story.slug !== 'home'; // Exclude home as it's handled separately
    });

    // Add common/known pages that might exist - ALWAYS include landing
    const commonSlugs = [
      'landing', // Always generate landing page
      'about', 'contact', 'services', 'blog', 'portfolio', 
      'privacy', 'terms', 'faq', 'support'
    ];

    // Add params for discovered stories
    for (const locale of locales) {
      // Add discovered root stories
      for (const story of rootStories) {
        params.push({
          locale,
          slug: story.slug,
        });
      }

      // Add common pages (even if they don't exist yet)
      for (const slug of commonSlugs) {
        params.push({
          locale,
          slug,
        });
      }
    }

    return params;
    
  } catch (error) {
    console.error('Error generating static params:', error);
    
    // Fallback to common pages if Storyblok fetch fails - ALWAYS include landing
    const locales = ['nl', 'en'];
    const fallbackSlugs = ['landing', 'about', 'contact', 'blog', 'faq'];
    
    const params = [];
    for (const locale of locales) {
      for (const slug of fallbackSlugs) {
        params.push({
          locale,
          slug,
        });
      }
    }
    
    return params;
  }
}