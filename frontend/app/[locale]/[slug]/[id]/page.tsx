import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Container from '@components/ui/container/container.component';
import { Typography } from '@components/ui';
import { getStoryBySlug, getStoriesByType, buildBreadcrumbs } from '@utils/storyblok';
import { storyblokComponentMap } from '@utils/helpers/storyblok-mapping';
import { StoryblokStory } from 'types/storyblok';

interface NestedPageProps {
  params: Promise<{
    locale: string;
    slug: string;
    id: string;
  }>;
}

/**
 * Generate metadata for nested pages with enhanced SEO support
 */
export async function generateMetadata({ params }: NestedPageProps): Promise<Metadata> {
  const { slug, id, locale } = await params;
  
  try {
    // Try full path first: slug/id
    const fullPath = `${slug}/${id}`;
    const storyData = await getStoryBySlug(fullPath);
    
    if (storyData?.content.SEO) {
      const seoData = storyData.content.SEO;
      
      return {
        title: seoData.title || storyData.name || formatSlugTitle(id),
        description: seoData.description || `${formatSlugTitle(slug)} - ${formatSlugTitle(id)}`,
        keywords: seoData.keywords,
        openGraph: {
          title: seoData.og_title || seoData.title || storyData.name || formatSlugTitle(id),
          description: seoData.og_description || seoData.description || `${formatSlugTitle(slug)} - ${formatSlugTitle(id)}`,
          images: seoData.og_image ? [{ url: seoData.og_image.filename }] : undefined,
          locale: locale,
          type: 'article',
        },
        twitter: {
          card: 'summary_large_image',
          title: seoData.twitter_title || seoData.og_title || seoData.title || formatSlugTitle(id),
          description: seoData.twitter_description || seoData.og_description || seoData.description,
          images: seoData.twitter_image ? [seoData.twitter_image.filename] : seoData.og_image ? [seoData.og_image.filename] : undefined,
        },
        robots: seoData.robots || 'index, follow',
      };
    }

    // Fallback metadata if no SEO data
    return {
      title: `${formatSlugTitle(id)} - ${formatSlugTitle(slug)}`,
      description: `${formatSlugTitle(slug)} - ${formatSlugTitle(id)}`,
      openGraph: {
        title: `${formatSlugTitle(id)} - ${formatSlugTitle(slug)}`,
        description: `${formatSlugTitle(slug)} - ${formatSlugTitle(id)}`,
        locale: locale,
        type: 'article',
      },
    };
  } catch (error) {
    console.error('Error generating metadata for nested page:', slug, id, error);
    
    return {
      title: `${formatSlugTitle(id)} - ${formatSlugTitle(slug)}`,
      description: `${formatSlugTitle(slug)} - ${formatSlugTitle(id)}`,
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
 * Enhanced Nested Page Component  
 * Renders Storyblok content for nested routes (e.g., blog/my-post, portfolio/project-1)
 */
export default async function NestedPage({ params }: NestedPageProps) {
  const { locale, slug, id } = await params;

  try {
    // Try full path first: slug/id
    const fullPath = `${slug}/${id}`;
    const storyData = await getStoryBySlug(fullPath);
    
    if (!storyData) {
      // Try alternative folder structures
      const alternativePaths = [
        `${slug}/${id}`,
        `pages/${slug}/${id}`,
        `content/${slug}/${id}`,
        `articles/${id}`, // For blog posts that might be directly in articles folder
        `blog/${id}`,    // For blog posts
        `portfolio/${id}`, // For portfolio items
      ];
      
      for (const path of alternativePaths) {
        const altStory = await getStoryBySlug(path);
        if (altStory) {
          return renderNestedStoryContent(altStory, locale, slug, id);
        }
      }
      
      // Show helpful 404 page with suggestions
      return <NestedNotFoundPage slug={slug} id={id} locale={locale} />;
    }

    return renderNestedStoryContent(storyData, locale, slug, id);
    
  } catch (error) {
    console.error('Error loading nested Storyblok page:', error);
    return <NestedErrorPage slug={slug} id={id} locale={locale} error={error} />;
  }
}

/**
 * Render nested story content with components
 */
function renderNestedStoryContent(storyData: StoryblokStory, locale: string, slug: string, id: string) {
  const pageContent = Array.isArray(storyData.content.body) 
    ? storyData.content.body 
    : [];

  // Show breadcrumbs for nested pages
  const breadcrumbs = buildBreadcrumbs(storyData);

  if (pageContent.length === 0) {
    return <NestedEmptyContentPage storyData={storyData} locale={locale} slug={slug} id={id} breadcrumbs={breadcrumbs} />;
  }

  return (
    <>
      {/* Breadcrumbs */}
      <section className="bg-gray-50 py-2">
        <Container>
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.url} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-600">{crumb.label}</span>
                ) : (
                  <Link href={crumb.url} className="text-blue-600 hover:text-blue-800">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </Container>
      </section>

      {/* Story Components */}
      {pageContent.map((contentItem, index) => {
        const Component = storyblokComponentMap[contentItem.component];
        
        if (!Component) {
          console.warn(`Storyblok component "${contentItem.component}" not found in mapping`);
          
          // Show debug component in development
          if (process.env.NODE_ENV === 'development') {
            return (
              <div key={`missing-${index}`} className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
                <Typography type="p" size="default" className="text-red-800">
                  ⚠️ Missing component: <code>{contentItem.component}</code>
                </Typography>
                <details className="mt-2">
                  <summary className="cursor-pointer text-red-600">Component Data</summary>
                  <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                    {JSON.stringify(contentItem, null, 2)}
                  </pre>
                </details>
              </div>
            );
          }
          
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
}

/**
 * Empty Content Page Component for nested pages
 */
function NestedEmptyContentPage({ 
  storyData, 
  locale, 
  slug,
  id,
  breadcrumbs 
}: { 
  storyData: StoryblokStory; 
  locale: string; 
  slug: string;
  id: string;
  breadcrumbs: Array<{ label: string; url: string }>;
}) {
  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm mb-6">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.url} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                <Link href={crumb.url} className="text-blue-600 hover:text-blue-800">
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>

          <Typography type="h1" size="h1" weight="bold" className="mb-4">
            {storyData.name || formatSlugTitle(id)}
          </Typography>
          
          <div className="space-y-4">
            <Typography type="p" size="default" className="text-gray-600">
              Category: {formatSlugTitle(slug)} | Locale: {locale} | Story ID: {storyData.id}
            </Typography>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Typography type="p" size="default" className="text-yellow-800 mb-2">
                ⚠️ This nested story exists in Storyblok but has no content blocks.
              </Typography>
              <Typography type="p" size="default" className="text-yellow-700">
                Add components to the <strong>body</strong> field in Storyblok to display content here.
              </Typography>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="p-4 bg-gray-50 rounded-lg">
                <summary className="cursor-pointer font-medium">Debug: Story Data</summary>
                <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                  {JSON.stringify(storyData, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

/**
 * Not Found Page Component for nested routes
 */
function NestedNotFoundPage({ slug, id, locale }: { slug: string; id: string; locale: string }) {
  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <Typography type="h1" size="h1" weight="bold" className="mb-4">
            Page Not Found
          </Typography>
          
          <Typography type="p" size="default" className="text-gray-600 mb-6">
            The page "{formatSlugTitle(slug)} / {formatSlugTitle(id)}" could not be found in Storyblok.
          </Typography>

          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 mb-8">
            <Typography type="h3" size="default" weight="bold" className="text-blue-800 mb-3">
              📝 Content Creator Instructions
            </Typography>
            
            <div className="text-left space-y-2 text-blue-700">
              <Typography type="p" size="default">
                1. Go to your Storyblok space
              </Typography>
              <Typography type="p" size="default">
                2. Create a folder structure: <code className="bg-blue-100 px-1 rounded">{slug}/</code>
              </Typography>
              <Typography type="p" size="default">
                3. Create a story with slug: <code className="bg-blue-100 px-1 rounded">{slug}/{id}</code>
              </Typography>
              <Typography type="p" size="default">
                4. Add components to the body field
              </Typography>
              <Typography type="p" size="default">
                5. Publish the story
              </Typography>
            </div>
          </div>

          <div className="space-x-4">
            <Link 
              href={`/${locale}/${slug}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Typography type="span" size="default" weight="bold" className="text-white">
                Go to {formatSlugTitle(slug)}
              </Typography>
            </Link>
            
            <Link 
              href={`/${locale}`}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Typography type="span" size="default" weight="bold">
                Go Home
              </Typography>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

/**
 * Error Page Component for nested routes
 */
function NestedErrorPage({ 
  slug, 
  id,
  locale, 
  error 
}: { 
  slug: string; 
  id: string;
  locale: string; 
  error: any;
}) {
  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <Typography type="h1" size="h1" weight="bold" className="mb-4">
            Something Went Wrong
          </Typography>
          
          <Typography type="p" size="default" className="text-gray-600 mb-6">
            There was an error loading "{formatSlugTitle(slug)} / {formatSlugTitle(id)}".
          </Typography>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-8">
            <Typography type="p" size="default" className="text-red-800">
              🚨 Error: {error?.message || 'Unknown error occurred'}
            </Typography>
          </div>

          <Link 
            href={`/${locale}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Typography type="span" size="default" weight="bold" className="text-white">
              Go Home
            </Typography>
          </Link>
        </div>
      </Container>
    </div>
  );
}

/**
 * Generate static params for nested pages
 * Pre-generates known nested pages from Storyblok
 */
export async function generateStaticParams() {
  try {
    const locales = ['nl', 'en'];
    const params = [];

    // Get all published stories with folder structure
    const stories = await getStoriesByType();
    
    // Filter for nested stories (folder/item structure)
    const nestedStories = stories.filter((story: StoryblokStory) => {
      const pathSegments = story.full_slug.split('/').filter(Boolean);
      return pathSegments.length === 2; // Only two-level nesting for [slug]/[id]
    });

    // Add params for discovered nested stories
    for (const locale of locales) {
      for (const story of nestedStories) {
        const pathSegments = story.full_slug.split('/').filter(Boolean);
        if (pathSegments.length === 2) {
          params.push({
            locale,
            slug: pathSegments[0],
            id: pathSegments[1],
          });
        }
      }
    }

    // Add common nested page structures that might exist
    const commonStructures = [
      { slug: 'blog', ids: ['getting-started', 'latest-updates', 'tips-tricks'] },
      { slug: 'portfolio', ids: ['project-1', 'project-2', 'case-study'] },
      { slug: 'articles', ids: ['introduction', 'advanced-guide'] },
      { slug: 'docs', ids: ['setup', 'configuration', 'deployment'] },
    ];

    for (const locale of locales) {
      for (const structure of commonStructures) {
        for (const id of structure.ids) {
          params.push({
            locale,
            slug: structure.slug,
            id,
          });
        }
      }
    }

    return params;
    
  } catch (error) {
    console.error('Error generating static params for nested pages:', error);
    
    // Fallback to common nested structures
    const locales = ['nl', 'en'];
    const fallbackStructures = [
      { slug: 'blog', ids: ['first-post'] },
      { slug: 'portfolio', ids: ['example-project'] },
    ];
    
    const params = [];
    for (const locale of locales) {
      for (const structure of fallbackStructures) {
        for (const id of structure.ids) {
          params.push({
            locale,
            slug: structure.slug,
            id,
          });
        }
      }
    }
    
    return params;
  }
}
