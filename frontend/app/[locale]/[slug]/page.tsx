
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@components/ui/container/container.component';
import { Typography } from '@components/ui';
import { getStoryBySlug } from '@utils/storyblok';
import { storyblokComponentMap } from '@utils/helpers/storyblok-mapping';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generate metadata for pages
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const storyData = await getStoryBySlug(slug);
  
  if (!storyData?.content.SEO) {
    return {
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} - Page`,
      description: `Page for ${slug}`,
    };
  }

  const seoData = storyData.content.SEO;
  
  return {
    title: seoData.title || `${slug.charAt(0).toUpperCase() + slug.slice(1)} - Page`,
    description: seoData.description || `Page for ${slug}`,
    openGraph: {
      title: seoData.og_title || seoData.title || `${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
      description: seoData.og_description || seoData.description || `Page for ${slug}`,
      images: seoData.og_image ? [{ url: seoData.og_image.filename }] : undefined
    }
  };
}

/**
 * Dynamic Page Component  
 * Renders Storyblok content based on slug
 */
export default async function DynamicPage({ params }: PageProps) {
  const { locale, slug } = await params;

  // Get Storyblok story by slug
  const storyData = await getStoryBySlug(slug);
  
  if (!storyData) {
    // If no Storyblok story found, show 404
    notFound();
  }

  // Render Storyblok content
  const pageContent = Array.isArray(storyData.content.body) 
    ? storyData.content.body 
    : [];

  if (pageContent.length === 0) {
    // Fallback for empty content
    return (
      <div className="min-h-screen py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Typography type="h1" size="h1" weight="bold" className="mb-4">
              {storyData.name || slug.charAt(0).toUpperCase() + slug.slice(1)}
            </Typography>
            <Typography type="p" size="default" className="text-gray-600 mb-4">
              Locale: {locale}
            </Typography>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <Typography type="p" size="default" className="text-yellow-800">
                ⚠️ This story exists in Storyblok but has no content blocks. Add components to the body field in Storyblok.
              </Typography>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      {pageContent.map((contentItem, index) => {
        const Component = storyblokComponentMap[contentItem.component];
        
        if (!Component) {
          // Log missing component for debugging
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
}

/**
 * Generate static params for build time (optional)
 * Uncomment and customize if you want to pre-generate specific pages
 */
// export async function generateStaticParams() {
//   const locales = ['nl', 'en'];
//   const slugs = ['home', 'landing', 'about']; // Add your pages
//   
//   const params = [];
//   for (const locale of locales) {
//     for (const slug of slugs) {
//       params.push({
//         locale,
//         slug,
//       });
//     }
//   }
//   
//   return params;
// }
