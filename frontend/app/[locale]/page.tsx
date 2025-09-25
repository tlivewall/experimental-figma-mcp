import type { NextPage } from 'next';
import Link from 'next/link';
import Container from '@components/ui/container/container.component';
import { getDictionary } from './dictionaries';
import { Typography } from '@components/ui';

type Props = {
  params: Promise<{ locale: string }>;
};

const Home: NextPage<Props> = async ({ params: asyncParams }) => {
  const params = await asyncParams;
  const { locale } = params;

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
        </div>
      </Container>
    </div>
  );
};

export default Home;
