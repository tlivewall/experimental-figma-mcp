import type { NextPage, Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Container from '@components/ui/container/container.component';
import { getDictionary } from './dictionaries';
import { Typography } from '@components/ui';
import { getHomeStory } from '@utils/storyblok';
import { storyblokComponentMap } from '@utils/helpers/storyblok-mapping';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Generate metadata for homepage
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const storyData = await getHomeStory();
  
  if (!storyData?.content.SEO) {
    return {
      title: 'Home',
      description: 'Welcome to our website',
    };
  }

  const seoData = storyData.content.SEO;
  
  return {
    title: seoData.title || 'Home',
    description: seoData.description || 'Welcome to our website',
    openGraph: {
      title: seoData.og_title || seoData.title || 'Home',
      description: seoData.og_description || seoData.description || 'Welcome to our website',
      images: seoData.og_image ? [{ url: seoData.og_image.filename }] : undefined
    }
  };
}

const Home: NextPage<Props> = async ({ params: asyncParams }) => {
  const params = await asyncParams;
  const { locale } = params;

  // Try to get Storyblok content first
  const storyData = await getHomeStory();
  
  if (storyData?.content.body) {
    // Render Storyblok content
    const pageContent = Array.isArray(storyData.content.body) 
      ? storyData.content.body 
      : [];

    return (
      <>
        {pageContent.map((contentItem, index) => {
          const Component = storyblokComponentMap[contentItem.component];
          return Component 
            ? <Component key={contentItem._uid || `component-${index}`} {...contentItem} />
            : null;
        })}
      </>
    );
  }

  // Fallback to dictionary content if no Storyblok story
  const dict = await getDictionary(locale);
  return (
    <div>
      <Container>
        <div className="text-center my-4">
          <Typography type="h1" size="h1" mobileSize="h2" weight="bold" className="mb-2 text-primary">
            {dict.common.title}
          </Typography>
          <Typography type="h2" size="default">
            {dict.common.description}
          </Typography>
          
          {/* Component Playground Link */}
          <div className="mt-8">
            <Link 
              href={`/${locale}/playground`}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Typography type="span" size="default" weight="bold" className="text-white">
                View Component Playground
              </Typography>
              <svg 
                className="ml-2 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          </div>
          
          {/* Storyblok Notice */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <Typography type="p" size="default" className="text-blue-800">
              💡 Storyblok is ready! Create a "home" story in Storyblok to replace this content.
            </Typography>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
