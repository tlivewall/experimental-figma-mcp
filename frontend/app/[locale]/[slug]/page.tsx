
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getStoryblokApi, StoryblokComponent } from '@storyblok/react';
import { StoryblokBridge } from '@components/storyblok';

interface StoryblokPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generate metadata for Storyblok pages
 */
export async function generateMetadata({ params }: StoryblokPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: 'draft',
    });
    
    return {
      title: data.story.content?.title || data.story.name || 'Page',
      description: data.story.content?.description || '',
    };
  } catch {
    return {
      title: 'Page Not Found',
    };
  }
}

/**
 * Storyblok Dynamic Page Component
 * Handles all content pages from Storyblok CMS within locale context
 * 
 * Routes:
 * - /nl/home → Storyblok story with slug "home"
 * - /en/about → Storyblok story with slug "about"
 * - /nl/contact → Storyblok story with slug "contact"
 * - etc.
 */
export default async function StoryblokPage({ params }: StoryblokPageProps) {
  const { locale, slug } = await params;

  // Get Storyblok API instance
  const storyblokApi = getStoryblokApi();
  let story;

  try {
    // Fetch story from Storyblok
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: 'draft', // Use 'published' for production
      resolve_links: 'url', // Resolve internal links
      resolve_relations: [], // Add relations if needed
      language: locale, // Pass locale for internationalization
    });
    story = data.story;
  } catch (error) {
    console.error(`Error fetching story "${slug}" with locale "${locale}" from Storyblok:`, error);
    notFound();
  }

  // If no story found, show 404
  if (!story) {
    notFound();
  }

  return (
    <>
      {/* Storyblok Bridge for Visual Editor */}
      <StoryblokBridge story={story} />
      
      {/* Render Storyblok content */}
      <StoryblokComponent blok={story.content} />
    </>
  );
}

/**
 * Generate static params for build time (optional)
 * Uncomment and customize if you want to pre-generate specific pages
 */
// export async function generateStaticParams() {
//   const storyblokApi = getStoryblokApi();
//   const locales = ['nl', 'en']; // Add your supported locales
//   
//   try {
//     const { data } = await storyblokApi.get('cdn/stories', {
//       version: 'published',
//       per_page: 100,
//     });
//     
//     const params = [];
//     for (const locale of locales) {
//       for (const story of data.stories) {
//         params.push({
//           locale,
//           slug: story.slug,
//         });
//       }
//     }
//     
//     return params;
//   } catch {
//     return [];
//   }
// }
